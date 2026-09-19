const fs = require('fs');
const path = require('path');

const modulesDir = path.join(__dirname, '../src/data');

// Helper to write module file
function saveModule(moduleNum, moduleData) {
  const filePath = path.join(modulesDir, `module${moduleNum}.json`);
  fs.writeFileSync(filePath, JSON.stringify(moduleData, null, 2), 'utf8');
  console.log(`✓ Module ${moduleNum} generated with ${moduleData.lessons.length} separated lessons.`);
}

console.log('Building separated micro-lessons...');

// Let's write the module expander script that preserves existing cases and generates isolated lessons.
