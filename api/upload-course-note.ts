/**
 * Vercel Serverless Function: /api/upload-course-note
 * Handles course notes upload metadata and logs to development manifest.
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
    // List uploaded notes for developer overview
    const courseCode = req.query.courseCode;
    if (supabase) {
      try {
        let query = supabase.from('course_notes').select('*').order('created_at', { ascending: false });
        if (courseCode) {
          query = query.eq('course_code', courseCode);
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

  const record = {
    course_code: courseCode,
    course_title: courseTitle || '',
    file_name: fileName,
    file_size: fileSize || 0,
    file_type: fileType || '',
    file_url: fileUrl || '',
    uploader_email: uploaderEmail || 'anonymous',
    uploader_name: uploaderName || 'Öğrenci',
    note_description: noteDescription || '',
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
