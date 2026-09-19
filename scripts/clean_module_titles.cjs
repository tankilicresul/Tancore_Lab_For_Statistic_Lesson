const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../src/data');
let count = 0;

for (let i = 1; i <= 24; i++) {
  const p = path.join(dataDir, `module${i}.json`);
  if (!fs.existsSync(p)) continue;
  const mod = JSON.parse(fs.readFileSync(p, 'utf8'));
  let changed = false;

  if (mod.title && mod.title.tr && /^Modül\s*\d+\s*:\s*/i.test(mod.title.tr)) {
    mod.title.tr = mod.title.tr.replace(/^Modül\s*\d+\s*:\s*/i, '').trim();
    changed = true;
  }
  if (mod.title && mod.title.en && /^Module\s*\d+\s*:\s*/i.test(mod.title.en)) {
    mod.title.en = mod.title.en.replace(/^Module\s*\d+\s*:\s*/i, '').trim();
    changed = true;
  }

  // Also check if any lessons or topics have accidental "Modül X:" prefixes
  if (mod.lessons && Array.isArray(mod.lessons)) {
    for (const lesson of mod.lessons) {
      if (lesson.title && lesson.title.tr && /^Modül\s*\d+\s*:\s*/i.test(lesson.title.tr)) {
        lesson.title.tr = lesson.title.tr.replace(/^Modül\s*\d+\s*:\s*/i, '').trim();
        changed = true;
      }
      if (lesson.title && lesson.title.en && /^Module\s*\d+\s*:\s*/i.test(lesson.title.en)) {
        lesson.title.en = lesson.title.en.replace(/^Module\s*\d+\s*:\s*/i, '').trim();
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(p, JSON.stringify(mod, null, 2), 'utf8');
    count++;
    console.log(`Cleaned module${i}.json: TR -> "${mod.title.tr}" | EN -> "${mod.title.en}"`);
  }
}

console.log(`Total cleaned modules: ${count}`);
