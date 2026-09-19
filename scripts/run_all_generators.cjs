const { execSync } = require('child_process');
const path = require('path');

const scripts = [
  'generate_m1.cjs',
  'generate_m2.cjs',
  'generate_m3.cjs',
  'generate_m4_m12.cjs',
  'generate_m5.cjs',
  'generate_m6.cjs',
  'generate_m7.cjs',
  'generate_m8.cjs',
  'generate_m9_m10_m11.cjs',
  'generate_m3_m4_m13.cjs',
  'generate_m14.cjs',
  'generate_m15.cjs',
  'generate_m16.cjs'
];

console.log('=== RUNNING ALL CURRICULUM GENERATORS ===');
scripts.forEach(script => {
  const fullPath = path.join(__dirname, script);
  console.log(`\n--> Running ${script}...`);
  try {
    const out = execSync(`node "${fullPath}"`, { encoding: 'utf8' });
    console.log(out.trim());
  } catch (err) {
    console.error(`Error running ${script}:`, err.message);
    process.exit(1);
  }
});

console.log('\n=========================================');
console.log('All 16 modules updated with separated single-topic micro-lessons!');
