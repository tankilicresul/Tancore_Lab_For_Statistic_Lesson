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
import module12 from './module12.json';
import module13 from './module13.json';
import module14 from './module14.json';
import module15 from './module15.json';
import module16 from './module16.json';

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
  module12 as Module,
  module13 as Module,
  module14 as Module,
  module15 as Module,
  module16 as Module,
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

export interface SequentialTopicNode {
  id: string;
  type: 'lesson' | 'case';
  title: { tr: string; en: string };
  module: Module;
}

export function getAllSequentialTopics(): SequentialTopicNode[] {
  const topics: SequentialTopicNode[] = [];
  for (const mod of ALL_MODULES) {
    const lessons = mod.lessons || [];
    const cases = mod.caseExams || [];

    if (lessons[0]) topics.push({ id: lessons[0].id, type: 'lesson', title: lessons[0].title, module: mod });
    if (lessons[1]) topics.push({ id: lessons[1].id, type: 'lesson', title: lessons[1].title, module: mod });
    if (cases[0]) topics.push({ id: cases[0].id, type: 'case', title: cases[0].title, module: mod });

    for (let i = 2; i < lessons.length; i++) {
      topics.push({ id: lessons[i].id, type: 'lesson', title: lessons[i].title, module: mod });
    }
    for (let c = 1; c < cases.length; c++) {
      topics.push({ id: cases[c].id, type: 'case', title: cases[c].title, module: mod });
    }
  }
  return topics;
}

export function getNextTopicItem(currentId: string): SequentialTopicNode | undefined {
  const topics = getAllSequentialTopics();
  const currentIndex = topics.findIndex((t) => t.id === currentId);
  if (currentIndex !== -1 && currentIndex + 1 < topics.length) {
    return topics[currentIndex + 1];
  }
  return undefined;
}
