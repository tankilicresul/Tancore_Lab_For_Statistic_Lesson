const fs = require('fs');
const katex = require('katex');

let errorCount = 0;
let formulaCount = 0;

function checkLatexInText(text, loc) {
  if (!text || typeof text !== 'string') return;
  const blockRegex = /\$\$([\s\S]*?)\$\$/g;
  let match;
  while ((match = blockRegex.exec(text)) !== null) {
    formulaCount++;
    try {
      katex.renderToString(match[1].trim(), { displayMode: true, throwOnError: true });
    } catch (e) {
      console.error('KaTeX Block Error in ' + loc + ':\n  Formula: ' + match[1].trim() + '\n  Error: ' + e.message + '\n');
      errorCount++;
    }
  }

  const inlineRegex = /\$([^$\n]+)\$/g;
  while ((match = inlineRegex.exec(text)) !== null) {
    formulaCount++;
    try {
      katex.renderToString(match[1].trim(), { displayMode: false, throwOnError: true });
    } catch (e) {
      console.error('KaTeX Inline Error in ' + loc + ':\n  Formula: ' + match[1].trim() + '\n  Error: ' + e.message + '\n');
      errorCount++;
    }
  }
}

for(let i=1; i<=24; i++){
  const filePath = 'src/data/module'+i+'.json';
  if (!fs.existsSync(filePath)) continue;
  const mod = JSON.parse(fs.readFileSync(filePath));
  mod.lessons.forEach(l => {
    checkLatexInText(l.conceptCard?.tr, `Mod${i} Lesson ${l.id} conceptCard.tr`);
    checkLatexInText(l.conceptCard?.en, `Mod${i} Lesson ${l.id} conceptCard.en`);
    checkLatexInText(l.companyExample?.tr, `Mod${i} Lesson ${l.id} companyExample.tr`);
    checkLatexInText(l.companyExample?.en, `Mod${i} Lesson ${l.id} companyExample.en`);
    if (l.questions) {
      l.questions.forEach(q => {
        checkLatexInText(q.prompt?.tr, `Mod${i} Question ${q.id} prompt.tr`);
        checkLatexInText(q.explanation?.tr, `Mod${i} Question ${q.id} explanation.tr`);
      });
    }
  });
}

console.log(`\n========================================\nTested ${formulaCount} LaTeX formulas across all 24 modules.\nTotal KaTeX syntax errors: ${errorCount}\n========================================`);

