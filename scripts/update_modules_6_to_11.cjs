const fs = require('fs');
const path = require('path');

function updateModule(filename, updaterFn) {
  const fpath = path.join('src', 'data', filename);
  if (!fs.existsSync(fpath)) {
    console.error(`File not found: ${fpath}`);
    return;
  }
  const data = JSON.parse(fs.readFileSync(fpath, 'utf8'));
  const updated = updaterFn(data);
  fs.writeFileSync(fpath, JSON.stringify(updated, null, 2), 'utf8');
  console.log(`Updated ${filename}: ${updated.lessons.length} lessons, ${updated.caseExams ? updated.caseExams.length : 0} cases.`);
}

// -----------------------------------------------------------------
// 8. MODULE 8: Çoklu Regresyon & Model Tanılama (INDR 252)
// -----------------------------------------------------------------
updateModule('module8.json', (m) => {
  m.lessons = [
    {
      id: 'm8-l1',
      moduleId: 'module-8',
      order: 1,
      difficulty: 'orta-ustu',
      title: { tr: 'Çoklu Doğrusal Regresyon & Kısmi Eğim Katsayıları', en: 'Multiple Linear Regression & Partial Slopes' },
      conceptCard: {
        tr: 'Birden fazla bağımsız değişkenin ($x_1, x_2, \\dots, x_k$) bağımlı değişken $y$ üzerindeki etkisi (`INDR 252 Lecture 20`):\n\n$$\\hat{y} = \\beta_0 + \\beta_1 x_1 + \\beta_2 x_2 + \\dots + \\beta_k x_k$$\n\n**Kısmi Eğim (Partial Slope $\\beta_j$) Yorumu ($ceteris\\ paribus$):**\nModeldeki diğer tüm bağımsız değişkenler sabit tutulduğunda, $x_j$ değişkenindeki 1 birimlik artışın $y$ üzerinde yaratacağı beklenen net değişimdir.',
        en: 'Modeling dependent variable $y$ using multiple predictors ($x_1, \\dots, x_k$) (`INDR 252 Lecture 20`):\n\n$$\\hat{y} = \\beta_0 + \\beta_1 x_1 + \\beta_2 x_2 + \\dots + \\beta_k x_k$$\n\n**Partial Slope ($\\beta_j$) Interpretation ($ceteris\\ paribus$):**\nThe expected change in $y$ for a one-unit increase in $x_j$, holding all other predictors constant.'
      },
      companyExample: {
        tr: 'EstateVal emlak modelinde: $\\hat{y} = 100 + 15(\\text{m}^2) + 50(\\text{Oda}) - 20(\\text{Yaş})$ (Bin TL). Oda sayısı ve bina yaşı sabit tutulduğunda, her 1 ek $\\text{m}^2$ fiyatı ortalama 15.000 TL artırır.',
        en: 'Estate valuation: $\\hat{y} = 100 + 15(m^2) + 50(Rooms) - 20(Age)$. Holding rooms and age constant, each additional $m^2$ adds $\\$15K$ to expected price.'
      },
      vocabTerms: [
        { term_en: 'ceteris paribus', explanation_tr: 'Diğer tüm şartlar ve değişkenler sabit tutulduğunda anlamına gelen Latince ilke.', explanation_en: 'Latin phrase meaning "all other things being equal".', exampleSentence_en: 'Multiple regression coefficients estimate effects ceteris paribus.' }
      ],
      questions: [
        {
          id: 'm8-l1-q1',
          type: 'multiple_choice',
          prompt: { tr: 'Çoklu regresyonda bir $\\beta_j$ katsayısı yorumlanırken hangi kritik koşul belirtilmelidir?', en: 'When interpreting a multiple regression coefficient $\\beta_j$, what condition must be stated?' },
          options: [
            { tr: 'Diğer tüm bağımsız değişkenlerin sabit tutulduğu (ceteris paribus)', en: 'Holding all other independent variables constant (ceteris paribus)' },
            { tr: 'R-karenin 1 olduğu', en: 'R-squared equals 1' },
            { tr: 'Örneklem boyutunun sonsuz olduğu', en: 'Sample size is infinite' },
            { tr: 'Tüm değişkenlerin pozitif olduğu', en: 'All variables are positive' }
          ],
          correctAnswer: 'Diğer tüm bağımsız değişkenlerin sabit tutulduğu (ceteris paribus)',
          explanation: { tr: 'Çoklu regresyon katsayıları kısmi katsayılardır; diğer değişkenlerin etkisi izole edilerek sabit tutulmalıdır.', en: 'Multiple regression slopes represent partial effects holding other covariates fixed.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=Regresyon Veri Analiz Aracı (Çoklu Seçim)',
        pythonCode: 'import statsmodels.api as sm\nmodel = sm.OLS(y, sm.add_constant(X)).fit()',
        powerBiNote: { tr: 'Çoklu değişken simülasyon parametreleri What-If ile kontrol edilir.', en: 'What-If parameters simulate multiple regression scenarios.' }
      }
    },
    {
      id: 'm8-l2',
      moduleId: 'module-8',
      order: 2,
      difficulty: 'orta-ustu',
      title: { tr: 'Düzeltilmiş $R^2$ ve Model ANOVA $F$-Testi', en: 'Adjusted $R^2$ and Overall Model ANOVA $F$-Test' },
      conceptCard: {
        tr: '1. **Düzeltilmiş Belirtme Katsayısı ($R_{adj}^2$):** Modele anlamsız değişken eklendikçe standart $R^2$ yapay olarak artar. $R_{adj}^2$ değişken sayısına ($k$) ceza uygular (`INDR 252 Lecture 20`):\n$$R_{adj}^2 = 1 - \\frac{SSE / (n - k - 1)}{SST / (n - 1)}$$\n\n2. **Genel Model ANOVA $F$-Testi ($H_0: \\beta_1 = \\beta_2 = \\dots = \\beta_k = 0$):**\n$$F = \\frac{MSR}{MSE} = \\frac{SSR / k}{SSE / (n - k - 1)}, \\quad df_1 = k, \\quad df_2 = n - k - 1$$',
        en: '1. **Adjusted $R^2$ ($R_{adj}^2$):** Penalizes model complexity so adding useless predictors cannot artificially inflate $R^2$ (`INDR 252 Lecture 20`):\n$$R_{adj}^2 = 1 - \\frac{SSE / (n - k - 1)}{SST / (n - 1)}$$\n\n2. **Overall Model ANOVA $F$-Test ($H_0: \\beta_1 = \\dots = \\beta_k = 0$):**\n$$F = \\frac{MSR}{MSE} = \\frac{SSR / k}{SSE / (n - k - 1)}$$'
      },
      companyExample: {
        tr: 'MarketPulse modelinde $R^2 = 0.88$ iken $R_{adj}^2 = 0.85$, $F = 42.5$ ($p < 0.001$) bulunmuştur. Model bir bütün olarak anlamlıdır ve aşırı parametre şişmesi yoktur.',
        en: 'MarketPulse model: $R^2 = 0.88, R_{adj}^2 = 0.85, F = 42.5$ ($p < 0.001$). Model is globally significant.'
      },
      vocabTerms: [
        { term_en: 'adjusted R-squared', explanation_tr: 'Modele eklenen değişken sayısı için ceza uygulayan düzeltilmiş açıklanan varyans oranı.', explanation_en: 'A modified version of R-squared adjusted for the number of predictors in the model.', exampleSentence_en: 'Adjusted R-squared prevents overfitting when comparing models.' }
      ],
      questions: [
        {
          id: 'm8-l2-q1',
          type: 'multiple_choice',
          prompt: { tr: 'Modele anlamsız ve gereksiz yeni bir değişken eklendiğinde standart $R^2$ ve $R_{adj}^2$ nasıl değişir?', en: 'When an irrelevant predictor is added, what happens to standard $R^2$ and Adjusted $R^2$?' },
          options: [
            { tr: 'Standart R² asla azalmaz (artar veya sabit kalır); Adjusted R² ise düşer', en: 'Standard R² never decreases; Adjusted R² decreases' },
            { tr: 'Her ikisi de kesinlikle artar', en: 'Both definitely increase' },
            { tr: 'Her ikisi de sıfıra düşer', en: 'Both drop to zero' },
            { tr: 'Adjusted R² artar, standart R² düşer', en: 'Adjusted R² increases while R² decreases' }
          ],
          correctAnswer: 'Standart R² asla azalmaz (artar veya sabit kalır); Adjusted R² ise düşer',
          explanation: { tr: 'Standart R² her yeni değişkende artarken; Adjusted R² serbestlik derecesi kaybı nedeniyle anlamsız değişkenlerde düşer.', en: 'Standard R² monotonically increases, whereas Adjusted R² drops if the variable does not improve fit sufficiently.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=1 - (SSE/(n-k-1))/(SST/(n-1))',
        pythonCode: 'adj_r2 = model.rsquared_adj\nf_pvalue = model.f_pvalue',
        powerBiNote: { tr: 'Model değerlendirme kartında her zaman Adjusted R² raporlanır.', en: 'Always report Adjusted R² in model KPI summaries.' }
      }
    },
    {
      id: 'm8-l3',
      moduleId: 'module-8',
      order: 3,
      difficulty: 'zor',
      title: { tr: 'Kalıntı Analizi & Eşvaryanslık (Homoskedasticity)', en: 'Residual Analysis & Homoskedasticity' },
      conceptCard: {
        tr: 'Regresyonun güvenilir olması için kalıntıların ($e_i = y_i - \\hat{y}_i$) 4 temel varsayımı sağlaması gerekir (`INDR 252 Lecture 21` - LINE Kuralı):\n\n1. **Linearity (Doğrusallık):** Kalıntılar sıfır etrafında rastgele dağılmalıdır (Kavis/eğri olmamalıdır).\n2. **Normality (Normallik):** Kalıntıların Q-Q grafiği düz çizgiye oturmalıdır.\n3. **Homoskedasticity (Eşvaryanslık):** Kalıntıların yayılımı tahmin edilen $\\hat{y}$ değerine göre sabit kalmalıdır. Huni/koni şeklinde açılma varsa **Heteroskedasticity (Değişen Varyans)** vardır ve standart hatalar sapmalı çıkar.',
        en: 'Evaluating regression assumptions via residuals ($e_i = y_i - \\hat{y}_i$) (`INDR 252 Lecture 21` - LINE):\n\n1. **Linearity:** Residuals vs fitted plot shows random dispersion around 0.\n2. **Normality:** Normal Q-Q plot follows $45^\\circ$ diagonal.\n3. **Homoskedasticity:** Residual spread remains constant across fitted values $\\hat{y}$. A funnel pattern reveals **Heteroskedasticity**, distorting standard errors.'
      },
      companyExample: {
        tr: 'Emlak modelinde pahalı evlere doğru kalıntıların huni gibi açıldığı görülmüştür (Heteroskedasticity). $y$ değişkenine log dönüşümü ($\\ln(y)$) uygulanarak varyans sabitlenmiştir.',
        en: 'Real estate residuals fan out for high-value properties (Heteroskedasticity). Applying $\\ln(y)$ log-transformation stabilizes residual variance.'
      },
      vocabTerms: [
        { term_en: 'homoskedasticity', explanation_tr: 'Regresyon hata terimlerinin tüm bağımsız değişken seviyelerinde sabit varyansa sahip olması.', explanation_en: 'The assumption that variance of residual error terms is constant across all levels of predictors.', exampleSentence_en: 'Heteroskedasticity violates OLS assumptions and requires robust standard errors.' }
      ],
      questions: [
        {
          id: 'm8-l3-q1',
          type: 'multiple_choice',
          prompt: { tr: 'Kalıntı grafiğinde (Residuals vs. Fitted) sağa doğru huni şeklinde genişleyen bir yayılım görülmesi hangi problemin işaretidir?', en: 'What does a funnel-shaped pattern in a Residuals vs. Fitted plot indicate?' },
          options: [
            { tr: 'Heteroskedasticity (Değişen Varyans)', en: 'Heteroskedasticity (Non-constant variance)' },
            { tr: 'Mükemmel Eşvaryanslık', en: 'Perfect Homoskedasticity' },
            { tr: 'Çoklu Doğrusallık', en: 'Multicollinearity' },
            { tr: 'R-karenin 1 olması', en: 'R-squared equals 1' }
          ],
          correctAnswer: 'Heteroskedasticity (Değişen Varyans)',
          explanation: { tr: 'Huni/koni şeklindeki açılma hataların varyansının sabit olmadığını (Heteroskedasticity) gösterir.', en: 'A funnel shape indicates error variance increases with fitted values (Heteroskedasticity).' }
        }
      ],
      realWorldBox: {
        excelFormula: '=Kalıntı_Grafiği (Eşvaryanslık Kontrolü)',
        pythonCode: 'import matplotlib.pyplot as plt\nplt.scatter(model.fittedvalues, model.resid)\nplt.axhline(0, color="red")',
        powerBiNote: { tr: 'Model tanı panellerinde Kalıntı vs Tahmin grafiği eklenir.', en: 'Residuals vs Fitted charts diagnose model health.' }
      }
    },
    {
      id: 'm8-l4',
      moduleId: 'module-8',
      order: 4,
      difficulty: 'orta-ustu',
      title: { tr: 'Hataların Bağımsızlığı & Otokorelasyon (Durbin-Watson)', en: 'Independence of Errors & Autocorrelation (Durbin-Watson)' },
      conceptCard: {
        tr: 'Zaman veya sıra dizilimli verilerde ardışık kalıntıların birbiriyle ilişkili olması (otokorelasyon) OLS standart hatalarını yanıltıcı hale getirir (`INDR 252 Lecture 21`):\n\n**Durbin-Watson ($d$) Test İstatistiği:**\n$$d = \\frac{\\sum_{t=2}^n (e_t - e_{t-1})^2}{\\sum_{t=1}^n e_t^2}, \\quad 0 \\le d \\le 4$$\n\n- **$d \\approx 2$:** Otokorelasyon YOK (Hatalar bağımsızdır - İdeal durum).\n- **$d < 1.5$:** Pozitif Otokorelasyon alarmı (Ardışık pozitif/negatif hatalar).\n- **$d > 2.5$:** Negatif Otokorelasyon alarmı.',
        en: 'Testing whether regression residuals are serially correlated over time (`INDR 252 Lecture 21`):\n\n**Durbin-Watson ($d$) Statistic:**\n$$d = \\frac{\\sum_{t=2}^n (e_t - e_{t-1})^2}{\\sum_{t=1}^n e_t^2}, \\quad 0 \\le d \\le 4$$\n\n- **$d \\approx 2$:** No autocorrelation (Independent errors - Ideal).\n- **$d < 1.5$:** Positive autocorrelation alarm.\n- **$d > 2.5$:** Negative autocorrelation alarm.'
      },
      companyExample: {
        tr: 'Aylık ciro regresyonunda $d = 0.85$ bulunmuştur ($d < 1.5$). Bu durum önceki ayın hata kalıntısının bu ayı etkilediğini (pozitif otokorelasyon) gösterir; modele gecikmeli değişken ($y_{t-1}$) eklenmelidir.',
        en: 'Monthly sales model $d = 0.85$ ($d < 1.5$). Positive autocorrelation present; lag variable ($y_{t-1}$) should be introduced.'
      },
      vocabTerms: [
        { term_en: 'autocorrelation', explanation_tr: 'Bir zaman serisindeki ardışık artıkların birbiriyle korelasyonlu olması.', explanation_en: 'Correlation of a signal with a delayed copy of itself over successive time intervals.', exampleSentence_en: 'Durbin-Watson test statistic near 2 indicates absence of autocorrelation.' }
      ],
      questions: [
        {
          id: 'm8-l4-q1',
          type: 'numeric',
          prompt: { tr: 'Durbin-Watson testinde otokorelasyonun OLMADIĞINI (hataların bağımsız olduğunu) gösteren ideal $d$ değeri kaçtır?', en: 'In a Durbin-Watson test, what is the ideal $d$ value indicating NO autocorrelation?' },
          correctAnswer: 2,
          explanation: { tr: '$$d \\approx 2 \\implies \\text{Otokorelasyon yoktur}$$', en: '$$d \\approx 2 \\implies \\text{No autocorrelation}$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=TOPLA.ÇARPIM((e2:eN - e1:eN-1)^2) / TOPLAKARE(e1:eN)',
        pythonCode: 'from statsmodels.stats.stattools import durbin_watson\ndw = durbin_watson(model.resid)',
        powerBiNote: { tr: 'Zaman serisi regresyon modellerinde DW metriği izlenir.', en: 'DW metric is monitored in time-series regression.' }
      }
    },
    {
      id: 'm8-l5',
      moduleId: 'module-8',
      order: 5,
      difficulty: 'orta-ustu',
      title: { tr: 'Çoklu Doğrusallık ve Varyans Şişme Faktörü ($VIF$)', en: 'Multicollinearity and Variance Inflation Factor ($VIF$)' },
      conceptCard: {
        tr: 'Bağımsız değişkenlerin kendi aralarında yüksek korelasyona sahip olması durumuna **Çoklu Doğrusallık (Multicollinearity)** denir (`INDR 252 Lecture 22`):\n\n**Varyans Şişme Faktörü (VIF):**\n$$VIF_j = \\frac{1}{1 - R_j^2}$$\n- $R_j^2$: $x_j$ değişkeninin diğer tüm bağımsız değişkenler üzerine regresyonundaki $R^2$.\n- **$VIF < 5$:** Güvenli / Düşük doğrusallık.\n- **$VIF > 5$ veya $> 10$:** Ciddi çoklu doğrusallık! Katsayıların standart hatası aşırı şişer, $p$-değerleri yanıltıcı çıkar.',
        en: 'Occurs when predictors in a regression model are highly correlated with each other (`INDR 252 Lecture 22`):\n\n**Variance Inflation Factor ($VIF$):**\n$$VIF_j = \\frac{1}{1 - R_j^2}$$\n- **$VIF < 5$:** Low multicollinearity (safe).\n- **$VIF > 5$ or $> 10$:** Severe multicollinearity inflating standard errors and distorting p-values.'
      },
      companyExample: {
        tr: 'Otomobil yakıt modelinde Motor Hacmi ($x_1$) ve Beygir Gücü ($x_2$) birlikte kullanıldığında $VIF = 14.2$ çıkmıştır. Biri elenerek model sadeleştirilmelidir.',
        en: 'Fuel efficiency model with Engine Size and Horsepower gives $VIF = 14.2$. Redundant predictor must be removed.'
      },
      vocabTerms: [
        { term_en: 'variance inflation factor', explanation_tr: 'Çoklu doğrusallık nedeniyle bir katsayının varyansının ne kadar şiştiğini ölçen katsayı ($VIF$).', explanation_en: 'Measures how much the variance of an estimated regression coefficient increases due to collinearity.', exampleSentence_en: 'A VIF greater than 10 indicates severe multicollinearity.' }
      ],
      questions: [
        {
          id: 'm8-l5-q1',
          type: 'numeric',
          prompt: { tr: 'Bir bağımsız değişken için $R_j^2 = 0.80$ ise bu değişkenin $VIF$ değeri kaçtır?', en: 'If $R_j^2 = 0.80$ for a predictor, what is its $VIF$ value?' },
          correctAnswer: 5,
          explanation: { tr: '$$VIF = \\frac{1}{1 - 0.80} = \\frac{1}{0.20} = 5$$', en: '$$VIF = \\frac{1}{1 - 0.80} = \\frac{1}{0.20} = 5$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=1 / (1 - RKARE_j)',
        pythonCode: 'from statsmodels.stats.outliers_influence import variance_inflation_factor\nvif = [variance_inflation_factor(X.values, i) for i in range(X.shape[1])]',
        powerBiNote: { tr: 'Korelasyon matrisinde r > 0.80 olan çiftler elenir.', en: 'Drop one variable from pairs with r > 0.80.' }
      }
    },
    {
      id: 'm8-l6',
      moduleId: 'module-8',
      order: 6,
      difficulty: 'zor',
      title: { tr: 'Kukla Değişkenler (Dummy) & Cook\'s Distance', en: 'Dummy Variables & Cook\'s Distance' },
      conceptCard: {
        tr: '1. **Kukla Değişkenler (Dummy Variables - $0/1$):** Nitel kategorik değişkenleri ($k$ kategori) modele eklemek için $k-1$ adet kukla değişken oluşturulur (`INDR 252 Lecture 22`). Kalan 1 kategori referans (taban) kabul edilir.\n\n2. **Kaldıraç & Cook\'s Distance ($D_i$):**\nModelin katsayılarını tek başına aşırı derecede saptıran etkili aykırı gözlemleri tespit eder (`INDR 252 Lecture 21`).\n- **$D_i > 1$ veya $D_i > 4/n$:** Çok etkili gözlem alarmı (İncelenmeli veya elenmelidir).',
        en: '1. **Dummy Variables ($0/1$):** Incorporating categorical predictors ($k$ levels) requires $k-1$ dummy variables (`INDR 252 Lecture 22`).\n\n2. **Leverage & Cook\'s Distance ($D_i$):**\nMeasures the influence of an individual data point on the regression coefficients (`INDR 252 Lecture 21`).\n- **$D_i > 1$ or $D_i > 4/n$:** Highly influential observation requiring investigation.'
      },
      companyExample: {
        tr: 'Emlak modelinde Konum (Merkez, Banliyö, Sahil - 3 kategori) için 2 dummy ($D_1: \\text{Banliyö}, D_2: \\text{Sahil}$) tanımlanmıştır. Merkez referans gruptur.',
        en: 'Location (City, Suburb, Coast) uses 2 dummies ($D_1, D_2$) with City as the reference baseline category.'
      },
      vocabTerms: [
        { term_en: 'dummy variable', explanation_tr: 'Kategorik özellikleri temsil eden 0 veya 1 değerlikli yapay sayısal değişken.', explanation_en: 'A numerical variable used in regression analysis to represent subgroups of the sample.', exampleSentence_en: 'We use k-1 dummy variables to avoid the dummy variable trap.' }
      ],
      questions: [
        {
          id: 'm8-l6-q1',
          type: 'numeric',
          prompt: { tr: '4 farklı eğitim seviyesini (Lise, Lisans, Y.Lisans, Doktora) regresyon modeline eklemek için kaç adet kukla (dummy) değişken tanımlanmalıdır?', en: 'How many dummy variables are needed for an education level with 4 categories?' },
          correctAnswer: 3,
          explanation: { tr: '$$k - 1 = 4 - 1 = 3 \\text{ adet dummy değişken gereklidir (Kukla Değişken Tuzağını önlemek için)}$$', en: '$$k - 1 = 4 - 1 = 3 \\text{ dummy variables (to prevent dummy trap)}$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=EĞER(A2="Sahil"; 1; 0)',
        pythonCode: 'df_encoded = pd.get_dummies(df, drop_first=True)',
        powerBiNote: { tr: 'Kategorik dilimleyiciler dummy filtrelemesi yapar.', en: 'Categorical slicers filter dummy parameters in Power BI.' }
      }
    }
  ];
  return m;
});

// -----------------------------------------------------------------
// 9. MODULE 9: ANOVA & Kategorik Testler (INDR 252)
// -----------------------------------------------------------------
updateModule('module9.json', (m) => {
  m.lessons = [
    {
      id: 'm9-l1',
      moduleId: 'module-9',
      order: 1,
      difficulty: 'orta',
      title: { tr: 'Çoklu Grup Karşılaştırma & Tip 1 Hata Şişmesi', en: 'Multiple Group Comparisons & Family-Wise Error Rate' },
      conceptCard: {
        tr: '3 veya daha fazla bağımsız grubun ortalamalarını ($k \\ge 3$) kıyaslarken art arda ikili $t$-testleri yapmak büyük hatadır (`INDR 252 Lecture 16`):\n\n**Tip 1 Hata Şişmesi (Family-Wise Error Rate):**\n$$\\alpha_{family} = 1 - (1 - \\alpha)^m$$\n- $m = \\binom{k}{2}$ ikili test sayısı.\n- 5 grup için $m = 10$ test yapılırsa: $\\alpha_{family} = 1 - (0.95)^{10} \\approx 0.40$ (%40 yalancı pozitif riski!). Bu nedenle **ANOVA** kullanılır.',
        en: 'Running pairwise $t$-tests across $k \\ge 3$ groups causes severe error inflation (`INDR 252 Lecture 16`):\n\n**Family-Wise Error Rate:**\n$$\\alpha_{family} = 1 - (1 - \\alpha)^m$$\n- For $k=5$ groups, $m=10$ pairwise tests yield $\\alpha_{family} \\approx 0.40$ (40% chance of false positive!). **ANOVA** solves this by testing all means simultaneously.'
      },
      companyExample: {
        tr: 'MediaImpact 4 farklı reklam kampanyasını kıyaslamak istiyor. $\\binom{4}{2} = 6$ ayrı $t$-testi yapmak yerine tek bir ANOVA testi ile hata riski %5\'te tutulur.',
        en: 'Comparing 4 ad campaigns: Instead of 6 pairwise t-tests with 26% error risk, One-Way ANOVA controls overall $\\alpha$ at 5%.'
      },
      vocabTerms: [
        { term_en: 'family-wise error rate', explanation_tr: 'Birden fazla hipotez testi yapıldığında en az bir Tip 1 hata yapma birleşik olasılığı.', explanation_en: 'The probability of making at least one Type I error across a family of statistical tests.', exampleSentence_en: 'ANOVA protects against family-wise error rate inflation.' }
      ],
      questions: [
        {
          id: 'm9-l1-q1',
          type: 'multiple_choice',
          prompt: { tr: '3 veya daha fazla grubun ortalamalarını kıyaslarken ikili t-testleri yerine neden ANOVA tercih edilir?', en: 'Why is ANOVA preferred over multiple t-tests for 3+ groups?' },
          options: [
            { tr: 'Tip 1 hata şişmesini önlemek ve tüm grupları tek seferde test etmek için', en: 'To prevent Type 1 error inflation and test all groups simultaneously' },
            { tr: 'ANOVA varyansı sıfıra indirdiği için', en: 'Because ANOVA reduces variance to zero' },
            { tr: 't-testi formülü bilinmediği için', en: 'Because t-test cannot be computed' },
            { tr: 'Sadece 2 grup olduğunda çalıştığı için', en: 'Because it only works for 2 groups' }
          ],
          correctAnswer: 'Tip 1 hata şişmesini önlemek ve tüm grupları tek seferde test etmek için',
          explanation: { tr: 'ANOVA $\\alpha$ hata payını %5\'te sabitleyerek tüm grup ortalamalarının eşitliğini tek $F$-testi ile sınar.', en: 'ANOVA controls overall $\\alpha$ while testing equality of all group means in a single omnibus test.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=ANOVA: Tek Etken Veri Analiz Aracı',
        pythonCode: 'from scipy.stats import f_oneway\nf_stat, p_val = f_oneway(group1, group2, group3)',
        powerBiNote: { tr: 'Grup karşılaştırma kutu grafiklerinde ANOVA p-değeri raporlanır.', en: 'Report ANOVA p-values on group boxplot charts.' }
      }
    },
    {
      id: 'm9-l2',
      moduleId: 'module-9',
      order: 2,
      difficulty: 'orta-ustu',
      title: { tr: 'Tek Yönlü ANOVA ve $F$-İstatistiği Hesabı', en: 'One-Way ANOVA and $F$-Statistic Calculation' },
      conceptCard: {
        tr: 'ANOVA, toplam varyansı gruplar arası ve grup içi olarak ikiye ayırır (`INDR 252 Lecture 16`):\n\n1. **$H_0: \\mu_1 = \\mu_2 = \\dots = \\mu_k$**\n2. **Gruplar Arası Kareler Ortalaması ($MSB$):** $MSB = \\frac{SSB}{k - 1}$\n3. **Grup İçi Kareler Ortalaması ($MSW$):** $MSW = \\frac{SSW}{N - k}$\n4. **$F$-İstatistiği:**\n$$F = \\frac{MSB}{MSW}, \\quad df_1 = k - 1, \\quad df_2 = N - k$$\n- $F > F_{crit} \\implies$ En az bir grup ortalaması diğerlerinden anlamlı derecede farklıdır.',
        en: 'One-Way ANOVA partitions total variance into between-group and within-group (`INDR 252 Lecture 16`):\n\n1. **$H_0: \\mu_1 = \\mu_2 = \\dots = \\mu_k$**\n2. **Between-Group Mean Square ($MSB$):** $MSB = \\frac{SSB}{k - 1}$\n3. **Within-Group Mean Square ($MSW$):** $MSW = \\frac{SSW}{N - k}$\n4. **$F$-Statistic:**\n$$F = \\frac{MSB}{MSW}, \\quad df_1 = k - 1, \\quad df_2 = N - k$$\n- $F > F_{crit} \\implies$ At least one group mean is significantly different.'
      },
      companyExample: {
        tr: 'MediaImpact 3 kampanya satışlarında ($k=3, N=30$): $MSB = 150, MSW = 30$ bulmuştur. $F = 150 / 30 = 5.0$. $p < 0.05$ olduğundan en az bir kampanyanın satış etkisi farklıdır.',
        en: '3 campaigns ($k=3, N=30$): $MSB=150, MSW=30 \\implies F = 5.0$. $p < 0.05$ confirms marketing performance differs significantly.'
      },
      vocabTerms: [
        { term_en: 'mean square between', explanation_tr: 'Grup ortalamalarının genel ortalamadan olan değişkenliği ($MSB$).', explanation_en: 'Variance estimate based on differences between group sample means.', exampleSentence_en: 'A large MSB relative to MSW results in a significant F-statistic.' }
      ],
      questions: [
        {
          id: 'm9-l2-q1',
          type: 'numeric',
          prompt: { tr: 'Bir ANOVA tablosunda $MSB = 80$ ve $MSW = 20$ ise $F$-istatistiği kaçtır?', en: 'If an ANOVA table has $MSB = 80$ and $MSW = 20$, what is the $F$-statistic?' },
          correctAnswer: 4,
          explanation: { tr: '$$F = \\frac{MSB}{MSW} = \\frac{80}{20} = 4$$', en: '$$F = \\frac{MSB}{MSW} = \\frac{80}{20} = 4$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=F.DAĞ.SAĞ(F_Değeri; df1; df2)',
        pythonCode: 'import statsmodels.api as sm\nfrom statsmodels.formula.api import ols\nanova_table = sm.stats.anova_lm(ols("sales ~ C(campaign)", data=df).fit())',
        powerBiNote: { tr: 'ANOVA özet tablosu rapor görseli olarak eklenir.', en: 'ANOVA summary table is rendered on executive dashboards.' }
      }
    },
    {
      id: 'm9-l3',
      moduleId: 'module-9',
      order: 3,
      difficulty: 'orta-ustu',
      title: { tr: 'ANOVA Varsayımları & Levene Varyans Homojenlik Testi', en: 'ANOVA Assumptions & Levene Test of Homogeneity' },
      conceptCard: {
        tr: 'ANOVA\'nın geçerli olması için gereken 3 şart (`INDR 252 Lecture 16`):\n\n1. **Bağımsızlık:** Gruplar ve gözlemler bağımsız olmalıdır.\n2. **Normallik:** Her gruptaki popülasyon yaklaşık normal dağılmalıdır (Q-Q plot ile kontrol edilir).\n3. **Varyans Homojenliği (Homoscedasticity):** Tüm grupların popülasyon varyansları eşit olmalıdır ($\\sigma_1^2 = \\sigma_2^2 = \\dots = \\sigma_k^2$).\n\n**Levene Testi ($H_0: \\sigma_1^2 = \\dots = \\sigma_k^2$):**\n- $p > 0.05 \\implies$ Varyanslar eşittir (ANOVA güvenle uygulanır).\n- $p \\le 0.05 \\implies$ Varyanslar eşit değildir (Welch ANOVA kullanılır).',
        en: 'The 3 core assumptions for valid ANOVA (`INDR 252 Lecture 16`):\n\n1. **Independence:** Independent observations.\n2. **Normality:** Each group normally distributed.\n3. **Homogeneity of Variances:** $\\sigma_1^2 = \\sigma_2^2 = \\dots = \\sigma_k^2$.\n\n**Levene\'s Test ($H_0: \\sigma_1^2 = \\dots = \\sigma_k^2$):**\n- $p > 0.05 \\implies$ Homogeneous variances (standard ANOVA valid).\n- $p \\le 0.05 \\implies$ Heterogeneous variances (use Welch ANOVA).'
      },
      companyExample: {
        tr: '3 üretim hattı numunelerinde Levene testi $p = 0.32$ bulunmuştur ($p > 0.05$). Varyanslar homojendir, standart ANOVA güvenle çalıştırılır.',
        en: 'Levene test across 3 production lines yields $p = 0.32 > 0.05$, validating equal variance assumption.'
      },
      vocabTerms: [
        { term_en: 'Levene test', explanation_tr: 'Gruplar arası varyansların eşitliğini test eden parametrik olmayan dayanıklı test.', explanation_en: 'An inferential statistic used to assess the equality of variances across groups.', exampleSentence_en: 'Levene test verifies ANOVA homogeneity assumption.' }
      ],
      questions: [
        {
          id: 'm9-l3-q1',
          type: 'multiple_choice',
          prompt: { tr: 'Levene varyans homojenlik testinde $p = 0.01$ çıkması ne anlama gelir?', en: 'What does $p = 0.01$ in Levene\'s test indicate?' },
          options: [
            { tr: 'Grup varyansları eşit DEĞİLDİR (Homojenlik varsayımı ihlal edilmiştir)', en: 'Group variances are NOT equal (Homogeneity violated)' },
            { tr: 'Grup varyansları tamamen eşittir', en: 'Group variances are perfectly equal' },
            { tr: 'Grupların ortalamaları eşittir', en: 'Group means are equal' },
            { tr: 'Veriler normal dağılmamaktadır', en: 'Data is not normal' }
          ],
          correctAnswer: 'Grup varyansları eşit DEĞİLDİR (Homojenlik varsayımı ihlal edilmiştir)',
          explanation: { tr: '$p < 0.05$ olduğunda eşit varyans $H_0$ hipotezi reddedilir.', en: '$p < 0.05$ rejects equal variance null hypothesis.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=Varyans_Homojenlik_Kontrolü',
        pythonCode: 'from scipy.stats import levene\nstat, p_val = levene(g1, g2, g3)',
        powerBiNote: { tr: 'Varyans eşitliği onay kartı eklenir.', en: 'Include variance homogeneity verification card.' }
      }
    },
    {
      id: 'm9-l4',
      moduleId: 'module-9',
      order: 4,
      difficulty: 'orta-ustu',
      title: { tr: 'Post-Hoc Testleri: Tukey HSD ve Bonferroni', en: 'Post-Hoc Tests: Tukey HSD and Bonferroni' },
      conceptCard: {
        tr: 'ANOVA $H_0$\'ı reddettiğinde "Hangi gruplar birbirinden farklı?" sorusuna yanıt vermek için **Post-Hoc** çoklu karşılaştırma yapılır (`INDR 252 Lecture 16`):\n\n1. **Tukey HSD (Honestly Significant Difference):**\n$$HSD = q_{\\alpha, k, N-k} \\sqrt{\\frac{MSW}{n}}$$\nİki grup ortalama farkı $|\\bar{x}_i - \\bar{x}_j| > HSD$ ise bu iki grup birbirinden anlamlı derecede farklıdır.\n\n2. **Bonferroni Düzeltmesi:** Anlamlılık sınırını test sayısına böler: $\\alpha_{yeni} = \\frac{\\alpha}{m}$.',
        en: 'When ANOVA rejects $H_0$, Post-Hoc tests determine which specific group pairs differ (`INDR 252 Lecture 16`):\n\n1. **Tukey HSD (Honestly Significant Difference):**\n$$HSD = q_{\\alpha, k, N-k} \\sqrt{\\frac{MSW}{n}}$$\nIf $|\\bar{x}_i - \\bar{x}_j| > HSD$, the pair differs significantly.\n\n2. **Bonferroni Correction:** Adjusts threshold: $\\alpha_{new} = \\alpha / m$.'
      },
      companyExample: {
        tr: '3 kampanyada ANOVA anlamlı çıkmıştır ($p < 0.05$). Tukey HSD testi ile Kampanya A ve B arasında fark olmadığı ($p=0.45$), ancak Kampanya C\'nin hem A\'dan hem B\'den anlamlı derecede üstün olduğu ($p < 0.01$) kanıtlanmıştır.',
        en: 'Tukey HSD reveals Campaign C significantly outperforms both A and B ($p < 0.01$), while A and B have no significant difference.'
      },
      vocabTerms: [
        { term_en: 'Tukey HSD', explanation_tr: 'ANOVA sonrası hangi grup çiftlerinin birbirinden anlamlı derecede farklı olduğunu belirleyen post-hoc test.', explanation_en: 'A single-step multiple comparison procedure used to find means that are significantly different from each other.', exampleSentence_en: 'Tukey HSD maintains the family-wise error rate at alpha.' }
      ],
      questions: [
        {
          id: 'm9-l4-q1',
          type: 'multiple_choice',
          prompt: { tr: 'Tukey HSD testi hangi aşamada uygulanır?', en: 'At what stage is the Tukey HSD test performed?' },
          options: [
            { tr: 'Yalnızca ANOVA testi anlamlı çıkıp H0 reddedildikten sonra', en: 'Only after ANOVA test is significant and H0 is rejected' },
            { tr: 'ANOVA testinden önce', en: 'Before running ANOVA' },
            { tr: 'ANOVA testi anlamsız çıktığında', en: 'When ANOVA test is not significant' },
            { tr: 'Yalnızca 2 grup varken', en: 'Only when there are 2 groups' }
          ],
          correctAnswer: 'Yalnızca ANOVA testi anlamlı çıkıp H0 reddedildikten sonra',
          explanation: { tr: 'Post-hoc testler sadece genel ANOVA testi gruplar arası fark olduğunu ispatladığında ($p < \\alpha$) hangi grubun farklı olduğunu bulmak için yapılır.', en: 'Post-hoc multiple comparisons are conducted only following a significant omnibus ANOVA result.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=Tukey_HSD_Formülü',
        pythonCode: 'from statsmodels.stats.multicomp import pairwise_tukeyhsd\ntukey = pairwise_tukeyhsd(df["sales"], df["group"], alpha=0.05)',
        powerBiNote: { tr: 'Farklı çıkan gruplar sütun grafiklerinde harflerle (A, B, C) işaretlenir.', en: 'Group difference letters (A, B, C) are added to column charts.' }
      }
    },
    {
      id: 'm9-l5',
      moduleId: 'module-9',
      order: 5,
      difficulty: 'orta-ustu',
      title: { tr: 'Ki-Kare ($\chi^2$) Uyum İyiliği ve Bağımsızlık Testleri', en: 'Chi-Square ($\chi^2$) Goodness-of-Fit and Independence Tests' },
      conceptCard: {
        tr: 'Kategorik sayım verilerini analiz etme (`INDR 252 Lecture 16`, `CEx14`):\n\n1. **Ki-Kare Test İstatistiği:**\n$$\\chi^2 = \\sum \\frac{(O - E)^2}{E}$$\n- $O$: Gözlenen Frekans (Observed)\n- $E$: Beklenen Frekans (Expected)\n\n2. **Bağımsızlık Testi ($r \\times c$ Tablosu):**\n$$E_{ij} = \\frac{\\text{Satır } i \\text{ Toplamı} \\times \\text{Sütun } j \\text{ Toplamı}}{\\text{Genel Toplam}}, \\quad df = (r-1)(c-1)$$\n- $H_0$: İki kategorik değişken birbirinden bağımsızdır.',
        en: 'Analyzing categorical frequency counts (`INDR 252 Lecture 16`, `CEx14`):\n\n1. **Chi-Square Test Statistic:**\n$$\\chi^2 = \\sum \\frac{(O - E)^2}{E}$$\n- $O$: Observed Frequency, $E$: Expected Frequency\n\n2. **Test of Independence ($r \\times c$ Table):**\n$$E_{ij} = \\frac{\\text{Row } i \\text{ Total} \\times \\text{Column } j \\text{ Total}}{\\text{Grand Total}}, \\quad df = (r-1)(c-1)$$\n- $H_0$: The two categorical variables are independent.'
      },
      companyExample: {
        tr: 'Fabrika işçi tipleri (Mavi Yaka / Beyaz Yaka) ile Emeklilik Planı tercihi (Plan A, B, C) arasındaki çapraz tabloda $\\chi^2 = 14.8, df = (2-1)(3-1) = 2$ bulunmuştur (`CEx14`). $p < 0.01$ ile işçi tipi ile plan tercihi arasında anlamlı bağımlılık ispatlanır.',
        en: 'Worker type vs Pension plan choice cross-tabulation yields $\\chi^2 = 14.8, df=2$ (`CEx14`). $p < 0.01$ confirms significant dependency.'
      },
      vocabTerms: [
        { term_en: 'chi-square test of independence', explanation_tr: 'İki kategorik değişken arasında istatistiksel bağımlılık olup olmadığını test eden yöntem.', explanation_en: 'Hypothesis test determining whether two categorical variables are associated.', exampleSentence_en: 'Chi-square test of independence confirms customer segment affects device choice.' }
      ],
      questions: [
        {
          id: 'm9-l5-q1',
          type: 'numeric',
          prompt: { tr: 'Satır toplamı 40, sütun toplamı 50 ve genel toplam 200 olan bir hücrenin Beklenen Değeri ($E_{ij}$) kaçtır?', en: 'If row total is 40, column total is 50, and grand total is 200, what is expected cell frequency $E_{ij}$?' },
          correctAnswer: 10,
          explanation: { tr: '$$E_{ij} = \\frac{40 \\times 50}{200} = \\frac{2000}{200} = 10$$', en: '$$E_{ij} = \\frac{40 \\times 50}{200} = 10$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=KİKARE.TEST(Gözlenen_Tablo; Beklenen_Tablo)',
        pythonCode: 'from scipy.stats import chi2_contingency\nchi2, p, dof, ex = chi2_contingency(contingency_table)',
        powerBiNote: { tr: 'Çapraz Matris (Matrix Table) ile ki-kare frekansları gösterilir.', en: 'Cross-tabulation matrix displays observed vs expected counts.' }
      }
    },
    {
      id: 'm9-l6',
      moduleId: 'module-9',
      order: 6,
      difficulty: 'zor',
      title: { tr: 'Kısmi $F$-Testi & Model Seçiminde Mallows\' $C_p$', en: 'Partial $F$-Test & Mallows\' $C_p$ Model Selection' },
      conceptCard: {
        tr: 'Regresyon modelinden bir grup değişkeni elemenin doğruluğunu test etme (`INDR 252 Lecture 23`):\n\n1. **Kısmi $F$-Testi (Full vs. Reduced Model):**\n$$F = \\frac{(SSE_{red} - SSE_{full}) / q}{MSE_{full}}, \\quad df_1 = q, \\quad df_2 = n - k_{full} - 1$$\n- $q$: Elenmek istenen değişken sayısı. $p > 0.05$ ise $q$ adet değişken modelden güvenle çıkarılır.\n\n2. **Mallows\' $C_p$ Kriteri:**\n$$C_p = \\frac{SSE_p}{S^2} - (n - 2p)$$\n- $p$: Modele alınan değişken sayısı + 1 (kesen).\n- **Kural:** $C_p \\approx p$ ve $C_p \\le p$ olan model en az sapmalı (optimum) modeldir.',
        en: 'Testing whether a subset of predictors can be dropped (`INDR 252 Lecture 23`):\n\n1. **Partial $F$-Test (Full vs. Reduced):**\n$$F = \\frac{(SSE_{red} - SSE_{full}) / q}{MSE_{full}}, \\quad df_1 = q, \\quad df_2 = n - k_{full} - 1$$\n\n2. **Mallows\' $C_p$ Criterion:**\n$$C_p = \\frac{SSE_p}{S^2} - (n - 2p)$$\n- **Rule:** A model with $C_p \\approx p$ and small $C_p$ indicates low bias and optimum complexity.'
      },
      companyExample: {
        tr: 'DataVal 8 değişkenli regresyon modelinde 3 değişkeni eleyerek $C_p = 4.2 \\approx 5$ olan 4 değişkenli sade modeli seçmiştir. Model performans kaybetmeden sadeleşmiştir.',
        en: 'DataVal drops 3 redundant predictors, achieving $C_p = 4.2 \\approx 5$ for an optimal parsimonious model.'
      },
      vocabTerms: [
        { term_en: 'Mallows Cp', explanation_tr: 'En uygun regresyon alt modelini seçmek için sapma ve varyansı dengeleyen kriter ($C_p$).', explanation_en: 'A metric assessing the fit of a regression model that has been estimated using OLS, penalizing complexity.', exampleSentence_en: 'An optimal subset model has Mallows Cp close to p.' }
      ],
      questions: [
        {
          id: 'm9-l6-q1',
          type: 'multiple_choice',
          prompt: { tr: 'Mallows\' $C_p$ model seçim kriterinde en ideal model hangi koşulu sağlar?', en: 'In Mallows\' $C_p$ model selection, what characterizes the optimal model?' },
          options: [
            { tr: 'Cp değerinin p parametre sayısına yakın (Cp ≈ p) ve küçük olması', en: 'Cp is close to p (Cp ≈ p) and small' },
            { tr: 'Cp değerinin sıfır olması', en: 'Cp equals zero' },
            { tr: 'Cp değerinin n örneklem boyutuna eşit olması', en: 'Cp equals sample size n' },
            { tr: 'Cp değerinin negatif ve sonsuz olması', en: 'Cp is infinitely negative' }
          ],
          correctAnswer: 'Cp değerinin p parametre sayısına yakın (Cp ≈ p) ve küçük olması',
          explanation: { tr: '$C_p \\approx p$ olması modelin sapmasız olduğunu ve gereksiz değişken içermediğini gösterir.', en: '$C_p \\approx p$ indicates the model is unbiased with optimal parameter balance.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=Kısmi_F_Hesabı',
        pythonCode: 'import statsmodels.api as sm\n# anova_lm compares two nested models (reduced vs full)\nsm.stats.anova_lm(model_red, model_full)',
        powerBiNote: { tr: 'Model değişken seçim panosunda Cp grafiği çizdirilir.', en: 'Display Cp vs p curves in model selection visual.' }
      }
    }
  ];
  return m;
});

// -----------------------------------------------------------------
// 10. MODULE 10: Zaman Serileri & Parametrik Olmayan Testler (INDR 252)
// -----------------------------------------------------------------
updateModule('module10.json', (m) => {
  m.lessons = [
    {
      id: 'm10-l1',
      moduleId: 'module-10',
      order: 1,
      difficulty: 'basit',
      title: { tr: 'Zaman Serisi Bileşenleri (Trend, Mevsimsellik) [Bonus]', en: 'Time Series Components (Trend, Seasonality) [Bonus]' },
      conceptCard: {
        tr: 'Zaman içinde düzenli aralıklarla toplanan veri setlerindeki 4 temel bileşen:\n\n1. **Trend ($T$):** Uzun vadeli artış veya azalış eğilimi.\n2. **Mevsimsellik (Seasonality - $S$):** Yıl, hafta veya gün içinde tekrarlanan periyodik dalgalanma (Örn: Yaz aylarında dondurma satışı).\n3. **Döngüsellik (Cyclic - $C$):** Ekonomik konjonktüre bağlı çok yıllık dalgalanmalar.\n4. **Rassallık / Gürültü (Irregular/Noise - $I$):** Öngörülemeyen rastgele sapmalar.\n\n- **Toplamsal Model:** $Y_t = T_t + S_t + I_t$\n- **Çarpımsal Model:** $Y_t = T_t \\times S_t \\times I_t$',
        en: 'The 4 fundamental components of time series data:\n\n1. **Trend ($T$):** Long-term upward or downward movement.\n2. **Seasonality ($S$):** Repeating cyclical fluctuations over fixed periods (e.g. quarterly peaks).\n3. **Cyclical ($C$):** Multi-year macroeconomic cycles.\n4. **Irregular/Noise ($I$):** Random unpredictable noise.\n\n- **Additive:** $Y_t = T_t + S_t + I_t$\n- **Multiplicative:** $Y_t = T_t \\times S_t \\times I_t$'
      },
      companyExample: {
        tr: 'RetailCo e-ticaret satışlarında: Her yıl %15 büyüme Trend ($T$), Kasım indirimleri Mevsimsellik ($S$), sunucu kesintisi kaynaklı anlık düşüş Rassallık ($I$) bileşenidir.',
        en: 'RetailCo: Annual 15% revenue growth is Trend ($T$), Black Friday spike is Seasonality ($S$), server crash dip is Noise ($I$).'
      },
      vocabTerms: [
        { term_en: 'seasonality', explanation_tr: 'Belirli sabit zaman aralıklarında tekrarlanan periyodik dalgalanma paterni.', explanation_en: 'A characteristic of a time series in which data experiences regular and predictable changes.', exampleSentence_en: 'Retail sales exhibit strong Q4 holiday seasonality.' }
      ],
      questions: [
        {
          id: 'm10-l1-q1',
          type: 'multiple_choice',
          prompt: { tr: 'Her yılın Aralık ayında perakende satışlarının düzenli olarak zirve yapması hangi zaman serisi bileşenine örnektir?', en: 'Retail sales peaking every December is an example of which component?' },
          options: [
            { tr: 'Mevsimsellik (Seasonality)', en: 'Seasonality' },
            { tr: 'Trend', en: 'Trend' },
            { tr: 'Rassal Gürültü', en: 'Random Noise' },
            { tr: 'Durağanlık', en: 'Stationarity' }
          ],
          correctAnswer: 'Mevsimsellik (Seasonality)',
          explanation: { tr: 'Yılın aynı döneminde düzenli tekrarlanan dalgalanmalar mevsimsellik (Seasonality) bileşenidir.', en: 'Predictable calendar-based repetitions represent seasonality.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=Zaman Çizelgesi Grafiği ve Trend Ekle',
        pythonCode: 'from statsmodels.tsa.seasonal import seasonal_decompose\nres = seasonal_decompose(df["sales"], model="additive")',
        powerBiNote: { tr: 'Power BI Analytics bölmesinden Forecast (Tahmin) açılır.', en: 'Enable built-in Power BI time-series forecast tool.' }
      }
    },
    {
      id: 'm10-l2',
      moduleId: 'module-10',
      order: 2,
      difficulty: 'orta',
      title: { tr: 'Hareketli Ortalama ($SMA / WMA$) [Bonus]', en: 'Moving Averages ($SMA / WMA$) [Bonus]' },
      conceptCard: {
        tr: 'Kısa vadeli rassal dalgalanmaları ve gürültüyü filtreleyerek ana eğilimi çıkarma yöntemi:\n\n1. **Basit Hareketli Ortalama ($k$-dönemlik SMA):**\n$$SMA_t = \\frac{y_t + y_{t-1} + \\dots + y_{t-k+1}}{k}$$\n2. **Ağırlıklı Hareketli Ortalama (WMA):**\nEn son güncel dönemlere daha yüksek ağırlık verilir:\n$$WMA_t = \\sum_{i=1}^k w_i y_{t-i+1}, \\quad \\sum w_i = 1$$',
        en: 'Smoothing short-term noise to expose underlying baseline trend:\n\n1. **Simple Moving Average ($k$-period SMA):**\n$$SMA_t = \\frac{1}{k}\\sum_{i=0}^{k-1} y_{t-i}$$\n2. **Weighted Moving Average (WMA):**\nAssigns higher weights to more recent time periods:\n$$WMA_t = \\sum w_i y_{t-i+1}, \\quad \\sum w_i = 1$$'
      },
      companyExample: {
        tr: 'RetailCo son 3 aylık satışları: Ocak: 100, Şubat: 120, Mart: 140. 3 aylık SMA tahmini = $(100 + 120 + 140) / 3 = 120$ adet.',
        en: 'Monthly sales: Jan: 100, Feb: 120, Mar: 140. 3-month SMA forecast = $(100+120+140)/3 = 120$.'
      },
      vocabTerms: [
        { term_en: 'moving average', explanation_tr: 'Zaman serisinde ardışık alt aralıkların ortalamasını alarak gürültüyü filtreleyen yöntem.', explanation_en: 'A calculation used to analyze data points by creating a series of averages of different subsets.', exampleSentence_en: 'A 50-day moving average smooths out daily price fluctuations.' }
      ],
      questions: [
        {
          id: 'm10-l2-q1',
          type: 'numeric',
          prompt: { tr: 'Son 4 dönemin değerleri $10, 20, 30, 40$ ise 4 dönemlik Basit Hareketli Ortalama ($SMA$) kaçtır?', en: 'If last 4 observations are $10, 20, 30, 40$, what is the 4-period SMA?' },
          correctAnswer: 25,
          explanation: { tr: '$$SMA = \\frac{10 + 20 + 30 + 40}{4} = \\frac{100}{4} = 25$$', en: '$$SMA = \\frac{100}{4} = 25$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=ORTALAMA(A1:A3)',
        pythonCode: 'df["sma_3"] = df["sales"].rolling(window=3).mean()',
        powerBiNote: { tr: 'Quick Measure: Rolling average oluşturulabilir.', en: 'Create quick measure: Rolling average.' }
      }
    },
    {
      id: 'm10-l3',
      moduleId: 'module-10',
      order: 3,
      difficulty: 'orta',
      title: { tr: 'Basit Üstel Düzleştirme (Exponential Smoothing) [Bonus]', en: 'Single Exponential Smoothing [Bonus]' },
      conceptCard: {
        tr: 'Geçmiş tüm gözlemleri üstel olarak azalan ağırlıklarla hesaba katan tahmin yöntemi:\n\n$$\\hat{y}_{t+1} = \\alpha y_t + (1 - \\alpha) \\hat{y}_t$$\n\n- $\\alpha$: Düzleştirme Sabiti ($0 < \\alpha < 1$)\n- **$\\alpha \\to 1$:** En son gözleme çok yüksek tepki verir (Dinamik).\n- **$\\alpha \\to 0$:** Geçmiş tahmin ortalamasına bağlı kalır (Aşırı yumuşak).',
        en: 'Forecasting using exponentially decreasing weights for past observations:\n\n$$\\hat{y}_{t+1} = \\alpha y_t + (1 - \\alpha) \\hat{y}_t$$\n\n- $\\alpha$: Smoothing parameter ($0 < \\alpha < 1$).\n- **Large $\\alpha$ ($\to 1$):** Highly responsive to recent changes.\n- **Small $\\alpha$ ($\to 0$):** Smooths out noise heavily.'
      },
      companyExample: {
        tr: 'Bu dönemin tahmini $\\hat{y}_t = 100$, gerçekleşen satış $y_t = 120$ ve $\\alpha = 0.30$ ise gelecek dönem tahmini: $\\hat{y}_{t+1} = 0.30(120) + 0.70(100) = 36 + 70 = 106$ adet.',
        en: 'Forecast $\\hat{y}_t = 100$, actual $y_t = 120$, $\\alpha = 0.30$. Next forecast: $\\hat{y}_{t+1} = 0.30(120) + 0.70(100) = 106$.'
      },
      vocabTerms: [
        { term_en: 'exponential smoothing', explanation_tr: 'Geçmiş verilere üstel azalan ağırlıklar vererek kısa vadeli tahmin üreten yöntem.', explanation_en: 'A rule of thumb technique for smoothing time series data using the exponential window function.', exampleSentence_en: 'Exponential smoothing adapts quickly to demand level shifts.' }
      ],
      questions: [
        {
          id: 'm10-l3-q1',
          type: 'numeric',
          prompt: { tr: 'Gerçekleşen $y_t = 80$, önceki tahmin $\\hat{y}_t = 60$ ve $\\alpha = 0.50$ ise yeni tahmin $\\hat{y}_{t+1}$ kaçtır?', en: 'If actual $y_t = 80$, prior forecast $\\hat{y}_t = 60$, and $\\alpha = 0.50$, what is next forecast $\\hat{y}_{t+1}$?' },
          correctAnswer: 70,
          explanation: { tr: '$$\\hat{y}_{t+1} = 0.50(80) + 0.50(60) = 40 + 30 = 70$$', en: '$$\\hat{y}_{t+1} = 40 + 30 = 70$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=alpha*Gerçekleşen + (1-alpha)*Önceki_Tahmin',
        pythonCode: 'from statsmodels.tsa.holtwinters import SimpleExpSmoothing\nmodel = SimpleExpSmoothing(data).fit(smoothing_level=0.3)',
        powerBiNote: { tr: 'Talep tahminleme panolarında kullanılır.', en: 'Applied on demand planning dashboards.' }
      }
    },
    {
      id: 'm10-l4',
      moduleId: 'module-10',
      order: 4,
      difficulty: 'orta-ustu',
      title: { tr: 'Ki-Kare Hücre Birleştirme ($E_{ij} < 5$ Kuralı)', en: 'Chi-Square Cell Merging ($E_{ij} < 5$ Rule)' },
      conceptCard: {
        tr: 'Ki-Kare ($\chi^2$) bağımsızlık ve uyum iyiliği testinin geçerli olabilmesi için temel kural (`INDR 252 Case Rules`, `Lecture 16`):\n\n**Hücre Birleştirme Kuralı:**\nTablodaki beklenen frekans değerlerinin ($E_{ij}$) hiçbirisi 5\'ten küçük olmamalıdır ($E_{ij} \\ge 5$).\n\n- Eğer $E_{ij} < 5$ olan hücreler varsa, testin $p$-değeri güvenilmez olur.\n- **Çözüm:** Benzer özellik taşıyan bitişik kategoriler veya düşük frekanslı sınıflar birleştirilerek tek bir kategori yapılır ve serbestlik derecesi yeniden hesaplanır.',
        en: 'Essential validity requirement for Chi-square tests (`INDR 252 Case Rules`, `Lecture 16`):\n\n**Expected Cell Frequency Rule ($E_{ij} \\ge 5$):**\nAll expected cell counts must be at least 5 ($E_{ij} \\ge 5$).\n\n- If $E_{ij} < 5$, the chi-square approximation breaks down.\n- **Solution:** Merge sparse neighboring categories to satisfy $E_{ij} \\ge 5$, then recalculate degrees of freedom.'
      },
      companyExample: {
        tr: 'RetailCo müşteri cihaz tercihinde "Akıllı Saat" kategorisi için $E_{ij} = 2.4 < 5$ çıkmıştır. Akıllı saat kategorisi "Tablet" ile birleştirilerek $E_{ij} = 8.6 \\ge 5$ sağlanmış ve test geçerli kılınmıştır (`DataPulse Case`).',
        en: 'Smartwatch category has $E_{ij} = 2.4 < 5$. Merging Smartwatch with Tablet gives $E_{ij} = 8.6 \\ge 5$, restoring test validity.'
      },
      vocabTerms: [
        { term_en: 'cell merging', explanation_tr: 'Ki-Kare testinde beklenen frekansı 5\'ten küçük olan kategorileri birleştirme işlemi.', explanation_en: 'Combining sparse categories in contingency tables to satisfy minimum expected count assumptions.', exampleSentence_en: 'Cell merging ensures chi-square test validity when counts are small.' }
      ],
      questions: [
        {
          id: 'm10-l4-q1',
          type: 'multiple_choice',
          prompt: { tr: 'Ki-Kare testinde bir hücrenin beklenen değeri $E_{ij} = 3$ çıkarsa ne yapılmalıdır?', en: 'If an expected cell count is $E_{ij} = 3$ in a chi-square test, what should be done?' },
          options: [
            { tr: 'Düşük frekanslı kategori benzer bir kategoriyle birleştirilmelidir (Eij ≥ 5 kuralı)', en: 'Merge low-frequency category with a similar category (Eij ≥ 5 rule)' },
            { tr: 'O hücreyi tablodan tamamen silip testi yok saymak', en: 'Delete that cell from the table' },
            { tr: 'Testi Z-testine dönüştürmek', en: 'Convert the test to Z-test' },
            { tr: 'Hiçbir işlem yapmadan p-değerini kabul etmek', en: 'Accept p-value without modification' }
          ],
          correctAnswer: 'Düşük frekanslı kategori benzer bir kategoriyle birleştirilmelidir (Eij ≥ 5 kuralı)',
          explanation: { tr: 'INDR 252 kuralı gereği $E_{ij} < 5$ olan kategoriler birleştirilerek testin geçerliliği sağlanır.', en: 'By standard statistical guidelines, categories with $E_{ij} < 5$ are collapsed.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=EĞER(E_ij < 5; "Kategori Birleştir"; "Geçerli")',
        pythonCode: '# Combine categories in pandas before running chi2\ndf["merged_cat"] = df["device"].replace({"Smartwatch": "Tablet/Watch"})',
        powerBiNote: { tr: 'Gruplama (Group) özelliği ile kategoriler birleştirilir.', en: 'Use Grouping feature to collapse sparse categories.' }
      }
    },
    {
      id: 'm10-l5',
      moduleId: 'module-10',
      order: 5,
      difficulty: 'orta-ustu',
      title: { tr: 'Parametrik Olmayan Testler (Mann-Whitney U & Wilcoxon) [Bonus]', en: 'Non-Parametric Tests (Mann-Whitney U & Wilcoxon) [Bonus]' },
      conceptCard: {
        tr: 'Veriler normal dağılmadığında veya sıra/puanlama (ordinal) verisi olduğunda parametrik olmayan testler kullanılır:\n\n1. **Mann-Whitney U Testi (İki Bağımsız Grup):**\nBağımsız iki örneklem $t$-testinin non-parametrik karşılığıdır. Değerler yerine sıraları (ranks) kıyaslar.\n\n2. **Wilcoxon İşaretli Sıralar Testi (Eşleştirilmiş Grup):**\nPaired $t$-testinin non-parametrik karşılığıdır. Öncesi/sonrası farkların işaretli medyanını test eder.',
        en: 'Non-parametric alternatives when normality fails or data is ordinal:\n\n1. **Mann-Whitney U Test (Independent Groups):**\nNon-parametric alternative to independent two-sample t-test using rank sums.\n\n2. **Wilcoxon Signed-Rank Test (Paired Groups):**\nNon-parametric alternative to paired t-test evaluating median differences.'
      },
      companyExample: {
        tr: 'Müşteri memnuniyet puanları (1-5 yıldız) aşırı çarpıktır ve normal değildir. İki şube kıyaslamasında $t$-testi yerine Mann-Whitney U testi uygulanarak sıralar üzerinden adil kıyaslama yapılır.',
        en: '1-5 star customer ratings are non-normal. Mann-Whitney U test evaluates median difference across branch ranks.'
      },
      vocabTerms: [
        { term_en: 'Mann-Whitney U test', explanation_tr: 'Normallik varsayımı gerektirmeyen bağımsız iki grup sıra toplamı testi.', explanation_en: 'A non-parametric test of the null hypothesis that two independent samples come from the same distribution.', exampleSentence_en: 'Mann-Whitney U test is ideal for ordinal survey scales.' }
      ],
      questions: [
        {
          id: 'm10-l5-q1',
          type: 'multiple_choice',
          prompt: { tr: 'Normallik varsayımı sağlanamayan eşleştirilmiş (paired) öncesi/sonrası ölçümlerde hangi test kullanılmalıdır?', en: 'Which test should be used for paired before/after measurements when normality fails?' },
          options: [
            { tr: 'Wilcoxon İşaretli Sıralar Testi', en: 'Wilcoxon Signed-Rank Test' },
            { tr: 'Mann-Whitney U Testi', en: 'Mann-Whitney U Test' },
            { tr: 'Standart ANOVA', en: 'Standard ANOVA' },
            { tr: 'Tek Örneklem Z-Testi', en: 'One-Sample Z-Test' }
          ],
          correctAnswer: 'Wilcoxon İşaretli Sıralar Testi',
          explanation: { tr: 'Paired verilerin normallik gerektirmeyen non-parametrik alternatifi Wilcoxon testidir.', en: 'Wilcoxon signed-rank test is the non-parametric counterpart to paired t-test.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=Non-Parametric Rank Test',
        pythonCode: 'from scipy.stats import mannwhitneyu, wilcoxon\nstat, p = mannwhitneyu(group1, group2)',
        powerBiNote: { tr: 'Medyan ve IQR bazlı görselleştirmelerle desteklenir.', en: 'Supported by Median and IQR visual reporting.' }
      }
    }
  ];
  return m;
});

// -----------------------------------------------------------------
// 11. MODULE 11: End-to-End Capstone Case Study (INDR 252)
// -----------------------------------------------------------------
updateModule('module11.json', (m) => {
  m.lessons = [
    {
      id: 'm11-l1',
      moduleId: 'module-11',
      order: 1,
      difficulty: 'orta',
      title: { tr: 'Uçtan Uca Veri Analitiği Süreci & Veri Temizleme', en: 'End-to-End Analytics Workflow & Data Cleaning' },
      conceptCard: {
        tr: 'Profesyonel bir veri analitiği projesinin 5 adımı (`INDR 252 Case Exam Information`):\n\n1. **Veri Tanıma & İçe Aktarma:** Veri tiplerinin doğru formatlanması.\n2. **Eksik ve Aykırı Değer Yönetimi:** Aykırı değerlerin neden kaynaklandığının belirlenmesi; mantıklı gerekçe olmadan veriden çıkarılmaması kuralı.\n3. **Keşifçi Veri Analizi (EDA):** Histogram, Boxplot ve Zaman serisi grafikleriyle dağılımın incelenmesi.\n4. **İstatistiksel Hipotez Modellemesi:** Parametrik/Non-parametrik testler, regresyon.\n5. **İş Kararı & Yönetici Sunumu:** Sonuçların yönetici diliyle raporlanması.',
        en: 'The 5-stage professional data analytics workflow (`INDR 252 Case Exam Information`):\n\n1. **Data Ingestion:** Formatting data types.\n2. **Missing & Outlier Strategy:** Diagnosing root causes; never drop outliers without domain justification.\n3. **Exploratory Data Analysis (EDA):** Visualizing via histograms, boxplots, and time series.\n4. **Statistical Modeling:** Hypothesis tests, regression, confidence intervals.\n5. **Executive Actionable Reporting:** Translating statistical numbers into business recommendations.'
      },
      companyExample: {
        tr: 'MarkIE Call Center projesinde 5 günlük 30 dakikalık çağrı verileri yüklenip aykırı değerler incelenmiş, öğle saatlerindeki dönemsellik zaman serisiyle tespit edilmiştir (`MarkIE 2026`).',
        en: 'MarkIE Call Center project ingests 5-day call logs, inspects outliers, and isolates midday operational patterns (`MarkIE 2026`).'
      },
      vocabTerms: [
        { term_en: 'exploratory data analysis', explanation_tr: 'Veri setini modellemeden önce görsel ve sayısal özetlerle tanıma süreci (EDA).', explanation_en: 'An approach of analyzing data sets to summarize their main characteristics with visual methods.', exampleSentence_en: 'EDA reveals distribution skewness, outliers, and time dependencies.' }
      ],
      questions: [
        {
          id: 'm11-l1-q1',
          type: 'multiple_choice',
          prompt: { tr: 'İstatistiksel vaka raporlamasında aykırı değerlerle (outliers) ilgili hangi yaklaşım DOĞRUDUR (`Case Rules`)?', en: 'Which approach regarding outliers is correct in statistical case reports (`Case Rules`)?' },
          options: [
            { tr: 'Aykırı değerler gerekçelendirilerek analiz edilmeli; keyfi olarak veriden silinmemelidir', en: 'Outliers must be justified and evaluated; never deleted arbitrarily' },
            { tr: 'Tüm aykırı değerler analizi bozduğu için hemen silinmelidir', en: 'All outliers must be instantly deleted' },
            { tr: 'Aykırı değer varsa test yapılamaz', en: 'Tests cannot be performed if outliers exist' },
            { tr: 'Aykırı değerler ortalamayı etkilemez', en: 'Outliers do not affect the mean' }
          ],
          correctAnswer: 'Aykırı değerler gerekçelendirilerek analiz edilmeli; keyfi olarak veriden silinmemelidir',
          explanation: { tr: 'INDR 252 kuralları gereği aykırı değerlerin neden oluştuğu açıklanmalı ve raporda iş etkisi tartışılmalıdır.', en: 'Statistical guidelines require documenting the business cause and impact of outliers.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=Veri Temizleme ve Koşullu Biçimlendirme',
        pythonCode: 'df.describe().T\ndf.isnull().sum()',
        powerBiNote: { tr: 'Power Query ile veri temizleme adımları otomatikleştirilir.', en: 'Power Query automates ETL data preparation steps.' }
      }
    },
    {
      id: 'm11-l2',
      moduleId: 'module-11',
      order: 2,
      difficulty: 'orta-ustu',
      title: { tr: 'Keşifçi Veri Analizi, Normallik & Varyans $F$-Testi', en: 'EDA, Normality Verification & Variance $F$-Test' },
      conceptCard: {
        tr: 'Analiz öncesi 3 doğrulama (`MarkIE Case 2026`):\n\n1. **Dağılım Şekli & Çarpıklık:** Ortalama vs Medyan kıyası ve Histogram.\n2. **Normallik Kontrolü:** Normal Probability Plot (Q-Q Plot) düz çizgiye oturuyor mu?\n3. **Varyans Eşitliği Doğrulaması:** İki popülasyon kıyaslanacaksa $F = s_1^2 / s_2^2$ testi ile homojenlik kontrol edilmelidir.',
        en: 'The 3 verification steps before running inferential models (`MarkIE Case 2026`):\n\n1. **Distribution Shape & Skewness:** Mean vs Median comparison and Histograms.\n2. **Normality Check:** Normal Q-Q plot linear fit.\n3. **Variance Homogeneity:** $F = s_1^2 / s_2^2$ test prior to two-sample comparisons.'
      },
      companyExample: {
        tr: 'MarkIE çağrı sayılarında $\\bar{x} = 618$ çağrı/30dk, Medyan = 616 bulunmuştur. Q-Q grafiği normale yakın çıkmış, tek örneklem $t$-testi için normallik sağlanmıştır.',
        en: 'MarkIE calls: $\\bar{x}=618$, Median=616. Q-Q plot confirms normality, justifying one-sample $t$-test against 615 limit.'
      },
      vocabTerms: [
        { term_en: 'normality verification', explanation_tr: 'Parametrik testlerin gerektirdiği normallik koşulunun grafik ve testlerle doğrulanması.', explanation_en: 'Validating the assumption of normally distributed data before applying parametric procedures.', exampleSentence_en: 'Normality verification is mandatory prior to calculating t-intervals.' }
      ],
      questions: [
        {
          id: 'm11-l2-q1',
          type: 'numeric',
          prompt: { tr: 'Grup 1 varyansı $s_1^2 = 32$ ve Grup 2 varyansı $s_2^2 = 8$ ise varyans eşitliği için hesaplanan $F$-istatistiği kaçtır?', en: 'If Group 1 variance is $s_1^2 = 32$ and Group 2 variance is $s_2^2 = 8$, what is test $F$?' },
          correctAnswer: 4,
          explanation: { tr: '$$F = \\frac{s_1^2}{s_2^2} = \\frac{32}{8} = 4$$', en: '$$F = \\frac{32}{8} = 4$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=F.TEST(A1:A30; B1:B30)',
        pythonCode: 'stats.probplot(calls_data, dist="norm", plot=plt)\nplt.title("Q-Q Plot")',
        powerBiNote: { tr: 'Histogram ve Q-Q grafiği yan yana sunulur.', en: 'Render Histogram alongside Q-Q plot for executive review.' }
      }
    },
    {
      id: 'm11-l3',
      moduleId: 'module-11',
      order: 3,
      difficulty: 'orta-ustu',
      title: { tr: 'Endüstriyel A/B Testi & Etki Büyüklüğü (Cohen\'s $d$) [Bonus]', en: 'Industrial A/B Testing & Effect Size (Cohen\'s $d$) [Bonus]' },
      conceptCard: {
        tr: 'Büyük veri setlerinde ($n = 100.000$) en önemsiz farklar bile $p < 0.05$ çıkabilir. Bu nedenle istatistiksel anlamlılık ile **pratik etki büyüklüğü** birlikte incelenir:\n\n**Cohen\'s $d$ (Etki Büyüklüğü):**\n$$d = \\frac{\\bar{x}_1 - \\bar{x}_2}{s_p}$$\n- **$d \\approx 0.20$:** Küçük etki\n- **$d \\approx 0.50$:** Orta düzey etki\n- **$d \\ge 0.80$:** Büyük ve kritik etki',
        en: 'In large datasets ($n=100K$), tiny trivial differences become $p < 0.05$. Thus, evaluate practical effect size:\n\n**Cohen\'s $d$ (Effect Size):**\n$$d = \\frac{\\bar{x}_1 - \\bar{x}_2}{s_p}$$\n- **$d \\approx 0.20$:** Small effect\n- **$d \\approx 0.50$:** Medium effect\n- **$d \\ge 0.80$:** Large business impact'
      },
      companyExample: {
        tr: 'Web sitesi buton rengi testinde $p = 0.002$ çıkmasına rağmen Cohen\'s $d = 0.04$ (ihmal edilebilir etki) çıkmıştır. Yazılım ekibine geliştirme yatırımı yapmama kararı alınmıştır.',
        en: 'Button color A/B test gave $p=0.002$ but $d=0.04$ (negligible effect size), avoiding costly wasteful UI refactoring.'
      },
      vocabTerms: [
        { term_en: 'effect size', explanation_tr: 'İki grup arasındaki farkın örneklem boyutundan bağımsız standartlaştırılmış pratik büyüklüğü.', explanation_en: 'A quantitative measure of the magnitude of the experimental effect.', exampleSentence_en: 'Reporting effect size distinguishes statistical significance from practical significance.' }
      ],
      questions: [
        {
          id: 'm11-l3-q1',
          type: 'numeric',
          prompt: { tr: '$\\bar{x}_1 = 110$, $\\bar{x}_2 = 100$ ve havuzlu standart sapma $s_p = 20$ ise Cohen\'s $d$ etki büyüklüğü kaçtır?', en: 'If $\\bar{x}_1 = 110, \\bar{x}_2 = 100$, and $s_p = 20$, what is Cohen\'s $d$?' },
          correctAnswer: 0.5,
          explanation: { tr: '$$d = \\frac{110 - 100}{20} = \\frac{10}{20} = 0.50 \\text{ (Orta düzey etki)}$$', en: '$$d = \\frac{10}{20} = 0.50$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=(x_bar1 - x_bar2) / s_pooled',
        pythonCode: 'd = (np.mean(g1) - np.mean(g2)) / np.sqrt((np.var(g1) + np.var(g2)) / 2)',
        powerBiNote: { tr: 'A/B test deney skor kartlarında Cohen\'s d raporlanır.', en: 'Report Cohen\'s d in experiment scorecard.' }
      }
    },
    {
      id: 'm11-l4',
      moduleId: 'module-11',
      order: 4,
      difficulty: 'zor',
      title: { tr: 'Çok Değişkenli Modelleme ve Kalıntı Doğrulaması', en: 'Multivariate Modeling & Residual Diagnostics' },
      conceptCard: {
        tr: 'Büyük veri vaka projelerinde nihai tahmin modeli kurulumu ve kalite kontrolü (`MarkIE 2026`, `INDR 252 Capstone`):\n\n1. **Çoklu Regresyon Kurulumu:** Değişken seçimi ($VIF < 5$, $C_p \\approx p$).\n2. **Kalıntı Kontrolleri:** Eşvaryanslık (Homoskedasticity), Normallik ve Durbin-Watson ($d \\approx 2$).\n3. **Model Karşılaştırması:** Adjusted $R^2$ ve RMSE kıyaslaması.',
        en: 'Developing and validating multivariate predictive models (`MarkIE 2026`, `INDR 252 Capstone`):\n\n1. **Model Specification:** Variable selection ($VIF < 5, C_p \\approx p$).\n2. **Diagnostic Checking:** Homoskedasticity, Q-Q residuals, Durbin-Watson ($d \\approx 2$).\n3. **Model Selection:** Adjusted $R^2$ and RMSE comparison.'
      },
      companyExample: {
        tr: 'MarkIE çağrı merkezinde yanıtlanan çağrı sayısı ($A$) bağımlı değişken; yapılan çağrı ($M$), operatör tecrübesi ve gün saati bağımsız değişken olarak modellenmiş ve $R_{adj}^2 = 0.81$ elde edilmiştir.',
        en: 'MarkIE answered calls ($A$) modeled as function of calls made ($M$), operator tenure, and time of day ($R_{adj}^2 = 0.81$).'
      },
      vocabTerms: [
        { term_en: 'model diagnostics', explanation_tr: 'Kurulan regresyon modelinin matematiksel varsayımları sağlayıp sağlamadığını denetleme süreci.', explanation_en: 'Procedures to assess the validity of statistical assumptions underlying an estimated model.', exampleSentence_en: 'Model diagnostics prevent drawing erroneous inferences from misspecified regressions.' }
      ],
      questions: [
        {
          id: 'm11-l4-q1',
          type: 'multiple_choice',
          prompt: { tr: 'Regresyon modelinin güvenilir kabul edilmesi için kalıntıların hangi özelliği sağlaması ZORUNLUDUR?', en: 'Which property must residuals satisfy for a regression model to be valid?' },
          options: [
            { tr: 'Kalıntıların sıfır ortalamalı, sabit varyanslı ve bağımsız normal dağılması', en: 'Residuals are independent, normally distributed with mean 0 and constant variance' },
            { tr: 'Kalıntıların her zaman pozitif olması', en: 'Residuals must always be positive' },
            { tr: 'Kalıntıların değişken sayısına eşit olması', en: 'Residuals must equal number of predictors' },
            { tr: 'Kalıntıların toplamının 100 olması', en: 'Residual sum must equal 100' }
          ],
          correctAnswer: 'Kalıntıların sıfır ortalamalı, sabit varyanslı ve bağımsız normal dağılması',
          explanation: { tr: 'LINE varsayımları gereği hatalar sıfır ortalamalı, sabit varyanslı (homoscedastic), bağımsız ve normal olmalıdır.', en: 'Standard OLS requires i.i.d. normal errors with constant variance.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=Kalıntı_Grafikleri_Menüsü',
        pythonCode: 'import statsmodels.api as sm\nmodel = sm.OLS(y, X).fit()\nprint(model.summary())',
        powerBiNote: { tr: 'Tahmin vs Gerçekleşen saçılım panosu oluşturulur.', en: 'Fitted vs Actual scatter visual tracks model accuracy.' }
      }
    },
    {
      id: 'm11-l5',
      moduleId: 'module-11',
      order: 5,
      difficulty: 'orta-ustu',
      title: { tr: 'Yönetici Düzeyi Raporlama ve Sayısal Karar Önerileri', en: 'Executive Reporting & Actionable Decision Formulation' },
      conceptCard: {
        tr: 'Akademik analizleri iş dünyası kararına dönüştürme ilkeleri (`INDR 252 Case Report Rubric`):\n\n1. **Yönetici Özeti (Executive Summary):** Karmaşık istatistiksel terimleri arındırıp temel bulguyu 1-2 cümlede açıklamak.\n2. **Rakam Formatı Kuralı:** Rapor metninde tüm sayısal değerler en fazla **3 basamak** hassasiyetle yazılmalıdır (Örn: $p = 0.014$, $\\bar{x} = 24.5$).\n3. **Ekler (Appendix):** Tüm Python çıktıları, tablolar ve grafikler rapora değil, Ekler bölümüne konulmalı ve metinden doğrudan referans verilmelidir (`Bakınız: Ek Tablo 1`).\n4. **Aksiyon Önerileri:** Salt sayı vermek yerine şirketin ne yapması gerektiği netleştirilmelidir (Örn: "Operatör sayısı 30\'dan 28\'e indirilerek yasal sınırın altında kalınabilir").',
        en: 'Translating statistical analyses into corporate executive decisions (`INDR 252 Case Report Rubric`):\n\n1. **Executive Summary:** Clear non-technical takeaway in opening paragraph.\n2. **Number Precision:** Report numbers with at most **three decimal digits**.\n3. **Appendix Referencing:** Place charts and tables in the appendix and reference them directly in prose (`See Table A1`).\n4. **Actionable Recommendations:** Provide concrete operational adjustments (e.g. shift schedule optimization).'
      },
      companyExample: {
        tr: 'MarkIE Call Center raporu sonuç paragrafı: "30 operatörle ortalama çağrı sayısı 618.4 çıkmış ve 615 yasal sınırı aşılmıştır ($p = 0.032$). Vardiya başlangıçları 15 dakika kaydırılarak yasa uyumu sağlanabilir" (`MarkIE Report`).',
        en: 'MarkIE executive conclusion: "Operating with 30 agents averages 618.4 calls, exceeding 615 statutory ceiling ($p = 0.032$). Staggering shift starts by 15 mins restores full compliance."',
      },
      vocabTerms: [
        { term_en: 'actionable recommendation', explanation_tr: 'İstatistiksel verilerden türetilmiş, yönetim tarafından doğrudan uygulanabilir stratejik öneri.', explanation_en: 'A strategic suggestion derived directly from empirical data analysis that management can implement.', exampleSentence_en: 'The case report concludes with actionable operational recommendations.' }
      ],
      questions: [
        {
          id: 'm11-l5-q1',
          type: 'multiple_choice',
          prompt: { tr: 'INDR 252 vaka raporlama kurallarına göre (`Case Rubric`) rapor metnindeki sayılar en fazla kaç basamaklı yazılmalıdır?', en: 'According to INDR 252 Case Rubric, what is the maximum number of digits when writing numbers in reports?' },
          options: [
            { tr: 'En fazla 3 basamak (at most three digits)', en: 'At most three digits' },
            { tr: 'En az 8 basamak', en: 'At least 8 digits' },
            { tr: 'Yalnızca tam sayı', en: 'Only integers' },
            { tr: 'Basamak sınırı yoktur', en: 'No digit limitation' }
          ],
          correctAnswer: 'En fazla 3 basamak (at most three digits)',
          explanation: { tr: 'Resmi INDR 252 rapor rubriği gereği rapor gövdesinde sayılar en fazla 3 basamakla yazılmalıdır.', en: 'Official INDR 252 rubric mandates formatting numbers with at most 3 digits.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=YUVARLA(A1; 3)',
        pythonCode: 'print(f"p-value: {p_val:.3f}, Mean: {x_bar:.2f}")',
        powerBiNote: { tr: "Dashboard kartlarında format 0.00 olarak ayarlanır.", en: "Format dashboard KPI cards to 2-3 decimal places." }
      }
    }
  ];
  return m;
});

console.log('Finished updating Modules 6 to 11.');
