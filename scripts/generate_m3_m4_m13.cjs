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
// MODULE 13: Kombinatorik & Sayma (9 Lessons)
// ==========================================
updateModule(13, [
  {
    id: "m13-l1", moduleId: "module-13", order: 1, difficulty: "basit",
    title: { tr: "Temel Sayma İlkesi (Çarpma Kuralı)", en: "Fundamental Counting Principle (Product Rule)" },
    conceptCard: {
      tr: "Birinci işlem $n_1$ farklı yolla, ikinci işlem $n_2$ farklı yolla, $\\dots$, $k$. işlem $n_k$ farklı yolla yapılabiliyorsa, bu işlemlerin ardışık olarak birlikte yapılabilme sayısı:\n\n$$N = n_1 \\times n_2 \\times \\dots \\times n_k$$\n\nToplam seçenek sayısı her adımdaki seçeneklerin çarpımıdır.",
      en: "If task 1 can be done in $n_1$ ways, task 2 in $n_2$ ways, the sequential sequence can be performed in $N = n_1 \\times n_2 \\times \\dots \\times n_k$ ways."
    },
    companyExample: {
      tr: "**Örnek Soru:** Bir web sitesinde kullanıcı şifresi 4 hanelidir. Her hane 10 rakamdan birini alabiliyorsa kaç farklı şifre oluşturulabilir?\n\n**Çözüm:**\n$$N = 10 \\times 10 \\times 10 \\times 10 = 10^4 = 10.000$$",
      en: "**Worked Example:** A 4-digit PIN with 10 digit choices per position yields $10^4 = 10,000$ possible PINs."
    },
    vocabTerms: [{ term_en: "product rule", explanation_tr: "Ardışık bağımsız seçimlerde toplam kombinasyon sayısını çarparak hesaplayan ilke.", explanation_en: "Counting principle multiplying choices at each sequential step.", exampleSentence_en: "The product rule gives the size of the password space." }],
    questions: [{
      id: "m13-l1-q1", type: "numeric",
      prompt: { tr: "3 farklı çorba, 4 farklı ana yemek ve 2 farklı tatlı bulunan bir restoranda kaç farklı 3'lü menü seçilebilir?", en: "With 3 soups, 4 mains, and 2 desserts, how many 3-course menus can be formed?" },
      correctAnswer: 24,
      explanation: { tr: "$$N = 3 \\times 4 \\times 2 = 24$$", en: "$$N = 3 \\times 4 \\times 2 = 24$$" }
    }],
    realWorldBox: { excelFormula: "=3*4*2", pythonCode: "import itertools\nlen(list(itertools.product(range(3), range(4), range(2))))", powerBiNote: { tr: "Kombinasyon uzayı boyutu hesaplamaları", en: "Combinatorial state space calculation" } }
  },
  {
    id: "m13-l2", moduleId: "module-13", order: 2, difficulty: "basit",
    title: { tr: "Toplama Kuralı ve Kapsama-Dışlama", en: "Sum Rule & Inclusion-Exclusion" },
    conceptCard: {
      tr: "1. **Ayrık Seçimler (Toplama Kuralı):** Bir işlem $A$ kümesinden $n_1$ farklı yolla VEYA $B$ kümesinden $n_2$ farklı yolla yapılabiliyorsa ve bu kümeler ayrıksa:\n$$N = n_1 + n_2$$\n\n2. **Kesişen Seçimler (Kapsama-Dışlama):** Kümeler ayrı değilse ortak elemanlar çıkarılır:\n$$n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$$",
      en: "Disjoint choices add up: $N = n_1 + n_2$. If non-disjoint, subtract intersection: $n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$."
    },
    companyExample: {
      tr: "**Örnek Soru:** Bir şirkette 12 frontend geliştirici ve 8 backend geliştirici vardır (hiçbiri her ikisi de değildir). Bir projeye liderlik etmek üzere 1 kişi kaç farklı şekilde seçilebilir?\n\n**Çözüm:** $N = 12 + 8 = 20$ farklı şekilde seçilebilir.",
      en: "**Worked Example:** 12 frontend and 8 backend engineers. Choosing 1 lead yields $12 + 8 = 20$ options."
    },
    vocabTerms: [{ term_en: "sum rule", explanation_tr: "Birbirini dışlayan alternatif seçeneklerin toplanması ilkesidir.", explanation_en: "Principle that mutually exclusive choices are added together.", exampleSentence_en: "The sum rule applies because the job candidates cannot hold both titles." }],
    questions: [{
      id: "m13-l2-q1", type: "numeric",
      prompt: { tr: "Bir kütüphanede 15 matematik kitabı ve 25 fizik kitabı vardır. Bir öğrenci 1 matematik VEYA 1 fizik kitabını kaç farklı şekilde seçebilir?", en: "With 15 math and 25 physics books, how many ways can 1 book be selected?" },
      correctAnswer: 40,
      explanation: { tr: "$$N = 15 + 25 = 40$$", en: "$$N = 15 + 25 = 40$$" }
    }],
    realWorldBox: { excelFormula: "=15 + 25", pythonCode: "total_options = len(math_books) + len(physics_books)", powerBiNote: { tr: "Ayrık kategori toplamları", en: "Disjoint category aggregation" } }
  },
  {
    id: "m13-l3", moduleId: "module-13", order: 3, difficulty: "basit",
    title: { tr: "Faktöriyel ($n!$) ve Sayma Problemleri", en: "Factorials ($n!$) and Counting" },
    conceptCard: {
      tr: "$n$ elemanlı bir kümenin tüm elemanlarının yan yana dizilme (sıralanma) sayısı faktöriyel ile hesaplanır:\n\n$$n! = n \\times (n-1) \\times (n-2) \\times \\dots \\times 2 \\times 1$$\n\n**Özel Durumlar:**\n- $0! = 1$\n- $1! = 1$",
      en: "Factorial counts the total linear arrangements of $n$ distinct objects:\n$$n! = n \\times (n-1) \\times \\dots \\times 1, \\quad 0! = 1$$"
    },
    companyExample: {
      tr: "**Örnek Soru:** 5 farklı sunucu görevi kuyrukta sırayla çalıştırılacaktır. Bu görevler kaç farklı sıralamayla dizilebilir?\n\n**Çözüm:**\n$$5! = 5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$$",
      en: "**Worked Example:** Arranging 5 server jobs in queue yields $5! = 120$ unique execution orders."
    },
    vocabTerms: [{ term_en: "factorial", explanation_tr: "1'den n'e kadar ardışık pozitif tam sayıların çarpımı ($n!$).", explanation_en: "The product of all positive integers less than or equal to $n$.", exampleSentence_en: "There are 5! = 120 ways to order the tasks." }],
    questions: [{
      id: "m13-l3-q1", type: "numeric",
      prompt: { tr: "$$6!$$ işleminin sonucu kaçtır?", en: "What is the value of $$6!$$?" },
      correctAnswer: 720,
      explanation: { tr: "$$6! = 6 \\times 5 \\times 4 \\times 3 \\times 2 \\times 1 = 720$$", en: "$$6! = 720$$" }
    }],
    realWorldBox: { excelFormula: "=ÇARPINIM(6)", pythonCode: "import math\nmath.factorial(6)", powerBiNote: { tr: "DAX: FACT(6)", en: "DAX: FACT(6)" } }
  },
  {
    id: "m13-l4", moduleId: "module-13", order: 4, difficulty: "orta",
    title: { tr: "Düz Permütasyon ($P(n, r)$)", en: "Permutations (Ordered Selection)" },
    conceptCard: {
      tr: "$n$ farklı nesne arasından $r$ tanesinin **sırası önemli** olacak şekilde seçilip dizilmesine **Permütasyon** denir:\n\n$$P(n, r) = \\frac{n!}{(n-r)!} = n \\times (n-1) \\times \\dots \\times (n-r+1)$$\n\n$(A, B) \\ne (B, A)$ (Sıralama farklı bir sonuçtur).",
      en: "Permutations select and arrange $r$ items out of $n$ where order matters:\n$$P(n, r) = \\frac{n!}{(n-r)!}$$"
    },
    companyExample: {
      tr: "**Örnek Soru:** 8 aday arasından 1 Başkan, 1 Başkan Yardımcısı ve 1 Sayman kaç farklı şekilde seçilebilir?\n\n**Çözüm:** Görevler belirli olduğu için sıra önemlidir ($n=8, r=3$):\n$$P(8, 3) = \\frac{8!}{(8-3)!} = 8 \\times 7 \\times 6 = 336$$",
      en: "**Worked Example:** Selecting President, VP, and Treasurer from 8 candidates: $P(8, 3) = 8 \\times 7 \\times 6 = 336$."
    },
    vocabTerms: [{ term_en: "permutation", explanation_tr: "Seçilen elemanların diziliş sırasının önemli olduğu sıralı düzenleme.", explanation_en: "An arrangement of objects in a specific order.", exampleSentence_en: "Rankings and podium finishes are classic permutations." }],
    questions: [{
      id: "m13-l4-q1", type: "numeric",
      prompt: { tr: "10 koşucunun yarıştığı bir yarışta ilk 2 derece (1. ve 2.) kaç farklı şekilde oluşabilir ($P(10, 2)$)?", en: "In a 10-runner race, how many ways can 1st and 2nd place finish ($P(10, 2)$)?" },
      correctAnswer: 90,
      explanation: { tr: "$$P(10, 2) = \\frac{10!}{8!} = 10 \\times 9 = 90$$", en: "$$P(10, 2) = 10 \\times 9 = 90$$" }
    }],
    realWorldBox: { excelFormula: "=PERMÜTASYON(10, 2)", pythonCode: "import math\nmath.perm(10, 2)", powerBiNote: { tr: "Sıralı seçim analizleri", en: "Permutation ranking calculations" } }
  },
  {
    id: "m13-l5", moduleId: "module-13", order: 5, difficulty: "orta",
    title: { tr: "Tekrarlı ve Dairesel Permütasyon", en: "Permutations with Repetition" },
    conceptCard: {
      tr: "1. **Tekrarlı Permütasyon:** Toplam $n$ nesneden $n_1$ tanesi özdeş, $n_2$ tanesi özdeş, $\\dots$, $n_k$ tanesi özdeş ise:\n$$N = \\frac{n!}{n_1! \\times n_2! \\times \\dots \\times n_k!}$$\n\n2. **Dairesel Permütasyon:** $n$ nesnenin yuvarlak masa etrafına diziliş sayısı $(n-1)!$'dir.",
      en: "Permutations with indistinguishable items: $\\frac{n!}{n_1! n_2! \\dots n_k!}$. Circular permutations of $n$ items: $(n-1)!$."
    },
    companyExample: {
      tr: "**Örnek Soru:** 'KARA' kelimesinin harfleriyle anlamlı ya da anlamsız 4 harfli kaç kelime yazılabilir?\n\n**Çözüm:** $n=4$, 'A' harfi 2 kez tekrar ediyor:\n$$N = \\frac{4!}{2!} = \\frac{24}{2} = 12$$",
      en: "**Worked Example:** Anagrams of 'KARA' ($n=4$, two 'A's): $4! / 2! = 12$."
    },
    vocabTerms: [{ term_en: "multinomial coefficient", explanation_tr: "Özdeş elemanların tekrarlarını eleyerek sıralama sayısını veren katsayı.", explanation_en: "Coefficients accounting for permutations with repeated items.", exampleSentence_en: "Repeated letters require dividing by individual factorials." }],
    questions: [{
      id: "m13-l5-q1", type: "numeric",
      prompt: { tr: "'ANANAS' kelimesindeki harfler kullanılarak (3 tane A, 2 tane N, 1 tane S) kaç farklı 6 harfli kelime yazılabilir?", en: "How many distinct 6-letter words can be formed from 'ANANAS' (3 A's, 2 N's, 1 S)?" },
      correctAnswer: 60,
      explanation: { tr: "$$N = \\frac{6!}{3! \\times 2! \\times 1!} = \\frac{720}{6 \\times 2} = \\frac{720}{12} = 60$$", en: "$$N = 6! / (3! 2! 1!) = 60$$" }
    }],
    realWorldBox: { excelFormula: "=ÇARPINIM(6)/(ÇARPINIM(3)*ÇARPINIM(2))", pythonCode: "from math import factorial\nfactorial(6) // (factorial(3) * factorial(2))", powerBiNote: { tr: "DNA dizi permutasyon hesapları", en: "Sequence permutation calculation" } }
  },
  {
    id: "m13-l6", moduleId: "module-13", order: 6, difficulty: "orta",
    title: { tr: "Kombinasyon ($C(n, r)$ - Sırasız Seçim)", en: "Combinations (Unordered Selection)" },
    conceptCard: {
      tr: "$n$ elemanlı bir kümeden sırası gözetilmeksizin $r$ eleman seçilmesine **Kombinasyon** denir:\n\n$$C(n, r) = \\binom{n}{r} = \\frac{n!}{r!(n-r)!} = \\frac{P(n, r)}{r!}$$\n\n$\\{A, B\\} = \\{B, A\\}$ (Grup seçimidir, sıralama fark yaratmaz).",
      en: "Combinations select $r$ items from $n$ regardless of order:\n$$C(n, r) = \\binom{n}{r} = \\frac{n!}{r!(n-r)!}$$"
    },
    companyExample: {
      tr: "**Örnek Soru:** 10 kişilik bir mühendislik ekibinden 3 kişilik bir proje komitesi kaç farklı şekilde seçilebilir?\n\n**Çözüm:**\n$$\\binom{10}{3} = \\frac{10 \\times 9 \\times 8}{3 \\times 2 \\times 1} = \\frac{720}{6} = 120$$",
      en: "**Worked Example:** Selecting a committee of 3 from 10 engineers: $\\binom{10}{3} = 120$."
    },
    vocabTerms: [{ term_en: "combination", explanation_tr: "Elemanların seçilme sırasının önemsiz olduğu alt küme seçimi.", explanation_en: "A selection of items where order does not matter.", exampleSentence_en: "Lottery numbers and poker hands are combinations." }],
    questions: [{
      id: "m13-l6-q1", type: "numeric",
      prompt: { tr: "8 kişilik bir gruptan 2 kişilik bir çalışma grubu kaç farklı şekilde seçilebilir ($\\binom{8}{2}$)?", en: "How many ways can a 2-person team be selected from 8 people ($\\binom{8}{2}$)?" },
      correctAnswer: 28,
      explanation: { tr: "$$\\binom{8}{2} = \\frac{8 \\times 7}{2 \\times 1} = 28$$", en: "$$\\binom{8}{2} = 28$$" }
    }],
    realWorldBox: { excelFormula: "=KOMBİNASYON(8, 2)", pythonCode: "import math\nmath.comb(8, 2)", powerBiNote: { tr: "DAX: COMBIN(8, 2)", en: "DAX: COMBIN(8, 2)" } }
  },
  {
    id: "m13-l7", moduleId: "module-13", order: 7, difficulty: "orta",
    title: { tr: "Kombinasyonel Özdeşlikler ve Simetri", en: "Combinatorial Identities & Symmetry" },
    conceptCard: {
      tr: "Kombinasyon katsayılarının temel özellikleri:\n\n1. **Simetri Özelliği:** $\\binom{n}{r} = \\binom{n}{n-r}$\n(Örn: 10 kişiden 8 kişiyi seçmek, dışarıda kalacak 2 kişiyi seçmekle aynıdır: $\\binom{10}{8} = \\binom{10}{2} = 45$).\n\n2. **Uç Değerler:** $\\binom{n}{0} = 1, \\quad \\binom{n}{n} = 1, \\quad \\binom{n}{1} = n$\n\n3. **Tüm Alt Kümeler Toplamı:** $\\sum_{r=0}^{n} \\binom{n}{r} = 2^n$",
      en: "Key identities:\n1. Symmetry: $\\binom{n}{r} = \\binom{n}{n-r}$\n2. Extremes: $\\binom{n}{0} = \\binom{n}{n} = 1$\n3. Total subsets: $\\sum_{r=0}^{n} \\binom{n}{r} = 2^n$"
    },
    companyExample: {
      tr: "**Örnek Soru:** 100 elemanlı bir kümeden 98 eleman kaç farklı şekilde seçilebilir?\n\n**Çözüm:** Simetri kuralından $\\binom{100}{98} = \\binom{100}{2}$'dir:\n$$\\binom{100}{2} = \\frac{100 \\times 99}{2 \\times 1} = 4950$$",
      en: "**Worked Example:** Compute $\\binom{100}{98}$ using symmetry: $\\binom{100}{2} = 4950$."
    },
    vocabTerms: [{ term_en: "symmetry of combinations", explanation_tr: "n elemandan r tanesini seçmenin, geriye kalan n-r tanesini dışarıda bırakmakla özdeş olması kuralı.", explanation_en: "Property that choosing $r$ elements is identical to excluding $n-r$ elements.", exampleSentence_en: "Symmetry reduces large combination calculations." }],
    questions: [{
      id: "m13-l7-q1", type: "numeric",
      prompt: { tr: "$$\\binom{20}{19}$$ ifadesinin değeri kaçtır?", en: "What is the value of $$\\binom{20}{19}$$?" },
      correctAnswer: 20,
      explanation: { tr: "$$\\binom{20}{19} = \\binom{20}{1} = 20$$", en: "$$\\binom{20}{19} = 20$$" }
    }],
    realWorldBox: { excelFormula: "=KOMBİNASYON(20, 19)", pythonCode: "math.comb(20, 19)", powerBiNote: { tr: "Alt küme sayısı: 2^N", en: "Total subset space: 2^N" } }
  },
  {
    id: "m13-l8", moduleId: "module-13", order: 8, difficulty: "ileri",
    title: { tr: "Pascal Üçgeni ve Pascal Özdeşliği", en: "Pascal's Triangle & Identity" },
    conceptCard: {
      tr: "**Pascal Özdeşliği:** Her eleman, bir üst satırdaki kendisine komşu iki elemanın toplamına eşittir:\n\n$$\\binom{n}{r} = \\binom{n-1}{r-1} + \\binom{n-1}{r}$$\n\nBu özdeşlik Pascal üçgeninin rekürsif matematiksel temelini oluşturur.",
      en: "Pascal's Identity defines the recursive triangle structure:\n$$\\binom{n}{r} = \\binom{n-1}{r-1} + \\binom{n-1}{r}$$"
    },
    companyExample: {
      tr: "**Örnek Soru:** $\\binom{7}{3} = 35$ ve $\\binom{7}{4} = 35$ olduğuna göre $\\binom{8}{4}$ değeri Pascal özdeşliği ile nasıl bulunur?\n\n**Çözüm:**\n$$\\binom{8}{4} = \\binom{7}{3} + \\binom{7}{4} = 35 + 35 = 70$$",
      en: "**Worked Example:** Using Pascal's identity, $\\binom{8}{4} = \\binom{7}{3} + \\binom{7}{4} = 35 + 35 = 70$."
    },
    vocabTerms: [{ term_en: "Pascal's identity", explanation_tr: "Kombinasyon katsayıları arasındaki rekürsif toplamsal ilişkiyi veren formül.", explanation_en: "The recursive formula relating binomial coefficients across consecutive rows.", exampleSentence_en: "Dynamic programming builds Pascal's triangle in O(n^2) time." }],
    questions: [{
      id: "m13-l8-q1", type: "numeric",
      prompt: { tr: "Pascal özdeşliğine göre $\\binom{5}{2} + \\binom{5}{3}$ toplamı $\\binom{6}{k}$ olduğuna göre bu toplamın sayısal değeri kaçtır?", en: "What is the numeric value of $\\binom{5}{2} + \\binom{5}{3}$?" },
      correctAnswer: 20,
      explanation: { tr: "$$\\binom{5}{2} + \\binom{5}{3} = 10 + 10 = 20 = \\binom{6}{3}$$", en: "$$10 + 10 = 20$$" }
    }],
    realWorldBox: { excelFormula: "=KOMBİNASYON(5,2)+KOMBİNASYON(5,3)", pythonCode: "math.comb(5,2) + math.comb(5,3)", powerBiNote: { tr: "Rekürsif kombinasyon analitiği", en: "Recursive binomial expansion" } }
  },
  {
    id: "m13-l9", moduleId: "module-13", order: 9, difficulty: "ileri",
    title: { tr: "Binom Teoremi ve Binom Açılımı", en: "Binomial Theorem" },
    conceptCard: {
      tr: "Binom Teoremi, $(x + y)^n$ ifadesinin kombinasyon katsayılarıyla açılımını verir:\n\n$$(x + y)^n = \\sum_{k=0}^{n} \\binom{n}{k} x^{n-k} y^k$$\n\n**Genel Terim ($k+1$. terim):**\n$$T_{k+1} = \\binom{n}{k} x^{n-k} y^k$$\n\nBu teorem Binom olasılık dağılımının ve olasılık kütle fonksiyonunun temelidir.",
      en: "The Binomial Theorem expands $(x + y)^n$ using binomial coefficients:\n$$(x + y)^n = \\sum_{k=0}^{n} \\binom{n}{k} x^{n-k} y^k$$"
    },
    companyExample: {
      tr: "**Örnek Soru:** $(x + y)^4$ açılımında $x^2 y^2$ teriminin katsayısı nedir?\n\n**Çözüm:** $n=4, k=2$ için katsayı $\\binom{4}{2}$'dir:\n$$\\binom{4}{2} = \\frac{4 \\times 3}{2 \\times 1} = 6 \\implies 6 x^2 y^2$$",
      en: "**Worked Example:** Find coefficient of $x^2 y^2$ in $(x+y)^4$: $\\binom{4}{2} = 6$."
    },
    vocabTerms: [{ term_en: "binomial theorem", explanation_tr: "İki terimli ifadelerin kuvvetlerini kombinasyon katsayılarıyla açan temel teorem.", explanation_en: "Algebraic expansion of powers of a binomial sum.", exampleSentence_en: "The binomial distribution probabilities sum to 1 by the binomial theorem." }],
    questions: [{
      id: "m13-l9-q1", type: "numeric",
      prompt: { tr: "$(x + y)^5$ açılımında $x^3 y^2$ teriminin katsayısı kaçtır ($\\binom{5}{2}$)?", en: "What is the coefficient of $x^3 y^2$ in $(x+y)^5$ ($\\binom{5}{2}$)?" },
      correctAnswer: 10,
      explanation: { tr: "$$\\binom{5}{2} = \\frac{5 \\times 4}{2 \\times 1} = 10$$", en: "$$\\binom{5}{2} = 10$$" }
    }],
    realWorldBox: { excelFormula: "=KOMBİNASYON(5, 2)", pythonCode: "import sympy\nx, y = sympy.symbols('x y')\n((x+y)**5).expand()", powerBiNote: { tr: "Binom olasılık modeli katsayıları", en: "Binomial probability basis" } }
  }
]);

console.log('Finished Module 13.');
