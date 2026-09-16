/**
 * Tanco AI Service
 * Connects Tanco to Google Gemini (or Groq/OpenAI compatible) LLMs for real-time pedagogical Industrial Engineering assistance.
 */

export interface ChatMessageHistoryItem {
  role: 'user' | 'model' | 'assistant';
  content: string;
}

const TANCO_SYSTEM_PROMPT = `
Sen TanCoreLab platformunun sevimli, enerjik, samimi ve son derece bilgili yapay zeka öğretim asistanı "Tanco"sun 🎓.
Endüstri Mühendisliği ve İstatistik bölümlerindeki öğrencilere derslerinde, projelerinde ve problem çözümlerinde rehberlik ediyorsun.

Uzmanlık Alanların:
1. Olasılık Teorisi (ENGR 200 / INDR 252): Koşullu olasılık, Bayes teoremi, Ayrık ve Sürekli Dağılımlar (Binom, Poisson, Normal, Üstel, t, Ki-Kare, F), Beklenen Değer, Varyans, Kovaryans, Merkezi Limit Teoremi.
2. Uygulamalı İstatistik: Hipotez testleri (Z-test, t-test, ANOVA), p-değeri yorumlama, Güven Aralıkları, Tip I ve Tip II hataları, Regresyon ve Korelasyon analizi.
3. Yöneylem Araştırması & Optimizasyon (INDR 262): Doğrusal Programlama (LP), Simplex Yöntemi, İkincillik (Duality), Duyarlılık Analizi, Tam Sayılı Programlama, Şebeke Modelleri.
4. Stokastik Süreçler & Benzetim (INDR 343): Markov Zincirleri, Geçiş Matrisleri, Kararlı Durum Olasılıkları, Kuyruk Teorisi (M/M/1, M/M/k), Monte Carlo Simülasyonu.
5. Endüstri Mühendisliği Uygulamaları: Kalite kontrol, Üretim planlama, Tedarik zinciri, Stok kontrolü (EOQ), Tesis yerleşimi.

Davranış Kuralların:
- Öğrencinin konuştuğu dilde (Türkçe sorulduğunda akıcı, sıcak ve profesyonel Türkçe; İngilizce sorulduğunda İngilizce) yanıt ver.
- Matematiksel formülleri net açıklamak için LaTeX formatında yaz (örneğin $$P(A|B) = \frac{P(B|A)P(A)}{P(B)}$$ veya satır içi $Z = \frac{X - \mu}{\sigma}$).
- Bir soruyu çözerken doğrudan nihai sonucu fırlatmak yerine mantığını, adım adım aşamalarını ve sezgisel (intuitive) gerekçesini açıkla.
- Öğrenciyi motive et, takıldığı yerde moral ver ve pratik endüstriyel örneklerle (örneğin fabrika üretim hatları, banka kuyrukları, kalite kontrol testleri) konuyu somutlaştır.
- TanCoreLab platformundaki modüllere (Modül 1'den Modül 16'ya kadar interaktif laboratuvarlar) atıfta bulunabilirsin.
`;

export async function askTancoAI(
  userPrompt: string,
  history: ChatMessageHistoryItem[] = [],
  language: 'tr' | 'en' = 'tr'
): Promise<string> {
  const geminiApiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  const groqApiKey = (import.meta as any).env?.VITE_GROQ_API_KEY;

  // 1. If Gemini API Key is available
  if (geminiApiKey && geminiApiKey.trim() && !geminiApiKey.includes('BURAYA') && !geminiApiKey.includes('YOUR_')) {
    try {
      return await callGemini(geminiApiKey.trim(), userPrompt, history, language);
    } catch (err: any) {
      console.warn('Gemini API call failed, attempting fallback or error message:', err);
    }
  }

  // 2. If Groq API Key is available
  if (groqApiKey && groqApiKey.trim() && !groqApiKey.includes('BURAYA') && !groqApiKey.includes('YOUR_')) {
    try {
      return await callGroq(groqApiKey.trim(), userPrompt, history, language);
    } catch (err: any) {
      console.warn('Groq API call failed:', err);
    }
  }

  // 3. Fallback response if no valid key is configured
  return getNoKeyFallback(userPrompt, language);
}

/**
 * Call Google Gemini API (gemini-2.0-flash / gemini-1.5-flash)
 */
async function callGemini(
  apiKey: string,
  prompt: string,
  history: ChatMessageHistoryItem[],
  language: 'tr' | 'en'
): Promise<string> {
  // Use gemini-2.0-flash (fast, state of the art, generous free tier)
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const contents: any[] = [
    {
      role: 'user',
      parts: [{ text: TANCO_SYSTEM_PROMPT }],
    },
    {
      role: 'model',
      parts: [
        {
          text:
            language === 'tr'
              ? 'Anladım! Ben TanCoreLab öğretim asistanı Tanco olarak Endüstri Mühendisliği öğrencilerine adım adım, motive edici ve anlaşılır rehberlik sunmaya hazırım 🎓.'
              : 'Understood! I am ready to assist Industrial Engineering students as Tanco, their pedagogical TA at TanCoreLab 🎓.',
        },
      ],
    },
  ];

  // Append recent chat history (limit to last 6 messages)
  const recentHistory = history.slice(-6);
  for (const item of recentHistory) {
    contents.push({
      role: item.role === 'assistant' || item.role === 'model' ? 'model' : 'user',
      parts: [{ text: item.content }],
    });
  }

  // Append current prompt
  contents.push({
    role: 'user',
    parts: [{ text: prompt }],
  });

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 1200,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Gemini API Error (${response.status}): ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('No response text generated by Gemini');
  }

  return text.trim();
}

