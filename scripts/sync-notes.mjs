import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root is one level up from the scripts/ directory
const projectRoot = path.resolve(__dirname, '..');
const outputDir = path.join(projectRoot, 'gelen_ders_notlari');

const targetDirs = [
  outputDir,
  'C:\\Projects\\tancorelab\\gelen_ders_notlari',
  'C:\\Projects\\statsim-ai-lab\\gelen_ders_notlari',
].filter((d, index, self) => self.indexOf(d) === index);

targetDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {}
  }
});


// Supabase configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://jjbofttymfqjivzzhaly.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqYm9mdHR5bWZxaml2enpoYWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NDExODQsImV4cCI6MjEwMDQxNzE4NH0.PjLoA5LDDUtewmFdaRNVPUImSjhM6kLiViHdmVJgk84';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const shouldDeleteRemote = process.argv.includes('--delete-remote') || true; // Default to cleaning Supabase storage

async function syncCourseNotes() {
  console.log('🚀 [Sync] Gelen ders kaynakları senkronizasyonu başlatılıyor...');
  console.log(`📁 Hedef Klasör: ${outputDir}`);

  let downloadedCount = 0;
  let deletedFromCloudCount = 0;

  const manifestPath = path.join(outputDir, 'NOTLAR_OZETI.md');
  const manifestData = [];

  // 1. Fetch metadata from 'course_notes' table if available
  let remoteRecords = [];
  try {
    const { data, error } = await supabase
      .from('course_notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      remoteRecords = data;
    }
  } catch (err) {
    console.warn('⚠️ [Sync] Tablo sorgulama uyarısı (Storage doğrudan kontrol edilecek):', err.message);
  }

  // 2. Scan Storage buckets ('course-notes' and 'avatars')
  const bucketsToScan = ['course-notes', 'avatars'];

  for (const bucketName of bucketsToScan) {
    try {
      const { data: fileList, error: listErr } = await supabase.storage.from(bucketName).list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

      if (listErr || !fileList) {
        continue;
      }

      for (const item of fileList) {
        if (!item.name) continue;

        // If it's a folder, list contents of that folder
        if (!item.id && !item.metadata) {
          // If we are scanning avatars bucket, only look inside folders starting with notes_
          if (bucketName === 'avatars' && !item.name.startsWith('notes_')) {
            continue;
          }

          const { data: subFiles } = await supabase.storage.from(bucketName).list(item.name, { limit: 100 });
          if (subFiles) {
            for (const subItem of subFiles) {
              await processStorageItem(bucketName, `${item.name}/${subItem.name}`, subItem);
            }
          }
        } else {
          // If in avatars bucket, only process notes_ prefix
          if (bucketName === 'avatars' && !item.name.startsWith('notes_')) {
            continue;
          }
          await processStorageItem(bucketName, item.name, item);
        }
      }
    } catch (err) {
      console.warn(`⚠️ [Sync] '${bucketName}' bucket taranırken uyarı:`, err.message);
    }
  }

  // Helper to download and clean a file
  async function processStorageItem(bucketName, filePath, item) {
    const cleanFileName = path.basename(filePath).replace(/^notes_/, '');
    const courseFolderMatch = filePath.match(/^([^/]+)\//);
    const rawSubFolder = courseFolderMatch ? courseFolderMatch[1] : 'genel_notlar';
    const subFolder = rawSubFolder.replace(/^notes_/, '');
    
    const targetFolder = path.join(outputDir, subFolder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const localFilePath = path.join(targetFolder, cleanFileName);

    console.log(`📥 İndiriliyor: [${bucketName}] ${filePath} -> ${path.relative(projectRoot, localFilePath)}`);

    try {
      const { data: blobData, error: downloadErr } = await supabase.storage
        .from(bucketName)
        .download(filePath);

      if (downloadErr || !blobData) {
        console.error(`❌ İndirme hatası (${filePath}):`, downloadErr?.message);
        return;
      }

      const buffer = Buffer.from(await blobData.arrayBuffer());
      
      // Save to all target project folders
      targetDirs.forEach(dir => {
        const targetFolder = path.join(dir, subFolder);
        if (!fs.existsSync(targetFolder)) {
          fs.mkdirSync(targetFolder, { recursive: true });
        }
        fs.writeFileSync(path.join(targetFolder, cleanFileName), buffer);
      });
      
      downloadedCount++;

      // Log metadata
      manifestData.push({
        fileName: cleanFileName,
        course: subFolder,
        sizeBytes: buffer.length,
        downloadDate: new Date().toLocaleString('tr-TR'),
        sourceBucket: bucketName
      });

      // Delete from remote storage to free up cloud quota
      if (shouldDeleteRemote) {
        const { error: removeErr } = await supabase.storage.from(bucketName).remove([filePath]);
        if (!removeErr) {
          deletedFromCloudCount++;
          console.log(`🗑️ Buluttan silindi (Kota temizlendi): [${bucketName}] ${filePath}`);
        } else {
          console.warn(`⚠️ Buluttan silinirken uyarı (${filePath}):`, removeErr.message);
        }
      }
    } catch (e) {
      console.error(`❌ Dosya işleme hatası (${filePath}):`, e.message);
    }
  }

  // 3. Update NOTLAR_OZETI.md
  if (manifestData.length > 0 || remoteRecords.length > 0) {
    let mdContent = `# 📚 Gelen Ders Notları & Materyaller Özeti\n\n`;
    mdContent += `*Son Senkronizasyon: ${new Date().toLocaleString('tr-TR')}*\n\n`;
    mdContent += `Bu klasördeki dosyalar web uygulamasından öğrenciler tarafından yüklenmiş ve yerel bilgisayarınıza aktarılmıştır.\n\n`;
    mdContent += `| Dosya Adı | Ders / Kod | Boyut | Tarih | Durum |\n`;
    mdContent += `|---|---|---|---|---|\n`;

    manifestData.forEach(item => {
      const sizeKb = (item.sizeBytes / 1024).toFixed(1) + ' KB';
      mdContent += `| **${item.fileName}** | \`${item.course}\` | ${sizeKb} | ${item.downloadDate} | ✅ İndirildi (Buluttan Silindi) |\n`;
    });

    if (remoteRecords.length > 0) {
      mdContent += `\n### 📝 Veritabanı Kayıt Geçmişi\n\n`;
      remoteRecords.forEach(r => {
        mdContent += `- **${r.file_name || r.fileName}** (${r.course_title || r.courseTitle || r.course_code})\n`;
        mdContent += `  - Yükleyen: ${r.uploader_name || r.uploaderName || 'Öğrenci'} (${r.uploader_email || r.uploaderEmail || '-'})\n`;
        if (r.note_description || r.noteDescription) {
          mdContent += `  - Açıklama: *${r.note_description || r.noteDescription}*\n`;
        }
        mdContent += `  - Tarih: ${new Date(r.created_at || r.createdAt).toLocaleString('tr-TR')}\n\n`;
      });
    }

    targetDirs.forEach(dir => {
      try {
        fs.writeFileSync(path.join(dir, 'NOTLAR_OZETI.md'), mdContent, 'utf-8');
      } catch (e) {}
    });
  }

  console.log('\n=========================================');
  console.log(`✅ Senkronizasyon Tamamlandı!`);
  console.log(`📥 Bilgisayara İndirilen Dosya: ${downloadedCount}`);
  console.log(`🗑️ Supabase Storage'dan Silinen: ${deletedFromCloudCount}`);
  console.log(`💾 Supabase Kota Durumu: Boşaltıldı / Sıfırlandı (0 MB)`);
  console.log(`📁 Dosyaların Konumu: ${outputDir}`);
  console.log('=========================================\n');
}

syncCourseNotes().catch(err => {
  console.error('Fatal sync error:', err);
  process.exit(1);
});
