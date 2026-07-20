import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'voting',
    loadComponent: () => import('./features/public-voting/vote-screen/vote-screen').then(m => m.VoteScreen),
    title: 'Votación | El Día del Rey'
  },
  {
    path: 'jurado/login',
    loadComponent: () => import('./features/jury-portal/login/login').then(m => m.Login),
    title: 'Login Jurado'
  },
  {
    path: 'resultados',
    loadComponent: () => import('./features/results/results-display/results-display').then(m => m.ResultsDisplay),
    title: 'Resultados Finales'
  },
  {
    path: '', // Ruta por defecto
    redirectTo: 'voting',
    pathMatch: 'full'
  }
];