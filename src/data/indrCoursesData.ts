import rawCoursesData from './indrAdvancedCourses.json';

export interface CourseModuleItem {
  id: string;
  title_tr: string;
  title_en: string;
  badge_tr: string;
  badge_en: string;
  desc_tr: string;
  desc_en: string;
  pills_tr: string;
  pills_en: string;
  content_tr: string;
  content_en: string;
}

export interface CourseMetadata {
  code: string;
  title_tr: string;
  title_en: string;
  instructor: string;
  term: string;
  category: string;
  topics_count?: number;
}

export interface AdvancedCourse {
  meta: CourseMetadata;
  modules: CourseModuleItem[];
}

export type IndrCourseKey = 'indr100' | 'indr343' | 'indr344' | 'indr363' | 'indr371';

export const INDR_COURSES_DATA = rawCoursesData as unknown as Record<IndrCourseKey, AdvancedCourse>;

export function getIndrCourse(key: IndrCourseKey): AdvancedCourse {
  return INDR_COURSES_DATA[key];
}
