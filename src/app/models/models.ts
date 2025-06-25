// Team Member model
export interface TeamMember {
  id?: number;
  name: string;
  active: boolean;
  createdAt?: Date;
}

// Refinement Meeting model
export interface RefinementMeeting {
  id?: number;
  leaderId: number;
  date: Date;
  completed: boolean;
  createdAt?: Date;
}

// Standup Meeting model  
export interface StandupMeeting {
  id?: number;
  leaderId: number;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  active: boolean;
  createdAt?: Date;
}

// Refinement Queue model
export interface RefinementQueue {
  id?: number;
  teamMemberId: number;
  order: number;
  active: boolean;
}

// Day of week enum
export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6
}
