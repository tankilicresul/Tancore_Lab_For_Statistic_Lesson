import { Badge } from '@/components/ui/badge';

export function AppHeader() {
  const badges = ['Probability', 'Regression', 'Excel', 'SQL', 'Python', 'Simulation', 'AI Tutor'];
  
  return (
    <header className="flex flex-col items-center justify-center text-center space-y-3 py-1 w-full">
      <div className="flex flex-col md:flex-row items-center justify-between w-full px-2 md:px-4 gap-2 md:gap-4">
        <p className="hidden md:block text-sm md:text-base font-semibold text-[#4B232D]/80 text-right flex-1 max-w-md ml-auto">
          Temel istatistikten ileri regresyon modellerine kadar
        </p>
        
        <div className="bg-white/40 backdrop-blur-md border border-white/20 px-6 py-2 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 shrink-0">
          <h1 className="text-3xl md:text-4.5xl font-extrabold tracking-tight scale-100 hover:scale-105 transition-transform duration-300" style={{ color: '#4B232D' }}>
            StatSim AI Lab
          </h1>
        </div>
        
        <p className="hidden md:block text-sm md:text-base font-semibold text-[#4B232D]/80 text-left flex-1 max-w-md mr-auto">
          simülasyon üret, kodla, analiz et ve AI ile öğren.
        </p>
        
        {/* Mobile description fallback */}
        <p className="block md:hidden text-xs md:text-sm font-semibold text-[#4B232D]/80 px-2 mt-1">
          Temel istatistikten ileri regresyon modellerine kadar simülasyon üret, kodla, analiz et ve AI ile öğren.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5 px-4">
        {badges.map(b => (
          <Badge key={b} variant="secondary" className="bg-[#F5AE50] hover:bg-[#e09e45] text-[#232323] font-semibold border-none px-3 py-0.5 text-xs rounded-full shadow-sm transition-transform hover:scale-105">
            {b}
          </Badge>
        ))}
      </div>
    </header>
  );
}