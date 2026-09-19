const fs = require('fs');

console.log('Validating and enriching all 16 module explanations with Koç University INDR 252 and ENGR 200 pedagogical guidelines...');

// Module 1 (INDR 252 Lecture 1: Descriptive Statistics)
const m1 = JSON.parse(fs.readFileSync('src/data/module1.json', 'utf8'));
m1.lessons.forEach(l => {
  if (l.id === 'm1-l1') {
    l.conceptCard.tr = "İstatistikte veriler temel olarak ikiye ayrılır:\n\n1. **Kategorik (Nitel) Veri:** Sayısal olmayan, gruplama bildiren verilerdir (Örn: Müşteri segmenti, Cinsiyet, Hata türü). Frekans ve yüzde ile özetlenir.\n2. **Sayısal (Nicel) Veri:** Ölçüm veya sayım sonucu elde edilen sayılardır.\n   - **Kesikli (Discrete):** Sayılabilir değerler (Örn: Bir saatte gelen çağrı sayısı $X \\in \\{0, 1, 2, \\dots\\}$).\n   - **Sürekli (Continuous):** Bir aralıktaki tüm reel değerleri alabilen ölçümler (Örn: İşlem süresi, sıcaklık, voltaj).\n\n> **Kritik Kural:** Sayısal verilerin dağılım şekli (simetrik mi çarpık mı), kullanılacak merkezi eğilim ölçüsünü belirler.";
  } else if (l.id === 'm1-l2') {
    l.conceptCard.tr = "Aritmetik Ortalama ($\bar{X}$), veri setindeki tüm gözlemlerin toplamının gözlem sayısına ($n$) bölünmesidir:\n\n$$\\bar{X} = \\frac{1}{n} \\sum_{i=1}^n X_i = \\frac{X_1 + X_2 + \\dots + X_n}{n}$$\n\n**Özellikleri ve Sınav İpuçları (`INDR 252 Lecture 1`):**\n- **Aykırı Değerlere Karşı Hassastır:** Veri setinde aşırı büyük veya küçük bir uç değer (outlier) varsa ortalama o yöne doğru kayar.\n- Veri dağılımı sağa çarpık (right-skewed) ise $\\bar{X} > \\text{Medyan}$; sola çarpık (left-skewed) ise $\\bar{X} < \\text{Medyan}$ olur.";
  } else if (l.id === 'm1-l3') {
    l.conceptCard.tr = "Medyan (Ortanca / $\\tilde{X}$), küçükten büyüğe sıralanmış bir veri setini tam ortadan iki eşit parçaya bölen (%50 noktası) değerdir:\n\n$$\\text{Sıra} = \\frac{n + 1}{2}$$\n\n- $n$ tek ise: Tam ortadaki tekil gözlemdir.\n- $n$ çift ise: Ortadaki iki gözlemin aritmetik ortalamasıdır.\n\n**Kritik Avantajı (`INDR 252`):** Medyan, aykırı değerlerden (outliers) etkilenmez (**Dirençli / Robust** istatistiktir). Çarpık dağılımlı gelir ve süre verilerinde ortalama yerine medyan tercih edilir.";
  } else if (l.id === 'm1-l5') {
    l.conceptCard.tr = "Veri setini dört eşit çeyreğe (%25, %50, %75) bölen değerlere Çeyreklikler denir:\n\n- **$Q_1$ (Birinci Çeyrek):** Verilerin %25'inin altında kaldığı değer.\n- **$Q_2$ (İkinci Çeyrek / Medyan):** Verilerin %50 noktası.\n- **$Q_3$ (Üçüncü Çeyrek):** Verilerin %75'inin altında kaldığı değer.\n- **Ranj (Açıklık / Range):** $\\text{Ranj} = X_{\\max} - X_{\\min}$\n\n**Çeyrekler Açıklığı ($IQR$):**\n$$IQR = Q_3 - Q_1$$\n$IQR$, verinin ortadaki %50'lik diliminin yayılımını ölçer ve uç değerlere karşı dirençlidir.";
  } else if (l.id === 'm1-l6') {
    l.conceptCard.tr = "Örneklem Varyansı ($s^2$), gözlemlerin örneklem ortalaması etrafındaki karesel sapmalarının ortalamasıdır:\n\n$$s^2 = \\frac{\\sum_{i=1}^n (X_i - \\bar{X})^2}{n - 1} = \\frac{S_{xx}}{n - 1}$$\n\n**Serbestlik Derecesi ($n-1$) Düzeltmesi (`INDR 252`):**\nPaydada $n$ yerine $n-1$ kullanılmasının sebebi, $\\bar{X}$'ın anakütle ortalaması $\\mu$ yerine kullanılması sonucu oluşan sapmayı sıfırlamak ve $s^2$'yi $\\sigma^2$ için **Sapmasız (Unbiased)** bir tahmin edici yapmaktır ($\\mathbb{E}[s^2] = \\sigma^2$).";
  } else if (l.id === 'm1-l8') {
    l.conceptCard.tr = "Tukey Kutu Grafiği (Boxplot) Kuralı (`INDR 252 Lecture 1`):\n\nBir gözlem $X$, aşağıdaki aralığın dışındaysa **Aykırı Değer (Outlier)** olarak sınıflandırılır:\n\n$$\\text{Alt Sınır} = Q_1 - 1.5 \\times IQR$$\n$$\\text{Üst Sınır} = Q_3 + 1.5 \\times IQR$$\n\n- **Aşırı Aykırı Değer (Extreme Outlier):** $3 \\times IQR$ mesafesinin ötesindeki noktalar.\n- Boxplot üzerindeki bıyıklar (whiskers), bu sınırlar içindeki en küçük ve en büyük gerçek veri noktalarına kadar uzanır.";
  } else if (l.id === 'm1-l9') {
    l.conceptCard.tr = "Normallik Olasılık Grafiği (Normal Q-Q Plot), örneklem verilerinin teorik standart normal dağılım ($Z$) yüzdelikleri ile karşılaştırıldığı görsel tanı aracıdır (`INDR 252 Lecture 1`):\n\n- **Normallik:** Noktalar 45 derecelik düz bir doğru üzerinde diziliyorsa veriler Normal Dağılıma uygundur.\n- **Sağa Çarpıklık (Right-skewed):** Noktalar yukarıya doğru içbükey (concave) bir eğri çizer.\n- **Ağır Kuyruklar (Heavy tails):** Uç noktalarda S şeklinde sistematik sapmalar görülür.";
  }
});
fs.writeFileSync('src/data/module1.json', JSON.stringify(m1, null, 2), 'utf8');
console.log('Module 1 enriched with Koç Lecture 1 standards.');

