const fs = require('fs');

// --- MODULE 2 ---
const m2 = JSON.parse(fs.readFileSync('src/data/module2.json', 'utf8'));
m2.lessons = [
  {
    id: "m2-l0",
    moduleId: "module-2",
    order: 1,
    difficulty: "basit",
    isOrientation: true,
    title: {
      tr: "Ders Tanıtımı & Yol Haritası",
      en: "Course Overview & Roadmap"
    },
    conceptCard: {
      tr: "Mühendisler İçin Olasılık ve Rastgele Değişkenler dersinde öğreneceğin tüm modüller, konular ve başarı yol haritası.",
      en: "Comprehensive learning roadmap and modules for Probability & Random Variables."
    },
    companyExample: {
      tr: "Fintech fraud analizinden Monte Carlo ve yapay zeka olasılık modellerine kadar endüstriyel rehber.",
      en: "Industrial guide from fintech fraud analytics to Monte Carlo and AI probabilistic models."
    },
    tancoSpeech: {
      tr: "Selam, ben Tanco! 🎲 Bu ders boyunca Olasılık ve Rastgele Değişkenler dersinin en temellerinden olan Örneklem Uzayı, Olaylar ve Olasılık Aksiyomları bilgilerinden başlayıp; Koşullu Olasılık & Bayes Teoremi, Kesikli ve Sürekli Dağılımlar, Beklenen Değer, Varyans ve Hata Yayılımı konularını adım adım öğreneceğiz!",
      en: "Hi, I'm Tanco! 🎲 Throughout this course, we will start from the core fundamentals of Probability—Sample Space, Events, and Axioms—and advance through Conditional Probability, Bayes' Rule, Discrete/Continuous Distributions, Expected Value, Variance, and Error Propagation!"
    },
    roadmapModules: [
      {
        order: 1,
        title: { tr: "Olasılık Temelleri & Olay Cebiri", en: "Probability Fundamentals & Events" },
        summary: { tr: "Örneklem Uzayı, Aksiyomlar, Koşullu Olasılık ve Bayes Teoremi", en: "Sample Space, Axioms, Conditional Probability and Bayes' Theorem" }
      },
      {
        order: 2,
        title: { tr: "Kesikli ve Sürekli Dağılımlar", en: "Discrete and Continuous Distributions" },
        summary: { tr: "PMF, PDF, CDF, Binom, Poisson ve Normal Dağılım", en: "PMF, PDF, CDF, Binomial, Poisson and Normal Distributions" }
      },
      {
        order: 3,
        title: { tr: "Birleşik Dağılımlar & CLT", en: "Joint Distributions & Central Limit Theorem" },
        summary: { tr: "Kovaryans, Doğrusal Kombinasyonlar, Hata Yayılımı ve CLT", en: "Covariance, Linear Combinations, Error Propagation and CLT" }
      }
    ],
    vocabTerms: [
      {
        term_en: "sample space",
        explanation_tr: "Bir deneyin tüm olası sonuçlarının kümesi ($S$).",
        explanation_en: "The set of all possible outcomes of an experiment ($S$).",
        exampleSentence_en: "The sample space of flipping a coin is {Heads, Tails}."
      }
    ],
    questions: [
      {
        id: "m2-l0-q1",
        type: "multiple_choice",
        prompt: {
          tr: "Bir madeni para 2 kez atıldığında örneklem uzayının eleman sayısı $|S|$ kaçtır?",
          en: "What is the size of the sample space $|S|$ when flipping a coin twice?"
        },
        options: [
          { tr: "4: {YY, YT, TY, TT}", en: "4: {HH, HT, TH, TT}" },
          { tr: "2: {Y, T}", en: "2: {H, T}" }
        ],
        correctAnswer: "4: {YY, YT, TY, TT}",
        explanation: {
          tr: "Her atışta 2 olası sonuç vardır: $2 \\times 2 = 4$.",
          en: "Each toss has 2 outcomes: $2 \\times 2 = 4$."
        }
      }
    ]
  },
  {
    id: "m2-l1",
    moduleId: "module-2",
    order: 2,
    difficulty: "basit",
    title: {
      tr: "Örneklem Uzayı & Olaylar Cebiri",
      en: "Sample Space & Algebra of Events"
    },
    conceptCard: {
      tr: "Bir rassal deneyin tüm olası sonuçlarının kümesine Örneklem Uzayı ($S$), bu kümenin herhangi bir alt kümesine ise Olay ($A \\subseteq S$) denir. İki olayın birleşimi $A \\cup B$, kesişimi $A \\cap B$ ve $A$'nın tümleyeni $A'$ (veya $A^c$) ile gösterilir. $A \\cap B = \\emptyset$ ise bu olaylara Ayrık (Mutually Exclusive) olaylar denir.",
      en: "The set of all possible outcomes is the Sample Space ($S$), and any subset is an Event ($A \\subseteq S$). Union is $A \\cup B$, intersection is $A \\cap B$, and complement is $A^c$. If $A \\cap B = \\emptyset$, the events are Mutually Exclusive."
    },
    companyExample: {
      tr: "FraudShield güvenlik motoru, gelen bir web isteğini 'mobil/masaüstü' ve 'yurt içi/yurt dışı' şeklinde 4 temel sonuçtan oluşan bir örneklem uzayında ($S$) modeller. Şüpheli IP olay kümesi $A$, yurt dışı olay kümesi $B$ ise $A \\cap B$ her iki riski birden barındıran kritik işlemleri temsil eder.",
      en: "FraudShield security engine models incoming requests in a 4-outcome sample space ($S$): mobile/desktop and domestic/foreign. High-risk IP is set $A$, foreign is $B$, and $A \\cap B$ represents high-risk foreign requests."
    },
    interactiveType: "venn_diagram",
    vocabTerms: [
      {
        term_en: "mutually exclusive",
        explanation_tr: "Aynı anda gerçekleşmesi imkansız olan, kesişimleri boş küme olan ayrık olaylar.",
        explanation_en: "Events that cannot happen simultaneously ($A \\cap B = \\emptyset$).",
        exampleSentence_en: "Being under 18 and over 65 are mutually exclusive categories."
      }
    ],
    questions: [
      {
        id: "m2-l1-q1",
        type: "multiple_choice",
        prompt: {
          tr: "$A$ ve $B$ ayrık (mutually exclusive) iki olay ise $P(A \\cap B)$ kaçtır?",
          en: "If $A$ and $B$ are mutually exclusive events, what is $P(A \\cap B)$?"
        },
        options: [
          { tr: "0", en: "0" },
          { tr: "1", en: "1" },
          { tr: "P(A) * P(B)", en: "P(A) * P(B)" }
        ],
        correctAnswer: "0",
        explanation: {
          tr: "Ayrık olaylar aynı anda gerçekleşemez, bu nedenle kesişimleri boş kümedir ve olasılığı 0'dır.",
          en: "Mutually exclusive events cannot occur simultaneously, so their intersection has probability 0."
        }
      }
    ]
  },
  {
    id: "m2-l2",
    moduleId: "module-2",
    order: 3,
    difficulty: "orta",
    title: {
      tr: "Olasılık Aksiyomları & Toplam Kuralı",
      en: "Probability Axioms & Addition Rule"
    },
    conceptCard: {
      tr: "Kolmogorov Olasılık Aksiyomları:\n1. Her olay $A$ için $0 \\le P(A) \\le 1$.\n2. Örneklem uzayı için $P(S) = 1$.\n3. Ayrık olaylar için $P(A \\cup B) = P(A) + P(B)$.\n\nGenel Toplam Kuralı (Ayrık olmayan durumlar için):\n$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$\n$$P(A^c) = 1 - P(A)$$",
      en: "Kolmogorov Axioms: 1. $0 \\le P(A) \\le 1$, 2. $P(S) = 1$, 3. For disjoint events $P(A \\cup B) = P(A) + P(B)$. General Addition Rule: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$."
    },
    companyExample: {
      tr: "FraudShield'da bir kullanıcının VPN kullanma olasılığı $P(A) = 0.20$, şüpheli kart denemesi olasılığı $P(B) = 0.15$, her ikisini birden yapma olasılığı $P(A \\cap B) = 0.05$'tir. Kullanıcının en az bir riskli davranış sergileme olasılığı $P(A \\cup B) = 0.20 + 0.15 - 0.05 = 0.30$ (%30) olur.",
      en: "In FraudShield, VPN usage $P(A) = 0.20$, suspicious card trial $P(B) = 0.15$, both $P(A \\cap B) = 0.05$. The probability of displaying at least one risk factor is $P(A \\cup B) = 0.20 + 0.15 - 0.05 = 0.30$ (30%)."
    },
    interactiveType: "venn_diagram",
    vocabTerms: [
      {
        term_en: "addition rule",
        explanation_tr: "İki olayın birleşiminin olasılığını hesaplayan kural ($P(A)+P(B)-P(A \\cap B)$).",
        explanation_en: "Rule for computing the probability of union of events.",
        exampleSentence_en: "Use the addition rule when events can co-occur."
      }
    ],
    questions: [
      {
        id: "m2-l2-q1",
        type: "numeric",
        prompt: {
          tr: "$P(A) = 0.4$, $P(B) = 0.5$ ve $P(A \\cap B) = 0.2$ ise $P(A \\cup B)$ kaçtır?",
          en: "If $P(A) = 0.4$, $P(B) = 0.5$, and $P(A \\cap B) = 0.2$, what is $P(A \\cup B)$?"
        },
        correctAnswer: 0.7,
        explanation: {
          tr: "$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = 0.4 + 0.5 - 0.2 = 0.7$$",
          en: "$$P(A \\cup B) = 0.4 + 0.5 - 0.2 = 0.7$$"
        }
      }
    ]
  },
  {
    id: "m2-l3",
    moduleId: "module-2",
    order: 4,
    difficulty: "orta-ustu",
    title: {
      tr: "Koşullu Olasılık & Çarpım Kuralı",
      en: "Conditional Probability & Multiplication Rule"
    },
    conceptCard: {
      tr: "$B$ olayının gerçekleştiği bilindiğinde $A$ olayının gerçekleşme olasılığına Koşullu Olasılık denir ($P(B) > 0$):\n\n$$P(A|B) = \\frac{P(A \\cap B)}{P(B)}$$\n\nBuradan Genel Çarpım Kuralı elde edilir:\n$$P(A \\cap B) = P(B) \\cdot P(A|B) = P(A) \\cdot P(B|A)$$\nÇoklu olaylar için Çarpım Zinciri (Chain Rule):\n$$P(A_1 \\cap A_2 \\cap A_3) = P(A_1) \\cdot P(A_2|A_1) \\cdot P(A_3|A_1 \\cap A_2)$$",
      en: "Conditional probability given $B$ has occurred: $P(A|B) = \\frac{P(A \\cap B)}{P(B)}$. Multiplication rule: $P(A \\cap B) = P(B) \\cdot P(A|B)$."
    },
    companyExample: {
      tr: "FraudShield verilerine göre yurt dışından gelen işlemlerin genel oranı $P(B) = 0.10$, hem yurt dışı hem sahte işlem oranı $P(A \\cap B) = 0.04$'tür. Bir işlemin yurt dışından geldiği bilindiğinde sahte (fraud) olma olasılığı $P(A|B) = 0.04 / 0.10 = 0.40$ (%40) olarak güncellenir.",
      en: "According to FraudShield, foreign transactions account for $P(B) = 0.10$, and foreign fraud is $P(A \\cap B) = 0.04$. Given that a transaction is foreign, its fraud probability is $P(A|B) = 0.04 / 0.10 = 0.40$ (40%)."
    },
    interactiveType: "conditional_prob_tree",
    vocabTerms: [
      {
        term_en: "conditional probability",
        explanation_tr: "Bir olayın başka bir bilginin ışığında güncellenmiş gerçekleşme olasılığı.",
        explanation_en: "Probability of an event given that another event has occurred.",
        exampleSentence_en: "Conditional probability is the foundation of Bayesian reasoning."
      }
    ],
    questions: [
      {
        id: "m2-l3-q1",
        type: "numeric",
        prompt: {
          tr: "$P(B) = 0.25$ ve $P(A \\cap B) = 0.10$ ise $P(A|B)$ koşullu olasılığı kaçtır?",
          en: "If $P(B) = 0.25$ and $P(A \\cap B) = 0.10$, what is $P(A|B)$?"
        },
        correctAnswer: 0.4,
        explanation: {
          tr: "$$P(A|B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{0.10}{0.25} = 0.40$$",
          en: "$$P(A|B) = \\frac{0.10}{0.25} = 0.40$$"
        }
      }
    ]
  },
  {
    id: "m2-l4",
    moduleId: "module-2",
    order: 5,
    difficulty: "orta",
    title: {
      tr: "Bağımsız Olaylar (Independence)",
      en: "Independent Events"
    },
    conceptCard: {
      tr: "İki olay $A$ ve $B$ için, birinin gerçekleşmesi diğerinin olasılığını etkilemiyorsa bu olaylar Bağımsızdır (Independent):\n\n$$P(A|B) = P(A) \\iff P(B|A) = P(B) \\iff P(A \\cap B) = P(A) \\cdot P(B)$$\n\n> **Dikkat**: Ayrık olaylar ($A \\cap B = \\emptyset$) ile Bağımsız olaylar ($P(A \\cap B) = P(A)P(B)$) tamamen farklı kavramlardır! $P(A) > 0, P(B) > 0$ ise ayrık olaylar asla bağımsız olamaz.",
      en: "Two events are independent if $P(A|B) = P(A)$, which is equivalent to $P(A \\cap B) = P(A)P(B)$. Disjoint events with non-zero probabilities can never be independent."
    },
    companyExample: {
      tr: "FraudShield sunucu kümesinde iki bağımsız sunucu çalışmaktadır. Sunucu 1'in çökme olasılığı $P(S_1) = 0.01$, Sunucu 2'nin çökme olasılığı $P(S_2) = 0.02$'dir. İki sunucu bağımsız olduğundan her ikisinin aynı anda çökme olasılığı $P(S_1 \\cap S_2) = 0.01 \\times 0.02 = 0.0002$ (on binde iki)'dir.",
      en: "In FraudShield's infrastructure, Server 1 failure rate is $P(S_1) = 0.01$, Server 2 is $P(S_2) = 0.02$. Since failures are independent, the joint failure probability is $P(S_1 \\cap S_2) = 0.01 \\times 0.02 = 0.0002$."
    },
    interactiveType: "venn_diagram",
    vocabTerms: [
      {
        term_en: "statistical independence",
        explanation_tr: "Bir olayın gerçekleşmesinin diğer olayın olasılığına etki etmemesi durumu.",
        explanation_en: "Condition where the occurrence of one event does not affect the probability of another.",
        exampleSentence_en: "Independent coin tosses have no memory."
      }
    ],
    questions: [
      {
        id: "m2-l4-q1",
        type: "numeric",
        prompt: {
          tr: "$A$ ve $B$ bağımsız olaylar olup $P(A) = 0.3$ ve $P(B) = 0.4$ ise $P(A \\cap B)$ kaçtır?",
          en: "If $A$ and $B$ are independent with $P(A) = 0.3$ and $P(B) = 0.4$, what is $P(A \\cap B)$?"
        },
        correctAnswer: 0.12,
        explanation: {
          tr: "Bağımsız olaylar için $P(A \\cap B) = P(A) \\cdot P(B) = 0.3 \\times 0.4 = 0.12$.",
          en: "For independent events, $P(A \\cap B) = P(A) \\cdot P(B) = 0.3 \\times 0.4 = 0.12$."
        }
      }
    ]
  },
  {
    id: "m2-l5",
    moduleId: "module-2",
    order: 6,
    difficulty: "ileri",
    title: {
      tr: "Toplam Olasılık Yasası & Bayes Teoremi",
      en: "Law of Total Probability & Bayes' Rule"
    },
    conceptCard: {
      tr: "Örneklem uzayı $B_1, B_2, \\dots, B_k$ şeklinde ayrık parçalara bölünmüşse (partition), herhangi bir $A$ olayının Toplam Olasılığı:\n$$P(A) = \\sum_{i=1}^k P(A|B_i) \\cdot P(B_i)$$\n\nBayes Teoremi (Sonsal / Posterior Olasılık):\n$$P(B_j|A) = \\frac{P(A|B_j) \\cdot P(B_j)}{P(A)} = \\frac{P(A|B_j) \\cdot P(B_j)}{\\sum_{i=1}^k P(A|B_i) \\cdot P(B_i)}$$",
      en: "Law of Total Probability: $P(A) = \\sum P(A|B_i)P(B_i)$. Bayes' Rule updates prior beliefs to posterior probabilities: $P(B_j|A) = \\frac{P(A|B_j)P(B_j)}{\\sum P(A|B_i)P(B_i)}$."
    },
    companyExample: {
      tr: "FraudShield'da popülasyonda fraud oranı $P(F) = 0.01$'dir. Algoritmanın alarm verme hassasiyeti $P(\\text{Alarm}|F) = 0.90$, sahte alarm oranı $P(\\text{Alarm}|F') = 0.05$'tir. Alarm çalan bir işlemin gerçekten fraud olma olasılığı Bayes Teoremi ile hesaplanır: $P(F|\\text{Alarm}) = \\frac{0.90 \\times 0.01}{(0.90 \\times 0.01) + (0.05 \\times 0.99)} = \\frac{0.009}{0.009 + 0.0495} \\approx 0.1538$ (%15.4).",
      en: "Fraud prevalence is $P(F) = 0.01$. Alert sensitivity is $P(\\text{Alert}|F) = 0.90$, false alarm rate $P(\\text{Alert}|F') = 0.05$. Given an alert, the true fraud probability is $P(F|\\text{Alert}) = \\frac{0.009}{0.009 + 0.0495} \\approx 15.4\\%$."
    },
    interactiveType: "bayes_calculator",
    vocabTerms: [
      {
        term_en: "posterior probability",
        explanation_tr: "Yeni kanıtlar elde edildikten sonra güncellenen nihai olasılık ($P(H|E)$).",
        explanation_en: "The updated probability of hypothesis after observing evidence.",
        exampleSentence_en: "Bayes' rule computes the posterior probability."
      }
    ],
    questions: [
      {
        id: "m2-l5-q1",
        type: "multiple_choice",
        prompt: {
          tr: "Bayes Teoremi'nde $P(A|B)$'yi hesaplamak için paydada kullanılan toplam olasılık açılımı hangi yasaya dayanır?",
          en: "Which law is used in the denominator of Bayes' Rule to compute $P(B)$?"
        },
        options: [
          { tr: "Toplam Olasılık Yasası (Law of Total Probability)", en: "Law of Total Probability" },
          { tr: "Merkezi Limit Teoremi", en: "Central Limit Theorem" },
          { tr: "Büyük Sayılar Yasası", en: "Law of Large Numbers" }
        ],
        correctAnswer: "Toplam Olasılık Yasası (Law of Total Probability)",
        explanation: {
          tr: "Paydadaki $P(B) = \\sum P(B|A_i)P(A_i)$ ifadesi Toplam Olasılık Yasasıdır.",
          en: "The denominator $P(B) = \\sum P(B|A_i)P(A_i)$ is the Law of Total Probability."
        }
      }
    ]
  }
];
fs.writeFileSync('src/data/module2.json', JSON.stringify(m2, null, 2), 'utf8');
console.log('Module 2 successfully updated (6 atomic lessons).');

