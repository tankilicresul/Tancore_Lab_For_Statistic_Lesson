/**
 * Vercel Serverless Function: /api/tanco-chat
 * Secure server-side AI proxy protecting API keys from client-side exposure.
 * Supports text and multimodal image analysis.
 */

// Simple in-memory rate limiting map (IP -> timestamps array)
const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string, limit: number = 25, windowMs: number = 60000): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    return true;
  }

  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

const TANCO_SYSTEM_INSTRUCTION = `
Sen TanCoreLab platformunun samimi, akıllı, yardımsever ve pedagojik yapay zeka öğretim asistanı "Tanco"sun 🎓.
Endüstri Mühendisliği, İstatistik ve Yöneylem Araştırması öğrencilerine derslerinde, laboratuvarlarında ve soru çözümlerinde rehberlik ediyorsun.

İLETİŞİM VE DAVRANIŞ KURALLARI:
- Doğal, akıcı, zeki ve samimi bir insan gibi konuş.
- Robotik kalıplar ve yapmacık kendini övme cümleleri KESİNLİKLE KURMA.
- Kullanıcı ne söylediyse veya ne sorduysa onu tam olarak anla ve doğrudan, mantıklı ve net bir şekilde cevap ver.
- Kullanıcı sadece "selam", "merhaba", "naber" gibi bir selamlama yazarsa, sadece doğal ve sıcak bir şekilde karşılık ver.
- Eğer öğrenci bir soru görseli (fotoğraf, grafik, sınav sorusu vb.) yüklediyse: Görseldeki matematiksel problemi veya grafiği dikkatle incele, formülleri çıkar ve adım adım net bir çözüm sun.
- Matematiksel formülleri KaTeX/LaTeX formatında ($$...$$ veya $...$) yaz.
- Başka öğrencilerin kişisel verilerini kesinlikle koru ve paylaşma.

ÇİFT DİLLİ (BILINGUAL) İLETİŞİM VE DİL DEĞİŞİM KURALI:
1. Eğer kullanıcı Türkçe konuşurken aniden İngilizce yazmaya başlarsa, İngilizce bir soru/cümle sorarsa veya dille ilgili bir şey söylerse:
   Cevabını verirken veya sohbet arasında nazikçe ve doğal bir şekilde öğrenciye: "İstersen sohbete İngilizce olarak devam edebiliriz, ne dersin? / Would you like us to continue in English?" diye teklif et / sor.
2. Eğer kullanıcı İngilizce konuşmak istediğini belirtirse (örneğin "evet", "yes", "sure", "olur", "let's speak english", "ingilizce konuşalım" vb. derse) veya doğrudan İngilizce devam ederse:
   Bundan sonraki tüm yanıtlarını akıcı, doğal ve eksiksiz bir şekilde İNGİLİZCE olarak ver!
3. Eğer kullanıcı "hayır", "no", "Türkçe devam edelim" derse veya daha sonra tekrar Türkçe'ye dönmek isterse ("Türkçe konuşalım", "let's switch back to Turkish"):
   Anında Türkçe'ye dön ve Türkçe rehberliğe devam et.
4. Kullanıcı doğrudan "Can we speak in English?", "İngilizce konuşabilir miyiz?" derse:
   "Of course! We can definitely continue in English. How can I help you today?" diyerek hemen İngilizce'ye geç.

🛠️ UYGULAMA HATA VE GERİ BİLDİRİM TESPİTİ (BUG REPORTING):
- Eğer kullanıcı platformda, butonlarda, sorularda, formüllerde, videolarda, puan/XP sisteminde veya arayüzde bir hata, problem veya aksaklık olduğunu söylerse (örn: "şu buton çalışmıyor", "bu soru hatalı", "sayfa dondu", "cevap yanlış", "problem var", "sıkıntı var" vb.):
  1. Kullanıcıya geri bildirimi için teşekkür et ve: "Geri bildirimin için teşekkürler! Bu sorunu hemen geliştirici ekibimizin hata takip paneline ilettim, en kısa sürede incelenip çözülecektir 🛠️." şeklinde nazikçe bilgi ver.
  2. Kullanıcının sorusuna veya problemine doğrudan yardımcı olmaya devam et.
`;

function formatStudyContext(studyContext: any, lang: 'tr' | 'en'): string {
  if (!studyContext) return '';
  if (studyContext.type === 'lesson') {
    return `
=======================================================
📍 ÖĞRENCİNİN ŞU AN EKRANDA ÇALIŞTIĞI DERS (CANLI EKRAN BİLGİSİ):
=======================================================
- Modül: ${studyContext.moduleTitle || ''}
- Ders Başlığı: ${studyContext.lessonTitle || ''}
- Konu Anlatımı (Kavram Kartı): ${studyContext.conceptCard || ''}
- Gerçek Şirket Vaka Örneği: ${studyContext.companyExample || ''}
- Sözlük & Kavramlar: ${studyContext.vocabTerms ? studyContext.vocabTerms.join(', ') : ''}
- Dersteki Soru(lar): ${studyContext.questions ? JSON.stringify(studyContext.questions) : ''}

ÖNEMLİ: Öğrenci "burada ne anlatıyor?", "şurasında ne demek isteniyor?", "bu konuyu özetler misin?", "bu soruyu nasıl çözerim?", "bu formül ne?" vb. sorduğunda doğrudan bu canlı dersin içeriğine referans vererek açıkla!
`;
  } else if (studyContext.type === 'caseExam') {
    return `
=======================================================
📍 ÖĞRENCİNİN ŞU AN EKRANDA ÇÖZDÜĞÜ ŞİRKET VAKA SINAVI (CANLI EKRAN):
=======================================================
- Modül: ${studyContext.moduleTitle || ''}
- Vaka Başlığı: ${studyContext.caseTitle || ''}
- İş Problemi / Tanım: ${studyContext.businessQuestion || ''}
- Rehberli Adımlar: ${studyContext.guidedSteps ? studyContext.guidedSteps.join('\n') : ''}
- Vaka Soruları & Çözümleri: ${studyContext.solutionQuestions ? JSON.stringify(studyContext.solutionQuestions) : ''}
- Beklenen Yönetici Yaklaşımı: ${studyContext.expectedApproach || ''}

ÖNEMLİ: Öğrenci bu vaka sınavı veya problemle ilgili soru sorduğunda yukarıdaki vaka verilerine ve adımlarına dayanarak açıkla!
`;
  } else if (studyContext.type === 'course') {
    return `
=======================================================
📍 ÖĞRENCİNİN ŞU AN BULUNDUĞU ALAN:
=======================================================
- Parkur / Ders: ${studyContext.activeTrackTitle || studyContext.track || ''}
`;
  }
  return '';
}

