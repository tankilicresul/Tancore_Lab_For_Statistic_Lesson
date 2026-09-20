/**
 * Tanco AI Service
 * Connects Tanco to Google Gemini LLMs via secure serverless proxy (/api/tanco-chat) or direct fallback.
 * Supports text, chat memory, and multimodal image question solving.
 */

import { ALL_MODULES } from '../data/modules';

export interface ChatMessageHistoryItem {
  role: 'user' | 'model' | 'assistant';
  content: string;
}

/**
 * Generate a concise curriculum summary of all 16 modules for internal knowledge.
 */
function buildCurriculumContext(): string {
  return ALL_MODULES.map((m, idx) => {
    const lessonsList = (m.lessons || []).map((l, lIdx) => `${lIdx + 1}. ${l.title?.tr || ''} (${l.title?.en || ''})`).join(' | ');
    const caseTitles = (m.caseExams || []).map((c) => c.title?.tr || '').filter(Boolean).join(' | ') || 'Vaka Sınavı';
    const desc = m.description?.tr || m.title?.tr || '';
    return `[Modül ${idx + 1} - ID: ${m.id}]: "${m.title?.tr || ''}" (${m.title?.en || ''})
  - Özet: ${desc}
  - Ders İçerikleri: ${lessonsList}
  - Vaka Sınavı: ${caseTitles}`;
  }).join('\n\n');
}

const CURRICULUM_SUMMARY = buildCurriculumContext();

/**
 * Panoramic Application Scanner & Knowledge Retriever
 * Scans the entire application (all 16 modules, all lessons, all case exam datasets/tables)
 * to answer any specific question about any module, topic, formula, company case, or dataset table,
 * even when the student is not on that screen.
 */
