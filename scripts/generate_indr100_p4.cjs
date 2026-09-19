const fs = require('fs');
const path = require('path');
const dataDir = path.join(__dirname, '../src/data');

function saveModule(modData) {
  const file = path.join(dataDir, `${modData.id.replace('-', '')}.json`);
  fs.writeFileSync(file, JSON.stringify(modData, null, 2), 'utf8');
  console.log(`✓ Saved ${modData.id} (${modData.title.tr}) with ${modData.lessons.length} lessons & ${modData.caseExams.length} cases.`);
}

// =========================================================================
// MODULE 21: Tesis Yerleşimi & Akış Şemaları (Layout Types, Flow Process Charts)
// =========================================================================
const module21 = {
  id: "module-21",
  order: 21,
  title: {
    tr: "Modül 21: Tesis Yerleşimi & Akış Şemaları",
    en: "Module 21: Facility Layout & Process Flow"
  },
  description: {
    tr: "Süreç, ürün, hücresel ve sabit konumlu yerleşim tipleri, akış süreç şemaları, From-To matrisi ve Muther REL diyagramı.",
    en: "Process, product, cellular, and fixed-position layouts, flow process charts, From-To load-distance matrix, and Muther relationship grids."
  },
  iconName: "LayoutGrid",
  lessons: [
    {
      id: "m21-l1", moduleId: "module-21", order: 1, difficulty: "basit",
      title: { tr: "Tesis Yerleşimi Temelleri ve 4 Ana Yerleşim Tipi", en: "Facility Layout Fundamentals & 4 Core Layout Types" },
      conceptCard: {
        tr: "**Tesis Yerleşiminin Amacı:** Malzeme taşıma maliyetlerini minimize etmek, darboğazları önlemek ve iş güvenliğini sağlamaktır.\n\n**4 Temel Yerleşim Tipi:**\n1. **Süreç Odaklı (Process / Functional Layout):** Benzer makineler/işlevler aynı alanda toplanır (Tüm tornalar bir odada, kaynaklar başka odada).\n2. **Ürün Odaklı (Product / Flow-line Layout):** Makineler ürünün işlem sırasına göre bir hat (düz veya U-şekli) üzerine dizilir.\n3. **Hücresel Yerleşim (Cellular Layout):** Benzer parça ailelerini baştan sona işleyen U-şekilli esnek hücreler.\n4. **Sabit Konumlu (Fixed-Position Layout):** Ürün sabittir (gemi, uçak, inşaat); işçiler ve makineler ürünün yanına gelir.",
        en: "The 4 core layout types: Process (functional grouping), Product (sequential flow line), Cellular (group technology U-cells), and Fixed-Position (product stationary, resources move)."
      },
      companyExample: {
        tr: "**Örnek Soru:** Tersanede 300 metrelik bir kargo gemisi inşa edilirken kaynak makineleri, vinçler ve işçiler geminin bulunduğu kuru havuza getirilmektedir. Bu hangi yerleşim tipidir?\n\n**Çözüm:** Ürün aşırı büyük ve sabit olduğu için **Sabit Konumlu Yerleşim (Fixed-Position Layout)** uygulanmaktadır.",
        en: "**Worked Example:** Constructing a massive ship in dry dock where machines and labor travel to the stationary hull is a Fixed-Position layout."
      },
      vocabTerms: [
        { term_en: "facility layout", explanation_tr: "Makinelerin, iş istasyonlarının ve malzeme yollarının fiziksel olarak yerleştirilmesi.", explanation_en: "The physical configuration of departments, workstations, and equipment within a facility.", exampleSentence_en: "An optimized facility layout minimized forklift travel distances." }
      ],
      questions: [{
        id: "m21-l1-q1", type: "multiple-choice",
        prompt: { tr: "Uçak, bina ve büyük gemi inşasında ürünün sabit durduğu, işçi ve makinelerin ürünün yanına geldiği yerleşim tipi hangisidir?", en: "Which layout type keeps the product stationary while resources move to it?" },
        options: [
          { tr: "Sabit Konumlu Yerleşim (Fixed-Position Layout)", en: "Fixed-Position Layout" },
          { tr: "Ürün Odaklı Yerleşim (Product Layout)", en: "Product Layout" },
          { tr: "Hücresel Yerleşim (Cellular Layout)", en: "Cellular Layout" },
          { tr: "Akan Bant Yerleşimi", en: "Conveyor Line Layout" }
        ],
        correctAnswer: 0,
        explanation: { tr: "Büyük yapılar ve gemiler sabit konumlu yerleşim ile üretilir.", en: "Fixed-position layout applies when product size or weight prevents movement." }
      }],
      realWorldBox: { excelFormula: "=EĞER(Ürün=\"Büyük ve Taşınamaz\"; \"Sabit Konumlu\"; \"Ürün/Süreç\")", pythonCode: "layout = 'Fixed-Position' if is_immovable_huge else 'Product/Process'", powerBiNote: { tr: "Fabrika yerleşim alanı sınıflandırması", en: "Facility layout spatial category" } }
    },
    {
      id: "m21-l2", moduleId: "module-21", order: 2, difficulty: "orta",
      title: { tr: "Süreç ve Ürün Odaklı Yerleşim Karşılaştırması", en: "Process vs Product Layout Comparison" },
      conceptCard: {
        tr: "**Karşılaştırma Tablosu:**\n\n| Kriter | Süreç Odaklı (Process) | Ürün Odaklı (Product) |\n|---|---|---|\n| **Ürün Çeşitliliği** | Yüksek | Düşük (Standart) |\n| **Üretim Hacmi** | Düşük / Orta | Çok Yüksek |\n| **Ekipman** | Genel amaçlı | Özel amaçlı otomatik |\n| **Malzeme Akışı** | Zikzaklı, karmaşık rotalar | Doğrusal, pürüzsüz akış |\n| **Süreç İçi Envanter (WIP)** | Yüksek | Çok Düşük |\n| **Birim Maliyet** | Yüksek | Düşük (Ölçek ekonomisi) |",
        en: "Process layout offers high flexibility and general equipment with high WIP. Product layout provides continuous flow, low WIP, and low unit cost at high volume."
      },
      companyExample: {
        tr: "**Örnek Soru:** Günde 50.000 kutu konserve domates üreten bir fabrika neden süreç odaklı değil de ürün odaklı hat yerleşimi seçer?\n\n**Çözüm:** Tek tip ve devasa hacimli standart ürün üretildiğinde, malzeme taşıma maliyetini ve birim başına üretim maliyetini en aza indirmek için **Ürün Odaklı (Product Layout)** hat kurulur.",
        en: "**Worked Example:** High volume tomato canning selects a Product Layout to minimize unit handling costs."
      },
      vocabTerms: [
        { term_en: "product layout", explanation_tr: "Makinelerin ürünün operasyon sırasına göre ardışık dizildiği hat yerleşimi.", explanation_en: "Layout where workstations are arranged according to the progressive assembly steps.", exampleSentence_en: "The automotive assembly line is a classic product layout." },
        { term_en: "process layout", explanation_tr: "Aynı tür işi yapan benzer tezgahların aynı bölümde toplandığı fonksiyonel yerleşim.", explanation_en: "Layout that groups machines performing similar functions together.", exampleSentence_en: "Hospitals use process layouts with dedicated cardiology and radiology wings." }
      ],
      questions: [{
        id: "m21-l2-q1", type: "multiple-choice",
        prompt: { tr: "Hangi yerleşim tipi yüksek ürün çeşitliliğine ve özel siparişlere en yüksek esnekliği sağlar?", en: "Which layout provides maximum flexibility for high variety and custom jobs?" },
        options: [
          { tr: "Süreç Odaklı Yerleşim (Process Layout)", en: "Process Layout" },
          { tr: "Ürün Odaklı Yerleşim (Product Layout)", en: "Product Layout" },
          { tr: "Seri Montaj Bandı", en: "Assembly Line" },
          { tr: "Kesintisiz Akış Hattı", en: "Continuous Line" }
        ],
        correctAnswer: 0,
        explanation: { tr: "Süreç odaklı (fonksiyonel) yerleşim, farklı rotalara sahip değişken işleri esnek şekilde işleyebilir.", en: "Process layout allows custom routing for highly diverse jobs." }
      }],
      realWorldBox: { excelFormula: "=EĞER(Hacim>10000; \"Ürün Odaklı\"; \"Süreç Odaklı\")", pythonCode: "layout_type = 'Product' if volume > 10000 and variety < 3 else 'Process'", powerBiNote: { tr: "Yerleşim türü verimlilik karşılaştırması", en: "Layout type cost comparison" } }
    },
    {
      id: "m21-l3", moduleId: "module-21", order: 3, difficulty: "orta",
      title: { tr: "Hücresel Yerleşim ve Grup Teknolojisi", en: "Cellular Layout & Group Technology" },
      conceptCard: {
        tr: "**Grup Teknolojisi (Group Technology - GT):** Benzer tasarım veya üretim özelliklerine sahip parçaların 'Parça Aileleri (Part Families)' halinde sınıflandırılmasıdır.\n\n**Hücresel Yerleşim (Cellular Manufacturing):**\n- Belirli bir parça ailesini baştan sona tamamlamak için gereken farklı makineler küçük bir **U-şekilli hücre** içinde toplanır.\n- **Avantajları:**\n  1. Hazırlık (setup) sürelerini %70-90 azaltır.\n  2. Süreç içi envanteri (WIP) ve taşıma mesafelerini minimuma indirir.\n  3. Operatörler hücre içinde birden fazla makineyi çok yönlü olarak yönetir.",
        en: "Cellular manufacturing groups dissimilar machines into U-shaped cells dedicated to processing part families identified via Group Technology, drastically slashing setup and WIP."
      },
      companyExample: {
        tr: "**Örnek Soru:** Bir parça ailesinde geleneksel atölye yerleşiminde parçalar toplam 450 metre dolaşırken, kurulan hücresel U-hücrede taşıma mesafesi 30 metreye inmiştir. Mesafe tasarruf yüzdesi nedir?\n\n**Çözüm:**\n$$\\text{Tasarruf} = \\frac{450 - 30}{450} \\times 100 = \\frac{420}{450} \\times 100 \\approx 93.33\\%$$",
        en: "**Worked Example:** Cellular layout reduces travel distance from 450m to 30m, achieving $(450-30)/450 \\times 100 = 93.33\\%$ reduction."
      },
      vocabTerms: [
        { term_en: "cellular manufacturing", explanation_tr: "Benzer parça ailelerini U-şekilli hücrelerde sıralı işleyerek israfı yok eden yerleşim.", explanation_en: "Layout grouping dissimilar machines into cells dedicated to part families.", exampleSentence_en: "U-shaped cellular lines enabled one-piece flow with multi-skilled operators." }
      ],
      questions: [{
        id: "m21-l3-q1", type: "multiple-choice",
        prompt: { tr: "Benzer parça ailelerini işlemek üzere farklı tezgahların U-şeklinde bir araya getirildiği yerleşim tipi hangisidir?", en: "Which layout arranges dissimilar machines into U-shaped cells for part families?" },
        options: [
          { tr: "Hücresel Yerleşim (Cellular Layout)", en: "Cellular Layout" },
          { tr: "Sabit Konumlu Yerleşim", en: "Fixed Position Layout" },
          { tr: "Geleneksel Dağınık Atölye", en: "Traditional Job Shop" },
          { tr: "Düz Hat Montajı", en: "Straight Line Layout" }
        ],
        correctAnswer: 0,
        explanation: { tr: "Hücresel yerleşim, Grup Teknolojisi ile parça ailelerini U-hücrelerinde işler.", en: "Cellular layout organizes workstations into dedicated cells for part families." }
      }],
      realWorldBox: { excelFormula: "=(Eski_Mesafe - Yeni_Mesafe) / Eski_Mesafe", pythonCode: "dist_saving = (old_dist - new_dist) / old_dist", powerBiNote: { tr: "Spagetti diyagramı mesafe kısalma oranı", en: "Spaghetti diagram distance reduction" } }
    },
    {
      id: "m21-l4", moduleId: "module-21", order: 4, difficulty: "basit",
      title: { tr: "Akış Süreç Şemaları (Flow Process Charts)", en: "Flow Process Chart Symbols & Mapping" },
      conceptCard: {
        tr: "**ASME Akış Süreç Şeması Standart Sembolleri:**\n\n1. $\\Large \\bigcirc$ **İşlem (Operation):** Parçanın fiziksel veya kimyasal olarak değiştirilmesi (kesme, delme, montaj, kod yazma).\n2. $\\Large \\Rightarrow$ **Taşıma (Transportation):** Malzemenin bir noktadan diğerine taşınması.\n3. $\\Large \\square$ **Kontrol / Muayene (Inspection):** Kalite veya miktar doğrulaması (ölçüm, görsel kontrol).\n4. $\\Large \\text{D}$ **Gecikme / Bekleme (Delay):** Sürecin sonraki adımı için kuyrukta veya geçici bekleme.\n5. $\\Large \\bigtriangledown$ **Depolama (Storage):** Malzemenin kontrollü olarak depoda tutulması.\n\n*Yalın üretimde İşlem dışındaki tüm adımlar (Taşıma, Muayene, Bekleme, Depolama) potansiyel israf (muda) kabul edilir ve elenmeye çalışılır.*",
        en: "ASME process chart symbols: Operation (Circle), Transportation (Arrow), Inspection (Square), Delay (D-shape), Storage (Triangle). Non-operational steps represent potential waste."
      },
      companyExample: {
        tr: "**Örnek Soru:** Bir parçanın montajı 5 işlem ($\\bigcirc$), 4 taşıma ($\\Rightarrow$), 2 kontrol ($\\square$), 3 bekleme ($\\text{D}$) ve 1 depolama ($\\bigtriangledown$) içermektedir. Toplam aktivite adımı sayısı nedir?\n\n**Çözüm:**\n$$\\text{Toplam Adım} = 5 + 4 + 2 + 3 + 1 = 15 \\text{ adım}$$",
        en: "**Worked Example:** Process with 5 operations, 4 transportations, 2 inspections, 3 delays, and 1 storage has $5+4+2+3+1 = 15$ total steps."
      },
      vocabTerms: [
        { term_en: "flow process chart", explanation_tr: "Bir ürünün hammaddeden bitmiş ürüne kadar geçirdiği tüm adımları sembollerle gösteren şema.", explanation_en: "Chart charting all operations, transportations, inspections, delays, and storages.", exampleSentence_en: "The flow process chart revealed 4 redundant transportation steps." }
      ],
      questions: [{
        id: "m21-l4-q1", type: "multiple-choice",
        prompt: { tr: "ASME süreç akış şemasında 'Kare' ($\\square$) sembolü hangi aktiviteyi temsil eder?", en: "In ASME process charts, what does a Square symbol represent?" },
        options: [
          { tr: "Kontrol / Muayene (Inspection)", en: "Inspection" },
          { tr: "İşlem (Operation)", en: "Operation" },
          { tr: "Taşıma (Transportation)", en: "Transportation" },
          { tr: "Gecikme (Delay)", en: "Delay" }
        ],
        correctAnswer: 0,
        explanation: { tr: "Kare sembolü kalite kontrol ve muayene (Inspection) işlemlerini gösterir.", en: "The square symbol denotes an inspection step." }
      }],
      realWorldBox: { excelFormula: "=EĞERTOPLA(Aktivite; \"İşlem\")", pythonCode: "is_value_added = (symbol == 'Operation')", powerBiNote: { tr: "Değer katan vs Değer katmayan adımlar oranı", en: "Value-added step ratio dashboard" } }
    },
    {
      id: "m21-l5", moduleId: "module-21", order: 5, difficulty: "orta",
      title: { tr: "Nereden-Nereye (From-To) Matrisi ve Yük-Mesafe Puanı", en: "From-To Matrix & Load-Distance Score" },
      conceptCard: {
        tr: "Süreç odaklı yerleşimlerde bölümler arasındaki toplam taşıma maliyetini hesaplamak için **Yük-Mesafe (Load-Distance - $LD$)** formülü kullanılır:\n\n$$\\mathbf{LD = \\sum_{i=1}^{n} \\sum_{j=1}^{n} l_{ij} \\cdot d_{ij}}$$\n\n- $l_{ij}$: $i$ bölümünden $j$ bölümüne taşınan yük/palet/sefer sayısı (From-To Matrisi).\n- $d_{ij}$: $i$ ve $j$ bölümleri arasındaki fiziksel mesafe (Metre veya ızgara adımı).\n\n**Amaç:** Birbirleri arasında en çok yük akışı ($l_{ij}$) olan bölümleri birbirine en yakın ($d_{ij}$) yerleştirerek toplam $LD$ puanını MİNİMİZE etmektir.",
        en: "The Load-Distance score $LD = \\sum l_{ij} d_{ij}$ evaluates layout alternatives by weighting inter-department material trip loads $l_{ij}$ with distances $d_{ij}$."
      },
      companyExample: {
        tr: "**Örnek Soru:** A ve B bölümleri arasında günde 100 palet ($l_{AB} = 100$), B ve C arasında 50 palet ($l_{BC} = 50$) taşınmaktadır. Mesafeler: $d_{AB} = 10$ m, $d_{BC} = 20$ m ise toplam $LD$ puanı nedir?\n\n**Çözüm:**\n$$LD = (100 \\times 10) + (50 \\times 20) = 1.000 + 1.000 = 2.000 \\text{ palet-metre}$$",
        en: "**Worked Example:** $LD = (100 \\times 10) + (50 \\times 20) = 2,000$ pallet-meters."
      },
      vocabTerms: [
        { term_en: "From-To matrix", explanation_tr: "Bölümler arasındaki malzeme veya sefer taşıma hacimlerini gösteren kare matris.", explanation_en: "Matrix tabulating the volume of material movements between departmental pairs.", exampleSentence_en: "The From-To matrix indicated heavy traffic between stamping and welding." },
        { term_en: "Load-Distance score", explanation_tr: "Taşınan yük miktarı ile kat edilen mesafenin çarpımları toplamı: sum(l_ij * d_ij).", explanation_en: "Mathematical metric quantifying total material movement effort across a layout.", exampleSentence_en: "Layout plan B reduced the total load-distance score by 25%." }
      ],
      questions: [{
        id: "m21-l5-q1", type: "numeric",
        prompt: { tr: "$l_{12} = 40$ yük ($d_{12} = 5$ m) ve $l_{23} = 60$ yük ($d_{23} = 10$ m) için toplam Yük-Mesafe ($LD$) puanı kaçtır?", en: "Loads: l_12 = 40 (d=5m), l_23 = 60 (d=10m). What is the total LD score?" },
        correctAnswer: 800,
        explanation: { tr: "$$LD = (40 \\times 5) + (60 \\times 10) = 200 + 600 = 800$$", en: "$$LD = 200 + 600 = 800$$" }
      }],
      realWorldBox: { excelFormula: "=TOPLA.ÇARPIM(Yük_Aralığı; Mesafe_Aralığı)", pythonCode: "ld_score = sum(loads[i][j] * dists[i][j] for i in range(n) for j in range(n))", powerBiNote: { tr: "Tesis içi lojistik yük-mesafe skor kartı", en: "Material handling LD score optimizer" } }
    },
    {
      id: "m21-l6", moduleId: "module-21", order: 6, difficulty: "ileri",
      title: { tr: "Bölüm İlişkileri Şeması (Muther REL Chart)", en: "Systematic Layout Planning & Muther REL Chart" },
      conceptCard: {
        tr: "Sayısal yük taşınmayan ofis, hastane veya hizmet alanlarında Richard Muther'ın **İlişki Şeması (REL Chart / Muther Grid)** kullanılır:\n\n| Harf Kodu | Yakınlık Derecesi (Closeness) | Sayısal Ağırlık |\n|---|---|:---:|\n| **A** | Absolutely Necessary (Mutlaka Gerekli) | 16 |\n| **E** | Especially Important (Özellikle Önemli) | 8 |\n| **I** | Important (Önemli) | 4 |\n| **O** | Ordinary Closeness (Olağan) | 2 |\n| **U** | Unimportant (Önemsiz) | 0 |\n| **X** | Undesirable (Kesinlikle İstenmeyen / Zararlı) | -16 |\n\n*Örnek:* Boyahane ile Yemekhane yan yana olamaz (Gürültü/koku nedeniyle $X$ ilişkisi).",
        en: "Muther's REL chart rates closeness needs: A (Absolutely necessary), E (Especially important), I (Important), O (Ordinary), U (Unimportant), X (Undesirable)."
      },
      companyExample: {
        tr: "**Örnek Soru:** Bir hastanede Acil Servis ile Ameliyathane arasındaki yakınlık ilişkisi hangi Muther harf kodu ile temsil edilmelidir?\n\n**Çözüm:** Hayati aciliyet nedeniyle bu iki bölümün bitişik olması şarttır $\\implies$ **A (Absolutely Necessary - Mutlaka Gerekli)**.",
        en: "**Worked Example:** Emergency room to operating theater requires closeness rating 'A' (Absolutely Necessary)."
      },
      vocabTerms: [
        { term_en: "REL chart (Muther grid)", explanation_tr: "Bölümlerin birbirine yakınlık önemini A-E-I-O-U-X harfleriyle puanlayan şema.", explanation_en: "Qualitative closeness rating grid for Systematic Layout Planning.", exampleSentence_en: "The Muther REL chart placed the cafeteria away from chemical storage (rated X)." }
      ],
      questions: [{
        id: "m21-l6-q1", type: "multiple-choice",
        prompt: { tr: "Muther İlişkiler Şemasında (REL Chart) gürültü, koku veya güvenlik nedeniyle iki bölümün YAN YANA OLMASININ KESİNLİKLE İSTENMEDİĞİ durum hangi harfle gösterilir?", en: "In Muther REL chart, which code represents an 'Undesirable' placement?" },
        options: [
          { tr: "X (Undesirable - İstenmeyen)", en: "X (Undesirable)" },
          { tr: "A (Absolutely Necessary)", en: "A (Absolutely Necessary)" },
          { tr: "E (Especially Important)", en: "E (Especially Important)" },
          { tr: "U (Unimportant)", en: "U (Unimportant)" }
        ],
        correctAnswer: 0,
        explanation: { tr: "X kodu istenmeyen (Undesirable) ve ayrılması gereken bölümleri temsil eder.", en: "Code X denotes undesirable closeness relationships." }
      }],
      realWorldBox: { excelFormula: "=DÜŞEYARA(İlişkiKodu; {\"A\"\\16;\"E\"\\8;\"I\"\\4;\"O\"\\2;\"U\"\\0;\"X\"\\-16}; 2; 0)", pythonCode: "rel_weights = {'A': 16, 'E': 8, 'I': 4, 'O': 2, 'U': 0, 'X': -16}", powerBiNote: { tr: "Niteliksel yerleşim ilişkileri matrisi", en: "Muther layout relationship matrix" } }
    }
  ],
  caseExams: [
    {
      id: "m21-c1",
      moduleId: "module-21",
      difficulty: "orta",
      title: { tr: "Vaka Sınavı: EcoRide Scooter Yenileme Tesisi Yerleşim & Akış Şeması Tasarımı", en: "Case Exam: EcoRide Refurbishment Facility Layout & Flow Optimization" },
      businessQuestion: {
        tr: "EcoRide elektrikli scooter yenileme merkezinde 4 ana bölüm bulunmaktadır: 1) Giriş Muayene (I), 2) Batarya Test & Değişim (B), 3) Mekanik Onarım (M), 4) Son Test & Paketleme (P). Günlük parça akışları (From-To Matrisi): I->B: 80 adet, I->M: 40 adet, B->P: 70 adet, M->P: 30 adet. Mevcut Yerleşim Planında mesafeler: I-B = 30m, I-M = 10m, B-P = 40m, M-P = 20m. Yeni Önerilen Yerleşimde en yoğun akış olan I-B mesafesi 10m'ye, B-P mesafesi 15m'ye indirilmiştir (I-M = 25m, M-P = 20m). İki planın toplam Yük-Mesafe (LD) puanlarını hesaplayıp tasarruf miktarını bulunuz.",
        en: "EcoRide refurbishment center has 4 departments. Material trips: I->B: 80, I->M: 40, B->P: 70, M->P: 30. Layout 1 distances: I-B=30m, I-M=10m, B-P=40m, M-P=20m. Layout 2 distances: I-B=10m, I-M=25m, B-P=15m, M-P=20m. Compare LD scores and calculate net score reduction."
      },
      dataset: {
        columns: ["Rota", "Günlük_Yük", "Mevcut_Mesafe_m", "Mevcut_LD", "Yeni_Mesafe_m", "Yeni_LD"],
        rows: [
          ["I -> B", 80, 30, 2400, 10, 800],
          ["I -> M", 40, 10, 400, 25, 1000],
          ["B -> P", 70, 40, 2800, 15, 1050],
          ["M -> P", 30, 20, 600, 20, 600],
          ["TOPLAM", 220, null, 6200, null, 3450]
        ]
      },
      guidedSteps: [
        { tr: "1. Adım: Mevcut Plan LD Puanı: $(80 \\times 30) + (40 \\times 10) + (70 \\times 40) + (30 \\times 20) = 2400 + 400 + 2800 + 600 = 6.200$.", en: "Step 1: Current LD = 6,200." },
        { tr: "2. Adım: Yeni Plan LD Puanı: $(80 \\times 10) + (40 \\times 25) + (70 \\times 15) + (30 \\times 20) = 800 + 1000 + 1050 + 600 = 3.450$.", en: "Step 2: New LD = 3,450." },
        { tr: "3. Adım: Net LD Puanı Tasarrufu: $6.200 - 3.450 = 2.750$ puan.", en: "Step 3: Net reduction = 2,750." }
      ],
      expectedApproach: {
        tr: "Yük-Mesafe (LD) formülü ile From-To matrisini analiz ederek tesis içi taşıma mesafelerini optimize etme.",
        en: "Evaluating spatial departmental configurations using Load-Distance minimization."
      },
      solutionQuestions: [{
        id: "m21-c1-q1", type: "numeric",
        prompt: { tr: "Yeni yerleşim planı ile sağlanan net Yük-Mesafe ($LD$) puanı tasarrufu kaçtır?", en: "What is the net reduction in total Load-Distance (LD) score with the new layout?" },
        correctAnswer: 2750,
        explanation: { tr: "$$\\text{Tasarruf} = 6.200 - 3.450 = 2.750 \\text{ yük-metre}$$", en: "$$\\text{Savings} = 6,200 - 3,450 = 2,750$$" }
      }]
    }
  ]
};

