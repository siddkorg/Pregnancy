
export interface ActivityLog {
  id: string;
  date: string;
  waterIntake: number; // in glasses
  sleepHours: number;
  mood: 'happy' | 'tired' | 'calm' | 'excited' | 'nauseous';
  notes: string;
}

export interface UserProfile {
  name: string;
  dueDate: string;
  currentWeek: number;
}

export interface Story {
  title: string;
  content: string;
  theme: string;
}

export enum AppScreen {
  DASHBOARD = 'DASHBOARD',
  STORY = 'STORY',
  GAMES = 'GAMES',
  LOG = 'LOG',
  CALENDAR = 'CALENDAR',
  SETTINGS = 'SETTINGS'
}
