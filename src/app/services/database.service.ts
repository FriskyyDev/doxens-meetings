import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TeamMember, RefinementMeeting, StandupMeeting, RefinementQueue } from '../models/models';

interface DatabaseSchema {
  teamMembers: TeamMember[];
  refinementMeetings: RefinementMeeting[];
  standupMeetings: StandupMeeting[];
  refinementQueue: RefinementQueue[];
  nextId: number;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private initialized = false;
  private dbInitialized = new BehaviorSubject<boolean>(false);
  public dbReady$ = this.dbInitialized.asObservable();
  private storageKey = 'meetingSchedulerData';

  constructor() {
    this.initializeDatabase();
  }

  private async initializeDatabase(): Promise<void> {
    try {
      console.log('DatabaseService - Initializing localStorage database');
      
      // Check if data exists in localStorage
      const existingData = localStorage.getItem(this.storageKey);
      
      if (!existingData) {
        console.log('DatabaseService - No existing data, creating fresh database');
        this.createInitialData();
      } else {
        console.log('DatabaseService - Loading existing data from localStorage');
        // Validate the data structure
        try {
          const data = JSON.parse(existingData) as DatabaseSchema;
          if (!this.validateDataStructure(data)) {
            console.log('DatabaseService - Invalid data structure, recreating');
            this.createInitialData();
          }
        } catch {
          console.log('DatabaseService - Corrupted data, recreating');
          this.createInitialData();
        }
      }

      this.initialized = true;
      this.dbInitialized.next(true);
      console.log('DatabaseService - Database initialized successfully');
      
      // Test the database by querying data
      console.log('DatabaseService - Testing database:');
      console.log('DatabaseService - Team members:', this.getTeamMembers());
      console.log('DatabaseService - Standup schedule:', this.getStandupSchedule());
      console.log('DatabaseService - Refinement queue:', this.getRefinementQueue());
    } catch (error) {
      console.error('Failed to initialize database:', error);
      // Fallback to creating initial data
      this.createInitialData();
      this.initialized = true;
      this.dbInitialized.next(true);
    }
  }
  private validateDataStructure(data: any): data is DatabaseSchema {
    return data &&
           Array.isArray(data.teamMembers) &&
           Array.isArray(data.refinementMeetings) &&
           Array.isArray(data.standupMeetings) &&
           Array.isArray(data.refinementQueue) &&
           typeof data.nextId === 'number';
  }

  private createInitialData(): void {
    console.log('DatabaseService - Creating initial sample data');

    const sampleMembers: TeamMember[] = [
      { id: 1, name: 'Alice Johnson', active: true, createdAt: new Date() },
      { id: 2, name: 'Bob Smith', active: true, createdAt: new Date() },
      { id: 3, name: 'Carol Davis', active: true, createdAt: new Date() },
      { id: 4, name: 'David Wilson', active: true, createdAt: new Date() }
    ];

    const sampleRefinementQueue: RefinementQueue[] = [
      { id: 1, teamMemberId: 1, order: 1, active: true },
      { id: 2, teamMemberId: 2, order: 2, active: true },
      { id: 3, teamMemberId: 3, order: 3, active: true },
      { id: 4, teamMemberId: 4, order: 4, active: true }
    ];

    const sampleStandupSchedule: StandupMeeting[] = [
      { id: 1, leaderId: 1, dayOfWeek: 1, active: true, createdAt: new Date() }, // Monday - Alice
      { id: 2, leaderId: 2, dayOfWeek: 2, active: true, createdAt: new Date() }, // Tuesday - Bob
      { id: 3, leaderId: 3, dayOfWeek: 3, active: true, createdAt: new Date() }, // Wednesday - Carol
      { id: 4, leaderId: 4, dayOfWeek: 4, active: true, createdAt: new Date() }, // Thursday - David
      { id: 5, leaderId: 1, dayOfWeek: 5, active: true, createdAt: new Date() }  // Friday - Alice
    ];

    const initialData: DatabaseSchema = {
      teamMembers: sampleMembers,
      refinementMeetings: [],
      standupMeetings: sampleStandupSchedule,
      refinementQueue: sampleRefinementQueue,
      nextId: 6
    };

    this.saveData(initialData);
    console.log('DatabaseService - Initial data created');
  }

  private getData(): DatabaseSchema {
    const data = localStorage.getItem(this.storageKey);
    if (!data) {
      throw new Error('No data found in localStorage');
    }
    return JSON.parse(data);
  }

  private saveData(data: DatabaseSchema): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // Team Members CRUD
  getTeamMembers(): TeamMember[] {
    try {
      const data = this.getData();
      const members = data.teamMembers.filter(member => member.active);
      console.log('DatabaseService - getTeamMembers returning:', members);
      return members;
    } catch {
      return [];
    }
  }

  addTeamMember(member: Omit<TeamMember, 'id' | 'createdAt'>): TeamMember {
    const data = this.getData();
    
    const newMember: TeamMember = {
      id: data.nextId++,
      name: member.name,
      active: member.active,
      createdAt: new Date()
    };

    data.teamMembers.push(newMember);
    this.saveData(data);
    
    return newMember;
  }

