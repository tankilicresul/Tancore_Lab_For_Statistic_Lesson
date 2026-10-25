export interface ExamTrap {
  trapTitle: string;
  trapTitle_en: string;
  whyStudentsFail: string;
  whyStudentsFail_en: string;
  howToSolve: string;
  howToSolve_en: string;
  goldenRule: string;
  goldenRule_en: string;
}

export interface ExamBlueprintItem {
  questionNumber: string;
  topic: string;
  topic_en: string;
  points: number;
  expectedQuestionType: string;
  expectedQuestionType_en: string;
  survivalTip: string;
  survivalTip_en: string;
}

export interface CheatSheetFormula {
  name: string;
  name_en: string;
  latex: string;
  whenToUse: string;
  whenToUse_en: string;
}

export interface SolvedExamQuestion {
  title: string;
  title_en: string;
  points: number;
  prompt: string;
  prompt_en: string;
  steps: {
    stepTitle: string;
    stepTitle_en: string;
    points: number;
    explanation: string;
    explanation_en: string;
    math?: string;
  }[];
  finalAnswer: string;
  finalAnswer_en: string;
}

export interface CourseMentorGuide {
  courseCode: string;
  courseTitle: string;
  courseTitle_en: string;
  mentorQuote: string;
  mentorQuote_en: string;
  mentalModelTitle: string;
  mentalModelTitle_en: string;
  mentalModelText: string;
  mentalModelText_en: string;
  blueprint: ExamBlueprintItem[];
  traps: ExamTrap[];
  formulas: CheatSheetFormula[];
  sampleQuestion: SolvedExamQuestion;
}

