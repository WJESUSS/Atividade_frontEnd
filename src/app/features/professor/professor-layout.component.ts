import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: 'app-professor-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-wrapper">
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>UCSAL</h2>
          <p>Área do Professor</p>
        </div>

        <nav class="sidebar-nav">
          <span class="nav-section">Meu Espaço</span>

          <a routerLink="/professor/dashboard" routerLinkActive="active">
            ■ Dashboard
          </a>

          <a routerLink="/professor/disponibilidade" routerLinkActive="active">
            ● Minha Disponibilidade
          </a>

          <a routerLink="/professor/disciplinas-interesse" routerLinkActive="active">
            ● Disciplinas de Interesse
          </a>

          <a routerLink="/professor/titulacoes" routerLinkActive="active">
            ● Minhas Titulações
          </a>
        </nav>

        <div class="sidebar-footer">
          <button 
            class="btn btn-secondary" 
            style="width:100%; justify-content:center"
            (click)="logout()">
            Sair
          </button>
        </div>
      </aside>

      <div class="main-content">
        <header class="topbar">
          <span class="topbar-title">
            Sistema de Disponibilidade Docente
          </span>

          <div class="topbar-user">
            <div class="avatar">{{ iniciais }}</div>
            <span>{{ auth.usuario?.nome || 'Usuário' }}</span>
          </div>
        </header>

        <main class="content-area">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class ProfessorLayoutComponent {

  constructor(public auth: AuthService) {}

  get iniciais(): string {
    const nome = this.auth.usuario?.nome ?? '';

    if (!nome.trim()) return '??';

    return nome
        .split(' ')
        .filter(n => n.length > 0)
        .slice(0, 2)
        .map(n => n[0])
        .join('')
        .toUpperCase();
  }

  logout() {
    this.auth.logout();
  }
}