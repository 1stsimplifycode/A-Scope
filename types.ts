
export enum Role {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export enum ProblemStatus {
  UNSOLVED = 'Unsolved',
  ATTEMPTED = 'Attempted',
  SOLVED = 'Solved'
}

export interface Phase {
  week: number;
  topic: string;
  description: string;
  isLocked: boolean;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  topic: string;
  difficulty: Difficulty;
  week: number;
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  visualizationType?: 'tree' | 'graph' | 'dp_table' | 'array';
  status?: ProblemStatus;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  reviewScore?: number;
  feedback?: string;
}

export interface UserEvent {
  id: string;
  type: 'Hackathon' | 'Ideathon' | 'Codathon' | 'Hiring';
  title: string;
  date: string;
  organizer: string;
  prize: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  semester: number;
  solvedProblemIds: string[];
  attemptedProblemIds: string[];
  streak: number;
  points: number;
  skills: string[];
}

// Interface for code solutions used in CPWorkspace component
export interface Solution {
  id: string;
  name: string;
  code: string;
  language: string;
}

// Interface for execution tracing used in CPWorkspace component
export interface TraceStep {
  id: string;
  timestamp: string;
  line: number;
  scope: string;
}
