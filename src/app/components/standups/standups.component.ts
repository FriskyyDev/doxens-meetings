import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatabaseService } from '../../services/database.service';
import { TeamMember, DayOfWeek } from '../../models/models';

@Component({
  selector: 'app-standups',
  standalone: true,  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Daily Standups</h1>
        <button mat-raised-button (click)="loadData()" class="refresh-btn">
          <mat-icon>refresh</mat-icon>
          Refresh
        </button>
      </div>

      <div class="cards-grid">
        <!-- Today's Leader Card -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <mat-icon>person</mat-icon>
              <h2>Today's Leader</h2>
            </div>
            <div class="day-badge">{{ getCurrentDay() }}</div>
          </div>
          <div class="card-content">
            @if (getTodaysLeader()) {
              <div class="leader-display">
                <div class="leader-name">{{ getTodaysLeader()?.name }}</div>
                <div class="leader-role">Leading today's standup</div>
              </div>
            } @else {
              <div class="no-leader">
                <mat-icon class="warning-icon">warning</mat-icon>
                <div class="warning-text">No leader assigned for today</div>
              </div>
            }
          </div>
        </div>

        <!-- Schedule Stats Card -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <mat-icon>schedule</mat-icon>
              <h2>Weekly Schedule</h2>
            </div>
          </div>
          <div class="card-content">
            <div class="schedule-stats">
              <div class="stat">
                <div class="stat-number">{{ teamMembers.length }}</div>
                <div class="stat-label">Team Members</div>
              </div>
              <div class="stat">
                <div class="stat-number">5</div>
                <div class="stat-label">Weekdays</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Weekly Schedule Management -->
      <div class="schedule-section">
        <div class="schedule-header">
          <h3>Weekly Schedule Management</h3>
        </div>
        <div class="schedule-grid">
          @for (day of weekDays; track day.value) {
            <div class="day-card" 
                 [class.active-day]="isToday(day.value)"
                 [class.dropdown-open]="isDropdownOpen(day.value)">
              <div class="day-header">
                <h4 class="day-name">{{ day.name }}</h4>
                @if (isToday(day.value)) {
                  <span class="today-indicator">Today</span>
                }
              </div>
              <div class="leader-assignment">
                <label class="dropdown-label">Select Leader</label>
                <div class="custom-dropdown" [class.open]="isDropdownOpen(day.value)">
                  <button 
                    type="button"
                    class="dropdown-trigger"
                    (click)="toggleDropdown(day.value)"
                    [class.has-value]="getLeaderForDay(day.value)">
                    <span class="dropdown-value">
                      {{ getLeaderForDay(day.value) ? getLeaderName(getLeaderForDay(day.value)!) : 'Choose a leader...' }}
                    </span>
                    <mat-icon class="dropdown-arrow" [class.rotated]="isDropdownOpen(day.value)">expand_more</mat-icon>
                  </button>
                  
                  <div class="dropdown-menu" [class.show]="isDropdownOpen(day.value)">
                    <div class="dropdown-option" 
                         (click)="selectLeader(day.value, null)"
                         [class.selected]="!getLeaderForDay(day.value)">
                      <span>No Leader</span>
                    </div>
                    @for (member of teamMembers; track member.id) {
                      <div class="dropdown-option" 
                           (click)="selectLeader(day.value, member.id!)"
                           [class.selected]="getLeaderForDay(day.value) === member.id">
                        <div class="option-content">
                          <div class="member-avatar-small">{{ member.name.charAt(0).toUpperCase() }}</div>
                          <span>{{ member.name }}</span>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,  styles: [`
    .dashboard-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .dashboard-header h1 {
      margin: 0;
      font-size: 2rem;
      font-weight: 300;
      color: #e2e8f0;
    }

    .refresh-btn {
      background: rgba(59, 130, 246, 0.2) !important;
      border: 1px solid rgba(59, 130, 246, 0.3) !important;
      color: #93c5fd !important;
      transition: all 0.2s ease !important;
    }

    .refresh-btn:hover {
      background: rgba(59, 130, 246, 0.3) !important;
      border-color: rgba(59, 130, 246, 0.5) !important;
      transform: translateY(-1px) !important;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .card {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.3), rgba(15, 20, 30, 0.3));
      border: 1px solid rgba(71, 85, 105, 0.3);
      border-radius: 16px;
      padding: 24px;
      transition: all 0.2s ease;
      backdrop-filter: blur(10px);
    }

    .card:hover {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.4), rgba(15, 20, 30, 0.4));
      border-color: rgba(71, 85, 105, 0.5);
      transform: translateY(-2px);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .card-title mat-icon {
      color: #93c5fd;
    }

    .card-title h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 500;
      color: #e2e8f0;
    }

    .day-badge {
      background: rgba(59, 130, 246, 0.2);
      color: #93c5fd;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 500;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .card-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .leader-display {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .leader-name {
      font-size: 1.5rem;
      font-weight: 600;
      color: #f8fafc;
      margin-bottom: 4px;
    }

    .leader-role {
      color: #94a3b8;
      font-size: 0.875rem;
      margin-bottom: 16px;
    }

    .no-leader {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: #f59e0b;
    }

    .warning-icon {
      font-size: 2rem;
      color: #f59e0b;
    }

    .warning-text {
      font-size: 0.875rem;
      color: #fbbf24;
    }

    .schedule-stats {
      display: flex;
      justify-content: space-around;
      width: 100%;
    }

    .stat {
      text-align: center;
    }

    .stat-number {
      display: block;
      font-size: 2rem;
      font-weight: 700;
      color: #f8fafc;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #94a3b8;
      margin-top: 4px;
    }

    .schedule-section {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.3), rgba(15, 20, 30, 0.3));
      border: 1px solid rgba(71, 85, 105, 0.3);
      border-radius: 16px;
      padding: 24px;
      backdrop-filter: blur(10px);
    }

    .schedule-header h3 {
      margin: 0 0 20px 0;
      font-size: 1.25rem;
      font-weight: 500;
      color: #e2e8f0;
    }

    .schedule-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }

    .day-card {
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid rgba(71, 85, 105, 0.3);
      border-radius: 12px;
      padding: 16px;
      transition: all 0.2s ease;
      position: relative;
      overflow: visible;
    }

    .day-card:hover {
      background: rgba(30, 41, 59, 0.5);
      border-color: rgba(71, 85, 105, 0.5);
      transform: translateY(-2px);
    }

    .day-card.active-day {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%);
      border-color: rgba(34, 197, 94, 0.4);
    }

    .day-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .day-name {
      font-size: 1.125rem;
      font-weight: 600;
      color: #f8fafc;
      margin: 0;
    }

    .today-indicator {
      background: rgba(34, 197, 94, 0.8);
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .dropdown-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: #94a3b8;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .custom-dropdown {
      position: relative;
      width: 100%;
      z-index: 10;
    }

    .dropdown-trigger {
      width: 100%;
      background: rgba(30, 41, 59, 0.5);
      border: 1px solid rgba(71, 85, 105, 0.3);
      border-radius: 12px;
      padding: 12px 16px;
      color: #f8fafc;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .dropdown-trigger:hover {
      background: rgba(30, 41, 59, 0.6);
      border-color: rgba(71, 85, 105, 0.5);
    }

    .dropdown-value {
      flex: 1;
      text-align: left;
      color: #f8fafc;
    }

    .dropdown-trigger:not(.has-value) .dropdown-value {
      color: #94a3b8;
      font-style: italic;
    }

    .dropdown-arrow {
      color: #94a3b8;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .dropdown-arrow.rotated {
      transform: rotate(180deg);
      color: #93c5fd;
    }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 20, 30, 0.95));
      border: 1px solid rgba(71, 85, 105, 0.5);
      border-radius: 12px;
      backdrop-filter: blur(20px);
      z-index: 1000;
      max-height: 240px;
      overflow-y: auto;
      opacity: 0;
      transform: translateY(-10px);
      transition: all 0.15s ease;
      pointer-events: none;
    }

    .dropdown-menu.show {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    .dropdown-option {
      padding: 12px 16px;
      color: #f8fafc;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 8px;
      margin: 4px 8px;
    }

    .dropdown-option:hover {
      background: rgba(71, 85, 105, 0.3);
      color: #f8fafc;
    }

    .dropdown-option.selected {
      background: rgba(59, 130, 246, 0.2);
      color: #93c5fd;
      font-weight: 600;
    }

    .option-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .member-avatar-small {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(147, 197, 253, 0.8));
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 0.875rem;
    }
  `]
})
export class StandupsComponent implements OnInit {
  teamMembers: TeamMember[] = [];
  standupSchedule: any[] = [];
  openDropdowns: Set<DayOfWeek> = new Set();
  
  weekDays = [
    { name: 'Monday', value: DayOfWeek.Monday },
    { name: 'Tuesday', value: DayOfWeek.Tuesday },
    { name: 'Wednesday', value: DayOfWeek.Wednesday },
    { name: 'Thursday', value: DayOfWeek.Thursday },
    { name: 'Friday', value: DayOfWeek.Friday }
  ];
  constructor(private databaseService: DatabaseService) {    // Close dropdowns when clicking outside
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.custom-dropdown')) {
        this.openDropdowns.clear();
      }
    });
  }

  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.teamMembers = this.databaseService.getTeamMembers();
    this.standupSchedule = this.databaseService.getStandupSchedule();
  }

  getCurrentDay(): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  }

  getTodaysLeader(): TeamMember | undefined {
    const today = new Date().getDay();
    const todaySchedule = this.standupSchedule.find(s => s.dayOfWeek === today);
    if (todaySchedule) {
      return this.teamMembers.find(m => m.id === todaySchedule.leaderId);
    }
    return undefined;
  }

  isToday(dayOfWeek: DayOfWeek): boolean {
    return new Date().getDay() === dayOfWeek;
  }

  getLeaderForDay(dayOfWeek: DayOfWeek): number | null {
    const schedule = this.standupSchedule.find(s => s.dayOfWeek === dayOfWeek);
    return schedule ? schedule.leaderId : null;
  }
  getLeaderName(leaderId: number): string {
    const leader = this.teamMembers.find(m => m.id === leaderId);
    return leader ? leader.name : 'Unknown';
  }

  // Custom dropdown methods
  isDropdownOpen(dayOfWeek: DayOfWeek): boolean {
    return this.openDropdowns.has(dayOfWeek);
  }  toggleDropdown(dayOfWeek: DayOfWeek): void {
    if (this.openDropdowns.has(dayOfWeek)) {
      this.openDropdowns.delete(dayOfWeek);
    } else {
      // Close all other dropdowns first
      this.openDropdowns.clear();
      this.openDropdowns.add(dayOfWeek);
    }  }
  selectLeader(dayOfWeek: DayOfWeek, leaderId: number | null): void {
    if (leaderId) {
      this.databaseService.setStandupLeader(dayOfWeek, leaderId);
    } else {
      // Handle removing leader logic if needed
      this.databaseService.setStandupLeader(dayOfWeek, 0); // Assuming 0 means no leader
    }
    this.loadData();
    this.openDropdowns.delete(dayOfWeek); // Close dropdown after selection
  }

  updateLeader(dayOfWeek: DayOfWeek, leaderId: string) {
    if (leaderId) {
      this.databaseService.setStandupLeader(dayOfWeek, parseInt(leaderId));
      this.loadData();
    }
  }
}
