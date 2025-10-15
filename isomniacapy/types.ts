export enum AppPage {
  Intro,
  Features,
  Survey,
  Confirmation,
  Homepage,
  Timetable,
  StudyMethods,
  BehaviorReflection,
  Consultation,
}

export interface SurveyData {
  age: '11-14' | '15-18' | '18+' | '';
  grade: string;
  problems: string[];
  otherProblem: string;
  needs: string[];
  otherNeed: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface TimetableTask {
  id: string;
  subject: string;
  note: string;
  completed: boolean;
}

export interface DailyNote {
  id: string;
  text: string;
}

export interface BehaviorLogRow {
  id: number;
  device: string;
  startTime: string;
  endTime: string;
  duration: string;
  benefits: string;
  feeling: string;
}
