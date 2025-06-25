import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TeamMember, RefinementMeeting, StandupMeeting, RefinementQueue, DayOfWeek } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private dbInitialized = new BehaviorSubject<boolean>(true);
  public dbReady$ = this.dbInitialized.asObservable();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {    // Initialize with sample data if none exists
    if (!localStorage.getItem('teamMembers')) {
      const sampleMembers: TeamMember[] = [
        { id: 1, name: 'Alice Johnson', active: true },
        { id: 2, name: 'Bob Smith', active: true },
        { id: 3, name: 'Charlie Brown', active: true },
        { id: 4, name: 'Diana Prince', active: true }
      ];
      localStorage.setItem('teamMembers', JSON.stringify(sampleMembers));
    }

    if (!localStorage.getItem('refinementQueue')) {
      const sampleQueue: RefinementQueue[] = [
        { id: 1, teamMemberId: 1, order: 1, active: true },
        { id: 2, teamMemberId: 2, order: 2, active: true },
        { id: 3, teamMemberId: 3, order: 3, active: true },
        { id: 4, teamMemberId: 4, order: 4, active: true }
      ];
      localStorage.setItem('refinementQueue', JSON.stringify(sampleQueue));
    }

    if (!localStorage.getItem('standupSchedule')) {
      const sampleSchedule = [
        { id: 1, dayOfWeek: DayOfWeek.Monday, leaderId: 1 },
        { id: 2, dayOfWeek: DayOfWeek.Tuesday, leaderId: 2 },
        { id: 3, dayOfWeek: DayOfWeek.Wednesday, leaderId: 3 },
        { id: 4, dayOfWeek: DayOfWeek.Thursday, leaderId: 4 },
        { id: 5, dayOfWeek: DayOfWeek.Friday, leaderId: 1 }
      ];
      localStorage.setItem('standupSchedule', JSON.stringify(sampleSchedule));
    }
  }

  // Team Members
  getTeamMembers(): TeamMember[] {
    const data = localStorage.getItem('teamMembers');
    return data ? JSON.parse(data) : [];
  }

  addTeamMember(member: Omit<TeamMember, 'id'>): TeamMember {
    const members = this.getTeamMembers();
    const newId = Math.max(0, ...members.map(m => m.id || 0)) + 1;
    const newMember: TeamMember = { ...member, id: newId };
    members.push(newMember);
    localStorage.setItem('teamMembers', JSON.stringify(members));
    return newMember;
  }

  updateTeamMember(member: TeamMember): void {
    const members = this.getTeamMembers();
    const index = members.findIndex(m => m.id === member.id);
    if (index !== -1) {
      members[index] = member;
      localStorage.setItem('teamMembers', JSON.stringify(members));
    }
  }

  deleteTeamMember(memberId: number): void {
    const members = this.getTeamMembers().filter(m => m.id !== memberId);
    localStorage.setItem('teamMembers', JSON.stringify(members));
  }
  // Refinement Queue
  getRefinementQueue(): any[] {
    const queue = localStorage.getItem('refinementQueue');
    const queueData = queue ? JSON.parse(queue) : [];
    const members = this.getTeamMembers();
    
    return queueData
      .filter((q: any) => q.active)
      .map((q: any) => {
        const member = members.find(m => m.id === q.teamMemberId);
        return {
          ...q,
          memberName: member?.name || 'Unknown'
        };
      })
      .sort((a: any, b: any) => a.order - b.order);
  }

  moveToBackOfQueue(memberId: number): void {
    const queue = JSON.parse(localStorage.getItem('refinementQueue') || '[]');
    const member = queue.find((q: any) => q.teamMemberId === memberId);
    if (member) {
      const maxOrder = Math.max(...queue.map((q: any) => q.order));
      member.order = maxOrder + 1;
      localStorage.setItem('refinementQueue', JSON.stringify(queue));
    }
  }

  addToRefinementQueue(memberId: number): void {
    const queue = JSON.parse(localStorage.getItem('refinementQueue') || '[]');
    const maxOrder = Math.max(0, ...queue.map((q: any) => q.order));
    const newId = Math.max(0, ...queue.map((q: any) => q.id)) + 1;
    
    queue.push({
      id: newId,
      teamMemberId: memberId,
      order: maxOrder + 1,
      active: true
    });
    
    localStorage.setItem('refinementQueue', JSON.stringify(queue));
  }

  removeFromRefinementQueue(memberId: number): void {
    const queue = JSON.parse(localStorage.getItem('refinementQueue') || '[]');
    const filtered = queue.filter((q: any) => q.teamMemberId !== memberId);
    localStorage.setItem('refinementQueue', JSON.stringify(filtered));
  }

  // Standup Schedule
  getStandupSchedule(): any[] {
    const schedule = localStorage.getItem('standupSchedule');
    const scheduleData = schedule ? JSON.parse(schedule) : [];
    const members = this.getTeamMembers();
    
    return scheduleData.map((s: any) => {
      const member = members.find(m => m.id === s.leaderId);
      return {
        ...s,
        memberName: member?.name || 'Unassigned'
      };
    });
  }

  setStandupLeader(dayOfWeek: number, leaderId: number): void {
    const schedule = JSON.parse(localStorage.getItem('standupSchedule') || '[]');
    const existingEntry = schedule.find((s: any) => s.dayOfWeek === dayOfWeek);
    
    if (existingEntry) {
      existingEntry.leaderId = leaderId;
    } else {
      const newId = Math.max(0, ...schedule.map((s: any) => s.id)) + 1;
      schedule.push({
        id: newId,
        dayOfWeek,
        leaderId
      });
    }
    
    localStorage.setItem('standupSchedule', JSON.stringify(schedule));
  }

  // Refinement Meetings
  getRefinementMeetings(): RefinementMeeting[] {
    const data = localStorage.getItem('refinementMeetings');
    return data ? JSON.parse(data) : [];
  }

  addRefinementMeeting(meeting: Omit<RefinementMeeting, 'id'>): RefinementMeeting {
    const meetings = this.getRefinementMeetings();
    const newId = Math.max(0, ...meetings.map(m => m.id || 0)) + 1;
    const newMeeting: RefinementMeeting = { ...meeting, id: newId };
    meetings.push(newMeeting);
    localStorage.setItem('refinementMeetings', JSON.stringify(meetings));
    return newMeeting;
  }

  // Standup Meetings
  getStandupMeetings(): StandupMeeting[] {
    const data = localStorage.getItem('standupMeetings');
    return data ? JSON.parse(data) : [];
  }

  addStandupMeeting(meeting: Omit<StandupMeeting, 'id'>): StandupMeeting {
    const meetings = this.getStandupMeetings();
    const newId = Math.max(0, ...meetings.map(m => m.id || 0)) + 1;
    const newMeeting: StandupMeeting = { ...meeting, id: newId };
    meetings.push(newMeeting);
    localStorage.setItem('standupMeetings', JSON.stringify(meetings));
    return newMeeting;
  }

  // Additional helper methods
  getTodaysStandupLeader(): TeamMember | null {
    const today = new Date().getDay();
    const schedule = this.getStandupSchedule();
    const todaySchedule = schedule.find(s => s.dayOfWeek === today);
    
    if (!todaySchedule || !todaySchedule.leaderId) return null;
    
    const members = this.getTeamMembers();    return members.find(m => m.id === todaySchedule.leaderId) || null;
  }

  getNextRefinementLeader(): TeamMember | null {
    const queue = this.getRefinementQueue();
    if (queue.length === 0) return null;
    
    const members = this.getTeamMembers();
    const nextInQueue = queue[0];
    return members.find(m => m.id === nextInQueue.teamMemberId) || null;
  }

  markRefinementCompleted(leaderId: number): void {
    // Move the current leader to the back of the queue
    this.moveToBackOfQueue(leaderId);
  }

  setRefinementQueue(memberIds: number[]): void {
    // Create a new queue from the provided member IDs
    const newQueue = memberIds.map((memberId, index) => ({
      id: index + 1,
      teamMemberId: memberId,
      order: index + 1,
      active: true
    }));
    localStorage.setItem('refinementQueue', JSON.stringify(newQueue));
  }

  // Debug and data consistency methods
  debugAllData(): void {
    console.log('=== STORAGE SERVICE DEBUG ===');
    console.log('Team Members:', this.getTeamMembers());
    console.log('Standup Schedule:', this.getStandupSchedule());
    console.log('Refinement Queue:', this.getRefinementQueue());
    console.log('Today is day:', new Date().getDay());
    console.log('Today\'s leader:', this.getTodaysStandupLeader());
    console.log('Next refinement leader:', this.getNextRefinementLeader());
    console.log('=== END STORAGE DEBUG ===');
  }

  fixDataConsistency(): void {
    const members = this.getTeamMembers();
    
    // If no team members, create default ones
    if (members.length === 0) {
      console.log('No team members found, creating default ones');
      const defaultMembers = [
        { name: 'Alice Johnson', active: true },
        { name: 'Bob Smith', active: true },
        { name: 'Charlie Brown', active: true },
        { name: 'Diana Prince', active: true }
      ];
      
      defaultMembers.forEach(member => this.addTeamMember(member));
      return this.fixDataConsistency(); // Recursive call to continue fixing
    }

    // Fix standup schedule - ensure all days have valid leader IDs
    const schedule = JSON.parse(localStorage.getItem('standupSchedule') || '[]');
    const memberIds = members.map(m => m.id);
    const fixedSchedule = schedule.map((s: any) => {
      if (!memberIds.includes(s.leaderId)) {
        // Assign first available member
        s.leaderId = memberIds[0] || 0;
      }
      return s;
    });
    
    // Ensure we have schedule for weekdays (1-5)
    for (let day = 1; day <= 5; day++) {
      if (!fixedSchedule.find((s: any) => s.dayOfWeek === day)) {
        fixedSchedule.push({
          id: Math.max(0, ...fixedSchedule.map((s: any) => s.id)) + 1,
          dayOfWeek: day,
          leaderId: memberIds[day % memberIds.length] || memberIds[0]
        });
      }
    }
    
    localStorage.setItem('standupSchedule', JSON.stringify(fixedSchedule));

    // Fix refinement queue - ensure all team member IDs are valid
    const queue = JSON.parse(localStorage.getItem('refinementQueue') || '[]');
    const validQueue = queue.filter((q: any) => memberIds.includes(q.teamMemberId));
    
    // If queue is empty or has invalid members, recreate it
    if (validQueue.length === 0) {
      const newQueue = members.map((member, index) => ({
        id: index + 1,
        teamMemberId: member.id,
        order: index + 1,
        active: true
      }));
      localStorage.setItem('refinementQueue', JSON.stringify(newQueue));
    } else {
      localStorage.setItem('refinementQueue', JSON.stringify(validQueue));
    }
    
    console.log('Data consistency fixed');
  }
}