export const INDR_MENTOR_DATA: Record<string, CourseMentorGuide> = {
  indr343: {
    courseCode: 'INDR 343',
    courseTitle: 'Stokastik Modeller',
    courseTitle_en: 'Stochastic Models',
    mentorQuote:
      'Öğrencilerimin hepsi 95+ alıyor çünkü stokastiğe zar atmak gibi değil, olasılıkların bir havuzda akışı gibi bakmayı öğreniyorlar. Markov hafızasızdır: Yarının durumu sadece bugüne bakar, dünü unut!',
    mentorQuote_en:
      'All my students score 95+ because they stop seeing stochastics as random dice rolls and start seeing it as probability fluid dynamics. Markov is memoryless: tomorrow depends strictly on today, forget yesterday!',
    mentalModelTitle: '💡 Gözünde Canlandır: Markov Zinciri Hafıza Kaybıdır',
    mentalModelTitle_en: '💡 Mental Model: The Markov Chain is an Amnesiac',
    mentalModelText:
      'Bir robot düşün. Hangi odaya geçeceği sadece şu an bulunduğu odaya bağlı. Oraya 10 saat önce mi geldi, yoksa koşarak mı girdi, robotun zerre umurunda değil. İşte bu P(X_{n+1} = j | X_n = i) demektir. Geçmiş silinir, sadece bugünkü durum geleceği belirler.',
    mentalModelText_en:
      'Imagine a robot wandering through rooms. Its next room transition depends exclusively on the room it is standing in right now. It does not care if it ran there or waited 10 hours. That is P(X_{n+1} = j | X_n = i). The past is erased; only the current state dictates the future.',
    blueprint: [
      {
        questionNumber: 'Soru 1',
        topic: 'DTMC Geçiş Matrisi ve Denge Dağılımı (π)',
        topic_en: 'DTMC Transition Matrix & Stationary Distribution (π)',
        points: 30,
        expectedQuestionType: 'Durum uzayı tanımlama, P matrisi kurma ve πP = π denklemleri çözümü.',
        expectedQuestionType_en: 'State space formulation, P matrix creation, and solving πP = π.',
        survivalTip: 'πP = π tek başına sonsuz çözüm verir; mutlaka Σπ_j = 1 normalization denklemini ekle!',
        survivalTip_en: 'πP = π gives linearly dependent equations; ALWAYS include the normalization equation Σπ_j = 1!',
      },
      {
        questionNumber: 'Soru 2',
        topic: 'Kuyruk Sistemleri (M/M/1, M/M/s) & Little Kanunu',
        topic_en: 'Queueing Theory (M/M/1, M/M/s) & Little\'s Law',
        points: 35,
        expectedQuestionType: 'ρ hesabı, ortalama bekleme süresi Wq, sistem süresi W ve kuyruk uzunluğu Lq.',
        expectedQuestionType_en: 'Utilization ρ, average queue wait Wq, system time W, and queue length Lq.',
        survivalTip: 'Birim tuzağı! λ saatte müşteri ise μ da saatte müşteri olmalı. Asla dakikayla saati karıştırma.',
        survivalTip_en: 'Unit consistency! If λ is customers/hour, μ must be in hours. Never mix minutes with hours.',
      },
      {
        questionNumber: 'Soru 3',
        topic: 'Doğum-Ölüm Süreçleri & Yutan Durumlar (Absorption)',
        topic_en: 'Birth-Death Processes & Absorbing Probabilities',
        points: 35,
        expectedQuestionType: 'Birinci adım analizi (First-Step Analysis) ve ortalama ilk geçiş süresi (μ_ij).',
        expectedQuestionType_en: 'First-Step Analysis and Mean First Passage Time (μ_ij).',
        survivalTip: 'f_{ik} = p_{ik} + Σ p_{ij} f_{jk} denkleminde yutan durumların katsayısı 1\'dir.',
        survivalTip_en: 'In first-step analysis, absorbing state boundary condition is always equal to 1.',
      },
    ],
    traps: [
      {
        trapTitle: 'Tuzak 1: πP = π Denklemlerinde Lineer Bağımlılık',
        trapTitle_en: 'Trap 1: Linear Dependency in πP = π',
        whyStudentsFail:
          'Öğrenciler n adet πP=π denklemini matrisle çözmeye çalışır ve matris determinantı 0 çıkar (sonsuz çözüm). Çıkmaza girip paniklerler.',
        whyStudentsFail_en:
          'Students attempt to solve the n equations of πP = π directly; determinant is 0 and they get stuck in infinite solutions.',
        howToSolve:
          'πP=π denklemlerinden herhangi birini ÇÖPE AT. Onun yerine Σ_{j} π_j = 1 denklemini koy. Tek ve kesin çözüm anında çıkar.',
        howToSolve_en:
          'Discard any ONE equation from πP = π. Replace it with Σ π_j = 1. A unique solution emerges immediately.',
        goldenRule: 'Altın Kural: 1 denklemi sil + Normalize et (Toplam = 1).',
        goldenRule_en: 'Golden Rule: Drop 1 equation + Normalize (Sum = 1).',
      },
      {
        trapTitle: 'Tuzak 2: L ve Lq (Veya W ve Wq) Karışıklığı',
        trapTitle_en: 'Trap 2: Confusing L with Lq (or W with Wq)',
        whyStudentsFail:
          'Hoca "Kuyrukta bekleyen ortalama müşteri sayısı" der; öğrenci gider tüm sistemdeki L\'yi hesaplar ve 15 puan gider.',
        whyStudentsFail_en:
          'The exam asks for "average customers in QUEUE", student calculates total system L and loses 15 points.',
        howToSolve:
          'Kuyruk (Queue) = Sadece bekleyenler (Lq, Wq). Sistem (System) = Bekleyenler + Servis alanlar (L, W). Unutma: W = Wq + (1/μ) ve L = λW.',
        howToSolve_en:
          'Queue = Waiting only (Lq, Wq). System = Queue + Server (L, W). Remember: W = Wq + 1/μ and L = λW.',
        goldenRule: 'Altın Kural: "Kuyrukta" kelimesi varsa alt indis daima \'q\' olur!',
        goldenRule_en: 'Golden Rule: If the word is "in queue", the subscript is strictly \'q\'!',
      },
      {
        trapTitle: 'Tuzak 3: ρ ≥ 1 İken Formül Uygulamak',
        trapTitle_en: 'Trap 3: Applying Steady-State Formulas when ρ ≥ 1',
        whyStudentsFail:
          'λ = 10, μ = 8 verilmiştir. Öğrenci formüle koyar ve L = -5 gibi absürt negatif sayılar bulur.',
        whyStudentsFail_en:
          'Given λ = 10 and μ = 8, student plugs numbers in and calculates negative numbers like L = -5.',
        howToSolve:
          'Önce ρ = λ/μ oranını kontrol et! Eğer ρ ≥ 1 ise steady-state YOKTUR. "Sistem kararsızdır, kuyruk sonsuza patlar" yazıp tam puanı al.',
        howToSolve_en:
          'Always verify ρ = λ/μ first! If ρ ≥ 1, no steady-state exists. Write "System is unstable, queue grows indefinitely" for full points.',
        goldenRule: 'Altın Kural: ρ < 1 kontrolü yapmadan hiçbir kuyruk formülüne başlama.',
        goldenRule_en: 'Golden Rule: Never calculate queue metrics without checking ρ < 1 first.',
      },
    ],
    formulas: [
      {
        name: 'Little Kanunu (Temel Denge)',
        name_en: 'Little\'s Law',
        latex: 'L = \\lambda W \\quad \\text{ve} \\quad L_q = \\lambda W_q',
        whenToUse: 'Sistemdeki ortalama kişi veya bekleme süresinden biri bilindiğinde diğerine 5 saniyede geçmek için.',
        whenToUse_en: 'To convert between inventory (L) and cycle time (W) in under 5 seconds.',
      },
      {
        name: 'M/M/1 Kararlı Hal Olasılığı',
        name_en: 'M/M/1 State Probability',
        latex: 'P_n = (1 - \\rho) \\rho^n, \\quad \\rho = \\frac{\\lambda}{\\mu} < 1',
        whenToUse: 'Sistemde tam n kişi bulunma olasılığı (Örn: Sistemin boş kalma olasılığı P_0 = 1 - ρ).',
        whenToUse_en: 'Probability of having exactly n customers (e.g. Server idle probability P_0 = 1 - ρ).',
      },
      {
        name: 'M/M/1 Ortalama Kuyruk Süresi',
        name_en: 'M/M/1 Average Wait in Queue',
        latex: 'W_q = \\frac{\\lambda}{\\mu(\\mu - \\lambda)}, \\quad L_q = \\frac{\\lambda^2}{\\mu(\\mu - \\lambda)}',
        whenToUse: 'Tek gişeli bir banka/sunucuda bir müşterinin sadece kuyrukta geçirdiği saf bekleme süresi için.',
        whenToUse_en: 'Pure queue waiting time in a single server Poisson arrival exponential service system.',
      },
    ],
    sampleQuestion: {
      title: 'Final Sorusu: Koç Üniversitesi Sağlık Merkezi Tek Doktorlu Acil Polikliniği (30 Puan)',
      title_en: 'Final Exam Problem: Health Center Emergency Clinic (30 Points)',
      points: 30,
      prompt:
        'Hastalar acil servise saatte ortalama λ = 4 hasta ile Poisson dağılımına uygun gelmektedir. Tek doktor her bir hastayı ortalama 12 dakikada (üstel dağılım) muayene etmektedir. (a) Sistemin doluluk oranını (ρ), (b) Bir hastanın kuyrukta bekleme süresini (Wq), (c) Muayenede veya kuyrukta en az 2 hasta bulunma olasılığını hesaplayınız.',
      prompt_en:
        'Patients arrive according to a Poisson process with λ = 4 patients/hour. A single physician examines each patient with exponential service time averaging 12 minutes. (a) Find doctor utilization (ρ), (b) Expected waiting time in queue (Wq), (c) Probability that at least 2 patients are in the clinic.',
      steps: [
        {
          stepTitle: 'Adım 1: Birimleri Saate Eşitle (Kritik İlk Hamle - 5 Puan)',
          stepTitle_en: 'Step 1: Standardize Units to Hours (5 Points)',
          points: 5,
          explanation:
            'λ = 4 hasta/saat. Doktor 12 dakikada 1 hasta bakıyorsa, 1 saatte (60 dk) bakacağı hasta sayısı:',
          explanation_en:
            'λ = 4 patients/hr. If physician takes 12 mins per patient, service rate in 1 hour is:',
          math: '\\mu = \\frac{60 \\text{ dk}}{12 \\text{ dk}} = 5 \\text{ hasta/saat}',
        },
        {
          stepTitle: 'Adım 2: Sunucu Doluluk Oranını (ρ) Bul (5 Puan)',
          stepTitle_en: 'Step 2: Calculate Utilization ρ (5 Points)',
          points: 5,
          explanation:
            'Sistem kararlıdır çünkü ρ < 1 şartı sağlanır:',
          explanation_en:
            'System is stable because ρ < 1:',
          math: '\\rho = \\frac{\\lambda}{\\mu} = \\frac{4}{5} = 0.80 \\quad (\\%80 \\text{ doluluk})',
        },
        {
          stepTitle: 'Adım 3: Kuyrukta Bekleme Süresi Wq (10 Puan)',
          stepTitle_en: 'Step 3: Average Wait Time in Queue Wq (10 Points)',
          points: 10,
          explanation:
            'M/M/1 kuyruk formülünü uygulayalım:',
          explanation_en:
            'Apply M/M/1 formula:',
          math: 'W_q = \\frac{\\lambda}{\\mu(\\mu - \\lambda)} = \\frac{4}{5(5 - 4)} = \\frac{4}{5} \\text{ saat} = 48 \\text{ dakika}',
        },
        {
          stepTitle: 'Adım 4: En Az 2 Hasta Bulunma Olasılığı P(N ≥ 2) (10 Puan)',
          stepTitle_en: 'Step 4: Probability of At Least 2 Patients P(N ≥ 2) (10 Points)',
          points: 10,
          explanation:
            'Tümleyen kuralı (Complement rule) kullan: P(N ≥ 2) = 1 - P_0 - P_1. P_n = (1 - ρ)ρ^n olduğundan P_0 = 1 - 0.8 = 0.2, P_1 = 0.2 × 0.8 = 0.16.',
          explanation_en:
            'Use complement rule: P(N ≥ 2) = 1 - P_0 - P_1. With P_0 = 0.2 and P_1 = 0.16:',
          math: 'P(N \\ge 2) = 1 - (0.20 + 0.16) = 1 - 0.36 = 0.64 \\quad (\\%64)',
        },
      ],
      finalAnswer: 'Cevap: (a) ρ = 0.80 (%80), (b) Wq = 48 dakika, (c) P(N ≥ 2) = 0.64 (%64). Tam puan: 30/30.',
      finalAnswer_en: 'Answer: (a) ρ = 0.80 (80%), (b) Wq = 48 minutes, (c) P(N ≥ 2) = 0.64 (64%). Score: 30/30.',
    },
  },

  indr344: {
    courseCode: 'INDR 344',
    courseTitle: 'Modelleme ve Simülasyon',
    courseTitle_en: 'Modeling and Simulation',
    mentorQuote:
      'Simülasyon kod yazmak değildir; karmaşık bir sistemin zaman içindeki olay saatini (clock) elinle ilerletip istatistiksel güven aralığı kurmaktır. Welch ve LCG kurallarını ezberleme, mantığını bil!',
    mentorQuote_en:
      'Simulation is not about writing code; it is advancing event clocks and constructing statistical confidence intervals. Master the mechanics behind Welch and LCG rather than memorizing!',
    mentalModelTitle: '💡 Gözünde Canlandır: Simülasyon Zamanda Işınlanmaktır',
    mentalModelTitle_en: '💡 Mental Model: Simulation is Time Teleportation',
    mentalModelText:
      'Normal hayatta zaman saniye saniye akar. Ama Ayrık Olay Simülasyonunda (DES) arada hiçbir şey olmuyorsa saat 10:00\'dan direkt 10:45\'e ışınlanır (Next-Event Scheduling). Gelecek Olay Listesi (FEL) en yakın olayı seçer ve oraya zıplar.',
    mentalModelText_en:
      'In reality, time moves continuous second-by-second. In Discrete-Event Simulation (DES), if nothing happens between 10:00 and 10:45, the simulation clock teleports directly to 10:45. The Future Event List (FEL) orders upcoming milestones and leaps forward.',
    blueprint: [
      {
        questionNumber: 'Soru 1',
        topic: 'Manuel Simülasyon Tablosu (FEL & State Variables)',
        topic_en: 'Manual Simulation Table (FEL & State Variables)',
        points: 35,
        expectedQuestionType: 'Verilen varış ve servis süreleriyle ilk 5-6 müşterinin olay çizelgesini doldurma.',
        expectedQuestionType_en: 'Populating FEL clock and departure milestones for the first 5-6 customers.',
        survivalTip: 'Servis başlangıç saati = max(Varış Saati, Sunucunun Boşalma Saati). Bu formülü asla unutma!',
        survivalTip_en: 'Service start time = max(Arrival Time, Server Available Time). Memorize this identity!',
      },
      {
        questionNumber: 'Soru 2',
        topic: 'Rassal Değişken Üretimi (Inverse Transform & LCG)',
        topic_en: 'Random Variate Generation (Inverse Transform & LCG)',
        points: 30,
        expectedQuestionType: 'Verilen f(x) yoğunluk fonksiyonunun F(x) tersini alıp U(0,1) ile x üretme.',
        expectedQuestionType_en: 'Inverting CDF F(x) to generate variates X = F^{-1}(U).',
        survivalTip: 'Önce integral alarak F(x)\'i bul, sonra u = F(x) yazıp x\'i tek başına bırak (x = F^{-1}(u)).',
        survivalTip_en: 'Integrate PDF to find CDF F(x), set u = F(x), and isolate x algebraically.',
      },
      {
        questionNumber: 'Soru 3',
        topic: 'Çıktı Analizi, Isınma Periyodu (Welch) & Güven Aralığı',
        topic_en: 'Output Analysis, Warm-up Period (Welch) & Confidence Intervals',
        points: 35,
        expectedQuestionType: 'Bağımsız replikasyonlar, t-dağılımı güven aralığı ve Welch hareketli ortalaması.',
        expectedQuestionType_en: 'Independent replications, Student-t confidence intervals, and Welch moving averages.',
        survivalTip: 'Terminating sistemde replikasyon yapılır; Steady-state sistemde ise ısınma periyodu (d) atılır!',
        survivalTip_en: 'Replicate terminating systems; truncate initial warm-up transient (d) in steady-state systems!',
      },
    ],
    traps: [
      {
        trapTitle: 'Tuzak 1: Servis Başlangıcını Yanlış Zamana Yazmak',
        trapTitle_en: 'Trap 1: Miscalculating Service Start Time',
        whyStudentsFail:
          'Öğrenci, doktor ya da sunucu önceki hastayla meşgulken yeni gelen hastayı direkt muayeneye sokar. Kuyruk süresi 0 çıkar!',
        whyStudentsFail_en:
          'Student admits a newly arrived entity into service even while the server is occupied with a prior customer.',
        howToSolve:
          'Daima: Servis Başlangıcı = max(Hastanın Varış Saati, Önceki Hastanın Ayrılış Saati). Sunucu müsait değilse hasta bekler!',
        howToSolve_en:
          'Always: Service Start = max(Entity Arrival, Previous Entity Departure). If busy, entity waits in queue!',
        goldenRule: 'Altın Kural: max(Arrival, Server_Available) kuralını her satırda uygula.',
        goldenRule_en: 'Golden Rule: Enforce max(Arrival, Server_Available) on every single row.',
      },
      {
        trapTitle: 'Tuzak 2: Welch Metodunda Replikasyon Öncesi Ortalama Almak',
        trapTitle_en: 'Trap 2: Averaging across time before averaging across replications in Welch',
        whyStudentsFail:
          'Hoca "Welch yönteminde adımlar nelerdir?" diye sorar; öğrenci zaman serisi ortalamasını replikasyon ortalamasından önce yazar.',
        whyStudentsFail_en:
          'Student computes temporal moving averages before averaging across independent replications.',
        howToSolve:
          'Sıra ÇOK KESİNDİR: 1) R replikasyon yap, 2) Her zaman dilimi i için replikasyonlar arası ortalama Ȳ_i al, 3) Ȳ_i üzerinde w pencere büyüklüğüyle hareketli ortalama al, 4) Isınma noktası d\'yi görsel olarak seç.',
        howToSolve_en:
          'Strict sequence: 1) Run R replications, 2) Average across replications at each epoch i, 3) Apply moving average window w, 4) Select truncation point d.',
        goldenRule: 'Altın Kural: Önce dikey ortalama (replikasyonlar), sonra yatay ortalama (hareketli pencere)!',
        goldenRule_en: 'Golden Rule: Vertical average across replications first, horizontal moving window second!',
      },
    ],
    formulas: [
      {
        name: 'Ters Dönüşüm Yöntemi (Inverse Transform)',
        name_en: 'Inverse Transform Method',
        latex: 'X = F^{-1}(U), \\quad U \\sim \\text{Uniform}(0, 1)',
        whenToUse: 'Sürekli veya kesikli herhangi bir kümülatif olasılık dağılımından rassal sayı üretmek için.',
        whenToUse_en: 'To sample variates from any continuous or discrete cumulative distribution function.',
      },
      {
        name: 'Üstel Dağılım Üretme (Exponential Generation)',
        name_en: 'Exponential Variate Generator',
        latex: 'X = -\\frac{1}{\\lambda} \\ln(1 - U) \\equiv -\\frac{1}{\\lambda} \\ln(U)',
        whenToUse: 'Servis ve varış sürelerini simüle ederken bilgisayarın uniform [0,1] sayısını üstel süreye çevirmek için.',
        whenToUse_en: 'To convert pseudo-random uniform numbers into exponential interarrival or service durations.',
      },
      {
        name: 'LCG Doğrusal Eşlik Üreteci',
        name_en: 'Linear Congruential Generator (LCG)',
        latex: 'X_{i+1} = (a X_i + c) \\pmod m, \\quad R_i = \\frac{X_i}{m}',
        whenToUse: 'Bilgisayarın sözde rastgele (pseudo-random) tamsayı ve [0,1] ondalık üretme algoritması.',
        whenToUse_en: 'Foundation algorithm for generating pseudo-random sequences modulo m.',
      },
    ],
    sampleQuestion: {
      title: 'Vize Sorusu: Üstel Dağılım İçin Ters Dönüşümle Rastgele Sayı Üretimi (25 Puan)',
      title_en: 'Midterm Exam Problem: Exponential Variate Generation (25 Points)',
      points: 25,
      prompt:
        'Bir çağrı merkezine gelen çağrıların servis süresi ortalama 1/λ = 5 dakika olan üstel dağılıma uymaktadır (f(x) = 0.2 e^{-0.2x}, x ≥ 0). (a) Ters dönüşüm formülünü türetiniz. (b) Verilen U_1 = 0.35 ve U_2 = 0.80 sayıları için servis sürelerini hesaplayınız.',
      prompt_en:
        'Call center service duration follows exponential distribution with mean 5 mins (f(x) = 0.2 e^{-0.2x}, x ≥ 0). (a) Derive inverse transform generator. (b) Generate service times for U_1 = 0.35 and U_2 = 0.80.',
      steps: [
        {
          stepTitle: 'Adım 1: Kümülatif Dağılım Fonksiyonu F(x) İntegrali (10 Puan)',
          stepTitle_en: 'Step 1: Integrate PDF to find CDF F(x) (10 Points)',
          points: 10,
          explanation:
            'Olasılık yoğunluk fonksiyonunun 0\'dan x\'e integralini al:',
          explanation_en:
            'Integrate PDF from 0 to x:',
          math: 'F(x) = \\int_0^x 0.2 e^{-0.2t} dt = \\left[ -e^{-0.2t} \\right]_0^x = 1 - e^{-0.2x}',
        },
        {
          stepTitle: 'Adım 2: u = F(x) Eşitle ve x\'i Yalnız Bırak (10 Puan)',
          stepTitle_en: 'Step 2: Equate u = F(x) and isolate x (10 Points)',
          points: 10,
          explanation:
            'u = 1 - e^{-0.2x} ⇒ e^{-0.2x} = 1 - u ⇒ -0.2x = ln(1 - u):',
          explanation_en:
            'Algebraically isolate x:',
          math: 'X = -\\frac{1}{0.2} \\ln(1 - U) = -5 \\ln(1 - U)',
        },
        {
          stepTitle: 'Adım 3: Sayıları Yerine Koy (5 Puan)',
          stepTitle_en: 'Step 3: Evaluate given Uniform inputs (5 Points)',
          points: 5,
          explanation:
            'U_1 = 0.35 için X_1 = -5 ln(0.65) = -5 × (-0.4308) = 2.15 dk. U_2 = 0.80 için X_2 = -5 ln(0.20) = -5 × (-1.6094) = 8.05 dk.',
          explanation_en:
            'Evaluate: X_1 = -5 ln(0.65) = 2.15 mins; X_2 = -5 ln(0.20) = 8.05 mins.',
          math: 'X_1 = 2.15 \\text{ dakika}, \\quad X_2 = 8.05 \\text{ dakika}',
        },
      ],
      finalAnswer: 'Cevap: (a) X = -5 ln(1 - U), (b) X_1 = 2.15 dk, X_2 = 8.05 dk. Tam puan: 25/25.',
      finalAnswer_en: 'Answer: (a) X = -5 ln(1 - U), (b) X_1 = 2.15 mins, X_2 = 8.05 mins. Full score: 25/25.',
    },
  },

  indr363: {
    courseCode: 'INDR 363',
    courseTitle: 'Matematiksel Programlama (OR II)',
    courseTitle_en: 'Mathematical Programming (OR II)',
    mentorQuote:
      'Öğrencilerim 95+ alıyor çünkü optimizasyonda formül ezberlemiyorlar. Tamsayılı programlamada en önemli kural: "Asla yuvarlama yapma, mantıksal kısıtları Big-M ile kurgula ve Branch & Bound budama kurallarını ezberle!"',
    mentorQuote_en:
      'My students score 95+ because they never round fractional numbers in Integer Programming. Formulate logic with tight Big-M and memorize the 3 exact Branch & Bound fathoming criteria!',
    mentalModelTitle: '💡 Gözünde Canlandır: Branch & Bound Bir Eleme Ağacıdır',
    mentalModelTitle_en: '💡 Mental Model: Branch & Bound is a Decision Tournament',
    mentalModelText:
      'Tamsayılı bir problemde tüm kombinasyonları denemek milyonlarca yıl sürer. Branch & Bound, çözüme ulaşamayacak veya daha kötü sonuç verecek tüm dalları daha filizlenirken budar (fathom eder). Böylece milyonlarca ihtimal 5 adımda elenir.',
    mentalModelText_en:
      'Enumerating all integer combinations takes millions of years. Branch and Bound prunes (fathoms) unpromising subtrees early when their continuous LP relaxation cannot beat the current incumbent integer champion.',
    blueprint: [
      {
        questionNumber: 'Soru 1',
        topic: 'Big-M Modelleme & Mantıksal Kısıtlar (Either-Or)',
        topic_en: 'Big-M Formulations & Logical Constraints (Either-Or)',
        points: 35,
        expectedQuestionType: 'Fabrika açma/kapama, sabit maliyet (fixed-charge) veya "bu yapılırsa diğeri yapılamaz" kısıtları.',
        expectedQuestionType_en: 'Fixed-charge facility activation and mutual exclusion constraints using binary y.',
        survivalTip: 'x ≤ M y yazarken y=0 ise x=0 olmalı; y ∈ {0, 1} ikili değişken kısıtını yazmayı unutursan 5 puan uçar!',
        survivalTip_en: 'When writing x ≤ M y, always define y ∈ {0, 1} explicitly or lose 5 easy points!',
      },
      {
        questionNumber: 'Soru 2',
        topic: 'Branch and Bound (Dal-Sınır) Çözüm Ağacı',
        topic_en: 'Branch and Bound Tree Execution',
        points: 35,
        expectedQuestionType: 'Kesirli çıkan LP gevşemesinden dallanma ve budama kriterlerini gösterme.',
        expectedQuestionType_en: 'Branching on fractional variable (e.g. x1 ≤ 2, x1 ≥ 3) and applying fathoming.',
        survivalTip: 'Budama 3 şekilde olur: 1) Tam sayı bulunursa, 2) Çözümsüzlük (Infeasible), 3) Sınır mevcut Incumbent\'tan kötüyse.',
        survivalTip_en: 'Fathoming occurs on 3 conditions: 1) Integer solution found, 2) Infeasibility, 3) Bound ≤ Incumbent.',
      },
      {
        questionNumber: 'Soru 3',
        topic: 'Dijkstra / Ağ Modelleri (Max-Flow & CPM)',
        topic_en: 'Network Models (Dijkstra, Max Flow & CPM)',
        points: 30,
        expectedQuestionType: 'En kısa yol tablosu veya Ford-Fulkerson ile maksimum akış kesiti (Min-Cut).',
        expectedQuestionType_en: 'Dijkstra label setting or Ford-Fulkerson Max Flow Min Cut theorem.',
        survivalTip: 'Maksimum akış = Minimum kesit kapasitesi! Hoca ikisini de isterse tek bir hesapla ikisini de cevapla.',
        survivalTip_en: 'Max Flow = Min Cut capacity! The two values must strictly match per the duality theorem.',
      },
    ],
    traps: [
      {
        trapTitle: 'Tuzak 1: Big-M Değerini "Milyon" Olarak Almak',
        trapTitle_en: 'Trap 1: Arbitrarily picking M = 1,000,000',
        whyStudentsFail:
          'Öğrenciler M yerine 1000000 yazar. Bu, çözücülerde sayısal hassasiyet (roundoff error) yaratır ve hocalar "Sıkı M (Tight M) bulunuz" diyerek puan kırar.',
        whyStudentsFail_en:
          'Arbitrary huge M values cause numerical instability and loose LP relaxations; professors penalize for loose bounds.',
        howToSolve:
          'Kısıttaki x değişkeninin alabileceği fiziksel maksimum üst sınırı hesapla (Örn: Kapasite 80 birimse M = 80 al).',
        howToSolve_en:
          'Calculate the actual physical upper bound of the decision variable (e.g. if machine capacity is 80, pick M = 80).',
        goldenRule: 'Altın Kural: M değeri daima x\'in alabileceği en küçük üst sınırdır.',
        goldenRule_en: 'Golden Rule: Pick M as the tightest physical upper bound possible.',
      },
      {
        trapTitle: 'Tuzak 2: Negatif Yay Olan Çizgede Dijkstra Kullanmak',
        trapTitle_en: 'Trap 2: Running Dijkstra on graphs with negative weights',
        whyStudentsFail:
          'Hoca sınavda gizlice bir yaya -2 ağırlığı koyar ve "Dijkstra ile en kısa yolu bulun" der. Öğrenci hemen tablo çizmeye başlar!',
        whyStudentsFail_en:
          'Professor inserts a negative arc weight and asks for shortest path; students naively apply Dijkstra.',
        howToSolve:
          'Dijkstra negatif kenarlarda ÇALIŞMAZ (Greedy mantığı bozulur). Kağıda: "Çizgede negatif kenar olduğundan Dijkstra uygulanamaz, Bellman-Ford veya Dynamic Programming gerekir" yaz.',
        howToSolve_en:
          'Dijkstra fails with negative arc costs. Explicitly state: "Dijkstra is invalid due to negative edge weights; Bellman-Ford required."',
        goldenRule: 'Altın Kural: Negatif maliyet varsa Dijkstra iptal!',
        goldenRule_en: 'Golden Rule: If any arc weight is negative, Dijkstra cannot be used!',
      },
    ],
    formulas: [
      {
        name: 'Big-M Sabit Maliyet Kısıtı',
        name_en: 'Big-M Fixed Charge Activation',
        latex: 'x_i \\le M_i \\cdot y_i, \\quad y_i \\in \\{0, 1\\}, \\quad x_i \\ge 0',
        whenToUse: 'Üretim yapılıyorsa (x > 0) sabit fabrika/makine kurulum maliyetini devreye sokmak için.',
        whenToUse_en: 'To activate a fixed setup cost whenever positive production quantity x > 0 occurs.',
      },
      {
        name: 'Veya Kısıtı (Either-Or Constraints)',
        name_en: 'Either-Or Disjunctive Constraints',
        latex: 'f(x) \\le M y \\quad \\text{ve} \\quad g(x) \\le M(1 - y), \\quad y \\in \\{0, 1\\}',
        whenToUse: 'İki kısıttan en az birinin (veya tam birinin) geçerli olmasını zorunlu kılmak için.',
        whenToUse_en: 'To enforce that at least one of two mutually exclusive constraints must hold.',
      },
    ],
    sampleQuestion: {
      title: 'Vize Sorusu: Big-M ile Sabit Kurulum Maliyetli Üretim Modeli (25 Puan)',
      title_en: 'Midterm Exam: Big-M Fixed Setup Modeling (25 Points)',
      points: 25,
      prompt:
        'Bir şirket A ve B ürünlerini üretecektir. A ürününden birim kâr 40 TL, B ürününden 60 TL\'dir. Eğer A ürünü üretilecekse 500 TL sabit kalıp maliyeti vardır; B ürünü üretilecekse 800 TL sabit kalıp maliyeti vardır. A ürününün maksimum talebi 50 adet, B\'nin maksimum talebi 40 adettir. Toplam hammadde kısıtı: 2A + 3B ≤ 120 kg\'dır. Kârı maksimize eden Tamsayılı Doğrusal Programlama (MILP) modelini kurunuz.',
      prompt_en:
        'Company produces A and B. Unit profit: A = 40 TL, B = 60 TL. Fixed setup cost: A = 500 TL, B = 800 TL. Max demand: A ≤ 50, B ≤ 40. Raw material: 2A + 3B ≤ 120. Formulate the MILP optimization model.',
      steps: [
        {
          stepTitle: 'Adım 1: Karar Değişkenlerini Tanımla (5 Puan)',
          stepTitle_en: 'Step 1: Define Decision Variables (5 Points)',
          points: 5,
          explanation:
            'Üretim miktarları (sürekli/kesikli) ve kalıp açma kararları (ikili/binary):',
          explanation_en:
            'Continuous production quantities and binary setup indicators:',
          math: 'x_A, x_B \\ge 0 \\quad (\\text{Üretim adetleri}), \\quad y_A, y_B \\in \\{0, 1\\} \\quad (\\text{Kalıp kurulum kararları})',
        },
        {
          stepTitle: 'Adım 2: Amaç Fonksiyonunu Yaz (5 Puan)',
          stepTitle_en: 'Step 2: Objective Function (5 Points)',
          points: 5,
          explanation:
            'Toplam Kâr = (Birim Kârlar × Miktarlar) - (Sabit Kurulum Maliyetleri × İkili Kararlar):',
          explanation_en:
            'Total Profit = Gross Profit - Fixed Setup Costs:',
          math: '\\max Z = 40 x_A + 60 x_B - 500 y_A - 800 y_B',
        },
        {
          stepTitle: 'Adım 3: Big-M ile Üretim Kapasite Bağlantısını Kur (10 Puan)',
          stepTitle_en: 'Step 3: Link Production to Setup via Tight Big-M (10 Points)',
          points: 10,
          explanation:
            'A için maksimum talep 50 olduğundan M_A = 50; B için maksimum talep 40 olduğundan M_B = 40 seçilir:',
          explanation_en:
            'Since max demand for A is 50, pick M_A = 50; for B pick M_B = 40:',
          math: 'x_A \\le 50 y_A, \\quad x_B \\le 40 y_B',
        },
        {
          stepTitle: 'Adım 4: Hammadde ve İşaret Kısıtları (5 Puan)',
          stepTitle_en: 'Step 4: Resource and Sign Constraints (5 Points)',
          points: 5,
          explanation:
            'Kaynak kısıtı: 2 x_A + 3 x_B ≤ 120 ve y_A, y_B ∈ {0, 1}, x_A, x_B ≥ 0.',
          explanation_en:
            'Material capacity and domain specifications:',
          math: '2 x_A + 3 x_B \\le 120, \\quad y_A, y_B \\in \\{0, 1\\}, \\quad x_A, x_B \\ge 0',
        },
      ],
      finalAnswer: 'Cevap: Model eksiksiz kuruldu. Sıkı Big-M (50 ve 40) kullanılarak tam puan alındı (25/25).',
      finalAnswer_en: 'Answer: Complete MILP formulated with tight Big-M bounds. Full score: 25/25.',
    },
  },

  indr371: {
    courseCode: 'INDR 371',
    courseTitle: 'Operasyon ve Tesis Tasarımı',
    courseTitle_en: 'Operations and Facilities Design',
    mentorQuote:
      'Tesis tasarımı geometriyle lojistiğin evliliğidir. Sınavda en çok puan kazandıran şey: Manhattan caddelerinde Rectilinear (L1), açık denizde Euclidean (L2) kullanıldığını bilmek ve CRAFT kuralını unutmamaktır!',
    mentorQuote_en:
      'Facilities design is the marriage of geometry and logistics. Score 95+ by knowing when to use Rectilinear (L1) vs Euclidean (L2) and adhering strictly to the CRAFT adjacency rule!',
    mentalModelTitle: '💡 Gözünde Canlandır: Tesis Düzeni Süpermarket Gibidir',
    mentalModelTitle_en: '💡 Mental Model: Facility Layout is a Supermarket',
    mentalModelText:
      'Günde 10.000 ton malzeme alışverişi yapan iki atölyeyi fabrikanın iki zıt ucuna koyarsan forkliftler gün boyu boş yakıt yakar. Ağır ve sık taşınan malzemeyi kapıya en yakın yere koy; aralarındaki trafik yoğun olan bölümleri yan yana yerleştir (REL Şeması A derecesi).',
    mentalModelText_en:
      'If you place two departments exchanging 10,000 tons at opposite ends of the plant, forklifts waste energy driving back and forth. Position heavy, high-velocity items close to docks and keep high-flow departments adjacent (REL rating A).',
    blueprint: [
      {
        questionNumber: 'Soru 1',
        topic: 'Tek Tesis Yeri Seçimi (Rectilinear Medyan & Ağırlık Merkezi)',
        topic_en: 'Single Facility Location (Rectilinear Median & Center of Gravity)',
        points: 35,
        expectedQuestionType: 'Verilen koordinat ve talep ağırlıklarıyla optimum depo lokasyonu hesabı.',
        expectedQuestionType_en: 'Optimal warehouse location using coordinates and demand weights.',
        survivalTip: 'Rectilinear mesafede x ve y koordinatları birbirinden tamamen BAĞIMSIZ çözülür! Kümülatif ağırlık W/2\'yi geçen medyan noktayı seç.',
        survivalTip_en: 'In rectilinear distance, X and Y coordinates decompose independently! Pick median where cumulative weight reaches W/2.',
      },
      {
        questionNumber: 'Soru 2',
        topic: 'Sistematik Yerleşim Planlaması (SLP & REL Şeması)',
        topic_en: 'Systematic Layout Planning (SLP & REL Chart)',
        points: 35,
        expectedQuestionType: 'A-E-I-O-U-X yakınlık derecelerine göre blok yerleşim taslağı çizme.',
        expectedQuestionType_en: 'Constructing block layouts from A-E-I-O-U-X relationship charts.',
        survivalTip: 'X derecesi = "Kesinlikle yan yana gelmemeli" (Örn: Boyahane ile Fırın)! X ilişkisini ihlal edersen soru direkt sıfır alır.',
        survivalTip_en: 'Rating X = "Strictly undesirable" (e.g. Paint shop next to blast furnace)! Violating X yields zero points.',
      },
      {
        questionNumber: 'Soru 3',
        topic: 'Depo Tasarımı, COI Kuralı ve AS/RS Çevrim Süresi',
        topic_en: 'Warehouse Design, COI Rule & AS/RS Cycle Times',
        points: 30,
        expectedQuestionType: 'Cube-Per-Order Index (COI) ile depolama sıralaması ve tekil/çiftil çevrim hesabı.',
        expectedQuestionType_en: 'COI dedicated storage ranking and AS/RS single/dual command cycle calculations.',
        survivalTip: 'COI = Alan Gereksinimi / Sipariş Frekansı = S_i / T_i. En KÜÇÜK COI değerine sahip ürün kapıya en yakın konur!',
        survivalTip_en: 'COI = Storage Space / Throughput Frequency = S_i / T_i. Smallest COI goes closest to the I/O dock!',
      },
    ],
    traps: [
      {
        trapTitle: 'Tuzak 1: Rectilinear Medyan Hesabında Sıralamayı Unutmak',
        trapTitle_en: 'Trap 1: Forgetting to sort coordinates before finding cumulative median',
        whyStudentsFail:
          'Öğrenciler şehirlerin koordinatlarını küçükten büyüğe sıralamadan kümülatif toplam almaya kalkar ve yanlış şehir seçilir.',
        whyStudentsFail_en:
          'Students compute cumulative weights without sorting coordinates in ascending order first.',
        howToSolve:
          '1) X koordinatlarını küçükten büyüğe sırala, ağırlıkları kümülatif topla. Toplamın yarısına (W/2) ilk ulaştığın X* medyanındır. 2) Aynı işlemi bağımsız olarak Y için tekrarla.',
        howToSolve_en:
          '1) Sort X values ascending, accumulate weights until reaching W/2. That coordinate is X*. 2) Repeat independently for Y*.',
        goldenRule: 'Altın Kural: Sırala → Kümülatif Topla → W/2 barajını geçen noktayı kap.',
        goldenRule_en: 'Golden Rule: Sort coordinates → Accumulate weights → Identify the W/2 threshold.',
      },
      {
        trapTitle: 'Tuzak 2: COI Formülünü Ters Çevirmek',
        trapTitle_en: 'Trap 2: Inverting the Cube-Per-Order Index definition',
        whyStudentsFail:
          'Öğrenciler COI\'yı Talep / Alan zanneder. Sonra büyük olanı mı küçük olanı mı öne koyacağını şaşırır.',
        whyStudentsFail_en:
          'Students confuse COI as Throughput/Space instead of Space/Throughput.',
        howToSolve:
          'COI = Space / Throughput (Hacim / Frekans). Birim koli başına en az yer kaplayan ve en sık dönen ürünün COI değeri KÜÇÜK olur. Daima en küçük COI kapıya en yakındır!',
        howToSolve_en:
          'COI = Space / Throughput. Fast moving items with compact footprints have LOW COI. Smallest COI is assigned closest to dock!',
        goldenRule: 'Altın Kural: Küçük COI = VIP Ürün (Giriş kapısına komşu).',
        goldenRule_en: 'Golden Rule: Smallest COI = VIP item placed nearest to I/O station.',
      },
    ],
    formulas: [
      {
        name: 'Ağırlık Merkezi (Center of Gravity)',
        name_en: 'Center of Gravity Formulation',
        latex: '\\bar{X} = \\frac{\\sum w_i x_i}{\\sum w_i}, \\quad \\bar{Y} = \\frac{\\sum w_i y_i}{\\sum w_i}',
        whenToUse: 'Taşıma maliyetinin mesafeyle doğrusal arttığı tekli dağıtım merkezi yer seçiminde.',
        whenToUse_en: 'Continuous facility location minimizing volume-weighted transport distances.',
      },
      {
        name: 'Cube-Per-Order Index (COI)',
        name_en: 'Cube-Per-Order Index Rule',
        latex: '\\text{COI}_i = \\frac{S_i}{T_i} = \\frac{\\text{Gerekli Raf Hacmi}}{\\text{Sipariş/Elleçleme Frekansı}}',
        whenToUse: 'Depoda hangi ürünlerin giriş/çıkış kapılarına daha yakın yerleştirileceğini sıralamak için.',
        whenToUse_en: 'Dedicated storage policy ranking items by ratio of space requirement to throughput.',
      },
    ],
    sampleQuestion: {
      title: 'Final Sorusu: Rectilinear Mesafe ile Medyan Depo Yeri Seçimi (25 Puan)',
      title_en: 'Final Exam: Rectilinear 1-Median Location Problem (25 Points)',
      points: 25,
      prompt:
        '3 fabrika için merkezi bir hammadde deposu kurulacaktır. Fabrika koordinatları ve aylık koli talepleri: F1: (10, 20), w1 = 100 koli; F2: (30, 40), w2 = 200 koli; F3: (50, 10), w3 = 100 koli. Manhattan (Rectilinear) mesafesi varsayımıyla toplam taşıma maliyetini minimize eden optimum depo koordinatlarını (X*, Y*) bulunuz.',
      prompt_en:
        'Locate a central warehouse for 3 plants with rectilinear distance. F1: (10, 20), w1 = 100; F2: (30, 40), w2 = 200; F3: (50, 10), w3 = 100. Find optimal (X*, Y*).',
      steps: [
        {
          stepTitle: 'Adım 1: Toplam Ağırlık W ve Eşik Değeri W/2 (5 Puan)',
          stepTitle_en: 'Step 1: Total Weight and W/2 Threshold (5 Points)',
          points: 5,
          explanation:
            'Toplam ağırlık W = 100 + 200 + 100 = 400 koli. Eşik barajı W / 2 = 200 koli.',
          explanation_en:
            'Total weight W = 400. Median threshold W / 2 = 200.',
          math: 'W = 400, \\quad \\frac{W}{2} = 200',
        },
        {
          stepTitle: 'Adım 2: X Koordinatlarını Sırala ve Kümülatif Topla (10 Puan)',
          stepTitle_en: 'Step 2: Sort X and accumulate weights (10 Points)',
          points: 10,
          explanation:
            'Sıralı X: x=10 (w=100, Kümülatif=100 < 200). x=30 (w=200, Kümülatif=300 ≥ 200). Eşik 200\'e x=30\'da ulaşıldı.',
          explanation_en:
            'Ordered X: x=10 (cum=100 < 200). x=30 (cum=300 ≥ 200). Threshold reached at x=30.',
          math: 'X^* = 30',
        },
        {
          stepTitle: 'Adım 3: Y Koordinatlarını Bağımsız Sırala ve Kümülatif Topla (10 Puan)',
          stepTitle_en: 'Step 3: Sort Y and accumulate weights independently (10 Points)',
          points: 10,
          explanation:
            'Sıralı Y: y=10 (F3, w=100, Küm=100 < 200). y=20 (F1, w=100, Küm=200 ≥ 200!). Eşik 200 tam y=20\'de yakalandı.',
          explanation_en:
            'Ordered Y: y=10 (cum=100). y=20 (cum=200 ≥ 200). Threshold reached at y=20.',
          math: 'Y^* = 20',
        },
      ],
      finalAnswer: 'Cevap: Optimum depo koordinatı (X*, Y*) = (30, 20). Tam puan: 25/25.',
      finalAnswer_en: 'Answer: Optimal warehouse coordinates (X*, Y*) = (30, 20). Full score: 25/25.',
    },
  },

  indr100: {
    courseCode: 'INDR 100',
    courseTitle: 'Endüstri Mühendisliğine Giriş',
    courseTitle_en: 'Introduction to Industrial Engineering',
    mentorQuote:
      'INDR 100 bir genel kültür dersi değil, kariyerinizin temel taşıdır. Newsvendor kritik oranını ve CPM ileri/geri geçiş kurallarını mantığıyla kavrayan bir öğrenci vizeden 95 altı alamaz!',
    mentorQuote_en:
      'INDR 100 is the bedrock of your engineering career. Grasp the Newsvendor critical fractile intuition and CPM forward/backward pass logic, and a 95+ is guaranteed!',
    mentalModelTitle: '💡 Gözünde Canlandır: Newsvendor Simitçi Probleminden İbarettir',
    mentalModelTitle_en: '💡 Mental Model: The Newsvendor is Just a Bread Vendor',
    mentalModelText:
      'Tanesi 10 TL olan simidi 30 TL\'ye satıyorsun. Satarsan 20 TL kazanırsın (Cu = 20). Satamazsan akşam bayat simitçiye 2 TL\'ye veriyorsun (Co = 10 - 2 = 8 TL zarar). Burada kazanacağın para (20 TL), kaybedeceğin paradan (8 TL) çok daha büyük olduğu için fazladan simit getirmek mantıklıdır! İşte Kritik Oran tam olarak bu kâr-zarar dengesini z-skoruna çevirir.',
    mentalModelText_en:
      'You buy bread for 10 TL and sell for 30 TL. If you stock out, you lose 20 TL unrealized profit (Cu = 20). If you have leftover, you sell stale bread for 2 TL (Co = 10 - 2 = 8 TL loss). Since missing a sale hurts 2.5 times more than leftover waste, you should lean toward overstocking. The Critical Ratio translates this economic ratio directly into normal z-scores.',
    blueprint: [
      {
        questionNumber: 'Soru 1',
        topic: 'Newsvendor Stok Modeli & Güvenlik Stoğu',
        topic_en: 'Newsvendor Inventory & Safety Stock',
        points: 35,
        expectedQuestionType: 'Fiyat, maliyet, hurda değer ve normal dağılımlı talep ile optimum Q* hesabı.',
        expectedQuestionType_en: 'Optimal Q* with price, cost, salvage, and normal demand distribution.',
        survivalTip: 'CR = Cu / (Cu + Co). Cu paydadır! Paydaya Cu + Co yazmayı unutanlar her sınavda en az 10 puan kaybeder.',
        survivalTip_en: 'CR = Cu / (Cu + Co). Always Cu in numerator, sum Cu + Co in denominator!',
      },
      {
        questionNumber: 'Soru 2',
        topic: 'Proje Yönetimi (CPM / PERT Kritik Yol Analizi)',
        topic_en: 'Project Management (CPM/PERT Critical Path Method)',
        points: 35,
        expectedQuestionType: 'Ağ çizimi, Erken Başlangıç (ES), Erken Bitiş (EF), Geç Başlangıç (LS), Bolluk (Slack).',
        expectedQuestionType_en: 'Network diagram, Early Start, Early Finish, Late Start, Late Finish, and Total Slack.',
        survivalTip: 'İleri geçişte birden çok öncül varsa en BÜYÜĞÜNÜ al; Geri geçişte birden çok ardıl varsa en KÜÇÜĞÜNÜ al!',
        survivalTip_en: 'Forward pass: take MAXIMUM of predecessors; Backward pass: take MINIMUM of successors!',
      },
      {
        questionNumber: 'Soru 3',
        topic: 'Hat Dengeleme & Çevrim Süresi (Cycle Time)',
        topic_en: 'Assembly Line Balancing & Minimum Workstations',
        points: 30,
        expectedQuestionType: 'Çevrim süresi C hesabı, teorik minimum istasyon sayısı N_min ve hat verimliliği.',
        expectedQuestionType_en: 'Cycle time C, theoretical minimum stations N_min, and line balancing efficiency.',
        survivalTip: 'N_min = Σt_i / C formülünde sonucu daima bir ÜST tamsayıya yuvarla (Örn: 3.1 çıkarsa 4 istasyon)!',
        survivalTip_en: 'In N_min = Σt_i / C, ALWAYS round fractional values UP to next integer (e.g. 3.1 rounds to 4)!',
      },
    ],
    traps: [
      {
        trapTitle: 'Tuzak 1: Cu ve Co Maliyetlerini Birbirine Karıştırmak',
        trapTitle_en: 'Trap 1: Reversing Underage (Cu) and Overage (Co) definitions',
        whyStudentsFail:
          'Öğrenciler Cu\'yu maliyet sanır ve Co\'yu kâr sanır. Formül tersine döner ve talep 1000 iken sipariş 400 adet çıkar!',
        whyStudentsFail_en:
          'Students confuse Cu as cost and Co as profit, completely inverting the stocking recommendation.',
        howToSolve:
          'Cu = Underage (Eksik kalmanın acısı) = Satış Fiyatı - Maliyet = Kaçan Kâr. Co = Overage (Fazla malın acısı) = Maliyet - Hurda Fiyatı = Elde Kalanın Zararı.',
        howToSolve_en:
          'Cu = Underage (pain of understocking) = Price - Cost. Co = Overage (pain of leftover) = Cost - Salvage.',
        goldenRule: 'Altın Kural: Cu = Kaçan Kâr (P - C), Co = Çöpe Giden Para (C - S).',
        goldenRule_en: 'Golden Rule: Cu = Opportunity Loss (P - C), Co = Direct Loss (C - S).',
      },
      {
        trapTitle: 'Tuzak 2: CPM Geri Geçişinde (Backward Pass) Hata Yapmak',
        trapTitle_en: 'Trap 2: Backward Pass minimum selection error in CPM',
        whyStudentsFail:
          'İleri geçişte en büyüğü almaya alışan öğrenci, geri dönerken de yanlışlıkla büyük olanı seçer ve tüm bolluklar (slack) çöker.',
        whyStudentsFail_en:
          'Conditioned to pick max in forward pass, students pick max during backward pass too, destroying slack calculation.',
        howToSolve:
          'İleri giderken = Max. Geri gelirken = Min. Kritik yoldaki aktivitelerin Bolluğu (Slack) daima SIFIRDIR.',
        howToSolve_en:
          'Forward = Max. Backward = Min. Critical path activities strictly have Total Slack = 0.',
        goldenRule: 'Altın Kural: Geri dönüşte en küçük sayıyı seç, kritik yolda Bolluk = 0 olmak zorundadır.',
        goldenRule_en: 'Golden Rule: Pick min on backward pass, verify Slack = 0 on critical path.',
      },
    ],
    formulas: [
      {
        name: 'Newsvendor Kritik Oran (Critical Fractile)',
        name_en: 'Critical Fractile Formula',
        latex: 'CR = \\frac{C_u}{C_u + C_o} = \\Phi(z^*), \\quad Q^* = \\mu + z^* \\sigma',
        whenToUse: 'Bozulabilir veya tek dönemlik stoklarda kârı maksimize eden optimum sipariş miktarını bulmak için.',
        whenToUse_en: 'Single-period stochastic inventory optimization balancing underage and overage risks.',
      },
      {
        name: 'Hat Dengeleme Çevrim Süresi (Cycle Time)',
        name_en: 'Line Balancing Cycle Time',
        latex: 'C = \\frac{\\text{Net Çalışma Süresi}}{\\text{İstenen Üretim Adedi}}, \\quad N_{\\min} = \\left\\lceil \\frac{\\sum t_i}{C} \\right\\rceil',
        whenToUse: 'Montaj hattında bir istasyondan diğerine ürün aktarım hızını ve minimum istasyon sayısını belirlemek için.',
        whenToUse_en: 'Assembly line pace definition and theoretical minimum station requirement.',
      },
    ],
    sampleQuestion: {
      title: 'Vize Sorusu: Newsvendor ile Optimum Sipariş Miktarı ve Güvenlik Stoğu (25 Puan)',
      title_en: 'Midterm Exam: Newsvendor Optimal Order Quantity (25 Points)',
      points: 25,
      prompt:
        'Koç Üniversitesi Kitabevi, güz dönemi için INDR 100 ders kitabı siparişi verecektir. Kitabın satış fiyatı P = 120 TL, üniversiteye alış maliyeti C = 70 TL\'dir. Dönem sonunda satılamayan kitaplar yayınevine hurda bedeli olarak S = 20 TL\'ye iade edilecektir. Kitaba olan talep ortalaması μ = 500 adet, standart sapması σ = 80 adet olan normal dağılıma uymaktadır. (a) Kritik oranı (CR) hesaplayınız. (b) Kitabevinin vermesi gereken optimum sipariş adedi Q* kaçtır?',
      prompt_en:
        'Bookstore orders textbooks. Price P = 120 TL, cost C = 70 TL, salvage S = 20 TL. Normal demand with mean 500 and std dev 80. (a) Compute Critical Ratio (CR). (b) Find optimal order quantity Q*.',
      steps: [
        {
          stepTitle: 'Adım 1: Cu ve Co Maliyetlerini Belirle (5 Puan)',
          stepTitle_en: 'Step 1: Calculate Cu and Co (5 Points)',
          points: 5,
          explanation:
            'Eksik stoklama maliyeti Cu = 120 - 70 = 50 TL. Fazla stoklama maliyeti Co = 70 - 20 = 50 TL.',
          explanation_en:
            'Underage Cu = 120 - 70 = 50 TL. Overage Co = 70 - 20 = 50 TL.',
          math: 'C_u = 50 \\text{ TL}, \\quad C_o = 50 \\text{ TL}',
        },
        {
          stepTitle: 'Adım 2: Kritik Oran CR Hesabı (5 Puan)',
          stepTitle_en: 'Step 2: Calculate Critical Ratio (5 Points)',
          points: 5,
          explanation:
            'CR = 50 / (50 + 50) = 50 / 100 = 0.50 (%50).',
          explanation_en:
            'CR = 50 / (50 + 50) = 0.50 (50%).',
          math: 'CR = \\frac{C_u}{C_u + C_o} = \\frac{50}{100} = 0.50',
        },
        {
          stepTitle: 'Adım 3: Normal Tablodan z-skorunu Bul (5 Puan)',
          stepTitle_en: 'Step 3: Lookup standard normal z-score (5 Points)',
          points: 5,
          explanation:
            'Φ(z) = 0.50 için simetriden dolayı standart normal z-skoru tam olarak 0\'dır:',
          explanation_en:
            'For Φ(z) = 0.50, standard normal quantile is exactly z = 0:',
          math: 'z^* = 0.00',
        },
        {
          stepTitle: 'Adım 4: Optimum Q* Hesabı (10 Puan)',
          stepTitle_en: 'Step 4: Compute Q* (10 Points)',
          points: 10,
          explanation:
            'Q* = μ + z* × σ = 500 + 0 × 80 = 500 adet. (Cu = Co olduğunda emniyet stoğu 0 olur ve sipariş tam ortalama talebe eşitlenir).',
          explanation_en:
            'Q* = 500 + 0 × 80 = 500 units. When Cu = Co, safety stock is 0 and order quantity equals mean demand.',
          math: 'Q^* = 500 \\text{ adet}',
        },
      ],
      finalAnswer: 'Cevap: (a) CR = 0.50 (%50), (b) Q* = 500 adet. Tam puan: 25/25.',
      finalAnswer_en: 'Answer: (a) CR = 0.50, (b) Q* = 500 units. Full score: 25/25.',
    },
  },
};
