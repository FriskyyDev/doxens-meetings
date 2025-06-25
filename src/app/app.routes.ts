import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/dashboard', 
    pathMatch: 'full' 
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  { 
    path: 'admin', 
    loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent)
  },
  // Redirect old routes to admin
  { 
    path: 'team', 
    redirectTo: '/admin', 
    pathMatch: 'full' 
  },
  { 
    path: 'refinements', 
    redirectTo: '/admin', 
    pathMatch: 'full' 
  },  
  { 
    path: 'standups', 
    redirectTo: '/admin', 
    pathMatch: 'full' 
  }
];