// --- MODULE 3 ---
const m3 = JSON.parse(fs.readFileSync('src/data/module3.json', 'utf8'));
m3.lessons = [
  {
    id: "m3-l1",
    moduleId: "module-3",
    order: 1,
    difficulty: "basit",
    title: {
      tr: "Kesikli Rastgele Değişkenler, PMF ve CDF",
      en: "Discrete Random Variables, PMF & CDF"
    },
    conceptCard: {
      tr: "Kesikli bir rastgele değişken $X$, sayılabilir sayıda değer alabilir. Olasılık Kütle Fonksiyonu (PMF) $p(x) = P(X = x)$ her değerin olasılığını verir ($p(x) \\ge 0$ ve $\\sum p(x) = 1$). Kümülatif Dağılım Fonksiyonu (CDF) ise $F(x) = P(X \\le x) = \\sum_{t \\le x} p(t)$ şeklinde tanımlanır.",
      en: "A discrete random variable $X$ takes countable values. PMF $p(x) = P(X=x)$ gives point probabilities ($\\sum p(x) = 1$). Cumulative distribution function is $F(x) = P(X \\le x)$."
    },
    companyExample: {
      tr: "Fintech ödeme terminalinde başarısız işlem deneme sayısı $X \\in \\{0, 1, 2, 3\\}$ bir kesikli değişkendir. $P(X=0)=0.80, P(X=1)=0.15, P(X=2)=0.04, P(X=3)=0.01$ PMF dağılımıdır. En fazla 1 hata alma olasılığı CDF'ten $F(1) = P(X \\le 1) = 0.80 + 0.15 = 0.95$ olur.",
      en: "On a payment terminal, failed attempts $X \\in \\{0,1,2,3\\}$ is a discrete RV. PMF is $p(0)=0.80, p(1)=0.15, p(2)=0.04, p(3)=0.01$. The CDF for at most 1 failure is $F(1) = 0.95$."
    },
    interactiveType: "pmf_visualizer",
    vocabTerms: [
      {
        term_en: "probability mass function (PMF)",
        explanation_tr: "Kesikli rastgele değişkenin her tekil noktadaki olasılığını gösteren fonksiyon.",
        explanation_en: "Function giving the probability that a discrete RV equals a specific value.",
        exampleSentence_en: "The sum of all PMF values equals 1."
      }
    ],
    questions: [
      {
        id: "m3-l1-q1",
        type: "numeric",
        prompt: {
          tr: "Bir PMF için $P(X=1)=0.3$, $P(X=2)=0.5$ ve $P(X=3)=k$ ise $k$ değeri kaçtır?",
          en: "If a PMF has $P(X=1)=0.3$, $P(X=2)=0.5$, and $P(X=3)=k$, what is $k$?"
        },
        correctAnswer: 0.2,
        explanation: {
          tr: "Tüm PMF değerleri toplamı 1 olmalıdır: $1 - (0.3 + 0.5) = 0.2$.",
          en: "Total PMF sum must equal 1: $1 - (0.3 + 0.5) = 0.2$."
        }
      }
    ]
  },
  {
    id: "m3-l2",
    moduleId: "module-3",
    order: 2,
    difficulty: "orta",
    title: {
      tr: "Beklenen Değer ($E[X]$) ve Varyans ($Var(X)$)",
      en: "Expected Value ($E[X]$) & Variance ($Var(X)$)"
    },
    conceptCard: {
      tr: "Kesikli bir değişken $X$ için Beklenen Değer (Ağırlıklı Ortalama):\n$$\\mathbb{E}[X] = \\mu = \\sum x \\cdot p(x)$$\nBeklenen Değerin Doğrusallığı: $\\mathbb{E}[aX + b] = a\\mathbb{E}[X] + b$.\n\nVaryans (Ortalama sapmanın karesi):\n$$\\text{Var}(X) = \\sigma^2 = \\mathbb{E}[(X - \\mu)^2] = \\mathbb{E}[X^2] - (\\mathbb{E}[X])^2$$\nÖzellik: $\\text{Var}(aX + b) = a^2 \\text{Var}(X)$.",
      en: "Expected Value: $\\mathbb{E}[X] = \\sum x p(x)$. Linearity: $\\mathbb{E}[aX+b] = a\\mathbb{E}[X]+b$. Variance: $\\text{Var}(X) = \\mathbb{E}[X^2] - (\\mathbb{E}[X])^2$, with $\\text{Var}(aX+b) = a^2\\text{Var}(X)$."
    },
    companyExample: {
      tr: "Bir sunucu kiralama sözleşmesinde aylık kesinti süresi $X$ (saat) ve olasılıkları: $P(X=0)=0.7, P(X=2)=0.2, P(X=5)=0.1$. Beklenen kesinti $\\mathbb{E}[X] = 0(0.7) + 2(0.2) + 5(0.1) = 0.9$ saat. Ceza maliyeti $Y = 100X + 50$ ise beklenen maliyet $\\mathbb{E}[Y] = 100(0.9) + 50 = 140$ TL'dir.",
      en: "Server downtime $X$ (hours) has $p(0)=0.7, p(2)=0.2, p(5)=0.1$. Expected downtime is $\\mathbb{E}[X] = 0.9$ hr. Penalty cost $Y = 100X + 50$ gives $\\mathbb{E}[Y] = $140."
    },
    interactiveType: "expected_value_calc",
    vocabTerms: [
      {
        term_en: "expected value",
        explanation_tr: "Bir rastgele değişkenin uzun vadedeki ağırlıklı ortalaması ($\\\\mu$).",
        explanation_en: "The long-run weighted average of a random variable.",
        exampleSentence_en: "Linearity of expectation holds even for dependent variables."
      }
    ],
    questions: [
      {
        id: "m3-l2-q1",
        type: "numeric",
        prompt: {
          tr: "$\\text{Var}(X) = 4$ ise $\\text{Var}(3X - 7)$ kaçtır?",
          en: "If $\\text{Var}(X) = 4$, what is $\\text{Var}(3X - 7)$?"
        },
        correctAnswer: 36,
        explanation: {
          tr: "$$\\text{Var}(aX + b) = a^2 \\text{Var}(X) = 3^2 \\times 4 = 9 \\times 4 = 36$$",
          en: "$$\\text{Var}(3X - 7) = 3^2 \\times 4 = 36$$"
        }
      }
    ]
  },
  {
    id: "m3-l3",
    moduleId: "module-3",
    order: 3,
    difficulty: "orta-ustu",
    title: {
      tr: "Binom Dağılımı ve Geometrik Dağılım",
      en: "Binomial & Geometric Distributions"
    },
    conceptCard: {
      tr: "1. **Binom Dağılımı** ($X \\sim \\text{Bin}(n, p)$): $n$ bağımsız Bernoulli denemesinde $k$ başarı elde etme olasılığı:\n$$P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}, \\qquad \\mathbb{E}[X] = np, \\quad \\text{Var}(X) = np(1-p)$$\n\n2. **Geometrik Dağılım** ($Y \\sim \\text{Geom}(p)$): İlk başarıya kadar gereken deneme sayısı:\n$$P(Y = k) = (1-p)^{k-1} p, \\qquad \\mathbb{E}[Y] = \\frac{1}{p}, \\quad \\text{Var}(Y) = \\frac{1-p}{p^2}$$",
      en: "Binomial: $P(X=k) = \\binom{n}{k}p^k(1-p)^{n-k}$, $\\mathbb{E}[X]=np, \\text{Var}(X)=np(1-p)$. Geometric: First success at trial $k$, $P(Y=k)=(1-p)^{k-1}p, \\mathbb{E}[Y]=1/p$."
    },
    companyExample: {
      tr: "Fabrikada üretilen her mikroçipin hatalı olma olasılığı $p = 0.05$'tir. Rastgele seçilen $n = 20$ çipten tam 2 tanesinin hatalı olma olasılığı Binom ile hesaplanır: $P(X=2) = \\binom{20}{2} (0.05)^2 (0.95)^{18} \\approx 0.1887$ (%18.9). İlk hatalı çipi 4. kontrolde bulma olasılığı ise Geometrik ile: $(0.95)^3 (0.05) \\approx 0.0429$ olur.",
      en: "Defect rate is $p=0.05$. In $n=20$ chips, probability of exactly 2 defects is Binomial: $P(X=2) = \\binom{20}{2}(0.05)^2(0.95)^{18} \\approx 18.9\\%$. Finding first defect on 4th test is Geometric: $(0.95)^3(0.05) \\approx 4.29\\%$."
    },
    interactiveType: "distribution_explorer",
    vocabTerms: [
      {
        term_en: "binomial distribution",
        explanation_tr: "Sabit başarı olasılıklı bağımsız tekrarlı denemelerde başarı sayısı dağılımı.",
        explanation_en: "Distribution of number of successes in independent trials.",
        exampleSentence_en: "Quality control often uses the binomial distribution."
      }
    ],
    questions: [
      {
        id: "m3-l3-q1",
        type: "numeric",
        prompt: {
          tr: "$n = 100$ ve $p = 0.20$ olan bir Binom dağılımının varyansı ($\\text{Var}(X)$) kaçtır?",
          en: "What is the variance ($\\text{Var}(X)$) of a Binomial distribution with $n=100$ and $p=0.20$?"
        },
        correctAnswer: 16,
        explanation: {
          tr: "$$\\text{Var}(X) = np(1-p) = 100 \\times 0.20 \\times 0.80 = 16$$",
          en: "$$\\text{Var}(X) = 100 \\times 0.20 \\times 0.80 = 16$$"
        }
      }
    ]
  },
  {
    id: "m3-l4",
    moduleId: "module-3",
    order: 4,
    difficulty: "orta-ustu",
    title: {
      tr: "Poisson Dağılımı ve Poisson Süreci",
      en: "Poisson Distribution & Poisson Process"
    },
    conceptCard: {
      tr: "Belirli bir zaman veya alan aralığında nadir olayların gerçekleşme sayısı $X \\sim \\text{Poisson}(\\lambda)$ dağılımına uyar:\n\n$$P(X = k) = \\frac{e^{-\\lambda} \\lambda^k}{k!}, \\qquad k = 0, 1, 2, \\dots$$\n\nPoisson Dağılımının en ayırt edici özelliği, ortalaması ile varyansının eşit olmasıdır:\n$$\\mathbb{E}[X] = \\lambda, \\qquad \\text{Var}(X) = \\lambda$$\nBinom Yaklaşımı: $n \\ge 100$ ve $p \\le 0.05$ ise $\\text{Bin}(n, p) \\approx \\text{Poisson}(\\lambda = np)$.",
      en: "Poisson distribution for counts in fixed interval: $P(X=k) = \\frac{e^{-\\lambda}\\lambda^k}{k!}$ where $\\mathbb{E}[X] = \\text{Var}(X) = \\lambda$. Binomial approximates Poisson when $n$ is large and $p$ is small."
    },
    companyExample: {
      tr: "MarkIE çağrı merkezine saatte ortalama $\\lambda = 4$ çağrı gelmektedir. Gelecek saatte tam 3 çağrı alma olasılığı $P(X=3) = \\frac{e^{-4} 4^3}{3!} = \\frac{0.0183 \\times 64}{6} \\approx 0.1954$ (%19.5) olur.",
      en: "MarkIE call center receives an average of $\\lambda = 4$ calls/hour. Probability of exactly 3 calls in the next hour is $P(X=3) = \\frac{e^{-4}4^3}{3!} \\approx 19.54\\%$."
    },
    interactiveType: "distribution_explorer",
    vocabTerms: [
      {
        term_en: "Poisson distribution",
        explanation_tr: "Sabit bir zaman veya uzay aralığında gerçekleşen bağımsız nadir olayların dağılımı.",
        explanation_en: "Probability distribution of independent events occurring in fixed time intervals.",
        exampleSentence_en: "Web traffic spikes follow a Poisson process."
      }
    ],
    questions: [
      {
        id: "m3-l4-q1",
        type: "numeric",
        prompt: {
          tr: "Ortalaması $\\lambda = 9$ olan bir Poisson dağılımının standart sapması ($\\\\sigma = \\\\sqrt{\\\\text{Var}(X)}$) kaçtır?",
          en: "If a Poisson distribution has mean $\\lambda = 9$, what is its standard deviation?"
        },
        correctAnswer: 3,
        explanation: {
          tr: "Poisson'da $\\text{Var}(X) = \\lambda = 9$. Standart sapma $\\sigma = \\sqrt{9} = 3$.",
          en: "In Poisson, $\\text{Var}(X) = \\lambda = 9$. Standard deviation is $\\sigma = \\sqrt{9} = 3$."
        }
      }
    ]
  },
  {
    id: "m3-l5",
    moduleId: "module-3",
    order: 5,
    difficulty: "orta",
    title: {
      tr: "Sürekli Rastgele Değişkenler, PDF ve Normal Dağılım",
      en: "Continuous Random Variables, PDF & Normal Distribution"
    },
    conceptCard: {
      tr: "Sürekli bir rastgele değişken için tek bir noktanın olasılığı sıfırdır ($P(X = c) = 0$). Olasılıklar, Olasılık Yoğunluk Fonksiyonu (PDF) $f(x)$ altındaki alanla hesaplanır:\n$$P(a \\le X \\le b) = \\int_a^b f(x) dx, \\qquad \\int_{-\\infty}^\\infty f(x) dx = 1$$\n\n**Normal Dağılım** ($X \\sim \\mathcal{N}(\\mu, \\sigma^2)$):\n$$f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}$$\nStandartlaştırma ($Z$-Skoru): $Z = \\frac{X - \\mu}{\\sigma} \\sim \\mathcal{N}(0, 1)$.",
      en: "Continuous RVs use PDF $f(x)$ where $P(a \\le X \\le b) = \\int_a^b f(x)dx$. Normal distribution standardizes via $Z = \\frac{X-\\mu}{\\sigma} \\sim \\mathcal{N}(0,1)$."
    },
    companyExample: {
      tr: "Bir çelik milin çapı ortalama $\\mu = 50$ mm ve $\\sigma = 0.5$ mm ile normal dağılmaktadır. 51 mm'den kalın millerin oranı: $Z = \\frac{51 - 50}{0.5} = 2.0$. Standart normal tablosundan $P(Z > 2.0) = 1 - 0.9772 = 0.0228$ (%2.28) bulunur.",
      en: "Steel shaft diameter is $\\mathcal{N}(50, 0.5^2)$ mm. The fraction exceeding 51 mm is $Z = (51-50)/0.5 = 2.0$, yielding $P(Z > 2.0) = 1 - 0.9772 = 0.0228$ (2.28%)."
    },
    interactiveType: "distribution_explorer",
    vocabTerms: [
      {
        term_en: "probability density function (PDF)",
        explanation_tr: "Sürekli rastgele değişkenin olasılık yoğunluğunu gösteren eğri.",
        explanation_en: "Function describing the relative likelihood of a continuous random variable.",
        exampleSentence_en: "Area under the PDF curve equals total probability."
      }
    ],
    questions: [
      {
        id: "m3-l5-q1",
        type: "numeric",
        prompt: {
          tr: "Ortalaması $\\mu = 100$ ve varyansı $\\sigma^2 = 25$ olan normal dağılımda $X = 110$ değerinin Z-skoru ($Z$) kaçtır?",
          en: "In a normal distribution with $\\mu = 100$ and $\\sigma^2 = 25$, what is the Z-score for $X = 110$?"
        },
        correctAnswer: 2,
        explanation: {
          tr: "$\\sigma = \\sqrt{25} = 5$. $$Z = \\frac{X - \\mu}{\\sigma} = \\frac{110 - 100}{5} = 2.0$$",
          en: "$\\sigma = 5$. $$Z = \\frac{110 - 100}{5} = 2.0$$"
        }
      }
    ]
  }
];
fs.writeFileSync('src/data/module3.json', JSON.stringify(m3, null, 2), 'utf8');
console.log('Module 3 successfully updated (5 atomic lessons).');