export function scanAndRetrieveAppKnowledge(query: string, language: 'tr' | 'en' = 'tr'): string | null {
  const q = query.toLowerCase().trim();

  // 1. Detect explicit Module Number: "modül 4", "4. modül", "module 4", "m4"
  const moduleMatch = q.match(/(?:mod[uü]l|module)\s*(\d{1,2})|(\d{1,2})\.\s*(?:mod[uü]l|module)|\bm(\d{1,2})\b/i);
  const targetModNum = moduleMatch ? parseInt(moduleMatch[1] || moduleMatch[2] || moduleMatch[3], 10) : null;

  // 2. Detect explicit Lesson Number: "ders 2", "2. ders", "lesson 2", "konu 3", "3. konu"
  const lessonMatch = q.match(/(?:ders|lesson|konu)\s*(\d{1,2})|(\d{1,2})\.\s*(?:ders|lesson|konu)/i);
  const targetLesNum = lessonMatch ? parseInt(lessonMatch[1] || lessonMatch[2], 10) : null;

  // 3. Detect Case Exam / Dataset / Table request
  const wantsCaseOrTable =
    q.includes('vaka') ||
    q.includes('case') ||
    q.includes('tablo') ||
    q.includes('veri seti') ||
    q.includes('dataset') ||
    q.includes('sütun') ||
    q.includes('kolon') ||
    q.includes('satır') ||
    q.includes('table');

  // If specific module is referenced
  if (targetModNum && targetModNum >= 1 && targetModNum <= ALL_MODULES.length) {
    const mod = ALL_MODULES[targetModNum - 1];
    const modTitle = language === 'tr' ? mod.title?.tr : mod.title?.en;

    // A) If looking for specific lesson in this module
    if (targetLesNum && mod.lessons && mod.lessons.length >= targetLesNum) {
      const les = mod.lessons[targetLesNum - 1];
      const lesTitle = language === 'tr' ? les.title?.tr : les.title?.en;
      const concept = language === 'tr' ? les.conceptCard?.tr : les.conceptCard?.en;
      const company = language === 'tr' ? les.companyExample?.tr : les.companyExample?.en;

      let result = `📍 **Modül ${targetModNum}: ${modTitle}**\n📚 **${targetLesNum}. Ders: ${lesTitle}**\n\n📖 **Konu Anlatımı / Kavram Kartı:**\n${concept}\n\n🏢 **Gerçek Şirket Örneği:**\n${company}`;

      if (les.vocabTerms && les.vocabTerms.length > 0) {
        result += `\n\n💡 **Önemli Terimler & Kavramlar:**\n` + les.vocabTerms.map((v) => `- **${v.term_en}:** ${language === 'tr' ? v.explanation_tr : v.explanation_en}`).join('\n');
      }

      if (les.questions && les.questions.length > 0) {
        const q1 = les.questions[0];
        const pText = language === 'tr' ? q1.prompt?.tr || q1.prompt : q1.prompt?.en || q1.prompt;
        const ans = q1.correctAnswer;
        const exp = language === 'tr' ? q1.explanation?.tr || q1.explanation : q1.explanation?.en || q1.explanation;
        result += `\n\n📝 **Kavrama Sorusu & Çözüm:**\n- **Soru:** ${pText}\n- **Doğru Cevap:** \`${ans}\`\n- **Çözüm:** ${exp}`;
      }

      return result;
    }

    // B) If looking for Case Exam / Table / Dataset in this module
    if (wantsCaseOrTable && mod.caseExams && mod.caseExams.length > 0) {
      const casesText = mod.caseExams.map((c, cIdx) => {
        const cTitle = language === 'tr' ? c.title?.tr : c.title?.en;
        const bQuestion = language === 'tr' ? c.businessQuestion?.tr : c.businessQuestion?.en;
        const expApproach = language === 'tr' ? c.expectedApproach?.tr : c.expectedApproach?.en;

        let tableMd = '';
        if (c.dataset && Array.isArray(c.dataset.columns) && Array.isArray(c.dataset.rows)) {
          tableMd = `\n\n📊 **Vaka Veri Seti / Tablo:**\n| ` + c.dataset.columns.join(' | ') + ' |\n| ' + c.dataset.columns.map(() => '---').join(' | ') + ' |\n';
          tableMd += c.dataset.rows.slice(0, 10).map((row) => '| ' + row.join(' | ') + ' |').join('\n');
          if (c.dataset.rows.length > 10) {
            tableMd += `\n*(Toplam ${c.dataset.rows.length} satır)*`;
          }
        }

        return `🏢 **${cIdx + 1}. Vaka Sınavı: ${cTitle}**\n📌 **İş Problemi / Soru:** ${bQuestion}${tableMd}\n🔍 **Yönetici Yaklaşımı:** ${expApproach}`;
      }).join('\n\n---\n\n');

      return `📍 **Modül ${targetModNum}: ${modTitle} — Vaka Sınavları & Veri Tabloları:**\n\n${casesText}`;
    }

    // C) Return entire module overview with all lessons and case summaries
    const lessonsList = (mod.lessons || []).map((l, i) => `${i + 1}. ${language === 'tr' ? l.title?.tr : l.title?.en}`).join('\n');
    const casesList = (mod.caseExams || []).map((c, i) => `${i + 1}. ${language === 'tr' ? c.title?.tr : c.title?.en}`).join('\n');

    return `📍 **Modül ${targetModNum}: ${modTitle}**\n📝 **Özet:** ${language === 'tr' ? mod.description?.tr || mod.title?.tr : mod.description?.en || mod.title?.en}\n\n📚 **Dersler:**\n${lessonsList}\n\n🏢 **Vaka Sınavları:**\n${casesList || 'Vaka sınavı hazırlanıyor.'}`;
  }

  // 4. Keyword search across Case Exam Datasets (Tables) & Lesson Titles
  for (const mod of ALL_MODULES) {
    for (const c of mod.caseExams || []) {
      const cTitle = (c.title?.tr || '') + ' ' + (c.title?.en || '');
      const bQuestion = (c.businessQuestion?.tr || '') + ' ' + (c.businessQuestion?.en || '');
      const cols = (c.dataset?.columns || []).join(' ');

      const searchWords = q.split(/[\s,?.!]+/).filter((w) => w.length > 3);
      const isMatch = searchWords.some((w) => cTitle.toLowerCase().includes(w) || cols.toLowerCase().includes(w) || bQuestion.toLowerCase().includes(w));
      
      if (isMatch && c.dataset && c.dataset.columns) {
        let tableMd = `| ` + c.dataset.columns.join(' | ') + ' |\n| ' + c.dataset.columns.map(() => '---').join(' | ') + ' |\n';
        tableMd += c.dataset.rows.slice(0, 10).map((row) => '| ' + row.join(' | ') + ' |').join('\n');

        return `📍 **Bulunan Modül / Vaka: ${language === 'tr' ? mod.title?.tr : mod.title?.en} — ${language === 'tr' ? c.title?.tr : c.title?.en}**\n\n📌 **İş Problemi:** ${language === 'tr' ? c.businessQuestion?.tr : c.businessQuestion?.en}\n\n📊 **İlgili Veri Seti / Tablo:**\n${tableMd}\n\n🔍 **Çözüm & Yaklaşım:** ${language === 'tr' ? c.expectedApproach?.tr : c.expectedApproach?.en}`;
      }
    }
  }

  return null;
}