  updateTeamMember(member: TeamMember): void {
    if (!member.id) return;

    const data = this.getData();
    const index = data.teamMembers.findIndex(m => m.id === member.id);
    
    if (index >= 0) {
      data.teamMembers[index] = { ...member };
      this.saveData(data);
    }
  }

  deleteTeamMember(id: number): void {
    const data = this.getData();
    const member = data.teamMembers.find(m => m.id === id);
    
    if (member) {
      member.active = false;
      this.saveData(data);
    }
  }

  // Refinement Queue Management
  getRefinementQueue(): (RefinementQueue & { memberName: string })[] {
    try {
      const data = this.getData();
      const activeQueue = data.refinementQueue
        .filter(q => q.active)
        .sort((a, b) => a.order - b.order);

      return activeQueue.map(q => {
        const member = data.teamMembers.find(m => m.id === q.teamMemberId && m.active);
        return {
          ...q,
          memberName: member ? member.name : 'Unknown'
        };
      }).filter(q => q.memberName !== 'Unknown');
    } catch {
      return [];
    }
  }

  setRefinementQueue(memberIds: number[]): void {
    const data = this.getData();
    
    // Mark all current queue items as inactive
    data.refinementQueue.forEach(q => q.active = false);
    
    // Add new queue items
    memberIds.forEach((memberId, index) => {
      data.refinementQueue.push({
        id: data.nextId++,
        teamMemberId: memberId,
        order: index + 1,
        active: true
      });
    });

    this.saveData(data);
  }

  getNextRefinementLeader(): TeamMember | null {
    const queue = this.getRefinementQueue();
    if (queue.length === 0) return null;

    const nextInQueue = queue[0];
    const members = this.getTeamMembers();
    return members.find(m => m.id === nextInQueue.teamMemberId) || null;
  }

  markRefinementCompleted(leaderId: number): void {
    const data = this.getData();

    // Add refinement meeting record
    const meeting: RefinementMeeting = {
      id: data.nextId++,
      leaderId: leaderId,
      date: new Date(),
      completed: true,
      createdAt: new Date()
    };
    data.refinementMeetings.push(meeting);

    // Move leader to back of queue
    const activeQueue = data.refinementQueue.filter(q => q.active);
    const leaderIndex = activeQueue.findIndex(q => q.teamMemberId === leaderId);

    if (leaderIndex >= 0) {
      // Reorder queue - move leader to end
      const reorderedQueue = [
        ...activeQueue.slice(leaderIndex + 1),
        activeQueue[leaderIndex]
      ];

      // Update order positions
      reorderedQueue.forEach((q, index) => {
        q.order = index + 1;
      });
    }

    this.saveData(data);
  }

  // Standup Management
  getStandupSchedule(): (StandupMeeting & { memberName: string })[] {
    try {
      const data = this.getData();
      const activeSchedule = data.standupMeetings
        .filter(s => s.active)
        .sort((a, b) => a.dayOfWeek - b.dayOfWeek);

      return activeSchedule.map(s => {
        const member = data.teamMembers.find(m => m.id === s.leaderId && m.active);
        return {
          ...s,
          memberName: member ? member.name : 'Unknown'
        };
      }).filter(s => s.memberName !== 'Unknown');
    } catch {
      return [];
    }
  }

  setStandupLeader(dayOfWeek: number, leaderId: number): void {
    const data = this.getData();
    
    // Remove existing entry for this day
    const existingIndex = data.standupMeetings.findIndex(
      s => s.dayOfWeek === dayOfWeek && s.active
    );
    
    if (existingIndex >= 0) {
      data.standupMeetings[existingIndex].active = false;
    }

    // Add new entry
    const newStandup: StandupMeeting = {
      id: data.nextId++,
      leaderId: leaderId,
      dayOfWeek: dayOfWeek,
      active: true,
      createdAt: new Date()
    };
    
    data.standupMeetings.push(newStandup);
    this.saveData(data);
  }

  getTodaysStandupLeader(): TeamMember | null {
    try {
      const data = this.getData();
      const today = new Date().getDay();
      
      const todaysStandup = data.standupMeetings.find(
        s => s.dayOfWeek === today && s.active
      );
      
      if (!todaysStandup) return null;
      
      return data.teamMembers.find(
        m => m.id === todaysStandup.leaderId && m.active
      ) || null;
    } catch {
      return null;
    }
  }

  // Export/Import functionality for sharing between machines
  exportDatabase(): string {
    try {
      const data = this.getData();
      return JSON.stringify(data, null, 2);
    } catch {
      throw new Error('Database not initialized');
    }
  }

  importDatabase(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData) as DatabaseSchema;
      if (this.validateDataStructure(data)) {
        this.saveData(data);
        console.log('Database imported successfully');
      } else {
        throw new Error('Invalid data structure');
      }
    } catch (error) {
      console.error('Failed to import database:', error);
      throw error;
    }
  }

  // Reset database - useful for testing and development
  resetDatabase(): void {
    console.log('DatabaseService - Resetting database');
    localStorage.removeItem(this.storageKey);
    this.createInitialData();
    console.log('DatabaseService - Database reset complete');
  }
}
