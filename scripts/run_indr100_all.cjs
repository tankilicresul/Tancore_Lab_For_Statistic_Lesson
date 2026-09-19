const { execSync } = require('child_process');
const path = require('path');

console.log('=== GENERATING ALL 8 INDR 100 MODULES (17 - 24) ===');

const scripts = [
  'generate_indr100_p1.cjs',
  'generate_indr100_p2.cjs',
  'generate_indr100_p3.cjs',
  'generate_indr100_p4.cjs',
  'generate_indr100_p5.cjs'
];

scripts.forEach(s => {
  console.log(`\n--> Running ${s}...`);
  const out = execSync(`node "${path.join(__dirname, s)}"`, { encoding: 'utf8' });
  console.log(out.trim());
});

console.log('\n=========================================');
console.log('All INDR 100 modules (17 to 24) successfully created!');