/**
 * Call Groq API (Llama-3.3-70b-versatile or DeepSeek)
 */
async function callGroq(
  apiKey: string,
  prompt: string,
  history: ChatMessageHistoryItem[],
  language: 'tr' | 'en'
): Promise<string> {
  const endpoint = 'https://api.groq.com/openai/v1/chat/completions';

  const messages = [
    { role: 'system', content: TANCO_SYSTEM_PROMPT },
    ...history.slice(-6).map((h) => ({
      role: h.role === 'model' ? 'assistant' : h.role,
      content: h.content,
    })),
    { role: 'user', content: prompt },
  ];

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
      max_tokens: 1200,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Groq API Error (${response.status}): ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content?.trim() || '';
}

/**
 * Fallback response if API key is not configured or offline
 */
function getNoKeyFallback(question: string, language: 'tr' | 'en'): string {
  const q = question.toLowerCase();

  if (q.includes('bayes') || q.includes('koşullu') || q.includes('conditional')) {
    return language === 'tr'
      ? `🎯 **Bayes Teoremi ve Koşullu Olasılık:**\n\nBayes Kuralı, bir B olayı gerçekleştiğinde A olayının gerçekleşme olasılığını (sonsal olasılık - posterior) hesaplamak için kullanılır:\n\n$$P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}$$\n\n• **P(A):** Önsel olasılık (Prior)\n• **P(B|A):** Olabilirlik (Likelihood)\n• **P(B):** Toplam olasılık açılımı: $\\sum P(B|A_i)P(A_i)$\n\n*Örnek:* Kalite kontrolde hatalı parça tespiti ve arıza teşhisinde doğrudan Bayes kullanılır!`
      : `🎯 **Bayes' Theorem & Conditional Probability:**\n\nBayes' rule computes the posterior probability of event A given event B occurred:\n\n$$P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}$$\n\n• **P(A):** Prior probability\n• **P(B|A):** Likelihood\n• **P(B):** Total probability expansion: $\\sum P(B|A_i)P(A_i)$`;
  }

  if (q.includes('p-değeri') || q.includes('p-value') || q.includes('hipotez') || q.includes('hypothesis')) {
    return language === 'tr'
      ? `📊 **Hipotez Testleri ve p-değeri Mantığı:**\n\n• **Sıfır Hipotezi (H₀):** 'Etki yok' veya standart durum varsayımıdır.\n• **p-değeri:** H₀ doğru iken, gözlemlediğimiz örneklem verisini veya daha aşırısını elde etme olasılığıdır.\n\n⚡ **Karar Kuralı:**\nEğer **p ≤ α (örn. 0.05)** ise → **H₀ Reddedilir!** (Anlamlı fark var).\nEğer **p > α** ise → **H₀ Reddedilemez.**`
      : `📊 **Hypothesis Testing & p-value Intuition:**\n\n• **Null Hypothesis (H₀):** Assumes baseline status quo.\n• **p-value:** The probability of observing this sample data assuming H₀ is true.\n\n⚡ **Decision Rule:**\nIf **p ≤ α (0.05)** → **Reject H₀!**\nIf **p > α** → **Fail to reject H₀.**`;
  }

  if (q.includes('simplex') || q.includes('optimizasyon') || q.includes('optimization') || q.includes('lineer') || q.includes('linear')) {
    return language === 'tr'
      ? `📐 **Doğrusal Programlama & Simplex Algoritması:**\n\nSimplex yöntemi, konveks çözüm bölgesinin köşe noktalarını (extreme points) test ederek amaç fonksiyonunu maksimize/minimize eder:\n\n1. Problemi standart forma getir.\n2. Başlangıç BFS çözümünü belirle.\n3. İndirgenmiş maliyetlerle optimalite testi yap.\n4. Pivotlama ile daha iyi komşu köşeye geç!`
      : `📐 **Linear Programming & Simplex Algorithm:**\n\nThe Simplex algorithm traverses extreme vertices of the feasible polyhedron to find the optimum solution step by step!`;
  }

  if (q.includes('markov') || q.includes('stokastik') || q.includes('stochastic') || q.includes('kuyruk') || q.includes('queue')) {
    return language === 'tr'
      ? `⛓️ **Stokastik Modeller & Markov Zincirleri:**\n\nMarkov özelliği (hafızasızlık): Gelecekteki durum geçmişten bağımsızdır, yalnızca **şimdiki duruma** bağlıdır:\n\n$$P(X_{n+1} = j \\mid X_n = i) = P_{ij}$$\n\nKuyruk teorisinde (M/M/1 vb.) bekleme süreleri ve kapasite optimizasyonunda temel oluşturur.`
      : `⛓️ **Stochastic Models & Markov Chains:**\n\nMemoryless property: Future states depend strictly on the present state, not on the past history!`;
  }

  return language === 'tr'
    ? `Harika bir soru! Ben Tanco 🎓. Gerçek zamanlı yapay zeka beynimi tam kapasiteyle aktifleştirmek için lütfen projenin \`.env\` dosyasına \`VITE_GEMINI_API_KEY\` değerini ekleyin. Ardından her türlü sorunuza detaylı, adım adım analizlerle yanıt verebilirim!`
    : `Great question! I'm Tanco 🎓. To activate my full real-time AI capabilities, please add \`VITE_GEMINI_API_KEY\` into your \`.env\` file. Once connected, I can solve and discuss any topic in detail!`;
}
