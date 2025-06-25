import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],  template: `
    <div class="min-h-screen bg-primary-dark text-white">
      <nav class="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex justify-between items-center shadow-lg border-b border-gray-700">        
        <div class="flex items-center gap-3">
          <img src="/Doxens.png" alt="Doxens Logo" class="h-24 w-24 object-contain">
          <h1 class="text-xl font-medium text-white tracking-wide">{{ title }}</h1>
        </div>
        <div class="flex gap-6">
          <a routerLink="/dashboard" routerLinkActive="active-link" class="nav-link">Dashboard</a>
          <a routerLink="/admin" routerLinkActive="active-link" class="nav-link">Admin</a>
        </div>
      </nav>
        <div class="max-w-7xl mx-auto p-6">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,  styles: [`
    /* Navigation styles */
    .nav-link {
      @apply text-gray-300 hover:text-white transition-colors duration-200 font-medium;
    }
    
    .active-link {
      @apply text-white border-b-2 border-blue-400;
    }

    /* Mobile responsive styles */
    @media (max-width: 768px) {
      nav {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }

      .nav-title {
        font-size: 1.125rem;
      }

      .nav-links {
        gap: 1rem;
        flex-wrap: wrap;
      }

      .content {
        padding: 1rem;
      }
        /* Logo adjustments for mobile */
      .flex.items-center.gap-3 img {
        height: 2.5rem;
        width: 2.5rem;
      }
      
      .flex.items-center.gap-3 h1 {
        font-size: 1rem;
      }
    }
  `]
})
export class AppComponent {
  title = "Doxens Meeting Planner";
}
