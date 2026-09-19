import { Module, LocalizedText } from '../types/stats';
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
import module17 from './module17.json';
import module18 from './module18.json';
import module19 from './module19.json';
import module20 from './module20.json';
import module21 from './module21.json';
import module22 from './module22.json';
import module23 from './module23.json';
import module24 from './module24.json';

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
  module17 as Module,
  module18 as Module,
  module19 as Module,
  module20 as Module,
  module21 as Module,
  module22 as Module,
  module23 as Module,
  module24 as Module,
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

export const PROBABILITY_MODULE_ORDER = [
  'module-13', 'module-2', 'module-14', 'module-3', 'module-16', 'module-15', 'module-4', 'module-12'
];

export const STATISTICS_MODULE_ORDER = [
  'module-1', 'module-4', 'module-5', 'module-6', 'module-7', 'module-8', 'module-9', 'module-10', 'module-11'
];

export const INDR100_MODULE_ORDER = [
  'module-17', 'module-18', 'module-19', 'module-20', 'module-21', 'module-22', 'module-23', 'module-24'
];

export interface SequentialTopicNode {
  id: string;
  type: 'lesson' | 'case';
  title: LocalizedText;
  module: Module;
}

export function getSequentialTopicsForTrack(track: 'probability' | 'statistics' | 'indr100'): SequentialTopicNode[] {
  let moduleOrder = STATISTICS_MODULE_ORDER;
  if (track === 'probability') moduleOrder = PROBABILITY_MODULE_ORDER;
  if (track === 'indr100') moduleOrder = INDR100_MODULE_ORDER;

  const topics: SequentialTopicNode[] = [];

  for (const modId of moduleOrder) {
    const mod = ALL_MODULES.find((m) => m.id === modId);
    if (!mod) continue;
    const lessons = mod.lessons || [];
    const cases = mod.caseExams || [];

    for (let i = 0; i < lessons.length; i++) {
      topics.push({ id: lessons[i].id, type: 'lesson', title: lessons[i].title, module: mod });
    }
    for (let c = 0; c < cases.length; c++) {
      topics.push({ id: cases[c].id, type: 'case', title: cases[c].title, module: mod });
    }
  }
  return topics;
}

export function getAllSequentialTopics(): SequentialTopicNode[] {
  return [
    ...getSequentialTopicsForTrack('statistics'),
    ...getSequentialTopicsForTrack('probability'),
    ...getSequentialTopicsForTrack('indr100'),
  ];
}

export function getNextTopicItem(currentId: string, track?: 'probability' | 'statistics' | 'indr100'): SequentialTopicNode | undefined {
  let effectiveTrack = track;
  if (!effectiveTrack) {
    const lessonInfo = getLessonById(currentId);
    const caseInfo = !lessonInfo ? getCaseExamById(currentId) : undefined;
    const modId = lessonInfo?.module.id || caseInfo?.module.id;
    if (modId) {
      if (INDR100_MODULE_ORDER.includes(modId)) {
        effectiveTrack = 'indr100';
      } else if (PROBABILITY_MODULE_ORDER.includes(modId)) {
        effectiveTrack = 'probability';
      } else {
        effectiveTrack = 'statistics';
      }
    } else {
      effectiveTrack = 'statistics';
    }
  }

  const topics = getSequentialTopicsForTrack(effectiveTrack);
  const currentIndex = topics.findIndex((t) => t.id === currentId);
  if (currentIndex !== -1 && currentIndex + 1 < topics.length) {
    return topics[currentIndex + 1];
  }
  return undefined;
}

