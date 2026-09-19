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
// 12. MODULE 12: Markov Zincirleri & Stokastik Süreçler (ENGR 200)
// -----------------------------------------------------------------
updateModule('module12.json', (m) => {
  m.lessons = [
    {
      id: 'm12-l1',
      moduleId: 'module-12',
      order: 1,
      difficulty: 'orta',
      title: { tr: 'Stokastik Süreç Tanımı & Markov Özelliği', en: 'Stochastic Process & Markov Property' },
      conceptCard: {
        tr: '1. **Stokastik Süreç ($X_t$):** Zaman içinde evrilen rastgele değişkenler ailesi.\n2. **Markov Özelliği (Hafızasızlık):** Gelecekteki durumun olasılık dağılımı geçmişteki tüm geçmişe değil, **yalnızca şu anki mevcut duruma** bağlıdır:\n$$P(X_{n+1} = j \\mid X_n = i, X_{n-1} = i_{n-1}, \\dots, X_0 = i_0) = P(X_{n+1} = j \\mid X_n = i)$$\n3. **Durum Uzayı ($S$):** Sürecin bulunabileceği olası tüm durumların kümesi ($S = \\{1, 2, \\dots, M\\}$).',
        en: '1. **Stochastic Process ($X_t$):** A collection of random variables indexed by time.\n2. **Markov Property (Memorylessness):** The conditional probability distribution of future states depends only upon the present state, not on the sequence of events that preceded it:\n$$P(X_{n+1} = j \\mid X_n = i, \\dots) = P(X_{n+1} = j \\mid X_n = i)$$\n3. **State Space ($S$):** The set of all possible states.'
      },
      companyExample: {
        tr: 'Bir bulut sunucunun yarınki durumu (Çalışıyor / Arızalı), sunucunun geçmişteki 1 yıllık tarihçesinden bağımsız, sadece bugünkü sağlık durumuna bağlı olarak modellenir.',
        en: 'A server\'s operational status tomorrow (Operational / Down) depends solely on its condition today, satisfying the Markov property.'
      },
      vocabTerms: [
        { term_en: 'Markov property', explanation_tr: 'Geleceğin geçmişten bağımsız olarak yalnızca şimdiki duruma bağlı olması özelliği (Hafızasızlık).', explanation_en: 'A stochastic process property where the future is conditionally independent of the past given the present.', exampleSentence_en: 'Discrete-time Markov chains satisfy the Markov memoryless property.' }
      ],
      questions: [
        {
          id: 'm12-l1-q1',
          type: 'multiple_choice',
          prompt: { tr: 'Bir stokastik sürecin Markov özelliğini sağlaması için hangi şart gereklidir?', en: 'What condition is required for a stochastic process to satisfy the Markov property?' },
          options: [
            { tr: 'Gelecekteki durumun sadece şimdiki duruma bağlı olması', en: 'Future state depends only on the current state' },
            { tr: 'Geleceğin tüm geçmişe eşit ağırlıkla bağlı olması', en: 'Future depends equally on entire history' },
            { tr: 'Durumların hiçbir zaman değişmemesi', en: 'States never change' },
            { tr: 'Varyansın sıfır olması', en: 'Variance equals zero' }
          ],
          correctAnswer: 'Gelecekteki durumun sadece şimdiki duruma bağlı olması',
          explanation: { tr: 'Markov özelliği "Şimdiki durum bilindiğinde geçmiş gelecek hakkında ek bilgi sağlamaz" ilkesidir.', en: 'Given the present, the future is conditionally independent of the past.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=Durum_Geçişi',
        pythonCode: '# Markov property simulation\nimport numpy as np\nnext_state = np.random.choice(states, p=P[current_state])',
        powerBiNote: { tr: 'Müşteri yaşam döngüsü geçiş durumları akış diyagramında gösterilir.', en: 'Render customer journey states on Sankey diagrams.' }
      }
    },
    {
      id: 'm12-l2',
      moduleId: 'module-12',
      order: 2,
      difficulty: 'orta-ustu',
      title: { tr: 'Geçiş Matrisi ($P$) ve Chapman-Kolmogorov Eşitliği', en: 'Transition Matrix ($P$) & Chapman-Kolmogorov Equation' },
      conceptCard: {
        tr: '1. **Bir Adımlı Geçiş Matrisi ($P$):** $p_{ij} = P(X_1 = j \\mid X_0 = i)$\n- Her $p_{ij} \\ge 0$\n- Her satırın toplamı tam olarak 1\'dir: $\\sum_j p_{ij} = 1$\n\n2. **Chapman-Kolmogorov Eşitliği ($n$-Adım Geçiş):**\n$n$ adım sonra $i$ durumundan $j$ durumuna geçme olasılığı matrisin $n$. kuvveti ile bulunur:\n$$P^{(n)} = P^n$$\n$$p_{ij}^{(m+n)} = \\sum_k p_{ik}^{(m)} p_{kj}^{(n)}$$',
        en: '1. **Transition Probability Matrix ($P$):** $p_{ij} = P(X_1 = j \\mid X_0 = i)$\n- All $p_{ij} \\ge 0$\n- Each row sums to exactly 1: $\\sum_j p_{ij} = 1$\n\n2. **Chapman-Kolmogorov Equations ($n$-Step Transitions):**\nThe $n$-step transition probability matrix is the $n$-th power of the 1-step matrix:\n$$P^{(n)} = P^n$$\n$$p_{ij}^{(m+n)} = \\sum_k p_{ik}^{(m)} p_{kj}^{(n)}$$'
      },
      companyExample: {
        tr: 'Bulut sunucu matrisi $P = \\begin{pmatrix} 0.90 & 0.10 \\\\ 0.60 & 0.40 \\end{pmatrix}$. 2 gün sonraki durum matrisi $P^2 = P \\times P = \\begin{pmatrix} 0.87 & 0.13 \\\\ 0.78 & 0.22 \\end{pmatrix}$. Bugün çalışan sunucunun 2 gün sonra çalışıyor olma olasılığı %87\'dir.',
        en: 'Server transition $P = [[0.90, 0.10], [0.60, 0.40]]$. 2-step matrix $P^2 = [[0.87, 0.13], [0.78, 0.22]]$. Probability of being up in 2 days from up today is 87%.'
      },
      vocabTerms: [
        { term_en: 'transition probability matrix', explanation_tr: 'Her bir durumdan diğer durumlara geçiş olasılıklarını içeren satır toplamı 1 olan kare matris.', explanation_en: 'A square matrix containing the probabilities of transitioning from one state to another.', exampleSentence_en: 'The n-step transition matrix is obtained by raising P to the power n.' }
      ],
      questions: [
        {
          id: 'm12-l2-q1',
          type: 'multiple_choice',
          prompt: { tr: 'Bir durum geçiş matrisinde ($P$) her bir satırın elemanları toplamı kaç olmak ZORUNDADIR?', en: 'What must the sum of elements in every row of a transition matrix ($P$) equal?' },
          options: [
            { tr: 'Tam olarak 1', en: 'Exactly 1' },
            { tr: '0', en: '0' },
            { tr: 'Sonsuz', en: 'Infinity' },
            { tr: 'Sütun sayısına bağlı olarak değişir', en: 'Varies by column count' }
          ],
          correctAnswer: 'Tam olarak 1',
          explanation: { tr: 'Bir durumdan çıkıldığında gidilebilecek tüm olası durumların olasılıkları toplamı 1 (kesin olay) olmalıdır.', en: 'Each row represents a conditional probability distribution, so row sum must equal 1.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=DÇARP(P_Matrisi; P_Matrisi)  (P^2 Hesabı)',
        pythonCode: 'import numpy as np\nP = np.array([[0.9, 0.1], [0.6, 0.4]])\nP_2 = np.linalg.matrix_power(P, 2)',
        powerBiNote: { tr: 'Geçiş matrisi ısı haritası matris görselinde gösterilir.', en: 'Transition matrices are visualized using Heatmap matrices.' }
      }
    },
    {
      id: 'm12-l3',
      moduleId: 'module-12',
      order: 3,
      difficulty: 'orta-ustu',
      title: { tr: 'Durağan Denge Dağılımı Vektörü ($\pi^*$)', en: 'Stationary Steady-State Distribution ($\pi^*$)' },
      conceptCard: {
        tr: 'İndirgenemez ve aperiodik (ergodik) bir Markov zincirinde $n \\to \\infty$ olduğunda durum olasılıkları sabit bir dengeye ulaşır (`ENGR 200 Lecture`):\n\n**Denge Denklemleri:**\n$$\\pi^* P = \\pi^*$$\n$$\\sum_{i=1}^M \\pi_i^* = 1$$\n\n- $\\pi_i^*$: Sistemin uzun vadede $i$ durumunda bulunma yüzdesidir.\n- Başlangıç durumundan ($X_0$) tamamen bağımsızdır.',
        en: 'For an irreducible and aperiodic Markov chain as $n \\to \\infty$, probabilities converge to a unique steady-state vector (`ENGR 200`):\n\n**Steady-State System:**\n$$\\pi^* P = \\pi^*$$\n$$\\sum_{i=1}^M \\pi_i^* = 1$$\n\n- $\\pi_i^*$: Long-run proportion of time the process spends in state $i$.\n- Independent of the initial starting state $X_0$.'
      },
      companyExample: {
        tr: 'Müşterilerin A ve B markaları arasındaki geçiş matrisi $P = \\begin{pmatrix} 0.8 & 0.2 \\\\ 0.3 & 0.7 \\end{pmatrix}$. Denge denklemi çözüldüğünde $\\pi_A^* = 0.60$ ve $\\pi_B^* = 0.40$ bulunur. Uzun vadede A markasının pazar payı %60\'ta dengelenir.',
        en: 'Brand loyalty matrix: Long-run equilibrium yields $\\pi_A^* = 0.60, \\pi_B^* = 0.40$. Brand A stabilizes at 60% market share.'
      },
      vocabTerms: [
        { term_en: 'steady-state vector', explanation_tr: 'Markov zincirinin uzun vadede ulaştığı sabit olasılık dağılımı (\\pi^*).', explanation_en: 'A probability distribution that remains unchanged across transitions: $\\pi P = \\pi$.', exampleSentence_en: 'The steady-state distribution represents long-term market share.' }
      ],
      questions: [
        {
          id: 'm12-l3-q1',
          type: 'multiple_choice',
          prompt: { tr: 'Durağan denge vektörü $\\pi^*$ hesaplanırken $\\pi P = \\pi$ denklemine ek olarak hangi normalizasyon kuralı eklenmelidir?', en: 'Along with $\\pi P = \\pi$, which normalization constraint must be included to solve for $\\pi^*$?' },
          options: [
            { tr: 'Tüm πi elemanlarının toplamının 1 olması (∑ πi = 1)', en: 'Sum of all πi elements equals 1 (∑ πi = 1)' },
            { tr: 'π1 = 0 olması', en: 'π1 = 0' },
            { tr: 'Determinantın 0 olması', en: 'Determinant equals 0' },
            { tr: 'Matrisin tersinin alınması', en: 'Inverting the matrix' }
          ],
          correctAnswer: 'Tüm πi elemanlarının toplamının 1 olması (∑ πi = 1)',
          explanation: { tr: '$\\pi P = \\pi$ sistemi bağımlı denklem ürettiği için $\\sum \\pi_i = 1$ toplam olasılık kuralı ile tekil çözüm bulunur.', en: 'Probability normalization $\\sum \\pi_i = 1$ is required to resolve linear dependency.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=DÖZVEKTÖR_Hesabı',
        pythonCode: '# Solve pi * P = pi and sum(pi) = 1\nimport scipy.linalg as la\nevals, evecs = la.eig(P.T)\npi = evecs[:, np.isclose(evals, 1)].real\npi = pi / np.sum(pi)',
        powerBiNote: { tr: 'Uzun vadeli pazar payı pasta grafiğinde denge vektörü gösterilir.', en: 'Equilibrium market shares are visualized on donut charts.' }
      }
    },
    {
      id: 'm12-l4',
      moduleId: 'module-12',
      order: 4,
      difficulty: 'zor',
      title: { tr: 'Yutucu Durumlar ve Temel Matris ($N$)', en: 'Absorbing Chains and Fundamental Matrix ($N$)' },
      conceptCard: {
        tr: 'Bir duruma girildiğinde bir daha asla çıkılamıyorsa ($p_{ii} = 1$) bu duruma **Yutucu Durum (Absorbing State)** denir (`ENGR 200 Lecture`):\n\n1. **Kanonik Form:** $P = \\begin{pmatrix} I & 0 \\\\ R & Q \\end{pmatrix}$\n- $Q$: Geçici durumlardan geçici durumlara geçişler\n- $R$: Geçici durumlardan yutucu durumlara geçişler\n\n2. **Temel Matris (Fundamental Matrix $N$):**\n$$N = (I - Q)^{-1}$$\n$N_{ij}$: $i$ durumunda başlayan sürecin yutulmadan önce $j$ durumunu ziyaret etme ortalama sayısıdır.\n3. **Yutulmaya Kadar Geçen Ortalama Süre:** $t = N \\mathbf{1}$\n4. **Yutulma Olasılıkları:** $B = N R$',
        en: 'A state $i$ is **Absorbing** if $p_{ii} = 1$ (`ENGR 200`):\n\n1. **Canonical Form:** $P = \\begin{pmatrix} I & 0 \\\\ R & Q \\end{pmatrix}$\n2. **Fundamental Matrix ($N$):**\n$$N = (I - Q)^{-1}$$\n$N_{ij}$ represents the expected number of visits to transient state $j$ starting from $i$.\n3. **Time to Absorption:** $t = N \\mathbf{1}$\n4. **Absorption Probabilities:** $B = N R$'
      },
      companyExample: {
        tr: 'Kredi derecelendirmesinde "Temerrüt/İflas (Default)" ve "Kredi Borcunu Kapatma" yutucu durumlardır. $N = (I-Q)^{-1}$ ile müşterinin iflas etmeden önce kaç ay ödeme yapacağı hesaplanır.',
        en: 'Credit rating: Default and Fully Paid are absorbing states. Fundamental matrix $N = (I-Q)^{-1}$ calculates expected months until default.'
      },
      vocabTerms: [
        { term_en: 'absorbing state', explanation_tr: 'Zincirin içine girdikten sonra bir daha ayrılamadığı durum ($p_{ii} = 1$).', explanation_en: 'A state that once entered, cannot be left ($p_{ii} = 1$).', exampleSentence_en: 'Bankruptcy is an absorbing state in credit risk transition models.' }
      ],
      questions: [
        {
          id: 'm12-l4-q1',
          type: 'multiple_choice',
          prompt: { tr: 'Yutucu Markov zincirinde Temel Matris $N$ hangi formülle hesaplanır?', en: 'What formula calculates the Fundamental Matrix $N$ in absorbing Markov chains?' },
          options: [
            { tr: 'N = (I - Q)^(-1)', en: 'N = (I - Q)^(-1)' },
            { tr: 'N = I + Q', en: 'N = I + Q' },
            { tr: 'N = Q * R', en: 'N = Q * R' },
            { tr: 'N = (I - R)^(-1)', en: 'N = (I - R)^(-1)' }
          ],
          correctAnswer: 'N = (I - Q)^(-1)',
          explanation: { tr: 'Geçici durumların geometrik serisi toplamından $N = (I - Q)^{-1}$ temel matrisi türetilir.', en: 'Fundamental matrix $N = (I - Q)^{-1}$ inverts the transient transition identity difference.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=DTERS(BİRİM.MATRİS - Q_Matrisi)',
        pythonCode: 'import numpy as np\nI = np.eye(Q.shape[0])\nN = np.linalg.inv(I - Q)\nt = N.dot(np.ones(Q.shape[0]))',
        powerBiNote: { tr: 'Müşteri yaşam süresi (Customer Lifetime) tahmininde $t = N\\mathbf{1}$ kullanılır.', en: 'Customer lifetime is modeled via $t = N\\mathbf{1}$.' }
      }
    }
  ];
  return m;
});

// -----------------------------------------------------------------
// 13. MODULE 13: Kombinatorik & Sayma Yöntemleri (ENGR 200)
// -----------------------------------------------------------------
updateModule('module13.json', (m) => {
  m.lessons = [
    {
      id: 'm13-l1',
      moduleId: 'module-13',
      order: 1,
      difficulty: 'basit',
      title: { tr: 'Temel Sayma İlkesi & Faktöriyel ($n!$)', en: 'Fundamental Counting Principle & Factorial ($n!$)' },
      conceptCard: {
        tr: '1. **Çarpma Kuralı:** Birinci işlem $n_1$, ikinci işlem $n_2$, $\\dots$, $k$. işlem $n_k$ yolla yapılabiliyorsa tüm dizi $n_1 \\times n_2 \\times \\dots \\times n_k$ yolla yapılabilir.\n2. **Toplama Kuralı:** Ayrık $k$ farklı seçenekten biri $n_1 + n_2 + \\dots + n_k$ yolla seçilir.\n3. **Faktöriyel:** $n$ farklı nesnenin yan yana diziliş sayısı:\n$$n! = n \\times (n-1) \\times \\dots \\times 2 \\times 1, \\quad 0! = 1$$',
        en: '1. **Product Rule:** Sequence of $k$ tasks with $n_1, \\dots, n_k$ ways has $n_1 \\times \\dots \\times n_k$ total paths.\n2. **Sum Rule:** Disjoint choices add up: $n_1 + \\dots + n_k$.\n3. **Factorial:** Total linear arrangements of $n$ distinct items:\n$$n! = n \\times (n-1) \\dots 1, \\quad 0! = 1$$'
      },
      companyExample: {
        tr: 'CyberPass şifre politikasında 8 haneli bir şifrede her hane 26 harf veya 10 rakam (36 seçenek) alabiliyorsa toplam şifre uzayı $36^8 = 2.82 \\times 10^{12}$ kombinasyondur.',
        en: 'CyberPass 8-character password with 36 alphanumeric choices creates $36^8 = 2.82 \\times 10^{12}$ combinations.'
      },
      vocabTerms: [
        { term_en: 'factorial', explanation_tr: '1\'den n\'e kadar olan tüm pozitif tam sayıların çarpımı ($n!$).', explanation_en: 'The product of all positive integers less than or equal to n.', exampleSentence_en: 'There are 5! = 120 ways to arrange 5 books on a shelf.' }
      ],
      questions: [
        {
          id: 'm13-l1-q1',
          type: 'numeric',
          prompt: { tr: '5 farklı ürün vitrinde yan yana kaç farklı şekilde sıralanabilir ($5!$)?', en: 'How many ways can 5 distinct products be arranged in a display ($5!$)?' },
          correctAnswer: 120,
          explanation: { tr: '$$5! = 5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$$', en: '$$5! = 120$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=ÇARPINIM(5)',
        pythonCode: 'import math\nmath.factorial(5)',
        powerBiNote: { tr: 'Permütasyon uzay büyüklükleri logaritmik ölçekte gösterilir.', en: 'Logarithmic scale displays combinatorial spaces.' }
      }
    },
    {
      id: 'm13-l2',
      moduleId: 'module-13',
      order: 2,
      difficulty: 'orta',
      title: { tr: 'Permütasyon (Sıralı Seçim)', en: 'Permutation (Ordered Selection)' },
      conceptCard: {
        tr: '1. **Permütasyon ($P(n,k)$):** $n$ farklı nesne arasından sıranın ÖNEMLİ olduğu $k$ elemanlı sıralı seçim:\n$$P(n,k) = \\frac{n!}{(n-k)!} = n(n-1)\\dots(n-k+1)$$\n2. **Tekrarlı Permütasyon:** Toplam $n$ nesneden $n_1$ tanesi özdeş A, $n_2$ tanesi özdeş B ise:\n$$\\frac{n!}{n_1! n_2! \\dots n_r!}$$',
        en: '1. **Permutation ($P(n,k)$):** Ordered arrangement of $k$ elements selected from $n$ distinct elements:\n$$P(n,k) = \\frac{n!}{(n-k)!}$$\n2. **Permutation with Repetition:**\n$$\\frac{n!}{n_1! n_2! \\dots n_r!}$$'
      },
      companyExample: {
        tr: '10 aday arasından 1 Başkan, 1 Başkan Yardımcısı ve 1 Sayman seçimi sıralı olduğu için $P(10,3) = 10 \\times 9 \\times 8 = 720$ farklı yolla yapılabilir.',
        en: 'Electing President, VP, Treasurer from 10 candidates is an ordered permutation $P(10,3) = 720$.'
      },
      vocabTerms: [
        { term_en: 'permutation', explanation_tr: 'Elemanların sıralamasının önemli olduğu seçim veya diziliş ($P(n,k)$).', explanation_en: 'An arrangement of objects in a specific order.', exampleSentence_en: 'PIN codes are permutations where digit order matters.' }
      ],
      questions: [
        {
          id: 'm13-l2-q1',
          type: 'numeric',
          prompt: { tr: '6 koşucu arasından ilk 3 derece (1., 2. ve 3.) kaç farklı şekilde oluşabilir ($P(6,3)$)?', en: 'How many ways can 1st, 2nd, and 3rd place be awarded among 6 runners ($P(6,3)$)?' },
          correctAnswer: 120,
          explanation: { tr: '$$P(6,3) = \\frac{6!}{(6-3)!} = 6 \\times 5 \\times 4 = 120$$', en: '$$P(6,3) = 6 \\times 5 \\times 4 = 120$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=PERMÜTASYON(6; 3)',
        pythonCode: 'import math\nmath.perm(6, 3)',
        powerBiNote: { tr: 'Sıralı seçim olasılık hesaplarında kullanılır.', en: 'Applied in ranking sequence probability.' }
      }
    },
    {
      id: 'm13-l3',
      moduleId: 'module-13',
      order: 3,
      difficulty: 'orta',
      title: { tr: 'Kombinasyon (Sırasız Grup Seçimi)', en: 'Combination (Unordered Group Selection)' },
      conceptCard: {
        tr: '$n$ eleman arasından sıranın ÖNEMSİZ olduğu $k$ elemanlı bir alt küme / grup seçimi:\n\n$$C(n,k) = \\binom{n}{k} = \\frac{n!}{k!(n-k)!}$$\n\n**Temel Özellikler:**\n- $\\binom{n}{k} = \\binom{n}{n-k}$ (Simetri)\n- $\\binom{n}{0} = \\binom{n}{n} = 1$',
        en: 'Unordered selection of $k$ items from a collection of $n$ distinct items:\n\n$$C(n,k) = \\binom{n}{k} = \\frac{n!}{k!(n-k)!}$$\n\n**Key Properties:**\n- $\\binom{n}{k} = \\binom{n}{n-k}$ (Symmetry)\n- $\\binom{n}{0} = \\binom{n}{n} = 1$'
      },
      companyExample: {
        tr: 'DataTeam 10 veri analisti arasından sırasız 4 kişilik bir proje ekibi kuracaktır (`CEx`). Seçenek sayısı $\\binom{10}{4} = \\frac{10 \\times 9 \\times 8 \\times 7}{4 \\times 3 \\times 2 \\times 1} = 210$ farklı ekiptir.',
        en: 'Forming a 4-person team from 10 analysts: $\\binom{10}{4} = 210$ distinct unordered teams.'
      },
      vocabTerms: [
        { term_en: 'combination', explanation_tr: 'Sıralamanın önemsiz olduğu alt küme seçimi ($C(n,k)$).', explanation_en: 'A selection of items from a set that has distinct members, where order does not matter.', exampleSentence_en: 'Lottery draws are combinations because ticket numbers can be matched in any order.' }
      ],
      questions: [
        {
          id: 'm13-l3-q1',
          type: 'numeric',
          prompt: { tr: '8 kişilik bir gruptan 2 temsilci kaç farklı şekilde seçilebilir ($\\binom{8}{2}$)?', en: 'How many ways can 2 delegates be selected from 8 people ($\\binom{8}{2}$)?' },
          correctAnswer: 28,
          explanation: { tr: '$$\\binom{8}{2} = \\frac{8 \\times 7}{2 \\times 1} = 28$$', en: '$$\\binom{8}{2} = \\frac{8 \\times 7}{2} = 28$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=KOMBİNASYON(8; 2)',
        pythonCode: 'import math\nmath.comb(8, 2)',
        powerBiNote: { tr: 'A/B test çoklu varyasyon çiftleri kombinasyonla listelenir.', en: 'A/B multi-arm test pairs are calculated via combinations.' }
      }
    },
    {
      id: 'm13-l4',
      moduleId: 'module-13',
      order: 4,
      difficulty: 'orta-ustu',
      title: { tr: 'Binom Teoremi & Pascal Özdeşlikleri', en: 'Binomial Theorem & Pascal Identities' },
      conceptCard: {
        tr: '1. **Binom Teoremi:**\n$$(x + y)^n = \\sum_{k=0}^n \\binom{n}{k} x^{n-k} y^k$$\n\n2. **Pascal Özdeşliği:**\n$$\\binom{n}{k} = \\binom{n-1}{k-1} + \\binom{n-1}{k}$$\nPascal üçgeninde her sayı üstündeki iki sayının toplamıdır.\n\n3. **Toplam Özdeşliği:** $\\sum_{k=0}^n \\binom{n}{k} = 2^n$ ($n$ elemanlı kümenin tüm alt kümeleri).',
        en: '1. **Binomial Theorem:**\n$$(x + y)^n = \\sum_{k=0}^n \\binom{n}{k} x^{n-k} y^k$$\n\n2. **Pascal\'s Identity:**\n$$\\binom{n}{k} = \\binom{n-1}{k-1} + \\binom{n-1}{k}$$\n\n3. **Sum of Binomial Coefficients:** $\\sum_{k=0}^n \\binom{n}{k} = 2^n$'
      },
      companyExample: {
        tr: 'Bir yatırım portföyünde 5 bağımsız hissenin her biri yükselebilir veya düşebilir ($2^5 = 32$ olası senaryo). Tam 3 hissenin yükselme katsayısı $\\binom{5}{3} = 10$\'dur.',
        en: '5 stocks each either rise or fall ($2^5=32$ total market paths). Exactly 3 rising stocks corresponds to $\\binom{5}{3} = 10$ paths.'
      },
      vocabTerms: [
        { term_en: 'binomial theorem', explanation_tr: 'İki terimli bir ifadenin kuvvet açılımını veren kombinatorik teorem.', explanation_en: 'A theorem providing the algebraic expansion of powers of a binomial.', exampleSentence_en: 'Binomial distribution probabilities are terms from the binomial theorem expansion.' }
      ],
      questions: [
        {
          id: 'm13-l4-q1',
          type: 'numeric',
          prompt: { tr: '$(x + y)^4$ açılımında $x^2 y^2$ teriminin katsayısı ($\\binom{4}{2}$) kaçtır?', en: 'In $(x + y)^4$, what is the coefficient of $x^2 y^2$ ($\\binom{4}{2}$)?' },
          correctAnswer: 6,
          explanation: { tr: '$$\\binom{4}{2} = \\frac{4 \\times 3}{2 \\times 1} = 6$$', en: '$$\\binom{4}{2} = 6$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=KOMBİNASYON(4; 2)',
        pythonCode: 'import numpy as np\n[math.comb(4, k) for k in range(5)]',
        powerBiNote: { tr: 'Olasılık ağaçlarında katsayı ağırlıkları kullanılır.', en: 'Used for probability tree branch weights.' }
      }
    }
  ];
  return m;
});

// -----------------------------------------------------------------
// 14. MODULE 14: Koşullu Olasılık & Bayes Teoremi (ENGR 200)
// -----------------------------------------------------------------
updateModule('module14.json', (m) => {
  m.lessons = [
    {
      id: 'm14-l1',
      moduleId: 'module-14',
      order: 1,
      difficulty: 'orta',
      title: { tr: 'Koşullu Olasılık & Olayların Bağımsızlığı', en: 'Conditional Probability & Independence' },
      conceptCard: {
        tr: '1. **Koşullu Olasılık ($P(A \\mid B)$):** $B$ olayının gerçekleştiği bilindiğinde $A$\'nın gerçekleşme olasılığıdır (Örneklem uzayı $B$\'ye daralır):\n$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}, \\quad P(B) > 0$$\n\n2. **Bağımsızlık:** $A$ ve $B$ bağımsız ise $B$\'nin bilinmesi $A$\'nın olasılığını değiştirmez:\n$$P(A \\mid B) = P(A) \\iff P(A \\cap B) = P(A)P(B)$$',
        en: '1. **Conditional Probability ($P(A \\mid B)$):** Probability of event $A$ given that $B$ has occurred:\n$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}, \\quad P(B) > 0$$\n\n2. **Independence:**\n$$P(A \\mid B) = P(A) \\iff P(A \\cap B) = P(A)P(B)$$'
      },
      companyExample: {
        tr: 'Bir müşterinin sepete ürün ekleme olasılığı $P(B) = 0.25$, sepete ekleyip satın alma olasılığı $P(A \\cap B) = 0.20$ ise, sepete ekleyen müşterinin satın alma koşullu olasılığı $P(A|B) = 0.20 / 0.25 = 0.80$ (%80)\'dir.',
        en: 'Cart add $P(B)=0.25$, add and buy $P(A \\cap B)=0.20$. Checkout given cart add $P(A|B) = 0.20 / 0.25 = 0.80$.'
      },
      vocabTerms: [
        { term_en: 'conditional probability', explanation_tr: 'Başka bir olayın gerçekleştiği ön bilgisi altında bir olayın olasılığı ($P(A|B)$).', explanation_en: 'The probability of an event occurring given that another event has already occurred.', exampleSentence_en: 'Conditional probability models conversion rate conditioned on marketing channel.' }
      ],
      questions: [
        {
          id: 'm14-l1-q1',
          type: 'numeric',
          prompt: { tr: '$P(B) = 0.50$ ve $P(A \\cap B) = 0.15$ ise Koşullu Olasılık $P(A \\mid B)$ kaçtır?', en: 'If $P(B) = 0.50$ and $P(A \\cap B) = 0.15$, what is $P(A \\mid B)$?' },
          correctAnswer: 0.3,
          explanation: { tr: '$$P(A \\mid B) = \\frac{0.15}{0.50} = 0.30$$', en: '$$P(A \\mid B) = 0.15 / 0.50 = 0.30$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=P_AnB / P_B',
        pythonCode: 'p_a_given_b = p_a_and_b / p_b',
        powerBiNote: { tr: 'Huni (funnel) adımlarında koşullu dönüşüm oranları izlenir.', en: 'Conversion funnels display step-by-step conditional rates.' }
      }
    },
    {
      id: 'm14-l2',
      moduleId: 'module-14',
      order: 2,
      difficulty: 'orta-ustu',
      title: { tr: 'Toplam Olasılık Yasası (Law of Total Probability)', en: 'Law of Total Probability' },
      conceptCard: {
        tr: 'Örneklem uzayı $S$, birbirini dışlayan (ayrık) ve evreni kaplayan bölüntülere ($B_1, B_2, \\dots, B_k$) ayrıldığında, herhangi bir $A$ olayının toplam marjinal olasılığı:\n\n$$P(A) = \\sum_{i=1}^k P(A \\mid B_i) P(B_i)$$\n\n$$P(A) = P(A \\mid B_1)P(B_1) + P(A \\mid B_2)P(B_2) + \\dots + P(A \\mid B_k)P(B_k)$$',
        en: 'When sample space $S$ is partitioned into disjoint exhaustive subsets $B_1, \\dots, B_k$:\n\n$$P(A) = \\sum_{i=1}^k P(A \\mid B_i) P(B_i)$$\n\n$$P(A) = P(A \\mid B_1)P(B_1) + \\dots + P(A \\mid B_k)P(B_k)$$'
      },
      companyExample: {
        tr: 'Ürünlerin %60\'ı Fabrika 1\'den ($P(B_1)=0.60$, hata %2), %40\'ı Fabrika 2\'den ($P(B_2)=0.40$, hata %5) üretilmektedir. Rastgele bir ürünün kusurlu olma toplam olasılığı: $P(\\text{Kusur}) = (0.02)(0.60) + (0.05)(0.40) = 0.012 + 0.020 = 0.032$ (%3.2).',
        en: 'Factory 1 produces 60% with 2% defects; Factory 2 produces 40% with 5% defects. Total defect rate $P(D) = 0.02(0.60) + 0.05(0.40) = 0.032$.'
      },
      vocabTerms: [
        { term_en: 'law of total probability', explanation_tr: 'Bir olayın olasılığını tüm olası senaryoların koşullu olasılıklarının ağırlıklı toplamı olarak hesaplayan kural.', explanation_en: 'A theorem that expresses the total probability of an outcome which can be realized via several distinct events.', exampleSentence_en: 'The law of total probability forms the denominator of Bayes theorem.' }
      ],
      questions: [
        {
          id: 'm14-l2-q1',
          type: 'numeric',
          prompt: { tr: '$P(B_1) = 0.70, P(A|B_1) = 0.10$ ve $P(B_2) = 0.30, P(A|B_2) = 0.20$ ise $P(A)$ kaçtır?', en: 'If $P(B_1) = 0.70, P(A|B_1) = 0.10$ and $P(B_2) = 0.30, P(A|B_2) = 0.20$, what is $P(A)$?' },
          correctAnswer: 0.13,
          explanation: { tr: '$$P(A) = (0.10 \\times 0.70) + (0.20 \\times 0.30) = 0.07 + 0.06 = 0.13$$', en: '$$P(A) = 0.07 + 0.06 = 0.13$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=TOPLA.ÇARPIM(Koşullu_Olasılıklar; Prior_Olasılıklar)',
        pythonCode: 'p_total = sum(p_cond * p_prior for p_cond, p_prior in zip(conds, priors))',
        powerBiNote: { tr: 'Ağaç haritası (Tree map) ile ağırlıklı toplam gösterilir.', en: 'Decompose total probability using Tree maps.' }
      }
    },
    {
      id: 'm14-l3',
      moduleId: 'module-14',
      order: 3,
      difficulty: 'orta-ustu',
      title: { tr: 'Bayes Teoremi (Prior / Posterior Analizi)', en: 'Bayes Theorem (Prior / Posterior Analysis)' },
      conceptCard: {
        tr: 'Yeni bir kanıt ($A$) gözlemlendiğinde önsel inançları ($P(B_j)$) güncelleyerek sonsal olasılığı ($P(B_j \\mid A)$) hesaplama yöntemi:\n\n$$P(B_j \\mid A) = \\frac{P(A \\mid B_j) P(B_j)}{P(A)} = \\frac{P(A \\mid B_j) P(B_j)}{\\sum_{i=1}^k P(A \\mid B_i) P(B_i)}$$\n\n- **Prior (Önsel):** $P(B_j)$ (Kanıt öncesi olasılık)\n- **Likelihood (Olabilirlik):** $P(A \\mid B_j)$\n- **Posterior (Sonsal):** $P(B_j \\mid A)$ (Kanıt sonrası güncellenmiş olasılık)',
        en: 'Updating prior beliefs given new evidence ($A$):\n\n$$P(B_j \\mid A) = \\frac{P(A \\mid B_j) P(B_j)}{\\sum P(A \\mid B_i) P(B_i)}$$\n\n- **Prior:** $P(B_j)$ (Pre-test baseline probability)\n- **Likelihood:** $P(A \\mid B_j)$\n- **Posterior:** $P(B_j \\mid A)$ (Updated probability given evidence)'
      },
      companyExample: {
        tr: 'Kusurlu çıkan bir parçanın ($P(D)=0.032$) Fabrika 2\'den gelmiş olma sonsal olasılığı: $P(B_2|D) = \\frac{0.05 \\times 0.40}{0.032} = \\frac{0.020}{0.032} = 0.625$ (%62.5).',
        en: 'Defective item originated from Factory 2: $P(B_2|D) = \\frac{0.05(0.40)}{0.032} = 0.625$ (62.5% posterior probability).'
      },
      vocabTerms: [
        { term_en: 'posterior probability', explanation_tr: 'Yeni bir kanıt veya veri gözlemlendikten sonra güncellenen olasılık ($P(B|A)$).', explanation_en: 'The revised probability of an event occurring after taking into consideration new information.', exampleSentence_en: 'Bayes theorem updates prior beliefs into posterior probabilities.' }
      ],
      questions: [
        {
          id: 'm14-l3-q1',
          type: 'numeric',
          prompt: { tr: 'Prior $P(B) = 0.20$, Likelihood $P(A|B) = 0.80$ ve marjinal $P(A) = 0.40$ ise Posterior $P(B|A)$ kaçtır?', en: 'If Prior $P(B)=0.20$, Likelihood $P(A|B)=0.80$, and marginal $P(A)=0.40$, what is Posterior $P(B|A)$?' },
          correctAnswer: 0.4,
          explanation: { tr: '$$P(B \\mid A) = \\frac{0.80 \\times 0.20}{0.40} = \\frac{0.16}{0.40} = 0.40$$', en: '$$P(B \\mid A) = 0.16 / 0.40 = 0.40$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=(Likelihood * Prior) / Toplam_Olasılık',
        pythonCode: 'posterior = (likelihood * prior) / p_evidence',
        powerBiNote: { tr: 'Bayes risk güncelleme panolarında kullanılır.', en: 'Applied in Bayesian risk scoring dashboards.' }
      }
    },
    {
      id: 'm14-l4',
      moduleId: 'module-14',
      order: 4,
      difficulty: 'zor',
      title: { tr: 'Duyarlılık, Özgüllük ve Taban Oran Yanılsaması', en: 'Sensitivity, Specificity & Base Rate Fallacy' },
      conceptCard: {
        tr: 'Tıbbi teşhis ve güvenlik taramalarındaki yanılsama (`MedTech Case`):\n\n1. **Duyarlılık (Sensitivity / Recall):** Hasta olanı tespit etme gücü: $P(+\\mid \\text{Hasta})$\n2. **Özgüllük (Specificity):** Sağlıklı olanı negatif bulma gücü: $P(-\\mid \\text{Sağlıklı})$\n3. **Taban Oran Yanılsaması (Base Rate Fallacy):**\nHastalık toplumda çok nadir ise ($P(\\text{Hasta}) = 0.001$), test %99 doğru olsa bile test sonucu pozitif çıkan birinin **gerçekten hasta olma olasılığı (Posterior)** şaşırtıcı şekilde çok düşük çıkabilir (~%9). Pozitiflerin çoğu yalancı pozitiflerdir.',
        en: 'Diagnostic metrics and the false positive paradox (`MedTech Case`):\n\n1. **Sensitivity:** True positive rate $P(+ \\mid \\text{Disease})$\n2. **Specificity:** True negative rate $P(- \\mid \\text{Healthy})$\n3. **Base Rate Fallacy:** When a condition is rare ($P(\\text{Disease})=0.001$), even a 99% accurate test yields a low posterior $P(\\text{Disease} \\mid +) \\approx 9\\%$ due to false positives dominating rare true positives.'
      },
      companyExample: {
        tr: 'SOC siber güvenlik alarmı %99 duyarlılıkla çalışır. Ancak siber saldırılar nadir ($0.0001$) olduğu için gelen 100 alarmın 95\'i zararsız yalancı alarmdır (Base rate fallacy).',
        en: 'SOC cyber security alerts: 99% accuracy on a 0.0001 threat prevalence results in 95% false alarms due to base rate fallacy.'
      },
      vocabTerms: [
        { term_en: 'base rate fallacy', explanation_tr: 'Nadir olaylarda taban yaygınlık oranını göz ardı edip teste aşırı güvenme yanılgısı.', explanation_en: 'Prematurely judging conditional probabilities without considering the prior base rate prevalence.', exampleSentence_en: 'Base rate fallacy explains why mass screening tests produce high false positive proportions.' }
      ],
      questions: [
        {
          id: 'm14-l4-q1',
          type: 'multiple_choice',
          prompt: { tr: 'Toplumda çok nadir görülen bir hastalık için test sonucu POZİTİF çıkan birinin gerçekte hasta olma olasılığının düşük çıkmasının temel sebebi nedir?', en: 'Why is the posterior probability of disease low after a positive test when disease is extremely rare?' },
          options: [
            { tr: 'Taban oranının çok düşük olması ve sağlıklı kişilerden gelen yanlış pozitiflerin sayısının gerçek hastaları aşması', en: 'Low base rate causing false positives to outnumber true positives' },
            { tr: 'Testin bozuk olması', en: 'Test is broken' },
            { tr: 'Duyarlılığın sıfır olması', en: 'Sensitivity is zero' },
            { tr: 'Bayes teoreminin nadir olaylarda çalışmaması', en: 'Bayes theorem failing on rare events' }
          ],
          correctAnswer: 'Taban oranının çok düşük olması ve sağlıklı kişilerden gelen yanlış pozitiflerin sayısının gerçek hastaları aşması',
          explanation: { tr: 'Sağlıklı popülasyon devasa olduğu için %1\'lik küçük hata payı bile gerçek hasta sayısından çok daha fazla yalancı pozitif üretir.', en: 'Huge healthy base generates more total false positives than the tiny true positive cases.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=(Sensitivity * Prevalence) / Total_Positive',
        pythonCode: 'p_disease_given_pos = (sens * prev) / (sens * prev + (1 - spec) * (1 - prev))',
        powerBiNote: { tr: 'Karmaşıklık matrisi (Confusion Matrix) görseli kullanılır.', en: 'Render Confusion Matrix visuals.' }
      }
    }
  ];
  return m;
});

// -----------------------------------------------------------------
// 15. MODULE 15: Poisson Süreçleri & Üstel Dağılım (ENGR 200)
// -----------------------------------------------------------------
updateModule('module15.json', (m) => {
  m.lessons = [
    {
      id: 'm15-l1',
      moduleId: 'module-15',
      order: 1,
      difficulty: 'orta',
      title: { tr: 'Poisson Dağılımı ve Oran Parametresi $\lambda$', en: 'Poisson Distribution & Rate Parameter $\lambda$' },
      conceptCard: {
        tr: 'Belirli bir zaman veya alan aralığında gerçekleşen bağımsız olay sayısı dağılımı (`ENGR 200`):\n\n$$P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}, \\quad k = 0, 1, 2, \\dots$$\n\n- $\\lambda$: Birim aralıktaki ortalama varış/olay sayısı.\n- **Kritik Eşitlik:** $$E[X] = Var(X) = \\lambda$$\nOrtalama ile varyans birbirine eşittir.',
        en: 'Probability of observing $k$ events in a fixed interval of time or space (`ENGR 200`):\n\n$$P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}, \\quad k = 0, 1, 2, \\dots$$\n\n- $\\lambda$: Average arrival rate.\n- **Crucial Identity:** $$E[X] = Var(X) = \\lambda$$'
      },
      companyExample: {
        tr: 'Bir çağrı merkezine saatte ortalama $\\lambda = 4$ çağrı gelmektedir. Önümüzdeki 1 saatte tam 2 çağrı gelme olasılığı: $P(X = 2) = \\frac{4^2 e^{-4}}{2!} = \\frac{16 \\times 0.0183}{2} = 0.1465$ (%14.65).',
        en: 'Call center arrival $\\lambda = 4$ calls/hour. Probability of exactly 2 calls: $P(X=2) = \\frac{4^2 e^{-4}}{2!} = 0.1465$.'
      },
      vocabTerms: [
        { term_en: 'Poisson distribution', explanation_tr: 'Sabit ortalama oranla gerçekleşen bağımsız olayların sayısını modelleyen kesikli dağılım.', explanation_en: 'A discrete probability distribution expressing the probability of a given number of events occurring in a fixed interval.', exampleSentence_en: 'Poisson distribution models website visits per minute.' }
      ],
      questions: [
        {
          id: 'm15-l1-q1',
          type: 'numeric',
          prompt: { tr: 'Beklenen değeri $E[X] = 9$ olan bir Poisson dağılımında Standart Sapma ($\sigma$) kaçtır?', en: 'For a Poisson distribution with $E[X] = 9$, what is standard deviation $\sigma$?' },
          correctAnswer: 3,
          explanation: { tr: '$$Var(X) = \\lambda = 9 \\implies \\sigma = \\sqrt{9} = 3$$', en: '$$Var(X) = 9 \\implies \\sigma = \\sqrt{9} = 3$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=POISSON.DAĞ(k; lambda; YANLIŞ)',
        pythonCode: 'from scipy.stats import poisson\npoisson.pmf(k=2, mu=4)',
        powerBiNote: { tr: 'Kapasite kuyruk modeli simülasyonlarında kullanılır.', en: 'Applied in queuing theory capacity planning.' }
      }
    },
    {
      id: 'm15-l2',
      moduleId: 'module-15',
      order: 2,
      difficulty: 'orta-ustu',
      title: { tr: 'Üstel Dağılım & Hafızasızlık Özelliği', en: 'Exponential Distribution & Memoryless Property' },
      conceptCard: {
        tr: 'Poisson sürecinde ardışık olaylar arası bekleme süresi ($T$) **Üstel Dağılıma** uyar (`ENGR 200`):\n\n1. **Yoğunluk ($PDF$):** $f(t) = \\lambda e^{-\\lambda t}, \\quad t \\ge 0$\n2. **Kümülatif ($CDF$):** $F(t) = P(T \\le t) = 1 - e^{-\\lambda t}$\n3. **Beklenen Değer & Varyans:** $E[T] = \\frac{1}{\\lambda}, \\quad Var(T) = \\frac{1}{\\lambda^2}$\n4. **Hafızasızlık (Memoryless Property):**\n$$P(T > s + t \\mid T > s) = P(T > t)$$\nGeçmişte geçen süre gelecekteki bekleme süresini etkilemez.',
        en: 'Inter-arrival times ($T$) in a Poisson process follow the **Exponential Distribution** (`ENGR 200`):\n\n1. **PDF:** $f(t) = \\lambda e^{-\\lambda t}, \\quad t \\ge 0$\n2. **CDF:** $F(t) = P(T \\le t) = 1 - e^{-\\lambda t}$\n3. **Moments:** $E[T] = 1/\\lambda, \\quad Var(T) = 1/\\lambda^2$\n4. **Memoryless Property:**\n$$P(T > s + t \\mid T > s) = P(T > t)$$'
      },
      companyExample: {
        tr: 'Saatlik geliş oranı $\\lambda = 6$ ise ortalama çağrı bekleme süresi $E[T] = 1/6 \\text{ saat} = 10 \\text{ dakika}$\'dır. 5 dakika beklemiş olmanız, bundan sonra 10 dakika daha bekleme olasılığınızı değiştirmez (hafızasızlık).',
        en: 'Arrival rate $\\lambda = 6$/h implies mean wait $E[T] = 10$ mins. Having waited 5 mins does not alter remaining wait distribution.'
      },
      vocabTerms: [
        { term_en: 'memoryless property', explanation_tr: 'Geçmişte geçen sürenin gelecekteki bekleme süresi olasılığını etkilememesi özelliği.', explanation_en: 'The property where future probabilities do not depend on elapsed past time.', exampleSentence_en: 'The exponential distribution is the only continuous distribution with the memoryless property.' }
      ],
      questions: [
        {
          id: 'm15-l2-q1',
          type: 'multiple_choice',
          prompt: { tr: 'Sürekli dağılımlar arasında hafızasızlık (memoryless) özelliğine sahip TEK dağılım hangisidir?', en: 'Which is the ONLY continuous distribution possessing the memoryless property?' },
          options: [
            { tr: 'Üstel (Exponential) Dağılım', en: 'Exponential Distribution' },
            { tr: 'Normal Dağılım', en: 'Normal Distribution' },
            { tr: 'Düzgün (Uniform) Dağılım', en: 'Uniform Distribution' },
            { tr: 'T-Dağılımı', en: 'T-Distribution' }
          ],
          correctAnswer: 'Üstel (Exponential) Dağılım',
          explanation: { tr: 'Sürekli dünyada yalnızca Üstel Dağılım; kesikli dünyada ise Geometrik Dağılım hafızasızdır.', en: 'Exponential is uniquely memoryless among continuous probability distributions.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=ÜSTEL.DAĞ(x; lambda; DOĞRU)',
        pythonCode: 'from scipy.stats import expon\nexpon.cdf(t, scale=1/lambda_rate)',
        powerBiNote: { tr: 'Ortalama Arıza Aralığı (MTBF) hesaplarında kullanılır.', en: 'Used for Mean Time Between Failures (MTBF) KPIs.' }
      }
    },
    {
      id: 'm15-l3',
      moduleId: 'module-15',
      order: 3,
      difficulty: 'orta-ustu',
      title: { tr: 'Nadir Olaylar & Binom-Poisson Yaklaşımı', en: 'Rare Events & Poisson Approximation to Binomial' },
      conceptCard: {
        tr: 'Deneme sayısı çok büyük ($n \\to \\infty$) ve başarı olasılığı çok küçük ($p \\to 0$) olduğunda Binom dağılımı $\\lambda = np$ parametreli Poisson dağılımına yakınsar (`Law of Rare Events`):\n\n$$Binomial(n, p) \\approx Poisson(\\lambda = np)$$\n\n- **Kural:** $n \\ge 100$ ve $p \\le 0.05$ ve $np < 10$ olduğunda Poisson yaklaşımı mükemmel doğruluk sağlar.',
        en: 'When $n$ is very large ($n \\to \\infty$) and $p$ is very small ($p \\to 0$), the Binomial distribution converges to Poisson with $\\lambda = np$ (`Law of Rare Events`):\n\n$$Binomial(n, p) \\approx Poisson(\\lambda = np)$$\n\n- **Guideline:** Valid when $n \\ge 100, p \\le 0.05$, and $np < 10$.'
      },
      companyExample: {
        tr: 'Bir fabrikada üretilen $n=2000$ entegre devrede arıza olasılığı $p = 0.001$\'dir. $\\lambda = 2000 \\times 0.001 = 2$. Karmaşık Binom yerine $\\lambda = 2$ Poisson formülüyle arıza sayısı modellenir.',
        en: 'Batch of $n=2000$ chips with defect rate $p=0.001$. Approximated via Poisson with $\\lambda = np = 2$.'
      },
      vocabTerms: [
        { term_en: 'law of rare events', explanation_tr: 'Büyük deneme ve küçük olasılıklarda Binom\'un Poisson\'a yakınsaması ilkesi.', explanation_en: 'A theorem stating that rare independent events over many trials follow a Poisson distribution.', exampleSentence_en: 'The law of rare events models server crash occurrences.' }
      ],
      questions: [
        {
          id: 'm15-l3-q1',
          type: 'numeric',
          prompt: { tr: '$n = 500$ ve $p = 0.004$ olan bir süreçte Poisson yaklaşım parametresi $\\lambda$ kaçtır?', en: 'For $n = 500$ and $p = 0.004$, what is the Poisson approximation parameter $\\lambda$?' },
          correctAnswer: 2,
          explanation: { tr: '$$\\lambda = np = 500 \\times 0.004 = 2$$', en: '$$\\lambda = 500 \\times 0.004 = 2$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=POISSON.DAĞ(k; n*p; YANLIŞ)',
        pythonCode: 'lambda_approx = n * p\npoisson.pmf(k, mu=lambda_approx)',
        powerBiNote: { tr: 'Sigortacılık ve kaza frekansı modellerinde kullanılır.', en: 'Applied in insurance risk modeling.' }
      }
    },
    {
      id: 'm15-l4',
      moduleId: 'module-15',
      order: 4,
      difficulty: 'orta-ustu',
      title: { tr: 'Poisson Süreçlerinde Toplanabilirlik & Bölünme', en: 'Superposition & Splitting of Poisson Processes' },
      conceptCard: {
        tr: '1. **Toplanabilirlik (Superposition):** Bağımsız iki Poisson süreci ($\\lambda_1$ ve $\\lambda_2$) birleştirildiğinde toplam süreç de bir Poisson sürecidir ve oranı:\n$$\\lambda_{toplam} = \\lambda_1 + \\lambda_2$$\n\n2. **Bölünme (Thinning / Splitting):** Oranı $\\lambda$ olan bir Poisson sürecinde her olay bağımsız olarak $p$ olasılıkla Tip 1, $1-p$ olasılıkla Tip 2 ise, oluşan alt süreçler bağımsız Poisson süreçleridir:\n$$\\lambda_1 = \\lambda p, \\quad \\lambda_2 = \\lambda (1-p)$$',
        en: '1. **Superposition:** Combining two independent Poisson processes with rates $\\lambda_1, \\lambda_2$ yields a Poisson process with rate:\n$$\\lambda_{total} = \\lambda_1 + \\lambda_2$$\n\n2. **Thinning (Splitting):** Splitting a Poisson process of rate $\\lambda$ where each arrival is classified Type 1 with probability $p$ yields independent Poisson streams with rates $\\lambda_1 = \\lambda p$ and $\\lambda_2 = \\lambda(1-p)$.'
      },
      companyExample: {
        tr: 'Bir web sitesine Masaüstünden saatte $\\lambda_1 = 30$, Mobilden $\\lambda_2 = 70$ istek gelmektedir. Toplam sunucu yükü $\\lambda_{toplam} = 30 + 70 = 100$ istek/saat olan birleşik Poisson sürecidir.',
        en: 'Desktop traffic $\\lambda_1 = 30$/h, Mobile $\\lambda_2 = 70$/h. Merged server workload is a Poisson process of rate $100$/h.'
      },
      vocabTerms: [
        { term_en: 'superposition', explanation_tr: 'Bağımsız Poisson süreçlerinin toplamının yine bir Poisson süreci olması.', explanation_en: 'The property where the sum of independent Poisson processes is also a Poisson process.', exampleSentence_en: 'Superposition simplifies multi-channel server traffic modeling.' }
      ],
      questions: [
        {
          id: 'm15-l4-q1',
          type: 'numeric',
          prompt: { tr: 'İki bağımsız girişten saatte $\\lambda_1 = 12$ ve $\\lambda_2 = 8$ çağrı geliyorsa toplam geliş oranı $\\lambda_{toplam}$ kaçtır?', en: 'If two independent channels arrive at $\\lambda_1 = 12$ and $\\lambda_2 = 8$, what is $\\lambda_{total}$?' },
          correctAnswer: 20,
          explanation: { tr: '$$\\lambda_{toplam} = 12 + 8 = 20$$', en: '$$\\lambda_{total} = 12 + 8 = 20$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=POISSON.DAĞ(k; lambda1 + lambda2; YANLIŞ)',
        pythonCode: 'lambda_combined = lambda_1 + lambda_2',
        powerBiNote: { tr: 'Trafik toplama ve yük dengeleme panellerinde kullanılır.', en: 'Applied in network load balancing analytics.' }
      }
    }
  ];
  return m;
});

// -----------------------------------------------------------------
// 16. MODULE 16: Sürekli Olasılık Dağılımları & Normal Eğri (ENGR 200)
// -----------------------------------------------------------------
updateModule('module16.json', (m) => {
  m.lessons = [
    {
      id: 'm16-l1',
      moduleId: 'module-16',
      order: 1,
      difficulty: 'basit',
      title: { tr: 'Sürekli Rastgele Değişken, PDF ve CDF', en: 'Continuous Random Variable, PDF and CDF' },
      conceptCard: {
        tr: '1. **Sürekli Değişken & Noktasal Olasılık:** Sürekli bir değişkende tek bir noktanın olasılığı **sıfırdır** ($P(X = c) = 0$). Olasılıklar daima bir aralık üzerindeki integral / alan ile hesaplanır.\n\n2. **Olasılık Yoğunluk Fonksiyonu ($PDF - f(x)$):**\n- $f(x) \\ge 0$\n- Toplam Alan: $\\int_{-\\infty}^{\\infty} f(x)dx = 1$\n- Aralık Olasılığı: $P(a \\le X \\le b) = \\int_a^b f(x)dx$\n\n3. **Kümülatif Dağılım ($CDF - F(x)$):** $F(x) = P(X \\le x) = \\int_{-\\infty}^x f(t)dt$',
        en: '1. **Continuous Variable:** Exact point probability is **zero** ($P(X = c) = 0$). Probabilities are measured over intervals as area under the curve.\n\n2. **Probability Density Function ($PDF - f(x)$):**\n- $f(x) \\ge 0, \\quad \\int_{-\\infty}^{\\infty} f(x)dx = 1$\n- Interval Probability: $P(a \\le X \\le b) = \\int_a^b f(x)dx$\n\n3. **Cumulative Distribution ($CDF - F(x)$):** $F(x) = \\int_{-\\infty}^x f(t)dt$'
      },
      companyExample: {
        tr: 'Bir siparişin teslimat süresi $X \\in [10, 30]$ dakika arasında tanımlıdır. Tam 20.0000000 dakikada teslimat olasılığı 0\'dır; ancak 19 ile 21 dakika arasında teslimat olasılığı $PDF$ integraliyle hesaplanır.',
        en: 'Delivery duration $X \\in [10, 30]$ mins. $P(X = 20.0000) = 0$; probability of delivering between 19 and 21 mins is the integral area.'
      },
      vocabTerms: [
        { term_en: 'probability density function', explanation_tr: 'Sürekli bir değişkenin eğri altındaki alanı ile olasılık üreten fonksiyon ($PDF$).', explanation_en: 'A function whose integral over an interval gives the probability that a continuous random variable falls within that interval.', exampleSentence_en: 'Total area under the PDF curve equals 1.' }
      ],
      questions: [
        {
          id: 'm16-l1-q1',
          type: 'multiple_choice',
          prompt: { tr: 'Sürekli bir $X$ rastgele değişkeni için tek bir $c$ noktasındaki olasılık $P(X = c)$ değeri kaçtır?', en: 'For a continuous random variable $X$, what is the exact point probability $P(X = c)$?' },
          options: [
            { tr: 'Tam olarak 0', en: 'Exactly 0' },
            { tr: '1', en: '1' },
            { tr: 'f(c) yoğunluk değerine eşittir', en: 'Equals f(c)' },
            { tr: 'Sonsuzdur', en: 'Infinity' }
          ],
          correctAnswer: 'Tam olarak 0',
          explanation: { tr: 'Sürekli dağılımlarda tek bir noktanın genişliği sıfır olduğu için noktasal olasılık her zaman 0\'dır.', en: 'Point probabilities are zero because width of a single point in continuous space is zero.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=NORM.DAĞ(b; mu; sigma; DOĞRU) - NORM.DAĞ(a; mu; sigma; DOĞRU)',
        pythonCode: 'from scipy.integrate import quad\nprob, _ = quad(pdf_function, a, b)',
        powerBiNote: { tr: 'Yoğunluk eğrisi (Density Area Chart) ile gösterilir.', en: 'Rendered via Area Density Charts.' }
      }
    },
    {
      id: 'm16-l2',
      moduleId: 'module-16',
      order: 2,
      difficulty: 'basit',
      title: { tr: 'Sürekli Düzgün Dağılım (Uniform)', en: 'Continuous Uniform Distribution' },
      conceptCard: {
        tr: '$[a, b]$ aralığında her alt aralığın eşit olasılığa sahip olduğu dikdörtgen dağılım:\n\n1. **$PDF$:** $f(x) = \\frac{1}{b - a}, \\quad a \\le x \\le b$\n2. **$CDF$:** $F(x) = \\frac{x - a}{b - a}$\n3. **Beklenen Değer & Varyans:**\n$$E[X] = \\frac{a + b}{2}, \\quad Var(X) = \\frac{(b - a)^2}{12}$$',
        en: 'Constant probability density over interval $[a, b]$:\n\n1. **$PDF$:** $f(x) = \\frac{1}{b - a}, \\quad a \\le x \\le b$\n2. **$CDF$:** $F(x) = \\frac{x - a}{b - a}$\n3. **Moments:** $E[X] = \\frac{a + b}{2}, \\quad Var(X) = \\frac{(b - a)^2}{12}$'
      },
      companyExample: {
        tr: 'Metro treni her 10 dakikada bir gelmektedir ($X \\sim Uniform(0, 10)$). Yolcunun ortalama bekleme süresi $E[X] = (0 + 10)/2 = 5$ dakika; 3 dakikadan az bekleme olasılığı $P(X \\le 3) = (3 - 0)/10 = 0.30$\'dur.',
        en: 'Train arrives uniformly every 10 mins ($X \\sim U(0, 10)$). Mean wait $E[X] = 5$ mins; $P(X \\le 3) = 0.30$.'
      },
      vocabTerms: [
        { term_en: 'uniform distribution', explanation_tr: 'Belirli bir aralıktaki tüm eşit uzunluktaki aralıkların eşit olasılığa sahip olduğu dağılım.', explanation_en: 'A symmetric probability distribution where all intervals of the same length on the distribution\'s support have equal probability.', exampleSentence_en: 'Random number generators sample from standard Uniform(0,1).' }
      ],
      questions: [
        {
          id: 'm16-l2-q1',
          type: 'numeric',
          prompt: { tr: '$X \\sim Uniform(0, 20)$ dağılımında varyans $Var(X)$ kaçtır?', en: 'For $X \\sim Uniform(0, 20)$, what is the variance $Var(X)$?' },
          correctAnswer: 33.33,
          explanation: { tr: '$$Var(X) = \\frac{(20 - 0)^2}{12} = \\frac{400}{12} \\approx 33.33$$', en: '$$Var(X) = 400 / 12 = 33.33$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=(x - a)/(b - a)',
        pythonCode: 'from scipy.stats import uniform\nuniform.cdf(x=3, loc=0, scale=10)',
        powerBiNote: { tr: 'Monte Carlo rassal sayı simülasyonlarında kullanılır.', en: 'Used in Monte Carlo baseline random draws.' }
      }
    },
    {
      id: 'm16-l3',
      moduleId: 'module-16',
      order: 3,
      difficulty: 'orta',
      title: { tr: 'Normal Dağılım ($N(\mu, \sigma^2)$) & Ampirik Kural', en: 'Normal Distribution ($N(\mu, \sigma^2)$) & Empirical Rule' },
      conceptCard: {
        tr: 'Doğadaki ve mühendislikteki süreçlerin çoğunu modelleyen simetrik çan eğrisi:\n\n$$f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}$$\n\n**Ampirik Kural (68 - 95 - 99.7 Kuralı):**\n1. $[\mu - \sigma, \mu + \sigma]$: Verilerin yaklaşık **%68.27**\'si\n2. $[\mu - 2\sigma, \mu + 2\sigma]$: Verilerin yaklaşık **%95.45**\'i\n3. $[\mu - 3\sigma, \mu + 3\sigma]$: Verilerin yaklaşık **%99.73**\'ü',
        en: 'The symmetric Gaussian bell curve modeling natural and industrial phenomena:\n\n$$f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}$$\n\n**Empirical Rule (68 - 95 - 99.7 Rule):**\n1. $\\mu \\pm 1\\sigma$: $\\approx \\mathbf{68.3\\%}$\n2. $\\mu \\pm 2\\sigma$: $\\approx \\mathbf{95.4\\%}$\n3. $\\mu \\pm 3\\sigma$: $\\approx \\mathbf{99.7\\%}$'
      },
      companyExample: {
        tr: 'Drone teslimat süreleri $\\mu = 25$ dk ve $\\sigma = 3$ dk ile normal dağılmaktadır. Teslimatların %95\'i $\\mu \\pm 2\\sigma = [25 - 6, 25 + 6] = [19, 31]$ dakika arasında gerçekleşir.',
        en: 'Drone delivery $\\mu = 25$ mins, $\\sigma = 3$ mins. 95% of all deliveries occur within $[19, 31]$ minutes.'
      },
      vocabTerms: [
        { term_en: 'empirical rule', explanation_tr: 'Normal dağılımda verilerin 1, 2 ve 3 standart sapma aralıklarındaki yüzdelerini veren 68-95-99.7 kuralı.', explanation_en: 'The 68-95-99.7 rule stating percentage of values within 1, 2, 3 standard deviations of the mean.', exampleSentence_en: 'By the empirical rule, 99.7% of points lie within 3 standard deviations.' }
      ],
      questions: [
        {
          id: 'm16-l3-q1',
          type: 'numeric',
          prompt: { tr: 'Ortalaması $\\mu = 100$ ve $\\sigma = 15$ olan normal dağılımda verilerin %95\'i hangi aralıktadır ($[\\mu-2\\sigma, \\mu+2\\sigma]$ üst sınırı kaçtır)?', en: 'For $\\mu = 100, \\sigma = 15$, what is the upper bound of the 95% interval ($[\\mu-2\\sigma, \\mu+2\\sigma]$)?' },
          correctAnswer: 130,
          explanation: { tr: '$$\\text{Üst Sınır} = \\mu + 2\\sigma = 100 + 2(15) = 130$$', en: '$$\\text{Upper Bound} = 100 + 2(15) = 130$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=NORM.DAĞ(x; mu; sigma; DOĞRU)',
        pythonCode: 'from scipy.stats import norm\nnorm.cdf(x, loc=mu, scale=sigma)',
        powerBiNote: { tr: 'Six Sigma kalite bantlarında $\\pm 3\\sigma$ limitleri çizilir.', en: 'Render $\\pm 3\\sigma$ Six Sigma control limit bands.' }
      }
    },
    {
      id: 'm16-l4',
      moduleId: 'module-16',
      order: 4,
      difficulty: 'orta',
      title: { tr: 'Standart Normal Dağılım ($Z$) & Z-Tablosu', en: 'Standard Normal Distribution ($Z$) & Z-Table' },
      conceptCard: {
        tr: 'Herhangi bir $N(\\mu, \\sigma^2)$ dağılımı $Z$-skoru dönüşümü ile Standart Normal $N(0, 1)$ dağılımına dönüştürülür:\n\n$$Z = \\frac{X - \\mu}{\\sigma}$$\n\n1. **$Z$-Tablosu:** $\\Phi(z) = P(Z \\le z)$ kümülatif alanını verir.\n2. **Simetri Kuralı:** $\\Phi(-z) = 1 - \\Phi(z)$\n3. **Ters Dönüşüm (Kuantil):** $X = \\mu + Z \\cdot \\sigma$',
        en: 'Transforming any $N(\\mu, \\sigma^2)$ into standard normal $Z \\sim N(0, 1)$:\n\n$$Z = \\frac{X - \\mu}{\\sigma}$$\n\n1. **$Z$-Table:** Gives cumulative area $\\Phi(z) = P(Z \\le z)$.\n2. **Symmetry:** $\\Phi(-z) = 1 - \\Phi(z)$.\n3. **Inverse Transformation:** $X = \\mu + Z \\cdot \\sigma$'
      },
      companyExample: {
        tr: 'Fabrika parça toleransında $\\mu = 50 \\text{ mm}, \\sigma = 2 \\text{ mm}$. $X = 54 \\text{ mm}$ parçasının $Z$-skoru $Z = (54 - 50)/2 = +2.0$\'dır. Parça ortalamanın 2 standart sapma üzerindedir.',
        en: 'Part dimension $\\mu = 50, \\sigma = 2$. For $X = 54$, $Z = (54-50)/2 = +2.0$, placing it 2 standard deviations above the mean.'
      },
      vocabTerms: [
        { term_en: 'z-score', explanation_tr: 'Bir gözlemin ortalamadan kaç standart sapma uzakta olduğunu gösteren standartlaştırılmış değer.', explanation_en: 'A measure of how many standard deviations below or above the population mean a raw score is.', exampleSentence_en: 'A z-score greater than 3 represents a rare extreme anomaly.' }
      ],
      questions: [
        {
          id: 'm16-l4-q1',
          type: 'numeric',
          prompt: { tr: '$\\mu = 80, \\sigma = 10$ olan dağılımda $X = 65$ gözleminin $Z$-skoru kaçtır?', en: 'If $\\mu = 80, \\sigma = 10$, what is the $Z$-score for $X = 65$?' },
          correctAnswer: -1.5,
          explanation: { tr: '$$Z = \\frac{65 - 80}{10} = \\frac{-15}{10} = -1.5$$', en: '$$Z = (65 - 80)/10 = -1.5$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=STANDARTLAŞTIRMA(x; mu; sigma)',
        pythonCode: 'from scipy.stats import zscore\nz_values = zscore(data)',
        powerBiNote: { tr: 'Z-skoru sütunu ile anomali filtrelemesi yapılır.', en: 'Use Z-score column to filter out $|Z| > 3$ outliers.' }
      }
    }
  ];
  return m;
});

console.log('Finished updating Modules 12 to 16.');
