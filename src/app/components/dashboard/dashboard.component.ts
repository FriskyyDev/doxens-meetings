import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatabaseService } from '../../services/database.service';
import { TeamMember } from '../../models/models';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Meeting Leader Dashboard</h1>
        <button mat-raised-button (click)="refreshData()" class="refresh-btn">
          <mat-icon>refresh</mat-icon>
          Refresh
        </button>
      </div>

      <div class="cards-grid">
        <!-- Today's Stand-up Leader -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <mat-icon>person</mat-icon>
              <h2>Today's Stand-up Leader</h2>
            </div>
            <div class="day-badge">{{ getTodayName() }}</div>
          </div>
          <div class="card-content">
            @if (todaysStandupLeader) {
              <div class="leader-display">
                <div class="leader-name">{{ todaysStandupLeader.name }}</div>
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

        <!-- Next Refinement Leader -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <mat-icon>trending_up</mat-icon>
              <h2>Next Refinement Leader</h2>
            </div>
          </div>
          <div class="card-content">
            @if (nextRefinementLeader) {
              <div class="leader-display">
                <div class="leader-name">{{ nextRefinementLeader.name }}</div>
                <div class="leader-role">Next up for refinement</div>
                <button 
                  mat-raised-button 
                  class="action-btn" 
                  (click)="markRefinementCompleted()">
                  <mat-icon>check</mat-icon>
                  Mark as Completed
                </button>
              </div>
            } @else {
              <div class="no-leader">
                <mat-icon class="warning-icon">warning</mat-icon>
                <div class="warning-text">No refinement queue set up</div>
              </div>
            }
          </div>
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

    .action-btn {
      background: rgba(34, 197, 94, 0.2) !important;
      border: 1px solid rgba(34, 197, 94, 0.3) !important;
      color: #86efac !important;
      margin-top: 12px !important;
      transition: all 0.2s ease !important;
    }

    .action-btn:hover {
      background: rgba(34, 197, 94, 0.3) !important;
      border-color: rgba(34, 197, 94, 0.5) !important;
      transform: translateY(-1px) !important;
    }

    .action-btn mat-icon {
      margin-right: 8px;
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  teamMembers: TeamMember[] = [];
  todaysStandupLeader: TeamMember | null = null;
  nextRefinementLeader: TeamMember | null = null;
  refinementQueueLength = 0;
  isDbReady = false;
  private subscriptions: Subscription[] = [];
  private refreshInterval: Subscription | null = null;
  constructor(private databaseService: DatabaseService) {
    console.log('DashboardComponent constructor called');
  }  ngOnInit() {
    console.log('DashboardComponent ngOnInit called');
    
    // Add a timeout to test if this is a timing issue
    setTimeout(() => {
      console.log('Database service ready status:', this.databaseService.dbReady$);
    }, 1000);
    
    // Subscribe to database ready status
    const dbReadySubscription = this.databaseService.dbReady$.subscribe({
      next: (ready: boolean) => {
        console.log('Database ready status:', ready);
        this.isDbReady = ready;
        if (ready) {
          console.log('Database is ready, loading data...');
          // Load data when database is ready
          this.loadData();
          this.startAutoRefresh();
        } else {
          console.log('Database is not ready yet...');
        }
      },
      error: (error: any) => {
        console.error('Database ready subscription error:', error);
      }
    });
    this.subscriptions.push(dbReadySubscription);

    // Listen for window focus events to refresh data
    const focusHandler = () => {
      if (this.isDbReady) {
        this.loadData();
      }
    };
    window.addEventListener('focus', focusHandler);
    
    // Clean up event listener when component is destroyed
    this.subscriptions.push(new Subscription(() => {
      window.removeEventListener('focus', focusHandler);
    }));
  }

  ngOnDestroy() {
    // Clean up all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.refreshInterval) {
      this.refreshInterval.unsubscribe();
    }
  }

  private startAutoRefresh() {
    // Refresh data every 30 seconds to catch any changes
    this.refreshInterval = interval(30000).subscribe(() => {
      if (this.isDbReady) {
        this.loadData();
      }
    });
  }  private loadData() {
    console.log('Loading data...');
    try {
      // Load team members
      const previousTeamCount = this.teamMembers.length;
      this.teamMembers = this.databaseService.getTeamMembers();
      console.log(`Team members: ${previousTeamCount} -> ${this.teamMembers.length}`, this.teamMembers);      // Load today's standup leader
      const previousStandupLeader = this.todaysStandupLeader?.name;
      this.todaysStandupLeader = this.databaseService.getTodaysStandupLeader();
      console.log(`Today's standup leader: ${previousStandupLeader} -> ${this.todaysStandupLeader?.name}`);

      // Load next refinement leader
      const previousRefinementLeader = this.nextRefinementLeader?.name;
      this.nextRefinementLeader = this.databaseService.getNextRefinementLeader();
      console.log(`Next refinement leader: ${previousRefinementLeader} -> ${this.nextRefinementLeader?.name}`);

      // Load refinement queue length
      const previousQueueLength = this.refinementQueueLength;
      const queue = this.databaseService.getRefinementQueue();
      this.refinementQueueLength = queue.length;
      console.log(`Refinement queue length: ${previousQueueLength} -> ${this.refinementQueueLength}`, queue);

      console.log('Data loaded successfully:', {
        teamMembers: this.teamMembers.length,
        todaysStandupLeader: this.todaysStandupLeader?.name,
        nextRefinementLeader: this.nextRefinementLeader?.name,
        refinementQueueLength: this.refinementQueueLength
      });
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }  markRefinementCompleted() {
    if (this.nextRefinementLeader?.id) {
      this.databaseService.markRefinementCompleted(this.nextRefinementLeader.id);
      this.loadData(); // Refresh data
    }
  }

  refreshData() {
    console.log('Manual refresh triggered');
    this.debugStorageData();
    this.loadData();
  }

  resetDatabase() {
    console.log('Resetting database...');
    localStorage.removeItem('meetingSchedulerSqlite');
    this.databaseService.resetDatabase();
    this.loadData();
  }
  private debugStorageData() {
    console.log('=== DATABASE DEBUG ===');
    console.log('Database ready:', this.isDbReady);
    console.log('Team Members:', this.teamMembers);
    console.log('Today\'s Standup Leader:', this.todaysStandupLeader);
    console.log('Next Refinement Leader:', this.nextRefinementLeader);
    console.log('Refinement Queue Length:', this.refinementQueueLength);
    
    // Get database data directly
    const dbTeamMembers = this.databaseService.getTeamMembers();
    const dbStandupSchedule = this.databaseService.getStandupSchedule();
    const dbRefinementQueue = this.databaseService.getRefinementQueue();
    const dbTodaysLeader = this.databaseService.getTodaysStandupLeader();
    const dbNextRefinementLeader = this.databaseService.getNextRefinementLeader();
    
    console.log('DB Team Members:', dbTeamMembers);
    console.log('DB Standup Schedule:', dbStandupSchedule);
    console.log('DB Refinement Queue:', dbRefinementQueue);
    console.log('DB Today\'s Leader:', dbTodaysLeader);
    console.log('DB Next Refinement Leader:', dbNextRefinementLeader);
    console.log('Today is day:', new Date().getDay(), '(' + this.getDayName(new Date().getDay()) + ')');
    console.log('=== END DEBUG ===');
  }
  getTodayName(): string {
    return this.getDayName(new Date().getDay());
  }

  getTodayDayNumber(): number {
    return new Date().getDay();
  }

  getDayName(dayOfWeek: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 
                  'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  }
}
