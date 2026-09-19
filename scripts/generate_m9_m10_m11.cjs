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
// MODULE 9: ANOVA & Model Seçimi (10 Lessons)
// ==========================================
updateModule(9, [
  {
    id: "m9-l1", moduleId: "module-9", order: 1, difficulty: "basit",
    title: { tr: "Çoklu Grup Kıyaslama ve Tip 1 Hata Şişmesi", en: "Multiple Comparisons & Error Inflation" },
    conceptCard: {
      tr: "3 veya daha fazla grubu ikili $t$-testleriyle arka arkaya kıyaslamak genel Tip 1 hata oranını katlayarak şişirir:\n\n$$\\alpha_{\\text{aile}} = 1 - (1 - \\alpha)^C, \\quad C = \\binom{k}{2}$$\n\nÖrneğin 5 grup için $C = 10$ test yapılır ve hata payı $\\%5$'ten **$\\%40.1$'e fırlar**. Bu yüzden tüm gruplar tek bir **ANOVA** testiyle topluca test edilmelidir.",
      en: "Multiple pairwise t-tests inflate familywise error rate: $\\alpha_{\\text{family}} = 1 - (1-\\alpha)^C$. ANOVA controls this by testing all groups simultaneously."
    },
    companyExample: {
      tr: "**Örnek Soru:** 4 farklı web sayfası tasarımını ikili testlerle kıyaslamak için kaç farklı test gerekir?\n\n**Çözüm:** $C = \\binom{4}{2} = \\frac{4 \\times 3}{2} = 6$ test gerekir (Hata oranı %26'ya şişer).",
      en: "**Worked Example:** 4 variants require $\\binom{4}{2} = 6$ pairwise comparisons."
    },
    vocabTerms: [{ term_en: "familywise error rate", explanation_tr: "Birden fazla hipotez testi yapıldığında en az birinde Tip 1 hatası yapma kümülatif olasılığı.", explanation_en: "The probability of making one or more false discoveries among all hypotheses tested.", exampleSentence_en: "ANOVA prevents familywise error rate inflation." }],
    questions: [{
      id: "m9-l1-q1", type: "numeric",
      prompt: { tr: "5 farklı tedavi grubunu ikişerli karşılaştırmak için kaç ikili test ($\\binom{5}{2}$) gerekir?", en: "How many pairwise tests are needed for 5 groups ($\\binom{5}{2}$)?" },
      correctAnswer: 10,
      explanation: { tr: "$$\\binom{5}{2} = \\frac{5 \\times 4}{2} = 10$$", en: "$$\\binom{5}{2} = 10$$" }
    }],
    realWorldBox: { excelFormula: "=1 - (1 - 0.05)^10", pythonCode: "family_alpha = 1 - (1 - 0.05)**math.comb(k, 2)", powerBiNote: { tr: "Çoklu varyant A/B test paneli", en: "Multi-arm bandit A/B testing visual" } }
  },
  {
    id: "m9-l2", moduleId: "module-9", order: 2, difficulty: "orta",
    title: { tr: "Tek Yönlü ANOVA (One-Way ANOVA) Mantığı", en: "One-Way ANOVA Logic" },
    conceptCard: {
      tr: "3 veya daha fazla grup ortalamasının eşitliğini ($H_0: \\mu_1 = \\mu_2 = \\dots = \\mu_k$) test eder:\n\nToplam varyansı iki kaynağa ayırır:\n1. **Gruplar Arası Varyans (Between Groups):** Grupların uygulanan işlemden kaynaklanan farkları.\n2. **Grup İçi Varyans (Within Groups / Error):** Rastgele örnekleme gürültüsü.",
      en: "One-Way ANOVA tests $H_0: \\mu_1 = \\dots = \\mu_k$ by partitioning variance into Between-group and Within-group sources."
    },
    companyExample: {
      tr: "**Örnek Soru:** 3 farklı pazarlama kanalının (SEO, Sosyal Medya, E-posta) getirdiği ortalama sepet tutarları eşit midir?\n\n**Çözüm:** $H_0: \\mu_{\\text{SEO}} = \\mu_{\\text{Sosyal}} = \\mu_{\\text{E-posta}}$ hipotezi Tek Yönlü ANOVA ile test edilir.",
      en: "**Worked Example:** Testing mean basket size across 3 marketing channels uses One-Way ANOVA."
    },
    vocabTerms: [{ term_en: "Analysis of Variance (ANOVA)", explanation_tr: "Üç veya daha fazla grup ortalamasının eşitliğini varyans oranları üzerinden test eden yöntem.", explanation_en: "Statistical method used to test differences between two or more means.", exampleSentence_en: "One-Way ANOVA confirmed a significant difference between regional stores." }],
    questions: [{
      id: "m9-l2-q1", type: "multiple-choice",
      prompt: { tr: "Tek Yönlü ANOVA'nın sıfır hipotezi ($H_0$) nedir?", en: "What is the null hypothesis of One-Way ANOVA?" },
      options: [
        { tr: "Tüm grup ortalamaları birbirine eşittir (mu1 = mu2 = ... = muk)", en: "All group means are equal" },
        { tr: "Tüm varyanslar sıfırdır", en: "All variances are zero" },
        { tr: "Hiçbir grup birbirine eşit değildir", en: "No groups are equal" },
        { tr: "Ortalamaların toplamı birdir", en: "Sum of means is 1" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Sıfır hipotezi tüm grupların aynı popülasyon ortalamasından geldiğini savunur.", en: "Null hypothesis states equality of all group means." }
    }],
    realWorldBox: { excelFormula: "=ANOVA: TEK ETKEN", pythonCode: "from scipy.stats import f_oneway\nf_stat, p_val = f_oneway(g1, g2, g3)", powerBiNote: { tr: "Kanal bazlı sepet ortalaması matrisi", en: "Channel cohort performance visual" } }
  },
  {
    id: "m9-l3", moduleId: "module-9", order: 3, difficulty: "orta",
    title: { tr: "ANOVA $F$-İstatistiği ve Tablo Hesabı", en: "ANOVA $F$-Statistic & Table" },
    conceptCard: {
      tr: "ANOVA $F$-oranı:\n\n$$F = \\frac{\\text{MSB}}{\\text{MSW}} = \\frac{\\text{SSB} / (k - 1)}{\\text{SSW} / (N - k)}$$\n\n- $\\text{MSB}$: Gruplar arası ortalama kare\n- $\\text{MSW}$: Grup içi ortalama kare (Hata)\n\n$F > F_{\\text{kritik}}$ ($p < 0.05$) ise en az bir grubun ortalaması diğerlerinden farklıdır.",
      en: "ANOVA $F$-statistic: $F = \\frac{\\text{MSB}}{\\text{MSW}} = \\frac{\\text{SSB}/(k-1)}{\\text{SSW}/(N-k)}$."
    },
    companyExample: {
      tr: "**Örnek Soru:** $\\text{MSB} = 80, \\text{MSW} = 10$. $F$-değeri nedir?\n\n**Çözüm:** $F = 80 / 10 = 8.00$.",
      en: "**Worked Example:** $F = 80 / 10 = 8.00$."
    },
    vocabTerms: [{ term_en: "mean square between (MSB)", explanation_tr: "Gruplar arası kareler toplamının serbestlik derecesine bölünmesiyle bulunan işlem varyansı.", explanation_en: "Variance estimate based on the differences between group means.", exampleSentence_en: "A large MSB relative to MSW produces a significant F-statistic." }],
    questions: [{
      id: "m9-l3-q1", type: "numeric",
      prompt: { tr: "$\\text{MSB} = 90$ ve $\\text{MSW} = 18$ olduğuna göre ANOVA $F$-istatistiği ($90 / 18$) kaçtır?", en: "Calculate ANOVA F-statistic for $\\text{MSB}=90, \\text{MSW}=18$." },
      correctAnswer: 5,
      explanation: { tr: "$$F = \\frac{90}{18} = 5.0$$", en: "$$F = 90 / 18 = 5.0$$" }
    }],
    realWorldBox: { excelFormula: "=MSB / MSW", pythonCode: "import statsmodels.api as sm\nfrom statsmodels.formula.api import ols\nanova_table = sm.stats.anova_lm(ols('sales ~ C(channel)', data=df).fit())", powerBiNote: { tr: "ANOVA özet tablosu", en: "ANOVA summary table" } }
  },
  {
    id: "m9-l4", moduleId: "module-9", order: 4, difficulty: "orta",
    title: { tr: "ANOVA Varsayımları & Levene Testi", en: "ANOVA Assumptions & Levene's Test" },
    conceptCard: {
      tr: "ANOVA'nın geçerli olması için 3 varsayım gereklidir:\n\n1. **Normallik:** Her gruptaki gözlemler Normal dağılmalıdır.\n2. **Bağımsızlık:** Gözlemler birbirinden bağımsız olmalıdır.\n3. **Varyans Homojenliği (Homoscedasticity):** Tüm grupların varyansları eşit olmalıdır ($\\sigma_1^2 = \\dots = \\sigma_k^2$). Bu varsayım **Levene Testi** ile doğrulanır.",
      en: "ANOVA requires Normality, Independence, and Homogeneity of Variances (tested via Levene's test)."
    },
    companyExample: {
      tr: "**Örnek Soru:** Levene testinde $p = 0.42$ ($p > 0.05$) bulunmuştur. Varyans homojenliği sağlanmış mıdır?\n\n**Çözüm:** $p > 0.05$ olduğu için $H_0$ reddedilemez; varyanslar homojendir ve ANOVA güvenle uygulanabilir.",
      en: "**Worked Example:** Levene $p = 0.42 > 0.05$ confirms equal variances."
    },
    vocabTerms: [{ term_en: "Levene's test", explanation_tr: "İki veya daha fazla grubun varyanslarının homojenliğini test eden güvenilir yöntem.", explanation_en: "Inferential statistic used to assess the equality of variances for a variable calculated for two or more groups.", exampleSentence_en: "Levene's test verified variance homogeneity prior to running ANOVA." }],
    questions: [{
      id: "m9-l4-q1", type: "multiple-choice",
      prompt: { tr: "Gruplar arası varyansların eşit olup olmadığını test etmek için hangi test kullanılır?", en: "Which test evaluates the equality of variances across groups?" },
      options: [
        { tr: "Levene Testi", en: "Levene's Test" },
        { tr: "Durbin-Watson Testi", en: "Durbin-Watson Test" },
        { tr: "Z-Testi", en: "Z-Test" },
        { tr: "Cook's Distance", en: "Cook's Distance" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Varyans homojenliği Levene testi ile kontrol edilir.", en: "Levene's test evaluates homogeneity of variance." }
    }],
    realWorldBox: { excelFormula: "=VARYANS.HOMOJENLİK()", pythonCode: "from scipy.stats import levene\nstat, p_val = levene(g1, g2, g3)", powerBiNote: { tr: "Grup varyans karşılaştırma kutusu", en: "Group variance boxplot" } }
  },
  {
    id: "m9-l5", moduleId: "module-9", order: 5, difficulty: "orta",
    title: { tr: "Post-Hoc Testleri: Tukey HSD", en: "Post-Hoc Tests: Tukey's HSD" },
    conceptCard: {
      tr: "ANOVA testi anlamlı çıktığında ($p < 0.05$), 'Hangi grupların birbirinden farklı olduğunu' bulmak için **Tukey HSD (Honestly Significant Difference)** testi yapılır:\n\n$$\\text{HSD} = q_{\\alpha, k, N-k} \\sqrt{\\frac{\\text{MSW}}{n}}$$\n\nİki grup ortalaması arasındaki fark HSD'den büyükse ($|\\bar{x}_i - \\bar{x}_j| > \\text{HSD}$), aralarındaki fark istatistiksel olarak anlamlıdır.",
      en: "Tukey's HSD identifies which specific pairs of group means differ significantly while controlling familywise error."
    },
    companyExample: {
      tr: "**Örnek Soru:** $\\text{HSD} = 4.2$. A grubu ortalaması 50, B grubu ortalaması 56. Fark ($6.0$) anlamlı mıdır?\n\n**Çözüm:** $|56 - 50| = 6.0 > 4.2$ olduğu için A ve B grupları arasındaki fark istatistiksel olarak anlamlıdır.",
      en: "**Worked Example:** Difference $6.0 > 4.2$ confirms a significant pairwise difference."
    },
    vocabTerms: [{ term_en: "Tukey's HSD test", explanation_tr: "ANOVA sonrasında tüm çiftler arası farkları Tip 1 hatasını koruyarak test eden post-hoc analiz.", explanation_en: "Single-step multiple comparison procedure used in conjunction with ANOVA.", exampleSentence_en: "Tukey HSD revealed that variant C significantly outperformed variant A and B." }],
    questions: [{
      id: "m9-l5-q1", type: "multiple-choice",
      prompt: { tr: "ANOVA testinde genel bir fark bulunduktan sonra hangi spesifik grupların farklı olduğunu belirlemek için ne uygulanır?", en: "What is applied after a significant ANOVA to identify which specific groups differ?" },
      options: [
        { tr: "Post-Hoc Testi (Örn: Tukey HSD)", en: "Post-Hoc Test (e.g. Tukey HSD)" },
        { tr: "Verileri silme", en: "Delete data" },
        { tr: "Testi iptal etme", en: "Cancel test" },
        { tr: "Rastgele seçim", en: "Random choice" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Grup çiftleri arasındaki spesifik farklar Post-Hoc testleriyle (Tukey HSD) tespit edilir.", en: "Post-hoc tests pinpoint exact group differences." }
    }],
    realWorldBox: { excelFormula: "=TUKEY_HSD()", pythonCode: "from statsmodels.stats.multicomp import pairwise_tukeyhsd\ntukey = pairwise_tukeyhsd(endog=df['sales'], groups=df['channel'], alpha=0.05)\nprint(tukey)", powerBiNote: { tr: "Çiftli grup güven aralığı görseli", en: "Pairwise confidence intervals visual" } }
  },
  {
    id: "m9-l6", moduleId: "module-9", order: 6, difficulty: "orta",
    title: { tr: "Post-Hoc Düzeltmeleri: Bonferroni & Scheffé", en: "Bonferroni & Scheffé Corrections" },
    conceptCard: {
      tr: "1. **Bonferroni Düzeltmesi:** Yapılan $C$ adet test için anlamlılık düzeyini $C$'ye böler:\n$$\\alpha_{\\text{yeni}} = \\frac{\\alpha}{C}$$\n(Çok muhafazakar ama garantili bir yöntemdir).\n\n2. **Scheffé Yöntemi:** Karmaşık ve planlanmamış tüm doğrusal kontrastları test eden en esnek yöntemdir.",
      en: "Bonferroni adjusts threshold to $\\alpha / C$. Scheffé handles complex arbitrary linear contrasts."
    },
    companyExample: {
      tr: "**Örnek Soru:** $\\alpha = 0.05$ için 10 adet ikili karşılaştırma yapılacaksa Bonferroni anlamlılık eşiği nedir?\n\n**Çözüm:** $\\alpha_{\\text{yeni}} = 0.05 / 10 = 0.005$. Her test $p < 0.005$ ise anlamlı kabul edilir.",
      en: "**Worked Example:** $\\alpha_{adj} = 0.05 / 10 = 0.005$."
    },
    vocabTerms: [{ term_en: "Bonferroni correction", explanation_tr: "Çoklu testlerde anlamlılık düzeyini test sayısına bölerek Tip 1 hatasını sıkı kontrol eden düzeltme.", explanation_en: "Adjustment to p-value thresholds in multiple testing by dividing alpha by number of tests.", exampleSentence_en: "We applied Bonferroni correction across the 10 marketing segments." }],
    questions: [{
      id: "m9-l6-q1", type: "numeric",
      prompt: { tr: "$\\alpha = 0.06$ için 3 test yapılacaksa Bonferroni düzeltilmiş $\\alpha$ eşiği ($0.06 / 3$) kaçtır?", en: "Calculate Bonferroni alpha for $\\alpha=0.06$ across 3 tests." },
      correctAnswer: 0.02,
      explanation: { tr: "$$\\alpha_{\\text{yeni}} = \\frac{0.06}{3} = 0.02$$", en: "$$\\alpha_{new} = 0.06 / 3 = 0.02$$" }
    }],
    realWorldBox: { excelFormula: "=alpha / C", pythonCode: "from statsmodels.stats.multitest import multipletests\nreject, pvals_corrected, _, _ = multipletests(pvals, alpha=0.05, method='bonferroni')", powerBiNote: { tr: "Düzeltilmiş p-değeri metriği", en: "Adjusted p-value metric" } }
  },
  {
    id: "m9-l7", moduleId: "module-9", order: 7, difficulty: "ileri",
    title: { tr: "İki Yönlü ANOVA (Two-Way ANOVA) & Etkileşim", en: "Two-Way ANOVA & Interactions" },
    conceptCard: {
      tr: "İki farklı bağımsız faktörün ($A$ ve $B$) ve aralarındaki **etkileşimin ($A \\times B$)** hedef değişken üzerindeki etkisini aynı anda inceler:\n\n1. Faktör A Ana Etkisi\n2. Faktör B Ana Etkisi\n3. $A \\times B$ Etkileşim Etkisi (Bir faktörün etkisi diğer faktörün düzeyine göre değişiyorsa etkileşim vardır).",
      en: "Two-Way ANOVA evaluates two factors and their interaction ($A \\times B$) on response $y$."
    },
    companyExample: {
      tr: "**Örnek Soru:** İndirim oranı (%10 vs %30) ve İletişim Kanalı (SMS vs E-posta) birlikte test ediliyor. Grafikte çizgiler kesişiyorsa ne vardır?\n\n**Çözüm:** Çizgilerin paralel olmaması **Etkileşim (Interaction)** olduğunu gösterir.",
      en: "**Worked Example:** Non-parallel interaction plot lines confirm a significant interaction effect."
    },
    vocabTerms: [{ term_en: "interaction effect", explanation_tr: "Bir faktörün etkisinin ikinci faktörün hangi düzeyde olduğuna bağlı olarak değişmesi durumu.", explanation_en: "Effect where the impact of one factor depends on the level of another factor.", exampleSentence_en: "A significant price-by-channel interaction emerged." }],
    questions: [{
      id: "m9-l7-q1", type: "multiple-choice",
      prompt: { tr: "İki Yönlü ANOVA etkileşim grafiğinde çizgilerin paralel olmaması (kesişmesi) neyi gösterir?", en: "What does non-parallel lines in a Two-Way ANOVA plot indicate?" },
      options: [
        { tr: "Anlamlı bir etkileşim (Interaction) etkisi olduğunu", en: "Significant interaction effect" },
        { tr: "Modelin geçersiz olduğunu", en: "Invalid model" },
        { tr: "Verilerin silinmesi gerektiğini", en: "Data needs deletion" },
        { tr: "Varyansın sıfır olduğunu", en: "Zero variance" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Kesişen çizgiler bir faktörün etkisinin diğeri değiştikçe farklılaştığını (etkileşim) kanıtlar.", en: "Crossing lines demonstrate significant interaction between factors." }
    }],
    realWorldBox: { excelFormula: "=ANOVA: ÇİFT ETKEN", pythonCode: "model = ols('sales ~ C(factorA) * C(factorB)', data=df).fit()\nsm.stats.anova_lm(model)", powerBiNote: { tr: "Etkileşim çizgisi (Interaction Plot)", en: "Interaction plot visual" } }
  },
  {
    id: "m9-l8", moduleId: "module-9", order: 8, difficulty: "orta",
    title: { tr: "Ki-Kare ($\\chi^2$) Uyum İyiliği Testi", en: "Chi-Square Goodness-of-Fit Test" },
    conceptCard: {
      tr: "Kategorik tek bir değişkenin gözlemlenen frekanslarının ($O_i$), teorik beklenen frekanslara ($E_i$) uyup uymadığını test eder ($df = k - 1$):\n\n$$\\chi^2 = \\sum_{i=1}^{k} \\frac{(O_i - E_i)^2}{E_i}$$",
      en: "Goodness-of-fit test compares observed $O_i$ against expected $E_i$: $\\chi^2 = \\sum \\frac{(O_i - E_i)^2}{E_i}$ with $df = k-1$."
    },
    companyExample: {
      tr: "**Örnek Soru:** Düzgün bir zarda her yüzün 10 kez gelmesi beklenirken 6 yüzü 16 kez gelmiştir ($O=16, E=10$). Bu hücrenin katkısı nedir?\n\n**Çözüm:** $(16 - 10)^2 / 10 = 36 / 10 = 3.6$.",
      en: "**Worked Example:** $(16-10)^2 / 10 = 3.6$."
    },
    vocabTerms: [{ term_en: "goodness-of-fit", explanation_tr: "Gözlenen frekansların teorik bir dağılıma (örn. eşit dağılım veya genetik oranlar) uygunluğunu ölçen test.", explanation_en: "Statistical test assessing whether observed categorical frequencies match expected frequencies.", exampleSentence_en: "Chi-Square goodness-of-fit test verified equal weekday website traffic." }],
    questions: [{
      id: "m9-l8-q1", type: "numeric",
      prompt: { tr: "$O = 25$ ve $E = 20$ olan bir kategori için $(O - E)^2 / E$ katkısı kaçtır ($25 / 20$)?", en: "Calculate $(O - E)^2 / E$ for $O=25, E=20$." },
      correctAnswer: 1.25,
      explanation: { tr: "$$\\frac{(25 - 20)^2}{20} = \\frac{5^2}{20} = \\frac{25}{20} = 1.25$$", en: "$$25 / 20 = 1.25$$" }
    }],
    realWorldBox: { excelFormula: "=KİKARE.TEST(Gözlenen, Beklenen)", pythonCode: "from scipy.stats import chisquare\nstat, p_val = chisquare(f_obs=obs, f_exp=exp)", powerBiNote: { tr: "Gözlenen vs Beklenen frekans sütunları", en: "Observed vs Expected bar chart" } }
  },
  {
    id: "m9-l9", moduleId: "module-9", order: 9, difficulty: "orta",
    title: { tr: "Ki-Kare ($\\chi^2$) Bağımsızlık Testi", en: "Chi-Square Test of Independence" },
    conceptCard: {
      tr: "İki kategorik değişken arasında bağımlılık/ilişki olup olmadığını test eder ($df = (r-1)(c-1)$).\n\n**Hücre Beklenen Frekansı ($E_{ij}$):**\n$$E_{ij} = \\frac{\\text{Satır Toplamı} \\times \\text{Sütun Toplamı}}{\\text{Genel Toplam}}$$\n\n$$\\chi^2 = \\sum_{i=1}^{r} \\sum_{j=1}^{c} \\frac{(O_{ij} - E_{ij})^2}{E_{ij}}$$",
      en: "Test of independence across $r \\times c$ contingency table: $E_{ij} = \\frac{\\text{Row Total} \\times \\text{Col Total}}{\\text{Grand Total}}$, $df = (r-1)(c-1)$."
    },
    companyExample: {
      tr: "**Örnek Soru:** $2 \\times 3$ boyutlu bir çapraz tablonun serbestlik derecesi nedir?\n\n**Çözüm:** $df = (2 - 1) \\times (3 - 1) = 1 \\times 2 = 2$.",
      en: "**Worked Example:** $df = (2-1)(3-1) = 2$."
    },
    vocabTerms: [{ term_en: "contingency table", explanation_tr: "İki kategorik değişkenin ortak frekanslarını gösteren çapraz tablo.", explanation_en: "A table showing the distribution of one variable in rows and another in columns.", exampleSentence_en: "A $2\\times 2$ contingency table evaluated customer churn across device types." }],
    questions: [{
      id: "m9-l9-q1", type: "numeric",
      prompt: { tr: "$3 \\times 4$ boyutlu bir çapraz tablonun Ki-Kare serbestlik derecesi ($(3-1)(4-1)$) kaçtır?", en: "What is Chi-Square degrees of freedom for a $3 \\times 4$ table?" },
      correctAnswer: 6,
      explanation: { tr: "$$df = (3 - 1) \\times (4 - 1) = 2 \\times 3 = 6$$", en: "$$df = 2 \\times 3 = 6$$" }
    }],
    realWorldBox: { excelFormula: "=KİKARE.TEST(Tablo, BeklenenTablo)", pythonCode: "from scipy.stats import chi2_contingency\nchi2_stat, p_val, dof, expected = chi2_contingency(table)", powerBiNote: { tr: "Çapraz ilişki matrisi", en: "Contingency matrix visual" } }
  },
  {
    id: "m9-l10", moduleId: "module-9", order: 10, difficulty: "ileri",
    title: { tr: "Kısmi $F$-Testi & Model Seçimi ($C_p$, AIC, BIC)", en: "Partial $F$-Test & Model Selection" },
    conceptCard: {
      tr: "1. **Kısmi $F$-Testi (Nested Models):** Eklenen bir grup değişkenin modeli anlamlı derecede iyileştirip iyileştirmediğini test eder:\n$$F = \\frac{(\\text{SSE}_{\\text{kısıtlı}} - \\text{SSE}_{\\text{tam}}) / q}{\\text{MSE}_{\\text{tam}}}$$\n\n2. **Model Seçim Kriterleri (Düşük olan tercih edilir):**\n- **Mallows' $C_p$:** $C_p \\approx p$ olmalıdır.\n- **AIC & BIC:** Aşırı parametreyi cezalandıran bilgi kriterleridir.",
      en: "Partial $F$-test compares nested models. Model selection metrics (AIC, BIC, Mallows' $C_p$) select the most parsimonious model."
    },
    companyExample: {
      tr: "**Örnek Soru:** İki modelden Model 1 AIC = 450, Model 2 AIC = 410'dur. Hangi model seçilir?\n\n**Çözüm:** AIC değeri daha düşük olan Model 2 daha iyi bir uyum/karmaşıklık dengesine sahiptir ve tercih edilir.",
      en: "**Worked Example:** Lower AIC (410 vs 450) selects Model 2."
    },
    vocabTerms: [{ term_en: "Akaike Information Criterion (AIC)", explanation_tr: "Modelin uyum kalitesini karmaşıklıkla dengeleyen model seçim metriği.", explanation_en: "Estimator of out-of-sample prediction error penalizing model complexity.", exampleSentence_en: "Stepwise regression selected the feature set minimizing AIC." }],
    questions: [{
      id: "m9-l10-q1", type: "multiple-choice",
      prompt: { tr: "AIC ve BIC kriterleriyle model karşılaştırması yapılırken hangi model tercih edilir?", en: "Which model is chosen when evaluating AIC/BIC criteria?" },
      options: [
        { tr: "Daha düşük AIC/BIC değerine sahip model", en: "Model with lower AIC/BIC" },
        { tr: "Daha yüksek AIC/BIC değerine sahip model", en: "Model with higher AIC/BIC" },
        { tr: "En çok değişkene sahip model", en: "Model with most predictors" },
        { tr: "Sıfır olan model", en: "Zero model" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Daha düşük AIC/BIC değeri daha az bilgi kaybı ve daha iyi model anlamına gelir.", en: "Lower AIC/BIC indicates superior balance of fit and parsimony." }
    }],
    realWorldBox: { excelFormula: "=AIC_HESABI()", pythonCode: "print(model.aic, model.bic)", powerBiNote: { tr: "Model karşılaştırma paneli", en: "Model selection leaderboard" } }
  }
]);

// ==========================================
// MODULE 10: Zaman Serisi & Non-Parametrik (8 Lessons)
// ==========================================
updateModule(10, [
  {
    id: "m10-l1", moduleId: "module-10", order: 1, difficulty: "orta",
    title: { tr: "Zaman Serisi Bileşenleri (Trend & Mevsimsellik)", en: "Time Series Components" },
    conceptCard: {
      tr: "Zaman serisi 4 ana bileşene ayrışır:\n\n1. **Trend ($T_t$):** Uzun vadeli yükseliş veya düşüş yönelimi.\n2. **Mevsimsellik ($S_t$):** Belirli periyotlarda (aylık, haftalık) tekrarlanan kalıplar.\n3. **Döngü ($C_t$):** İş çevrimleri ve ekonomik dalgalanmalar.\n4. **Rastgele Gürültü ($I_t$ / Hata):** Düzensiz kalıntılar.\n\n**Toplamsal Model:** $Y_t = T_t + S_t + I_t$\n**Çarpımsal Model:** $Y_t = T_t \\times S_t \\times I_t$",
      en: "Time series decomposition: Trend ($T$), Seasonality ($S$), Cycle ($C$), and Irregular noise ($I$)."
    },
    companyExample: {
      tr: "**Örnek Soru:** Dondurma satışları her yaz zirve yapıp kışın düşüyorsa bu hangi bileşendir?\n\n**Çözüm:** Yıllık periyotlarla tekrarlanan **Mevsimsellik (Seasonality)** bileşenidir.",
      en: "**Worked Example:** Summer ice cream demand spikes represent seasonality."
    },
    vocabTerms: [{ term_en: "seasonal decomposition", explanation_tr: "Zaman serisini trend, mevsimsellik ve gürültü bileşenlerine ayırma analizi.", explanation_en: "Decomposition of time series into trend, seasonal, and residual components.", exampleSentence_en: "Seasonal decomposition revealed an underlying 15% annual growth trend." }],
    questions: [{
      id: "m10-l1-q1", type: "multiple-choice",
      prompt: { tr: "Bir e-ticaret sitesinin her cuma günü satışlarının düzenli olarak %40 artması hangi bileşendir?", en: "Weekly sales peaks occurring every Friday represent which component?" },
      options: [
        { tr: "Mevsimsellik (Seasonality)", en: "Seasonality" },
        { tr: "Trend", en: "Trend" },
        { tr: "Rastgele Gürültü", en: "Random Noise" },
        { tr: "Kovaryans", en: "Covariance" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Düzenli zaman aralıklarıyla tekrarlanan periyodik hareketler mevsimselliktir.", en: "Periodic repeating patterns represent seasonality." }
    }],
    realWorldBox: { excelFormula: "=MEVSİMSELLİK()", pythonCode: "from statsmodels.tsa.seasonal import seasonal_decompose\ndecomp = seasonal_decompose(ts, model='additive')", powerBiNote: { tr: "Zaman serisi ayrıştırma paneli", en: "Time series decomposition visual" } }
  },
  {
    id: "m10-l2", moduleId: "module-10", order: 2, difficulty: "basit",
    title: { tr: "Basit ve Ağırlıklı Hareketli Ortalama (SMA & WMA)", en: "Moving Averages (SMA & WMA)" },
    conceptCard: {
      tr: "1. **Basit Hareketli Ortalama (SMA):** Son $k$ dönemin eşit ağırlıklı ortalamasıdır:\n$$\\text{SMA}_t = \\frac{y_t + y_{t-1} + \\dots + y_{t-k+1}}{k}$$\n\n2. **Ağırlıklı Hareketli Ortalama (WMA):** Yakın dönemlere daha yüksek ağırlık verir:\n$$\\text{WMA}_t = \\sum_{i=1}^k w_i y_{t-i+1}, \\quad (\\sum w_i = 1)$$",
      en: "Simple Moving Average (SMA) averages last $k$ periods. Weighted Moving Average (WMA) assigns higher weights to recent observations."
    },
    companyExample: {
      tr: "**Örnek Soru:** Son 3 ayın satışları: 100, 120, 140. 3 aylık SMA tahmini nedir?\n\n**Çözüm:** $\\text{SMA} = (100 + 120 + 140) / 3 = 360 / 3 = 120$.",
      en: "**Worked Example:** $\\text{SMA} = (100 + 120 + 140) / 3 = 120$."
    },
    vocabTerms: [{ term_en: "moving average", explanation_tr: "Rastgele dalgalanmaları filtreleyip trendi pürüzsüzleştiren pencere ortalaması.", explanation_en: "Calculation analyzing data points by creating a series of averages of different subsets.", exampleSentence_en: "A 7-day moving average smooths out weekend dip artifacts." }],
    questions: [{
      id: "m10-l2-q1", type: "numeric",
      prompt: { tr: "Son 4 günün siparişleri 10, 20, 30, 40 olduğuna göre 4 günlük SMA tahmini kaçtır?", en: "What is 4-day SMA for values 10, 20, 30, 40?" },
      correctAnswer: 25,
      explanation: { tr: "$$\\text{SMA} = \\frac{10 + 20 + 30 + 40}{4} = \\frac{100}{4} = 25$$", en: "$$\\text{SMA} = 100 / 4 = 25$$" }
    }],
    realWorldBox: { excelFormula: "=ORTALAMA(A1:A4)", pythonCode: "df['sma_7'] = df['sales'].rolling(window=7).mean()", powerBiNote: { tr: "7 günlük hareketli ortalama trend çizgisi", en: "7-day rolling average measure" } }
  },
  {
    id: "m10-l3", moduleId: "module-10", order: 3, difficulty: "orta",
    title: { tr: "Basit Üstel Düzleştirme (Simple Exponential Smoothing)", en: "Simple Exponential Smoothing (SES)" },
    conceptCard: {
      tr: "Geçmiş tüm dönemlerin ağırlıklarının üssel olarak azaldığı tek parametreli ($\alpha \\in [0, 1]$) tahmin yöntemidir:\n\n$$\\hat{y}_{t+1} = \\alpha y_t + (1 - \\alpha) \\hat{y}_t$$\n\n- $\\alpha \\to 1$: Son gerçekleşmeye çok duyarlı (oynak)\n- $\\alpha \\to 0$: Geçmiş tahminleri koruyan durağan model",
      en: "SES applies exponentially decaying weights via smoothing parameter $\\alpha$: $\\hat{y}_{t+1} = \\alpha y_t + (1-\\alpha)\\hat{y}_t$."
    },
    companyExample: {
      tr: "**Örnek Soru:** $\\alpha = 0.2$, son gerçekleşen $y_t = 150$, önceki tahmin $\\hat{y}_t = 100$. Yeni tahmin nedir?\n\n**Çözüm:**\n$$\\hat{y}_{t+1} = (0.2 \\times 150) + (0.8 \\times 100) = 30 + 80 = 110$$",
      en: "**Worked Example:** $\\hat{y}_{t+1} = 0.2(150) + 0.8(100) = 110$."
    },
    vocabTerms: [{ term_en: "exponential smoothing", explanation_tr: "Son verilere daha yüksek, geçmiş verilere üssel azalan ağırlık veren zaman serisi tahmincisi.", explanation_en: "Rule of thumb technique for smoothing time series data using exponential window.", exampleSentence_en: "SES provides accurate short-term demand forecasting for trendless products." }],
    questions: [{
      id: "m10-l3-q1", type: "numeric",
      prompt: { tr: "$\\alpha = 0.5$, $y_t = 60$, $\\hat{y}_t = 40$ için yeni tahmin $\\hat{y}_{t+1}$ kaçtır?", en: "Calculate SES forecast for $\\alpha=0.5, y_t=60, \\hat{y}_t=40$." },
      correctAnswer: 50,
      explanation: { tr: "$$\\hat{y}_{t+1} = (0.5 \\times 60) + (0.5 \\times 40) = 30 + 20 = 50$$", en: "$$\\hat{y}_{t+1} = 30 + 20 = 50$$" }
    }],
    realWorldBox: { excelFormula: "=alpha*Gerçek + (1-alpha)*ÖncekiTahmin", pythonCode: "from statsmodels.tsa.api import SimpleExpSmoothing\nfit = SimpleExpSmoothing(ts).fit(smoothing_level=0.2)", powerBiNote: { tr: "Üstel düzleştirme tahmin çizgisi", en: "Exponential smoothing forecast" } }
  },
  {
    id: "m10-l4", moduleId: "module-10", order: 4, difficulty: "ileri",
    title: { tr: "Holt & Holt-Winters Düzleştirme Modelleri", en: "Holt & Holt-Winters Models" },
    conceptCard: {
      tr: "1. **Holt İki Parametreli Model (Trend Var):** Seviye ($\\alpha$) ve Eğim/Trend ($\\beta$) parametrelerini birlikte modeller.\n2. **Holt-Winters Üç Parametreli Model (Trend + Mevsimsellik):** Seviye ($\\alpha$), Trend ($\\beta$) ve Mevsimsellik ($\\gamma$) bileşenlerini birlikte optimize eder.",
      en: "Holt adds trend ($\\beta$). Holt-Winters incorporates level ($\\alpha$), trend ($\\beta$), and seasonality ($\\gamma$)."
    },
    companyExample: {
      tr: "**Örnek Soru:** Hem yıllık büyüme trendi hem de yaz aylarında mevsimsel sıçrama gösteren otel rezervasyonlarında hangi model kullanılır?\n\n**Çözüm:** Hem trend hem mevsimsellik olduğu için **Holt-Winters** modeli kullanılır.",
      en: "**Worked Example:** Hotel bookings with trend and seasonal peaks require Holt-Winters."
    },
    vocabTerms: [{ term_en: "Holt-Winters method", explanation_tr: "Trend ve mevsimsellik içeren serileri 3 parametreyle modelleyen gelişmiş üssel tahmin yöntemi.", explanation_en: "Triple exponential smoothing modeling level, trend, and seasonal components.", exampleSentence_en: "Holt-Winters forecast achieved a 4% Mean Absolute Percentage Error." }],
    questions: [{
      id: "m10-l4-q1", type: "multiple-choice",
      prompt: { tr: "Hem trend hem de mevsimsellik içeren bir zaman serisinde hangi üssel model tercih edilir?", en: "Which model is designed for time series with both trend and seasonality?" },
      options: [
        { tr: "Holt-Winters Modeli", en: "Holt-Winters Model" },
        { tr: "Basit Üstel Düzleştirme (SES)", en: "Simple Exponential Smoothing (SES)" },
        { tr: "Hareketli Ortalama (SMA)", en: "Simple Moving Average" },
        { tr: "Bernoulli Modeli", en: "Bernoulli Model" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Holt-Winters seviye, trend ve mevsimsellik parametrelerinin üçünü birden modeller.", en: "Holt-Winters models level, trend, and seasonal factors." }
    }],
    realWorldBox: { excelFormula: "=TAHMİN.ETS()", pythonCode: "from statsmodels.tsa.api import ExponentialSmoothing\nfit = ExponentialSmoothing(ts, trend='add', seasonal='mul', seasonal_periods=12).fit()", powerBiNote: { tr: "Power BI yerleşik Forecast aracı (ETS)", en: "Power BI built-in ETS forecast" } }
  },
  {
    id: "m10-l5", moduleId: "module-10", order: 5, difficulty: "orta",
    title: { tr: "Ki-Kare Hücre Birleştirme ($E_{ij} < 5$ Kuralı)", en: "Chi-Square Cell Merging ($E_{ij} < 5$)" },
    conceptCard: {
      tr: "Ki-Kare testinin geçerli olması için hiçbir hücrede beklenen frekans $E_{ij} < 1$ olmamalı ve hücrelerin en fazla %20'sinde $E_{ij} < 5$ olmalıdır (Cochran Kuralı).\n\n**Çözüm:** Beklenen frekansı 5'ten küçük olan seyrek kategoriler komşu mantıklı kategorilerle **birleştirilir (collapsing categories)**.",
      en: "Cochran's rule requires expected cell counts $E_{ij} \\ge 5$. Sparse cells with $E < 5$ must be merged."
    },
    companyExample: {
      tr: "**Örnek Soru:** 'Çok Nadir' kategorisinde $E = 2$ çıkmıştır. Ki-Kare testi yapmadan önce ne yapılmalıdır?\n\n**Çözüm:** 'Çok Nadir' kategorisi 'Nadir' kategorisi ile birleştirilerek $E \\ge 5$ şartı sağlanır.",
      en: "**Worked Example:** Merge sparse category ($E=2$) with adjacent category to satisfy $E \\ge 5$."
    },
    vocabTerms: [{ term_en: "Cochran's Chi-Square rule", explanation_tr: "Ki-Kare testinde beklenen hücre frekanslarının en az 5 olması gerektiğini belirten kural.", explanation_en: "Rule specifying that expected frequencies in contingency tables should generally be at least 5.", exampleSentence_en: "Merging sparse rating categories satisfied Cochran's condition." }],
    questions: [{
      id: "m10-l5-q1", type: "multiple-choice",
      prompt: { tr: "Ki-Kare tablosunda beklenen frekans $E_{ij} < 5$ olan seyrek hücreler tespit edildiğinde ne yapılmalıdır?", en: "What should be done when expected frequencies $E_{ij} < 5$ occur in Chi-Square tables?" },
      options: [
        { tr: "Benzer kategoriler birleştirilmelidir (Hücre Birleştirme)", en: "Merge sparse adjacent categories" },
        { tr: "Tüm veriler silinmelidir", en: "Delete all data" },
        { tr: "Ki-Kare değeri ikiye katlanmalıdır", en: "Double the Chi-Square" },
        { tr: "Serbestlik derecesi sıfırlanmalıdır", en: "Zero the degrees of freedom" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Kategorileri birleştirmek beklenen değerleri 5'in üzerine çıkararak testi geçerli kılar.", en: "Collapsing categories restores adequate expected cell frequencies." }
    }],
    realWorldBox: { excelFormula: "=EĞER(E < 5, \"Birleştir\", \"Uygun\")", pythonCode: "# Aggregate categories with low support\ndf['tier'] = df['tier'].replace({'Bronze': 'Low', 'Silver': 'Low'})", powerBiNote: { tr: "Kategori gruplama (Binning/Grouping)", en: "Category grouping and binning" } }
  },
  {
    id: "m10-l6", moduleId: "module-10", order: 6, difficulty: "orta",
    title: { tr: "Parametrik Olmayan Test: Mann-Whitney U", en: "Mann-Whitney U Test (Wilcoxon Rank-Sum)" },
    conceptCard: {
      tr: "Normallik varsayımı bozulduğunda veya ordinal sıralı verilerde, iki bağımsız grubu karşılaştırmak için bağımsız iki örneklem $t$-testinin **parametrik olmayan (non-parametric)** karşılığıdır:\n\nVeriler sıralanıp sıra numaraları (rank) atanır ve sıra toplamları ($U$) kıyaslanır.",
      en: "Mann-Whitney U is the non-parametric alternative to independent two-sample t-test based on ranks."
    },
    companyExample: {
      tr: "**Örnek Soru:** Çok aşırı çarpık ve aykırı değerlerle dolu iki mağazanın müşteri memnuniyet skorlarını (1-5 puan) kıyaslamak için hangi test uygundur?\n\n**Çözüm:** Normallik sağlanmadığı ve ordinal veri olduğu için **Mann-Whitney U Testi** uygulanır.",
      en: "**Worked Example:** Comparing skewed ordinal rating distributions uses Mann-Whitney U."
    },
    vocabTerms: [{ term_en: "Mann-Whitney U test", explanation_tr: "Normallik şartı aranmaksızın iki bağımsız grubun medyan / sıra dağılımlarını kıyaslayan test.", explanation_en: "Nonparametric test of the null hypothesis that it is equally likely that a randomly selected value from one population is less than or greater than a value from a second population.", exampleSentence_en: "Mann-Whitney U test confirmed higher satisfaction ranks in variant B." }],
    questions: [{
      id: "m10-l6-q1", type: "multiple-choice",
      prompt: { tr: "İki bağımsız grup için normallik varsayımı bozulduğunda $t$-testi yerine hangi non-parametrik test kullanılır?", en: "Which non-parametric test replaces the independent t-test when normality is violated?" },
      options: [
        { tr: "Mann-Whitney U Testi", en: "Mann-Whitney U Test" },
        { tr: "Pearson Korelasyonu", en: "Pearson Correlation" },
        { tr: "Tek Örneklem Z-Testi", en: "One-Sample Z-Test" },
        { tr: "ANOVA", en: "ANOVA" }
      ],
      correctAnswer: 0,
      explanation: { tr: "İki bağımsız grubun sıralarını kıyaslayan standart non-parametrik test Mann-Whitney U'dur.", en: "Mann-Whitney U is the rank-based counterpart to the independent two-sample t-test." }
    }],
    realWorldBox: { excelFormula: "=MANN_WHITNEY()", pythonCode: "from scipy.stats import mannwhitneyu\nu_stat, p_val = mannwhitneyu(g1, g2)", powerBiNote: { tr: "Sıra toplamı (Rank-sum) karşılaştırması", en: "Rank-sum comparison visual" } }
  },
  {
    id: "m10-l7", moduleId: "module-10", order: 7, difficulty: "orta",
    title: { tr: "Parametrik Olmayan Test: Wilcoxon İşaretli Sıralar", en: "Wilcoxon Signed-Rank Test" },
    conceptCard: {
      tr: "Eşleştirilmiş (Paired) $t$-testinin normallik varsayımı bozulduğundaki **parametrik olmayan** karşılığıdır.\n\nÖncesi ve sonrası farkların mutlak değerlerine sıra numarası verilir ve pozitif/negatif işaretlerle toplanır ($W$).",
      en: "Wilcoxon Signed-Rank is the non-parametric alternative to the paired t-test for dependent samples."
    },
    companyExample: {
      tr: "**Örnek Soru:** 15 kullanıcının yeni arayüzü denemeden önceki ve sonraki bekleme süreleri normal dağılmamaktadır. Hangi test uygulanır?\n\n**Çözüm:** Bağımlı ölçümlerde normallik yoksa **Wilcoxon İşaretli Sıralar Testi (Wilcoxon Signed-Rank)** uygulanır.",
      en: "**Worked Example:** Non-normal paired before-after durations use Wilcoxon Signed-Rank."
    },
    vocabTerms: [{ term_en: "Wilcoxon signed-rank test", explanation_tr: "Eşleştirilmiş ölçümlerde farkların medyanının sıfırdan farklılığını sıralarla test eden yöntem.", explanation_en: "Non-parametric statistical test comparing two paired groups on ranks.", exampleSentence_en: "Wilcoxon signed-rank test proved a significant reduction in checkout time." }],
    questions: [{
      id: "m10-l7-q1", type: "multiple-choice",
      prompt: { tr: "Eşleştirilmiş (öncesi-sonrası) verilerde normallik varsayımı sağlanmadığında hangi test seçilmelidir?", en: "Which non-parametric test is used for paired before-after non-normal data?" },
      options: [
        { tr: "Wilcoxon İşaretli Sıralar Testi", en: "Wilcoxon Signed-Rank Test" },
        { tr: "Mann-Whitney U Testi", en: "Mann-Whitney U Test" },
        { tr: "Ki-Kare Testi", en: "Chi-Square Test" },
        { tr: "F-Testi", en: "F-Test" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Eşleştirilmiş bağımlı grupların non-parametrik testi Wilcoxon İşaretli Sıralar testidir.", en: "Wilcoxon signed-rank handles dependent paired non-normal data." }
    }],
    realWorldBox: { excelFormula: "=WILCOXON_TEST()", pythonCode: "from scipy.stats import wilcoxon\nstat, p_val = wilcoxon(before, after)", powerBiNote: { tr: "Öncesi / Sonrası sıra farkları", en: "Paired rank difference KPI" } }
  },
  {
    id: "m10-l8", moduleId: "module-10", order: 8, difficulty: "ileri",
    title: { tr: "Kruskal-Wallis Testi (Non-Parametrik ANOVA)", en: "Kruskal-Wallis Test" },
    conceptCard: {
      tr: "3 veya daha fazla bağımsız grubun karşılaştırılmasında **Tek Yönlü ANOVA'nın normallik şartı aranmayan parametrik olmayan karşılığıdır** ($H$ istatistiği, $df = k - 1$):\n\nTüm gözlemler tek bir havuzda sıralanır ve grupların sıra toplamları Ki-Kare yaklaşımıyla test edilir.",
      en: "Kruskal-Wallis is the non-parametric alternative to One-Way ANOVA for comparing 3+ groups using ranks."
    },
    companyExample: {
      tr: "**Örnek Soru:** 4 farklı departmanın kaza sayıları aşırı sağa çarpıktır (normallik yok). Departmanları kıyaslamak için ne kullanılır?\n\n**Çözüm:** **Kruskal-Wallis Testi** uygulanır.",
      en: "**Worked Example:** Comparing 4 non-normal department cohorts uses Kruskal-Wallis."
    },
    vocabTerms: [{ term_en: "Kruskal-Wallis test", explanation_tr: "Üç veya daha fazla bağımsız grubun medyanlarını sıralar üzerinden kıyaslayan non-parametrik ANOVA.", explanation_en: "A rank-based non-parametric test to determine if there are statistically significant differences between two or more groups.", exampleSentence_en: "Kruskal-Wallis test detected significant rank differences across regions ($H=14.2, p < 0.01$)." }],
    questions: [{
      id: "m10-l8-q1", type: "multiple-choice",
      prompt: { tr: "3 veya daha fazla bağımsız grubu karşılaştırırken normallik bozulduğunda ANOVA yerine hangi test uygulanır?", en: "Which test replaces One-Way ANOVA when normality is violated for 3+ groups?" },
      options: [
        { tr: "Kruskal-Wallis Testi", en: "Kruskal-Wallis Test" },
        { tr: "Paired t-test", en: "Paired t-test" },
        { tr: "Z-test", en: "Z-test" },
        { tr: "Basit Regresyon", en: "Simple Regression" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Çoklu grupların non-parametrik varyans analizi Kruskal-Wallis testidir.", en: "Kruskal-Wallis extends rank tests to 3+ groups." }
    }],
    realWorldBox: { excelFormula: "=KRUSKAL_WALLIS()", pythonCode: "from scipy.stats import kruskal\nh_stat, p_val = kruskal(g1, g2, g3, g4)", powerBiNote: { tr: "Çoklu grup medyan sıralama grafiği", en: "Multi-group median rank visual" } }
  }
]);

// ==========================================
// MODULE 11: Kapstone & Endüstriyel Karar Analitiği (6 Lessons)
// ==========================================
updateModule(11, [
  {
    id: "m11-l1", moduleId: "module-11", order: 1, difficulty: "orta",
    title: { tr: "Uçtan Uca Veri Analitiği Süreci & Veri Temizleme", en: "End-to-End Analytics Workflow & Cleaning" },
    conceptCard: {
      tr: "Profesyonel veri analitiği yaşam döngüsü:\n\n1. **Problem Tanımı:** İş hedeflerinin belirlenmesi\n2. **Veri Temizleme (Data Cleaning):** Eksik veri (imputation), aykırı değer ayıklama, tip dönüşümleri\n3. **Keşifçi Analiz (EDA):** Dağılımlar, korelasyonlar ve görselleştirme\n4. **Modelleme & Hipotez:** İstatistiksel testler ve regresyon\n5. **Karar & Raporlama:** Eyleme dönüştürülebilir iş tavsiyeleri",
      en: "End-to-end workflow: Problem Definition -> Data Cleaning -> EDA -> Statistical Modeling -> Business Recommendations."
    },
    companyExample: {
      tr: "**Örnek Soru:** %20 eksik veri içeren yaş sütununda eksik değerler nasıl doldurulmalıdır?\n\n**Çözüm:** Dağılım çarpıksa **Medyan**, simetrikse **Ortalama** ile doldurulmalıdır (Imputation).",
      en: "**Worked Example:** Fill missing values with median for skewed distributions."
    },
    vocabTerms: [{ term_en: "data imputation", explanation_tr: "Eksik verilerin medyan, ortalama veya model tahmini ile uygun şekilde doldurulması süreci.", explanation_en: "Process of replacing missing data with substituted values.", exampleSentence_en: "Median imputation preserved the distribution integrity." }],
    questions: [{
      id: "m11-l1-q1", type: "multiple-choice",
      prompt: { tr: "Çarpık bir dağılıma sahip eksik verileri doldururken en sağlam (robust) istatistik hangisidir?", en: "Which robust statistic is preferred for imputing skewed missing data?" },
      options: [
        { tr: "Medyan (Ortanca)", en: "Median" },
        { tr: "Maksimum", en: "Maximum" },
        { tr: "Minimum", en: "Minimum" },
        { tr: "Ranj", en: "Range" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Medyan aykırı değerlerden etkilenmediği için çarpık verilerde en güvenli doldurma yöntemidir.", en: "Median is unaffected by outliers." }
    }],
    realWorldBox: { excelFormula: "=EĞER(EHATALIYSA(A2), MEDYAN(A:A), A2)", pythonCode: "df['age'] = df['age'].fillna(df['age'].median())", powerBiNote: { tr: "Power Query veri temizleme adımları", en: "Power Query data transformation steps" } }
  },
  {
    id: "m11-l2", moduleId: "module-11", order: 2, difficulty: "orta",
    title: { tr: "Keşifçi Veri Analizi ve Dağılım Karşılaştırma", en: "Exploratory Data Analysis (EDA)" },
    conceptCard: {
      tr: "Modelleme öncesinde değişkenler arasındaki temel ilişkileri ve veri dağılımlarını ortaya çıkarır:\n\n- Sayısal değişkenler için: Histogram, Boxplot, Q-Q Plot\n- İki değişkenli ilişkiler için: Scatter plot, Korelasyon Isı Haritası\n- Kategorik yapılar için: Çapraz tablolar ve frekans çubukları",
      en: "EDA visualizes distributions and associations before modeling using histograms, boxplots, and correlation heatmaps."
    },
    companyExample: {
      tr: "**Örnek Soru:** Satışlar ile Reklam Harcaması arasındaki ilişkinin doğrusal olup olmadığını görmek için hangi grafik çizilir?\n\n**Çözüm:** **Saçılım Grafiği (Scatter Plot)** çizilir.",
      en: "**Worked Example:** Scatter plots verify linearity between sales and advertising."
    },
    vocabTerms: [{ term_en: "Exploratory Data Analysis (EDA)", explanation_tr: "Veri setinin temel özelliklerini özetlemek için görsel ve sayısal teknikler uygulama süreci.", explanation_en: "An approach of analyzing data sets to summarize their main characteristics.", exampleSentence_en: "EDA revealed a strong non-linear relationship between customer tenure and retention." }],
    questions: [{
      id: "m11-l2-q1", type: "multiple-choice",
      prompt: { tr: "İki sürekli sayısal değişken arasındaki doğrusal ilişkiyi görsel olarak incelemek için en uygun grafik hangisidir?", en: "Which plot is ideal for inspecting the relationship between two continuous variables?" },
      options: [
        { tr: "Saçılım Grafiği (Scatter Plot)", en: "Scatter Plot" },
        { tr: "Pasta Grafiği (Pie Chart)", en: "Pie Chart" },
        { tr: "Ağaç Haritası (Treemap)", en: "Treemap" },
        { tr: "Huni Grafiği", en: "Funnel Chart" }
      ],
      correctAnswer: 0,
      explanation: { tr: "İki değişkenli ilişki ve eğilim saçılım grafiği (scatter plot) ile net olarak görülür.", en: "Scatter plots display bivariate association and patterns." }
    }],
    realWorldBox: { excelFormula: "=SAÇILIM_GRAFİĞİ()", pythonCode: "import seaborn as sns\nsns.pairplot(df)", powerBiNote: { tr: "Korelasyon matrisi ve scatter matrix", en: "Correlation matrix and scatter matrix" } }
  },
  {
    id: "m11-l3", moduleId: "module-11", order: 3, difficulty: "orta",
    title: { tr: "Endüstriyel A/B Testi Tasarımı", en: "Industrial A/B Testing Design" },
    conceptCard: {
      tr: "Dijital ürünlerde karar almanın bilimsel yöntemidir:\n\n1. **Randomizasyon:** Kullanıcılar A (Kontrol) ve B (Varyant) gruplarına tamamen rastgele atanır.\n2. **Kukla Değişken ve Örneklem Büyüklüğü:** İstenen güç ($1-\\beta = 0.80$) ve anlamlılık ($\\alpha = 0.05$) için yeterli süre beklenir.\n3. **Metrik:** Birincil KPI (Örn: Dönüşüm Oranı / ARPU).",
      en: "A/B testing evaluates product variants via randomized controlled experiments controlling $\\alpha$ and power."
    },
    companyExample: {
      tr: "**Örnek Soru:** A/B testinde her iki gruba da 10.000 kullanıcı atanmıştır. A dönüşümü %2.0, B dönüşümü %2.5. Bu artışın testi hangi yöntemle yapılır?\n\n**Çözüm:** İki örneklem oran testi ($Z$-testi) ile yapılır.",
      en: "**Worked Example:** Comparing 2.0% vs 2.5% across 10k users uses a two-sample proportion Z-test."
    },
    vocabTerms: [{ term_en: "A/B testing", explanation_tr: "İki sürümün performansını rastgele seçilmiş kullanıcı gruplarıyla istatiksel olarak kıyaslama.", explanation_en: "Randomized experiment with two variants to test a hypothesis.", exampleSentence_en: "The A/B test demonstrated a statistically significant 12% revenue increase." }],
    questions: [{
      id: "m11-l3-q1", type: "multiple-choice",
      prompt: { tr: "A/B testinde kullanıcıların gruplara seçiminde dış etkenleri (bias) sıfırlamak için en kritik ilke nedir?", en: "What is the critical principle to eliminate bias in A/B testing?" },
      options: [
        { tr: "Tam Rastgele Atama (Randomization)", en: "Randomization" },
        { tr: "Sadece en aktif kullanıcıları seçmek", en: "Selecting only active users" },
        { tr: "Gündüzleri A, geceleri B grubunu çalıştırmak", en: "Time-based allocation" },
        { tr: "Testi ilk saatte bitirmek", en: "Stopping early" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Rastgele atama bilinmeyen tüm gürültü faktörlerini iki gruba eşit dağıtır.", en: "Randomization balances confounding variables across groups." }
    }],
    realWorldBox: { excelFormula: "=A/B Test Z-skoru", pythonCode: "from statsmodels.stats.proportion import proportions_ztest\nz, p = proportions_ztest([250, 200], [10000, 10000])", powerBiNote: { tr: "A/B testi canlı dönüşüm panosu", en: "Live A/B testing dashboard" } }
  },
  {
    id: "m11-l4", moduleId: "module-11", order: 4, difficulty: "ileri",
    title: { tr: "Etki Büyüklüğü (Cohen's $d$) ve Güç Analizi", en: "Effect Size (Cohen's $d$) & Power" },
    conceptCard: {
      tr: "İstatistiksel anlamlılık ($p < 0.05$) sadece farkın gerçek olduğunu söyler; farkın **büyüklüğünü** söylemez. **Cohen's $d$** etki büyüklüğünü standart sapma cinsinden ölçer:\n\n$$d = \\frac{\\bar{X}_1 - \\bar{X}_2}{s_p}$$\n\n- $d = 0.2$: Küçük Etki\n- $d = 0.5$: Orta Etki\n- $d = 0.8$: Büyük Etki",
      en: "Cohen's $d = \\frac{\\bar{X}_1 - \\bar{X}_2}{s_p}$ quantifies practical significance in standard deviation units."
    },
    companyExample: {
      tr: "**Örnek Soru:** İki grubun ortalama farkı 5 birim, ortak standart sapma $s_p = 10$'dur. Cohen's $d$ nedir?\n\n**Çözüm:** $d = 5 / 10 = 0.50$ (Orta düzeyde pratik etki büyüklüğü).",
      en: "**Worked Example:** $d = 5 / 10 = 0.50$ (Medium effect size)."
    },
    vocabTerms: [{ term_en: "effect size (Cohen's d)", explanation_tr: "İki grup arasındaki farkın standart sapma cinsinden pratik büyüklük ölçüsü.", explanation_en: "Quantitative measure of the magnitude of the experimental effect.", exampleSentence_en: "Even with a tiny p-value, Cohen's d of 0.05 revealed negligible practical impact." }],
    questions: [{
      id: "m11-l4-q1", type: "numeric",
      prompt: { tr: "Ortalama farkı $\\bar{X}_1 - \\bar{X}_2 = 8$ ve havuzlanmış standart sapma $s_p = 10$ olduğuna göre Cohen's $d$ kaçtır?", en: "Calculate Cohen's $d$ for mean difference 8 and $s_p = 10$." },
      correctAnswer: 0.8,
      explanation: { tr: "$$d = \\frac{8}{10} = 0.80$$", en: "$$d = 8 / 10 = 0.80$$" }
    }],
    realWorldBox: { excelFormula: "=(Ort1 - Ort2) / Sp", pythonCode: "d = (np.mean(g1) - np.mean(g2)) / np.sqrt((np.var(g1) + np.var(g2))/2)", powerBiNote: { tr: "Etki büyüklüğü KPI kartı", en: "Effect size magnitude visual" } }
  },
  {
    id: "m11-l5", moduleId: "module-11", order: 5, difficulty: "ileri",
    title: { tr: "Çok Değişkenli Modelleme ve Kalıntı Doğrulaması", en: "Multivariate Modeling & Diagnostics" },
    conceptCard: {
      tr: "Üretim ortamına sunulacak bir regresyon modelinde tam tanı kontrolü yapılır:\n\n1. Katsayı anlamlılığı ($p < 0.05$)\n2. Çoklu doğrusallık kontrolü ($VIF < 5$)\n3. Kalıntıların normalliği (Q-Q plot)\n4. Eşvaryanslık (Breusch-Pagan)\n5. Otokorelasyon bağımsızlığı ($DW \\approx 2$)",
      en: "Full regression audit pipeline: Coefficient significance, $VIF < 5$, Normality, Homoskedasticity, and $DW \\approx 2$."
    },
    companyExample: {
      tr: "**Örnek Soru:** Modelde bir değişkenin $p = 0.001$, $VIF = 2.1$, kalıntı $DW = 1.95$. Model canlıya alınabilir mi?\n\n**Çözüm:** Tüm tanı testleri mükemmel düzeyde başarılıdır; model canlı karar destek sistemine güvenle alınabilir.",
      en: "**Worked Example:** All diagnostic checks pass ($p<0.05, VIF<5, DW \\approx 2$)."
    },
    vocabTerms: [{ term_en: "model validation pipeline", explanation_tr: "Bir istatistiksel modelin canlı kararlara uygulanmadan önce tüm varsayımlarının doğrulanması süreci.", explanation_en: "Systematic auditing of model assumptions and performance before deployment.", exampleSentence_en: "Model validation pipeline confirmed robust generalization without bias." }],
    questions: [{
      id: "m11-l5-q1", type: "multiple-choice",
      prompt: { tr: "Bir çoklu regresyon modelini canlıya almadan önce hangi kontrollerin tamamı başarıyla geçilmelidir?", en: "Which set of diagnostic checks must be verified before deploying a model?" },
      options: [
        { tr: "VIF < 5, Breusch-Pagan p > 0.05, Durbin-Watson ~ 2", en: "VIF < 5, Breusch-Pagan p > 0.05, Durbin-Watson ~ 2" },
        { tr: "Sadece R-kare değerinin 1 olması", en: "Only R-squared = 1" },
        { tr: "Katsayıların tamamının sıfır olması", en: "All coefficients zero" },
        { tr: "Örneklemin 5 olması", en: "Sample size = 5" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Çoklu doğrusallık, eşvaryanslık ve hata bağımsızlığı testlerinin tümü sağlanmalıdır.", en: "Full suite of diagnostic criteria must be verified." }
    }],
    realWorldBox: { excelFormula: "=MODEL_TANI()", pythonCode: "print(model.summary())\nprint('VIF:', vif_series)", powerBiNote: { tr: "Model tanı ve denetim paneli", en: "Model diagnostic audit dashboard" } }
  },
  {
    id: "m11-l6", moduleId: "module-11", order: 6, difficulty: "ileri",
    title: { tr: "Yönetici Düzeyi Karar Raporlaması", en: "Executive Decision Reporting & Storytelling" },
    conceptCard: {
      tr: "İstatistiksel bulguları üst yönetim için stratejik kararlara dönüştürme ilkeleri:\n\n1. **Önce Sonuç (BLUF - Bottom Line Up Front):** Ana karar ve finansal etki en başta net söylenir.\n2. **Sayısal Güven:** Nokta tahminler yerine güven aralıkları verilir (Örn: 'Gelir artışı %95 güvenle 1.2M - 1.8M TL arasındadır').\n3. **Eyleme Dönüştürülebilir Öneri:** Yalnızca tespit değil, somut aksiyon adımı sunulur.",
      en: "Executive storytelling: Lead with the bottom line (BLUF), present financial confidence intervals, and recommend concrete actions."
    },
    companyExample: {
      tr: "**Örnek Rapor Özeti:** 'Yeni algoritma sepet tutarını %95 güvenle ortalama 45 TL ($\\pm 5$ TL) artırmaktadır. Yıllık ciroya net katkısı 12.5 Milyon TL öngörüldüğünden modelin tüm kullanıcılara açılması tavsiye edilir.'",
      en: "**Worked Example:** Executive decision summary linking statistical lift to bottom-line revenue."
    },
    vocabTerms: [{ term_en: "data storytelling", explanation_tr: "Karmaşık istatistiksel sonuçları yöneticilerin anlayacağı sade ve eyleme dönük bir dille aktarma sanatı.", explanation_en: "Communicating data insights using compelling narratives and actionable recommendations.", exampleSentence_en: "Effective data storytelling translated p-values into strategic business ROI." }],
    questions: [{
      id: "m11-l6-q1", type: "multiple-choice",
      prompt: { tr: "Üst yöneticiye sunulan bir veri analitiği raporunun en kritik özelliği ne olmalıdır?", en: "What is the most critical attribute of an executive data report?" },
      options: [
        { tr: "Somut finansal etkiyi ve eyleme dönük kararı net sunması", en: "Presenting clear business impact and actionable decisions" },
        { tr: "Sadece karmaşık formül türetimleri içermesi", en: "Only complex formula derivations" },
        { tr: "Raporun 100 sayfadan uzun olması", en: "Being 100+ pages long" },
        { tr: "Grafik içermemesi", en: "Containing no visuals" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Yönetici raporları doğrudan iş kararına ve finansal ROI'ye odaklanmalıdır.", en: "Executive reporting focuses on actionable business ROI." }
    }],
    realWorldBox: { excelFormula: "=YÖNETİCİ_ÖZETİ()", pythonCode: "print(f'Financial ROI: {roi_estimate:,.2f} USD')", powerBiNote: { tr: "Yönetici KPI özet panosu", en: "Executive summary KPI dashboard" } }
  }
]);

console.log('Finished All Modules!');
