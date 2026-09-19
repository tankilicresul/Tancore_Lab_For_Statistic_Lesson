const fs = require('fs');
const path = require('path');
const dataDir = path.join(__dirname, '../src/data');

function saveModule(modData) {
  const file = path.join(dataDir, `${modData.id.replace('-', '')}.json`);
  fs.writeFileSync(file, JSON.stringify(modData, null, 2), 'utf8');
  console.log(`✓ Saved ${modData.id} (${modData.title.tr}) with ${modData.lessons.length} lessons & ${modData.caseExams.length} cases.`);
}

// =========================================================================
// MODULE 19: Üretim Sistemleri & Süreç Seçimi (Hayes-Wheelwright, Job Shop, Batch)
// =========================================================================
const module19 = {
  id: "module-19",
  order: 19,
  title: {
    tr: "Modül 19: Üretim Sistemleri & Süreç Seçimi",
    en: "Module 19: Production Systems & Process Selection"
  },
  description: {
    tr: "Job Shop, Batch, Repetitive ve Continuous süreç yapıları, Hayes-Wheelwright ürün-süreç matrisi ve süreç teknolojileri.",
    en: "Job shop, batch, repetitive, and continuous process types, Hayes-Wheelwright product-process matrix, and advanced process technologies."
  },
  iconName: "Boxes",
  lessons: [
    {
      id: "m19-l1", moduleId: "module-19", order: 1, difficulty: "basit",
      title: { tr: "Üretim Sistemleri: MTO, MTS ve ATO Stratejileri", en: "Production Strategies: MTO, MTS & ATO" },
      conceptCard: {
        tr: "Müşteri siparişinin üretim akışına dahil olduğu noktaya göre 3 ana strateji:\n\n1. **Make-to-Order (MTO - Siparişe Göre Üretim):** Üretim yalnızca kesin müşteri siparişi gelince başlar (Özel yat, özel makine tasarımı). Sıfır bitmiş ürün stoku, uzun teslim süresi.\n2. **Make-to-Stock (MTS - Stoğa Göre Üretim):** Talep tahminlerine göre önceden üretilip depolanır (Diş macunu, standart konserve). Anında teslim, envanter riski.\n3. **Assemble-to-Order (ATO - Siparişe Göre Montaj):** Standart modüller önceden üretilir, sipariş gelince kişiselleştirilerek birleştirilir (Dell bilgisayarlar).",
        en: "MTO (Make-to-Order) produces after customer order. MTS (Make-to-Stock) produces to forecast. ATO (Assemble-to-Order) holds subassemblies and customizes upon order."
      },
      companyExample: {
        tr: "**Örnek Soru:** Dell, temel bilgisayar parçalarını (RAM, işlemci, kasa) standart modüller halinde stokta tutup, web sitesinden gelen müşteri konfigürasyonuna göre 2 saatte birleştirmektedir. Bu hangi stratejidir?\n\n**Çözüm:** Standart bileşenler hazır tutulup son montaj siparişle yapıldığı için bu tipik bir **ATO (Assemble-to-Order)** stratejisidir.",
        en: "**Worked Example:** Dell configuring PCs from pre-stocked modules upon customer web orders exemplifies Assemble-to-Order (ATO)."
      },
      vocabTerms: [
        { term_en: "Make-to-Order (MTO)", explanation_tr: "Müşteri siparişi gelmeden üretime başlanmayan, tamamen siparişe özel üretim.", explanation_en: "Manufacturing process where production starts only after customer order is confirmed.", exampleSentence_en: "Custom yacht manufacturing relies strictly on Make-to-Order operations." },
        { term_en: "Make-to-Stock (MTS)", explanation_tr: "Gelecek talep tahminlerine göre standart ürünlerin üretilip depoda tutulması.", explanation_en: "Strategy where goods are produced based on sales forecasts before demand occurs.", exampleSentence_en: "FMCG consumer goods companies use Make-to-Stock replenishment." }
      ],
      questions: [{
        id: "m19-l1-q1", type: "multiple-choice",
        prompt: { tr: "Sıfır bitmiş ürün stoku tutan ve üretim sürecini yalnızca kesinleşmiş müşteri siparişiyle başlatan strateji hangisidir?", en: "Which production strategy holds zero finished goods inventory and begins only upon customer order?" },
        options: [
          { tr: "Make-to-Order (MTO)", en: "Make-to-Order (MTO)" },
          { tr: "Make-to-Stock (MTS)", en: "Make-to-Stock (MTS)" },
          { tr: "Continuous Flow", en: "Continuous Flow" },
          { tr: "Mass Production", en: "Mass Production" }
        ],
        correctAnswer: 0,
        explanation: { tr: "MTO (Siparişe Göre Üretim) stratejisinde üretim tetikleyicisi müşteri siparişidir.", en: "MTO initiates production exclusively in response to confirmed customer orders." }
      }],
      realWorldBox: { excelFormula: "=EĞER(Stok_Var; \"MTS\"; \"MTO/ATO\")", pythonCode: "order_strategy = 'ATO' if modular_stock else 'MTO'", powerBiNote: { tr: "Sipariş karşılama ve teslim süresi (Lead Time) KPI", en: "Order fulfillment lead-time metrics" } }
    },
    {
      id: "m19-l2", moduleId: "module-19", order: 2, difficulty: "basit",
      title: { tr: "Atölye Tipi Üretim (Job Shop)", en: "Job Shop Production Systems" },
      conceptCard: {
        tr: "**Atölye Tipi (Job Shop) Özellikleri:**\n- **Ürün Çeşitliliği:** Çok yüksek (Her sipariş farklı spesifikasyona sahip olabilir).\n- **Üretim Hacmi:** Çok düşük (Genellikle 1 veya birkaç adet).\n- **Ekipman:** Genel amaçlı makineler (Torna, freze, kaynak).\n- **İşgücü:** Yüksek kalifiyeli, çok yönlü ustalar ve teknisyenler.\n- **Avantajı:** Yüksek esneklik ve müşteri isteğine tam uyum.\n- **Dezavantajı:** Yüksek birim maliyet, uzun hazırlık (setup) süreleri, karmaşık çizelgeleme.",
        en: "Job shop produces high-variety, low-volume customized goods using general-purpose equipment and highly skilled labor."
      },
      companyExample: {
        tr: "**Örnek Soru:** Özel prototip kalıp üreten bir makine atölyesi ayda 5 farklı müşteriye özel kalıp tasarlayıp üretmektedir. Bu sistem hangi süreç tipine girer?\n\n**Çözüm:** Yüksek çeşitlilik, düşük hacim ve genel amaçlı takım tezgahları kullanıldığı için **Job Shop (Atölye Tipi)** süreçtir.",
        en: "**Worked Example:** A custom mold manufacturing workshop with highly varied, low-volume batches is a classic Job Shop."
      },
      vocabTerms: [
        { term_en: "Job Shop", explanation_tr: "Düşük hacimli, yüksek çeşitlilikli, siparişe özel parçaların üretildiği atölye süreci.", explanation_en: "Manufacturing unit handling low-volume, high-variety custom jobs.", exampleSentence_en: "Job shop routing varies greatly from one customized part to another." }
      ],
      questions: [{
        id: "m19-l2-q1", type: "multiple-choice",
        prompt: { tr: "Aşağıdakilerden hangisi Atölye Tipi (Job Shop) üretimin temel özelliğidir?", en: "Which of the following is a core characteristic of Job Shop production?" },
        options: [
          { tr: "Çok yüksek ürün çeşitliliği ve düşük üretim hacmi", en: "Very high product variety and low production volume" },
          { tr: "Tamamen standart tek tip ürün ve milyonlarca adet çıktı", en: "Single standardized product and millions of units" },
          { tr: "Özel amaçlı pahalı transfer hatları", en: "Special-purpose expensive transfer lines" },
          { tr: "Sıfır esneklik", en: "Zero flexibility" }
        ],
        correctAnswer: 0,
        explanation: { tr: "Job Shop sistemleri yüksek çeşitlilik ve düşük hacimli özel siparişler için tasarlanmıştır.", en: "Job shops excel at handling high variety with low volumes." }
      }],
      realWorldBox: { excelFormula: "=EĞER(VE(Çeşitlilik=\"Yüksek\"; Hacim=\"Düşük\"); \"Job Shop\"; \"Diğer\")", pythonCode: "process_type = 'Job Shop' if variety > 0.8 and volume < 0.2 else 'Other'", powerBiNote: { tr: "Ürün çeşitlilik-hacim sınıflandırması", en: "Product variety vs volume categorization" } }
    },
    {
      id: "m19-l3", moduleId: "module-19", order: 3, difficulty: "basit",
      title: { tr: "Parti Tipi Üretim (Batch Production)", en: "Batch Production Systems" },
      conceptCard: {
        tr: "**Parti Tipi (Batch) Özellikleri:**\n- **Ürün Çeşitliliği:** Orta (Belirli bir ürün gamı içinden standart modeller).\n- **Üretim Hacmi:** Orta (Belirli partiler / lotlar halinde üretilir).\n- **Süreç:** Bir parti ürün (örn: 500 adet antibiyotik şurubu veya 200 adet fırın) üretildikten sonra makineler ayarlanarak (setup) bir sonraki partiye geçilir.\n- **Örnekler:** İlaç sanayi, fırıncılık, mobilya imalatı, konfeksiyon.",
        en: "Batch production manufactures moderate variety in repeating lot sizes with periodic changeovers (setups)."
      },
      companyExample: {
        tr: "**Örnek Soru:** Bir unlu mamuller fabrikası sabahları 1.000 adet kruvasan, ardından fırınları temizleyip ayar yaparak 2.000 adet simit üretmektedir. Bu üretim tipi nedir?\n\n**Çözüm:** Belirli partiler halinde partiler arası hazırlık (setup) yapılarak çalışıldığı için **Parti Tipi (Batch)** üretimdir.",
        en: "**Worked Example:** Producing 1,000 croissants followed by changeover to bake 2,000 bagels is Batch production."
      },
      vocabTerms: [
        { term_en: "batch production", explanation_tr: "Benzer ürünlerin gruplar (partiler/lotlar) halinde sıralı olarak üretilmesi.", explanation_en: "Method where identical items are manufactured in discrete groups.", exampleSentence_en: "Pharmaceutical tablets are produced in strictly tracked batch lots." }
      ],
      questions: [{
        id: "m19-l3-q1", type: "multiple-choice",
        prompt: { tr: "İlaç ve hazır giyim gibi sektörlerde benzer ürünlerin belirli partiler (lotlar) halinde parti geçişlerinde setup yapılarak üretilmesi hangi süreç tipidir?", en: "Which process type produces goods in discrete lot sizes with setup changeovers between batches?" },
        options: [
          { tr: "Parti Tipi Üretim (Batch)", en: "Batch Production" },
          { tr: "Sürekli Akış (Continuous)", en: "Continuous Flow" },
          { tr: "Proje Tipi (Project)", en: "Project" },
          { tr: "Sabit Konum (Fixed-Position)", en: "Fixed Position" }
        ],
        correctAnswer: 0,
        explanation: { tr: "Parti tipi (Batch) üretim, orta hacimli partilerin setup geçişleriyle üretildiği yapıdır.", en: "Batch manufacturing operates in repeated lots with setup changeovers." }
      }],
      realWorldBox: { excelFormula: "=Parti_Büyüklüğü * Birim_Süre + Setup_Süresi", pythonCode: "batch_cycle_time = (batch_size * unit_time) + setup_time", powerBiNote: { tr: "Parti büyüklüğü ve setup optimizasyonu", en: "Batch size and setup time analysis" } }
    },
    {
      id: "m19-l4", moduleId: "module-19", order: 4, difficulty: "orta",
      title: { tr: "Seri Üretim ve Sürekli Akış (Repetitive vs Continuous)", en: "Repetitive (Assembly Line) vs Continuous Flow" },
      conceptCard: {
        tr: "**1. Seri / Tekrarlı Üretim (Repetitive / Line Flow):**\n- Yüksek hacim, standart ürünler.\n- Parçalı çıktılar (Ayrık birimler: Otomobil, buzdolabı, televizyon).\n- Sabit hat yerleşimi, konveyör hatları ve özel amaçlı makineler.\n\n**2. Sürekli Akış Tipi Üretim (Continuous Flow):**\n- Çok yüksek hacim, son derece standart tek tip çıktı.\n- Sürekli/kesintisiz sıvı, gaz veya kimyasal akış (Petrol rafinerisi, şeker, çimento, elektrik üretimi).\n- 7/24 kesintisiz operasyon, durdurma maliyeti son derece yüksek, tam otomasyon.",
        en: "Repetitive lines produce high volumes of discrete standardized units (cars, electronics). Continuous flow processes non-discrete commodities (refineries, chemicals) in uninterrupted 24/7 streams."
      },
      companyExample: {
        tr: "**Örnek Soru:** Tüpraş petrol rafinerisinde ham petrolün damıtılarak 7/24 kesintisiz benzin ve dizele dönüştürülmesi hangi üretim tipine örnektir?\n\n**Çözüm:** Kesintisiz, bölünemeyen sıvı akışı ve 7/24 tam otomasyon olduğu için **Sürekli Akış (Continuous Flow)** sürecidir.",
        en: "**Worked Example:** 24/7 crude oil refining into gasoline represents a Continuous Flow process."
      },
      vocabTerms: [
        { term_en: "continuous flow", explanation_tr: "Kesintisiz 7/24 devam eden, ayrık olmayan ürünlerin üretildiği yüksek otomasyonlu süreç.", explanation_en: "Highly automated production of non-discrete materials in uninterrupted flow.", exampleSentence_en: "Petrochemical plants operate on a continuous flow basis." }
      ],
      questions: [{
        id: "m19-l4-q1", type: "multiple-choice",
        prompt: { tr: "Aşağıdakilerden hangisi Sürekli Akış (Continuous Flow) üretimine örnektir?", en: "Which of the following is an example of Continuous Flow production?" },
        options: [
          { tr: "Petrol rafinerisi ve çimento üretimi", en: "Oil refinery and cement production" },
          { tr: "Müşteriye özel yat inşası", en: "Custom luxury yacht building" },
          { tr: "Butik terzi atölyesi", en: "Boutique tailor shop" },
          { tr: "Özel prototip kalıp imalatı", en: "Custom prototype molding" }
        ],
        correctAnswer: 0,
        explanation: { tr: "Petrol rafinerileri, kâğıt, cam ve çimento fabrikaları tipik sürekli akış süreçleridir.", en: "Oil refineries and cement plants are classic continuous flow operations." }
      }],
      realWorldBox: { excelFormula: "=EĞER(Akış=\"7/24 Kesintisiz\"; \"Continuous\"; \"Discrete Line\")", pythonCode: "process = 'Continuous' if is_24_7_fluid else 'Repetitive'", powerBiNote: { tr: "Hat verimliliği ve duruş süresi (Downtime) analitiği", en: "Continuous uptime monitoring" } }
    },
    {
      id: "m19-l5", moduleId: "module-19", order: 5, difficulty: "orta",
      title: { tr: "Hayes & Wheelwright Ürün-Süreç Matrisi", en: "Hayes & Wheelwright Product-Process Matrix" },
      conceptCard: {
        tr: "Hayes & Wheelwright Ürün-Süreç Matrisi, ürünün yaşam evresi (Hacim & Çeşitlilik) ile üretim süreci tasarımı arasındaki stratejik uyumu gösterir:\n\n$$\\begin{matrix}\n& \\textbf{Düşük Hacim} & \\textbf{Orta Hacim} & \\textbf{Yüksek Hacim} & \\textbf{Çok Yüksek Hacim} \\\\\n\\textbf{Job Shop} & \\color{green}{\\textbf{Diyagonal Uyum}} & & & \\\\\n\\textbf{Batch} & & \\color{green}{\\textbf{Diyagonal Uyum}} & & \\\\\n\\textbf{Line Flow} & & & \\color{green}{\\textbf{Diyagonal Uyum}} & \\\\\n\\textbf{Continuous} & & & & \\color{green}{\\textbf{Diyagonal Uyum}}\n\\end{matrix}$$\n\n- **Diyagonalin Dışı (Mismatches):**\n  - *Diyagonalin Sol Altı:* Yüksek hacimli ürünü Job Shop'ta üretmeye çalışmak $\\implies$ Yüksek maliyet, kapasite yetersizliği.\n  - *Diyagonalin Sağ Üstü:* Düşük hacimli özel ürünü otomatik montaj hattında üretmeye çalışmak $\\implies$ Esneklik kaybı, yüksek batık maliyet.",
        en: "The Product-Process Matrix aligns product structure (variety vs volume) with process choice along the diagonal to ensure strategic competitive advantage."
      },
      companyExample: {
        tr: "**Örnek Soru:** Müşteriye özel tekil prototip üreten bir firma, 50 milyon dolarlık otomatik seri montaj hattı kurarsa ne tür bir stratejik hata yapmış olur?\n\n**Çözüm:** Düşük hacimli ve değişken ürün için esnekliği sıfır olan yüksek sabit maliyetli hat kurarak matrisin sağ üst bölgesine sapmış, aşırı maliyet ve esneklik kaybı yaşamıştır.",
        en: "**Worked Example:** Installing an automated line for low-volume custom prototypes creates an off-diagonal mismatch of lost flexibility."
      },
      vocabTerms: [
        { term_en: "Product-Process Matrix", explanation_tr: "Ürün hacim-çeşitlilik yapısı ile fabrika süreç tipini eşleştiren stratejik matris.", explanation_en: "Framework analyzing the fit between product lifecycle volume and process architecture.", exampleSentence_en: "Staying on the diagonal of the product-process matrix maximizes operational efficiency." }
      ],
      questions: [{
        id: "m19-l5-q1", type: "multiple-choice",
        prompt: { tr: "Hayes & Wheelwright matrisine göre, yüksek hacimli ve standart bir ürün için en uygun süreç seçimi hangisidir?", en: "According to Hayes & Wheelwright, which process best fits high volume, standardized products?" },
        options: [
          { tr: "Seri Montaj Hattı / Tekrarlı Üretim (Line Flow)", en: "Assembly Line / Repetitive Flow" },
          { tr: "Atölye Tipi (Job Shop)", en: "Job Shop" },
          { tr: "Proje Tipi Üretim", en: "Project Manufacturing" },
          { tr: "Siparişe Özel Butik İmalat", en: "Custom Boutique Fabrication" }
        ],
        correctAnswer: 0,
        explanation: { tr: "Yüksek hacim ve standart ürünler montaj hattı (Line Flow) veya Sürekli Akış (Continuous) ile eşleşir.", en: "High-volume standardized goods align on the diagonal with line flow." }
      }],
      realWorldBox: { excelFormula: "=EĞER(Hacim=\"Yüksek\"; \"Line Flow\"; \"Job Shop/Batch\")", pythonCode: "matrix_fit = 'Diagonal Match' if (vol > 0.7 and variety < 0.3) else 'Mismatch'", powerBiNote: { tr: "Ürün-Süreç stratejik konumlandırma haritası", en: "Strategic process alignment visual" } }
    },
    {
      id: "m19-l6", moduleId: "module-19", order: 6, difficulty: "orta",
      title: { tr: "Süreç Teknolojileri: CNC, FMS ve Endüstri 4.0", en: "Process Technologies: CNC, FMS & Industry 4.0" },
      conceptCard: {
        tr: "**Gelişmiş Süreç Teknolojileri:**\n\n1. **CNC (Computer Numerical Control):** Bilgisayar programlarıyla metal/ahşap işleyen hassas tezgahlar.\n2. **Robotik Sistemler:** Kaynak, boyama, paletleme ve montaj işlemlerinde yüksek tekrarlanabilirlik sağlayan kollar.\n3. **AGV (Automated Guided Vehicles) & AMR:** Fabrika içinde otonom malzeme taşıyan araçlar.\n4. **FMS (Flexible Manufacturing Systems - Esnek Üretim Sistemleri):** Birbirine bağlı CNC tezgahları, otomatik depolama (AS/RS) ve robotların merkezi bilgisayarla yönetildiği sistem.\n5. **CAD / CAM / CIM:** Bilgisayar destekli tasarım, imalat ve entegre üretim.",
        en: "Advanced manufacturing technologies include CNC machines, industrial robots, AGVs/AMRs, Flexible Manufacturing Systems (FMS), and Computer Integrated Manufacturing (CIM)."
      },
      companyExample: {
        tr: "**Örnek Soru:** Bir FMS hücresi, parça değişimlerinde setup süresini 45 dakikadan 3 dakikaya indirmeyi başarmıştır. Setup süresindeki azalma yüzdesi nedir?\n\n**Çözüm:**\n$$\\text{Azalma} = \\frac{45 - 3}{45} \\times 100 = \\frac{42}{45} \\times 100 \\approx 93.33\\%$$",
        en: "**Worked Example:** Setup time reduced from 45 min to 3 min in FMS yields $(45-3)/45 \\times 100 = 93.33\\%$ setup reduction."
      },
      vocabTerms: [
        { term_en: "Flexible Manufacturing System (FMS)", explanation_tr: "Merkezi bilgisayarla yönetilen, farklı parça tiplerine hızla uyum sağlayan esnek otomasyon hücresi.", explanation_en: "Automated production system that can readily adapt to product changes.", exampleSentence_en: "The FMS cell reduced batch changeover downtime significantly." }
      ],
      questions: [{
        id: "m19-l6-q1", type: "multiple-choice",
        prompt: { tr: "Bilgisayar kontrollü tezgahlar, robotik taşıyıcılar ve otomatik takım değiştiricilerin entegre olduğu esnek üretim sistemine ne ad verilir?", en: "What is an integrated system of CNC machines, robots, and automated handling called?" },
        options: [
          { tr: "FMS (Flexible Manufacturing System)", en: "FMS (Flexible Manufacturing System)" },
          { tr: "Geleneksel Manuel Torna", en: "Traditional Manual Lathe" },
          { tr: "Statik Depolama", en: "Static Warehousing" },
          { tr: "Klasik Konveyör", en: "Classic Gravity Conveyor" }
        ],
        correctAnswer: 0,
        explanation: { tr: "FMS (Esnek Üretim Sistemleri), yüksek otomasyonu esneklikle birleştiren modern üretim hücresidir.", en: "FMS integrates CNCs and material handling into a flexible automated unit." }
      }],
      realWorldBox: { excelFormula: "=(Eski_Setup - Yeni_Setup) / Eski_Setup", pythonCode: "setup_reduction = (old_setup - new_setup) / old_setup", powerBiNote: { tr: "Otomasyon ROI ve OEE takip göstergeleri", en: "Automation OEE and setup metrics" } }
    }
  ],
  caseExams: [
    {
      id: "m19-c1",
      moduleId: "module-19",
      difficulty: "orta",
      title: { tr: "Vaka Sınavı: Arçelik Akıllı Fabrika Süreç Seçimi & Üretim Matrisi", en: "Case Exam: Arçelik Smart Factory Process Selection & Matrix Alignment" },
      businessQuestion: {
        tr: "Arçelik Çerkezköy fabrikasında 3 farklı ürün grubu üretilmektedir: 1) Standart Çamaşır Makinesi (Yıllık 800.000 adet), 2) Özel Tasarım Ankastre Fırın (Yıllık 5.000 adet, 12 farklı renk ve panel seçeneği), 3) Ar-Ge Prototip Akıllı Ev Aletleri (Yıllık 100 adet özel parça). Her ürün grubu için en uygun üretim süreç tipini (Line Flow, Batch, Job Shop) Hayes-Wheelwright matrisine göre eşleştiriniz ve yıllık 800.000 adetlik çamaşır makinesi hattında günlük 2 vardiya (16 saat) çalışıldığında saatlik gereken üretim hızını hesaplayınız (Yıl = 250 iş günü).",
        en: "Arçelik produces 3 product families: 1) Standard Washers (800k units/yr), 2) Built-in Ovens (5k units/yr, 12 variants), 3) R&D Prototypes (100 custom units/yr). Match each product to its optimal process type and calculate required hourly output for washers across 250 days (16 hrs/day)."
      },
      dataset: {
        columns: ["Ürün_Grubu", "Yıllık_Hacim", "Çeşitlilik", "Önerilen_Süreç"],
        rows: [
          ["Standart Çamaşır Makinesi", 800000, "Düşük (Standart)", "Line Flow (Montaj Hattı)"],
          ["Özel Ankastre Fırın", 5000, "Orta (12 Renk/Tip)", "Batch (Parti Tipi)"],
          ["Ar-Ge Prototip", 100, "Çok Yüksek (Özel)", "Job Shop (Atölye Tipi)"]
        ]
      },
      guidedSteps: [
        { tr: "1. Adım: Toplam çalışma saatini bul: $250 \\text{ gün} \\times 16 \\text{ saat/gün} = 4.000 \\text{ saat/yıl}$.", en: "Step 1: Calculate annual working hours: $250 \\times 16 = 4,000$ hrs." },
        { tr: "2. Adım: Saatlik üretim hızını bul: $\\text{Hız} = \\frac{800.000}{4.000} = 200 \\text{ adet/saat}$.", en: "Step 2: Calculate hourly rate: $800,000 / 4,000 = 200$ units/hr." },
        { tr: "3. Adım: Süreç eşleştirmesini kontrol et (800k $\\rightarrow$ Line Flow, 5k $\\rightarrow$ Batch, 100 $\\rightarrow$ Job Shop).", en: "Step 3: Confirm process alignment matches." }
      ],
      expectedApproach: {
        tr: "Hacim ve çeşitlilik kriterlerine göre doğru üretim süreç tipini belirleme ve hat üretim kapasite gereksinimini hesaplama.",
        en: "Matching product volume and variety to process architecture and computing required line pace."
      },
      solutionQuestions: [{
        id: "m19-c1-q1", type: "numeric",
        prompt: { tr: "Çamaşır makinesi montaj hattının saatte üretmesi gereken parça sayısı (adet/saat) kaçtır?", en: "What is the required hourly production rate for the washing machine line?" },
        correctAnswer: 200,
        explanation: { tr: "$$\\text{Saatlik Hız} = \\frac{800.000 \\text{ adet}}{250 \\times 16 \\text{ saat}} = \\frac{800.000}{4.000} = 200 \\text{ adet/saat}$$", en: "$$\\text{Hourly Rate} = 800,000 / 4,000 = 200 \\text{ units/hr}$$" }
      }]
    }
  ]
};

