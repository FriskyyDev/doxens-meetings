import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatabaseService } from '../../services/database.service';
import { TeamMember } from '../../models/models';

@Component({
  selector: 'app-team-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="team-dialog-container">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon class="dialog-icon">{{ data.member ? 'edit' : 'person_add' }}</mat-icon>
        {{ data.member ? 'Edit' : 'Add' }} Team Member
      </h2>
      
      <mat-dialog-content class="dialog-content">
        <form [formGroup]="form" class="form-container">
          <div class="custom-form-field">
            <label class="form-label">Name</label>
            <input 
              type="text" 
              formControlName="name" 
              class="custom-input"
              placeholder="Enter team member name..."
              [class.error]="form.get('name')?.invalid && form.get('name')?.touched">
            @if (form.get('name')?.invalid && form.get('name')?.touched) {
              <div class="error-message">
                <mat-icon class="error-icon">error</mat-icon>
                Name is required
              </div>
            }
          </div>
        </form>
      </mat-dialog-content>
      
      <mat-dialog-actions class="dialog-actions">
        <button mat-button (click)="cancel()" class="cancel-btn">
          <mat-icon>close</mat-icon>
          Cancel
        </button>
        <button mat-raised-button (click)="save()" [disabled]="form.invalid" class="save-btn">
          <mat-icon>{{ data.member ? 'save' : 'add' }}</mat-icon>
          {{ data.member ? 'Update' : 'Add' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,  styles: [`
    /* Team Dialog Custom Styling */
    .team-dialog-container {
      background: linear-gradient(135deg, rgba(17, 25, 40, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%);
      backdrop-filter: blur(20px) saturate(180%);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);      overflow: hidden;
      position: relative;
    }

    .team-dialog-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    }

    .dialog-title {
      color: white;
      padding: 20px 24px;
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .dialog-icon {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      padding: 8px;
      font-size: 1.5rem;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .dialog-content {
      padding: 24px;
      background: rgba(255, 255, 255, 0.02);
    }

    .form-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .custom-form-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-label {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .custom-input {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
      backdrop-filter: blur(8px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      padding: 12px 16px;
      color: white;
      font-size: 1rem;
      transition: all 0.3s ease;
      outline: none;
    }

    .custom-input:focus {
      border-color: rgba(59, 130, 246, 0.6);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
      transform: translateY(-1px);
    }

    .custom-input:hover {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%);
      border-color: rgba(59, 130, 246, 0.4);
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
    }

    .custom-input.error {
      border-color: rgba(239, 68, 68, 0.6);
      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #ef4444;
      font-size: 0.875rem;
      font-weight: 500;
      margin-top: 6px;
    }

    .error-icon {
      font-size: 1rem;
      width: 16px;
      height: 16px;
    }

    .dialog-actions {
      padding: 16px 24px;
      background: rgba(255, 255, 255, 0.05);
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .cancel-btn {
      background: transparent !important;
      color: rgba(255, 255, 255, 0.7) !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      border-radius: 8px !important;
      padding: 8px 16px !important;
      font-weight: 500 !important;
      transition: all 0.2s ease !important;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .cancel-btn:hover {
      background: rgba(255, 255, 255, 0.1) !important;
      color: white !important;
      border-color: rgba(255, 255, 255, 0.3) !important;
    }

    .save-btn {
      background: rgba(34, 197, 94, 0.2) !important;
      border: 1px solid rgba(34, 197, 94, 0.3) !important;
      color: #86efac !important;
      border-radius: 8px !important;
      padding: 8px 16px !important;
      font-weight: 600 !important;
      transition: all 0.2s ease !important;
      box-shadow: 0 4px 15px rgba(34, 197, 94, 0.2) !important;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .save-btn:hover:not(:disabled) {
      background: rgba(34, 197, 94, 0.3) !important;
      border-color: rgba(34, 197, 94, 0.5) !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 6px 20px rgba(34, 197, 94, 0.3) !important;
    }

    .save-btn:disabled {
      background: rgba(71, 85, 105, 0.2) !important;
      border-color: rgba(71, 85, 105, 0.3) !important;
      color: #64748b !important;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }

    /* Override Material Dialog Styles */
    ::ng-deep .mat-mdc-dialog-container {
      background: transparent !important;
      box-shadow: none !important;
    }

    ::ng-deep .mat-mdc-dialog-surface {
      background: transparent !important;
      box-shadow: none !important;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .animated-container {
        padding: 16px;
      }
      
      .glassmorphism-card {
        padding: 20px;
      }
      
      .modern-table {
        font-size: 0.875rem;
      }
      
      .table-header,
      .table-cell {
        padding: 12px 8px;
      }
    }

    /* Dark theme specific adjustments */
    ::ng-deep .mat-mdc-card {
      background: transparent !important;
    }

    ::ng-deep .mat-mdc-table {
      background: transparent !important;
    }

    ::ng-deep .mat-mdc-header-row {
      background: transparent !important;
    }

    ::ng-deep .mat-mdc-row {
      background: transparent !important;
    }
  `]
})
export class TeamDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TeamDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { member?: TeamMember }
  ) {
    this.form = this.fb.group({
      name: [data.member?.name || '', Validators.required]
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    FormsModule
  ],  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Team Management</h1>
        <button mat-raised-button (click)="openDialog()" class="refresh-btn">
          <mat-icon>person_add</mat-icon>
          Add Member
        </button>
      </div>

      <div class="cards-grid">
        <!-- Team Members Card -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <mat-icon>group</mat-icon>
              <h2>Team Members</h2>
            </div>
            <div class="member-count">{{ teamMembers.length }} {{ teamMembers.length === 1 ? 'Member' : 'Members' }}</div>
          </div>
          <div class="card-content">
            @if (teamMembers.length > 0) {
              <div class="members-list">
                @for (member of teamMembers; track member.id) {
                  <div class="member-item">
                    <div class="member-info">
                      <div class="member-avatar">{{ member.name.charAt(0).toUpperCase() }}</div>
                      <div class="member-details">
                        <div class="member-name">{{ member.name }}</div>
                        <div class="member-status">Active</div>
                      </div>
                    </div>
                    <div class="member-actions">
                      <button mat-icon-button (click)="editMember(member)" class="action-btn edit-btn" matTooltip="Edit member">
                        <mat-icon>edit</mat-icon>
                      </button>                      <button mat-icon-button (click)="deleteMember(member.id!)" class="action-btn delete-btn" matTooltip="Delete member">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="empty-state">
                <mat-icon class="empty-icon">group</mat-icon>
                <div class="empty-title">No team members yet</div>
                <div class="empty-subtitle">Add your first team member to get started!</div>
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

    .member-count {
      background: rgba(59, 130, 246, 0.2);
      color: #93c5fd;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 500;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .members-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .member-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      background: rgba(30, 41, 59, 0.2);
      border: 1px solid rgba(71, 85, 105, 0.2);
      border-radius: 12px;
      transition: all 0.2s ease;
    }

    .member-item:hover {
      background: rgba(30, 41, 59, 0.3);
      border-color: rgba(71, 85, 105, 0.4);
      transform: translateY(-1px);
    }

    .member-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .member-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(147, 197, 253, 0.8));
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 1rem;
    }

    .member-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .member-name {
      font-size: 1rem;
      font-weight: 500;
      color: #f8fafc;
    }

    .member-status {
      font-size: 0.875rem;
      color: #34d399;
      font-weight: 500;
    }

    .member-actions {
      display: flex;
      gap: 8px;
    }

    .action-btn {
      background: rgba(71, 85, 105, 0.2) !important;
      border: 1px solid rgba(71, 85, 105, 0.3) !important;
      color: #94a3b8 !important;
      transition: all 0.2s ease !important;
    }

    .action-btn:hover {
      transform: translateY(-1px) !important;
    }

    .edit-btn:hover {
      background: rgba(59, 130, 246, 0.2) !important;
      border-color: rgba(59, 130, 246, 0.4) !important;
      color: #93c5fd !important;
    }

    .delete-btn:hover {
      background: rgba(239, 68, 68, 0.2) !important;
      border-color: rgba(239, 68, 68, 0.4) !important;
      color: #fca5a5 !important;
    }

    .empty-state {
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
    }    .empty-subtitle {
      color: #94a3b8;
      font-size: 0.875rem;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .animated-container {
        padding: 16px;
      }
      
      .glassmorphism-card {
        padding: 20px;
      }
      
      .modern-table {
        font-size: 0.875rem;
      }
      
      .table-header,
      .table-cell {
        padding: 12px 8px;
      }
    }

    /* Dark theme specific adjustments */
    ::ng-deep .mat-mdc-card {
      background: transparent !important;
    }

    ::ng-deep .mat-mdc-table {
      background: transparent !important;
    }

    ::ng-deep .mat-mdc-header-row {
      background: transparent !important;
    }

    ::ng-deep .mat-mdc-row {
      background: transparent !important;
    }
  `]
})
export class TeamComponent implements OnInit {
  teamMembers: TeamMember[] = [];
  displayedColumns: string[] = ['name', 'role', 'actions'];
  constructor(
    private databaseService: DatabaseService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadTeamMembers();
  }

  loadTeamMembers() {
    this.teamMembers = this.databaseService.getTeamMembers();
  }
  openDialog(member?: TeamMember) {
    const dialogRef = this.dialog.open(TeamDialogComponent, {
      width: '450px',
      maxWidth: '90vw',
      data: { member },
      disableClose: false,
      hasBackdrop: true,
      backdropClass: 'team-dialog-backdrop',
      panelClass: 'team-dialog-panel',
      autoFocus: true,
      restoreFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (member && member.id) {
          this.updateMember(member, result);
        } else {
          this.addMember(result);
        }
      }
    });
  }
  addMember(memberData: { name: string }) {
    const newMember = {
      name: memberData.name,
      active: true
    };
    
    this.databaseService.addTeamMember(newMember);
    this.loadTeamMembers();
  }

  editMember(member: TeamMember) {
    this.openDialog(member);
  }

  updateMember(member: TeamMember, memberData: { name: string }) {
    const updatedMember: TeamMember = {
      ...member,
      name: memberData.name
    };
    this.databaseService.updateTeamMember(updatedMember);
    this.loadTeamMembers();
  }

  deleteMember(id: number) {
    if (confirm('Are you sure you want to delete this team member?')) {
      this.databaseService.deleteTeamMember(id);
      this.loadTeamMembers();
    }
  }
}
