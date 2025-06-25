import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { TeamComponent } from '../team/team.component';
import { RefinementsComponent } from '../refinements/refinements.component';
import { StandupsComponent } from '../standups/standups.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    TeamComponent,
    RefinementsComponent,
    StandupsComponent
  ],
  template: `
    <div class="admin-container">
      @if (!isAuthenticated) {
        <!-- Password Protection Screen -->
        <div class="auth-container">
          <div class="auth-card">
            <div class="auth-header">
              <mat-icon class="auth-icon">admin_panel_settings</mat-icon>
              <h1>Admin Access Required</h1>
              <p>Please enter the admin password to continue</p>
            </div>
            
            <div class="auth-form">
              <div class="password-field">
                <label class="form-label">Password</label>
                <input 
                  type="password" 
                  [(ngModel)]="password" 
                  (keyup.enter)="authenticate()"
                  class="password-input"
                  [class.error]="authError"
                  placeholder="Enter admin password..."
                  autocomplete="current-password">
                @if (authError) {
                  <div class="error-message">
                    <mat-icon class="error-icon">error</mat-icon>
                    Incorrect password. Please try again.
                  </div>
                }
              </div>
              
              <div class="auth-actions">
                <button mat-raised-button (click)="authenticate()" class="auth-btn">
                  <mat-icon>login</mat-icon>
                  Access Admin Panel
                </button>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <!-- Admin Dashboard with Tabs -->
        <div class="dashboard-container">
          <div class="dashboard-header">
            <div class="header-content">
              <div class="title-section">
                <mat-icon class="header-icon">admin_panel_settings</mat-icon>
                <h1>Admin Dashboard</h1>
              </div>
              <button mat-button (click)="logout()" class="logout-btn">
                <mat-icon>logout</mat-icon>
                Logout
              </button>
            </div>
          </div>

          <mat-tab-group class="admin-tabs" [(selectedIndex)]="selectedTabIndex">
            <mat-tab label="Team Management">
              <ng-template matTabContent>
                <div class="tab-content">
                  <app-team></app-team>
                </div>
              </ng-template>
            </mat-tab>
            
            <mat-tab label="Refinements">
              <ng-template matTabContent>
                <div class="tab-content">
                  <app-refinements></app-refinements>
                </div>
              </ng-template>
            </mat-tab>
            
            <mat-tab label="Stand-ups">
              <ng-template matTabContent>
                <div class="tab-content">
                  <app-standups></app-standups>
                </div>
              </ng-template>
            </mat-tab>
          </mat-tab-group>
        </div>
      }
    </div>
  `,
  styles: [`
    .admin-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
    }

    /* Authentication Screen Styles */
    .auth-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }

    .auth-card {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 20, 30, 0.9));
      backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(71, 85, 105, 0.3);
      border-radius: 20px;
      padding: 40px;
      max-width: 450px;
      width: 100%;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
      position: relative;
      overflow: hidden;
    }

    .auth-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
      animation: shimmer 3s infinite;
    }

    @keyframes shimmer {
      0% { left: -100%; }
      100% { left: 100%; }
    }

    .auth-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .auth-icon {
      font-size: 4rem;
      color: #3b82f6;
      margin-bottom: 16px;
      background: rgba(59, 130, 246, 0.1);
      border-radius: 50%;
      padding: 20px;
      border: 2px solid rgba(59, 130, 246, 0.3);
    }

    .auth-header h1 {
      margin: 0 0 8px 0;
      font-size: 1.75rem;
      font-weight: 600;
      color: #f8fafc;
    }

    .auth-header p {
      margin: 0;
      color: #94a3b8;
      font-size: 1rem;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .password-field {
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

    .password-input {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
      backdrop-filter: blur(8px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      padding: 14px 16px;
      color: white;
      font-size: 1rem;
      transition: all 0.3s ease;
      outline: none;
      width: 100%;
      box-sizing: border-box;
    }

    .password-input:focus {
      border-color: rgba(59, 130, 246, 0.6);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
      transform: translateY(-1px);
    }

    .password-input:hover {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%);
      border-color: rgba(59, 130, 246, 0.4);
    }

    .password-input.error {
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

    .auth-actions {
      display: flex;
      justify-content: center;
    }

    .auth-btn {
      background: rgba(59, 130, 246, 0.2) !important;
      border: 1px solid rgba(59, 130, 246, 0.3) !important;
      color: #93c5fd !important;
      border-radius: 12px !important;
      padding: 12px 24px !important;
      font-weight: 600 !important;
      transition: all 0.3s ease !important;
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2) !important;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1rem !important;
    }

    .auth-btn:hover {
      background: rgba(59, 130, 246, 0.3) !important;
      border-color: rgba(59, 130, 246, 0.5) !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3) !important;
    }

    /* Admin Dashboard Styles */
    .dashboard-container {
      padding: 0;
      min-height: 100vh;
    }

    .dashboard-header {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 20, 30, 0.95));
      backdrop-filter: blur(20px) saturate(180%);
      border-bottom: 1px solid rgba(71, 85, 105, 0.3);
      padding: 20px 24px;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }

    .title-section {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header-icon {
      font-size: 2rem;
      color: #3b82f6;
      background: rgba(59, 130, 246, 0.1);
      border-radius: 12px;
      padding: 8px;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .dashboard-header h1 {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 600;
      color: #f8fafc;
    }

    .logout-btn {
      background: rgba(239, 68, 68, 0.1) !important;
      border: 1px solid rgba(239, 68, 68, 0.3) !important;
      color: #fca5a5 !important;
      border-radius: 8px !important;
      padding: 8px 16px !important;
      transition: all 0.2s ease !important;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .logout-btn:hover {
      background: rgba(239, 68, 68, 0.2) !important;
      border-color: rgba(239, 68, 68, 0.5) !important;
      transform: translateY(-1px) !important;
    }

    /* Tab Styles */
    .admin-tabs {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px 24px;
    }

    ::ng-deep .admin-tabs .mat-mdc-tab-group {
      background: transparent;
    }

    ::ng-deep .admin-tabs .mat-mdc-tab-header {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.3), rgba(15, 20, 30, 0.3));
      backdrop-filter: blur(10px);
      border-radius: 12px 12px 0 0;
      border: 1px solid rgba(71, 85, 105, 0.3);
      border-bottom: none;
      margin-top: 24px;
    }

    ::ng-deep .admin-tabs .mat-mdc-tab {
      color: #94a3b8 !important;
      font-weight: 500 !important;
      min-width: 160px !important;
      height: 48px !important;
    }

    ::ng-deep .admin-tabs .mat-mdc-tab.mdc-tab--active {
      color: #3b82f6 !important;
    }

    ::ng-deep .admin-tabs .mat-mdc-tab:hover {
      background: rgba(59, 130, 246, 0.1) !important;
    }

    ::ng-deep .admin-tabs .mdc-tab-indicator__content--underline {
      background-color: #3b82f6 !important;
      height: 3px !important;
      border-radius: 2px !important;
    }

    ::ng-deep .admin-tabs .mat-mdc-tab-body-wrapper {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.3), rgba(15, 20, 30, 0.3));
      backdrop-filter: blur(10px);
      border: 1px solid rgba(71, 85, 105, 0.3);
      border-top: none;
      border-radius: 0 0 12px 12px;
      min-height: 600px;
    }

    .tab-content {
      padding: 0;
    }

    /* Override child component containers */
    ::ng-deep .tab-content .dashboard-container {
      background: transparent !important;
      padding: 24px !important;
      min-height: auto !important;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .auth-card {
        padding: 32px 24px;
        margin: 20px;
      }

      .header-content {
        padding: 0 16px;
      }

      .dashboard-header h1 {
        font-size: 1.5rem;
      }

      .admin-tabs {
        padding: 0 16px 16px;
      }

      ::ng-deep .admin-tabs .mat-mdc-tab {
        min-width: 120px !important;
        font-size: 0.875rem !important;
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  isAuthenticated = false;
  password = '';
  authError = false;
  selectedTabIndex = 0;
  private readonly ADMIN_PASSWORD = 'Corgi2025';
  private readonly AUTH_KEY = 'admin_authenticated';

  ngOnInit() {
    // Check if user was previously authenticated in this session
    this.isAuthenticated = sessionStorage.getItem(this.AUTH_KEY) === 'true';
  }

  authenticate() {
    if (this.password === this.ADMIN_PASSWORD) {
      this.isAuthenticated = true;
      this.authError = false;
      this.password = '';
      // Store authentication state in session storage (cleared when browser is closed)
      sessionStorage.setItem(this.AUTH_KEY, 'true');
    } else {
      this.authError = true;
      this.password = '';
      // Clear any existing authentication
      sessionStorage.removeItem(this.AUTH_KEY);
    }
  }

  logout() {
    this.isAuthenticated = false;
    this.selectedTabIndex = 0;
    sessionStorage.removeItem(this.AUTH_KEY);
  }
}