// =========================================================================
// MODULE 20: Kapasite Planlama & Başa Baş Analizi
// =========================================================================
const module20 = {
  id: "module-20",
  order: 20,
  title: {
    tr: "Modül 20: Kapasite Planlama & Başa Baş Analizi",
    en: "Module 20: Capacity Planning & Break-Even Analysis"
  },
  description: {
    tr: "Tasarım ve efektif kapasite, kullanım oranı, kapasite verimliliği, başa baş noktası ve Make-or-Buy analizleri.",
    en: "Design vs effective capacity, utilization, efficiency, break-even analysis, target profit planning, and Make-or-Buy decisions."
  },
  iconName: "TrendingUp",
  lessons: [
    {
      id: "m20-l1", moduleId: "module-20", order: 1, difficulty: "basit",
      title: { tr: "Tasarım Kapasitesi vs Efektif Kapasite", en: "Design Capacity vs Effective Capacity" },
      conceptCard: {
        tr: "**Kapasite Kavramları:**\n\n1. **Tasarım Kapasitesi (Design Capacity):** İdeal koşullar altında, hiçbir duruş, arıza, bakım veya gecikme olmadan ulaşılabilecek teorik maksimum üretim hızıdır.\n2. **Efektif Kapasite (Effective Capacity):** Bakım molaları, ürün geçişleri (setup), işçi dinlenme payları ve gerçekçi çalışma koşulları hesaba katıldığında hedeflenen sürdürülebilir kapasitedir.\n3. **Gerçek Çıktı (Actual Output):** Sistemin belirli bir dönemde fiilen ürettiği gerçek ürün miktarıdır.\n\n$$\\text{Tasarım Kapasitesi} \\ge \\text{Efektif Kapasite} \\ge \\text{Gerçek Çıktı}$$",
        en: "Design capacity is theoretical max output under ideal conditions. Effective capacity accounts for planned maintenance, setups, and mix. Actual output is the real production achieved."
      },
      companyExample: {
        tr: "**Örnek Soru:** Bir bisküvi paketleme hattının tasarım kapasitesi saatte 1.000 pakettir. Günlük bakım ve ürün değişimleri nedeniyle planlanan efektif kapasite saatte 800 pakettir. Hat bugün saatte ortalama 720 paket üretmiştir. Sıralamayı kontrol ediniz.\n\n**Çözüm:** $1000 \\text{ (Tasarım)} \\ge 800 \\text{ (Efektif)} \\ge 720 \\text{ (Gerçek)}$.",
        en: "**Worked Example:** Design = 1000/hr, Effective = 800/hr, Actual = 720/hr."
      },
      vocabTerms: [
        { term_en: "design capacity", explanation_tr: "Sistemin ideal koşullardaki teorik maksimum çıktı kapasitesi.", explanation_en: "The maximum theoretical output rate designed under ideal conditions.", exampleSentence_en: "The design capacity of the furnace is 500 tons per day." },
        { term_en: "effective capacity", explanation_tr: "Bakım, setup ve molalar düşüldükten sonraki gerçekçi kapasite hedefi.", explanation_en: "Capacity a firm expects to achieve given its current operating constraints.", exampleSentence_en: "Effective capacity dropped due to frequent product changeovers." }
      ],
      questions: [{
        id: "m20-l1-q1", type: "multiple-choice",
        prompt: { tr: "Hiçbir arıza, mola veya gecikme olmadan sistemin ulaşabileceği TEORİK MAKSİMUM kapasiteye ne ad verilir?", en: "What is the theoretical maximum output of a system under ideal conditions called?" },
        options: [
          { tr: "Tasarım Kapasitesi (Design Capacity)", en: "Design Capacity" },
          { tr: "Efektif Kapasite", en: "Effective Capacity" },
          { tr: "Gerçek Çıktı", en: "Actual Output" },
          { tr: "Emniyet Stoku", en: "Safety Stock" }
        ],
        correctAnswer: 0,
        explanation: { tr: "Tasarım kapasitesi ideal koşullardaki teorik maksimum çıktıdır.", en: "Design capacity represents theoretical maximum output." }
      }],
      realWorldBox: { excelFormula: "=Gerçek_Çıktı / Tasarım_Kapasitesi", pythonCode: "design_cap = 1000\neffective_cap = 800\nactual_out = 720", powerBiNote: { tr: "Kapasite hiyerarşisi şelale grafiği (Waterfall)", en: "Capacity loss waterfall visualization" } }
    },
    {
      id: "m20-l2", moduleId: "module-20", order: 2, difficulty: "orta",
      title: { tr: "Kapasite Kullanım Oranı ve Verimlilik", en: "Utilization & Efficiency Metrics" },
      conceptCard: {
        tr: "**Temel Kapasite Performans Göstergeleri:**\n\n1. **Kullanım Oranı (Utilization):** Gerçek çıktının teorik tasarım kapasitesine oranıdır:\n$$\\text{Kullanım Oranı (Utilization)} = \\frac{\\text{Gerçek Çıktı}}{\\text{Tasarım Kapasitesi}} \\times 100$$\n\n2. **Kapasite Verimliliği (Efficiency):** Gerçek çıktının efektif kapasiteye oranıdır:\n$$\\text{Verimlilik (Efficiency)} = \\frac{\\text{Gerçek Çıktı}}{\\text{Efektif Kapasite}} \\times 100$$",
        en: "Utilization = (Actual Output / Design Capacity) * 100. Efficiency = (Actual Output / Effective Capacity) * 100."
      },
      companyExample: {
        tr: "**Örnek Soru:** Tasarım kapasitesi 50 kamyon/gün, efektif kapasitesi 40 kamyon/gün olan bir serviste günde 36 kamyon tamir edilmektedir. Kullanım oranı ve verimlilik nedir?\n\n**Çözüm:**\n$$\\text{Kullanım Oranı} = \\frac{36}{50} \\times 100 = 72\\%$$\n$$\\text{Verimlilik} = \\frac{36}{40} \\times 100 = 90\\%$$",
        en: "**Worked Example:** Design = 50, Effective = 40, Actual = 36. Utilization = 36/50 = 72%. Efficiency = 36/40 = 90%."
      },
      vocabTerms: [
        { term_en: "utilization", explanation_tr: "Gerçek çıktının tasarım kapasitesine bölünmesiyle bulunan kullanım yüzdesi.", explanation_en: "Percentage of design capacity actually achieved.", exampleSentence_en: "Plant utilization averaged 72% over the quarter." },
        { term_en: "efficiency", explanation_tr: "Gerçek çıktının planlanan efektif kapasiteye oranı.", explanation_en: "Percentage of effective capacity actually achieved.", exampleSentence_en: "Operating efficiency reached 90% after eliminating line micro-stops." }
      ],
      questions: [{
        id: "m20-l2-q1", type: "numeric",
        prompt: { tr: "Tasarım kapasitesi 100 birim/saat, efektif kapasitesi 80 birim/saat olan bir fabrikada gerçek çıktı 60 birim/saat ise Kapasite Verimliliği (Efficiency) yüzde kaçtır?", en: "Design = 100, Effective = 80, Actual = 60. What is Efficiency (%)?" },
        correctAnswer: 75,
        explanation: { tr: "$$\\text{Verimlilik} = \\frac{60}{80} \\times 100 = 0.75 \\times 100 = 75\\%$$", en: "$$\\text{Efficiency} = (60/80) * 100 = 75\\%$$" }
      }],
      realWorldBox: { excelFormula: "=Gerçek / Efektif", pythonCode: "utilization = (actual / design) * 100\nefficiency = (actual / effective) * 100", powerBiNote: { tr: "Tesis OEE ve Kapasite Kullanım göstergeleri", en: "Plant capacity KPI gauge" } }
    },
    {
      id: "m20-l3", moduleId: "module-20", order: 3, difficulty: "orta",
      title: { tr: "Kapasite Stratejileri ve Ölçek Ekonomisi", en: "Capacity Strategies & Economies of Scale" },
      conceptCard: {
        tr: "**Kapasite Genişletme Stratejileri:**\n1. **Öncü Strateji (Lead Strategy):** Talep gelmeden önce kapasiteyi önden artırır. Müşteri kaybını önler, atıl kapasite riski taşır.\n2. **İzleyici Strateji (Lag Strategy):** Talep kesinleştikten sonra kapasite artırır. Düşük risklidir ancak talep kaçırılabilir.\n3. **Eşzamanlı Strateji (Tracking Strategy):** Talebi küçük adımlarla takip eder.\n\n**Ölçek Ekonomisi (Economies of Scale):** Üretim hacmi arttıkça sabit maliyetler daha çok birime bölünür ve birim maliyet düşer.\n**Negatif Ölçek Ekonomisi (Diseconomies of Scale):** Tesis aşırı büyüdüğünde bürokrasi, iletişim kopuklukları ve lojistik darboğazlar nedeniyle birim maliyetin tekrar yükselmesidir.",
        en: "Capacity expansion strategies: Lead (ahead of demand), Lag (after demand spikes), Tracking. Economies of scale reduce unit costs until complexity triggers diseconomies of scale."
      },
      companyExample: {
        tr: "**Örnek Soru:** 10.000 adet üretimde birim maliyet 50 TL iken, fabrika büyütülüp 100.000 adet üretildiğinde birim maliyet 30 TL'ye düşmüştür. Bu durum ne ile açıklanır?\n\n**Çözüm:** Sabit maliyetlerin yüksek hacme dağılması ve toplu alım indirimleri sayesinde **Ölçek Ekonomisi (Economies of Scale)** gerçekleşmiştir.",
        en: "**Worked Example:** Unit cost dropping from $50 to $30 as volume scales from 10k to 100k units is classic Economies of Scale."
      },
      vocabTerms: [
        { term_en: "economies of scale", explanation_tr: "Üretim ölçeği büyüdükçe birim başına düşen ortalama maliyetin azalması.", explanation_en: "Cost advantages reaped by companies when production becomes efficient as scale increases.", exampleSentence_en: "Megafactories leverage economies of scale to lower battery cell prices." }
      ],
      questions: [{
        id: "m20-l3-q1", type: "multiple-choice",
        prompt: { tr: "Piyasadaki talep henüz gelmeden, pazar payı kapmak amacıyla kapasiteyi önden artıran strateji hangisidir?", en: "Which capacity strategy expands capacity in advance of expected demand growth?" },
        options: [
          { tr: "Öncü Strateji (Lead Strategy)", en: "Lead Strategy" },
          { tr: "İzleyici Strateji (Lag Strategy)", en: "Lag Strategy" },
          { tr: "Kapasite Daraltma", en: "Capacity Contraction" },
          { tr: "Pasif Bekleme", en: "Passive Waiting" }
        ],
        correctAnswer: 0,
        explanation: { tr: "Öncü (Lead) strateji talepten önce kapasite inşa ederek talebi tam karşılamayı hedefler.", en: "Lead capacity strategy adds capacity proactively before demand occurs." }
      }],
      realWorldBox: { excelFormula: "=Toplam_Maliyet / Miktar", pythonCode: "unit_cost = (fixed_cost + (variable_cost * Q)) / Q", powerBiNote: { tr: "Birim maliyet ve üretim hacmi eğrisi", en: "Volume-cost scaling curve" } }
    },
    {
      id: "m20-l4", moduleId: "module-20", order: 4, difficulty: "orta",
      title: { tr: "Başa Baş Noktası (Break-Even Analysis)", en: "Break-Even Point (BEP) Analysis" },
      conceptCard: {
        tr: "Başa Baş Noktası ($Q_{\\text{BEP}}$), toplam gelirin toplam maliyete eşit olduğu, kârın sıfır olduğu üretim miktarıdır:\n\n$$\\text{Toplam Gelir} = \\text{Toplam Maliyet} \\implies P \\cdot Q = FC + (VC \\cdot Q)$$\n\n$$\\mathbf{Q_{\\text{BEP}} = \\frac{FC}{P - VC}}$$\n\n- $FC$: Sabit Maliyetler (Kira, amortisman, sabit maaşlar)\n- $VC$: Birim Değişken Maliyet (Hammadde, doğrudan işçilik)\n- $P$: Birim Satış Fiyatı\n- $(P - VC)$: **Birim Katkı Payı (Contribution Margin)**",
        en: "Break-even quantity $Q_{\\text{BEP}} = \\frac{FC}{P - VC}$, where $FC$ is fixed cost, $VC$ is unit variable cost, and $(P - VC)$ is unit contribution margin."
      },
      companyExample: {
        tr: "**Örnek Soru:** Sabit maliyeti $FC = 100.000$ TL, birim değişken maliyeti $VC = 40$ TL ve satış fiyatı $P = 90$ TL olan bir ürünün başa baş noktası nedir?\n\n**Çözüm:**\n$$\\text{Birim Katkı Payı} = P - VC = 90 - 40 = 50 \\text{ TL}$$\n$$Q_{\\text{BEP}} = \\frac{100.000}{50} = 2.000 \\text{ adet}$$",
        en: "**Worked Example:** $FC = 100k, VC = 40, P = 90$. $Q_{\\text{BEP}} = 100,000 / (90 - 40) = 2,000$ units."
      },
      vocabTerms: [
        { term_en: "Break-Even Point (BEP)", explanation_tr: "Toplam gelirin toplam maliyeti tam karşıladığı sıfır kâr noktası.", explanation_en: "Production volume where total revenue exactly equals total costs.", exampleSentence_en: "The plant reached its break-even point in the fifth month." },
        { term_en: "contribution margin", explanation_tr: "Satış fiyatından değişken maliyetin çıkarılmasıyla kalan birim kâr payı: P - VC.", explanation_en: "Marginal profit per unit contributing to covering fixed overhead: P - VC.", exampleSentence_en: "A higher contribution margin lowers the break-even volume." }
      ],
      questions: [{
        id: "m20-l4-q1", type: "numeric",
        prompt: { tr: "$FC = 60.000$ TL, $P = 150$ TL ve $VC = 100$ TL ise başa baş üretim miktarı $Q_{\\text{BEP}}$ kaçtır?", en: "If FC = 60,000, P = 150, and VC = 100, what is Q_BEP?" },
        correctAnswer: 1200,
        explanation: { tr: "$$Q_{\\text{BEP}} = \\frac{60.000}{150 - 100} = \\frac{60.000}{50} = 1.200 \\text{ adet}$$", en: "$$Q_{\\text{BEP}} = 60,000 / 50 = 1,200$$" }
      }],
      realWorldBox: { excelFormula: "=FC / (P - VC)", pythonCode: "def calc_bep(fc, price, vc):\n    return fc / (price - vc)", powerBiNote: { tr: "Başa baş ve kârlılık duyarlılık analizi", en: "Break-even sensitivity model" } }
    },
    {
      id: "m20-l5", moduleId: "module-20", order: 5, difficulty: "orta",
      title: { tr: "Hedef Kâr ve Gelir Analizi", en: "Target Profit & Revenue Planning" },
      conceptCard: {
        tr: "Belirli bir hedef kâr ($TP - \\text{Target Profit}$) elde etmek için üretilmesi gereken miktar:\n\n$$Q_{\\text{Hedef}} = \\frac{FC + TP}{P - VC}$$\n\n**Başa Baş Satış Geliri ($R_{\\text{BEP}}$):**\n$$R_{\\text{BEP}} = Q_{\\text{BEP}} \\times P = \\frac{FC}{1 - \\frac{VC}{P}} = \\frac{FC}{\\text{Katkı Oranı}}$$",
        en: "To achieve a target profit $TP$: $Q = \\frac{FC + TP}{P - VC}$. Break-even revenue $R_{\\text{BEP}} = \\frac{FC}{\\text{Contribution Margin Ratio}}$."
      },
      companyExample: {
        tr: "**Örnek Soru:** $FC = 50.000$ TL, $P = 200$ TL, $VC = 120$ TL. Şirket $30.000$ TL kâr etmek için kaç adet satmalıdır?\n\n**Çözüm:**\n$$Q = \\frac{50.000 + 30.000}{200 - 120} = \\frac{80.000}{80} = 1.000 \\text{ adet}$$",
        en: "**Worked Example:** $FC = 50k, P = 200, VC = 120, TP = 30k$. $Q = (50,000 + 30,000) / 80 = 1,000$ units."
      },
      vocabTerms: [
        { term_en: "target profit", explanation_tr: "İşletmenin dönem sonunda elde etmeyi hedeflediği net kâr tutarı.", explanation_en: "The desired profit level planned for a fiscal period.", exampleSentence_en: "Target profit analysis determined sales quotas for the regional distributors." }
      ],
      questions: [{
        id: "m20-l5-q1", type: "numeric",
        prompt: { tr: "$FC = 40.000$ TL, $P = 100$ TL, $VC = 60$ TL olan bir işletme $20.000$ TL net kâr hedefliyorsa kaç adet ürün satmalıdır?", en: "FC = 40,000, P = 100, VC = 60, Target Profit = 20,000. Required Q?" },
        correctAnswer: 1500,
        explanation: { tr: "$$Q = \\frac{40.000 + 20.000}{100 - 60} = \\frac{60.000}{40} = 1.500 \\text{ adet}$$", en: "$$Q = 60,000 / 40 = 1,500$$" }
      }],
      realWorldBox: { excelFormula: "=(FC + HedefKâr) / (P - VC)", pythonCode: "req_qty = (fc + target_profit) / (price - vc)", powerBiNote: { tr: "Hedef kâr ve bütçe simülatörü", en: "Target profit scenario manager" } }
    },
    {
      id: "m20-l6", moduleId: "module-20", order: 6, difficulty: "ileri",
      title: { tr: "Make or Buy (Üret ya da Satın Al) Analizi", en: "Make or Buy Decision Analysis" },
      conceptCard: {
        tr: "Bir parçanın şirket içinde üretilmesi (Make) ile dışarıdan tedarik edilmesi (Buy) arasındaki maliyet karşılaştırması:\n\n- **Üretim Maliyeti:** $TC_{\\text{Make}} = FC_{\\text{Make}} + (VC_{\\text{Make}} \\cdot Q)$\n- **Satın Alma Maliyeti:** $TC_{\\text{Buy}} = P_{\\text{Buy}} \\cdot Q$\n\n**Eşik Miktar ($Q^*$):** İki seçeneğin maliyetlerinin eşitlendiği hacimdir:\n$$FC_{\\text{Make}} + (VC_{\\text{Make}} \\cdot Q^*) = P_{\\text{Buy}} \\cdot Q^* \\implies \\mathbf{Q^* = \\frac{FC_{\\text{Make}}}{P_{\\text{Buy}} - VC_{\\text{Make}}}}$$\n\n- Eğer beklenen talep $Q > Q^*$ ise: **ÜRET (Make)** (Sabit maliyeti amorti eder).\n- Eğer beklenen talep $Q < Q^*$ ise: **SATIN AL (Buy)**.",
        en: "Make-or-Buy indifference quantity: $Q^* = \\frac{FC_{\\text{Make}}}{P_{\\text{Buy}} - VC_{\\text{Make}}}$. Produce in-house if expected volume $Q > Q^*$; outsource if $Q < Q^*$."
      },
      companyExample: {
        tr: "**Örnek Soru:** Bir parçayı dışarıdan 25 TL'ye satın almak mümkündür ($P_{\\text{Buy}} = 25$). İçeride üretmek için 60.000 TL kalıp yatırımı ($FC = 60.000$) ve birim başı 10 TL değişken maliyet ($VC = 10$) gerekmektedir. Eşik miktar nedir?\n\n**Çözüm:**\n$$Q^* = \\frac{60.000}{25 - 10} = \\frac{60.000}{15} = 4.000 \\text{ adet}$$\nYıllık talep 4.000'den fazlaysa üretmek daha kârlıdır.",
        en: "**Worked Example:** $P_{\\text{Buy}} = 25, FC = 60k, VC = 10$. Indifference volume $Q^* = 60,000 / (25 - 10) = 4,000$ units."
      },
      vocabTerms: [
        { term_en: "Make-or-Buy analysis", explanation_tr: "Bir girdinin içeride üretilmesi ile dışarıdan satın alınması arasındaki maliyet eşiği kararı.", explanation_en: "Strategic decision whether to manufacture in-house or outsource from external suppliers.", exampleSentence_en: "Make-or-buy analysis proved in-house injection molding was cheaper above 4,000 units." }
      ],
      questions: [{
        id: "m20-l6-q1", type: "numeric",
        prompt: { tr: "Satın alma fiyatı $P_{\\text{Buy}} = 50$ TL, şirket içi üretim sabit maliyeti $FC = 120.000$ TL ve değişken maliyeti $VC = 20$ TL ise eşik miktar $Q^*$ kaçtır?", en: "P_buy = 50, FC = 120,000, VC = 20. What is threshold Q*?" },
        correctAnswer: 4000,
        explanation: { tr: "$$Q^* = \\frac{120.000}{50 - 20} = \\frac{120.000}{30} = 4.000 \\text{ adet}$$", en: "$$Q^* = 120,000 / 30 = 4,000$$" }
      }],
      realWorldBox: { excelFormula: "=FC_Make / (P_Buy - VC_Make)", pythonCode: "def make_or_buy_cutoff(fc, p_buy, vc):\n    return fc / (p_buy - vc)", powerBiNote: { tr: "Outsourcing vs In-house maliyet kırılımı", en: "Make vs buy cost threshold chart" } }
    }
  ],
  caseExams: [
    {
      id: "m20-c1",
      moduleId: "module-20",
      difficulty: "orta",
      title: { tr: "Vaka Sınavı: Ford Otosan Yeni Batarya Hattı Kapasite & Başa Baş Analizi", en: "Case Exam: Ford Otosan Battery Line Capacity & Break-Even Evaluation" },
      businessQuestion: {
        tr: "Ford Otosan Kocaeli fabrikasında yeni elektrikli ticari araçlar için batarya paketi montaj hattı planlanmaktadır. Hattın tasarım kapasitesi saatte 20 batarya paketidir. Haftada 6 gün, günde 2 vardiya (toplam 16 saat/gün) çalışılacaktır. Bakım ve hücre testleri nedeniyle efektif kapasite saatte 16 paket olarak hedeflenmiştir. Ayda (4 hafta = 24 iş günü) fiilen 5.760 adet batarya üretilmiştir. 1) Hattın Kapasite Kullanım Oranını ve Verimliliğini hesaplayınız. 2) Bataryanın birim satış fiyatı 8.000 $, birim değişken maliyeti 5.000 $ ve aylık sabit genel giderler 6.000.000 $ olduğuna göre aylık başa baş noktasını ($Q_{\\text{BEP}}$) bulunuz.",
        en: "Ford Otosan plans battery line with design capacity 20 packs/hr and effective capacity 16 packs/hr. Operating 24 days/mo (16 hrs/day = 384 hrs/mo), actual monthly output is 5,760 packs. Calculate Utilization, Efficiency, and monthly Break-Even Point (P=$8k, VC=$5k, FC=$6M)."
      },
      dataset: {
        columns: ["Metrik", "Formül", "Hesaplanan_Değer", "Birim"],
        rows: [
          ["Aylık Tasarım Kapasitesi", "384 saat * 20", 7680, "adet/ay"],
          ["Aylık Efektif Kapasite", "384 saat * 16", 6144, "adet/ay"],
          ["Gerçek Çıktı", "Fiili Üretim", 5760, "adet/ay"],
          ["Kullanım Oranı (Utilization)", "5760 / 7680", 0.75, "%75"],
          ["Kapasite Verimliliği (Efficiency)", "5760 / 6144", 0.9375, "%93.75"],
          ["Birim Katkı Payı", "8000 - 5000", 3000, "$/adet"],
          ["Başa Baş Noktası (BEP)", "6.000.000 / 3000", 2000, "adet/ay"]
        ]
      },
      guidedSteps: [
        { tr: "1. Adım: Toplam çalışma saatini bul: $24 \\times 16 = 384$ saat.", en: "Step 1: Calculate monthly hours: $24 \\times 16 = 384$ hrs." },
        { tr: "2. Adım: Tasarım ($384 \\times 20 = 7.680$) ve Efektif ($384 \\times 16 = 6.144$) kapasiteleri hesapla.", en: "Step 2: Compute Design (7,680) and Effective (6,144) capacities." },
        { tr: "3. Adım: Kullanım oranı = $5.760 / 7.680 = %75$.", en: "Step 3: Utilization = 5,760 / 7,680 = 75%." },
        { tr: "4. Adım: Başa baş noktası = $\\frac{6.000.000}{8.000 - 5.000} = 2.000$ adet.", en: "Step 4: Break-even Q = $6M / $3,000 = 2,000 units." }
      ],
      expectedApproach: {
        tr: "Kapasite metriklerini zaman bazında hesaplayıp başa baş formülüyle üretim kârlılık eşiğini belirleme.",
        en: "Evaluating operational capacity ratios and break-even profitability thresholds."
      },
      solutionQuestions: [{
        id: "m20-c1-q1", type: "numeric",
        prompt: { tr: "Ford Otosan batarya hattının aylık başa baş üretim miktarı ($Q_{\\text{BEP}}$) kaç adettir?", en: "What is the monthly break-even battery pack quantity (Q_BEP)?" },
        correctAnswer: 2000,
        explanation: { tr: "$$Q_{\\text{BEP}} = \\frac{6.000.000}{8.000 - 5.000} = \\frac{6.000.000}{3.000} = 2.000 \\text{ adet}$$", en: "$$Q_{\\text{BEP}} = 6,000,000 / 3,000 = 2,000$$" }
      }]
    }
  ]
};

saveModule(module19);
saveModule(module20);
console.log('Indr100 modules 19 & 20 created.');
