import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Lock, Building2 } from 'lucide-react';

interface LegalTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'kvkk' | 'terms' | 'privacy';
}

export const LegalTermsModal: React.FC<LegalTermsModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'kvkk',
}) => {
  const [activeTab, setActiveTab] = useState<'kvkk' | 'terms' | 'privacy'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl animate-modal-enter shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#ff7a00]/10 flex items-center justify-center text-[#ff7a00]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Yasal Bilgilendirme & Sözleşmeler
              </h2>
              <p className="text-xs text-slate-500 font-medium">TancoreLab İstatistik Simülasyon Platformu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-5 sm:px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('kvkk')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'kvkk'
                ? 'border-[#ff7a00] text-[#ff7a00]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>KVKK Aydınlatma Metni</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'terms'
                ? 'border-[#ff7a00] text-[#ff7a00]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Kullanım Koşulları</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'privacy'
                ? 'border-[#ff7a00] text-[#ff7a00]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Gizlilik Politikası</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {activeTab === 'kvkk' && (
            <div className="space-y-3.5 animate-fade-in">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                6698 Sayılı Kişisel Verilerin Korunması Kanunu (KVKK) Aydınlatma Metni
              </h3>
              <p>
                <strong>TancoreLab</strong> olarak, platformumuza üye olan ve eğitim içeriklerinden yararlanan kullanıcılarımızın kişisel verilerinin korunmasına ve güvenliğine en üst düzeyde önem vermekteyiz.
              </p>

              <h4 className="font-bold text-slate-900">1. Veri Sorumlusu</h4>
              <p>
                Kişisel verileriniz, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca veri sorumlusu sıfatıyla TancoreLab platform yönetimi tarafından işlenmektedir.
              </p>

              <h4 className="font-bold text-slate-900">2. İşlenen Kişisel Veriler</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Kimlik Bilgileri:</strong> Ad, Soyad.</li>
                <li><strong>İletişim Bilgileri:</strong> Üniversite/öğrenci kurumsal e-posta adresi.</li>
                <li><strong>Eğitim Bilgileri:</strong> Üniversite adı, kayıtlı olunan fakülte, bölüm ve sınıf seviyesi.</li>
                <li><strong>İşlem ve Performans Bilgileri:</strong> Tamamlanan dersler, çözülen vaka sınavları, kazanılan deneyim puanları (XP), günlük seri (streak) ve liderlik sıralaması verileri.</li>
                <li><strong>Yapay Zeka Etkileşim Verileri:</strong> Tanco AI asistanına gönderilen soru ve mesaj içerikleri.</li>
              </ul>

              <h4 className="font-bold text-slate-900">3. Kişisel Verilerin İşlenme Amaçları ve Hukuki Sebepleri</h4>
              <p>
                Kişisel verileriniz, KVKK'nın 5. maddesinde belirtilen "Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması" ve "Veri sorumlusunun meşru menfaatleri" hukuki sebeplerine dayalı olarak şu amaçlarla işlenmektedir:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Platforma kayıt işlemlerinin gerçekleştirilmesi ve kimlik doğrulamasının yapılması,</li>
                <li>Öğrenciye özel ilerleme, konu tamamlama ve başarı karnesi üretilmesi,</li>
                <li>Öğrenci liderlik tablosunun (sıralama) şeffaf bir şekilde işletilmesi,</li>
                <li>Hesap güvenliğinin sağlanması ve yetkisiz erişimlerin önlenmesi.</li>
              </ul>

              <h4 className="font-bold text-slate-900">4. Yurt Dışına Veri Aktarımı – Yapay Zeka (AI) Servisleri</h4>
              <p>
                Tanco AI asistanına ilettiğiniz mesaj ve soru içerikleri, yapay zeka yanıtı üretmek amacıyla <strong>Google Gemini API</strong> (Amerika Birleşik Devletleri) üzerinden işlenmektedir. Bu aktarım, KVKK'nın 9. maddesi kapsamında kullanıcının açık rızasına ve platform hizmetinin ifasına dayalı olarak gerçekleştirilmektedir. Verileriniz Google'ın gizlilik politikası çerçevesinde korunmakta olup üçüncü taraflarla paylaşılmamaktadır.
              </p>

              <h4 className="font-bold text-slate-900">5. İlgili Kişi Olarak Haklarınız (KVKK Madde 11)</h4>
              <p>
                KVKK'nın 11. maddesi uyarınca dilediğiniz zaman platform yöneticilerimize başvurarak; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, düzeltilmesini veya silinmesini isteme hakkına sahipsiniz. Talepleriniz ivedilikle sonuçlandırılacaktır.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3.5 animate-fade-in">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                TancoreLab Kullanıcı Hizmet Sözleşmesi
              </h3>
              <p>
                TancoreLab platformuna kayıt olan her kullanıcı bu Kullanım Koşullarını kabul etmiş sayılır.
              </p>

              <h4 className="font-bold text-slate-900">1. Hizmetin Kapsamı</h4>
              <p>
                TancoreLab; olasılık, veri bilimi ve istatistik konularını gerçek şirket vakaları, formül simülasyonları ve interaktif hesaplama araçlarıyla öğreten bir eğitim teknolojisi platformudur.
              </p>

              <h4 className="font-bold text-slate-900">2. Kullanıcı Sorumlulukları</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Kullanıcı, kayıt sırasında doğru ve güncel üniversite öğrenci bilgilerini beyan etmekle yükümlüdür.</li>
                <li>Hesap şifresinin güvenliği tamamen kullanıcının sorumluluğundadır.</li>
                <li>Platform üzerinde hileli sınav çözümü, bot kullanımı veya sistem güvenliğini tehdit edici faaliyetler hesap iptali sebebidir.</li>
              </ul>

              <h4 className="font-bold text-slate-900">3. Fikri ve Sınai Mülkiyet Hakları</h4>
              <p>
                TancoreLab arayüz tasarımı, özgün iş vaka senaryoları, hesaplama algoritmaları ve görsel materyallerin tüm telif hakları TancoreLab'e aittir. Yazılı izin olmaksızın kısmen veya tamamen kopyalanamaz veya çoğaltılamaz.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3.5 animate-fade-in">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Gizlilik ve Veri Güvenliği Politikası
              </h3>
              <p>
                TancoreLab kullanıcılarının gizliliğine saygı duyar ve verilerini en güçlü şifreleme standartlarıyla korur.
              </p>

              <h4 className="font-bold text-slate-900">1. Şifre Güvenliği (Kriptografik Hash)</h4>
              <p>
                Hesap şifreniz hiçbir zaman düz metin olarak veritabanında tutulmaz. Şifreleriniz, endüstri standardı <strong>bcrypt</strong> algoritması ile tek yönlü hash'lenerek saklanır. TancoreLab geliştiricileri veya yöneticileri dahil hiç kimse şifrenizi açık metin olarak göremez veya okuyamaz.
              </p>

              <h4 className="font-bold text-slate-900">2. Üçüncü Taraflarla Paylaşım</h4>
              <p>
                Kişisel verileriniz ve iletişim bilgileriniz hiçbir surette üçüncü parti reklam ajanslarına, pazarlama şirketlerine veya veri tüccarlarına satılmaz, kiralanmaz veya ticari amaçla devredilmez.
              </p>

              <h4 className="font-bold text-slate-900">3. Çerezler ve Oturum Bilgileri</h4>
              <p>
                Platformumuzda yalnızca oturumunuzun açık kalmasını sağlayan güvenli kimlik doğrulama belirteçleri (JWT / Secure Session Cookies) kullanılmaktadır. Üçüncü taraf takip çerezi barındırılmaz.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#ff7a00] hover:bg-[#ff6f00] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#ff7a00]/20 transition-all cursor-pointer"
          >
            Okudum, Anladım
          </button>
        </div>
      </div>
    </div>
  );
};


