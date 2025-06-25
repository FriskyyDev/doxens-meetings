import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { DatabaseService } from '../../services/database.service';
import { TeamMember } from '../../models/models';

@Component({
  selector: 'app-refinements',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatCardModule, MatButtonModule, MatIconModule, MatListModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Refinement Rotations</h1>
        <button mat-raised-button (click)="saveQueue()" class="refresh-btn">
          <mat-icon>save</mat-icon>
          Save Queue
        </button>
      </div>

      <div class="cards-grid">
        <!-- Current Leader Card -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <mat-icon>trending_up</mat-icon>
              <h2>Next Refinement Leader</h2>
            </div>
          </div>
          <div class="card-content">
            @if (nextLeader) {
              <div class="leader-display">
                <div class="leader-name">{{ nextLeader.name }}</div>
                <div class="leader-role">Next up for refinement</div>
                <button mat-raised-button class="action-btn" (click)="markCompleted()">
                  <mat-icon>check</mat-icon>
                  Mark as Completed
                </button>
              </div>
            } @else {
              <div class="no-leader">
                <mat-icon class="warning-icon">warning</mat-icon>
                <div class="warning-text">No leader in queue</div>
              </div>
            }
          </div>
        </div>

        <!-- Queue Management Card -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <mat-icon>list</mat-icon>
              <h2>Refinement Queue</h2>
            </div>
          </div>
          <div class="card-content">
            <div class="queue-stats">
              <div class="stat">
                <div class="stat-number">{{ refinementQueue.length }}</div>
                <div class="stat-label">In Queue</div>
              </div>
              <div class="stat">
                <div class="stat-number">{{ availableMembers.length }}</div>
                <div class="stat-label">Available</div>
              </div>
            </div>
            <div class="queue-actions">
              <button mat-raised-button class="action-btn secondary" (click)="addAllToQueue()">
                <mat-icon>add</mat-icon>
                Add All to Queue
              </button>
              <button mat-raised-button class="action-btn danger" (click)="clearQueue()">
                <mat-icon>clear_all</mat-icon>
                Clear Queue
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Queue Management Section -->
      <div class="queue-section">
        @if (refinementQueue.length > 0) {
          <div class="queue-header">
            <h3>Refinement Queue</h3>
            <div class="queue-info">Drag to reorder</div>
          </div>
          <div 
            cdkDropList 
            class="queue-container"
            (cdkDropListDropped)="drop($event)">
            @for (item of refinementQueue; track item.id) {
              <div class="queue-item" 
                   cdkDrag 
                   [class.next-up]="$index === 0">
                <div class="queue-position">{{ $index + 1 }}</div>
                <div class="queue-member">{{ item.memberName }}</div>
                @if ($index === 0) {
                  <div class="next-badge">NEXT UP</div>
                }
                <mat-icon cdkDragHandle class="drag-handle">drag_handle</mat-icon>
              </div>
            }
          </div>
        } @else {
          <div class="empty-queue">
            <mat-icon class="empty-icon">schedule</mat-icon>
            <div class="empty-title">No refinement queue set up yet</div>
            <div class="empty-subtitle">Add team members to the queue to get started</div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
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

    .queue-stats {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;
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

    .queue-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .action-btn {
      background: rgba(34, 197, 94, 0.2) !important;
      border: 1px solid rgba(34, 197, 94, 0.3) !important;
      color: #86efac !important;
      transition: all 0.2s ease !important;
    }

    .action-btn:hover {
      background: rgba(34, 197, 94, 0.3) !important;
      border-color: rgba(34, 197, 94, 0.5) !important;
      transform: translateY(-1px) !important;
    }

    .action-btn.secondary {
      background: rgba(59, 130, 246, 0.2) !important;
      border-color: rgba(59, 130, 246, 0.3) !important;
      color: #93c5fd !important;
    }

    .action-btn.secondary:hover {
      background: rgba(59, 130, 246, 0.3) !important;
      border-color: rgba(59, 130, 246, 0.5) !important;
    }

    .action-btn.danger {
      background: rgba(239, 68, 68, 0.2) !important;
      border-color: rgba(239, 68, 68, 0.3) !important;
      color: #fca5a5 !important;
    }

    .action-btn.danger:hover {
      background: rgba(239, 68, 68, 0.3) !important;
      border-color: rgba(239, 68, 68, 0.5) !important;
    }

    .action-btn mat-icon {
      margin-right: 8px;
    }

    .queue-section {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.3), rgba(15, 20, 30, 0.3));
      border: 1px solid rgba(71, 85, 105, 0.3);
      border-radius: 16px;
      padding: 24px;
      backdrop-filter: blur(10px);
    }

    .queue-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .queue-header h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 500;
      color: #e2e8f0;
    }

    .queue-info {
      color: #94a3b8;
      font-size: 0.875rem;
    }

    .queue-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .queue-item {
      display: flex;
      align-items: center;
      padding: 16px;
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid rgba(71, 85, 105, 0.3);
      border-radius: 12px;
      transition: all 0.2s ease;
      cursor: move;
    }

    .queue-item:hover {
      background: rgba(30, 41, 59, 0.5);
      border-color: rgba(71, 85, 105, 0.5);
      transform: translateY(-1px);
    }

    .queue-item.next-up {
      border-color: rgba(34, 197, 94, 0.5);
      background: rgba(34, 197, 94, 0.1);
    }

    .queue-position {
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
      margin-right: 16px;
    }

    .queue-member {
      flex: 1;
      color: #f8fafc;
      font-weight: 500;
      font-size: 1rem;
    }

    .next-badge {
      background: rgba(34, 197, 94, 0.8);
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      margin-right: 16px;
    }

    .drag-handle {
      color: #64748b;
      cursor: grab;
      transition: color 0.2s ease;
    }

    .drag-handle:hover {
      color: #93c5fd;
    }

    .empty-queue {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 20px;
      text-align: center;
    }

    .empty-icon {
      font-size: 4rem;
      color: #64748b;
      margin-bottom: 16px;
    }

    .empty-title {
      font-size: 1.25rem;
      font-weight: 500;
      color: #e2e8f0;
      margin-bottom: 8px;
    }

    .empty-subtitle {
      color: #94a3b8;
      font-size: 0.875rem;
    }
  `]
})
export class RefinementsComponent implements OnInit {
  teamMembers: TeamMember[] = [];
  refinementQueue: any[] = [];
  nextLeader: TeamMember | null = null;
  availableMembers: TeamMember[] = [];

  constructor(private databaseService: DatabaseService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.teamMembers = this.databaseService.getTeamMembers();
    this.refinementQueue = this.databaseService.getRefinementQueue();
    this.nextLeader = this.databaseService.getNextRefinementLeader();
    
    // Calculate available members (not in queue)
    const queueMemberIds = this.refinementQueue.map(q => q.teamMemberId);
    this.availableMembers = this.teamMembers.filter(member => 
      !queueMemberIds.includes(member.id)
    );
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.refinementQueue, event.previousIndex, event.currentIndex);
      this.saveQueue();
    }
  }

  addMemberToQueue(member: TeamMember) {
    if (member.id) {
      // Add to the end of the current queue
      const newQueueOrder = [...this.refinementQueue.map(q => q.teamMemberId), member.id];
      this.databaseService.setRefinementQueue(newQueueOrder);
      this.loadData();
    }
  }

  addAllToQueue() {
    if (this.availableMembers.length > 0) {
      const currentQueueIds = this.refinementQueue.map(q => q.teamMemberId);
      const allMemberIds = [...currentQueueIds, ...this.availableMembers.map(m => m.id!)];
      this.databaseService.setRefinementQueue(allMemberIds);
      this.loadData();
    }
  }

  clearQueue() {
    if (confirm('Are you sure you want to clear the entire refinement queue?')) {
      this.databaseService.setRefinementQueue([]);
      this.loadData();
    }
  }

  saveQueue() {
    const queueOrder = this.refinementQueue.map(q => q.teamMemberId);
    this.databaseService.setRefinementQueue(queueOrder);
    this.loadData();
  }

  markCompleted() {
    if (this.nextLeader?.id) {
      this.databaseService.markRefinementCompleted(this.nextLeader.id);
      this.loadData();
    }
  }
}
