import React from 'react';
import { AppHeader } from './components/AppHeader';
import { SimulationsPanel } from './components/SimulationsPanel';
import { CodePanel } from './components/CodePanel';
import { ExcelSQLPanel } from './components/ExcelSQLPanel';
import { useSimulation } from './hooks/useSimulation';
import { Toaster } from '@/components/ui/toaster';

export default function App() {
  const sim = useSimulation();

  return (
    <div className="h-[100dvh] w-full p-2 bg-gradient-to-br from-[#F5AE50] to-[#FAF7EF] text-[#232323] overflow-hidden font-sans flex flex-col">
      <div className="w-full px-2 md:px-4 space-y-2 flex-1 flex flex-col min-h-0">
        <AppHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-stretch flex-1 min-h-0 overflow-y-auto lg:overflow-hidden pb-2">
          <div className="col-span-1 lg:col-span-1 flex flex-col min-h-0 h-[600px] lg:h-full">
            <SimulationsPanel sim={sim} />
          </div>
          <div className="col-span-1 lg:col-span-1 flex flex-col min-h-0 h-[600px] lg:h-full">
            <CodePanel sim={sim} />
          </div>
          <div className="col-span-1 lg:col-span-1 flex flex-col min-h-0 h-[600px] lg:h-full">
            <ExcelSQLPanel sim={sim} />
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}