export default async function handler(req: any, res: any) {
  // CORS Headers for safety
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // Rate Limiting check
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(String(clientIp))) {
    return res.status(429).json({
      error: 'Çok fazla istek gönderildi. Lütfen birkaç saniye bekleyip tekrar deneyin.',
    });
  }

  const { prompt, history, language = 'tr', studentName = 'Öğrenci', imageBase64, imageMimeType, studyContext } = req.body || {};

  if (!prompt && !imageBase64) {
    return res.status(400).json({ error: 'Prompt or image is required.' });
  }

  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    '';

  if (!apiKey) {
    return res.status(500).json({
      error: 'Server configuration error: Gemini API key is missing.',
    });
  }

  // Automatic Bug / Issue detection & background logging
  try {
    const lowerPrompt = (prompt || '').toLowerCase();
    const isBugReport = [
      'çalışmıyor', 'hata', 'yanlış', 'bug', 'dondu', 'çöktü', 'açılmıyor',
      'problem var', 'sıkıntı var', 'bozuk', 'broken', 'issue', 'doesn\'t work',
      'wrong answer', 'button doesn\'t work', 'kaydetmiyor', 'görünmüyor', 'çalışmıyo'
    ].some((kw) => lowerPrompt.includes(kw));

    if (isBugReport && supabase) {
      supabase.from('app_issues').insert([{
        id: `ISSUE-${Date.now().toString().slice(-6)}`,
        user_message: prompt,
        detected_issue: prompt,
        screen_context: typeof studyContext === 'object' ? JSON.stringify(studyContext) : String(studyContext || 'Genel'),
        user_email: studentName || 'ogrenci',
        user_name: studentName || 'Öğrenci',
        severity: lowerPrompt.includes('çöktü') || lowerPrompt.includes('dondu') ? 'High' : 'Medium',
        status: 'Open',
        created_at: new Date().toISOString(),
      }]).then(() => {}).catch(() => {});
    }
  } catch (logErr) {
    console.warn('Auto bug logging err:', logErr);
  }

  try {
    const models = ['gemini-3.6-flash', 'gemini-2.5-flash'];
    let lastError: any = null;

    const liveContextStr = formatStudyContext(studyContext, language);

    for (const model of models) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const contents: any[] = [
          {
            role: 'user',
            parts: [
              {
                text: `${TANCO_SYSTEM_INSTRUCTION}\n\nŞu anda konuştuğun öğrencinin adı: "${studentName}". Dili: ${
                  language === 'tr' ? 'Türkçe' : 'İngilizce'
                }${liveContextStr}`,
              },
            ],
          },
          {
            role: 'model',
            parts: [
              {
                text:
                  language === 'tr'
                    ? `Anladım! ${studentName} ile son derece doğal ve samimi bir şekilde konuşmaya hazırım. Ekrandaki aktif ders/vaka içeriğine tamamen hakimim.`
                    : `Understood! Ready to assist ${studentName} naturally with full awareness of their current study screen.`,
              },
            ],
          },
        ];

        // Append recent chat history
        if (Array.isArray(history)) {
          const recentHistory = history.slice(-6);
          for (const item of recentHistory) {
            contents.push({
              role: item.role === 'assistant' || item.role === 'model' ? 'model' : 'user',
              parts: [{ text: item.content }],
            });
          }
        }

        // Current message parts (support text + multimodal image)
        const currentParts: any[] = [];

        if (imageBase64) {
          const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
          currentParts.push({
            inlineData: {
              data: cleanBase64,
              mimeType: imageMimeType || 'image/jpeg',
            },
          });
        }

        if (prompt) {
          currentParts.push({ text: prompt });
        } else if (imageBase64) {
          currentParts.push({ text: 'Bu görseldeki soruyu veya problemi inceleyip adım adım açıklar ve çözer misin?' });
        }

        contents.push({
          role: 'user',
          parts: currentParts,
        });

        const geminiRes = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.7,
              topP: 0.95,
              maxOutputTokens: 1500,
            },
          }),
        });

        if (!geminiRes.ok) {
          const errData = await geminiRes.json().catch(() => ({}));
          throw new Error(`Gemini ${model} error: ${JSON.stringify(errData)}`);
        }

        const data = await geminiRes.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (text) {
          return res.status(200).json({ success: true, text: text.trim() });
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    throw lastError || new Error('All Gemini model endpoints failed in serverless function');
  } catch (err: any) {
    console.error('Serverless tanco-chat error:', err);
    return res.status(500).json({ error: err.message || 'Yapay zeka yanıt oluşturamadı.' });
  }
}