// =========================================================================
// MODULE 22: Hat Dengeleme & Montaj Hattı Tasarımı
// =========================================================================
const module22 = {
  id: "module-22",
  order: 22,
  title: {
    tr: "Modül 22: Hat Dengeleme & Montaj Hattı Tasarımı",
    en: "Module 22: Line Balancing & Assembly Line Design"
  },
  description: {
    tr: "Çevrim süresi, teorik minimum istasyon sayısı, öncelik diyagramları, hat verimliliği ve denge gecikmesi optimizasyonu.",
    en: "Cycle time calculation, theoretical minimum workstations, precedence diagrams, line efficiency, and balance delay heuristics."
  },
  iconName: "GitCommit",
  lessons: [
    {
      id: "m22-l1", moduleId: "module-22", order: 1, difficulty: "basit",
      title: { tr: "Montaj Hattı Kavramı ve Çevrim Süresi (Cycle Time)", en: "Assembly Line Concepts & Cycle Time Calculation" },
      conceptCard: {
        tr: "**Çevrim Süresi (Cycle Time - $C$):** Montaj hattının çıkışında art arda tamamlanan iki ürün arasındaki izin verilen maksimum süredir:\n\n$$\\mathbf{C = \\frac{\\text{Kullanılabilir Çalışma Süresi}}{\\text{İstenen Üretim Miktarı (Talep)}} = \\frac{\\text{Operating Time}}{\\text{Desired Output}}}$$\n\n- Hiçbir iş istasyonunun toplam işlem süresi çevrim süresini ($C$) AŞAMAZ.\n- $C$ süresi ne kadar küçükse hat o kadar hızlı üretir.",
        en: "Cycle Time $C$ is the maximum allowable time allocated per workstation to meet target demand: $C = \\frac{\\text{Available Operating Time}}{\\text{Target Output Quantity}}$."
      },
      companyExample: {
        tr: "**Örnek Soru:** Günde 8 saat (28.800 saniye) çalışan bir elektrikli süpürge fabrikası günde 480 adet ürün üretmek istemektedir. Gerekli çevrim süresi ($C$) kaç saniyedir?\n\n**Çözüm:**\n$$C = \\frac{28.800 \\text{ saniye}}{480 \\text{ adet}} = 60 \\text{ saniye/adet}$$",
        en: "**Worked Example:** Operating time = 8 hrs = 28,800 sec. Target = 480 units. Cycle time $C = 28,800 / 480 = 60$ seconds/unit."
      },
      vocabTerms: [
        { term_en: "cycle time (C)", explanation_tr: "Montaj hattından çıkan iki ardışık ürün arasındaki hedef süre: Çalışma Süresi / Talep.", explanation_en: "The maximum time allowed at each workstation to meet customer takt/demand pace.", exampleSentence_en: "A cycle time of 60 seconds delivers one finished vacuum every minute." }
      ],
      questions: [{
        id: "m22-l1-q1", type: "numeric",
        prompt: { tr: "Günde 7.2 saat (25.920 saniye) çalışan bir hatta günlük 360 adet ürün hedefleniyorsa Çevrim Süresi ($C$) kaç saniyedir?", en: "Operating time = 25,920 sec. Target = 360 units. What is Cycle Time C (in seconds)?" },
        correctAnswer: 72,
        explanation: { tr: "$$C = \\frac{25.920}{360} = 72 \\text{ saniye}$$", en: "$$C = 25,920 / 360 = 72 \\text{ seconds}$$" }
      }],
      realWorldBox: { excelFormula: "=ÇalışmaSüresi_Saniye / HedefAdet", pythonCode: "cycle_time = available_seconds / target_units", powerBiNote: { tr: "Takt Time / Çevrim Süresi hedef göstergesi", en: "Target cycle time KPI" } }
    },
    {
      id: "m22-l2", moduleId: "module-22", order: 2, difficulty: "basit",
      title: { tr: "Teorik Minimum İş İstasyonu Sayısı", en: "Theoretical Minimum Number of Workstations" },
      conceptCard: {
        tr: "Bir montaj hattında tüm iş öğelerinin süreleri toplamı $\\sum t_i$ ise, hattı çevrim süresi $C$ hızında çalıştırmak için gereken **Teorik Minimum İş İstasyonu Sayısı ($N_{\\min}$)**:\n\n$$\\mathbf{N_{\\min} = \\left\\lceil \\frac{\\sum_{i=1}^{k} t_i}{C} \\right\\rceil}$$\n\n- $\\sum t_i$: Tüm montaj görevlerinin süreleri toplamı (İş içeriği - Total Task Time).\n- $\\lceil \\cdot \\rceil$: Yukarı yuvarlama fonksiyonudur (Örn: $3.1 \\implies 4$ istasyon).",
        en: "Theoretical minimum workstations $N_{\\min} = \\lceil \\frac{\\sum t_i}{C} \\rceil$, where $\\sum t_i$ is total task time and $\\lceil \\cdot \\rceil$ rounds up to next integer."
      },
      companyExample: {
        tr: "**Örnek Soru:** Bir kahve makinesinin tüm montaj görevlerinin toplam süresi $\\sum t_i = 190$ saniyedir. Çevrim süresi $C = 60$ saniye ise teorik minimum istasyon sayısı nedir?\n\n**Çözüm:**\n$$N_{\\min} = \\left\\lceil \\frac{190}{60} \\right\\rceil = \\lceil 3.167 \\rceil = 4 \\text{ istasyon}$$",
        en: "**Worked Example:** Total task time = 190s, $C = 60$s. $N_{\\min} = \\lceil 190/60 \\rceil = \\lceil 3.17 \\rceil = 4$ stations."
      },
      vocabTerms: [
        { term_en: "theoretical minimum workstations", explanation_tr: "Toplam iş süresinin çevrim süresine bölünüp yukarı yuvarlanmasıyla bulunan en az istasyon sayısı.", explanation_en: "The lowest number of workstations mathematically required to balance a line.", exampleSentence_en: "The theoretical minimum was 4 stations, but precedence constraints forced 5." }
      ],
      questions: [{
        id: "m22-l2-q1", type: "numeric",
        prompt: { tr: "Toplam görev süresi $\\sum t_i = 210$ saniye ve çevrim süresi $C = 50$ saniye ise Teorik Minimum İstasyon Sayısı ($N_{\\min}$) kaçtır?", en: "Total task time = 210s, C = 50s. What is theoretical minimum workstations N_min?" },
        correctAnswer: 5,
        explanation: { tr: "$$N_{\\min} = \\lceil 210 / 50 \\rceil = \\lceil 4.2 \\rceil = 5 \\text{ istasyon}$$", en: "$$N_{\\min} = \\lceil 4.2 \\rceil = 5$$" }
      }],
      realWorldBox: { excelFormula: "=YUKARIYUVARLA(ToplamSüre / C; 0)", pythonCode: "import math\nN_min = math.ceil(total_task_time / cycle_time)", powerBiNote: { tr: "Teorik istasyon sayısı hesaplayıcısı", en: "Minimum workstation calculator" } }
    },
    {
      id: "m22-l3", moduleId: "module-22", order: 3, difficulty: "orta",
      title: { tr: "Öncelik Diyagramı (Precedence Diagram)", en: "Precedence Diagram & Task Dependencies" },
      conceptCard: {
        tr: "**Öncelik İlişkisi (Precedence Constraint):** Bazı montaj işlemleri yapılmadan diğer işlemler kesinlikle başlayamaz (Örn: Motor bloğu vidalanmadan üst kapak takılamaz).\n\n**Öncelik Diyagramı:**\n- Düğümler (Nodes): Görevleri ve sürelerini gösterir (Görev $A: 40\\,\\text{sn}$).\n- Oklar (Arrows): Öncelik sırasını gösterir ($A \\rightarrow B \\implies A$ bitmeden $B$ başlayamaz).\n- Bir iş istasyonuna görev atanırken, o görevin tüm öncülleri (predecessors) daha önceki istasyonlara veya o istasyonda önceden atanmış olmalıdır.",
        en: "A precedence diagram visually maps task nodes and directed arrows indicating technological sequence constraints that must be honored during workstation assignment."
      },
      companyExample: {
        tr: "**Örnek Soru:** A görevi (20 sn), B görevi (30 sn, A'ya bağlı) ve C görevi (15 sn, bağımsız). İstasyon 1'e ilk olarak B atanabilir mi?\n\n**Çözüm:** Hayır! B görevi A'ya bağımlı olduğu için A atanmadan B görevi atanamaz.",
        en: "**Worked Example:** Task B depends on A. B cannot be scheduled to any workstation until task A is completely assigned."
      },
      vocabTerms: [
        { term_en: "precedence diagram", explanation_tr: "Montaj görevlerinin teknolojik öncelik ve bağımlılık sırasını gösteren yönlü ağ grafiği.", explanation_en: "Directed network graph specifying the required assembly task sequencing order.", exampleSentence_en: "The precedence diagram prevented impossible assembly order assignments." }
      ],
      questions: [{
        id: "m22-l3-q1", type: "multiple-choice",
        prompt: { tr: "Öncelik diyagramında $A \\rightarrow B$ oku ne anlama gelir?", en: "In a precedence diagram, what does an arrow from A to B indicate?" },
        options: [
          { tr: "B görevi başlayabilmek için A görevinin tamamlanmış olması şarttır", en: "Task A must be completed before task B can begin" },
          { tr: "A ve B her zaman aynı istasyonda olmak zorundadır", en: "A and B must be in the same station" },
          { tr: "B görevi A görevinden daha uzundur", en: "Task B is longer than A" },
          { tr: "A görevi B'den sonra yapılmalıdır", en: "A must follow B" }
        ],
        correctAnswer: 0,
        explanation: { tr: "Öncelik oku, yönlendirilen görevin başlayabilmesi için kaynak görevin bitmiş olmasını zorunlu kılar.", en: "Directed arrows enforce strict predecessor completion prerequisites." }
      }],
      realWorldBox: { excelFormula: "=EĞER(Öncül_Tamamlandı; \"Atanabilir\"; \"Bekle\")", pythonCode: "eligible_tasks = [t for t in tasks if all(p in completed for p in t.predecessors)]", powerBiNote: { tr: "Montaj bağımlılık ağacı görseli", en: "Assembly precedence network visualization" } }
    },
    {
      id: "m22-l4", moduleId: "module-22", order: 4, difficulty: "orta",
      title: { tr: "Hat Dengeleme Sezgisel Kuralları (Heuristics)", en: "Line Balancing Heuristics (Followers & Task Time)" },
      conceptCard: {
        tr: "İş istasyonlarına görev atarken en yaygın sezgisel kurallar:\n\n1. **En Çok Takipçisi Olan Kuralı (Largest Number of Followers):** Önceliği uygun olan görevler arasından, diyagramda arkasından en çok görev gelen göreve öncelik verilir.\n2. **En Uzun İşlem Süresi Kuralı (Longest Task Time - LTT):** Uygun görevler arasından en uzun süreye ($t_i$) sahip olan seçilir.\n3. **Konumsal Ağırlık Kuralı (Ranked Positional Weight - Helgeson-Birnie):** Görevin kendi süresi ile kendisinden sonraki tüm takipçilerinin süreleri toplamına göre sıralama yapılır.",
        en: "Heuristic assignment rules: 1) Most Following Tasks, 2) Longest Task Time (LTT), and 3) Ranked Positional Weight (RPW) summing task time and all successor times."
      },
      companyExample: {
        tr: "**Örnek Soru:** İstasyon 1'de kalan boş süre 40 saniyedir. Atanabilecek iki uygun görev vardır: Görev 1 ($t_1 = 35\\,\\text{sn}$, 4 takipçisi var) ve Görev 2 ($t_2 = 20\\,\\text{sn}$, 1 takipçisi var). 'En çok takipçi' kuralına göre hangisi atanır?\n\n**Çözüm:** Görev 1'in 4 takipçisi olduğu için ilk olarak **Görev 1** atanır.",
        en: "**Worked Example:** Task 1 has 4 followers ($t=35$), Task 2 has 1 follower ($t=20$). Most followers rule selects Task 1."
      },
      vocabTerms: [
        { term_en: "line balancing heuristic", explanation_tr: "NP-zor hat dengeleme problemlerini optimal veya yakın çözmek için kullanılan pratik atama kuralları.", explanation_en: "Algorithmic rule used to assign tasks to stations without exceeding cycle time.", exampleSentence_en: "Ranked positional weight heuristic balanced the 12-task assembly line in 4 stations." }
      ],
      questions: [{
        id: "m22-l4-q1", type: "multiple-choice",
        prompt: { tr: "Hat dengelemede uygun adaylar arasından işlem süresi en büyük olan görevi ilk olarak istasyona atayan kural hangisidir?", en: "Which heuristic assigns the candidate task with the largest processing time first?" },
        options: [
          { tr: "En Uzun İşlem Süresi (Longest Task Time - LTT)", en: "Longest Task Time (LTT)" },
          { tr: "En Kısa İşlem Süresi (SPT)", en: "Shortest Task Time" },
          { tr: "Rastgele Atama", en: "Random Assignment" },
          { tr: "En Az Takipçi Kuralı", en: "Least Followers Rule" }
        ],
        correctAnswer: 0,
        explanation: { tr: "LTT kuralı en büyük görev süresini önce atayarak boşlukları küçük görevlerle doldurmayı hedefler.", en: "Longest Task Time (LTT) assigns the largest tasks first." }
      }],
      realWorldBox: { excelFormula: "=SIRALA(Görevler; Takipçi_Sayısı; -1)", pythonCode: "candidates.sort(key=lambda t: (t.followers_count, t.duration), reverse=True)", powerBiNote: { tr: "İstasyon iş yükü atama dağılımı", en: "Station task load balance chart" } }
    },
    {
      id: "m22-l5", moduleId: "module-22", order: 5, difficulty: "orta",
      title: { tr: "Hat Verimliliği ve Denge Gecikmesi (Efficiency & Balance Delay)", en: "Line Efficiency & Balance Delay Metrics" },
      conceptCard: {
        tr: "**1. Hat Verimliliği (Line Efficiency - $\\eta$):**\n$$\\mathbf{\\text{Verimlilik } (\\eta) = \\frac{\\sum_{i=1}^{k} t_i}{N_{\\text{gerçek}} \\times C} \\times 100}$$\n\n**2. Denge Gecikmesi (Balance Delay - $BD$):** Hattaki atıl (boş) bekleme süresi yüzdesidir:\n$$\\mathbf{BD = 100\\% - \\eta = \\frac{(N_{\\text{gerçek}} \\times C) - \\sum t_i}{N_{\\text{gerçek}} \\times C} \\times 100}$$\n\n- $N_{\\text{gerçek}}$: Kurulan fiili iş istasyonu sayısı\n- $C$: Çevrim süresi",
        en: "Line Efficiency $\\eta = \\frac{\\sum t_i}{N \\cdot C} \\times 100$. Balance Delay $BD = 100\\% - \\eta = \\frac{N \\cdot C - \\sum t_i}{N \\cdot C} \\times 100$ measures percentage idle time."
      },
      companyExample: {
        tr: "**Örnek Soru:** Toplam görev süresi $\\sum t_i = 150$ saniyedir. Hat $N = 3$ istasyon ve $C = 60$ saniye ile dengelenmiştir. Verimlilik ve Denge Gecikmesi nedir?\n\n**Çözüm:**\n$$\\eta = \\frac{150}{3 \\times 60} \\times 100 = \\frac{150}{180} \\times 100 \\approx 83.33\\%$$\n$$BD = 100\\% - 83.33\\% = 16.67\\%$$",
        en: "**Worked Example:** $\\sum t_i = 150, N = 3, C = 60$. Efficiency $\\eta = 150/180 = 83.33\\%$. Balance delay $BD = 16.67\\%$."
      },
      vocabTerms: [
        { term_en: "line efficiency", explanation_tr: "Gerçek iş süresinin toplam istasyon kapasitesine oranı: sum(t_i) / (N * C).", explanation_en: "The ratio of total productive task time to total available station time.", exampleSentence_en: "Line efficiency increased from 75% to 92% after re-sequencing." },
        { term_en: "balance delay", explanation_tr: "Montaj hattındaki istasyonların boş bekleme süresi yüzdesi: 100 - Verimlilik.", explanation_en: "The percentage of idle time on an assembly line: 100% - Efficiency.", exampleSentence_en: "A balance delay below 10% indicates a well-balanced assembly line." }
      ],
      questions: [{
        id: "m22-l5-q1", type: "numeric",
        prompt: { tr: "$\\sum t_i = 200$ saniye, $N = 4$ istasyon ve $C = 60$ saniye olan bir hattın Denge Gecikmesi (Balance Delay - $BD$) yüzde kaçtır (virgülsüz en yakın tam sayı)?", en: "Total task time = 200s, N = 4, C = 60s. What is Balance Delay (%) to nearest whole number?" },
        correctAnswer: 17,
        explanation: { tr: "$$\\text{Kapasite} = 4 \\times 60 = 240 \\text{ sn}$$\n$$\\eta = \\frac{200}{240} \\times 100 \\approx 83.33\\%$$\n$$BD = 100\\% - 83.33\\% = 16.67\\% \\approx 17$$", en: "$$BD = (240 - 200)/240 = 40/240 = 16.67\\% \\approx 17\\%$$" }
      }],
      realWorldBox: { excelFormula: "=1 - (ToplamSüre / (N * C))", pythonCode: "efficiency = (sum_tasks / (num_stations * cycle_time)) * 100\nbalance_delay = 100.0 - efficiency", powerBiNote: { tr: "Hat verimliliği ve atıl süre göstergesi", en: "Line balance efficiency vs idle time" } }
    },
    {
      id: "m22-l6", moduleId: "module-22", order: 6, difficulty: "ileri",
      title: { tr: "Darboğaz İstasyonlar ve Paralel İstasyon Çözümü", en: "Bottleneck Stations & Parallel Workstations" },
      conceptCard: {
        tr: "**Darboğaz İstasyon (Bottleneck):** Bir montaj hattında en uzun süren (maksimum istasyon süresi $t_{\\text{st}}$) ve hattın genel üretim hızını sınırlayan istasyondur.\n\n- Eğer tek bir görevin süresi hedeflenen $C$ çevrim süresinden büyükse ($t_i > C$), hat standart tek istasyonla dengelenemez.\n- **Çözüm:** O darboğaz göreve **Paralel İstasyonlar (Parallel Workstations)** kurulur. Örneğin $t_i = 80\\,\\text{sn}$ ve $C = 50\\,\\text{sn}$ ise, 2 adet paralel istasyon kurularak her birinin efektif süresi $80 / 2 = 40\\,\\text{sn} \\le 50\\,\\text{sn}$ seviyesine indirilir.",
        en: "If an indivisible task duration exceeds cycle time ($t_i > C$), parallel identical workstations split the throughput: effective station time becomes $t_i / k \\le C$."
      },
      companyExample: {
        tr: "**Örnek Soru:** Bir gövde kaynak operasyonu 90 saniye sürmektedir ($t_{\\text{kaynak}} = 90$). Müşteri talebini karşılamak için gereken çevrim süresi $C = 50$ saniyedir. Bu darboğazı çözmek için kaç paralel kaynak istasyonu kurulmalıdır?\n\n**Çözüm:**\n$$k = \\lceil 90 / 50 \\rceil = \\lceil 1.8 \\rceil = 2 \\text{ paralel istasyon}$$\n2 paralel istasyon kurulduğunda efektif istasyon süresi $90 / 2 = 45\\,\\text{sn} < 50\\,\\text{sn}$ olur.",
        en: "**Worked Example:** Welding takes 90s, target $C = 50$s. Parallel stations needed: $\\lceil 90/50 \\rceil = 2$ stations (effective 45s/unit)."
      },
      vocabTerms: [
        { term_en: "bottleneck workstation", explanation_tr: "Montaj hattında en yüksek sürece sahip, hattın maksimum çıktısını kısıtlayan istasyon.", explanation_en: "The slowest station on an assembly line determining overall system throughput.", exampleSentence_en: "Adding a parallel robot eliminated the welding bottleneck." }
      ],
      questions: [{
        id: "m22-l6-q1", type: "numeric",
        prompt: { tr: "Bir işlem $t_i = 100$ saniye sürmekte ve hedef çevrim süresi $C = 40$ saniye ise bu işlem için kurulması gereken minimum paralel istasyon sayısı kaçtır?", en: "Task time = 100s, target C = 40s. Minimum parallel stations required?" },
        correctAnswer: 3,
        explanation: { tr: "$$k = \\lceil 100 / 40 \\rceil = \\lceil 2.5 \\rceil = 3 \\text{ paralel istasyon}$$ (Efektif süre: $100/3 = 33.3\\,\\text{sn} \\le 40$)", en: "$$\\lceil 100 / 40 \\rceil = 3$$" }
      }],
      realWorldBox: { excelFormula: "=YUKARIYUVARLA(DarboğazSüre / C; 0)", pythonCode: "parallel_stations = math.ceil(task_time / target_cycle_time)", powerBiNote: { tr: "Darboğaz analiz ve paralel hat simülatörü", en: "Bottleneck splitting simulator" } }
    }
  ],
  caseExams: [
    {
      id: "m22-c1",
      moduleId: "module-22",
      difficulty: "orta",
      title: { tr: "Vaka Sınavı: Tofaş Otomobil Montaj Hattı Dengeleme & Verimlilik", en: "Case Exam: Tofaş Automotive Line Balancing & Efficiency Optimization" },
      businessQuestion: {
        tr: "Tofaş Bursa fabrikasında yeni sedan modelinin kapı montaj hattı tasarlanmaktadır. 8 montaj görevinin süreleri toplamı $\\sum t_i = 240$ saniyedir. Günlük 16 saat (57.600 saniye) çalışma süresinde 600 adet kapı üretimi hedeflenmektedir. 1) Gerekli çevrim süresini ($C$), 2) Teorik minimum istasyon sayısını ($N_{\\min}$), 3) Sezgisel kural ile hat fiilen 3 istasyon olarak kurulduğunda Hat Verimliliğini ($\\eta$) ve Denge Gecikmesini ($BD$) hesaplayınız.",
        en: "Tofaş door assembly line has 8 tasks totaling $\\sum t_i = 240$ seconds. Available time is 16 hrs (57,600 sec) with target output 600 doors/day. Calculate: 1) Cycle time C, 2) Theoretical minimum stations N_min, 3) Line Efficiency and Balance Delay with 3 actual stations."
      },
      dataset: {
        columns: ["Parametre", "Formül", "Değer", "Birim"],
        rows: [
          ["Çalışma Süresi", "16 saat", 57600, "saniye"],
          ["Hedef Üretim", "Günlük Talep", 600, "adet/gün"],
          ["Çevrim Süresi (C)", "57600 / 600", 96, "saniye/adet"],
          ["Toplam İş Süresi", "\\sum t_i", 240, "saniye"],
          ["Teorik İstasyon (N_min)", "ceil(240 / 96)", 3, "istasyon"],
          ["Gerçek İstasyon (N)", "Fiili Kurulum", 3, "istasyon"],
          ["Hat Verimliliği (\\eta)", "240 / (3 * 96)", 0.8333, "%83.33"],
          ["Denge Gecikmesi (BD)", "100 - 83.33", 0.1667, "%16.67"]
        ]
      },
      guidedSteps: [
        { tr: "1. Adım: Çevrim süresi: $C = \\frac{57.600 \\text{ sn}}{600 \\text{ adet}} = 96$ saniye.", en: "Step 1: Cycle time $C = 57,600 / 600 = 96$ sec." },
        { tr: "2. Adım: Minimum istasyon sayısı: $N_{\\min} = \\lceil \\frac{240}{96} \\rceil = \\lceil 2.5 \\rceil = 3$ istasyon.", en: "Step 2: $N_{\\min} = \\lceil 240/96 \\rceil = 3$ stations." },
        { tr: "3. Adım: Verimlilik: $\\eta = \\frac{240}{3 \\times 96} = \\frac{240}{288} \\approx %83.33$. Denge gecikmesi = $\%16.67$.", en: "Step 3: Efficiency = 83.33%, Balance Delay = 16.67%." }
      ],
      expectedApproach: {
        tr: "Hat dengeleme matematiği ile çevrim süresi, istasyon sayısı ve hat verimliliği optimizasyonu yapma.",
        en: "Applying assembly line balancing formulations to minimize idle time and maximize throughput efficiency."
      },
      solutionQuestions: [{
        id: "m22-c1-q1", type: "numeric",
        prompt: { tr: "Tofaş kapı montaj hattının hedef çıktıyı sağlaması için gereken Çevrim Süresi ($C$) kaç saniyedir?", en: "What is the required Cycle Time C (in seconds)?" },
        correctAnswer: 96,
        explanation: { tr: "$$C = \\frac{57.600 \\text{ saniye}}{600 \\text{ adet}} = 96 \\text{ saniye}$$", en: "$$C = 57,600 / 600 = 96 \\text{ seconds}$$" }
      }]
    }
  ]
};

saveModule(module21);
saveModule(module22);
console.log('Indr100 modules 21 & 22 created.');
