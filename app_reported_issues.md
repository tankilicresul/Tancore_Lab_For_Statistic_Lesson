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
| 4 | 2026-09-17 08:51 | rtankilic22@ku.edu.tr | Tanco AI Sohbet | Bot Döngü Hatası: Tanco'nun durduk yere 'Nasıl yardımcı olabilirim?' diyerek tekrara düşmesi. | Yüksek | Çözüldü |
| 5 | 2026-09-17 08:51 | rtankilic22@ku.edu.tr | Ana Sayfa / Navbar | Bildirim Hatası: Sohbet okunmasına rağmen kırmızı 'okunmamış mesaj' rozetinin kaybolmaması. | Orta | Çözüldü |
| 6 | 2026-09-17 08:51 | rtankilic22@ku.edu.tr | Profil Sayfası / Modal | Profil Fotoğrafı Sorunu: Sayfa yenilendiğinde seçilen profil fotoğrafının kaybolup emojiye dönmesi. | Yüksek | Çözüldü |
| 7 | 2026-09-17 08:51 | rtankilic22@ku.edu.tr | Profil Sayfası / Modal | Panel Çakışması: Liderlik tablosu açıkken 'Düzenle' butonuna basıldığında iki panelin üst üste binmesi. | Orta | Çözüldü |

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

### [ISSUE-004] Bot Döngü Hatası & Kota Çökmesi Giderimi
- **Tarih:** 2026-09-17 08:51
- **Kullanıcı:** rtankilic22@ku.edu.tr
- **Ekran:** Tanco AI Sohbet (`tancoAi.ts` & `api/tanco-chat.ts`)
- **Açıklama:** Tanco'nun API kota aşımı (429) yaşadığı durumlarda genel döngü kalıbına düşmesi engellendi. `gemini-flash-latest` ve `gemini-3.5-flash` gibi yüksek kotalı modellere geçildi, 60 mesajlık derin sohbet belleği ve dahili sabit ders bilgi motoru eklendi.
- **Durum:** ✅ Çözüldü (Canlıda)

### [ISSUE-005] Okunmamış Mesaj Kırmızı Rozet Bildirim Hatası
- **Tarih:** 2026-09-17 08:51
- **Kullanıcı:** rtankilic22@ku.edu.tr
- **Ekran:** Floating Tanco Butonu & Sohbet Modalı (`FloatingTancoButton.tsx` & `TancoChatModal.tsx`)
- **Açıklama:** Sohbet açıkken mesaj geldiğinde `tancore_last_read_tanco_chat_v1` timestamp'i güncellenmiyordu; bu sebeple sohbet kapatıldığında son mesaj okunmamış gibi kırmızı nokta çıkıyordu. Hem mesaj geldikçe hem de modal kapatıldığında anlık okundu kaydı tetiklenecek şekilde düzeltildi.
- **Durum:** ✅ Çözüldü (Canlıda)

### [ISSUE-006] Profil Fotoğrafının Kaybolup Emojiye Dönüşmesi
- **Tarih:** 2026-09-17 08:51
- **Kullanıcı:** rtankilic22@ku.edu.tr
- **Ekran:** Profil Yönetimi (`useAppStore.ts` & `UserAvatar.tsx`)
- **Açıklama:** Sayfa yenilendiğinde Supabase'den `avatar_url` çekilmesine rağmen store state'ine set edilmiyordu. Rehydrate storage aşamasında Supabase'deki `avatar_url`'in `userProfile.avatarUrl` alanına otomatik yazılması sağlandı.
- **Durum:** ✅ Çözüldü (Canlıda)

### [ISSUE-007] Liderlik Tablosu & Profil Düzenleme Panel Çakışması
- **Tarih:** 2026-09-17 08:51
- **Kullanıcı:** rtankilic22@ku.edu.tr
- **Ekran:** Profil Sayfası ve Modalı (`ProfilePage.tsx` & `ProfileModal.tsx`)
- **Açıklama:** Liderlik sıralaması açıkken "Düzenle" butonuna tıklandığında iki görünüm birden ekranda kalıyordu. Düzenleme açıldığında liderlik paneli, liderlik paneli açıldığında ise düzenleme formu otomatik kapanacak şekilde karşılıklı dışlayıcı (mutually exclusive) hale getirildi.
- **Durum:** ✅ Çözüldü (Canlıda)
