const fs = require('fs');

console.log('Formatting all lesson and module titles with proper LaTeX syntax...');

function formatTitleToLatex(str) {
  if (!str) return str;
  let s = str;

  // Clean any previous broken formatting
  s = s
    .replace(/\(\$n!\$\)/g, '($n!$)')
    .replace(/\(n!\)/g, '($n!$)')
    .replace(/\(\$n-1\$\)/g, '($n-1$)')
    .replace(/\(n-1\)/g, '($n-1$)')
    .replace(/\(Q₁,\s*Q₂,\s*Q₃\)/g, '($Q_1, Q_2, Q_3$)')
    .replace(/\(Q_1,\s*Q_2,\s*Q_3\)/g, '($Q_1, Q_2, Q_3$)')
    .replace(/\(CV\)/g, '($CV$)')
    .replace(/E\[X\]/g, '$E[X]$')
    .replace(/Var\(X\)/g, '$\\text{Var}(X)$')
    .replace(/\(σ Bilinen \/ Z\)/g, '($\\sigma$ Bilinen / $Z$)')
    .replace(/\(σ Known \/ Z\)/g, '($\\sigma$ Known / $Z$)')
    .replace(/\(σ Bilinmeyen\)/g, '($\\sigma$ Bilinmeyen)')
    .replace(/\(σ Unknown\)/g, '($\\sigma$ Unknown)')
    .replace(/\(χ²\)/g, '($\\chi^2$)')
    .replace(/\(χ₀²\)/g, '($\\chi_0^2$)')
    .replace(/\(H₀\)/g, '($H_0$)')
    .replace(/\(H₁\)/g, '($H_1$)')
    .replace(/\(α\)/g, '($\\alpha$)')
    .replace(/\(β\)/g, '($\\beta$)')
    .replace(/\( eta\)/g, '($\\beta$)')
    .replace(/\(F-Testi\)/g, '($F$-Testi)')
    .replace(/\(F-Test\)/g, '($F$-Test)')
    .replace(/F-İstatistiği/g, '$F$-İstatistiği')
    .replace(/F-Statistic/g, '$F$-Statistic')
    .replace(/\(r\)/g, '($r$)')
    .replace(/\(SST = SSR \+ SSE\) ve R²/g, '($SST = SSR + SSE$) ve $R^2$')
    .replace(/\(SST = SSR \+ SSE\) and R²/g, '($SST = SSR + SSE$) and $R^2$')
    .replace(/Düzeltilmiş R²/g, 'Düzeltilmiş $R^2$')
    .replace(/Adjusted R²/g, 'Adjusted $R^2$')
    .replace(/\(VIF\)/g, '($VIF$)')
    .replace(/Mallows' Cp/g, "Mallows' $C_p$")
    .replace(/Mallows' C_p/g, "Mallows' $C_p$")
    .replace(/\(P\)/g, '($P$)')
    .replace(/\(π\*\)/g, '($\\pi^*$)')
    .replace(/\(N\)/g, '($N$)')
    .replace(/λ/g, '$\\lambda$')
    .replace(/\(N\(μ, σ²\)\)/g, '($N(\\mu, \\sigma^2)$)')
    .replace(/\(Z\)/g, '($Z$)')
    .replace(/\(Pooled p̂\)/g, '(Pooled $\\hat{p}$)')
    .replace(/\(Eᵢⱼ < 5 Kuralı\)/g, '($E_{ij} < 5$ Kuralı)')
    .replace(/\(Eᵢⱼ < 5 Rule\)/g, '($E_{ij} < 5$ Rule)')
    .replace(/\(Cohen's d\)/g, "(Cohen's $d$)");

  // Fix any double $$ created by replacements
  s = s.replace(/\$\$+/g, '$');
  s = s.replace(/\s+/g, ' ').trim();

  return s;
}

for (let i = 1; i <= 16; i++) {
  const file = `src/data/module${i}.json`;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));

  if (data.title) {
    if (data.title.tr) data.title.tr = formatTitleToLatex(data.title.tr);
    if (data.title.en) data.title.en = formatTitleToLatex(data.title.en);
  }

  if (data.lessons) {
    data.lessons.forEach(l => {
      if (l.title) {
        if (l.title.tr) l.title.tr = formatTitleToLatex(l.title.tr);
        if (l.title.en) l.title.en = formatTitleToLatex(l.title.en);
      }
    });
  }

  if (data.caseExams) {
    data.caseExams.forEach(c => {
      if (c.title) {
        if (c.title.tr) c.title.tr = formatTitleToLatex(c.title.tr);
        if (c.title.en) c.title.en = formatTitleToLatex(c.title.en);
      }
    });
  }

  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

console.log('All 16 module titles and lesson titles formatted with LaTeX successfully.');
