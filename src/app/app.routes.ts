import { Routes } from '@angular/router';
import { authGuard, adminGuard, professorGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },

  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'ies',
        loadComponent: () => import('./features/admin/ies/ies.component').then(m => m.IesComponent)
      },
      {
        path: 'escolas',
        loadComponent: () => import('./features/admin/escolas/escolas.component').then(m => m.EscolasComponent)
      },
      {
        path: 'professores',
        loadComponent: () => import('./features/admin/professores/professores.component').then(m => m.ProfessoresComponent)
      },
      {
        path: 'disciplinas',
        loadComponent: () => import('./features/admin/disciplinas/disciplinas.component').then(m => m.DisciplinasComponent)
      },
      {
        path: 'horarios',
        loadComponent: () => import('./features/admin/horarios/horarios.component').then(m => m.default)
      },
      {
        path: 'relatorios',
        loadComponent: () => import('./features/admin/relatorios/relatorios.component').then(m => m.RelatoriosComponent)
      },
    ]
  },

  {
    path: 'professor',
    canActivate: [authGuard, professorGuard],
    loadComponent: () => import('./features/professor/professor-layout.component').then(m => m.ProfessorLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/professor/dashboard/professor-dashboard.component').then(m => m.ProfessorDashboardComponent)
      },
      {
        path: 'disponibilidade',
        loadComponent: () => import('./features/professor/disponibilidade/disponibilidade.component').then(m => m.DisponibilidadeComponent)
      },
      {
        path: 'disciplinas-interesse',
        loadComponent: () => import('./features/professor/disciplinas-interesse/disciplinas-interesse.component').then(m => m.DisciplinasInteresseComponent)
      },
      {
        path: 'titulacoes',
        loadComponent: () => import('./features/professor/titulacoes/titulacoes.component').then(m => m.TitulacoesComponent)
      },
    ]
  },

  { path: '**', redirectTo: 'login' }
];