export function getQuotaExceededMessage(lang: 'tr' | 'en' = 'tr', delaySeconds?: number): string {
  const waitSecs = delaySeconds && delaySeconds > 0 ? Math.ceil(delaySeconds) : 60;
  const resetDate = new Date(Date.now() + waitSecs * 1000);
  const hours = String(resetDate.getHours()).padStart(2, '0');
  const minutes = String(resetDate.getMinutes()).padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  if (lang === 'tr') {
    return `⏳ **Şimdilik sohbet sınırına ulaştınız.**\n\nKotanız saat **${timeStr}**'de yenilenecektir. O saatte tekrar soru sorabilirsiniz. Anlayışınız için teşekkürler! 🎓✨`;
  } else {
    return `⏳ **You have reached the chat limit for now.**\n\nYour quota will reset at **${timeStr}**. You can ask questions again at that time. Thank you for your patience! 🎓✨`;
  }
}

export async function askTancoAI(
  userPrompt: string,
  history: ChatMessageHistoryItem[] = [],
  language: 'tr' | 'en' = 'tr',
  studentName: string = 'Öğrenci',
  imageBase64?: string,
  imageMimeType?: string,
  studyContext?: any,
  studentEmail?: string
): Promise<string> {
  // Panoramic Application Scan: Look up any referenced module, lesson, or case table
  const retrievedInfo = scanAndRetrieveAppKnowledge(userPrompt, language);
  const enhancedStudyContext = {
    ...studyContext,
    retrievedAppContext: retrievedInfo || studyContext?.retrievedAppContext,
  };

  // 1. Try secure Serverless Function first (/api/tanco-chat)
  try {
    const serverlessRes = await fetch('/api/tanco-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: userPrompt,
        history,
        language,
        studentName,
        studentEmail,
        imageBase64,
        imageMimeType,
        studyContext: enhancedStudyContext,
      }),
    });

    if (serverlessRes.ok) {
      const data = await serverlessRes.json();
      if (data?.text) {
        return data.text;
      }
    } else if (serverlessRes.status === 429) {
      return getQuotaExceededMessage(language, 60);
    }
  } catch (err) {
    // Serverless endpoint might be offline or standalone dev mode
  }

  // 2. Offline / Deterministic pedagogical curriculum knowledge base fallback
  return getNoKeyFallback(userPrompt, language, studentName, enhancedStudyContext);
}

/**
 * Fallback response if API key is not configured or offline
 */
/**
 * Comprehensive Pedagogical Curriculum Knowledge Base Engine
 * Allows Tanco to answer any course concept, formula, question, or industrial case from internal deterministic memory,
 * even if external API limits/quotas are exhausted.
 */
