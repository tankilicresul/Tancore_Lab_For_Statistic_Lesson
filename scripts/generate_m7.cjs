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
// MODULE 7: İki Popülasyon & Regresyon (9 Lessons)
// ==========================================
updateModule(7, [
  {
    id: "m7-l1", moduleId: "module-7", order: 1, difficulty: "orta",
    title: { tr: "İki Bağımsız Örneklem $t$-Testi (Eşit Varyans / Pooled)", en: "Two-Sample Pooled $t$-Test" },
    conceptCard: {
      tr: "İki bağımsız grubun popülasyon varyanslarının eşit olduğu ($\\sigma_1^2 = \\sigma_2^2$) varsayıldığında **Havuzlanmış Varyans ($s_p^2$)** ile $t$-testi yapılır ($df = n_1 + n_2 - 2$):\n\n$$s_p^2 = \\frac{(n_1-1)s_1^2 + (n_2-1)s_2^2}{n_1 + n_2 - 2}$$\n\n$$t = \\frac{(\\bar{X}_1 - \\bar{X}_2) - 0}{s_p \\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}}$$",
      en: "Pooled two-sample $t$-test assumes equal variances $\\sigma_1^2 = \\sigma_2^2$ with $df = n_1 + n_2 - 2$."
    },
    companyExample: {
      tr: "**Örnek Soru:** A grubu (n=10, Ortalama=50) ve B grubu (n=10, Ortalama=45). $df$ kaçtır?\n\n**Çözüm:** $df = 10 + 10 - 2 = 18$.",
      en: "**Worked Example:** $df = 10 + 10 - 2 = 18$."
    },
    vocabTerms: [{ term_en: "pooled variance", explanation_tr: "Eşit varyans varsayımı altında iki örneklem varyansının serbestlik dereceleriyle ağırlıklandırılmış ortak tahmini.", explanation_en: "Weighted average of sample variances estimating common population variance.", exampleSentence_en: "Pooled variance combines precision from both experimental cohorts." }],
    questions: [{
      id: "m7-l1-q1", type: "numeric",
      prompt: { tr: "$n_1 = 15$ ve $n_2 = 15$ olan iki bağımsız örneklem $t$-testinin serbestlik derecesi ($n_1 + n_2 - 2$) kaçtır?", en: "What is degrees of freedom for two samples of size 15?" },
      correctAnswer: 28,
      explanation: { tr: "$$df = 15 + 15 - 2 = 28$$", en: "$$df = 15 + 15 - 2 = 28$$" }
    }],
    realWorldBox: { excelFormula: "=T.TEST(A1:A15, B1:B15, 2, 2)", pythonCode: "from scipy.stats import ttest_ind\nt_stat, p_val = ttest_ind(g1, g2, equal_var=True)", powerBiNote: { tr: "A/B testi grup karşılaştırması", en: "A/B testing two-sample mean comparison" } }
  },
  {
    id: "m7-l2", moduleId: "module-7", order: 2, difficulty: "orta",
    title: { tr: "Welch $t$-Testi (Farklı Varyanslar)", en: "Welch's $t$-Test (Unequal Variances)" },
    conceptCard: {
      tr: "İki grubun varyansları eşit olmadığında ($\\sigma_1^2 \\ne \\sigma_2^2$) **Welch $t$-Testi** uygulanır:\n\n$$t = \\frac{\\bar{X}_1 - \\bar{X}_2}{\\sqrt{\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}}}$$\n\nSerbestlik derecesi Welch-Satterthwaite formülü ile düzeltilir. Modern veri biliminde eşit varyans şartı aranmaksızın varsayılan test olarak tercih edilir.",
      en: "Welch's $t$-test does not assume equal variances and adjusts degrees of freedom dynamically."
    },
    companyExample: {
      tr: "**Örnek Soru:** A grubunda $s_1^2 = 100$, B grubunda $s_2^2 = 4$. Hangi test tercih edilmelidir?\n\n**Çözüm:** Varyanslar arasında 25 kat fark olduğu için eşit varyans varsayımı geçersizdir; **Welch $t$-Testi** uygulanmalıdır.",
      en: "**Worked Example:** Vastly differing variances ($100$ vs $4$) require Welch's $t$-test."
    },
    vocabTerms: [{ term_en: "Welch's t-test", explanation_tr: "Varyansların eşitliği varsayımına ihtiyaç duymayan güvenilir iki örneklem t-testi.", explanation_en: "An adaptation of Student's t-test that is more reliable when samples have unequal variances.", exampleSentence_en: "Python's SciPy defaults to equal_var=False for Welch's robust t-test." }],
    questions: [{
      id: "m7-l2-q1", type: "multiple-choice",
      prompt: { tr: "İki grubun varyansları belirgin şekilde farklı olduğunda hangi t-testi türü seçilmelidir?", en: "Which t-test is preferred when group variances are unequal?" },
      options: [
        { tr: "Welch t-Testi", en: "Welch's t-Test" },
        { tr: "Pooled (Eşit Varyanslı) t-Test", en: "Pooled t-Test" },
        { tr: "Tek Örneklem Z-Testi", en: "One-Sample Z-Test" },
        { tr: "Ki-Kare Testi", en: "Chi-Square Test" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Welch t-testi varyans eşitliği varsayımına dayanmaz ve tip 1 hatasını korur.", en: "Welch's test accurately controls Type 1 error under variance heterogeneity." }
    }],
    realWorldBox: { excelFormula: "=T.TEST(A1:A15, B1:B15, 2, 3)", pythonCode: "ttest_ind(g1, g2, equal_var=False)", powerBiNote: { tr: "Sağlam (Robust) A/B test analitiği", en: "Robust Welch A/B testing visual" } }
  },
  {
    id: "m7-l3", moduleId: "module-7", order: 3, difficulty: "orta",
    title: { tr: "İki Popülasyon Varyans Kıyaslaması ($F$-Testi)", en: "Two-Sample Variance Test ($F$-Test)" },
    conceptCard: {
      tr: "İki bağımsız grubun varyanslarının eşitliğini ($H_0: \\sigma_1^2 = \\sigma_2^2$) test etmek için örneklem varyanslarının oranı alınır ($F$-Dağılımı):\n\n$$F = \\frac{s_1^2}{s_2^2}$$\n\n- Pay serbestlik derecesi: $df_1 = n_1 - 1$\n- Payda serbestlik derecesi: $df_2 = n_2 - 1$",
      en: "$F$-test compares two variances: $F = s_1^2 / s_2^2$ with $df_1 = n_1 - 1, df_2 = n_2 - 1$."
    },
    companyExample: {
      tr: "**Örnek Soru:** $s_1^2 = 50, s_2^2 = 25$. $F$-istatistiği nedir?\n\n**Çözüm:**\n$$F = \\frac{50}{25} = 2.00$$",
      en: "**Worked Example:** $F = 50 / 25 = 2.00$."
    },
    vocabTerms: [{ term_en: "F-distribution", explanation_tr: "İki bağımsız Ki-Kare değişkeninin serbestlik derecelerine oranının oluşturduğu sağa çarpık dağılım.", explanation_en: "Continuous probability distribution arising frequently as the null distribution of a test statistic in ANOVA and regression.", exampleSentence_en: "The F-ratio is 2.00 with 9 and 9 degrees of freedom." }],
    questions: [{
      id: "m7-l3-q1", type: "numeric",
      prompt: { tr: "$s_1^2 = 36$ ve $s_2^2 = 9$ olduğuna göre $F$-testi istatistiği ($36 / 9$) kaçtır?", en: "Calculate F-statistic for $s_1^2 = 36$ and $s_2^2 = 9$." },
      correctAnswer: 4,
      explanation: { tr: "$$F = \\frac{36}{9} = 4.0$$", en: "$$F = 36 / 9 = 4.0$$" }
    }],
    realWorldBox: { excelFormula: "=F.TEST(A1:A20, B1:B20)", pythonCode: "from scipy.stats import f\nf_stat = np.var(g1, ddof=1) / np.var(g2, ddof=1)", powerBiNote: { tr: "Varyans homojenlik kontrolü", en: "Variance homogeneity KPI" } }
  },
  {
    id: "m7-l4", moduleId: "module-7", order: 4, difficulty: "orta",
    title: { tr: "Eşleştirilmiş (Paired) $t$-Testi", en: "Paired Samples $t$-Test" },
    conceptCard: {
      tr: "Aynı denekler üzerinde **öncesi-sonrası (before-after)** veya eşleştirilmiş çiftler ölçüldüğünde kullanılır. Her çiftin farkı ($d_i = x_{1i} - x_{2i}$) alınarak tek örneklem $t$-testine indirgenir ($df = n-1$):\n\n$$\\bar{d} = \\frac{1}{n} \\sum d_i, \\quad t = \\frac{\\bar{d} - 0}{s_d / \\sqrt{n}}$$",
      en: "Paired $t$-test evaluates dependent before-after differences: $t = \\frac{\\bar{d}}{s_d / \\sqrt{n}}$ with $df = n-1$."
    },
    companyExample: {
      tr: "**Örnek Soru:** 16 personelin eğitim öncesi ve sonrası satış farkları ortalaması $\\bar{d} = 8$, farkların standart sapması $s_d = 4$'tür. $t$-değeri nedir?\n\n**Çözüm:**\n$$t = \\frac{8}{4 / \\sqrt{16}} = \\frac{8}{1} = 8.00$$",
      en: "**Worked Example:** $t = 8 / (4/4) = 8.00$."
    },
    vocabTerms: [{ term_en: "paired t-test (dependent samples)", explanation_tr: "Aynı bireyler üzerindeki iki bağımlı ölçümün farklarını test eden yöntem.", explanation_en: "Statistical test comparing two related means on the same subjects.", exampleSentence_en: "A paired t-test demonstrated a significant post-training improvement." }],
    questions: [{
      id: "m7-l4-q1", type: "numeric",
      prompt: { tr: "$\\bar{d} = 10, s_d = 5, n = 25$ için eşleştirilmiş $t$-istatistiği kaçtır ($10 / (5/5)$)?", en: "Calculate paired t-statistic for $\\bar{d}=10, s_d=5, n=25$." },
      correctAnswer: 10,
      explanation: { tr: "$$t = \\frac{10}{5 / 5} = 10.0$$", en: "$$t = 10 / 1 = 10.0$$" }
    }],
    realWorldBox: { excelFormula: "=T.TEST(Önceki, Sonraki, 2, 1)", pythonCode: "from scipy.stats import ttest_rel\nt_stat, p_val = ttest_rel(before, after)", powerBiNote: { tr: "Önce / Sonra etki analitiği", en: "Before/After impact analysis" } }
  },
  {
    id: "m7-l5", moduleId: "module-7", order: 5, difficulty: "orta",
    title: { tr: "İki Popülasyon Oran Farkı Testi (Pooled $\\hat{p}$)", en: "Two-Sample Proportion Test" },
    conceptCard: {
      tr: "İki bağımsız grubun oranlarının eşitliğini ($H_0: p_1 = p_2$) test eder. Sıfır hipotezi altında ortak oran (Pooled $\\hat{p}$) hesaplanır:\n\n$$\\hat{p} = \\frac{x_1 + x_2}{n_1 + n_2}, \\quad Z = \\frac{(\\hat{p}_1 - \\hat{p}_2) - 0}{\\sqrt{\\hat{p}(1-\\hat{p})\\left(\\frac{1}{n_1} + \\frac{1}{n_2}\\right)}}$$",
      en: "Two-sample proportion test uses pooled proportion $\\hat{p} = \\frac{x_1 + x_2}{n_1 + n_2}$ to evaluate $H_0: p_1 = p_2$."
    },
    companyExample: {
      tr: "**Örnek Soru:** A sürümünde 100 kişiden 20'si, B sürümünde 100 kişiden 30'u dönüşüm yapmıştır. Havuzlanmış oran $\\hat{p}$ nedir?\n\n**Çözüm:**\n$$\\hat{p} = \\frac{20 + 30}{100 + 100} = \\frac{50}{200} = 0.25 \\quad (\\%25)$$",
      en: "**Worked Example:** $\\hat{p} = (20+30)/(100+100) = 50/200 = 0.25$."
    },
    vocabTerms: [{ term_en: "two-sample Z-test for proportions", explanation_tr: "İki farklı web sayfası veya reklamın dönüşüm oranlarını kıyaslayan temel A/B test yöntemi.", explanation_en: "Hypothesis test comparing conversion rates between two independent cohorts.", exampleSentence_en: "The two-sample proportion Z-test proved variant B increased sign-ups by 5 percentage points." }],
    questions: [{
      id: "m7-l5-q1", type: "numeric",
      prompt: { tr: "Grup 1: 10 başarı / 50 deneme; Grup 2: 20 başarı / 50 deneme. Havuzlanmış oran $\\hat{p}$ kaçtır ($30 / 100$)?", en: "Find pooled $\\hat{p}$ for $10/50$ and $20/50$." },
      correctAnswer: 0.3,
      explanation: { tr: "$$\\hat{p} = \\frac{10 + 20}{50 + 50} = \\frac{30}{100} = 0.30$$", en: "$$\\hat{p} = 30 / 100 = 0.30$$" }
    }],
    realWorldBox: { excelFormula: "=Z.TEST İki Oran", pythonCode: "from statsmodels.stats.proportion import proportions_ztest\nz_stat, p_val = proportions_ztest([x1, x2], [n1, n2])", powerBiNote: { tr: "A/B testi dönüşüm farkı görseli", en: "A/B conversion difference visual" } }
  },
  {
    id: "m7-l6", moduleId: "module-7", order: 6, difficulty: "orta",
    title: { tr: "Pearson Korelasyon Katsayısı ($r$) ve Anlamlılık Testi", en: "Pearson Correlation & Hypothesis Test" },
    conceptCard: {
      tr: "Örneklem korelasyonu $r$ hesaplandıktan sonra popülasyonda gerçek bir ilişkinin olup olmadığı ($H_0: \\rho = 0$) $t$-testiyle test edilir ($df = n-2$):\n\n$$t = \\frac{r \\sqrt{n - 2}}{\\sqrt{1 - r^2}}$$",
      en: "Hypothesis test for correlation $H_0: \\rho = 0$: $t = \\frac{r\\sqrt{n-2}}{\\sqrt{1-r^2}}$ with $df = n-2$."
    },
    companyExample: {
      tr: "**Örnek Soru:** $n=18, r=0.60$. $t$-istatistiği nedir?\n\n**Çözüm:**\n$$t = \\frac{0.60 \\times \\sqrt{16}}{\\sqrt{1 - 0.36}} = \\frac{0.60 \\times 4}{\\sqrt{0.64}} = \\frac{2.40}{0.80} = 3.00 \\quad (df = 16)$$",
      en: "**Worked Example:** $t = (0.60 \\times 4) / 0.80 = 3.00$ with $df=16$."
    },
    vocabTerms: [{ term_en: "correlation significance test", explanation_tr: "Hesaplanan korelasyonun şans eseri mi yoksa istatiksel olarak gerçek mi olduğunu belirleyen t-testi.", explanation_en: "Test determining whether observed sample correlation differs significantly from zero.", exampleSentence_en: "With $p=0.008$, the correlation of $0.60$ is statistically significant." }],
    questions: [{
      id: "m7-l6-q1", type: "numeric",
      prompt: { tr: "18 gözlemli bir korelasyon testinin serbestlik derecesi ($df = n-2$) kaçtır?", en: "What is degrees of freedom ($df = n-2$) for correlation with $n=18$?" },
      correctAnswer: 16,
      explanation: { tr: "$$df = 18 - 2 = 16$$", en: "$$df = 18 - 2 = 16$$" }
    }],
    realWorldBox: { excelFormula: "=KORELASYON(A1:A18, B1:B18)", pythonCode: "from scipy.stats import pearsonr\nr, p_val = pearsonr(x, y)", powerBiNote: { tr: "Saçılım grafiği (Scatter Plot) korelasyonu", en: "Scatter plot correlation coefficient" } }
  },
  {
    id: "m7-l7", moduleId: "module-7", order: 7, difficulty: "orta",
    title: { tr: "Basit Doğrusal Regresyon Modeli ve OLS", en: "Simple Linear Regression & OLS" },
    conceptCard: {
      tr: "Bağımsız değişken $X$ ile bağımlı değişken $Y$ arasındaki doğrusal ilişkiyi modeller:\n\n$$\\hat{y} = \\beta_0 + \\beta_1 x$$\n\n**En Küçük Kareler Yöntemi (OLS - Ordinary Least Squares):** Hata kareleri toplamını ($\\sum e_i^2$) minimize eden katsayılar:\n$$\\beta_1 = \\frac{S_{xy}}{S_{xx}} = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sum (x_i - \\bar{x})^2} = r \\cdot \\frac{s_y}{s_x}$$\n$$\\beta_0 = \\bar{y} - \\beta_1 \\bar{x}$$",
      en: "OLS regression line $\\hat{y} = \\beta_0 + \\beta_1 x$ minimizes sum of squared residuals: $\\beta_1 = r \\frac{s_y}{s_x}, \\beta_0 = \\bar{y} - \\beta_1 \\bar{x}$."
    },
    companyExample: {
      tr: "**Örnek Soru:** Reklam harcaması ($X$) arttıkça satışlar ($Y$) inceleniyor: $\\bar{x}=10, \\bar{y}=50, \\beta_1=3$. Sabit terim $\\beta_0$ nedir?\n\n**Çözüm:**\n$$\\beta_0 = 50 - (3 \\times 10) = 50 - 30 = 20 \\implies \\hat{y} = 20 + 3x$$",
      en: "**Worked Example:** $\\beta_0 = 50 - 3(10) = 20 \\implies \\hat{y} = 20 + 3x$."
    },
    vocabTerms: [{ term_en: "Ordinary Least Squares (OLS)", explanation_tr: "Gerçek değerler ile tahmin doğrusu arasındaki kalıntı karelerini en aza indiren regresyon yöntemi.", explanation_en: "Estimating unknown parameters in a linear regression model by minimizing squared residuals.", exampleSentence_en: "OLS provides the Best Linear Unbiased Estimator (BLUE)." }],
    questions: [{
      id: "m7-l7-q1", type: "numeric",
      prompt: { tr: "$\\bar{x} = 4, \\bar{y} = 25, \\beta_1 = 5$ olduğuna göre regresyon kesim noktası $\\beta_0 = \\bar{y} - \\beta_1 \\bar{x}$ kaçtır?", en: "Find $\\beta_0 = \\bar{y} - \\beta_1 \\bar{x}$ for $\\bar{x}=4, \\bar{y}=25, \\beta_1=5$." },
      correctAnswer: 5,
      explanation: { tr: "$$\\beta_0 = 25 - (5 \\times 4) = 25 - 20 = 5$$", en: "$$\\beta_0 = 25 - 20 = 5$$" }
    }],
    realWorldBox: { excelFormula: "=EĞİM(Y, X) ve =KESMENOKTASI(Y, X)", pythonCode: "import statsmodels.api as sm\nmodel = sm.OLS(y, sm.add_constant(x)).fit()", powerBiNote: { tr: "Trend Çizgisi (Trendline) denklemi", en: "Scatter chart trendline equation" } }
  },
  {
    id: "m7-l8", moduleId: "module-7", order: 8, difficulty: "orta",
    title: { tr: "Regresyon Katsayılarının Hipotez Testi ($t$-Testi)", en: "Hypothesis Testing on Slope ($\\beta_1$)" },
    conceptCard: {
      tr: "Eğim katsayısının sıfırdan farklı ($H_0: \\beta_1 = 0 \\text{ vs } H_1: \\beta_1 \\ne 0$) anlamlı bir etkiye sahip olup olmadığını test eder ($df = n-2$):\n\n$$t = \\frac{\\hat{\\beta}_1 - 0}{\\text{SE}(\\hat{\\beta}_1)}$$\n\n$p < 0.05$ ise $X$ değişkeni $Y$ üzerinde istatistiksel olarak anlamlı bir etkiye sahiptir.",
      en: "Significance of slope $H_0: \\beta_1 = 0$: $t = \\frac{\\hat{\\beta}_1}{\\text{SE}(\\hat{\\beta}_1)}$ with $df = n-2$."
    },
    companyExample: {
      tr: "**Örnek Soru:** $\\hat{\\beta}_1 = 4.5$, $\\text{SE}(\\hat{\\beta}_1) = 1.5$. $t$-istatistiği nedir?\n\n**Çözüm:**\n$$t = \\frac{4.5}{1.5} = 3.00$$",
      en: "**Worked Example:** $t = 4.5 / 1.5 = 3.00$."
    },
    vocabTerms: [{ term_en: "slope standard error", explanation_tr: "Eğim katsayısı tahmincisinin belirsizliğini gösteren standart hata.", explanation_en: "Measure of the variability of the slope estimator across samples.", exampleSentence_en: "A small standard error yields a highly significant t-statistic for the slope." }],
    questions: [{
      id: "m7-l8-q1", type: "numeric",
      prompt: { tr: "$\\hat{\\beta}_1 = 8.0$ ve $\\text{SE}(\\hat{\\beta}_1) = 2.0$ olduğuna göre katsayı $t$-istatistiği kaçtır?", en: "Calculate slope t-statistic for $\\hat{\\beta}_1 = 8.0, \\text{SE} = 2.0$." },
      correctAnswer: 4,
      explanation: { tr: "$$t = \\frac{8.0}{2.0} = 4.0$$", en: "$$t = 8.0 / 2.0 = 4.0$$" }
    }],
    realWorldBox: { excelFormula: "=Regresyon Özeti p-değeri", pythonCode: "print(model.summary().tables[1])", powerBiNote: { tr: "P-değeri anlamlılık tablosu", en: "Regression summary coefficients table" } }
  },
  {
    id: "m7-l9", moduleId: "module-7", order: 9, difficulty: "orta",
    title: { tr: "Kareler Toplamı Ayrışımı ($SST = SSR + SSE$) ve $R^2$", en: "Sum of Squares Decomposition & $R^2$" },
    conceptCard: {
      tr: "Regresyonda toplam değişkenlik iki parçaya ayrışır:\n\n$$\\text{SST} = \\text{SSR} + \\text{SSE}$$\n- **SST (Total):** $\\sum (y_i - \\bar{y})^2$ (Toplam Değişkenlik)\n- **SSR (Regression):** $\\sum (\\hat{y}_i - \\bar{y})^2$ (Modelin Açıkladığı Değişkenlik)\n- **SSE (Error):** $\\sum (y_i - \\hat{y}_i)^2$ (Açıklanamayan Hata Değişkenliği)\n\n**Belirtme Katsayısı ($R^2$):** Modelin açıklama oranıdır ($0 \\le R^2 \\le 1$):\n$$R^2 = \\frac{\\text{SSR}}{\\text{SST}} = 1 - \\frac{\\text{SSE}}{\\text{SST}}$$",
      en: "Decomposition: $\\text{SST} = \\text{SSR} + \\text{SSE}$. Coefficient of determination: $R^2 = \\frac{\\text{SSR}}{\\text{SST}} = 1 - \\frac{\\text{SSE}}{\\text{SST}}$."
    },
    companyExample: {
      tr: "**Örnek Soru:** $\\text{SST} = 100, \\text{SSR} = 80, \\text{SSE} = 20$. $R^2$ nedir?\n\n**Çözüm:**\n$$R^2 = \\frac{80}{100} = 0.80 \\quad (\\%80)$$\n(Bağımlı değişkendeki değişimin %80'i modeldeki $X$ tarafından açıklanmaktadır).",
      en: "**Worked Example:** $R^2 = 80 / 100 = 0.80$ (80% explained variance)."
    },
    vocabTerms: [{ term_en: "R-squared (coefficient of determination)", explanation_tr: "Bağımlı değişkendeki toplam varyansın model tarafından açıklanan yüzdesi.", explanation_en: "The proportion of the variance in the dependent variable that is predictable from the independent variable.", exampleSentence_en: "An R-squared of 0.80 means 80% of sales fluctuations are explained by price." }],
    questions: [{
      id: "m7-l9-q1", type: "numeric",
      prompt: { tr: "Toplam kareler toplamı $\\text{SST} = 200$ ve hata kareler toplamı $\\text{SSE} = 50$ ise $R^2 = 1 - (\\text{SSE}/\\text{SST})$ kaçtır?", en: "If $\\text{SST}=200$ and $\\text{SSE}=50$, what is $R^2$?" },
      correctAnswer: 0.75,
      explanation: { tr: "$$R^2 = 1 - \\frac{50}{200} = 1 - 0.25 = 0.75$$", en: "$$R^2 = 1 - 0.25 = 0.75$$" }
    }],
    realWorldBox: { excelFormula: "=RKARE(Y, X)", pythonCode: "r2 = model.rsquared", powerBiNote: { tr: "Model uyum iyiliği KPI ($R^2$)", en: "Model goodness of fit $R^2$ KPI" } }
  }
]);

console.log('Finished Module 7.');
