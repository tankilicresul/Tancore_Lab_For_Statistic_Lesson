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
// 6. MODULE 6: Hipotez Testi Temelleri (INDR 252)
// -----------------------------------------------------------------
updateModule('module6.json', (m) => {
  m.lessons = [
    {
      id: 'm6-l1',
      moduleId: 'module-6',
      order: 1,
      difficulty: 'basit',
      title: { tr: 'Sıfır ($H_0$) ve Alternatif ($H_1$) Hipotez Kurgusu', en: 'Null ($H_0$) and Alternative ($H_1$) Hypotheses' },
      conceptCard: {
        tr: '1. **Sıfır Hipotezi ($H_0$):** Değişimin, etkinin veya farkın olmadığını savunan varsayılan iddia ($=, \\le, \\ge$).\n2. **Alternatif Hipotez ($H_1$ veya $H_a$):** Kanıtlanmaya çalışılan yenilik veya araştırma iddiası ($\\neq, <, >$).\n3. **Test Yönü:**\n- Çift Yönlü: $H_0: \\mu = \\mu_0$ vs $H_1: \\mu \\neq \\mu_0$\n- Tek Yönlü (Sağ): $H_0: \\mu \\le \\mu_0$ vs $H_1: \\mu > \\mu_0$\n- Tek Yönlü (Sol): $H_0: \\mu \\ge \\mu_0$ vs $H_1: \\mu < \\mu_0$',
        en: '1. **Null Hypothesis ($H_0$):** Status quo baseline assumption of no effect ($=, \\le, \\ge$).\n2. **Alternative Hypothesis ($H_1$):** Claim seeking evidence to substantiate ($\\neq, <, >$).\n3. **Test Tails:**\n- Two-Tailed: $H_0: \\mu = \\mu_0$ vs $H_1: \\mu \\neq \\mu_0$\n- One-Tailed (Right): $H_0: \\mu \\le \\mu_0$ vs $H_1: \\mu > \\mu_0$\n- One-Tailed (Left): $H_0: \\mu \\ge \\mu_0$ vs $H_1: \\mu < \\mu_0$'
      },
      companyExample: {
        tr: 'WebOptima A/B testinde: $H_0: p_{yeni} = 0.05$ (Yeni buton dönüşümü değiştirmedi), $H_1: p_{yeni} > 0.05$ (Yeni buton dönüşümü artırdı - Sağ kuyruk testi).',
        en: 'A/B test: $H_0: p = 0.05$ (no conversion change), $H_1: p > 0.05$ (new button increases conversions - right-tailed test).'
      },
      vocabTerms: [
        { term_en: 'null hypothesis', explanation_tr: 'Aksi güçlü verilerle kanıtlanana kadar doğru kabul edilen başlangıç hipotezi ($H_0$).', explanation_en: 'A default hypothesis that there is no significant difference or effect.', exampleSentence_en: 'We fail to reject the null hypothesis due to lack of statistical evidence.' }
      ],
      questions: [
        {
          id: 'm6-l1-q1',
          type: 'multiple_choice',
          prompt: { tr: 'Bir şirket yeni yazılımın işlem süresini kısalttığını iddia ediyorsa (Eski süre 10 sn), alternatif hipotez $H_1$ nasıl kurulmalıdır?', en: 'If a company claims new software reduces processing time (Old time 10s), how should $H_1$ be formulated?' },
          options: [
            { tr: 'H1: μ < 10', en: 'H1: μ < 10' },
            { tr: 'H1: μ = 10', en: 'H1: μ = 10' },
            { tr: 'H1: μ > 10', en: 'H1: μ > 10' },
            { tr: 'H0: μ < 10', en: 'H0: μ < 10' }
          ],
          correctAnswer: 'H1: μ < 10',
          explanation: { tr: 'İddia sürenin kısalması (azalması) olduğu için $H_1: \\mu < 10$ sol kuyruk testi kurulmalıdır.', en: 'Because the claim is a reduction in time, alternative hypothesis is $H_1: \\mu < 10$.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=EĞER(p_değeri < 0.05; "H0 Red"; "H0 Reddedilemez")',
        pythonCode: '# H0: mu == 10 vs H1: mu < 10\nt_stat, p_val = stats.ttest_1samp(data, popmean=10, alternative="less")',
        powerBiNote: { tr: 'A/B test sonuç kartlarında $H_0$ red durumu renkli rozetle gösterilir.', en: 'A/B test status is visualized with red/green decision badges.' }
      }
    },
    {
      id: 'm6-l2',
      moduleId: 'module-6',
      order: 2,
      difficulty: 'orta',
      title: { tr: 'Tip 1 ($\alpha$), Tip 2 ($\beta$) Hataları ve Test Gücü', en: 'Type 1 ($\alpha$), Type 2 ($\beta$) Errors and Statistical Power' },
      conceptCard: {
        tr: 'Karar matrisindeki iki temel hata türü (`INDR 252 CEx11`):\n\n1. **Tip 1 Hata ($\\alpha$ / Yalancı Pozitif / Üretici Riski):** $H_0$ gerçekte doğruyken $H_0$\'ı reddetmek ($P(\\text{H0 Red} | \\text{H0 Doğru}) = \\alpha$).\n2. **Tip 2 Hata ($\\beta$ / Yalancı Negatif / Tüketici Riski):** $H_0$ gerçekte yanlışken $H_0$\'ı reddedememek.\n3. **Testin Gücü (Power = $1 - \\beta$):** $H_0$ yanlış olduğunda onu doğru şekilde reddedebilme olasılığı.',
        en: 'The decision matrix error trade-offs (`INDR 252 CEx11`):\n\n1. **Type 1 Error ($\\alpha$ / False Positive / Producer Risk):** Rejecting $H_0$ when $H_0$ is true.\n2. **Type 2 Error ($\\beta$ / False Negative / Consumer Risk):** Failing to reject $H_0$ when $H_0$ is false.\n3. **Statistical Power ($1 - \\beta$):** Probability of correctly rejecting a false $H_0$.'
      },
      companyExample: {
        tr: 'SmokeTech sigara katranı analizinde (`CEx11`): Üretici katran standarda uygun olduğu halde ceza alırsa Tip 1 hata ($\\alpha$), standart dışı zararlı sigara onay alırsa Tip 2 hata ($\\beta$) oluşur.',
        en: 'SmokeTech tar inspection (`CEx11`): Fining a conforming batch is Type 1 error ($\\alpha$), letting a non-conforming batch pass is Type 2 error ($\\beta$).'
      },
      vocabTerms: [
        { term_en: 'type 1 error', explanation_tr: 'Gerçekte doğru olan sıfır hipotezini reddetme hatası (Alfa).', explanation_en: 'The rejection of a true null hypothesis (false positive).', exampleSentence_en: 'Significance level alpha represents the maximum allowed probability of Type 1 error.' }
      ],
      questions: [
        {
          id: 'm6-l2-q1',
          type: 'multiple_choice',
          prompt: { tr: 'Mahkemede masum bir sanığın suçlu bulunup hapse atılması hangi istatistiksel hata türüne örnektir ($H_0$: Masum)?', en: 'Convicting an innocent person in court is an example of which statistical error ($H_0$: Innocent)?' },
          options: [
            { tr: 'Tip 1 Hata (Alfa)', en: 'Type 1 Error (Alpha)' },
            { tr: 'Tip 2 Hata (Beta)', en: 'Type 2 Error (Beta)' },
            { tr: 'Standart Hata', en: 'Standard Error' },
            { tr: 'Örnekleme Hatası', en: 'Sampling Bias' }
          ],
          correctAnswer: 'Tip 1 Hata (Alfa)',
          explanation: { tr: '$H_0$ (Masumiyet) doğruyken reddedilip ceza verildiği için bu Tip 1 hatadır (Yalancı Pozitif).', en: 'Rejecting true $H_0$ (innocence) is a classic Type 1 false positive error.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=NORM.TERS(1 - beta)',
        pythonCode: 'from statsmodels.stats.power import TTestPower\npower = TTestPower().power(effect_size=0.5, nobs=30, alpha=0.05)',
        powerBiNote: { tr: 'Güç analizi grafikleriyle minimum $n$ belirlenir.', en: 'Power analysis curves determine minimum sample size.' }
      }
    },
    {
      id: 'm6-l3',
      moduleId: 'module-6',
      order: 3,
      difficulty: 'orta',
      title: { tr: 'p-Değeri ve Karar Kriterleri', en: 'p-Value and Decision Criteria' },
      conceptCard: {
        tr: '1. **$p$-Değeri:** Sıfır hipotezi ($H_0$) doğru kabul edildiğinde, elde edilen örneklem sonucundan daha aşırı bir sonucun ortaya çıkma olasılığıdır (`INDR 252 Lecture 13`).\n\n2. **Evrensel Karar Kuralı:**\n- **$p \\le \\alpha$:** $H_0$ REDDEDİLİR. İstatistiksel olarak anlamlı kanıt vardır.\n- **$p > \\alpha$:** $H_0$ REDDEDİLEMEZ. Yeterli kanıt yoktur.\n\n> **Önemli İlke:** "H0 kabul edildi" denmez; "H0 reddedilemedi" denir!',
        en: '1. **$p$-Value:** The probability of obtaining test results at least as extreme as observed, assuming $H_0$ is true (`INDR 252 Lecture 13`).\n\n2. **Decision Rule:**\n- **$p \\le \\alpha$:** REJECT $H_0$. Statistically significant evidence.\n- **$p > \\alpha$:** FAIL TO REJECT $H_0$. Insufficient evidence.\n\n> **Core Rule:** Never say "Accept $H_0$"; state "Fail to reject $H_0$"!'
      },
      companyExample: {
        tr: 'Bir A/B testinde hesaplanan $p = 0.012$\'dir. $\\alpha = 0.05$ için $p < 0.05$ olduğundan $H_0$ reddedilir; yeni tasarımın ciroyu artırdığı %95 güvenle kanıtlanmıştır.',
        en: 'A/B test yields $p = 0.012$. At $\\alpha = 0.05$, $p < \\alpha$, rejecting $H_0$ and proving the new design increases revenue.'
      },
      vocabTerms: [
        { term_en: 'p-value', explanation_tr: 'Sıfır hipotezinin aleyhine olan kanıt gücünü gösteren olasılık değeri.', explanation_en: 'Probability of obtaining results at least as extreme as the observed data, assuming H0 is true.', exampleSentence_en: 'A small p-value indicates strong evidence against the null hypothesis.' }
      ],
      questions: [
        {
          id: 'm6-l3-q1',
          type: 'multiple_choice',
          prompt: { tr: '$\\alpha = 0.05$ düzeyinde yapılan bir testte $p = 0.08$ bulunmuştur. İstatistiksel karar ne olmalıdır?', en: 'In a test at $\\alpha = 0.05$, $p = 0.08$ is obtained. What is the statistical decision?' },
          options: [
            { tr: 'H0 reddedilemez (Yetersiz kanıt)', en: 'Fail to reject H0 (Insufficient evidence)' },
            { tr: 'H0 kesinlikle reddedilir', en: 'Reject H0 conclusively' },
            { tr: 'H1 kesinlikle doğrudur', en: 'H1 is proven true' },
            { tr: 'Test geçersizdir', en: 'The test is invalid' }
          ],
          correctAnswer: 'H0 reddedilemez (Yetersiz kanıt)',
          explanation: { tr: '$p = 0.08 > 0.05$ olduğu için $H_0$ hipotezini reddedecek yeterli kanıt yoktur.', en: 'Because $p = 0.08 > 0.05$, we fail to reject the null hypothesis.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=EĞER(p <= 0.05; "Anlamlı Fark Var"; "Fark Yok")',
        pythonCode: 'if p_val <= 0.05:\n    print("Reject H0: Statistically significant")',
        powerBiNote: { tr: 'Koşullu biçimlendirme ile p < 0.05 satırları yeşil vurgulanır.', en: 'Conditional formatting highlights p < 0.05.' }
      }
    },
    {
      id: 'm6-l4',
      moduleId: 'module-6',
      order: 4,
      difficulty: 'orta',
      title: { tr: 'Tek Örneklem Z-Testi ve t-Testi', en: 'One-Sample Z-Test and t-Test' },
      conceptCard: {
        tr: 'Tek bir grubun ortalamasının hedef $\\mu_0$ değerine eşitliğini test etme (`INDR 252 Lecture 12-13`, `CEx12`):\n\n1. **$\\sigma$ Bilindiğinde ($Z$-Testi):**\n$$z = \\frac{\\bar{x} - \\mu_0}{\\sigma / \\sqrt{n}}$$\n2. **$\\sigma$ Bilinmediğinde ($t$-Testi):**\n$$t = \\frac{\\bar{x} - \\mu_0}{s / \\sqrt{n}}, \\quad df = n - 1$$',
        en: 'Testing if a single population mean equals a benchmark $\\mu_0$ (`INDR 252 Lecture 12-13`, `CEx12`):\n\n1. **$\\sigma$ Known ($Z$-Test):**\n$$z = \\frac{\\bar{x} - \\mu_0}{\\sigma / \\sqrt{n}}$$\n2. **$\\sigma$ Unknown ($t$-Test):**\n$$t = \\frac{\\bar{x} - \\mu_0}{s / \\sqrt{n}}, \\quad df = n - 1$$'
      },
      companyExample: {
        tr: 'Silikon gofret (wafer) üretiminde hedef kalınlık $\\mu_0 = 50$ mikrondur (`CEx12`). $n=16$ gofret için $\\bar{x} = 52$, $s = 4$ çıkmıştır. $t = (52-50)/(4/4) = 2.0$. $p$-değeri ile makinenin ayarının bozulup bozulmadığı sınanır.',
        en: 'Silicon wafer target thickness $\\mu_0 = 50\\mu m$ (`CEx12`). Sample $n=16$: $\\bar{x}=52, s=4$. $t = (52-50)/(4/4) = 2.0$.'
      },
      vocabTerms: [
        { term_en: 'test statistic', explanation_tr: 'Örneklemden hesaplanan ve sıfır hipotezini test etmek için referans dağılımla kıyaslanan değer.', explanation_en: 'A standardized value calculated from sample data during a hypothesis test.', exampleSentence_en: 'The calculated t-statistic is compared against the critical t-value.' }
      ],
      questions: [
        {
          id: 'm6-l4-q1',
          type: 'numeric',
          prompt: { tr: '$\\mu_0 = 100$, $\\bar{x} = 106$, $s = 12$ ve $n = 16$ olan testte $t$-istatistiği kaçtır?', en: 'If $\\mu_0 = 100$, $\\bar{x} = 106$, $s = 12$, and $n = 16$, what is the $t$-statistic?' },
          correctAnswer: 2,
          explanation: { tr: '$$t = \\frac{106 - 100}{12 / \\sqrt{16}} = \\frac{6}{12 / 4} = \\frac{6}{3} = 2$$', en: '$$t = \\frac{106 - 100}{12 / 4} = \\frac{6}{3} = 2$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=T.TEST(A1:A16; B1:B16; 2; 1)',
        pythonCode: 'from scipy import stats\nstats.ttest_1samp(data, popmean=100)',
        powerBiNote: { tr: 'Üretim kalite tolerans kartlarında t-skoru izlenir.', en: 'Track t-scores on quality assurance panels.' }
      }
    },
    {
      id: 'm6-l5',
      moduleId: 'module-6',
      order: 5,
      difficulty: 'orta',
      title: { tr: 'Tek Popülasyon Oran Testi ($Z$)', en: 'One-Sample Proportion Test ($Z$)' },
      conceptCard: {
        tr: 'Bir anakütle oranının $p_0$ değerine eşitliğini test etmek için kullanılır (`INDR 252 Lecture 13`):\n\n$$z = \\frac{\\hat{p} - p_0}{\\sqrt{\\frac{p_0(1-p_0)}{n}}}$$\n\n- Şart: $n p_0 \\ge 5$ ve $n(1-p_0) \\ge 5$ olmalıdır.\n- Standart normal dağılım ($Z$) tablosu kullanılır.',
        en: 'Testing whether a population proportion equals $p_0$ (`INDR 252 Lecture 13`):\n\n$$z = \\frac{\\hat{p} - p_0}{\\sqrt{\\frac{p_0(1-p_0)}{n}}}$$\n\n- Condition: $n p_0 \\ge 5$ and $n(1-p_0) \\ge 5$.\n- Standard normal ($Z$) distribution applies.'
      },
      companyExample: {
        tr: 'MarkIE çağrı merkezinin hedef yanıt oranı %55\'tir ($p_0=0.55$). $n=400$ aramada 240 yanıt alınmıştır ($\\hat{p}=0.60$). $Z$-testi ile hedefin anlamlı olarak aşılıp aşılmadığı doğrulanır (`MarkIE Case`).',
        en: 'MarkIE Call Center benchmark answer rate is 55% ($p_0=0.55$). Out of $n=400$ calls, 240 answered ($\\hat{p}=0.60$). $Z$-test confirms if target is statistically exceeded (`MarkIE Case`).'
      },
      vocabTerms: [
        { term_en: 'proportion test', explanation_tr: 'Kategorik başarı oranının hedef orana uygunluğunu sınayan test.', explanation_en: 'A test determining if an observed proportion differs from a hypothesized value.', exampleSentence_en: 'We run a one-sample proportion test to evaluate conversion rates.' }
      ],
      questions: [
        {
          id: 'm6-l5-q1',
          type: 'numeric',
          prompt: { tr: '$p_0 = 0.50$, $\\hat{p} = 0.60$ ve $n = 100$ ise $z$-istatistiği kaçtır?', en: 'If $p_0 = 0.50$, $\\hat{p} = 0.60$, and $n = 100$, what is the $z$-statistic?' },
          correctAnswer: 2,
          explanation: { tr: '$$SE = \\sqrt{\\frac{0.50 \\times 0.50}{100}} = \\sqrt{0.0025} = 0.05$$\n$$z = \\frac{0.60 - 0.50}{0.05} = 2$$', en: '$$SE = \\sqrt{0.5(0.5)/100} = 0.05 \\implies z = 0.10 / 0.05 = 2$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=(p_hat - p0) / KAREKÖK(p0*(1-p0)/n)',
        pythonCode: 'from statsmodels.stats.proportion import proportions_ztest\nproportions_ztest(count=240, nobs=400, value=0.55)',
        powerBiNote: { tr: 'Dönüşüm hedefi KPI göstergelerinde $Z$-skoru kullanılır.', en: 'Used for target achievement conversion KPIs.' }
      }
    },
    {
      id: 'm6-l6',
      moduleId: 'module-6',
      order: 6,
      difficulty: 'zor',
      title: { tr: 'Tek Popülasyon Varyans Testi ($\chi^2$)', en: 'One-Sample Population Variance Test ($\chi^2$)' },
      conceptCard: {
        tr: 'Normal dağılan bir popülasyonda varyansın $\\sigma_0^2$ hedef değerine eşitliğini test etme (`INDR 252 FormulaSheet`):\n\n$$\\chi^2 = \\frac{(n-1)s^2}{\\sigma_0^2}, \\quad df = n - 1$$\n\n- $H_0: \\sigma^2 = \\sigma_0^2$\n- Kalite kontrolde varyasyonun izin verilen toleransı aşıp aşmadığını test etmekte kullanılır.',
        en: 'Testing population variance against standard specification $\\sigma_0^2$ (`INDR 252 FormulaSheet`):\n\n$$\\chi^2 = \\frac{(n-1)s^2}{\\sigma_0^2}, \\quad df = n - 1$$\n\n- $H_0: \\sigma^2 = \\sigma_0^2$\n- Essential in precision manufacturing quality control.'
      },
      companyExample: {
        tr: 'Hassas şırınga üretiminde varyans toleransı $\\sigma_0^2 = 0.01 \\text{ mm}^2$\'dir. $n=25$ numunede $s^2 = 0.018$ bulunmuştur. $\\chi^2 = 24(0.018)/0.01 = 43.2$. $p < 0.05$ ile varyansın limiti aştığı tespit edilir.',
        en: 'Syringe manufacturing variance target $\\sigma_0^2 = 0.01$. Sample $n=25, s^2 = 0.018$. $\\chi^2 = 43.2$, proving variance exceeds tolerance.'
      },
      vocabTerms: [
        { term_en: 'chi-square variance test', explanation_tr: 'Popülasyon varyansının belirli bir değere eşitliğini sınayan tek örneklem testi.', explanation_en: 'Hypothesis test evaluating if sample variance conforms to target variance.', exampleSentence_en: 'The chi-square test confirms whether process variability is in control.' }
      ],
      questions: [
        {
          id: 'm6-l6-q1',
          type: 'numeric',
          prompt: { tr: '$n = 11$, $s^2 = 4$ ve $\\sigma_0^2 = 2$ ise test istatistiği $\\chi^2$ kaçtır?', en: 'If $n = 11$, $s^2 = 4$, and $\\sigma_0^2 = 2$, what is test statistic $\\chi^2$?' },
          correctAnswer: 20,
          explanation: { tr: '$$\\chi^2 = \\frac{(11-1) \\times 4}{2} = \\frac{10 \\times 4}{2} = 20$$', en: '$$\\chi^2 = \\frac{(11-1) \\times 4}{2} = \\frac{40}{2} = 20$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=(n-1)*s^2 / sigma0^2',
        pythonCode: 'chi2_stat = (n - 1) * s2 / sigma0_2\np_val = 1 - stats.chi2.cdf(chi2_stat, df=n-1)',
        powerBiNote: { tr: 'Six Sigma kontrol grafiklerinde varyans testi kullanılır.', en: 'Applied in Six Sigma variance control limits.' }
      }
    }
  ];
  return m;
});

// -----------------------------------------------------------------
// 7. MODULE 7: İki Örneklem Testleri & Basit Regresyon (INDR 252)
// -----------------------------------------------------------------
updateModule('module7.json', (m) => {
  m.lessons = [
    {
      id: 'm7-l1',
      moduleId: 'module-7',
      order: 1,
      difficulty: 'orta-ustu',
      title: { tr: 'İki Bağımsız Örneklem t-Testi (Pooled vs. Welch)', en: 'Two-Independent-Sample t-Test (Pooled vs. Welch)' },
      conceptCard: {
        tr: 'İki bağımsız grubun ortalamalarını kıyaslama (`INDR 252 Lecture 14`, `CEx8`):\n\n1. **Eşit Varyans Varsayımı (Pooled $t$-Test):** $\\sigma_1^2 = \\sigma_2^2$\n$$s_p^2 = \\frac{(n_1-1)s_1^2 + (n_2-1)s_2^2}{n_1+n_2-2}, \\quad t = \\frac{\\bar{x}_1 - \\bar{x}_2}{s_p \\sqrt{1/n_1 + 1/n_2}}, \\quad df = n_1+n_2-2$$\n\n2. **Eşit Olmayan Varyans (Welch\'s $t$-Test):** $\\sigma_1^2 \\neq \\sigma_2^2$\n$$t = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{s_1^2/n_1 + s_2^2/n_2}}, \\quad df = \\text{Satterthwaite yaklaşımı}$$',
        en: 'Comparing means of two independent groups (`INDR 252 Lecture 14`, `CEx8`):\n\n1. **Equal Variances (Pooled $t$-Test):** $\\sigma_1^2 = \\sigma_2^2$\n$$s_p^2 = \\frac{(n_1-1)s_1^2 + (n_2-1)s_2^2}{n_1+n_2-2}, \\quad t = \\frac{\\bar{x}_1 - \\bar{x}_2}{s_p \\sqrt{1/n_1 + 1/n_2}}, \\quad df = n_1+n_2-2$$\n\n2. **Unequal Variances (Welch\'s $t$-Test):** $\\sigma_1^2 \\neq \\sigma_2^2$\n$$t = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{s_1^2/n_1 + s_2^2/n_2}}, \\quad df = \\text{Satterthwaite approximation}$$'
      },
      companyExample: {
        tr: 'PopCorn paketleme fabrikasında Makine 1 ($n_1=16, \\bar{x}_1=102, s_1=3$) ve Makine 2 ($n_2=16, \\bar{x}_2=98, s_2=3$) gramajları pooled $t$-testi ile kıyaslanarak makineler arası fark ispatlanır (`CEx8`).',
        en: 'PopCorn packaging machines ($n_1=16, \\bar{x}_1=102$ vs $n_2=16, \\bar{x}_2=98$) compared via pooled $t$-test (`CEx8`).'
      },
      vocabTerms: [
        { term_en: 'pooled variance', explanation_tr: 'İki grubun varyanslarının serbestlik derecelerine göre ağırlıklı ortalaması ($s_p^2$).', explanation_en: 'A weighted average of sample variances from two independent groups.', exampleSentence_en: 'Pooled variance is used when population variances are assumed equal.' }
      ],
      questions: [
        {
          id: 'm7-l1-q1',
          type: 'multiple_choice',
          prompt: { tr: 'İki bağımsız grubun varyanslarının eşit olmadığı biliniyorsa hangi test tercih edilmelidir?', en: 'If variances of two independent groups are unequal, which test should be used?' },
          options: [
            { tr: 'Welch\'s t-Testi', en: 'Welch\'s t-Test' },
            { tr: 'Pooled t-Testi', en: 'Pooled t-Test' },
            { tr: 'Paired t-Testi', en: 'Paired t-Test' },
            { tr: 'Z-Testi', en: 'Z-Test' }
          ],
          correctAnswer: 'Welch\'s t-Testi',
          explanation: { tr: 'Varyans homojenliği sağlanamadığında serbestlik derecesini düzelten Welch\'s t-testi kullanılır.', en: 'Welch\'s t-test is specifically designed for unequal variances.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=T.TEST(Grup1; Grup2; 2; 2)  (3: Welch)',
        pythonCode: 'from scipy import stats\nstats.ttest_ind(group1, group2, equal_var=False) # Welch',
        powerBiNote: { tr: 'A/B test deney gruplarında Welch t-testi önerilir.', en: 'Welch t-test is standard for A/B testing.' }
      }
    },
    {
      id: 'm7-l2',
      moduleId: 'module-7',
      order: 2,
      difficulty: 'orta-ustu',
      title: { tr: 'İki Popülasyon Varyans Kıyaslaması ($F$-Testi)', en: 'Two-Sample Variance Comparison ($F$-Test)' },
      conceptCard: {
        tr: 'İki bağımsız $t$-testi yapmadan önce varyansların eşit olup olmadığını doğrulamak için $F$-testi yapılır (`INDR 252 FormulaSheet`, `CEx8`):\n\n$$H_0: \\sigma_1^2 = \\sigma_2^2 \\quad \\text{vs} \\quad H_1: \\sigma_1^2 \\neq \\sigma_2^2$$\n$$F = \\frac{s_1^2}{s_2^2}, \\quad df_1 = n_1 - 1, \\quad df_2 = n_2 - 1$$\n(Adet gereği büyük varyans paya yazılır, $F \\ge 1$).',
        en: 'Testing equality of two population variances before running $t$-tests (`INDR 252 FormulaSheet`, `CEx8`):\n\n$$H_0: \\sigma_1^2 = \\sigma_2^2 \\quad \\text{vs} \\quad H_1: \\sigma_1^2 \\neq \\sigma_2^2$$\n$$F = \\frac{s_1^2}{s_2^2}, \\quad df_1 = n_1 - 1, \\quad df_2 = n_2 - 1$$\n(Conventionally place larger variance in numerator so $F \\ge 1$).'
      },
      companyExample: {
        tr: 'VoltPower iki üretim bandının kararlılığını test eder: 1. bant $s_1^2 = 25$, 2. bant $s_2^2 = 10$. $F = 25 / 10 = 2.5$. $p < 0.05$ ise varyansların eşit olmadığına karar verilir.',
        en: 'VoltPower line 1 ($s_1^2=25$) vs line 2 ($s_2^2=10$). $F = 25/10 = 2.5$. If $p < 0.05$, reject equal variance assumption.'
      },
      vocabTerms: [
        { term_en: 'F-test for equality of variances', explanation_tr: 'İki popülasyon varyansının oranını test eden hipotez testi.', explanation_en: 'A test determining whether two population variances are equal based on the F-distribution.', exampleSentence_en: 'The F-test validates the equal variance assumption for two-sample pooled t-tests.' }
      ],
      questions: [
        {
          id: 'm7-l2-q1',
          type: 'numeric',
          prompt: { tr: '$s_1^2 = 18$ ve $s_2^2 = 6$ ise hesaplanan $F$-istatistiği kaçtır?', en: 'If $s_1^2 = 18$ and $s_2^2 = 6$, what is the calculated $F$-statistic?' },
          correctAnswer: 3,
          explanation: { tr: '$$F = \\frac{s_1^2}{s_2^2} = \\frac{18}{6} = 3$$', en: '$$F = \\frac{s_1^2}{s_2^2} = \\frac{18}{6} = 3$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=F.TEST(Grup1_Aralığı; Grup2_Aralığı)',
        pythonCode: 'from scipy.stats import f\nf_stat = np.var(g1, ddof=1) / np.var(g2, ddof=1)',
        powerBiNote: { tr: 'Süreç kararlılığı kıyaslama kartlarında F-testi kullanılır.', en: 'Used on process stability comparison dashboards.' }
      }
    },
    {
      id: 'm7-l3',
      moduleId: 'module-7',
      order: 3,
      difficulty: 'orta',
      title: { tr: 'Eşleştirilmiş (Paired) t-Testi', en: 'Paired-Sample t-Test' },
      conceptCard: {
        tr: 'Aynı denekler üzerinde **öncesi/sonrası (before/after)** veya eşleştirilmiş çiftler üzerinde yapılan ölçümler bağımlıdır (`INDR 252 CEx9`):\n\n1. **Fark Değişkeni:** $d_i = x_i - y_i$\n2. **Farkların Ortalaması:** $\\bar{d} = \\frac{1}{n}\\sum d_i$\n3. **Test İstatistiği:**\n$$t = \\frac{\\bar{d} - \\mu_d}{s_d / \\sqrt{n}}, \\quad df = n - 1$$',
        en: 'Used when observations in two samples are paired (e.g. before/after on same subjects) (`INDR 252 CEx9`):\n\n1. **Difference Variable:** $d_i = x_i - y_i$\n2. **Mean Difference:** $\\bar{d} = \\frac{1}{n}\\sum d_i$\n3. **Test Statistic:**\n$$t = \\frac{\\bar{d} - \\mu_d}{s_d / \\sqrt{n}}, \\quad df = n - 1$$'
      },
      companyExample: {
        tr: 'CallCenter temsilcilerine verilen eğitim öncesi ve sonrası çağrı süreleri ölçülmüştür (`CEx9`). $n=16$ temsilci için ortalama azalma $\\bar{d} = -45$ saniye, $s_d = 15$. $t = -45 / (15/4) = -12.0$. Eğitim süreyi anlamlı derecede kısaltmıştır.',
        en: 'Call center agent training before/after call durations (`CEx9`). Mean reduction $\\bar{d} = -45$s, $t = -12.0$, confirming training efficacy.'
      },
      vocabTerms: [
        { term_en: 'paired t-test', explanation_tr: 'Aynı birimler üzerinden alınan iki bağımlı ölçümün farkını test eden yöntem.', explanation_en: 'A statistical test comparing two related measurements taken on the same subjects.', exampleSentence_en: 'Paired t-test controls for subject-to-subject baseline variability.' }
      ],
      questions: [
        {
          id: 'm7-l3-q1',
          type: 'multiple_choice',
          prompt: { tr: '10 çalışanın eğitim öncesi ve eğitim sonrası satış performansları kıyaslanırken hangi test uygulanmalıdır?', en: 'When comparing sales performance of 10 employees before and after training, which test is appropriate?' },
          options: [
            { tr: 'Eşleştirilmiş (Paired) t-Testi', en: 'Paired t-Test' },
            { tr: 'İki Bağımsız Örneklem Z-Testi', en: 'Two-Independent-Sample Z-Test' },
            { tr: 'Ki-Kare Bağımsızlık Testi', en: 'Chi-Square Test of Independence' },
            { tr: 'ANOVA', en: 'ANOVA' }
          ],
          correctAnswer: 'Eşleştirilmiş (Paired) t-Testi',
          explanation: { tr: 'Aynı bireyler üzerinde öncesi/sonrası ölçüm yapıldığı için veriler bağımlıdır ve Paired t-testi gereklidir.', en: 'Because before/after measurements are collected from the identical individuals, paired t-test is required.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=T.TEST(Önce_Dizisi; Sonra_Dizisi; 2; 1)',
        pythonCode: 'from scipy import stats\nstats.ttest_rel(before_scores, after_scores)',
        powerBiNote: { tr: 'Eğitim ve kampanya öncesi/sonrası panolarında kullanılır.', en: 'Applied in before/after program evaluation panels.' }
      }
    },
    {
      id: 'm7-l4',
      moduleId: 'module-7',
      order: 4,
      difficulty: 'orta',
      title: { tr: 'İki Popülasyon Oran Farkı Testi (Pooled $\hat{p}$)', en: 'Two-Sample Proportion Test (Pooled $\hat{p}$)' },
      conceptCard: {
        tr: 'İki bağımsız grubun dönüşüm veya başarı oranlarını kıyaslama ($H_0: p_1 = p_2$) (`INDR 252 Lecture 15`):\n\n1. **Havuzlanmış Oran (Pooled $\\hat{p}$):**\n$$\\hat{p} = \\frac{x_1 + x_2}{n_1 + n_2}$$\n2. **Test İstatistiği:**\n$$z = \\frac{\\hat{p}_1 - \\hat{p}_2}{\\sqrt{\\hat{p}(1-\\hat{p})\\left(\\frac{1}{n_1} + \\frac{1}{n_2}\\right)}}$$',
        en: 'Testing equality of proportions from two independent populations ($H_0: p_1 = p_2$) (`INDR 252 Lecture 15`):\n\n1. **Pooled Proportion ($\\hat{p}$):**\n$$\\hat{p} = \\frac{x_1 + x_2}{n_1 + n_2}$$\n2. **Test Statistic:**\n$$z = \\frac{\\hat{p}_1 - \\hat{p}_2}{\\sqrt{\\hat{p}(1-\\hat{p})\\left(\\frac{1}{n_1} + \\frac{1}{n_2}\\right)}}$$'
      },
      companyExample: {
        tr: 'Landing Page A ($n_1=500, x_1=50, \\hat{p}_1=0.10$) ile Landing Page B ($n_2=500, x_2=75, \\hat{p}_2=0.15$) dönüşüm testi. Havuzlu $\\hat{p} = 125/1000 = 0.125$. $z = (0.10 - 0.15) / \\sqrt{0.125(0.875)(2/500)} = -2.39$. Sayfa B anlamlı olarak daha başarılıdır.',
        en: 'Landing Page A ($10\\%$) vs Page B ($15\\%$) with $n=500$ each. Pooled $\\hat{p}=0.125, z=-2.39$, proving Page B superiority.'
      },
      vocabTerms: [
        { term_en: 'pooled proportion', explanation_tr: 'İki grubun başarılarının toplamının toplam deneme sayısına oranı.', explanation_en: 'Combined proportion of successes across both independent samples under H0.', exampleSentence_en: 'The pooled proportion estimates the shared baseline conversion rate.' }
      ],
      questions: [
        {
          id: 'm7-l4-q1',
          type: 'numeric',
          prompt: { tr: 'Grup 1\'de $n_1=100, x_1=20$ ve Grup 2\'de $n_2=100, x_2=40$ ise Havuzlu Oran $\\hat{p}$ kaçtır?', en: 'If Group 1 has $n_1=100, x_1=20$ and Group 2 has $n_2=100, x_2=40$, what is pooled $\\hat{p}$?' },
          correctAnswer: 0.3,
          explanation: { tr: '$$\\hat{p} = \\frac{20 + 40}{100 + 100} = \\frac{60}{200} = 0.30$$', en: '$$\\hat{p} = \\frac{20 + 40}{200} = 0.30$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=(p1 - p2) / KAREKÖK(p_pool*(1-p_pool)*(1/n1 + 1/n2))',
        pythonCode: 'from statsmodels.stats.proportion import proportions_ztest\nproportions_ztest([50, 75], [500, 500])',
        powerBiNote: { tr: 'A/B test dönüşüm panellerinde ana test aracıdır.', en: 'Primary tool on digital marketing conversion dashboards.' }
      }
    },
    {
      id: 'm7-l5',
      moduleId: 'module-7',
      order: 5,
      difficulty: 'orta',
      title: { tr: 'Pearson Korelasyon Katsayısı ($r$) ve Anlamlılık Testi', en: 'Pearson Correlation ($r$) and Significance Testing' },
      conceptCard: {
        tr: 'İki sayısal değişken arasındaki doğrusal ilişkinin yönü ve gücü (`INDR 252 Lecture 17`):\n\n1. **Pearson $r$ Formülü:**\n$$r = \\frac{SS_{xy}}{\\sqrt{SS_{xx} SS_{yy}}} = \\frac{\\sum (x-\\bar{x})(y-\\bar{y})}{\\sqrt{\\sum(x-\\bar{x})^2 \\sum(y-\\bar{y})^2}}, \\quad -1 \\le r \\le 1$$\n2. **Korelasyonun Anlamlılık $t$-Testi ($H_0: \\rho = 0$):**\n$$t = \\frac{r \\sqrt{n-2}}{\\sqrt{1 - r^2}}, \\quad df = n - 2$$\n\n> **Kural:** Korelasyon $\\ne$ Nedensellik!',
        en: 'Strength and direction of linear association between two variables (`INDR 252 Lecture 17`):\n\n1. **Pearson $r$:**\n$$r = \\frac{SS_{xy}}{\\sqrt{SS_{xx} SS_{yy}}}, \\quad -1 \\le r \\le 1$$\n2. **Significance $t$-Test ($H_0: \\rho = 0$):**\n$$t = \\frac{r \\sqrt{n-2}}{\\sqrt{1 - r^2}}, \\quad df = n - 2$$\n\n> **Core Rule:** Correlation does not imply causation!'
      },
      companyExample: {
        tr: 'Reklam harcaması ($X$) ile satış cirosu ($Y$) arasında $r = 0.85$ bulunmuştur ($n=20$). $t = 0.85 \\sqrt{18} / \\sqrt{1 - 0.7225} = 6.84$ ($p < 0.001$). Güçlü ve anlamlı pozitif doğrusal ilişki vardır.',
        en: 'Ad spend ($X$) and sales ($Y$) have $r = 0.85$ ($n=20$). $t = 6.84$ ($p < 0.001$), confirming strong significant linear relationship.'
      },
      vocabTerms: [
        { term_en: 'Pearson correlation coefficient', explanation_tr: 'İki değişken arasındaki doğrusal ilişkinin gücünü ve yönünü ölçen -1 ile +1 arası katsayı.', explanation_en: 'A statistic measuring linear correlation between two variables from -1 to +1.', exampleSentence_en: 'A Pearson correlation of 0.85 indicates strong positive linear association.' }
      ],
      questions: [
        {
          id: 'm7-l5-q1',
          type: 'multiple_choice',
          prompt: { tr: 'İki değişken arasında $r = -0.92$ bulunması ne anlama gelir?', en: 'What does a correlation of $r = -0.92$ indicate?' },
          options: [
            { tr: 'Çok güçlü negatif (ters yönlü) doğrusal ilişki', en: 'Very strong negative linear relationship' },
            { tr: 'Çok zayıf ilişki', en: 'Very weak relationship' },
            { tr: 'Pozitif güçlü ilişki', en: 'Strong positive relationship' },
            { tr: 'Doğrusal olmayan ilişki', en: 'Non-linear relationship' }
          ],
          correctAnswer: 'Çok güçlü negatif (ters yönlü) doğrusal ilişki',
          explanation: { tr: '$r$\'nin -1\'e çok yakın olması bir değişken artarken diğerinin güçlü şekilde azaldığını gösterir.', en: '$r$ close to -1 indicates a strong inverse linear relationship.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=KORELASYON(A1:A20; B1:B20)',
        pythonCode: 'from scipy.stats import pearsonr\nr, p_val = pearsonr(ad_spend, sales)',
        powerBiNote: { tr: 'Korelasyon matrisi ısı haritası (Heatmap) ile gösterilir.', en: 'Visualized via Correlation Heatmaps.' }
      }
    },
    {
      id: 'm7-l6',
      moduleId: 'module-7',
      order: 6,
      difficulty: 'orta-ustu',
      title: { tr: 'Basit Doğrusal Regresyon (OLS Denklemi)', en: 'Simple Linear Regression (OLS Equation)' },
      conceptCard: {
        tr: 'En Küçük Kareler Yöntemi (Ordinary Least Squares - OLS) ile hata kareleri toplamını minimize eden doğru denklemi (`INDR 252 Lecture 17-18`):\n\n$$\\hat{y} = \\beta_0 + \\beta_1 x$$\n\n1. **Eğim (Slope $\\beta_1$):** $\\beta_1 = \\frac{SS_{xy}}{SS_{xx}} = \\frac{\\sum (x-\\bar{x})(y-\\bar{y})}{\\sum(x-\\bar{x})^2} = r \\frac{s_y}{s_x}$\n2. **Kesen (Intercept $\\beta_0$):** $\\beta_0 = \\bar{y} - \\beta_1 \\bar{x}$\n3. **Yorum:** $X$ 1 birim arttığında $Y$ ortalama $\\beta_1$ birim değişir.',
        en: 'Ordinary Least Squares (OLS) regression line minimizing sum of squared residuals (`INDR 252 Lecture 17-18`):\n\n$$\\hat{y} = \\beta_0 + \\beta_1 x$$\n\n1. **Slope ($\\beta_1$):** $\\beta_1 = \\frac{SS_{xy}}{SS_{xx}} = r \\frac{s_y}{s_x}$\n2. **Intercept ($\\beta_0$):** $\\beta_0 = \\bar{y} - \\beta_1 \\bar{x}$\n3. **Interpretation:** Each 1-unit increase in $X$ changes expected $Y$ by $\\beta_1$ units.'
      },
      companyExample: {
        tr: 'AdTechX modelinde $\\hat{y} = 50 + 4.5 x$ bulunmuştur ($x$: Bin TL reklam, $y$: Bin TL ciro). Sıfır reklamda taban ciro 50 Bin TL\'dir; her 1.000 TL ek reklam ciroyu 4.500 TL artırır.',
        en: 'Sales model $\\hat{y} = 50 + 4.5x$. Base sales is $\\$50K$; every $\\$1K$ ad spend yields $\\$4.5K$ additional revenue.'
      },
      vocabTerms: [
        { term_en: 'ordinary least squares', explanation_tr: 'Gözlenen değerler ile tahmin doğrusu arasındaki dikey artıkların kareleri toplamını minimize eden yöntem (OLS).', explanation_en: 'A method for estimating unknown parameters in a linear regression model by minimizing sum of squared residuals.', exampleSentence_en: 'OLS provides best linear unbiased estimators (BLUE) under standard assumptions.' }
      ],
      questions: [
        {
          id: 'm7-l6-q1',
          type: 'numeric',
          prompt: { tr: '$\\hat{y} = 20 + 3x$ modelinde $x = 10$ için tahmin edilen $\\hat{y}$ değeri kaçtır?', en: 'In $\\hat{y} = 20 + 3x$, what is predicted $\\hat{y}$ for $x = 10$?' },
          correctAnswer: 50,
          explanation: { tr: '$$\\hat{y} = 20 + 3(10) = 20 + 30 = 50$$', en: '$$\\hat{y} = 20 + 3(10) = 50$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=EĞİM(Y_Aralığı; X_Aralığı) & =KESMENOKTASI(Y_Aralığı; X_Aralığı)',
        pythonCode: 'import statsmodels.api as sm\nmodel = sm.OLS(y, sm.add_constant(x)).fit()',
        powerBiNote: { tr: 'Saçılım grafiğine Trend Çizgisi eklenerek formül gösterilir.', en: 'Trend lines on scatter plots display OLS equations.' }
      }
    },
    {
      id: 'm7-l7',
      moduleId: 'module-7',
      order: 7,
      difficulty: 'orta-ustu',
      title: { tr: 'Kareler Toplamı Ayrışımı ($SST=SSR+SSE$) ve $R^2$', en: 'Sum of Squares Partitioning ($SST=SSR+SSE$) and $R^2$' },
      conceptCard: {
        tr: 'Regresyonda toplam varyans iki parçaya ayrılır (`INDR 252 Lecture 18`):\n\n1. **$SST$ (Total):** $\\sum (y_i - \\bar{y})^2$ (Verideki toplam değişkenlik)\n2. **$SSR$ (Regression):** $\\sum (\\hat{y}_i - \\bar{y})^2$ (Modelin açıkladığı değişkenlik)\n3. **$SSE$ (Error):** $\\sum (y_i - \\hat{y}_i)^2$ (Açıklanamayan artık değişkenlik)\n$$SST = SSR + SSE$$\n\n4. **Belirtme Katsayısı ($R^2$):**\n$$R^2 = \\frac{SSR}{SST} = 1 - \\frac{SSE}{SST}$$\n$Y$\'deki değişkenliğin yüzde kaçının $X$ modeli tarafından açıklandığını gösterir.',
        en: 'Decomposition of total variation in regression (`INDR 252 Lecture 18`):\n\n1. **$SST$ (Total):** $\\sum (y_i - \\bar{y})^2$\n2. **$SSR$ (Regression):** $\\sum (\\hat{y}_i - \\bar{y})^2$\n3. **$SSE$ (Residual):** $\\sum (y_i - \\hat{y}_i)^2$\n$$SST = SSR + SSE$$\n\n4. **Coefficient of Determination ($R^2$):**\n$$R^2 = \\frac{SSR}{SST} = 1 - \\frac{SSE}{SST}$$'
      },
      companyExample: {
        tr: 'Bir satış modelinde $SST = 1000$ ve $SSR = 820$ çıkmıştır. $R^2 = 820 / 1000 = 0.82$ (%82). Satışlardaki dalgalanmanın %82\'si reklam bütçesiyle açıklanabilmektedir.',
        en: '$SST = 1000, SSR = 820 \\implies R^2 = 0.82$. 82% of sales variability is explained by ad spending.'
      },
      vocabTerms: [
        { term_en: 'coefficient of determination', explanation_tr: 'Model tarafından açıklanan varyansın toplam varyansa oranı ($R^2$).', explanation_en: 'The proportion of variation in the dependent variable explained by independent variables.', exampleSentence_en: 'An R-squared of 0.82 indicates strong predictive fit.' }
      ],
      questions: [
        {
          id: 'm7-l7-q1',
          type: 'numeric',
          prompt: { tr: '$SST = 200$ ve $SSE = 40$ ise Belirtme Katsayısı ($R^2$) kaçtır?', en: 'If $SST = 200$ and $SSE = 40$, what is $R^2$?' },
          correctAnswer: 0.8,
          explanation: { tr: '$$R^2 = 1 - \\frac{SSE}{SST} = 1 - \\frac{40}{200} = 1 - 0.20 = 0.80$$', en: '$$R^2 = 1 - 40/200 = 0.80$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=RKARE(Y_Aralığı; X_Aralığı)',
        pythonCode: 'r2 = model.rsquared',
        powerBiNote: { tr: 'Model performans kartında R² skoru gösterilir.', en: 'R² score is reported in model performance metrics.' }
      }
    }
  ];
  return m;
});

console.log('Finished updating Modules 6 and 7.');