export function searchCurriculumKnowledge(
  query: string,
  language: 'tr' | 'en' = 'tr',
  studentName: string = 'Öğrenci',
  studyContext?: any
): string | null {
  const q = query.toLowerCase().trim();

  // 1. Check Active Screen Context (Lesson or Case Exam)
  if (studyContext) {
    const isAskingForSolution =
      q.includes('bu sorunun') ||
      q.includes('sorunun cevabı') ||
      q.includes('cevabı nedir') ||
      q.includes('cevap ne') ||
      q.includes('nasıl çözülür') ||
      q.includes('çözümü') ||
      q.includes('nasıl yaparım') ||
      q.includes('ipucu') ||
      q.includes('doğru cevap') ||
      q.includes('soruyu açıkla') ||
      q.includes('solution') ||
      q.includes('answer');

    if (isAskingForSolution) {
      if (studyContext.type === 'lesson' && Array.isArray(studyContext.questions) && studyContext.questions.length > 0) {
        const firstQ = studyContext.questions[0];
        const promptText = typeof firstQ.prompt === 'string' ? firstQ.prompt : firstQ.prompt?.tr || firstQ.prompt?.en || '';
        const ansText = String(firstQ.correctAnswer ?? '');
        const expText = typeof firstQ.explanation === 'string' ? firstQ.explanation : firstQ.explanation?.tr || firstQ.explanation?.en || '';

        return language === 'tr'
          ? `🎯 **Ekrandaki Alıştırma Sorusu ve Çözümü:**\n\n📌 **Soru:** ${promptText}\n\n✅ **Doğru Cevap:** \`${ansText}\`\n\n💡 **Adım Adım Çözüm / Açıklama:**\n${expText}\n\n*(Dahili TanCoreLab Ders Hafızası)*`
          : `🎯 **Active Exercise Question & Solution:**\n\n📌 **Question:** ${promptText}\n\n✅ **Correct Answer:** \`${ansText}\`\n\n💡 **Step-by-Step Explanation:**\n${expText}`;
      }

      if (studyContext.type === 'caseExam' && Array.isArray(studyContext.solutionQuestions) && studyContext.solutionQuestions.length > 0) {
        const qList = studyContext.solutionQuestions
          .slice(0, 3)
          .map((sq: any, i: number) => `**${i + 1}. Soru:** ${sq.prompt}\n- **Doğru Cevap:** \`${sq.correctAnswer}\`\n- **Açıklama:** ${sq.explanation}`)
          .join('\n\n');

        return language === 'tr'
          ? `🎯 **${studyContext.caseTitle || 'Vaka Sınavı'} Çözüm Rehberi:**\n\n${qList}\n\n🔍 **Beklenen Yönetici Yaklaşımı:**\n${studyContext.expectedApproach || ''}`
          : `🎯 **Case Exam Solution Guide:**\n\n${qList}`;
      }
    }

    // Active lesson summary
    if (
      q.includes('özetle') ||
      q.includes('ne anlatıyor') ||
      q.includes('konuyu anlat') ||
      q.includes('özet') ||
      q.includes('açıkla') ||
      q.includes('bu ders') ||
      q.includes('kavram')
    ) {
      if (studyContext.type === 'lesson' && studyContext.lessonTitle) {
        let text = language === 'tr'
          ? `📖 **${studyContext.lessonTitle} — Konu Özeti:**\n\n${studyContext.conceptCard || ''}\n\n🏢 **Gerçek Şirket Örneği:**\n${studyContext.companyExample || ''}`
          : `📖 **${studyContext.lessonTitle} — Summary:**\n\n${studyContext.conceptCard || ''}\n\n🏢 **Real-World Case:**\n${studyContext.companyExample || ''}`;

        if (studyContext.vocabTerms && studyContext.vocabTerms.length > 0) {
          text += language === 'tr' ? `\n\n💡 **Önemli Terimler:**\n${studyContext.vocabTerms.join('\n')}` : `\n\n💡 **Key Terms:**\n${studyContext.vocabTerms.join('\n')}`;
        }
        return text;
      }
    }
  }

  // 2. Comprehensive Core Topics Index (Deterministic Knowledge)
  const CORE_TOPICS: { keywords: string[]; title: { tr: string; en: string }; content: { tr: string; en: string } }[] = [
    {
      keywords: ['bayes', 'kosullu', 'koşullu olasılık', 'prior', 'posterior', 'likelihood', 'olabilirlik'],
      title: { tr: 'Bayes Kuralı & Koşullu Olasılık', en: "Bayes' Theorem & Conditional Probability" },
      content: {
        tr: `🎯 **Bayes Teoremi ve Koşullu Olasılık:**\n\n$$P(A \\mid B) = \\frac{P(B \\mid A) \\cdot P(A)}{P(B)}$$\n\n- **$P(A)$ (Önsel / Prior):** $B$ olayı bilinmeden önce $A$'nın gerçekleşme olasılığı.\n- **$P(B \\mid A)$ (Olabilirlik / Likelihood):** $A$ doğruyken $B$'nin gözlenme olasılığı.\n- **$P(A \\mid B)$ (Sonsal / Posterior):** $B$ kanıtı gerçekleştikten sonra $A$'nın güncellenmiş olasılığı.\n\n🏢 **Endüstri Örneği:** Üretim hattındaki bir kalite sensörü hata sinyali verdiğinde, ürünün gerçekten hatalı olma olasılığı Bayes formülüyle hesaplanır.`,
        en: `🎯 **Bayes' Theorem & Conditional Probability:**\n\n$$P(A \\mid B) = \\frac{P(B \\mid A) \\cdot P(A)}{P(B)}$$`
      }
    },
    {
      keywords: ['kombinatorik', 'permutasyon', 'permütasyon', 'kombinasyon', 'sayma', 'faktöriyel', 'faktoriyel'],
      title: { tr: 'Kombinatorik & Sayma Yöntemleri', en: 'Combinatorics & Counting Principles' },
      content: {
        tr: `🔢 **Kombinatorik & Sayma Kuralları:**\n\n1. **Permütasyon (Sıralama Önemli):**\n$$P(n, k) = \\frac{n!}{(n - k)!}$$\n\n2. **Kombinasyon (Sıralama Önemsiz / Seçim):**\n$$\\binom{n}{k} = \\frac{n!}{k!(n - k)!}$$\n\n🏢 **Örnek:** 10 makineden rastgele 3 tanesini bakım için seçmek $\\binom{10}{3} = \\frac{10 \\times 9 \\times 8}{3 \\times 2 \\times 1} = 120$ farklı şekilde yapılabilir.`,
        en: `🔢 **Combinatorics & Counting:**\n\n- **Permutation:** $P(n, k) = \\frac{n!}{(n - k)!}$\n- **Combination:** $\\binom{n}{k} = \\frac{n!}{k!(n - k)!}$`
      }
    },
    {
      keywords: ['markov', 'gecis matrisi', 'geçiş matrisi', 'durum', 'stokastik', 'chapman'],
      title: { tr: 'Markov Zincirleri & Stokastik Süreçler', en: 'Markov Chains & Stochastic Processes' },
      content: {
        tr: `🎲 **Markov Zincirleri & Stokastik Süreçler:**\n\n- **Hafızasızlık İlkesi:** Gelecekteki durum ($X_{n+1}$), geçmişteki tüm adımlardan bağımsız olup *yalnızca* şu anki duruma ($X_n$) bağlıdır.\n$$P(X_{n+1} = j \\mid X_n = i) = P_{ij}$$\n- **Durağan Durum (Stationary Distribution):** $\\pi P = \\pi$ ve $\\sum \\pi_i = 1$ denklemi çözülerek sistemin uzun vadedeki kararlı durum olasılıkları bulunur.\n\n🏢 **Endüstri Örneği:** Bir makinenin (Çalışıyor / Arızalı / Bakımda) durumları arasındaki geçiş olasılıkları Markov zinciri ile modellenir.`,
        en: `🎲 **Markov Chains:**\n\nFuture state depends only on the present state ($P_{ij}$). Long-run steady state is given by $\\pi P = \\pi$.`
      }
    },
    {
      keywords: ['poisson', 'poisson dagilimi', 'poisson dağılımı', 'lambda', 'gelis orani'],
      title: { tr: 'Poisson Dağılımı', en: 'Poisson Distribution' },
      content: {
        tr: `⏱️ **Poisson Dağılımı:**\n\nBelirli bir zaman veya alan aralığında nadir gerçekleşen olayların sayısını modellemek için kullanılır.\n\n$$P(X = k) = \\frac{e^{-\\lambda} \\lambda^k}{k!}$$\n\n- **Beklenen Değer:** $E[X] = \\lambda$\n- **Varyans:** $Var(X) = \\lambda$\n\n🏢 **Endüstri Örneği:** Bir çağrı merkezine dakikada gelen ortalama müşteri sayısı $\\lambda = 4$ ise, 1 dakikada tam 2 çağrı gelme olasılığı $P(X=2) = \\frac{e^{-4} 4^2}{2!} \\approx 0.1465$ (%14.65) olur.`,
        en: `⏱️ **Poisson Distribution:**\n\n$$P(X = k) = \\frac{e^{-\\lambda} \\lambda^k}{k!}, \\quad E[X] = \\lambda, \\quad Var(X) = \\lambda$$`
      }
    },
    {
      keywords: ['binom', 'binomial', 'bernoulli', 'n deneme'],
      title: { tr: 'Binom Dağılımı', en: 'Binomial Distribution' },
      content: {
        tr: `🎯 **Binom Dağılımı:**\n\n$n$ bağımsız denemede her bir denemenin başarı olasılığı $p$ olduğunda, tam $k$ başarı elde etme olasılığıdır.\n\n$$P(X = k) = \\binom{n}{k} p^k (1 - p)^{n - k}$$\n\n- **Ortalama:** $E[X] = np$\n- **Varyans:** $Var(X) = np(1 - p)$\n\n🏢 **Örnek:** Bir üretim bandında üretilen her parçanın kusurlu olma olasılığı $p = 0.05$ ise, rastgele seçilen 10 parçadan 1'inin kusurlu olma olasılığı $P(X=1) = \\binom{10}{1}(0.05)^1(0.95)^9 \\approx 0.315$ (%31.5).`,
        en: `🎯 **Binomial Distribution:**\n\n$$P(X = k) = \\binom{n}{k} p^k (1 - p)^{n - k}, \\quad E[X] = np, \\quad Var(X) = np(1 - p)$$`
      }
    },
    {
      keywords: ['normal dagilim', 'normal dağılım', 'gaussian', 'z tablosu', 'z skoru', 'z-score'],
      title: { tr: 'Normal Dağılım & Z Skoru', en: 'Normal Distribution & Z-Score' },
      content: {
        tr: `🔔 **Normal (Gaussian) Dağılım & Z Dönüşümü:**\n\n$$X \\sim N(\\mu, \\sigma^2) \\implies Z = \\frac{X - \\mu}{\\sigma} \\sim N(0, 1)$$\n\n- **Empirik Kural (68 - 95 - 99.7):**\n  - $\\mu \\pm 1\\sigma$: Verilerin %68.2'si\n  - $\\mu \\pm 2\\sigma$: Verilerin %95.4'ü\n  - $\\mu \\pm 3\\sigma$: Verilerin %99.7'si\n\n🏢 **Endüstri Örneği:** 6-Sigma kalite kontrol süreçlerinde parçaların tolerans sınırları içinde kalma yüzdeleri Z tablosuyla hesaplanır.`,
        en: `🔔 **Normal Distribution & Z-Transformation:**\n\n$$Z = \\frac{X - \\mu}{\\sigma} \\sim N(0, 1)$$`
      }
    },
    {
      keywords: ['merkezi limit', 'clt', 'central limit theorem', 'orneklem ortalamasi'],
      title: { tr: 'Merkezi Limit Teoremi (CLT)', en: 'Central Limit Theorem (CLT)' },
      content: {
        tr: `🌐 **Merkezi Limit Teoremi (CLT):**\n\nAna kütle hangi dağılıma sahip olursa olsun (çarpık, kesikli, düzgün vb.), yeterince büyük bir örneklem ($n \\ge 30$) seçildiğinde, örneklem ortalaması $\\bar{X}$ yaklaşık olarak **Normal Dağılım** gösterir!\n\n$$\\bar{X} \\sim N\\left(\\mu, \\frac{\\sigma^2}{n}\\right) \\implies Z = \\frac{\\bar{X} - \\mu}{\\sigma / \\sqrt{n}}$$\n\n- Standart Hata ($SE$): $\\sigma_{\\bar{x}} = \\frac{\\sigma}{\\sqrt{n}}$ (Örneklem büyüklüğü $n$ arttıkça hata küçülür).`,
        en: `🌐 **Central Limit Theorem (CLT):**\n\n$$\\bar{X} \\sim N\\left(\\mu, \\frac{\\sigma^2}{n}\\right), \\quad Z = \\frac{\\bar{X} - \\mu}{\\sigma / \\sqrt{n}}$$`
      }
    },
    {
      keywords: ['hipotez', 'hipotez testi', 'h0', 'h1', 'p degeri', 'p-value', 'tip 1 hata', 'tip 2 hata', 'anlamlilik'],
      title: { tr: 'Hipotez Testleri & p-Değeri', en: 'Hypothesis Testing & p-Value' },
      content: {
        tr: `⚖️ **Hipotez Testi Adımları & Karar Kuralı:**\n\n1. **Hipotezleri Belirle:** $H_0$ (Sıfır Hipotezi - Değişiklik yok) vs. $H_1$ (Alternatif Hipotez).\n2. **Hata Tipleri:**\n   - **Tip I Hata ($\\alpha$):** $H_0$ doğruyken yanlışlıkla reddetmek (Üretici Riski).\n   - **Tip II Hata ($\\beta$):** $H_0$ yanlışken reddedememek (Tüketici Riski).\n3. **p-Değeri ile Karar:**\n   - Eğer $p \\le \\alpha$ ise $\\rightarrow$ **$H_0$ REDDEDİLİR** (İstatiksel olarak anlamlı fark var).\n   - Eğer $p > \\alpha$ ise $\\rightarrow$ **$H_0$ REDDEDİLEMEZ**.`,
        en: `⚖️ **Hypothesis Testing:**\n\nIf $p \\le \\alpha \\implies$ Reject $H_0$. Type I error = $\\alpha$, Type II error = $\\beta$.`
      }
    },
    {
      keywords: ['anova', 'varyans analizi', 'f testi', 'f-statistic', 'tukey'],
      title: { tr: 'Tek Yönlü ANOVA (Varyans Analizi)', en: 'One-Way ANOVA' },
      content: {
        tr: `📊 **ANOVA (Analysis of Variance):**\n\nÜç veya daha fazla bağımsız grubun ortalamalarını aynı anda karşılaştırmak için kullanılır ($H_0: \\mu_1 = \\mu_2 = \\dots = \\mu_k$).\n\n$$F = \\frac{MS_{\\text{Gruplar Arası}}}{MS_{\\text{Grup İçi}}} = \\frac{SSB / (k - 1)}{SSW / (N - k)}$$\n\n- Eğer $F_{\\text{hesap}} > F_{\\text{kritik}}$ veya $p < \\alpha$ ise en az bir grubun ortalaması diğerlerinden anlamlı derecede farklıdır. Hangi grubun farklı olduğunu bulmak için Tukey post-hoc testi uygulanır.`,
        en: `📊 **ANOVA (Analysis of Variance):**\n\n$$F = \\frac{MS_{\\text{Between}}}{MS_{\\text{Within}}}$$`
      }
    },
    {
      keywords: ['regresyon', 'regression', 'r2', 'r kare', 'korelasyon', 'artik', 'residual'],
      title: { tr: 'Doğrusal Regresyon & Korelasyon', en: 'Linear Regression & Correlation' },
      content: {
        tr: `📈 **Basit Doğrusal Regresyon & Korelasyon:**\n\n$$Y = \\beta_0 + \\beta_1 X + \\epsilon$$\n\n- **Eğim (Slope):** $\\beta_1 = \\frac{Cov(X, Y)}{Var(X)} = r \\frac{s_y}{s_x}$\n- **Belirlilik Katsayısı ($R^2$):** Bağımlı değişkendeki ($Y$) varyansın yüzde kaçının model ($X$) tarafından açıklandığını gösterir ($0 \\le R^2 \\le 1$).\n- **Korelasyon Katsayısı ($r$):** İki değişken arasındaki doğrusal ilişkinin yönünü ve gücünü ölçer ($-1 \\le r \\le 1$).`,
        en: `📈 **Linear Regression:**\n\n$$Y = \\beta_0 + \\beta_1 X + \\epsilon, \\quad R^2 = r^2$$`
      }
    },
    {
      keywords: ['guven araligi', 'güven aralığı', 'confidence interval'],
      title: { tr: 'Güven Aralıkları (Confidence Intervals)', en: 'Confidence Intervals' },
      content: {
        tr: `📐 **Ortalama İçin Güven Aralığı:**\n\n- **$\\sigma$ Biliniyorsa (Z Dağılımı):**\n$$\\bar{x} \\pm Z_{\\alpha/2} \\cdot \\frac{\\sigma}{\\sqrt{n}}$$\n- **$\\sigma$ Bilinmiyorsa ($n < 30$, t Dağılımı, $df = n - 1$):**\n$$\\bar{x} \\pm t_{\\alpha/2, n-1} \\cdot \\frac{s}{\\sqrt{n}}$$\n\n%95 güven aralığı için standart Z değeri $Z_{0.025} = 1.96$'dır.`,
        en: `📐 **Confidence Intervals:**\n\n$$\\bar{x} \\pm Z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}} \\quad \\text{or} \\quad \\bar{x} \\pm t_{\\alpha/2, n-1} \\frac{s}{\\sqrt{n}}$$`
      }
    }
  ];

  // Search in CORE_TOPICS
  for (const topic of CORE_TOPICS) {
    const match = topic.keywords.some((kw) => q.includes(kw));
    if (match) {
      return language === 'tr'
        ? `${topic.content.tr}\n\n💡 *Tanco Dahili Müfredat Hafızası: Bu konu sistem belleğinden anında sunulmuştur.*`
        : `${topic.content.en}\n\n💡 *Tanco Core Knowledge Engine: Retrieved from course knowledge base.*`;
    }
  }

  // 3. Dynamic Scan across ALL 16 Modules in curriculum
  let bestMatch: { score: number; lesson: any; module: any } | null = null;
  const searchWords = q.split(/[\s,?.!]+/).filter((w) => w.length > 2);

  for (const mod of ALL_MODULES) {
    for (const les of mod.lessons || []) {
      let score = 0;
      const lessonTitle = (les.title?.tr || '').toLowerCase() + ' ' + (les.title?.en || '').toLowerCase();
      const conceptText = (les.conceptCard?.tr || '').toLowerCase();
      const vocabText = (les.vocabTerms || []).map((v) => (v.term_en + ' ' + v.explanation_tr).toLowerCase()).join(' ');

      for (const word of searchWords) {
        if (lessonTitle.includes(word)) score += 5;
        if (vocabText.includes(word)) score += 3;
        if (conceptText.includes(word)) score += 1;
      }

      if (score > 0 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { score, lesson: les, module: mod };
      }
    }
  }

  if (bestMatch && bestMatch.score >= 3) {
    const les = bestMatch.lesson;
    const mod = bestMatch.module;
    const title = language === 'tr' ? les.title?.tr : les.title?.en;
    const modTitle = language === 'tr' ? mod.title?.tr : mod.title?.en;
    const concept = language === 'tr' ? les.conceptCard?.tr : les.conceptCard?.en;
    const company = language === 'tr' ? les.companyExample?.tr : les.companyExample?.en;

    let response = language === 'tr'
      ? `📚 **${modTitle} — ${title}:**\n\n📖 **Konu Anlatımı:**\n${concept}\n\n🏢 **Endüstri Örneği:**\n${company}`
      : `📚 **${modTitle} — ${title}:**\n\n📖 **Concept:**\n${concept}\n\n🏢 **Company Case:**\n${company}`;

    if (Array.isArray(les.questions) && les.questions.length > 0) {
      const q1 = les.questions[0];
      const pText = language === 'tr' ? q1.prompt?.tr || q1.prompt : q1.prompt?.en || q1.prompt;
      const ans = q1.correctAnswer;
      const exp = language === 'tr' ? q1.explanation?.tr || q1.explanation : q1.explanation?.en || q1.explanation;
      response += language === 'tr'
        ? `\n\n📝 **Örnek Soru & Çözüm:**\n- **Soru:** ${pText}\n- **Cevap:** \`${ans}\`\n- **Açıklama:** ${exp}`
        : `\n\n📝 **Sample Question:**\n- **Question:** ${pText}\n- **Answer:** \`${ans}\``;
    }

    response += language === 'tr'
      ? `\n\n💡 *Tanco Dahili Müfredat Hafızası: İlgili modülden doğrudan aktarıldı.*`
      : `\n\n💡 *Tanco Core Knowledge Engine: Retrieved from curriculum.*`;

    return response;
  }

  return null;
}

