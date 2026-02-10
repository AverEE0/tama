// Игровая статистика
export type PetStatus = 'healthy' | 'sick' | 'tired' | 'hungry' | 'happy';
export type Mood = 'joy' | 'calm' | 'sad' | 'excited' | 'sleepy' | 'neutral';
export type Character = 'playful' | 'lazy' | 'curious' | 'grumpy' | 'kind';

export type AgeStage = 'egg' | 'baby' | 'child' | 'teen' | 'adult' | 'elder';

export interface PetStats {
  status: PetStatus;
  mood: Mood;
  energy: number;      // 0–100
  hunger: number;     // 0–100 (100 = сыт)
  cleanliness: number; // 0–100
  happiness: number;  // 0–100
  health: number;     // 0–100
  character: Character;
  ageStage: AgeStage;
  birthDate: number;  // timestamp
  name: string;
}

// Рутина
export type RoutineAction = 'feed' | 'toilet' | 'walk';

export interface MiniQuest {
  id: string;
  title: string;
  description: string;
  type: RoutineAction;
  targetCount: number;
  currentCount: number;
  reward: string;
  completed: boolean;
}

// Умения
export interface SkillNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requiredAge?: AgeStage;
  parentIds: string[];
}

// Шкатулка / комната
export interface RoomItem {
  id: string;
  name: string;
  type: 'furniture' | 'decoration' | 'toy';
  unlocked: boolean;
  equipped: boolean;
  image?: string;
}

// Память
export interface Moment {
  id: string;
  date: number;
  title: string;
  description: string;
  type: 'moment' | 'postcard';
  image?: string;
}

// Оповещения
export interface NotificationSetting {
  id: string;
  label: string;
  enabled: boolean;
  softPush: boolean;
}

export interface DailyReport {
  date: string;
  feedCount: number;
  walkCount: number;
  toiletCount: number;
  questsCompleted: number;
  moodSummary: string;
}
