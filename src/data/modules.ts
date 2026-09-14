import { Module } from '../types/stats';
import module1 from './module1.json';
import module2 from './module2.json';
import module3 from './module3.json';
import module4 from './module4.json';
import module5 from './module5.json';
import module6 from './module6.json';
import module7 from './module7.json';
import module8 from './module8.json';
import module9 from './module9.json';
import module10 from './module10.json';
import module11 from './module11.json';

export const ALL_MODULES: Module[] = [
  module1 as Module,
  module2 as Module,
  module3 as Module,
  module4 as Module,
  module5 as Module,
  module6 as Module,
  module7 as Module,
  module8 as Module,
  module9 as Module,
  module10 as Module,
  module11 as Module,
];

export function getModuleById(id: string): Module | undefined {
  return ALL_MODULES.find((m) => m.id === id);
}

export function getLessonById(lessonId: string) {
  for (const mod of ALL_MODULES) {
    const lesson = mod.lessons.find((l) => l.id === lessonId);
    if (lesson) return { lesson, module: mod };
  }
  return undefined;
}

export function getCaseExamById(caseId: string) {
  for (const mod of ALL_MODULES) {
    const caseExam = mod.caseExams.find((c) => c.id === caseId);
    if (caseExam) return { caseExam, module: mod };
  }
  return undefined;
}
