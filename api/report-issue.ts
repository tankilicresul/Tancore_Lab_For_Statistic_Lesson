/**
 * Vercel Serverless Function: /api/report-issue
 * Automatically collects user-reported bugs/issues from Tanco AI chats.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// In-memory rate limiting map (IP -> timestamps array)
const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string, limit: number = 6, windowMs: number = 60000): boolean {
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

export default async function handler(req: any, res: any) {
  // Origin-based CORS protection
  const origin = req.headers.origin as string | undefined;
  const isAllowedOrigin =
    !origin ||
    origin === 'https://tancorelab.com' ||
    origin === 'https://www.tancorelab.com' ||
    origin.endsWith('.vercel.app') ||
    origin.includes('localhost');

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', isAllowedOrigin && origin ? origin : 'https://tancorelab.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Rate limiting check
  const clientIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    '127.0.0.1';

  if (req.method === 'POST' && isRateLimited(clientIp, 6, 60000)) {
    return res.status(429).json({
      error: 'Çok fazla istek gönderdiniz. Lütfen 1 dakika sonra tekrar deneyin.',
    });
  }

  if (req.method === 'GET') {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('app_issues')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
        if (!error && data) {
          return res.status(200).json({ issues: data });
        }
      } catch (e) {
        console.warn('Fetch issues error:', e);
      }
    }
    return res.status(200).json({ issues: [] });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const {
    userMessage,
    detectedIssue,
    screenContext,
    userEmail,
    userName,
    severity = 'Medium',
  } = req.body || {};

  if (!userMessage && !detectedIssue) {
    return res.status(400).json({ error: 'userMessage or detectedIssue is required.' });
  }

  // Sanitize and constrain input lengths to prevent database abuse
  const cleanUserMessage = String(userMessage || '').slice(0, 2000);
  const cleanDetectedIssue = String(detectedIssue || userMessage || '').slice(0, 2000);
  const cleanScreenContext = typeof screenContext === 'object'
    ? JSON.stringify(screenContext).slice(0, 1000)
    : String(screenContext || 'Genel').slice(0, 200);
  const cleanUserEmail = String(userEmail || 'anonymous').slice(0, 150);
  const cleanUserName = String(userName || 'Öğrenci').slice(0, 100);
  const cleanSeverity = ['Low', 'Medium', 'High', 'Critical'].includes(severity) ? severity : 'Medium';

  const issueRecord = {
    id: `ISSUE-${Date.now().toString().slice(-6)}`,
    user_message: cleanUserMessage,
    detected_issue: cleanDetectedIssue,
    screen_context: cleanScreenContext,
    user_email: cleanUserEmail,
    user_name: cleanUserName,
    severity: cleanSeverity,
    status: 'Open',
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      await supabase.from('app_issues').insert([issueRecord]);
    } catch (err) {
      console.warn('Could not insert to app_issues table:', err);
    }
  }

  return res.status(200).json({
    success: true,
    message: 'Sorun başarıyla kaydedildi.',
    issue: issueRecord,
  });
}
