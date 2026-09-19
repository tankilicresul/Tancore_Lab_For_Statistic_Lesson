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
// MODULE 15: Poisson Süreci (7 Lessons)
// ==========================================
updateModule(15, [
  {
    id: "m15-l1", moduleId: "module-15", order: 1, difficulty: "basit",
    title: { tr: "Poisson Dağılımı ve Oran Parametresi $\\lambda$", en: "Poisson Distribution & Rate $\\lambda$" },
    conceptCard: {
      tr: "Birim zaman veya alanda gerçekleşen bağımsız olayların sayısını modeller:\n\n$$P(N(t) = k) = \\frac{(\\lambda t)^k e^{-\\lambda t}}{k!}$$\n\n- $\\lambda$: Birim zamandaki ortalama olay geliş hızı (Rate)\n- $E[N(t)] = \\lambda t$\n- $\\text{Var}(N(t)] = \\lambda t$",
      en: "Poisson counts event arrivals with rate $\\lambda$ over time $t$:\n$$P(N(t) = k) = \\frac{(\\lambda t)^k e^{-\\lambda t}}{k!}, \\quad E[N(t)] = \\text{Var}(N(t)) = \\lambda t$$"
    },
    companyExample: {
      tr: "**Örnek Soru:** Dakikada $\\lambda = 2$ çağrı alan hatta 3 dakikada ($t=3$) beklenen çağrı sayısı nedir?\n\n**Çözüm:** $E[N(3)] = \\lambda \\times t = 2 \\times 3 = 6$ çağrı.",
      en: "**Worked Example:** $\\lambda=2, t=3 \\implies E[N(3)] = 6$."
    },
    vocabTerms: [{ term_en: "Poisson rate", explanation_tr: "Birim zamanda meydana gelen ortalama olay sıklığı (\\lambda).", explanation_en: "Average number of events occurring per unit time.", exampleSentence_en: "Arrival rate was estimated at 2 requests per second." }],
    questions: [{
      id: "m15-l1-q1", type: "numeric",
      prompt: { tr: "Saatlik $\\lambda = 5$ müşteri gelen bir banka şubesinde 4 saatte beklenen müşteri sayısı kaçtır?", en: "With $\\lambda = 5$ customers/hour, what is expected arrivals in 4 hours?" },
      correctAnswer: 20,
      explanation: { tr: "$$E[N(4)] = 5 \\times 4 = 20$$", en: "$$5 \\times 4 = 20$$" }
    }],
    realWorldBox: { excelFormula: "=POISSON.DAĞ(k, lambda*t, YANLIŞ)", pythonCode: "from scipy.stats import poisson\npoisson.pmf(k, mu=lam*t)", powerBiNote: { tr: "Kuyruk bekleme analitiği", en: "Queueing arrival analysis" } }
  },
  {
    id: "m15-l2", moduleId: "module-15", order: 2, difficulty: "orta",
    title: { tr: "Poisson Süreci Varsayımları", en: "Poisson Process Assumptions" },
    conceptCard: {
      tr: "Bir sayma süreci $\\{N(t), t \\ge 0\\}$ şu şartları sağlarsa homojen Poisson sürecidir:\n\n1. $N(0) = 0$\n2. **Bağımsız Artışlar (Independent Increments):** Ayrık zaman aralıklarındaki olay sayıları birbirinden bağımsızdır.\n3. **Durağan Artışlar (Stationary Increments):** $t$ süredeki olay sayısı sadece aralığın uzunluğuna bağlıdır.\n4. Aynı anda iki olayın gerçekleşme olasılığı sıfırdır ($o(h)$).",
      en: "Poisson process assumes independent and stationary increments with zero simultaneous events."
    },
    companyExample: {
      tr: "**Örnek Soru:** Bir web sitesine 10:00-10:15 arası gelen ziyaretçi sayısı ile 10:15-10:30 arası gelen sayısı bağımsız mıdır?\n\n**Çözüm:** Poisson süreci varsayımı gereği çakışmayan zaman aralıklarındaki olaylar tamamen bağımsızdır.",
      en: "**Worked Example:** Non-overlapping intervals have statistically independent event counts."
    },
    vocabTerms: [{ term_en: "stationary increments", explanation_tr: "Olay olasılıklarının zamanın başlangıç anına değil yalnızca aralık süresine bağlı olması.", explanation_en: "Property where probability depends only on interval length, not origin.", exampleSentence_en: "Stationary increments ensure consistent traffic modeling." }],
    questions: [{
      id: "m15-l2-q1", type: "multiple-choice",
      prompt: { tr: "Poisson sürecinde çakışmayan iki farklı zaman aralığındaki olay sayıları nasıldır?", en: "What is true about event counts in non-overlapping intervals of a Poisson process?" },
      options: [
        { tr: "Birbirinden bağımsızdır", en: "Statistically independent" },
        { tr: "Biri arttıkça diğeri kesinlikle artar", en: "Strictly positively correlated" },
        { tr: "Her zaman birbirine eşittir", en: "Always equal" },
        { tr: "Olasılıkları sıfırdır", en: "Zero probability" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Bağımsız artışlar özelliği gereği çakışmayan aralıklar bağımsızdır.", en: "Independent increments imply independence across disjoint intervals." }
    }],
    realWorldBox: { excelFormula: "=POISSON.DAĞ(x, mean, TRUE)", pythonCode: "simulated_arrivals = np.random.poisson(lam, size=100)", powerBiNote: { tr: "Trafik akış modelleri", en: "Traffic flow visual" } }
  },
  {
    id: "m15-l3", moduleId: "module-15", order: 3, difficulty: "orta",
    title: { tr: "Olaylar Arası Süre ve Üstel Dağılım", en: "Inter-Arrival Times & Exponential" },
    conceptCard: {
      tr: "$\\lambda$ oranlı bir Poisson sürecinde, ardışık iki olay arasında geçen bekleme süresi $T$, parametresi $\\lambda$ olan **Üstel Dağılım (Exponential)** gösterir:\n\n$$f(t) = \\lambda e^{-\\lambda t}, \\quad t \\ge 0$$\n\n- **Beklenen Bekleme Süresi:** $E[T] = \\frac{1}{\\lambda}$\n- **Varyans:** $\\text{Var}(T) = \\frac{1}{\\lambda^2}$",
      en: "Inter-arrival times $T$ follow an Exponential distribution: $f(t) = \\lambda e^{-\\lambda t}, E[T] = 1/\\lambda$."
    },
    companyExample: {
      tr: "**Örnek Soru:** Saatte ortalama $\\lambda = 12$ müşteri gelen bir mağazada iki müşteri arasındaki ortalama bekleme süresi kaç dakikadır?\n\n**Çözüm:**\n$$E[T] = \\frac{1}{12} \\text{ saat} = \\frac{60}{12} = 5 \\text{ dakika}$$",
      en: "**Worked Example:** $\\lambda=12/hr \\implies E[T] = 1/12 hr = 5$ minutes."
    },
    vocabTerms: [{ term_en: "exponential distribution", explanation_tr: "Poisson sürecindeki olaylar arasındaki bekleme sürelerini modelleyen sürekli dağılım.", explanation_en: "Continuous distribution modeling the time elapsed between Poisson events.", exampleSentence_en: "Mean time to next customer arrival follows an exponential distribution." }],
    questions: [{
      id: "m15-l3-q1", type: "numeric",
      prompt: { tr: "Dakikada $\\lambda = 0.5$ istek alan bir sunucuda istekler arası ortalama bekleme süresi ($1/\\lambda$) kaç dakikadır?", en: "If $\\lambda = 0.5$ requests/min, what is mean waiting time in minutes ($1/\\lambda$)?" },
      correctAnswer: 2,
      explanation: { tr: "$$E[T] = \\frac{1}{0.5} = 2 \\text{ dakika}$$", en: "$$E[T] = 1 / 0.5 = 2$$" }
    }],
    realWorldBox: { excelFormula: "=ÜSTEL.DAĞ(x, lambda, DOĞRU)", pythonCode: "from scipy.stats import expon\nexpon.mean(scale=1/lam)", powerBiNote: { tr: "Hizmet süresi SLA panelleri", en: "SLA response time dashboard" } }
  },
  {
    id: "m15-l4", moduleId: "module-15", order: 4, difficulty: "ileri",
    title: { tr: "Üstel Dağılımda Hafızasızlık Özelliği", en: "Memoryless Property of Exponential" },
    conceptCard: {
      tr: "Üstel dağılım **hafızasız (memoryless)** tek sürekli dağılımdır:\n\n$$P(T > s + t \\mid T > s) = P(T > t)$$\n\nGeçmişte $s$ süre boyunca hiçbir olayın gerçekleşmemiş olması, bundan sonraki $t$ süre içinde gerçekleşme olasılığını etkilemez.",
      en: "Exponential is memoryless: $P(T > s + t \\mid T > s) = P(T > t)$. Past waiting gives no information about future."
    },
    companyExample: {
      tr: "**Örnek Soru:** Bir otobüs durağında 15 dakikadır bekliyorsunuz. Otobüsün gelmesi için en az 10 dakika daha bekleme olasılığınız, durağa yeni gelen biriyle aynı mıdır?\n\n**Çözüm:** Evet, gelişler Poisson (süreler üstel) ise hafızasızlık gereği geçmiş bekleme süresi geleceği etkilemez.",
      en: "**Worked Example:** Waiting 15 minutes does not increase or decrease remaining waiting time under memorylessness."
    },
    vocabTerms: [{ term_en: "memorylessness", explanation_tr: "Geçmişte geçen sürenin gelecekteki bekleme süresi olasılıklarını değiştirmemesi özelliği.", explanation_en: "Property where future probability depends only on remaining time, not elapsed time.", exampleSentence_en: "Radioactive decay is perfectly memoryless." }],
    questions: [{
      id: "m15-l4-q1", type: "multiple-choice",
      prompt: { tr: "Hafızasızlık (Memoryless) özelliğine sahip tek sürekli olasılık dağılımı hangisidir?", en: "Which continuous probability distribution uniquely possesses the memoryless property?" },
      options: [
        { tr: "Üstel Dağılım (Exponential)", en: "Exponential Distribution" },
        { tr: "Normal Dağılım", en: "Normal Distribution" },
        { tr: "Uniform Dağılım", en: "Uniform Distribution" },
        { tr: "Beta Dağılımı", en: "Beta Distribution" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Sürekli dağılımlar içinde hafızasızlık özelliğini sağlayan yegane dağılım Üstel Dağılımdır.", en: "The exponential distribution is uniquely memoryless among continuous distributions." }
    }],
    realWorldBox: { excelFormula: "=1 - ÜSTEL.DAĞ(t, lambda, DOĞRU)", pythonCode: "p_remaining = np.exp(-lam * t)", powerBiNote: { tr: "Ekipman güvenilirlik (Reliability) modelleri", en: "Equipment reliability models" } }
  },
  {
    id: "m15-l5", moduleId: "module-15", order: 5, difficulty: "orta",
    title: { tr: "Nadir Olaylar & Binom-Poisson Yaklaşımı", en: "Binomial Poisson Approximation" },
    conceptCard: {
      tr: "Deneme sayısı $n$ çok büyük ($n \\ge 100$) ve başarı olasılığı $p$ çok küçük ($p \\le 0.05$) olduğunda, $\\text{Binom}(n, p)$ dağılımı $\\lambda = n \\cdot p$ parametreli **Poisson** dağılımına yaklaşır:\n\n$$\\binom{n}{k} p^k (1-p)^{n-k} \\approx \\frac{\\lambda^k e^{-\\lambda}}{k!}$$",
      en: "For large $n$ and small $p$, $\\text{Binom}(n, p) \\approx \\text{Poisson}(\\lambda = np)$."
    },
    companyExample: {
      tr: "**Örnek Soru:** 1000 kullanıcılı bir ağda her kullanıcının aynı anda canlı yayın açma olasılığı $p = 0.002$'dir. $\\lambda$ nedir?\n\n**Çözüm:** $\\lambda = n \\cdot p = 1000 \\times 0.002 = 2$ eşzamanlı yayın.",
      en: "**Worked Example:** $n=1000, p=0.002 \\implies \\lambda = 1000 \\times 0.002 = 2$."
    },
    vocabTerms: [{ term_en: "Poisson limit theorem", explanation_tr: "Büyük n ve küçük p durumunda Binom dağılımının Poisson'a yakınsaması teoremidir.", explanation_en: "Law of rare events approximating binomial counts with Poisson.", exampleSentence_en: "We used Poisson approximation to model rare network packet drops." }],
    questions: [{
      id: "m15-l5-q1", type: "numeric",
      prompt: { tr: "$n = 500$ ve $p = 0.01$ olan bir üretim sürecinde Poisson yaklaşım parametresi $\\lambda = n \\cdot p$ kaçtır?", en: "What is $\\lambda = np$ for $n=500$ and $p=0.01$?" },
      correctAnswer: 5,
      explanation: { tr: "$$\\lambda = 500 \\times 0.01 = 5$$", en: "$$\\lambda = 500 \\times 0.01 = 5$$" }
    }],
    realWorldBox: { excelFormula: "=POISSON.DAĞ(k, 5, YANLIŞ)", pythonCode: "from scipy.stats import poisson\npoisson.pmf(k, 5)", powerBiNote: { tr: "Nadir risk simülasyonları", en: "Rare event risk modeling" } }
  },
  {
    id: "m15-l6", moduleId: "module-15", order: 6, difficulty: "ileri",
    title: { tr: "Bağımsız Poisson Süreçlerinin Toplanması", en: "Superposition of Poisson Processes" },
    conceptCard: {
      tr: "İki bağımsız Poisson süreci $N_1(t) \\sim \\text{Poisson}(\\lambda_1)$ ve $N_2(t) \\sim \\text{Poisson}(\\lambda_2)$ birleştirildiğinde, toplam süreç de bir Poisson sürecidir ve oranı hızların toplamıdır:\n\n$$N(t) = N_1(t) + N_2(t) \\sim \\text{Poisson}((\\lambda_1 + \\lambda_2) t)$$",
      en: "Superposition: Independent Poisson processes merge into a single Poisson process with rate $\\lambda = \\lambda_1 + \\lambda_2$."
    },
    companyExample: {
      tr: "**Örnek Soru:** Bir web sunucusuna web üzerinden $\\lambda_1 = 30$ istek/sn, mobil uygulamadan $\\lambda_2 = 20$ istek/sn gelmektedir. Toplam geliş hızı nedir?\n\n**Çözüm:** $\\lambda = 30 + 20 = 50$ istek/sn.",
      en: "**Worked Example:** Web (30) + Mobile (20) gives combined $\\lambda = 50$ req/s."
    },
    vocabTerms: [{ term_en: "superposition", explanation_tr: "Bağımsız akışların birleşerek toplam oranlı tek bir Poisson akışı oluşturması.", explanation_en: "Merging independent Poisson streams into a combined rate process.", exampleSentence_en: "Server capacity was provisioned for the superposition rate of 50 req/s." }],
    questions: [{
      id: "m15-l6-q1", type: "numeric",
      prompt: { tr: "A kanalından $\\lambda_1 = 4$ ve B kanalından $\\lambda_2 = 6$ çağrı/dakika alan çağrı merkezinin toplam Poisson hızı $\\lambda$ kaçtır?", en: "What is combined rate $\\lambda$ for channel A (4) and channel B (6)?" },
      correctAnswer: 10,
      explanation: { tr: "$$\\lambda = 4 + 6 = 10 \\text{ çağrı/dk}$$", en: "$$\\lambda = 4 + 6 = 10$$" }
    }],
    realWorldBox: { excelFormula: "=A1 + B1", pythonCode: "total_rate = lam1 + lam2", powerBiNote: { tr: "Çok kanallı trafik birleştirme", en: "Multi-channel traffic aggregation" } }
  },
  {
    id: "m15-l7", moduleId: "module-15", order: 7, difficulty: "ileri",
    title: { tr: "Poisson Süreçlerinde Ayrılma (Thinning)", en: "Thinning / Splitting of Poisson Process" },
    conceptCard: {
      tr: "$\\lambda$ hızlı bir Poisson sürecindeki her olay bağımsız olarak $p$ olasılığıyla Tip 1, $1-p$ olasılığıyla Tip 2 olarak sınıflandırılırsa:\n\n- Tip 1 süreci: $\\lambda_1 = \\lambda \\cdot p$\n- Tip 2 süreci: $\\lambda_2 = \\lambda \\cdot (1-p)$\n\nHer iki ayrık süreç de bağımsız birer Poisson sürecidir.",
      en: "Thinning: Splitting with probability $p$ produces independent Poisson sub-processes with rates $\\lambda p$ and $\\lambda(1-p)$."
    },
    companyExample: {
      tr: "**Örnek Soru:** Saatte $\\lambda = 100$ sipariş alan sitede siparişlerin %20'si ($p=0.20$) iade edilmektedir. İade akışının Poisson hızı nedir?\n\n**Çözüm:** $\\lambda_{\\text{iade}} = 100 \\times 0.20 = 20$ iade/saat.",
      en: "**Worked Example:** Rate 100 with 20% returns produces $\\lambda_{return} = 100 \\times 0.2 = 20$."
    },
    vocabTerms: [{ term_en: "thinning (splitting)", explanation_tr: "Bir Poisson sürecinin olasılıksal filtreleme ile bağımsız alt süreçlere bölünmesi.", explanation_en: "Decomposition of a Poisson process into independent sub-processes by Bernoulli sampling.", exampleSentence_en: "Thinning models fraudulent vs. legitimate transaction streams." }],
    questions: [{
      id: "m15-l7-q1", type: "numeric",
      prompt: { tr: "Günde $\\lambda = 200$ e-posta alan bir kutuda e-postaların %15'i spam ise spam e-posta geliş hızı kaçtır?", en: "With $\\lambda = 200$ emails/day and 15% spam, what is the spam rate?" },
      correctAnswer: 30,
      explanation: { tr: "$$\\lambda_{\\text{spam}} = 200 \\times 0.15 = 30$$", en: "$$\\lambda_{spam} = 200 \\times 0.15 = 30$$" }
    }],
    realWorldBox: { excelFormula: "=lambda * p", pythonCode: "spam_rate = total_rate * p_spam", powerBiNote: { tr: "Segment filtreli talep analitiği", en: "Segmented demand rate forecasting" } }
  }
]);

console.log('Finished Module 15.');
