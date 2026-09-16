/**
 * Vercel Serverless Function: /api/report-issue
 * Automatically collects user-reported bugs/issues from Tanco AI chats.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('app_issues')
          .select('*')
          .order('created_at', { ascending: false });
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

  const issueRecord = {
    id: `ISSUE-${Date.now().toString().slice(-6)}`,
    user_message: userMessage || '',
    detected_issue: detectedIssue || userMessage,
    screen_context: typeof screenContext === 'object' ? JSON.stringify(screenContext) : String(screenContext || 'Genel'),
    user_email: userEmail || 'anonymous',
    user_name: userName || 'Öğrenci',
    severity,
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
