import React from 'react';
import { AppHeader } from './components/AppHeader';
import { SimulationsPanel } from './components/SimulationsPanel';
import { CodePanel } from './components/CodePanel';
import { ChatBotPanel } from './components/ChatBotPanel';
import { ExcelSQLPanel } from './components/ExcelSQLPanel';
import { useSimulation } from './hooks/useSimulation';
import { Toaster } from '@/components/ui/toaster';

export default function App() {
  const sim = useSimulation();

  return (
    <div className="min-h-[100dvh] w-full p-2 bg-gradient-to-br from-[#F5AE50] to-[#FAF7EF] text-[#232323] overflow-x-hidden font-sans">
      <div className="max-w-[1600px] mx-auto space-y-2">
        <AppHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 items-stretch">
          <div className="col-span-1 lg:col-span-1 flex flex-col gap-2">
            <SimulationsPanel sim={sim} />
          </div>
          <div className="col-span-1 lg:col-span-1 flex flex-col gap-2 h-full">
            <div className="flex-1 min-h-[400px]">
              <CodePanel sim={sim} />
            </div>
            <div className="shrink-0 mt-auto">
              <ChatBotPanel sim={sim} />
            </div>
          </div>
          <div className="col-span-1 lg:col-span-1 flex flex-col gap-2">
            <ExcelSQLPanel sim={sim} />
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}