// --- MODULE 4 ---
const m4 = JSON.parse(fs.readFileSync('src/data/module4.json', 'utf8'));
m4.lessons = [
  {
    id: "m4-l1",
    moduleId: "module-4",
    order: 1,
    difficulty: "orta",
    title: {
      tr: "Birleşik (Joint) Dağılımlar, Kovaryans ve Korelasyon",
      en: "Joint Distributions, Covariance & Correlation"
    },
    conceptCard: {
      tr: "İki rastgele değişken $X$ ve $Y$ arasındaki ortak davranış Birleşik Olasılık Kütle Fonksiyonu $p(x, y) = P(X=x, Y=y)$ ile modellenir.\n\nKovaryans (Değişkenlerin birlikte yönelimi):\n$$\\text{Cov}(X, Y) = \\sigma_{XY} = \\mathbb{E}[(X - \\mu_X)(Y - \\mu_Y)] = \\mathbb{E}[XY] - \\mathbb{E}[X]\\mathbb{E}[Y]$$\n\nPearson Korelasyon Katsayısı (Boyutsuz ilişki gücü, $-1 \\le \\rho \\le 1$):\n$$\\rho_{XY} = \\frac{\\text{Cov}(X, Y)}{\\sigma_X \\sigma_Y}$$\n$X$ ve $Y$ bağımsız ise $\\text{Cov}(X,Y) = 0$ ve $\\rho = 0$ olur.",
      en: "Joint PMF is $p(x,y)=P(X=x,Y=y)$. Covariance is $\\text{Cov}(X,Y)=\\mathbb{E}[XY]-\\mathbb{E}[X]\\mathbb{E}[Y]$. Correlation is $\\rho = \\frac{\\text{Cov}(X,Y)}{\\sigma_X \\sigma_Y} \\in [-1, 1]$."
    },
    companyExample: {
      tr: "SurveyPulse sunucularında CPU kullanımı ($X$) ile bellek kullanımı ($Y$) arasındaki kovaryans $\\text{Cov}(X,Y) = 24$, standart sapmalar $\\sigma_X = 5, \\sigma_Y = 6$ ise aralarındaki korelasyon $\\rho = 24 / (5 \\times 6) = 0.80$'dir. Bu, iki sistem kaynağı arasında güçlü bir pozitif doğrusal bağ olduğunu gösterir.",
      en: "CPU load ($X$) and RAM load ($Y$) have $\\text{Cov}(X,Y)=24$, $\\sigma_X=5, \\sigma_Y=6$. The correlation is $\\rho = 24/30 = 0.80$, showing a strong positive linear relationship."
    },
    interactiveType: "correlation_scatter",
    vocabTerms: [
      {
        term_en: "covariance",
        explanation_tr: "İki rastgele değişkenin birlikte ne derece değiştiklerini gösteren istatistiksel ölçü.",
        explanation_en: "A measure of the joint variability of two random variables.",
        exampleSentence_en: "Positive covariance indicates variables increase together."
      }
    ],
    questions: [
      {
        id: "m4-l1-q1",
        type: "numeric",
        prompt: {
          tr: "$\\mathbb{E}[XY] = 26$, $\\mathbb{E}[X] = 4$ ve $\\mathbb{E}[Y] = 5$ ise $\\text{Cov}(X, Y)$ kaçtır?",
          en: "If $\\mathbb{E}[XY] = 26$, $\\mathbb{E}[X] = 4$, and $\\mathbb{E}[Y] = 5$, what is $\\text{Cov}(X, Y)$?"
        },
        correctAnswer: 6,
        explanation: {
          tr: "$$\\text{Cov}(X, Y) = \\mathbb{E}[XY] - \\mathbb{E}[X]\\mathbb{E}[Y] = 26 - (4 \\times 5) = 26 - 20 = 6$$",
          en: "$$\\text{Cov}(X, Y) = 26 - (4 \\times 5) = 6$$"
        }
      }
    ]
  },
  {
    id: "m4-l2",
    moduleId: "module-4",
    order: 2,
    difficulty: "orta-ustu",
    title: {
      tr: "Rastgele Değişkenlerin Doğrusal Kombinasyonları",
      en: "Linear Combinations of Random Variables"
    },
    conceptCard: {
      tr: "$X_1, X_2, \\dots, X_n$ rastgele değişkenlerinin doğrusal kombinasyonu $Y = \\sum_{i=1}^n a_i X_i$ olsun:\n\n1. **Beklenen Değer (Her zaman geçerlidir):**\n$$\\mathbb{E}[Y] = \\sum_{i=1}^n a_i \\mathbb{E}[X_i]$$\n\n2. **Genel Varyans:**\n$$\\text{Var}(Y) = \\sum_{i=1}^n a_i^2 \\text{Var}(X_i) + 2 \\sum_{i < j} a_i a_j \\text{Cov}(X_i, X_j)$$\n\n3. **Bağımsız Değişkenler İçin Varyans:**\n$$\\text{Var}(Y) = \\sum_{i=1}^n a_i^2 \\text{Var}(X_i) \\implies \\text{Var}(X_1 - X_2) = \\text{Var}(X_1) + \\text{Var}(X_2)$$",
      en: "For linear combination $Y = \\sum a_i X_i$, expectation is $\\mathbb{E}[Y] = \\sum a_i \\mathbb{E}[X_i]$. For independent RVs, variance is $\\text{Var}(Y) = \\sum a_i^2 \\text{Var}(X_i)$."
    },
    companyExample: {
      tr: "Bir montaj hattında iki bağımsız parçanın uzunlukları $X_1 \\sim \\mathcal{N}(50, 4)$ ve $X_2 \\sim \\mathcal{N}(30, 9)$'dur. Toplam uzunluk $Y = X_1 + X_2$ için beklenen değer $\\mathbb{E}[Y] = 50 + 30 = 80$, varyans $\\text{Var}(Y) = 4 + 9 = 13$, standart sapma $\\sigma_Y = \\sqrt{13} \\approx 3.61$ mm olur.",
      en: "Two independent assembled parts have lengths $X_1 \\sim \\mathcal{N}(50, 4)$ and $X_2 \\sim \\mathcal{N}(30, 9)$. Total length $Y = X_1 + X_2$ has $\\mathbb{E}[Y] = 80$ and $\\text{Var}(Y) = 4 + 9 = 13$."
    },
    interactiveType: "linear_comb_calc",
    vocabTerms: [
      {
        term_en: "linear combination",
        explanation_tr: "Rastgele değişkenlerin sabit katsayılarla çarpılıp toplanması işlemi.",
        explanation_en: "An expression constructed from a set of terms by multiplying each term by a constant and adding the results.",
        exampleSentence_en: "The sum of independent normal random variables is also normal."
      }
    ],
    questions: [
      {
        id: "m4-l2-q1",
        type: "numeric",
        prompt: {
          tr: "$X_1$ ve $X_2$ bağımsız iki değişken olup $\\text{Var}(X_1) = 9$ ve $\\text{Var}(X_2) = 16$ ise $\\text{Var}(X_1 - X_2)$ kaçtır?",
          en: "If $X_1$ and $X_2$ are independent with $\\text{Var}(X_1) = 9$ and $\\text{Var}(X_2) = 16$, what is $\\text{Var}(X_1 - X_2)$?"
        },
        correctAnswer: 25,
        explanation: {
          tr: "Varyanslar her zaman toplanır: $\\text{Var}(X_1 - X_2) = (1)^2 \\text{Var}(X_1) + (-1)^2 \\text{Var}(X_2) = 9 + 16 = 25$.",
          en: "Variances always add up: $\\text{Var}(X_1 - X_2) = 1^2 \\times 9 + (-1)^2 \\times 16 = 25$."
        }
      }
    ]
  },
  {
    id: "m4-l3",
    moduleId: "module-4",
    order: 3,
    difficulty: "ileri",
    title: {
      tr: "Hata Yayılımı (Propagation of Error / Taylor Yaklaşımı)",
      en: "Propagation of Error (Taylor Series Approximation)"
    },
    conceptCard: {
      tr: "Doğrusal olmayan bir fonksiyon $Y = f(X_1, X_2, \\dots, X_k)$ verildiğinde ve $X_i$ değişkenleri küçük varyanslarla bağımsız olduğunda, 1. derece Taylor serisi açılımı ile $Y$'nin yaklaşık varyansı (Hata Yayılımı / Error Propagation):\n\n$$\\sigma_Y^2 = \\text{Var}(Y) \\approx \\sum_{i=1}^k \\left( \\frac{\\partial f}{\\partial X_i} \\right)^2 \\sigma_{X_i}^2$$\n\nDeğişkenler bağımlı ise kovaryans terimleri eklenir:\n$$\\text{Var}(Y) \\approx \\sum_{i=1}^k \\left( \\frac{\\partial f}{\\partial X_i} \\right)^2 \\sigma_{X_i}^2 + 2 \\sum_{i < j} \\left( \\frac{\\partial f}{\\partial X_i} \\right) \\left( \\frac{\\partial f}{\\partial X_j} \\right) \\text{Cov}(X_i, X_j)$$",
      en: "For non-linear function $Y = f(X_1,\\dots,X_k)$, first-order Taylor expansion yields $\\sigma_Y^2 \\approx \\sum (\\frac{\\partial f}{\\partial X_i})^2 \\sigma_{X_i}^2$."
    },
    companyExample: {
      tr: "Elektrik devresinde güç $P = I^2 R$ formülüyle hesaplanmaktadır. Akım $I = 10$ A ($\\sigma_I = 0.2$), Direnç $R = 50\\,\\Omega$ ($\\sigma_R = 1$) bağımsızdır. $\\frac{\\partial P}{\\partial I} = 2IR = 2(10)(50) = 1000$, $\\frac{\\partial P}{\\partial R} = I^2 = 100$. Gücün varyansı $\\sigma_P^2 \\approx (1000)^2 (0.2)^2 + (100)^2 (1)^2 = 40000 + 10000 = 50000$ $\\text{W}^2$ (Standart sapma $\\sigma_P \\approx 223.6$ W) bulunur.",
      en: "Electrical power is $P = I^2 R$. With $I=10\\,(\\sigma_I=0.2)$ and $R=50\\,(\\sigma_R=1)$, partial derivatives give $\\sigma_P^2 \\approx (1000)^2(0.2)^2 + (100)^2(1)^2 = 50000$, so $\\sigma_P \\approx 223.6$ W."
    },
    interactiveType: "taylor_error_calc",
    vocabTerms: [
      {
        term_en: "propagation of error",
        explanation_tr: "Girdi değişkenlerindeki ölçüm belirsizliklerinin doğrusal olmayan bir fonksiyondan geçerek çıktıya nasıl yansıdığını hesaplayan yöntem.",
        explanation_en: "Method for determining the uncertainty of a non-linear function based on input uncertainties.",
        exampleSentence_en: "Error propagation uses partial derivatives from Taylor series."
      }
    ],
    questions: [
      {
        id: "m4-l3-q1",
        type: "multiple_choice",
        prompt: {
          tr: "Hata Yayılımı (Propagation of Error) formülü doğrusal olmayan fonksiyonları yaklaşık olarak hesaplamak için hangi matematiksel aracı kullanır?",
          en: "Which mathematical tool is used by the Propagation of Error formula to approximate non-linear functions?"
        },
        options: [
          { tr: "1. Derece Taylor Serisi Açılımı (Kısmi Türevler)", en: "First-Order Taylor Series Expansion (Partial Derivatives)" },
          { tr: "Fourier Dönüşümü", en: "Fourier Transform" },
          { tr: "L'Hopital Kuralı", en: "L'Hopital's Rule" }
        ],
        correctAnswer: "1. Derece Taylor Serisi Açılımı (Kısmi Türevler)",
        explanation: {
          tr: "Hata yayılımı, fonksiyonun beklenen değer etrafında 1. derece Taylor serisine açılmasıyla (kısmi türevlerle) türetilir.",
          en: "Error propagation is derived using first-order Taylor expansion around the mean."
        }
      }
    ]
  },
  {
    id: "m4-l4",
    moduleId: "module-4",
    order: 4,
    difficulty: "orta",
    title: {
      tr: "Örneklem Dağılımı ve Standart Hata",
      en: "Sampling Distribution & Standard Error"
    },
    conceptCard: {
      tr: "Anakütleden ($N$) çekilen $n$ birimlik rastgele örneklemlerin ortalaması ($\\bar{X}$) bir rastgele değişkendir ve Örneklem Dağılımını oluşturur:\n\n$$\\mathbb{E}[\\bar{X}] = \\mu, \\qquad \\sigma_{\\bar{X}} = \\text{SE} = \\frac{\\sigma}{\\sqrt{n}}$$\n\nİki Bağımsız Örneklem Ortalamasının Farkı Dağılımı ($\\bar{X}_1 - \\bar{X}_2$):\n$$\\mathbb{E}[\\bar{X}_1 - \\bar{X}_2] = \\mu_1 - \\mu_2, \\qquad \\sigma_{\\bar{X}_1 - \\bar{X}_2} = \\sqrt{\\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2}}$$",
      en: "The sample mean $\\bar{X}$ has expectation $\\mu$ and standard error $\\text{SE} = \\sigma / \\sqrt{n}$. The difference of two independent sample means has $\\text{SE} = \\sqrt{\\sigma_1^2/n_1 + \\sigma_2^2/n_2}$."
    },
    companyExample: {
      tr: "SurveyPulse harcama araştırmasında kütle standart sapması $\\sigma = 20$ TL'dir. $n = 100$ kişilik örneklemde $\\text{SE} = 20 / \\sqrt{100} = 2$ TL'dir. Örneklem hacmi 4 katına çıkarılıp $n = 400$ yapıldığında $\\text{SE} = 20 / \\sqrt{400} = 1$ TL'ye düşer.",
      en: "In SurveyPulse's study, $\\sigma = $20. For $n=100$, $\\text{SE} = 20/10 = $2. Quadrupling to $n=400$ cuts the standard error in half to $\\text{SE} = $1."
    },
    interactiveType: "sample_size",
    vocabTerms: [
      {
        term_en: "standard error (SE)",
        explanation_tr: "Bir örneklem istatistiğinin (örneğin ortalamanın) örnekleme dağılımının standart sapması.",
        explanation_en: "The standard deviation of a sampling distribution.",
        exampleSentence_en: "Standard error decreases inversely with the square root of sample size."
      }
    ],
    questions: [
      {
        id: "m4-l4-q1",
        type: "numeric",
        prompt: {
          tr: "Standart sapması $\\sigma = 30$ olan bir kütleden $n = 100$ kişilik örneklem çekilirse Standart Hata ($\\text{SE}$) kaç olur?",
          en: "If population std dev $\\sigma = 30$ and sample size $n = 100$, what is the Standard Error ($\\text{SE}$)?"
        },
        correctAnswer: 3,
        explanation: {
          tr: "$$\\text{SE} = \\frac{\\sigma}{\\sqrt{n}} = \\frac{30}{\\sqrt{100}} = \\frac{30}{10} = 3$$",
          en: "$$\\text{SE} = \\frac{30}{10} = 3$$"
        }
      }
    ]
  },
  {
    id: "m4-l5",
    moduleId: "module-4",
    order: 5,
    difficulty: "orta-ustu",
    title: {
      tr: "Merkezi Limit Teoremi (CLT) & Örneklem Büyüklüğü",
      en: "Central Limit Theorem (CLT) & Sample Size"
    },
    conceptCard: {
      tr: "Merkezi Limit Teoremi (CLT), ana kütlenin dağılımı ne olursa olsun (çarpık, üniform, bimodal), yeterince büyük bir örneklem hacmi ($n \\ge 30$) seçildiğinde örneklem ortalamaları dağılımının yaklaşık olarak Normal Dağılıma yakınsayacağını belirtir:\n\n$$\\bar{X} \\xrightarrow{d} \\mathcal{N}\\left(\\mu, \\frac{\\sigma^2}{n}\\right), \\qquad Z = \\frac{\\bar{X} - \\mu}{\\frac{\\sigma}{\\sqrt{n}}} \\sim \\mathcal{N}(0, 1)$$\n\nBüyük Sayılar Yasası (LLN) ise $n \\to \\infty$ iken $\\bar{X} \\to \\mu$ olasılıkta yakınsamasını ifade eder.",
      en: "Central Limit Theorem guarantees that sample means converge to a normal distribution $\\mathcal{N}(\\mu, \\sigma^2/n)$ as $n \\ge 30$, regardless of the underlying population shape."
    },
    companyExample: {
      tr: "SurveyPulse platformunda kullanıcı kalış süreleri aşırı sağa çarpıktır (çoğu kişi 1 dk kalırken bazıları saatlerce kalır). Ancak rastgele $n = 50$ kişilik gruplar alınıp ortalamaları hesaplandığında, bu ortalamaların dağılımı CLT sayesinde kusursuz bir simetrik çan eğrisi oluşturur.",
      en: "User session durations are highly right-skewed. However, repeatedly averaging random samples of $n = 50$ yields a perfectly symmetric bell curve due to CLT."
    },
    interactiveType: "sample_size",
    vocabTerms: [
      {
        term_en: "Central Limit Theorem (CLT)",
        explanation_tr: "Örneklem büyüklüğü arttıkça örneklem ortalamasının normale yakınsayacağını kanıtlayan teorem.",
        explanation_en: "Theorem stating that sample means approach normality as sample size increases.",
        exampleSentence_en: "CLT is the cornerstone of classical statistical inference."
      }
    ],
    questions: [
      {
        id: "m4-l5-q1",
        type: "multiple_choice",
        prompt: {
          tr: "Ana kütle sağa çarpık olduğunda örneklem ortalamasının yaklaşık normal dağılması için genel kural olarak minimum $n$ kaç olmalıdır?",
          en: "What is the general rule of thumb for minimum $n$ for sample means to be approximately normal?"
        },
        options: [
          { tr: "n >= 30", en: "n >= 30" },
          { tr: "n >= 5", en: "n >= 5" },
          { tr: "n >= 1000", en: "n >= 1000" }
        ],
        correctAnswer: "n >= 30",
        explanation: {
          tr: "İstatistik literatüründe Merkezi Limit Teoremi'nin güvenle uygulanabilmesi için genel eşik kuralı $n \\ge 30$'dur.",
          en: "In statistics, $n \\ge 30$ is the standard rule of thumb for applying the Central Limit Theorem."
        }
      }
    ]
  }
];
fs.writeFileSync('src/data/module4.json', JSON.stringify(m4, null, 2), 'utf8');
console.log('Module 4 successfully updated (5 atomic lessons).');
