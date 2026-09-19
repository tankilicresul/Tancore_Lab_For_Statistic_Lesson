import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ALL_MODULES } from '../data/modules';
import { useAppStore } from '../store/useAppStore';
import { getLocalized, formatStudentGreetingName } from '../utils/localization';
import { TanCoreMascotAvatar } from '../components/TanCoreMascotAvatar';
import {
  Dices,
  BarChart3,
  Trophy,
  Flame,
  Target,
  Award,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Loader2,
  Coins,
  Terminal,
  Binary,
  Activity,
  Workflow,
  Network,
  Factory,
  Calendar,
  Database,
  Compass,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export interface CourseTrack {
  code: string;
  name: { tr: string; en: string };
  desc: { tr: string; en: string };
  status: 'active' | 'in_design';
  track?: 'probability' | 'statistics';
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  badge: { tr: string; en: string };
  badgeStyle: string;
  cardStyle: string;
  glowColor: string;
}

export const COURSES_DATA: CourseTrack[] = [
  {
    code: 'ENGR 200',
    name: {
      tr: 'Mühendisler İçin Olasılık ve Rastgele Değişkenler',
      en: 'Probability and Random Variables for Engineers',
    },
    desc: {
      tr: 'Olasılık temelleri, kümeler, koşullu olasılık, Bayes kuralı, kesikli ve sürekli rassal değişkenler, limit teoremleri ve stokastik süreçler.',
      en: 'Probability, sets, conditional probability, Bayes rule, discrete & continuous random variables, limit theorems & stochastic processes.',
    },
    status: 'active',
    track: 'probability',
    icon: Dices,
    iconBg: 'bg-[#ff7a00] text-white shadow-md shadow-[#ff7a00]/25',
    badge: { tr: '8 Modül', en: '8 Modules' },
    badgeStyle: 'bg-orange-100 text-orange-800 border-orange-200/80',
    cardStyle: 'border-2 border-orange-200 bg-white shadow-xs hover:shadow-md hover:border-[#ff7a00]',
    glowColor: 'bg-[#ff7a00]/15',
  },
  {
    code: 'INDR 252',
    name: {
      tr: 'Uygulamalı İstatistik',
      en: 'Applied Statistics',
    },
    desc: {
      tr: 'Merkezi eğilim, hipotez testleri, tek/iki örneklem testleri, ANOVA, regresyon, kikare testleri ve endüstriyel vaka çalışmaları.',
      en: 'Descriptive stats, hypothesis testing, one/two sample tests, ANOVA, regression, chi-square tests and real-world industrial cases.',
    },
    status: 'active',
    track: 'statistics',
    icon: BarChart3,
    iconBg: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25',
    badge: { tr: '8 Modül', en: '8 Modules' },
    badgeStyle: 'bg-emerald-100 text-emerald-800 border-emerald-200/80',
    cardStyle: 'border-2 border-emerald-200 bg-white shadow-xs hover:shadow-md hover:border-emerald-500',
    glowColor: 'bg-emerald-500/15',
  },
  {
    code: 'INDR 100',
    name: {
      tr: 'Endüstri Mühendisliğine Giriş',
      en: 'Introduction to Industrial Engineering',
    },
    desc: {
      tr: 'Endüstri mühendisliği kavramları, sistem analizi ve modelleme temelleri, üretim ve hizmet sistemleri, bilgisayar ve programlama uygulamaları.',
      en: 'Introduction to industrial engineering concepts, systems analysis & modeling, production & service systems, programming applications.',
    },
    status: 'in_design',
    icon: GraduationCap,
    iconBg: 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20',
    badge: { tr: 'Yakında', en: 'Coming Soon' },
    badgeStyle: 'bg-cyan-100 text-cyan-800 border-cyan-200/80',
    cardStyle: 'border border-slate-200 bg-white shadow-xs hover:shadow-md hover:border-cyan-300',
    glowColor: 'bg-cyan-500/10',
  },
  {
    code: 'INDR 201',
    name: {
      tr: 'Ayrık Matematiksel Yapılar',
      en: 'Discrete Mathematical Structures',
    },
    desc: {
      tr: 'Mantık temelleri, matematiksel tümevarım, küme teorisi, bağıntılar ve fonksiyonlar, sayma prensipleri, çizge teorisi ve ağ algoritmaları.',
      en: 'Fundamentals of logic, mathematical induction, set theory, relations & functions, counting principles, graph theory & network algorithms.',
    },
    status: 'in_design',
    icon: Binary,
    iconBg: 'bg-sky-600 text-white shadow-md shadow-sky-600/20',
    badge: { tr: 'Yakında', en: 'Coming Soon' },
    badgeStyle: 'bg-sky-100 text-sky-800 border-sky-200/80',
    cardStyle: 'border border-slate-200 bg-white shadow-xs hover:shadow-md hover:border-sky-300',
    glowColor: 'bg-sky-500/10',
  },
  {
    code: 'INDR 202',
    name: {
      tr: 'Mühendislik Ekonomisi',
      en: 'Engineering Economics',
    },
    desc: {
      tr: 'Paranın zaman değeri, faiz oranları, bugünkü/gelecekteki değer analizleri, yatırım projelerinin değerlendirilmesi ve amortisman yöntemleri.',
      en: 'Time value of money, interest rates, present & future worth analysis, investment project evaluation, cash flow and depreciation methods.',
    },
    status: 'in_design',
    icon: Coins,
    iconBg: 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20',
    badge: { tr: 'Yakında', en: 'Coming Soon' },
    badgeStyle: 'bg-emerald-100 text-emerald-800 border-emerald-200/80',
    cardStyle: 'border border-slate-200 bg-white shadow-xs hover:shadow-md hover:border-emerald-300',
    glowColor: 'bg-emerald-500/10',
  },
  {
    code: 'INDR 220',
    name: {
      tr: 'Yöneylem Araştırması İçin Programlamaya Giriş',
      en: 'Introduction to Computing For Operations Research',
    },
    desc: {
      tr: 'Bilimsel hesaplama, lineer cebir kütüphaneleri, optimizasyon modelleme, LP/MILP/NLP ticari çözücüleri ve istatistiksel modeller.',
      en: 'Scientific computing, linear algebra libraries, formulation of optimization models, commercial LP/MILP/NLP solvers and statistical models.',
    },
    status: 'in_design',
    icon: Terminal,
    iconBg: 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20',
    badge: { tr: 'Yakında', en: 'Coming Soon' },
    badgeStyle: 'bg-indigo-100 text-indigo-700 border-indigo-200/80',
    cardStyle: 'border border-slate-200 bg-white shadow-xs hover:shadow-md hover:border-indigo-300',
    glowColor: 'bg-indigo-500/10',
  },
  {
    code: 'INDR 262',
    name: {
      tr: 'Optimizasyon Yöntemlerine Giriş',
      en: 'Introduction to Optimization Methods',
    },
    desc: {
      tr: 'Modelleme kavramları, doğrusal programlama problem formülasyonu, simplex yöntemi, dualite, duyarlılık analizi ve bilgisayar uygulamaları.',
      en: 'Modeling concepts, linear programming formulation, simplex method, duality, sensitivity analysis and computer implementations.',
    },
    status: 'in_design',
    icon: Target,
    iconBg: 'bg-violet-600 text-white shadow-md shadow-violet-600/20',
    badge: { tr: 'Yakında', en: 'Coming Soon' },
    badgeStyle: 'bg-violet-100 text-violet-700 border-violet-200/80',
    cardStyle: 'border border-slate-200 bg-white shadow-xs hover:shadow-md hover:border-violet-300',
    glowColor: 'bg-violet-500/10',
  },
  {
    code: 'INDR 343',
    name: {
      tr: 'Stokastik Modeller',
      en: 'Stochastic Models',
    },
    desc: {
      tr: 'Envanter yönetimi, Markov zincirleri ve süreçleri, kuyruk sistemleri, Poisson süreci, Markov karar modelleri ve dinamik programlama.',
      en: 'Inventory management, Markov chains & processes, queueing systems, Poisson process, Markov decision models & dynamic programming.',
    },
    status: 'in_design',
    icon: Activity,
    iconBg: 'bg-amber-600 text-white shadow-md shadow-amber-600/20',
    badge: { tr: 'Yakında', en: 'Coming Soon' },
    badgeStyle: 'bg-amber-100 text-amber-800 border-amber-200/80',
    cardStyle: 'border border-slate-200 bg-white shadow-xs hover:shadow-md hover:border-amber-300',
    glowColor: 'bg-amber-500/10',
  },
  {
    code: 'INDR 344',
    name: {
      tr: 'Modelleme ve Simülasyon',
      en: 'Modeling and Simulation',
    },
    desc: {
      tr: 'Karmaşık stokastik sistem analizi, rassal değişken üretimi, simülasyon dilleri, çıktı analizi, Monte Carlo ve varyans azaltma.',
      en: 'Complex stochastic systems, random variate generation, simulation software, output analysis, Monte Carlo methods & variance reduction.',
    },
    status: 'in_design',
    icon: Workflow,
    iconBg: 'bg-teal-600 text-white shadow-md shadow-teal-600/20',
    badge: { tr: 'Yakında', en: 'Coming Soon' },
    badgeStyle: 'bg-teal-100 text-teal-800 border-teal-200/80',
    cardStyle: 'border border-slate-200 bg-white shadow-xs hover:shadow-md hover:border-teal-300',
    glowColor: 'bg-teal-500/10',
  },
  {
    code: 'INDR 363',
    name: {
      tr: 'Matematiksel Programlama',
      en: 'Mathematical Programming',
    },
    desc: {
      tr: 'Tamsayılı programlama, ağ modelleri, dinamik programlama, konvekslik, doğrusal olmayan optimizasyon ve tedarik zinciri uygulamaları.',
      en: 'Integer programming, network models, dynamic programming, convexity, nonlinear optimization and supply chain applications.',
    },
    status: 'in_design',
    icon: Network,
    iconBg: 'bg-purple-600 text-white shadow-md shadow-purple-600/20',
    badge: { tr: 'Yakında', en: 'Coming Soon' },
    badgeStyle: 'bg-purple-100 text-purple-700 border-purple-200/80',
    cardStyle: 'border border-slate-200 bg-white shadow-xs hover:shadow-md hover:border-purple-300',
    glowColor: 'bg-purple-500/10',
  },
  {
    code: 'INDR 371',
    name: {
      tr: 'Operasyon ve Tesis Tasarımı',
      en: 'Operations and Facilities Design',
    },
    desc: {
      tr: 'Tesis planlama süreci, malzeme taşıma prensipleri, fabrika yerleşim düzeni, depolama, sipariş toplama ve AS/RS otomatik sistemler.',
      en: 'Facilities design process, material handling principles, facility layout, warehousing, order picking & automated storage/retrieval systems.',
    },
    status: 'in_design',
    icon: Factory,
    iconBg: 'bg-slate-800 text-white shadow-md shadow-slate-800/20',
    badge: { tr: 'Yakında', en: 'Coming Soon' },
    badgeStyle: 'bg-slate-100 text-slate-700 border-slate-300',
    cardStyle: 'border border-slate-200 bg-white shadow-xs hover:shadow-md hover:border-slate-400',
    glowColor: 'bg-slate-800/10',
  },
  {
    code: 'INDR 372',
    name: {
      tr: 'Üretim Planlama ve Kontrol',
      en: 'Production Planning and Control',
    },
    desc: {
      tr: 'Toplu planlama, envanter kontrolü, talep tahmini, çizelgeleme, iş gücü ve kapasite planlama, MRP ve Tam Zamanında Üretim (JIT).',
      en: 'Aggregate planning, inventory control, forecasting, scheduling, capacity planning, MRP and Just-In-Time (JIT) systems.',
    },
    status: 'in_design',
    icon: Calendar,
    iconBg: 'bg-blue-600 text-white shadow-md shadow-blue-600/20',
    badge: { tr: 'Yakında', en: 'Coming Soon' },
    badgeStyle: 'bg-blue-100 text-blue-700 border-blue-200/80',
    cardStyle: 'border border-slate-200 bg-white shadow-xs hover:shadow-md hover:border-blue-300',
    glowColor: 'bg-blue-500/10',
  },
  {
    code: 'INDR 481',
    name: {
      tr: 'Bilişim Sistemleri',
      en: 'Information Systems',
    },
    desc: {
      tr: 'Veri ve bilgi modelleme, modüler sistem analizi ve tasarımı, iş akış modelleme, proje yönetimi, MRP, ERP ve tedarik zinciri bilişim sistemleri.',
      en: 'Technological & conceptual aspects of information systems, data modeling, workflow modeling, project management, MRP, ERP and SCM.',
    },
    status: 'in_design',
    icon: Database,
    iconBg: 'bg-sky-600 text-white shadow-md shadow-sky-600/20',
    badge: { tr: 'Yakında', en: 'Coming Soon' },
    badgeStyle: 'bg-sky-100 text-sky-800 border-sky-200/80',
    cardStyle: 'border border-slate-200 bg-white shadow-xs hover:shadow-md hover:border-sky-300',
    glowColor: 'bg-sky-500/10',
  },
  {
    code: 'INDR 491',
    name: {
      tr: 'Endüstri Mühendisliği Tasarımı I',
      en: 'Industrial Engineering Design I',
    },
    desc: {
      tr: 'Bitirme projesi: Sektör firmaları tarafından sunulan projelerde gerçekçi kısıtlar altında mühendislik tasarımı, takım çalışması ve proje yönetimi.',
      en: 'Capstone design course applying engineering and science knowledge in industry projects under realistic constraints, teamwork & presentation.',
    },
    status: 'in_design',
    icon: Compass,
    iconBg: 'bg-rose-600 text-white shadow-md shadow-rose-600/20',
    badge: { tr: 'Yakında', en: 'Coming Soon' },
    badgeStyle: 'bg-rose-100 text-rose-800 border-rose-200/80',
    cardStyle: 'border border-slate-200 bg-white shadow-xs hover:shadow-md hover:border-rose-300',
    glowColor: 'bg-rose-500/10',
  },
];

export interface HomePageProps {
  onSelectTrack: (track: 'probability' | 'statistics') => void;
  onSelectInDesignCourse?: (course: CourseTrack) => void;
  onOpenProfile?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectTrack,
  onSelectInDesignCourse,
  onOpenProfile,
}) => {
  const {
    language,
    userProfile,
    isAuthenticated,
    isVerified,
    setIsTancoChatOpen,
    isTancoActive,
    isTancoMoved,
    activateTanco,
    setTancoPosition,
  } = useAppStore();

  const avatarRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
  });

  const clampPosition = useCallback((x: number, y: number) => {
    const isMobile = window.innerWidth < 640;
    const btnSize = isMobile ? 46 : 50;
    const padX = 12;
    const padTop = 64;
    const padBottom = isMobile ? 96 : 36;
    const minX = padX;
    const maxX = Math.max(minX, window.innerWidth - btnSize - padX);
    const minY = padTop;
    const maxY = Math.max(minY, window.innerHeight - btnSize - padBottom);
    return {
      x: Math.min(Math.max(minX, x), maxX),
      y: Math.min(Math.max(minY, y), maxY),
    };
  }, []);

  const handleAvatarPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const initialPos = { x: rect.left, y: rect.top };

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: initialPos.x,
      initialY: initialPos.y,
    };
    hasMovedRef.current = false;
    isDraggingRef.current = true;

    // Immediately awaken and activate Tanco at this exact viewport position!
    activateTanco(initialPos);

    e.currentTarget.setPointerCapture?.(e.pointerId);

    const onPointerMove = (moveEv: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = moveEv.clientX - dragStartRef.current.startX;
      const deltaY = moveEv.clientY - dragStartRef.current.startY;

      if (!hasMovedRef.current && Math.hypot(deltaX, deltaY) > 5) {
        hasMovedRef.current = true;
      }

      if (hasMovedRef.current) {
        const nextX = dragStartRef.current.initialX + deltaX;
        const nextY = dragStartRef.current.initialY + deltaY;
        setTancoPosition(clampPosition(nextX, nextY), true);
      }
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  // Format student greeting name according to user rule:
  // - If unauthenticated or guest: "kanka" (TR) or "friend" (EN)
  // - If registered with name:
  //   * 1-2 words -> first name (e.g. "Resul Tankılıç" -> "Resul")
  //   * 3+ words -> First letter. Second name (e.g. "Mehmet Ali Yılmaz" -> "M. Ali")
  const isUserRegistered = Boolean(isAuthenticated && isVerified && userProfile?.fullName?.trim());
  const fallbackGreeting = language === 'tr' ? 'kanka' : 'friend';
  const studentDisplayName = isUserRegistered
    ? formatStudentGreetingName(userProfile?.fullName, fallbackGreeting)
    : fallbackGreeting;

  return (
    <div className="w-full max-w-2xl mx-auto px-3.5 sm:px-4 py-6 font-sans overflow-x-hidden space-y-6">
      {/* ── Hero Welcome Banner ── */}
      <div className="relative p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-amber-400 via-[#ff7a00] to-[#e55a00] border border-amber-300/60 shadow-lg shadow-orange-500/15 overflow-hidden text-left">
        {/* Crisp static subtle radial highlights */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-yellow-300/15 rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-3.5 sm:gap-4">
          {/* Speech bubble card */}
          <div className="relative bg-white text-slate-900 border border-amber-100 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-lg">
            <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-snug mb-1">
              {language === 'tr'
                ? `Selam ${studentDisplayName}! Ben Tanco, senin TA'yin olacağım.`
                : `Hi ${studentDisplayName}! I'm Tanco, your TA.`}
            </h1>
            <p className="text-[11.5px] sm:text-xs text-slate-700 font-medium leading-relaxed">
              {language === 'tr' ? (
                <>
                  Seninle endüstri mühendisliğinde ihtiyaç duyduğun konular ve analitik araçlar için yardımcı olacağım. Bana dilediğin zaman fotoğrafıma tıklayarak ulaşabilirsin.{' '}
                  <strong className="font-black text-[#ff7a00]">Fotoğrafıma dokunup kaydırmayı dene !</strong>
                </>
              ) : (
                <>
                  I'll be here to help you with the tools, courses, and analytical concepts you need across industrial engineering. You can reach me anytime by clicking on my photo.{' '}
                  <strong className="font-black text-[#ff7a00]">Try tapping and dragging my photo!</strong>
                </>
              )}
            </p>
          </div>

          {/* Tanco avatar row */}
          <div className="flex items-center space-x-3 pl-1 min-h-[56px]">
            {!isTancoActive ? (
              <div
                ref={avatarRef}
                onPointerDown={handleAvatarPointerDown}
                className="relative group cursor-pointer select-none touch-none focus:outline-none"
                title={language === 'tr' ? "Tanco'yu canlandırmak için dokun veya kaydır!" : "Tap or drag to awaken Tanco!"}
              >
                <TanCoreMascotAvatar
                  size="lg"
                  alt="Tanco Yapay Zeka Öğretim Asistanı"
                  className="shadow-md shadow-black/20 ring-2 ring-white/80 group-hover:scale-105 group-active:scale-95 transition-transform shrink-0"
                />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 pointer-events-none">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-yellow-300 border-2 border-orange-600" />
                </span>
              </div>
            ) : !isTancoMoved ? (
              <div className="w-14 h-14 shrink-0" />
            ) : null}

            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs sm:text-sm font-black text-white tracking-tight drop-shadow-xs">Tanco</span>
                {isTancoActive && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-black bg-white/20 text-white border border-white/30 backdrop-blur-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
                    {language === 'tr' ? 'Aktif' : 'Active'}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-amber-100">
                {language === 'tr' ? 'Öğretim Asistanı' : 'Teaching Assistant'}
              </span>
            </div>
          </div>
        </div>
      </div>


      {/* 1. Hazır Olan Dersler (Aktif Modüller) */}
      <section aria-label={language === 'tr' ? 'Aktif Ders Parkurları' : 'Active Course Tracks'}>
        <h2 className="sr-only">
          {language === 'tr' ? 'Endüstri Mühendisliği Temel Dersleri' : 'Core Industrial Engineering Courses'}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:auto-rows-fr">
        {COURSES_DATA.filter((c) => c.status === 'active').map((course, idx) => {
          const isEn = language === 'en';
          const title = isEn ? course.name.en : course.name.tr;
          const desc = isEn ? course.desc.en : course.desc.tr;
          const Icon = course.icon;
          const stagger = idx === 0 ? 'animate-delay-50' : 'animate-delay-150';

          return (
            <button
              key={course.code}
              onClick={() => course.track && onSelectTrack(course.track)}
              className={`group relative w-full min-h-[175px] sm:min-h-[220px] p-3 sm:p-5 rounded-2xl sm:rounded-3xl border-2 text-left flex flex-col justify-between cursor-pointer overflow-hidden glow-card btn-press animate-card-reveal ${stagger} ${course.cardStyle}`}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-300 ${course.glowColor}`} />

              {/* Top row: Icon & Course Code with Arrow */}
              <div className="flex items-center justify-between w-full relative z-10 gap-1.5 sm:gap-2 shrink-0">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className={`w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shrink-0 ${course.iconBg}`}>
                    <Icon className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 stroke-[2.25]" />
                  </div>
                  <span className="text-sm sm:text-lg lg:text-xl font-black tracking-tight text-slate-900 group-hover:text-[#ff7a00] transition-colors duration-200 whitespace-nowrap">
                    {course.code}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 sm:w-6.5 sm:h-6.5 text-[#ff7a00] stroke-[3.5] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
              </div>

              {/* Middle content: Title & Description */}
              <div className="relative z-10 pt-2 sm:pt-2.5 flex-1 flex flex-col justify-start text-left min-h-0 overflow-hidden">
                <h3 className="text-xs sm:text-base font-black tracking-tight text-slate-900 group-hover:text-[#ff7a00] transition-colors duration-200 leading-snug line-clamp-2">
                  {title}
                </h3>
                <p className="text-[10.5px] sm:text-xs font-medium text-slate-600 line-clamp-5 mt-1.5 leading-relaxed">
                  {desc}
                </p>
              </div>
            </button>
          );
        })}
        </div>
      </section>

      {/* 2. Hazır Olanlar ile Hazır Olmayanlar Arasındaki Arttırılmış Mesafe */}
      <section className="pt-6 sm:pt-8" aria-label={language === 'tr' ? 'Geliştirilmekte Olan Dersler' : 'Upcoming Courses'}>
        <h2 className="sr-only">
          {language === 'tr' ? 'Yakında Eklenecek Endüstri Mühendisliği Dersleri' : 'Upcoming Industrial Engineering Courses'}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:auto-rows-fr">
          {COURSES_DATA.filter((c) => c.status !== 'active').map((course, idx) => {
            const isEn = language === 'en';
            const title = isEn ? course.name.en : course.name.tr;
            const desc = isEn ? course.desc.en : course.desc.tr;
            const Icon = course.icon;
            const staggerClass = ['animate-delay-50','animate-delay-100','animate-delay-150','animate-delay-200','animate-delay-250','animate-delay-300'][Math.min(idx, 5)];

            return (
              <button
                key={course.code}
                onClick={() => onSelectInDesignCourse?.(course)}
                className={`group relative w-full min-h-[175px] sm:min-h-[220px] p-3 sm:p-5 rounded-2xl sm:rounded-3xl border text-left flex flex-col justify-between overflow-hidden cursor-pointer card-hover btn-press animate-card-reveal ${staggerClass} ${course.cardStyle}`}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-xl pointer-events-none ${course.glowColor}`} />

                {/* Top row: Icon & Course Code YAKINDA */}
                <div className="flex items-center justify-start w-full relative z-10 gap-2 sm:gap-3 min-w-0 shrink-0">
                  <div className={`w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 ${course.iconBg}`}>
                    <Icon className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 stroke-[2.25]" />
                  </div>
                  <span className="text-xs sm:text-base lg:text-lg font-black tracking-tight uppercase text-amber-700 group-hover:text-amber-800 transition-colors duration-200 truncate">
                    {course.code} {isEn ? 'COMING SOON' : 'YAKINDA'}
                  </span>
                </div>

                {/* Middle content: Title & Full Description */}
                <div className="relative z-10 pt-2 sm:pt-2.5 flex-1 flex flex-col justify-start text-left min-h-0 overflow-hidden">
                  <h3 className="text-xs sm:text-base font-black tracking-tight text-slate-900 group-hover:text-amber-700 transition-colors duration-200 leading-snug line-clamp-2">
                    {title}
                  </h3>
                  <p className="text-[11px] sm:text-xs font-medium text-slate-600 line-clamp-5 mt-1.5 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
