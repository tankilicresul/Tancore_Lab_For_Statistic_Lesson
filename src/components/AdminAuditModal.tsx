import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  fetchAdminAuditProfilesFromSupabase,
  adminResetUserXpInSupabase,
  adminDeleteUserProfileInSupabase,
} from '../lib/supabase';
import { useAppStore } from '../store/useAppStore';
import { UserAvatar } from './UserAvatar';
import { soundService } from '../services/soundService';
import {
  ShieldAlert,
  Smartphone,
  Users,
  Search,
  RefreshCw,
  X,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  RotateCcw,
  Sparkles,
  Layers,
  Crown,
  Lock,
  Loader2,
} from 'lucide-react';

interface AdminAuditModalProps {
  onClose: () => void;
}

export interface AdminUserRecord {
  id: string;
  email: string;
  full_name: string;
  university?: string;
  department_and_class?: string;
  avatar_emoji?: string;
  avatar_url?: string;
  xp: number;
  streak: number;
  completed_lessons: number;
  is_premium?: boolean;
  device_id?: string;
  device_info?: string;
  created_at?: string;
  updated_at?: string;
}

export const AdminAuditModal: React.FC<AdminAuditModalProps> = ({ onClose }) => {
  const { userAccounts, language } = useAppStore();
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'devices' | 'all'>('devices');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const remoteData = await fetchAdminAuditProfilesFromSupabase();
      
      // Combine with local accounts for comprehensive visibility
      const combinedMap = new Map<string, AdminUserRecord>();

      // 1. Add remote data first
      remoteData.forEach((r: any) => {
        const email = (r.email || '').trim().toLowerCase();
        if (email) {
          combinedMap.set(email, {
            id: r.id,
            email,
            full_name: r.full_name || email.split('@')[0],
            university: r.university || '',
            department_and_class: r.department_and_class || '',
            avatar_emoji: r.avatar_emoji || '👨‍🎓',
            avatar_url: r.avatar_url,
            xp: typeof r.xp === 'number' ? r.xp : 0,
            streak: typeof r.streak === 'number' ? r.streak : 1,
            completed_lessons: typeof r.completed_lessons === 'number' ? r.completed_lessons : 0,
            is_premium: Boolean(r.is_premium),
            device_id: r.device_id || 'dev_legacy',
            device_info: r.device_info || 'Bilinmeyen Cihaz',
            created_at: r.created_at,
            updated_at: r.updated_at,
          });
        }
      });

      // 2. Add local store accounts if not already present
      (userAccounts || []).forEach((acc) => {
        const email = (acc.schoolEmail || '').trim().toLowerCase();
        if (email && !combinedMap.has(email)) {
          combinedMap.set(email, {
            id: `usr_${email}`,
            email,
            full_name: acc.fullName || email.split('@')[0],
            university: acc.university || '',
            department_and_class: acc.departmentAndClass || '',
            avatar_emoji: acc.avatarEmoji || '👨‍🎓',
            avatar_url: acc.avatarUrl,
            xp: acc.xp || 0,
            streak: acc.streak || 1,
            completed_lessons: (acc.completedLessons?.length || 0) + (acc.completedCaseExams?.length || 0),
            is_premium: false,
            device_id: 'dev_local_device',
            device_info: 'Bu Cihaz (Yerel Kayıt)',
          });
        }
      });

      setUsers(Array.from(combinedMap.values()));
    } catch (err) {
      console.warn('Admin load data error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Group users by device_id
  const deviceGroups = React.useMemo(() => {
    const groups: { [deviceId: string]: { deviceId: string; deviceInfo: string; users: AdminUserRecord[] } } = {};
    
    users.forEach((u) => {
      const devId = u.device_id || 'dev_legacy_unknown';
      if (!groups[devId]) {
        groups[devId] = {
          deviceId: devId,
          deviceInfo: u.device_info || 'Bilinmeyen Cihaz / Web',
          users: [],
        };
      }
      groups[devId].users.push(u);
    });

    // Sort groups so that devices with MULTIPLE accounts appear at the very top!
    return Object.values(groups).sort((a, b) => b.users.length - a.users.length);
  }, [users]);

  // Statistics
  const totalUsers = users.length;
  const totalDevices = deviceGroups.length;
  const multiAccountDevices = deviceGroups.filter((g) => g.users.length > 1);
  const totalMultiAccounts = multiAccountDevices.reduce((acc, g) => acc + g.users.length, 0);

  // Filtered users for "All Users" tab
  const filteredUsers = React.useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase().trim();
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        u.full_name.toLowerCase().includes(q) ||
        (u.university && u.university.toLowerCase().includes(q)) ||
        (u.device_id && u.device_id.toLowerCase().includes(q))
    );
  }, [users, searchQuery]);

  const handleResetXp = async (email: string) => {
    if (!window.confirm(`${email} hesabının XP'sini sıfırlamak istediğinize emin misiniz?`)) return;
    setActionLoading(`xp-${email}`);
    setStatusMessage(null);
    try {
      await adminResetUserXpInSupabase(email);
      soundService.playCorrect();
      setStatusMessage({ type: 'success', text: `${email} hesabının XP'si 0 yapıldı.` });
      await loadData();
    } catch (e: any) {
      soundService.playWrong();
      setStatusMessage({ type: 'error', text: 'İşlem başarısız oldu.' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (email: string) => {
    if (!window.confirm(`⚠️ DİKKAT: ${email} hesabı tamamen silinecektir. Bu işlem geri alınamaz!`)) return;
    setActionLoading(`del-${email}`);
    setStatusMessage(null);
    try {
      await adminDeleteUserProfileInSupabase(email);
      soundService.playCorrect();
      setStatusMessage({ type: 'success', text: `${email} hesabı sistemden silindi.` });
      await loadData();
    } catch (e: any) {
      soundService.playWrong();
      setStatusMessage({ type: 'error', text: 'Hesap silinemedi.' });
    } finally {
      setActionLoading(null);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-md animate-fade-in font-sans">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-scale-up"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-400/20">
              <Crown className="w-5 h-5 fill-slate-950 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">Yönetici & Cihaz Denetim Paneli</h3>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                  Admin
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 font-medium">
                Cihaz bazlı çoklu hesap tespiti, sahte profil ve XP denetimi
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadData}
              disabled={isLoading}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Yenile"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-600 text-white transition-colors cursor-pointer"
              title="Kapat"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-50 border-b border-slate-200 shrink-0 text-left">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center space-x-2 text-slate-500 text-[11px] font-bold">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span>Kayıtlı Öğrenci</span>
            </div>
            <div className="text-lg sm:text-2xl font-black text-slate-900 mt-0.5">{totalUsers}</div>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center space-x-2 text-slate-500 text-[11px] font-bold">
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Benzersiz Cihaz</span>
            </div>
            <div className="text-lg sm:text-2xl font-black text-slate-900 mt-0.5">{totalDevices}</div>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-amber-200 shadow-2xs bg-gradient-to-br from-amber-50/50 to-orange-50/30">
            <div className="flex items-center space-x-2 text-amber-800 text-[11px] font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-[#ff7a00]" />
              <span>Çoklu Hesaplı Cihaz</span>
            </div>
            <div className="text-lg sm:text-2xl font-black text-[#ff7a00] mt-0.5">
              {multiAccountDevices.length}{' '}
              <span className="text-[11px] font-bold text-slate-500">({totalMultiAccounts} Hesap)</span>
            </div>
          </div>
        </div>

        {/* Notification Toast */}
        {statusMessage && (
          <div
            className={`px-4 py-2 text-xs font-bold text-center ${
              statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200' : 'bg-rose-50 text-rose-800 border-b border-rose-200'
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-slate-200 shrink-0 gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('devices')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'devices'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Cihaz Bazlı Analiz ({deviceGroups.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Tüm Kullanıcılar ({users.length})</span>
            </button>
          </div>

          {activeTab === 'all' && (
            <div className="relative flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="İsim, mail veya üniversite ara..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#ff7a00]"
              />
            </div>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-left">
          {isLoading ? (
            <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#ff7a00]" />
              <p className="text-xs font-bold">Veriler yükleniyor ve cihazlar taranıyor...</p>
            </div>
          ) : activeTab === 'devices' ? (
            /* 1. DEVICE GROUPING TAB */
            <div className="space-y-4">
              {deviceGroups.map((group, idx) => {
                const isMulti = group.users.length > 1;
                return (
                  <div
                    key={group.deviceId}
                    className={`rounded-2xl border p-4 transition-all ${
                      isMulti
                        ? 'bg-amber-50/40 border-amber-300 shadow-sm'
                        : 'bg-white border-slate-200/90 shadow-2xs'
                    }`}
                  >
                    {/* Device Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200/80 gap-2">
                      <div className="flex items-center space-x-2.5">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isMulti ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <Smartphone className="w-4 h-4 stroke-[2.2]" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs sm:text-sm font-black text-slate-900">
                              {group.deviceInfo}
                            </span>
                            <span className="text-[10px] font-mono bg-slate-200/80 text-slate-700 px-1.5 py-0.5 rounded">
                              {group.deviceId}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium">
                            Cihaz #{idx + 1}
                          </span>
                        </div>
                      </div>

                      {/* Device Multi-account badge */}
                      <div>
                        {isMulti ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-100 border border-rose-200 text-rose-800 text-[11px] font-black">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            <span>⚠️ {group.users.length} Farklı Hesap Açılmış (Aynı Cihaz)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-black">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>1 Hesap (Tekil Cihaz)</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Users on this device */}
                    <div className="pt-3 divide-y divide-slate-100 space-y-2">
                      {group.users.map((user) => (
                        <div
                          key={user.email}
                          className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
                        >
                          {/* User info */}
                          <div className="flex items-center space-x-3 min-w-0">
                            <UserAvatar
                              avatarUrl={user.avatar_url}
                              avatarEmoji={user.avatar_emoji}
                              fullName={user.full_name}
                              size="md"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs sm:text-sm font-black text-slate-900 truncate">
                                  {user.full_name}
                                </span>
                                {user.is_premium && (
                                  <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.2 rounded">
                                    PLUS
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono truncate">{user.email}</div>
                              <div className="text-[10.5px] text-slate-400 font-medium">
                                {user.university || 'Üniversite belirtilmemiş'} • {user.department_and_class || 'Öğrenci'}
                              </div>
                            </div>
                          </div>

                          {/* Stats & Actions */}
                          <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                            <div className="text-right">
                              <div className="text-xs font-black text-[#ff7a00]">{user.xp} XP</div>
                              <div className="text-[10px] text-slate-500 font-bold">{user.streak} Günlük Seri</div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-1.5">
                              <button
                                disabled={Boolean(actionLoading)}
                                onClick={() => handleResetXp(user.email)}
                                className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#ff7a00] border border-orange-200 text-[10px] font-bold transition-all cursor-pointer"
                                title="XP'yi 0 Yap"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>

                              <button
                                disabled={Boolean(actionLoading)}
                                onClick={() => handleDeleteUser(user.email)}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-[10px] font-bold transition-all cursor-pointer"
                                title="Hesabı Tamamen Sil"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* 2. ALL USERS TAB */
            <div className="divide-y divide-slate-100">
              {filteredUsers.map((user, idx) => (
                <div key={user.email} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="text-xs font-black text-slate-400 w-5">{idx + 1}.</span>
                    <UserAvatar
                      avatarUrl={user.avatar_url}
                      avatarEmoji={user.avatar_emoji}
                      fullName={user.full_name}
                      size="md"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs sm:text-sm font-black text-slate-900 truncate">{user.full_name}</span>
                        {user.is_premium && (
                          <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.2 rounded">
                            PLUS
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono truncate">{user.email}</div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        Cihaz ID: <span className="font-mono text-slate-600">{user.device_id || 'dev_legacy'}</span> • {user.university || 'Üniversite belirtilmemiş'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                    <div className="text-right">
                      <div className="text-xs font-black text-[#ff7a00]">{user.xp} XP</div>
                      <div className="text-[10px] text-slate-500 font-bold">{user.streak} Günlük Seri</div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        disabled={Boolean(actionLoading)}
                        onClick={() => handleResetXp(user.email)}
                        className="px-2.5 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#ff7a00] border border-orange-200 text-[10px] font-black transition-all cursor-pointer flex items-center space-x-1"
                        title="XP'yi 0 Yap"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>0 XP Yap</span>
                      </button>

                      <button
                        disabled={Boolean(actionLoading)}
                        onClick={() => handleDeleteUser(user.email)}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-[10px] font-black transition-all cursor-pointer flex items-center space-x-1"
                        title="Hesabı Tamamen Sil"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Sil</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>TanCoreLab Admin Güvenlik & Denetim Altyapısı</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
