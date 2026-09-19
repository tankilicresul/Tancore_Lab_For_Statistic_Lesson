const fs = require('fs');

console.log('Cleaning all lesson and module titles from raw LaTeX dollar signs to beautiful clean typography...');

function cleanTitleString(str) {
  if (!str) return str;
  return str
    // Fix dollar formulas
    .replace(/\(\$n!\$\)/g, '(n!)')
    .replace(/\$n!\$/g, '(n!)')
    .replace(/\(\$n-1\$\)/g, '(n-1)')
    .replace(/\$n-1\$/g, '(n-1)')
    .replace(/\(\$Q_1,\s*Q_2,\s*Q_3\$\)/g, '(Q₁, Q₂, Q₃)')
    .replace(/\$Q_1,\s*Q_2,\s*Q_3\$/g, '(Q₁, Q₂, Q₃)')
    .replace(/\(\$CV\$\)/g, '(CV)')
    .replace(/\$CV\$/g, '(CV)')
    .replace(/\(\$E\[X\]\$\)/g, 'E[X]')
    .replace(/\$E\[X\]\$/g, 'E[X]')
    .replace(/\(\$Var\(X\)\$\)/g, 'Var(X)')
    .replace(/\$Var\(X\)\$/g, 'Var(X)')
    .replace(/\(\$sigma\$\s*Bilinen\s*\/\s*\$Z\$\)/g, '(σ Bilinen / Z)')
    .replace(/\(\$sigma\$\s*Known\s*\/\s*\$Z\$\)/g, '(σ Known / Z)')
    .replace(/\(\$sigma\$\s*Bilinmeyen\)/g, '(σ Bilinmeyen)')
    .replace(/\(\$sigma\$\s*Unknown\)/g, '(σ Unknown)')
    .replace(/\(\$chi\^2\$\)/g, '(χ²)')
    .replace(/\$chi\^2\$/g, '(χ²)')
    .replace(/\(\$chi\^2_0\$\)/g, '(χ₀²)')
    .replace(/\(\$H_0\$\)/g, '(H₀)')
    .replace(/\$H_0\$/g, '(H₀)')
    .replace(/\(\$H_1\$\)/g, '(H₁)')
    .replace(/\$H_1\$/g, '(H₁)')
    .replace(/\(\$alpha\$\)/g, '(α)')
    .replace(/\$alpha\$/g, 'α')
    .replace(/\(\$\\beta\$\)/g, '(β)')
    .replace(/\$\\beta\$/g, 'β')
    .replace(/\(\$beta\$\)/g, '(β)')
    .replace(/\$beta\$/g, 'β')
    .replace(/\(\$F\$-Testi\)/g, '(F-Testi)')
    .replace(/\(\$F\$-Test\)/g, '(F-Test)')
    .replace(/\$F\$-İstatistiği/g, 'F-İstatistiği')
    .replace(/\$F\$-Statistic/g, 'F-Statistic')
    .replace(/\$F\$-Testi/g, 'F-Testi')
    .replace(/\$F\$-Test/g, 'F-Test')
    .replace(/\(\$r\$\)/g, '(r)')
    .replace(/\$r\$/g, 'r')
    .replace(/\(\$SST=SSR\+SSE\$\)\s*ve\s*\$R\^2\$/g, '(SST = SSR + SSE) ve R²')
    .replace(/\(\$SST=SSR\+SSE\$\)\s*and\s*\$R\^2\$/g, '(SST = SSR + SSE) and R²')
    .replace(/\$R\^2\$/g, 'R²')
    .replace(/\(\$VIF\$\)/g, '(VIF)')
    .replace(/\$VIF\$/g, '(VIF)')
    .replace(/\$C_p\$/g, 'Cp')
    .replace(/\$C_p\$/g, 'Cp')
    .replace(/\(\$P\$\)/g, '(P)')
    .replace(/\$P\$/g, '(P)')
    .replace(/\(\$pi\^\*\$\)/g, '(π*)')
    .replace(/\$pi\^\*\$/g, '(π*)')
    .replace(/\(\$N\$\)/g, '(N)')
    .replace(/\$N\$/g, '(N)')
    .replace(/\$lambda\$/g, 'λ')
    .replace(/\$lambda\$/g, 'λ')
    .replace(/\(\$N\(mu,\s*sigma\^2\)\$\)/g, '(N(μ, σ²))')
    .replace(/\$N\(mu,\s*sigma\^2\)\$/g, 'N(μ, σ²)')
    .replace(/\(\$Z\$\)/g, '(Z)')
    .replace(/\$Z\$/g, '(Z)')
    .replace(/\(Pooled\s*\$hat\{p\}\$\)/g, '(Pooled p̂)')
    .replace(/\$hat\{p\}\$/g, 'p̂')
    .replace(/\$E_\{ij\} < 5\$/g, 'Eᵢⱼ < 5')
    .replace(/\$E_\{ij\} < 5\$/g, 'Eᵢⱼ < 5')
    .replace(/\$SMA \/ WMA\$/g, 'SMA / WMA')
    // Remove any leftover raw $...$ surrounding anything in titles
    .replace(/\$([^$]+)\$/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

for (let i = 1; i <= 16; i++) {
  const file = `src/data/module${i}.json`;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));

  if (data.title) {
    if (data.title.tr) data.title.tr = cleanTitleString(data.title.tr);
    if (data.title.en) data.title.en = cleanTitleString(data.title.en);
  }

  if (data.lessons) {
    data.lessons.forEach(l => {
      if (l.title) {
        if (l.title.tr) l.title.tr = cleanTitleString(l.title.tr);
        if (l.title.en) l.title.en = cleanTitleString(l.title.en);
      }
    });
  }

  if (data.caseExams) {
    data.caseExams.forEach(c => {
      if (c.title) {
        if (c.title.tr) c.title.tr = cleanTitleString(c.title.tr);
        if (c.title.en) c.title.en = cleanTitleString(c.title.en);
      }
    });
  }

  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

console.log('All 16 module titles and lesson titles have been cleaned successfully.');
