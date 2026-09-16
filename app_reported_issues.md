# TanCoreLab - Uygulama Sorunları ve Kullanıcı Geri Bildirimleri 🛠️

Bu dosya, kullanıcıların Tanco AI ile sohbet ederken ilettikleri teknik aksaklıkları, formül/soru hatalarını, arayüz problemlerini ve önerilerini otomatik olarak kayıt altına alır.

> **Geliştirici Notu:** Her yeni oturumda bu dosyayı kontrol edip "Açık (Open)" durumdaki sorunları çözebilir ve durumlarını "Çözüldü (Resolved)" olarak güncelleyebilirsiniz.

---

## 📋 Bildirilen Sorunlar Listesi

| No | Tarih & Saat | Kullanıcı | Bulunduğu Ekran / Ders | Bildirilen Problem Özeti | Öncelik | Durum |
|:---|:---|:---|:---|:---|:---|:---|
| *Örnek* | *2026-09-16 23:30* | *sistem_test* | *Sistem Başlatma* | *Otomatik hata tespit mekanizması devrede.* | *Düşük* | *Çözüldü* |
| 2 | 2026-09-16 23:55 | rtankilic22@ku.edu.tr | Seviye Tespit Sınavı | Seviye tespit sınavı soruları istatistik yerine olasılık müfredatına uyarlandı. | Yüksek | Çözüldü |
| 3 | 2026-09-17 00:02 | rtankilic22@ku.edu.tr | Seviye Tespit Sınavı | Her iki ders modülünün seviye tespit sınavının ayrılması (Olasılık için Olasılık, İstatistik için İstatistik soruları). | Kritik | Çözüldü |

---

## 🔍 Detaylı Sorun Logları & Çözüm Geçmişi

### [TEST-001] Sistem Hata Takip Motoru Entegrasyonu
- **Tarih:** 2026-09-16 23:30
- **Kullanıcı:** TanCoreLab Telemetri
- **Ekran:** Tanco AI Sohbet Motoru
- **Açıklama:** Kullanıcılar sohbet içerisinde problem bildirdiğinde Tanco AI ve backend otomatik olarak tespit edip bu dosyaya ve Supabase veritabanına log düşer.
- **Durum:** ✅ Çözüldü (Aktif)

### [ISSUE-002] Seviye Tespit Sınavı Olasılık Müfredatı Güncellemesi
- **Tarih:** 2026-09-16 23:55
- **Kullanıcı:** rtankilic22@ku.edu.tr
- **Ekran:** Seviye Tespit Sınavı (`PlacementTestPage.tsx`)
- **Açıklama:** Sınav içerisindeki istatistik (regresyon, anova vb.) soruları tamamen Kombinatorik, Olasılık Aksiyomları, Bayes Teoremi, Binom/Poisson/Üstel Dağılımlar, Beklenen Değer/Varyans, PDF normalizasyonu ve Markov Zincirleri konularına uyarlandı.
- **Durum:** ✅ Çözüldü (Canlıda)

### [ISSUE-003] Seviye Tespit Sınavlarının Ders Bazında Ayrılması
- **Tarih:** 2026-09-17 00:02
- **Kullanıcı:** rtankilic22@ku.edu.tr
- **Ekran:** Seviye Tespit Sınavı (`PlacementTestPage.tsx` & `placementQuestions.ts`)
- **Açıklama:** Olasılık ve İstatistik dersleri için 10'ar soruluk iki ayrı teşhis havuzu oluşturuldu (`PROBABILITY_PLACEMENT_QUESTIONS` ve `STATISTICS_PLACEMENT_QUESTIONS`). Hangi dersten sınava başlanırsa o derse ait özel soru seti ve modül yerleştirme algoritması otomatik çalışacak şekilde yapılandırıldı.
- **Durum:** ✅ Çözüldü (Canlıda)
