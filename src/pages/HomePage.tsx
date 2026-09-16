import React, { useState, useEffect } from 'react';
import { ALL_MODULES } from '../data/modules';
import { useAppStore } from '../store/useAppStore';
import { getLocalized, formatStudentGreetingName } from '../utils/localization';
import { TanCoreMascotAvatar } from '../components/TanCoreMascotAvatar';
import {
  Zap,
  Dices,
  BarChart3,
  Trophy,
  Flame,
  Target,
  Award,
  Sparkles,
  ArrowRight,
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
    cardStyle: 'border-orange-200/80 bg-gradient-to-b from-orange-50/50 via-white to-amber-50/30 shadow-xs hover:shadow-md hover:border-[#ff7a00]/50',
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
    cardStyle: 'border-emerald-200/80 bg-gradient-to-b from-emerald-50/50 via-white to-teal-50/30 shadow-xs hover:shadow-md hover:border-emerald-500/50',
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
    badge: { tr: 'Tasarımda', en: 'In Design' },
    badgeStyle: 'bg-cyan-100 text-cyan-800 border-cyan-200/80',
    cardStyle: 'border-cyan-200/70 bg-gradient-to-b from-cyan-50/40 via-white to-slate-50/70 shadow-xs hover:shadow-md',
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
    badge: { tr: 'Tasarımda', en: 'In Design' },
    badgeStyle: 'bg-sky-100 text-sky-800 border-sky-200/80',
    cardStyle: 'border-sky-200/70 bg-gradient-to-b from-sky-50/40 via-white to-slate-50/70 shadow-xs hover:shadow-md',
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
    badge: { tr: 'Tasarımda', en: 'In Design' },
    badgeStyle: 'bg-emerald-100 text-emerald-800 border-emerald-200/80',
    cardStyle: 'border-emerald-200/70 bg-gradient-to-b from-emerald-50/40 via-white to-slate-50/70 shadow-xs hover:shadow-md',
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
    badge: { tr: 'Tasarımda', en: 'In Design' },
    badgeStyle: 'bg-indigo-100 text-indigo-700 border-indigo-200/80',
    cardStyle: 'border-indigo-200/70 bg-gradient-to-b from-indigo-50/40 via-white to-slate-50/70 shadow-xs hover:shadow-md',
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
    badge: { tr: 'Tasarımda', en: 'In Design' },
    badgeStyle: 'bg-violet-100 text-violet-700 border-violet-200/80',
    cardStyle: 'border-violet-200/70 bg-gradient-to-b from-violet-50/40 via-white to-slate-50/70 shadow-xs hover:shadow-md',
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
    badge: { tr: 'Tasarımda', en: 'In Design' },
    badgeStyle: 'bg-amber-100 text-amber-800 border-amber-200/80',
    cardStyle: 'border-amber-200/70 bg-gradient-to-b from-amber-50/40 via-white to-slate-50/70 shadow-xs hover:shadow-md',
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
    badge: { tr: 'Tasarımda', en: 'In Design' },
    badgeStyle: 'bg-teal-100 text-teal-800 border-teal-200/80',
    cardStyle: 'border-teal-200/70 bg-gradient-to-b from-teal-50/40 via-white to-slate-50/70 shadow-xs hover:shadow-md',
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
    badge: { tr: 'Tasarımda', en: 'In Design' },
    badgeStyle: 'bg-purple-100 text-purple-700 border-purple-200/80',
    cardStyle: 'border-purple-200/70 bg-gradient-to-b from-purple-50/40 via-white to-slate-50/70 shadow-xs hover:shadow-md',
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
    badge: { tr: 'Tasarımda', en: 'In Design' },
    badgeStyle: 'bg-slate-100 text-slate-700 border-slate-300',
    cardStyle: 'border-slate-300/80 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/70 shadow-xs hover:shadow-md',
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
    badge: { tr: 'Tasarımda', en: 'In Design' },
    badgeStyle: 'bg-blue-100 text-blue-700 border-blue-200/80',
    cardStyle: 'border-blue-200/70 bg-gradient-to-b from-blue-50/40 via-white to-slate-50/70 shadow-xs hover:shadow-md',
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
    badge: { tr: 'Tasarımda', en: 'In Design' },
    badgeStyle: 'bg-sky-100 text-sky-800 border-sky-200/80',
    cardStyle: 'border-sky-200/70 bg-gradient-to-b from-sky-50/40 via-white to-slate-50/70 shadow-xs hover:shadow-md',
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
    badge: { tr: 'Tasarımda', en: 'In Design' },
    badgeStyle: 'bg-rose-100 text-rose-800 border-rose-200/80',
    cardStyle: 'border-rose-200/70 bg-gradient-to-b from-rose-50/40 via-white to-slate-50/70 shadow-xs hover:shadow-md',
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
    setIsTancoChatOpen,
  } = useAppStore();

  // Format student greeting name according to user rule:
  // 1-2 words -> first name; 3+ words -> First letter. Second name
  const studentDisplayName = formatStudentGreetingName(userProfile?.fullName, language === 'tr' ? 'Öğrenci' : 'Student');

  return (
    <div className="w-full max-w-2xl mx-auto px-3.5 sm:px-4 py-6 font-sans overflow-x-hidden animate-fade-in space-y-6">
      {/* Top Welcome Banner: Tanco at bottom-left with speech bubble above */}
      <div className="relative p-5 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden text-left">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff7a00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-3.5 sm:gap-4">
          {/* Speech Bubble coming out from Tanco's head */}
          <div className="relative bg-slate-50 border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xs">
            {/* Speech bubble tail pointing down towards Tanco's head */}
            <div className="absolute left-7 sm:left-8 -bottom-2 w-4 h-4 bg-slate-50 border-r border-b border-slate-200/90 transform rotate-45" />

            <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-snug mb-1">
              <span>
                {language === 'tr'
                  ? `Selam ${studentDisplayName}! Ben Tanco, senin TA'yin olacağım.`
                  : `Hi ${studentDisplayName}! I'm Tanco, your TA.`}
              </span>
            </h2>
            <p className="text-[11.5px] sm:text-xs text-slate-700 font-medium leading-relaxed">
              {language === 'tr'
                ? "Seninle endüstri mühendisliğinde ihtiyaç duyduğun konular ve analitik araçlar için yardımcı olacağım. Bana dilediğin zaman fotoğrafıma tıklayarak ulaşabilirsin."
                : "I'll be here to help you with the tools, courses, and analytical concepts you need across industrial engineering. You can reach me anytime by clicking on my photo."}
            </p>
          </div>

          {/* Tanco Mascot at Bottom-Left */}
          <div className="flex items-center space-x-3 pl-1">
            <button
              onClick={() => setIsTancoChatOpen(true)}
              className="relative group cursor-pointer focus:outline-none"
              title={language === 'tr' ? "Tanco ile Sohbet Et" : "Chat with Tanco"}
            >
              <TanCoreMascotAvatar
                size="lg"
                className="shadow-md shadow-[#ff7a00]/25 group-hover:scale-105 transition-transform shrink-0"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-2xs" />
            </button>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                Tanco
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-orange-100 text-[#ff7a00] font-mono">
                  TA
                </span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-slate-500">
                {language === 'tr' ? 'Öğretim Asistanı' : 'Teaching Assistant'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Hazır Olan Dersler (Aktif Modüller) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:auto-rows-fr">
        {COURSES_DATA.filter((c) => c.status === 'active').map((course) => {
          const isEn = language === 'en';
          const title = isEn ? course.name.en : course.name.tr;
          const desc = isEn ? course.desc.en : course.desc.tr;
          const badgeText = isEn ? course.badge.en : course.badge.tr;
          const Icon = course.icon;

          return (
            <button
              key={course.code}
              onClick={() => course.track && onSelectTrack(course.track)}
              className={`group relative w-full aspect-square sm:aspect-auto sm:min-h-[220px] p-3 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-300 text-left flex flex-col justify-between cursor-pointer overflow-hidden ${course.cardStyle}`}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform ${course.glowColor}`} />

              {/* Top row: Icon & Course Code / Badge */}
              <div className="flex items-center justify-between w-full relative z-10 gap-1.5 sm:gap-2 shrink-0">
                <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shrink-0 ${course.iconBg}`}>
                  <Icon className="w-4 h-4 sm:w-6 sm:h-6 stroke-[2.25]" />
                </div>
                <div className="h-8 sm:h-12 flex flex-col items-end justify-center gap-0.5 shrink-0">
                  <span className="text-[11px] sm:text-sm font-black font-mono tracking-tight text-slate-800">
                    {course.code}
                  </span>
                  <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full font-mono border ${course.badgeStyle}`}>
                    {badgeText}
                  </span>
                </div>
              </div>

              {/* Middle content: Title & Description starting right below the icon row */}
              <div className="relative z-10 pt-1.5 sm:pt-3 flex-1 flex flex-col justify-center text-left min-h-0 overflow-hidden">
                <h3 className="text-[11px] sm:text-[15px] font-black tracking-tight text-slate-900 group-hover:text-[#ff7a00] transition-colors leading-tight sm:leading-snug line-clamp-2">
                  {title}
                </h3>
                <p className="text-[9px] sm:text-[11.5px] font-medium text-slate-500 line-clamp-1 sm:line-clamp-2 mt-0.5 sm:mt-1 leading-tight">
                  {desc}
                </p>
              </div>

              {/* Bottom CTA button (pinned to the bottom) */}
              <div className="relative z-10 mt-auto pt-1 sm:pt-2.5 shrink-0">
                <div className="flex items-center space-x-1 text-[9px] sm:text-xs font-black uppercase tracking-wider text-[#ff7a00] group-hover:translate-x-1 transition-transform">
                  <span>{isEn ? 'Open Path' : 'Ders Yoluna Git'}</span>
                  <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. Hazır Olanlar ile Hazır Olmayanlar Arasındaki Arttırılmış Mesafe */}
      <div className="pt-6 sm:pt-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:auto-rows-fr">
          {COURSES_DATA.filter((c) => c.status !== 'active').map((course) => {
            const isEn = language === 'en';
            const title = isEn ? course.name.en : course.name.tr;
            const desc = isEn ? course.desc.en : course.desc.tr;
            const Icon = course.icon;

            return (
              <button
                key={course.code}
                onClick={() => onSelectInDesignCourse?.(course)}
                className={`group relative w-full aspect-square sm:aspect-auto sm:min-h-[220px] p-3 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-300 text-left flex flex-col justify-between overflow-hidden cursor-pointer hover:border-amber-400/80 hover:shadow-md ${course.cardStyle}`}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-xl pointer-events-none ${course.glowColor}`} />

                {/* Top row: Icon & Course Code */}
                <div className="flex items-center justify-between w-full relative z-10 gap-1.5 sm:gap-2 shrink-0">
                  <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${course.iconBg}`}>
                    <Icon className="w-4 h-4 sm:w-6 sm:h-6 stroke-[2.25]" />
                  </div>
                  <div className="h-8 sm:h-12 flex items-center justify-end shrink-0">
                    <span className="text-[11px] sm:text-sm font-black font-mono tracking-tight text-slate-700">
                      {course.code}
                    </span>
                  </div>
                </div>

                {/* Middle content: Title & Description starting right below the icon row */}
                <div className="relative z-10 pt-1.5 sm:pt-3 flex-1 flex flex-col justify-center text-left min-h-0 overflow-hidden">
                  <h3 className="text-[11px] sm:text-[15px] font-black tracking-tight text-slate-900 group-hover:text-amber-700 transition-colors leading-tight sm:leading-snug line-clamp-2">
                    {title}
                  </h3>
                  <p className="text-[9px] sm:text-[11.5px] font-medium text-slate-500 line-clamp-1 sm:line-clamp-2 mt-0.5 sm:mt-1 leading-tight">
                    {desc}
                  </p>
                </div>

                {/* Bottom status (pinned to the bottom) */}
                <div className="relative z-10 mt-auto pt-1 sm:pt-2.5 shrink-0">
                  <div className="flex items-center space-x-1 text-[9px] sm:text-xs font-black uppercase tracking-wider text-amber-600 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all">
                    <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin text-amber-500 shrink-0" />
                    <span className="truncate">{isEn ? 'In Design' : 'Tasarım Aşamasında'}</span>
                    <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
