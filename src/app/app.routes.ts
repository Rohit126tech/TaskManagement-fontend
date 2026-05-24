import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { AccessDeniedPageComponent } from './features/access-denied-page/access-denied-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',

        loadComponent: () =>
          import('./features/login/loginform/loginform.component').then(
            (m) => m.LoginformComponent,
          ),
      },
      {
        path: 'signup',

        loadComponent: () =>
          import('./features/login/signup/signup.component').then(
            (m) => m.SignupComponent,
          ),
      },
    ],
  },
  { path: '', component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'taskview',

        loadComponent: () =>
          import('./features/home/taskview/taskview.component').then(
            (m) => m.TaskviewComponent,
          ),
      },
    {
        path: 'adminpanel',

        loadComponent: () =>
          import('./features/home/admin-panel/admin-panel.component').then(
            (m) => m.AdminPanelComponent,
          ),
      },]
      
   },
   { path:'**',component:AccessDeniedPageComponent}
];
