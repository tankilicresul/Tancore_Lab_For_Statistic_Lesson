const fs = require('fs');

console.log('Fixing currency dollar signs and escaping in JSON files...');

// Fix Module 1
const m1 = JSON.parse(fs.readFileSync('src/data/module1.json', 'utf8'));
m1.lessons.forEach(l => {
  if (l.id === 'm1-l5') {
    l.companyExample.tr = "Perakende zincirinde müşteri sepet tutarları incelendiğinde; ilk çeyrek $Q_1 = 40$ TL, medyan $Q_2 = 70$ TL ve üçüncü çeyrek $Q_3 = 120$ TL bulunmuştur. Çeyrekler açıklığı $IQR = Q_3 - Q_1 = 120 - 40 = 80$ TL olarak hesaplanır. Müşterilerin orta %50'lik dilimi 40 TL ile 120 TL arasında harcama yapmaktadır.";
    l.companyExample.en = "In a retail chain basket study, the first quartile is $Q_1 = 40$ USD, median $Q_2 = 70$ USD, and third quartile $Q_3 = 120$ USD. The interquartile range is $IQR = Q_3 - Q_1 = 120 - 40 = 80$ USD. The middle 50% of customers spend between 40 USD and 120 USD.";
  } else if (l.id === 'm1-l7') {
    l.companyExample.tr = "Fintech ödeme altyapısında Sunucu A: $\\bar{x} = 100$ ms, $s = 10$ ms ($CV = 10\\%$); Sunucu B: $\\bar{x} = 200$ ms, $s = 50$ ms ($CV = 25\\%$). B sunucusunun bağıl değişkenliği çok daha yüksektir ve risklidir.";
    l.companyExample.en = "In fintech latency analytics, Server A: $\\bar{x} = 100$ ms, $s = 10$ ms ($CV = 10\\%$); Server B: $\\bar{x} = 200$ ms, $s = 50$ ms ($CV = 25\\%$). Server B has much higher relative variability.";
  } else if (l.id === 'm1-l8') {
    l.companyExample.tr = "Sipariş verilerinde $Q_1 = 40$ TL, $Q_3 = 120$ TL ve $IQR = 80$ TL olsun. Üst sınır: $UF = Q_3 + 1.5 \\times IQR = 120 + 1.5(80) = 240$ TL'dir. 300 TL'lik bir sipariş $300 > 240$ olduğu için sisteme potansiyel dolandırıcılık veya kurumsal sipariş (aykırı değer / outlier) olarak işaretlenir.";
    l.companyExample.en = "In transaction data, with $Q_1 = 40$ USD, $Q_3 = 120$ USD, and $IQR = 80$ USD, Upper Fence is $UF = Q_3 + 1.5 \\times IQR = 120 + 1.5(80) = 240$ USD. A 300 USD order is flagged as an outlier since $300 > 240$.";
  } else if (l.id === 'm1-l9') {
    l.companyExample.en = "Payment processing durations are plotted on a Normal Q-Q plot. The points fall on a straight 45-degree line, confirming normality and validating parametric Z-score limits.";
  }
});
fs.writeFileSync('src/data/module1.json', JSON.stringify(m1, null, 2), 'utf8');

// Fix Module 7
const m7 = JSON.parse(fs.readFileSync('src/data/module7.json', 'utf8'));
m7.lessons.forEach(l => {
  if (l.id === 'm7-l6') {
    l.companyExample.en = "AdTechX regression model: $\\hat{y} = 50 + 4.2x$, where $x$ is daily ad spend (in thousands USD) and $y$ is sales revenue. For $x = 10$ (10,000 USD ad spend), predicted revenue is $\\hat{y} = 50 + 4.2(10) = 92$ (92,000 USD). Each additional 1,000 USD spent yields an expected 4,200 USD revenue increase.";
  }
});
fs.writeFileSync('src/data/module7.json', JSON.stringify(m7, null, 2), 'utf8');

// Fix Module 8
const m8 = JSON.parse(fs.readFileSync('src/data/module8.json', 'utf8'));
m8.lessons.forEach(l => {
  if (l.id === 'm8-l1') {
    l.companyExample.en = "EstateVal property pricing model: $\\hat{y} = 100 + 15(x_1) + 50(x_2) - 20(x_3)$ (in thousands USD), where $x_1$ is area (sqm), $x_2$ is rooms, and $x_3$ is building age (years). Holding area and age constant, an extra room adds an expected 50,000 USD to property value.";
  }
});
fs.writeFileSync('src/data/module8.json', JSON.stringify(m8, null, 2), 'utf8');

console.log('Fixed currency strings in modules 1, 7, 8.');