/**
 * Intelligent Pedagogical & Contextual Fallback Engine
 * Provides rich, step-by-step problem solving, formula derivation, and witty conversation even when offline or rate-limited.
 */
function getNoKeyFallback(
  question: string,
  language: 'tr' | 'en',
  studentName: string = 'Öğrenci',
  studyContext?: any
): string {
  // 1. Try Curriculum Knowledge Retrieval First
  const curriculumAns = searchCurriculumKnowledge(question, language, studentName, studyContext);
  if (curriculumAns) {
    return curriculumAns;
  }

  const q = question.toLowerCase().trim();

  // 2. Conversational / Humor / Brain Check
  if (
    q.includes('zekan gidiyor') ||
    q.includes('akıllan') ||
    q.includes('dondu') ||
    q.includes('kafayı yedi') ||
    q.includes('saçmalad') ||
    q.includes('robotlaştın')
  ) {
    return language === 'tr'
      ? `Hahaha haklısın ${studentName}! 😄 Bazen anlık sunucu hız limitlerinden dolayı kısa bir duraksama olabiliyor ama merak etme buradayım ve tüm ders hafızam tamamen açık 🎯!\n\nŞu an üzerinde çalıştığımız ders veya aklına takılan soru hakkında konuşalım; hangi formülü ya da problemi birlikte çözelim?`
      : `Haha you got me ${studentName}! 😄 Sometimes API limits give my neurons a quick hiccup, but I'm fully back and sharp 🎯!\n\nWhat concept or problem are we tackling today? Let's dive in!`;
  }

  // 3. Greetings
  if (
    q === 'selam' ||
    q === 'merhaba' ||
    q === 'hi' ||
    q === 'hello' ||
    q === 'selamlar' ||
    q === 'naber' ||
    q === 'naber tanco' ||
    q === 'nasılsın'
  ) {
    return language === 'tr'
      ? `Selam ${studentName}! 🎓 İyiyim, seninle çalışmaya hazırım. Bugün Olasılık veya İstatistik'te hangi konuyu inceliyoruz?`
      : `Hi ${studentName}! 🎓 Doing great and ready to study! What topic in Probability or Statistics are we exploring today?`;
  }

  // 4. If nothing matched and it's a rate limit scenario, show friendly quota reset message
  return getQuotaExceededMessage(language, 60);
}
