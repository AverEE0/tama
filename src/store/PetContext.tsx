import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type { PetStats, MiniQuest, SkillNode, RoomItem, Moment, DailyReport } from '../types';

type PetState = {
  stats: PetStats;
  quests: MiniQuest[];
  skills: SkillNode[];
  roomItems: RoomItem[];
  moments: Moment[];
  dailyReport: DailyReport | null;
  lastAction: string | null;
  currentReplica: string | null;
};

const initialStats: PetStats = {
  status: 'healthy',
  mood: 'calm',
  energy: 80,
  hunger: 70,
  cleanliness: 85,
  happiness: 75,
  health: 100,
  character: 'playful',
  ageStage: 'child',
  birthDate: Date.now() - 3 * 24 * 60 * 60 * 1000,
  name: 'Тама',
};

const initialQuests: MiniQuest[] = [
  { id: 'q1', title: 'Покорми 3 раза', description: 'Покорми питомца три раза за день', type: 'feed', targetCount: 3, currentCount: 0, reward: '+10 к счастью', completed: false },
  { id: 'q2', title: 'Прогулка', description: 'Сходи на прогулку с питомцем', type: 'walk', targetCount: 1, currentCount: 0, reward: '+15 энергии', completed: false },
  { id: 'q3', title: 'Чистота', description: 'Своди питомца в туалет 2 раза', type: 'toilet', targetCount: 2, currentCount: 0, reward: 'Открытка', completed: false },
];

const initialSkills: SkillNode[] = [
  { id: 's1', name: 'Дружелюбие', description: 'Больше радости от общения', icon: '💬', unlocked: true, parentIds: [], requiredAge: 'baby' },
  { id: 's2', name: 'Ловкость', description: 'Быстрее восстанавливается', icon: '⚡', unlocked: false, parentIds: ['s1'], requiredAge: 'child' },
  { id: 's3', name: 'Умница', description: 'Новые реплики', icon: '🌟', unlocked: false, parentIds: ['s1'], requiredAge: 'child' },
  { id: 's4', name: 'Мастер игр', description: 'Бонус в мини-играх', icon: '🎮', unlocked: false, parentIds: ['s2', 's3'], requiredAge: 'teen' },
];

const defaultRoomItems: RoomItem[] = [
  { id: 'r1', name: 'Коврик', type: 'furniture', unlocked: true, equipped: true },
  { id: 'r2', name: 'Миска', type: 'furniture', unlocked: true, equipped: true },
  { id: 'r3', name: 'Мячик', type: 'toy', unlocked: true, equipped: false },
  { id: 'r4', name: 'Картина', type: 'decoration', unlocked: false, equipped: false },
];

