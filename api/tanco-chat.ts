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
`;

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

  const { prompt, history, language = 'tr', studentName = 'Öğrenci', imageBase64, imageMimeType } = req.body || {};

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

  try {
    const models = ['gemini-3.6-flash', 'gemini-2.5-flash'];
    let lastError: any = null;

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
                }`,
              },
            ],
          },
          {
            role: 'model',
            parts: [
              {
                text:
                  language === 'tr'
                    ? `Anladım! ${studentName} ile son derece doğal ve samimi bir şekilde konuşmaya hazırım.`
                    : `Understood! Ready to assist ${studentName} naturally and effectively.`,
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
