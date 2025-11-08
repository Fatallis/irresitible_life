
// Fix: Removed self-import which caused declaration conflicts.
// import { LifeArea, TaskType } from './types';

export enum LifeArea {
  Salud = 'Salud',
  Conocimiento = 'Conocimiento',
  Disciplina = 'Disciplina',
  Creatividad = 'Creatividad',
  Relaciones = 'Relaciones',
  Servicio = 'Servicio',
}

export enum TaskType {
  Accion = 'Acción',
  Proyecto = 'Proyecto',
  Idea = 'Idea',
  Reflexion = 'Reflexión',
}

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  category: LifeArea;
  subtasks: Subtask[];
  xp: number;
  missionId?: string;
  isUrgent: boolean;
}

export interface PlanItem {
  id: string;
  title: string;
  time: string;
  category: LifeArea;
  xp: number;
  purposePhrase: string;
  taskId?: string;
  missionId?: string;
  subtasks?: Subtask[];
}

export enum MentorTier {
  Inicial = 'Inicial',
  Intermedio = 'Intermedio',
  Maestro = 'Maestro',
}

export interface Mentor {
  id: number;
  name: string;
  philosophy: string;
  area: LifeArea;
  tier: MentorTier;
  unlocked: boolean;
  unlockCondition: string;
}

export interface HabitPlan {
  coreHabitTaskName: string;
  supportiveHabits: string[];
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  area: LifeArea;
  active: boolean;
  tasks: Task[];
  habitPlan?: HabitPlan;
}

export interface JournalEntry {
  id: string;
  timestamp: Date;
  text: string;
  icon: string;
}

export interface LifeAreaStat {
  area: LifeArea;
  level: number;
  xp: number;
}

export interface AnalysisReport {
  strengths: string;
  weaknesses: string;
  recommendations: string;
  highlights: string;
  lowlights: string;
}