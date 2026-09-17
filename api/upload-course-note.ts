/**
 * Vercel Serverless Function: /api/upload-course-note
 * Handles course notes upload metadata and logs to development manifest.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// In-memory rate limiting map (IP -> timestamps array)
const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string, limit: number = 4, windowMs: number = 60000): boolean {
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

  if (req.method === 'POST' && isRateLimited(clientIp, 4, 60000)) {
    return res.status(429).json({
      error: 'Çok sık not yükleme isteği gönderdiniz. Lütfen 1 dakika sonra tekrar deneyin.',
    });
  }

  if (req.method === 'GET') {
    // List uploaded notes for developer overview
    const courseCode = req.query.courseCode;
    if (supabase) {
      try {
        let query = supabase.from('course_notes').select('*').order('created_at', { ascending: false }).limit(50);
        if (courseCode) {
          query = query.eq('course_code', String(courseCode).slice(0, 20));
        }
        const { data, error } = await query;
        if (!error && data) {
          return res.status(200).json({ notes: data });
        }
      } catch (e) {
        console.warn('Supabase fetch error:', e);
      }
    }
    return res.status(200).json({ notes: [] });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const {
    courseCode,
    courseTitle,
    fileName,
    fileSize,
    fileType,
    fileUrl,
    uploaderEmail,
    uploaderName,
    noteDescription,
  } = req.body || {};

  if (!courseCode || !fileName) {
    return res.status(400).json({ error: 'courseCode and fileName are required.' });
  }

  const ALLOWED_EXTENSIONS = new Set([
    'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'png', 'jpg', 'jpeg'
  ]);
  const DANGEROUS_EXTENSIONS = new Set([
    'html', 'htm', 'svg', 'js', 'jsx', 'ts', 'tsx', 'exe', 'bat', 'cmd', 'sh', 'php',
    'py', 'vbs', 'scr', 'msi', 'jar', 'apk', 'zip', 'rar', 'cgi', 'pl', 'asp', 'aspx'
  ]);

  const rawExt = (fileName.split('.').pop() || '').toLowerCase();
  if (DANGEROUS_EXTENSIONS.has(rawExt) || !ALLOWED_EXTENSIONS.has(rawExt)) {
    return res.status(400).json({
      error: 'Güvenlik Uyarısı: Yalnızca geçerli doküman ve görsel formatları (.pdf, .docx, .pptx, .xlsx, .txt, .png, .jpg) yüklenebilir.',
    });
  }

  // Sanitize input values
  const cleanCourseCode = String(courseCode || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 30);
  const cleanCourseTitle = String(courseTitle || '').slice(0, 150);
  const cleanFileName = String(fileName || '').replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 200);
  const cleanFileSize = typeof fileSize === 'number' && fileSize > 0 ? Math.min(fileSize, 50 * 1024 * 1024) : 0;
  const cleanFileType = String(fileType || '').slice(0, 100);
  const cleanFileUrl = String(fileUrl || '').slice(0, 1000);
  const cleanUploaderEmail = String(uploaderEmail || 'anonymous').slice(0, 150);
  const cleanUploaderName = String(uploaderName || 'Öğrenci').slice(0, 100);
  const cleanNoteDescription = String(noteDescription || '').slice(0, 1000);

  // Security check for XSS vectors in URL
  if (
    cleanFileUrl &&
    !cleanFileUrl.startsWith('https://') &&
    !cleanFileUrl.startsWith('data:image/') &&
    !cleanFileUrl.startsWith('data:application/pdf')
  ) {
    return res.status(400).json({
      error: 'Güvenlik Uyarısı: Geçersiz veya güvensiz dosya bağlantısı.',
    });
  }

  const record = {
    course_code: cleanCourseCode,
    course_title: cleanCourseTitle,
    file_name: cleanFileName,
    file_size: cleanFileSize,
    file_type: cleanFileType,
    file_url: cleanFileUrl,
    uploader_email: cleanUploaderEmail,
    uploader_name: cleanUploaderName,
    note_description: cleanNoteDescription,
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('course_notes').insert([record]).select();
      if (error) {
        console.warn('Could not insert to course_notes table:', error.message);
      }
    } catch (err) {
      console.warn('Course note insert exception:', err);
    }
  }

  return res.status(200).json({
    success: true,
    message: 'Ders notu başarıyla alındı ve geliştirme havuzuna eklendi.',
    record,
  });
}
