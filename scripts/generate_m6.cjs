const fs = require('fs');
const path = require('path');
const modulesDir = path.join(__dirname, '../src/data');

function updateModule(num, newLessons) {
  const file = path.join(modulesDir, `module${num}.json`);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  data.lessons = newLessons;
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✓ Module ${num} written with ${newLessons.length} separated lessons.`);
}

// ==========================================
// MODULE 6: Tek Popülasyon Hipotez Testleri (9 Lessons)
// ==========================================
updateModule(6, [
  {
    id: "m6-l1", moduleId: "module-6", order: 1, difficulty: "basit",
    title: { tr: "Sıfır ($H_0$) ve Alternatif ($H_1$) Hipotez Kurgusu", en: "Hypothesis Formulation ($H_0$ & $H_1$)" },
    conceptCard: {
      tr: "Hipotez testinde iddialar iki karşıt hipotezle ifade edilir:\n\n1. **Sıfır Hipotezi ($H_0$):** Değişiklik, fark veya etki olmadığını savunan statüko hipotezidir ($=, \\le, \\ge$).\n2. **Alternatif Hipotez ($H_1$ veya $H_a$):** Kanıtlamaya çalıştığımız araştırma hipotezidir ($\\ne, <, >$).",
      en: "Null ($H_0$) asserts status quo (no effect). Alternative ($H_1$) is the research hypothesis claiming an effect."
    },
    companyExample: {
      tr: "**Örnek Soru:** Yeni bir algoritmanın sayfa yükleme süresini (eski ortalama 2.0 sn) kısalttığını iddia ediyoruz. Hipotezler nedir?\n\n**Çözüm:**\n$$H_0: \\mu \\ge 2.0 \\text{ sn} \\quad \\text{vs.} \\quad H_1: \\mu < 2.0 \\text{ sn (Sol Kuyruk Testi)}$$",
      en: "**Worked Example:** Claiming speedup yields $H_0: \\mu \\ge 2.0$ vs $H_1: \\mu < 2.0$."
    },
    vocabTerms: [{ term_en: "null vs. alternative hypothesis", explanation_tr: "Sıfır hipotezi farksızlığı (statükoyu), alternatif hipotez ise kanıtlanmak istenen iddiayı savunur.", explanation_en: "Null represents no effect; alternative represents the research claim.", exampleSentence_en: "We seek sufficient evidence to reject the null hypothesis." }],
    questions: [{
      id: "m6-l1-q1", type: "multiple-choice",
      prompt: { tr: "Eşitlik işareti ($=, \\le, \\ge$) daima hangi hipotezde yer alır?", en: "Which hypothesis always contains the equality sign?" },
      options: [
        { tr: "Sıfır Hipotezi (H0)", en: "Null Hypothesis (H0)" },
        { tr: "Alternatif Hipotez (H1)", en: "Alternative Hypothesis (H1)" },
        { tr: "P-Değeri", en: "P-Value" },
        { tr: "Serbestlik Derecesi", en: "Degrees of Freedom" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Eşitlik daima sıfır hipotezinde ($H_0$) yer alır.", en: "The equality sign is always assigned to the null hypothesis ($H_0$)." }
    }],
    realWorldBox: { excelFormula: "=EĞER(p < alpha, \"H0 Red\", \"H0 Reddedilemez\")", pythonCode: "# Set up hypotheses\nH0 = 'mu == 2.0'\nH1 = 'mu < 2.0'", powerBiNote: { tr: "Hipotez karar göstergesi", en: "Hypothesis test decision card" } }
  },
  {
    id: "m6-l2", moduleId: "module-6", order: 2, difficulty: "orta",
    title: { tr: "Tip 1 Hatası ($\\alpha$) ve Anlamlılık Düzeyi", en: "Type 1 Error & Significance Level ($\\alpha$)" },
    conceptCard: {
      tr: "**Tip 1 Hatası (Üretici Riski / Yalancı Pozitif):** Gerçekte doğru olan bir sıfır hipotezini ($H_0$) yanlışlıkla reddetme hatasıdır:\n\n$$\\alpha = P(\\text{Tip 1 Hatası}) = P(\\text{Red } H_0 \\mid H_0 \\text{ Doğru})$$\n\n$\\alpha$ **Anlamlılık Düzeyi (Significance Level)** olarak adlandırılır (Genellikle %5 veya %1 seçilir).",
      en: "Type 1 Error is rejecting a true null hypothesis (False Positive). Probability is $\\alpha$."
    },
    companyExample: {
      tr: "**Örnek Soru:** Masum bir sanığın mahkemede suçlu bulunup mahkum edilmesi hangi hata türüdür?\n\n**Çözüm:** $H_0$: 'Sanık Masumdur' doğruyken reddedilip ceza verildiği için **Tip 1 Hatası (Yalancı Pozitif)**dır.",
      en: "**Worked Example:** Convicting an innocent defendant is a Type 1 Error."
    },
    vocabTerms: [{ term_en: "Type 1 Error (alpha)", explanation_tr: "Gerçekte doğru olan sıfır hipotezini reddetme hatası (Yalancı Pozitif).", explanation_en: "The rejection of a true null hypothesis (false positive).", exampleSentence_en: "Significance level alpha is set to 0.05 to cap Type 1 error rate." }],
    questions: [{
      id: "m6-l2-q1", type: "multiple-choice",
      prompt: { tr: "Gerçekte fark yokken 'fark vardır' diyerek $H_0$'ı reddetmek hangi hata türüdür?", en: "Rejecting $H_0$ when there is actually no effect is which error type?" },
      options: [
        { tr: "Tip 1 Hatası (Alfa)", en: "Type 1 Error (Alpha)" },
        { tr: "Tip 2 Hatası (Beta)", en: "Type 2 Error (Beta)" },
        { tr: "Örnekleme Hatası", en: "Sampling Error" },
        { tr: "Ölçüm Hatası", en: "Measurement Error" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Doğru $H_0$'ı reddetmek Tip 1 (Alfa) hatasıdır.", en: "Rejecting a true null is a Type 1 Error." }
    }],
    realWorldBox: { excelFormula: "=alpha", pythonCode: "alpha = 0.05", powerBiNote: { tr: "Anlamlılık düzeyi eşiği (%5)", en: "Significance threshold (5%)" } }
  },
  {
    id: "m6-l3", moduleId: "module-6", order: 3, difficulty: "orta",
    title: { tr: "Tip 2 Hatası ($\\beta$) ve Testin Gücü ($1-\\beta$)", en: "Type 2 Error & Statistical Power ($1-\\beta$)" },
    conceptCard: {
      tr: "1. **Tip 2 Hatası ($\\beta$ / Tüketici Riski):** Gerçekte yanlış olan bir $H_0$'ı reddedememe (farkı kaçırma) hatasıdır.\n\n2. **Testin Gücü ($1 - \\beta$):** Gerçekte var olan bir etkiyi/farkı doğru tespit edebilme olasılığıdır:\n$$\\text{Güç} = 1 - \\beta$$\n\nÖrneklem büyüklüğü ($n$) arttıkça testin gücü artar.",
      en: "Type 2 Error ($\\beta$) fails to reject a false $H_0$ (False Negative). Statistical Power is $1 - \\beta$."
    },
    companyExample: {
      tr: "**Örnek Soru:** Bir A/B testinde yeni tasarım %10 daha iyi olmasına rağmen test yetersiz örneklem yüzünden farkı tespit edememiştir. Bu ne tür bir hatadır?\n\n**Çözüm:** Var olan fark kaçırıldığı için **Tip 2 Hatası (Yalancı Negatif / $\\beta$)**dır.",
      en: "**Worked Example:** Missing a true conversion lift is a Type 2 Error."
    },
    vocabTerms: [{ term_en: "statistical power (1 - beta)", explanation_tr: "Gerçekte var olan bir farkı veya etkiyi doğru şekilde tespit edebilme olasılığı ($1-\\beta$).", explanation_en: "The probability of correctly rejecting a false null hypothesis.", exampleSentence_en: "We targeted 80% statistical power in our A/B test design." }],
    questions: [{
      id: "m6-l3-q1", type: "numeric",
      prompt: { tr: "Bir hipotez testinde Tip 2 hata olasılığı $\\beta = 0.20$ olduğuna göre testin gücü ($1 - \\beta$) kaçtır?", en: "If $\\beta = 0.20$, what is the statistical power ($1 - \\beta$)?" },
      correctAnswer: 0.8,
      explanation: { tr: "$$\\text{Güç} = 1 - 0.20 = 0.80 \\quad (\\%80)$$", en: "$$\\text{Power} = 1 - 0.20 = 0.80$$" }
    }],
    realWorldBox: { excelFormula: "=1 - beta", pythonCode: "from statsmodels.stats.power import TTestIndPower\npower = TTestIndPower().solve_power(effect_size=0.5, nobs1=50, alpha=0.05)", powerBiNote: { tr: "Test güç grafiği", en: "Statistical power curve" } }
  },
  {
    id: "m6-l4", moduleId: "module-6", order: 4, difficulty: "orta",
    title: { tr: "Test İstatistiği, Kritik Değer ve Red Bölgesi", en: "Test Statistics & Critical Values" },
    conceptCard: {
      tr: "Geleneksel karar yöntemi:\n\n1. **Kritik Değer ($z_{\\text{kritik}}$ veya $t_{\\text{kritik}}$):** $\\alpha$ anlamlılık düzeyine göre tablodan belirlenen sınır değerdir.\n2. **Hesaplanan Test İstatistiği ($z_{\\text{hesap}}$):** Örneklem verisinden hesaplanır.\n\n- Hesaplanan değer red bölgesine düşerse ($|z_{\\text{hesap}}| > z_{\\text{kritik}}$) $\\implies$ **$H_0$ REDDEDİLİR**.",
      en: "Critical Value approach: Reject $H_0$ if test statistic falls in the critical region ($|z_{\\text{stat}}| > z_{\\text{crit}}$)."
    },
    companyExample: {
      tr: "**Örnek Soru:** Çift kuyruklu testte $z_{\\text{kritik}} = 1.96$ ve $z_{\\text{hesap}} = 2.45$'tir. Karar nedir?\n\n**Çözüm:** $2.45 > 1.96$ olduğundan test istatistiği red bölgesindedir; **$H_0$ Reddedilir**.",
      en: "**Worked Example:** $2.45 > 1.96 \\implies$ Reject $H_0$."
    },
    vocabTerms: [{ term_en: "rejection region (critical region)", explanation_tr: "Test istatistiğinin düştüğü takdirde H0 hipotezinin reddedileceği değerler kümesi.", explanation_en: "The set of values of the test statistic for which the null hypothesis is rejected.", exampleSentence_en: "The test statistic fell far into the right-tail rejection region." }],
    questions: [{
      id: "m6-l4-q1", type: "multiple-choice",
      prompt: { tr: "Hesaplanan test istatistiği kritik değerden daha aşırı (red bölgesinde) ise ne karar verilir?", en: "What decision is made if the test statistic falls in the rejection region?" },
      options: [
        { tr: "H0 Reddedilir", en: "Reject H0" },
        { tr: "H0 Kesinlikle Doğrudur", en: "Accept H0 as absolute truth" },
        { tr: "Test geçersiz sayılır", en: "Test is invalid" },
        { tr: "Örneklem büyüklüğü sıfırlanır", en: "Sample size is reset" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Red bölgesine düşüş, gözlemin şans eseri olamayacak kadar sıfır hipotezine aykırı olduğunu gösterir ($H_0$ Reddedilir).", en: "Rejection region indicates significant deviation from null ($H_0$ is rejected)." }
    }],
    realWorldBox: { excelFormula: "=NORM.S.TERS(1 - alpha/2)", pythonCode: "z_crit = norm.ppf(1 - alpha/2)", powerBiNote: { tr: "Kritik eşik çizgisi göstergesi", en: "Critical threshold line visual" } }
  },
  {
    id: "m6-l5", moduleId: "module-6", order: 5, difficulty: "orta",
    title: { tr: "$p$-Değeri Yöntemi ve Karar Alma", en: "$p$-Value Approach & Decisions" },
    conceptCard: {
      tr: "**$p$-Değeri (p-value):** $H_0$ doğruyken, elimizdeki örneklem kadar veya daha aşırı bir sonuç elde etme olasılığıdır.\n\n**Altın Karar Kuralı:**\n- **$p < \\alpha \\implies$ $H_0$ REDDEDİLİR** (İstatiksel olarak anlamlı fark var!)\n- **$p \\ge \\alpha \\implies$ $H_0$ REDDEDİLEMEZ** (Fark şans eseridir)\n\n'p küçüktür alfa, H0 güle güle!'",
      en: "$p$-value is the probability of obtaining results at least as extreme as observed assuming $H_0$ is true. If $p < \\alpha \\implies$ Reject $H_0$."
    },
    companyExample: {
      tr: "**Örnek Soru:** $\\alpha = 0.05$ için bir testte $p = 0.012$ bulunmuştur. Karar nedir?\n\n**Çözüm:** $p = 0.012 < 0.05$ olduğu için **$H_0$ REDDEDİLİR**.",
      en: "**Worked Example:** $p = 0.012 < 0.05 \\implies$ Reject $H_0$."
    },
    vocabTerms: [{ term_en: "p-value", explanation_tr: "Gözlemlenen sonucun sıfır hipotezi altında şans eseri ortaya çıkma olasılığı.", explanation_en: "The probability of obtaining test results at least as extreme as the results actually observed.", exampleSentence_en: "A p-value of 0.012 provides strong evidence against the null hypothesis." }],
    questions: [{
      id: "m6-l5-q1", type: "multiple-choice",
      prompt: { tr: "$p = 0.03$ ve $\\alpha = 0.05$ olduğuna göre karar nedir?", en: "What is the decision for $p = 0.03$ and $\\alpha = 0.05$?" },
      options: [
        { tr: "H0 Reddedilir (p < alpha)", en: "Reject H0 (p < alpha)" },
        { tr: "H0 Reddedilemez", en: "Fail to reject H0" },
        { tr: "Hipotez testi uygulanamaz", en: "Cannot test" },
        { tr: "Alfa artırılmalıdır", en: "Alpha must increase" }
      ],
      correctAnswer: 0,
      explanation: { tr: "$p < \\alpha$ ($0.03 < 0.05$) olduğu için sıfır hipotezi reddedilir.", en: "Because $p < \\alpha$, $H_0$ is rejected." }
    }],
    realWorldBox: { excelFormula: "=2*(1 - NORM.S.DAĞ(ABS(z), DOĞRU))", pythonCode: "p_val = 2 * (1 - norm.cdf(abs(z_stat)))", powerBiNote: { tr: "P-değeri anlamlılık rozeti", en: "P-value significance badge" } }
  },
  {
    id: "m6-l6", moduleId: "module-6", order: 6, difficulty: "orta",
    title: { tr: "Tek Örneklem $Z$-Testi ($\\sigma$ Bilinen)", en: "One-Sample $Z$-Test ($\\sigma$ Known)" },
    conceptCard: {
      tr: "Popülasyon standart sapması $\\sigma$ bilindiğinde tek bir kitle ortalamasını $\\mu_0$ hedef değeriyle test eder:\n\n$$Z = \\frac{\\bar{X} - \\mu_0}{\\sigma / \\sqrt{n}}$$",
      en: "One-sample $Z$-test for mean with known variance: $Z = \\frac{\\bar{X} - \\mu_0}{\\sigma / \\sqrt{n}}$."
    },
    companyExample: {
      tr: "**Örnek Soru:** $\\mu_0 = 50, \\sigma = 10, n = 25, \\bar{x} = 54$. $Z$-istatistiği nedir?\n\n**Çözüm:**\n$$Z = \\frac{54 - 50}{10 / \\sqrt{25}} = \\frac{4}{2} = 2.00$$",
      en: "**Worked Example:** $Z = (54 - 50) / (10/5) = 2.00$."
    },
    vocabTerms: [{ term_en: "one-sample Z-test", explanation_tr: "Popülasyon standart sapması bilindiğinde örneklem ortalamasını hedef değere kıyaslayan test.", explanation_en: "Hypothesis test comparing sample mean to known reference mean with known $\\sigma$.", exampleSentence_en: "A one-sample Z-test confirmed the packaging weight meets legal standards." }],
    questions: [{
      id: "m6-l6-q1", type: "numeric",
      prompt: { tr: "$\\bar{x} = 105, \\mu_0 = 100, \\sigma = 10, n = 100$ için $Z$-istatistiği kaçtır ($5 / (10/10)$)?", en: "Calculate Z-statistic for $\\bar{x}=105, \\mu_0=100, \\sigma=10, n=100$." },
      correctAnswer: 5,
      explanation: { tr: "$$Z = \\frac{105 - 100}{10 / 10} = \\frac{5}{1} = 5.0$$", en: "$$Z = 5 / 1 = 5.0$$" }
    }],
    realWorldBox: { excelFormula: "=(x_bar - mu0) / (sigma / KAREKÖK(n))", pythonCode: "z_stat = (mean - mu0) / (sigma / np.sqrt(n))", powerBiNote: { tr: "Hedef kıyaslama Z-skoru", en: "Target benchmark Z-score" } }
  },
  {
    id: "m6-l7", moduleId: "module-6", order: 7, difficulty: "orta",
    title: { tr: "Tek Örneklem $t$-Testi ($\\sigma$ Bilinmeyen)", en: "One-Sample $t$-Test ($\\sigma$ Unknown)" },
    conceptCard: {
      tr: "Popülasyon varyansı bilinmediğinde örneklem standart sapması $s$ ile uygulanır ($df = n-1$):\n\n$$t = \\frac{\\bar{X} - \\mu_0}{s / \\sqrt{n}}$$",
      en: "One-sample $t$-test using sample standard deviation: $t = \\frac{\\bar{X} - \\mu_0}{s / \\sqrt{n}}$ with $df = n-1$."
    },
    companyExample: {
      tr: "**Örnek Soru:** $\\bar{x} = 22, \\mu_0 = 20, s = 4, n = 16$. $t$-istatistiği nedir?\n\n**Çözüm:**\n$$t = \\frac{22 - 20}{4 / \\sqrt{16}} = \\frac{2}{1} = 2.00 \\quad (df = 15)$$",
      en: "**Worked Example:** $t = (22 - 20) / (4/4) = 2.00$ with $df = 15$."
    },
    vocabTerms: [{ term_en: "one-sample t-test", explanation_tr: "Bilinmeyen varyans altında örneklem ortalamasını hedef değere kıyaslayan test.", explanation_en: "Statistical test comparing sample mean to known mean using estimated variance.", exampleSentence_en: "The one-sample t-test evaluated whether average battery life equals 20 hours." }],
    questions: [{
      id: "m6-l7-q1", type: "numeric",
      prompt: { tr: "$\\bar{x} = 33, \\mu_0 = 30, s = 6, n = 36$ için $t$-istatistiği kaçtır ($3 / (6/6)$)?", en: "Calculate t-statistic for $\\bar{x}=33, \\mu_0=30, s=6, n=36$." },
      correctAnswer: 3,
      explanation: { tr: "$$t = \\frac{33 - 30}{6 / 6} = \\frac{3}{1} = 3.0$$", en: "$$t = 3 / 1 = 3.0$$" }
    }],
    realWorldBox: { excelFormula: "=T.TEST(A1:A36, 30, 2, 1)", pythonCode: "from scipy.stats import ttest_1samp\nt_stat, p_val = ttest_1samp(data, popmean=30)", powerBiNote: { tr: "Tekil grup t-test analitiği", en: "Single-sample t-test visual" } }
  },
  {
    id: "m6-l8", moduleId: "module-6", order: 8, difficulty: "orta",
    title: { tr: "Tek Popülasyon Oran Testi ($Z$)", en: "One-Sample Proportion Test ($Z$)" },
    conceptCard: {
      tr: "Örneklem oranı $\\hat{p}$'yi hedef oran $p_0$ ile test eder:\n\n$$Z = \\frac{\\hat{p} - p_0}{\\sqrt{\\frac{p_0(1 - p_0)}{n}}}$$\n\n(Paydada sıfır hipotezindeki $p_0$ kullanılır).",
      en: "One-sample proportion test: $Z = \\frac{\\hat{p} - p_0}{\\sqrt{p_0(1-p_0)/n}}$."
    },
    companyExample: {
      tr: "**Örnek Soru:** $p_0 = 0.50$, $n = 100$, $\\hat{p} = 0.60$. $Z$-istatistiği nedir?\n\n**Çözüm:**\n$$\\text{SE} = \\sqrt{\\frac{0.50 \\times 0.50}{100}} = \\frac{0.50}{10} = 0.05$$\n$$Z = \\frac{0.60 - 0.50}{0.05} = \\frac{0.10}{0.05} = 2.00$$",
      en: "**Worked Example:** $Z = (0.60 - 0.50) / 0.05 = 2.00$."
    },
    vocabTerms: [{ term_en: "one-sample proportion test", explanation_tr: "Bir kategori oranının hedef referans oranına eşit olup olmadığını test eden Z-testi.", explanation_en: "Hypothesis test comparing a sample proportion to a hypothesized population proportion.", exampleSentence_en: "We tested whether the conversion rate exceeds the 5% industry benchmark." }],
    questions: [{
      id: "m6-l8-q1", type: "numeric",
      prompt: { tr: "$\\hat{p} = 0.56, p_0 = 0.50, \\text{SE} = 0.02$ için $Z$-istatistiği kaçtır ($0.06 / 0.02$) ?", en: "Calculate Z-statistic for $\\hat{p}=0.56, p_0=0.50, \\text{SE}=0.02$." },
      correctAnswer: 3,
      explanation: { tr: "$$Z = \\frac{0.56 - 0.50}{0.02} = \\frac{0.06}{0.02} = 3.0$$", en: "$$Z = 0.06 / 0.02 = 3.0$$" }
    }],
    realWorldBox: { excelFormula: "=(p_hat - p0) / KAREKÖK(p0*(1-p0)/n)", pythonCode: "from statsmodels.stats.proportion import proportions_ztest\nz_stat, p_val = proportions_ztest(count, nobs, value=p0)", powerBiNote: { tr: "Dönüşüm oranı hedef testi", en: "Conversion rate proportion test" } }
  },
  {
    id: "m6-l9", moduleId: "module-6", order: 9, difficulty: "ileri",
    title: { tr: "Tek Popülasyon Varyans Testi ($\\chi^2$)", en: "One-Sample Variance Test ($\\chi^2$)" },
    conceptCard: {
      tr: "Popülasyon varyansı $\\sigma^2$'nin hedef varyans $\\sigma_0^2$'ye eşitliğini test eder ($df = n-1$):\n\n$$\\chi^2 = \\frac{(n-1)s^2}{\\sigma_0^2}$$",
      en: "One-sample variance test using Chi-Square distribution: $\\chi^2 = \\frac{(n-1)s^2}{\\sigma_0^2}$ with $df=n-1$."
    },
    companyExample: {
      tr: "**Örnek Soru:** $n = 21, s^2 = 15, \\sigma_0^2 = 10$. $\\chi^2$ test istatistiği nedir?\n\n**Çözüm:**\n$$\\chi^2 = \\frac{(21-1) \\times 15}{10} = \\frac{20 \\times 15}{10} = \\frac{300}{10} = 30$$",
      en: "**Worked Example:** $\\chi^2 = 20 \\times 15 / 10 = 30$."
    },
    vocabTerms: [{ term_en: "Chi-Square variance test", explanation_tr: "Süreç değişkenliğinin belirlenen tolerans varyansını aşıp aşmadığını test eden yöntem.", explanation_en: "Hypothesis test evaluating whether population variance matches a target value.", exampleSentence_en: "Quality engineers use the Chi-Square variance test to ensure precision." }],
    questions: [{
      id: "m6-l9-q1", type: "numeric",
      prompt: { tr: "$n = 11, s^2 = 8, \\sigma_0^2 = 4$ için $\\chi^2$ istatistiği ($10 \\times 8 / 4$) kaçtır?", en: "Calculate $\\chi^2$ statistic for $n=11, s^2=8, \\sigma_0^2=4$." },
      correctAnswer: 20,
      explanation: { tr: "$$\\chi^2 = \\frac{10 \\times 8}{4} = \\frac{80}{4} = 20$$", en: "$$\\chi^2 = 80/4 = 20$$" }
    }],
    realWorldBox: { excelFormula: "=(n-1)*s2 / sigma0_sq", pythonCode: "chi2_stat = (n-1)*s2 / sigma0_sq", powerBiNote: { tr: "Kalite kontrol varyans testi", en: "Variance quality control chart" } }
  }
]);

console.log('Finished Module 6.');