type Action =
  | { type: 'SET_STATS'; payload: Partial<PetStats> }
  | { type: 'ROUTINE'; action: 'feed' | 'toilet' | 'walk' }
  | { type: 'QUEST_PROGRESS'; questId: string }
  | { type: 'QUEST_PROGRESS_BY_TYPE'; routineType: 'feed' | 'toilet' | 'walk' }
  | { type: 'UNLOCK_SKILL'; skillId: string }
  | { type: 'EQUIP_ITEM'; itemId: string; equipped: boolean }
  | { type: 'ADD_MOMENT'; moment: Moment }
  | { type: 'SET_REPLICA'; text: string | null }
  | { type: 'SET_LAST_ACTION'; action: string | null }
  | { type: 'SET_DAILY_REPORT'; report: DailyReport | null }
  | { type: 'HEAL'; amount: number }
  | { type: 'LOAD'; state: PetState };

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function reducer(state: PetState, action: Action): PetState {
  switch (action.type) {
    case 'SET_STATS':
      return { ...state, stats: { ...state.stats, ...action.payload } };
    case 'ROUTINE': {
      const s = { ...state.stats };
      if (action.action === 'feed') {
        s.hunger = clamp(s.hunger + 25, 0, 100);
        s.happiness = clamp(s.happiness + 5, 0, 100);
      }
      if (action.action === 'toilet') {
        s.cleanliness = clamp(s.cleanliness + 20, 0, 100);
        s.hunger = clamp(s.hunger - 5, 0, 100);
      }
      if (action.action === 'walk') {
        s.energy = clamp(s.energy - 10, 0, 100);
        s.happiness = clamp(s.happiness + 15, 0, 100);
      }
      return { ...state, stats: s };
    }
    case 'QUEST_PROGRESS': {
      const quests = state.quests.map((q) =>
        q.id === action.questId && !q.completed
          ? { ...q, currentCount: Math.min(q.currentCount + 1, q.targetCount), completed: q.currentCount + 1 >= q.targetCount }
          : q
      );
      return { ...state, quests };
    }
    case 'QUEST_PROGRESS_BY_TYPE': {
      const quests = state.quests.map((q) =>
        q.type === action.routineType && !q.completed
          ? { ...q, currentCount: Math.min(q.currentCount + 1, q.targetCount), completed: q.currentCount + 1 >= q.targetCount }
          : q
      );
      return { ...state, quests };
    }
    case 'UNLOCK_SKILL': {
      const skills = state.skills.map((s) => (s.id === action.skillId ? { ...s, unlocked: true } : s));
      return { ...state, skills };
    }
    case 'EQUIP_ITEM': {
      const roomItems = state.roomItems.map((i) =>
        i.id === action.itemId ? { ...i, equipped: action.equipped } : i.type !== 'furniture' ? i : { ...i, equipped: i.id === action.itemId ? action.equipped : i.equipped }
      );
      return { ...state, roomItems };
    }
    case 'ADD_MOMENT':
      return { ...state, moments: [action.moment, ...state.moments] };
    case 'SET_REPLICA':
      return { ...state, currentReplica: action.text };
    case 'SET_LAST_ACTION':
      return { ...state, lastAction: action.action };
    case 'SET_DAILY_REPORT':
      return { ...state, dailyReport: action.report };
    case 'HEAL':
      return { ...state, stats: { ...state.stats, health: clamp(state.stats.health + action.amount, 0, 100), status: 'healthy' } };
    case 'LOAD':
      return action.state;
    default:
      return state;
  }
}

const initialState: PetState = {
  stats: initialStats,
  quests: initialQuests,
  skills: initialSkills,
  roomItems: defaultRoomItems,
  moments: [],
  dailyReport: null,
  lastAction: null,
  currentReplica: null,
};

const PetContext = createContext<{
  state: PetState;
  dispatch: React.Dispatch<Action>;
  doRoutine: (action: 'feed' | 'toilet' | 'walk') => void;
  addMoment: (moment: Omit<Moment, 'id'>) => void;
  setReplica: (text: string | null) => void;
  setLastAction: (action: string | null) => void;
} | null>(null);

const STORAGE_KEY = 'tama-pet-state';

export function PetProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.stats) dispatch({ type: 'LOAD', state: { ...initialState, ...parsed } });
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        stats: state.stats,
        quests: state.quests,
        skills: state.skills,
        roomItems: state.roomItems,
        moments: state.moments,
      }));
    } catch (_) {}
  }, [state]);

  const doRoutine = useCallback((action: 'feed' | 'toilet' | 'walk') => {
    dispatch({ type: 'ROUTINE', action });
    dispatch({ type: 'SET_LAST_ACTION', action: action });
    dispatch({ type: 'QUEST_PROGRESS_BY_TYPE', routineType: action });
  }, []);

  const addMoment = useCallback((moment: Omit<Moment, 'id'>) => {
    dispatch({ type: 'ADD_MOMENT', moment: { ...moment, id: 'm' + Date.now() } });
  }, []);

  const setReplica = useCallback((text: string | null) => {
    dispatch({ type: 'SET_REPLICA', text });
  }, []);

  const setLastAction = useCallback((action: string | null) => {
    dispatch({ type: 'SET_LAST_ACTION', action });
  }, []);

  return (
    <PetContext.Provider value={{ state, dispatch, doRoutine, addMoment, setReplica, setLastAction }}>
      {children}
    </PetContext.Provider>
  );
}

export function usePet() {
  const ctx = useContext(PetContext);
  if (!ctx) throw new Error('usePet must be used within PetProvider');
  return ctx;
}
