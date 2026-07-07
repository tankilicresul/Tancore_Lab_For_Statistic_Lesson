import { Badge } from '@/components/ui/badge';

export function AppHeader() {
  const badges = ['Probability', 'Regression', 'Excel', 'SQL', 'Python', 'Simulation', 'AI Tutor'];
  
  return (
    <header className="flex flex-col items-center justify-center text-center space-y-1.5 py-2 w-full">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-0.5" style={{ color: '#4B232D' }}>
          StatSim AI Lab
        </h1>
        <p className="text-sm md:text-base font-medium text-[#232323] max-w-2xl mx-auto px-4">
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