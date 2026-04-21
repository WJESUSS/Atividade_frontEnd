import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from "../../../core/services/auth.service";
import {
  DisciplinaInteresseService,
  DisponibilidadeService,
  TitulacaoService
} from "../../../core/services/api.services";

@Component({
  selector: 'app-professor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-header" style="display:flex; justify-content:space-between; align-items:center;">
      <h1>Olá, {{ primeiroNome }}!</h1>
      <button class="btn btn-secondary" (click)="sair()">Sair</button>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Horários cadastrados</div>
        <div class="stat-value">{{ totalDisponibilidade }}</div>
        <div class="stat-sub">
          <a routerLink="/professor/disponibilidade">Gerenciar</a>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Disciplinas de interesse</div>
        <div class="stat-value">{{ totalInteresse }}</div>
        <div class="stat-sub">
          <a routerLink="/professor/disciplinas-interesse">Gerenciar</a>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Titulações</div>
        <div class="stat-value">{{ totalTitulacoes }}</div>
        <div class="stat-sub">
          <a routerLink="/professor/titulacoes">Gerenciar</a>
        </div>
      </div>
    </div>
    <div class="card" *ngIf="carregando" style="text-align:center;padding:2rem">
      <div class="spinner" style="margin:0 auto"></div>
    </div>
  `
})
export class ProfessorDashboardComponent implements OnInit {
  carregando = true;
  totalDisponibilidade = 0;
  totalInteresse = 0;
  totalTitulacoes = 0;

  constructor(
      public auth: AuthService,
      private dispSvc: DisponibilidadeService,
      private intSvc: DisciplinaInteresseService,
      private titSvc: TitulacaoService,
      private router: Router // ✅ adicionado
  ) {}

  get primeiroNome(): string {
    return this.auth.usuario?.nome?.split(' ')[0] ?? 'Professor';
  }

  sair() {
    localStorage.removeItem('token'); // ✅ limpa o JWT
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    forkJoin({
      disp: this.dispSvc.listar(),
      int: this.intSvc.listar(),
      tit: this.titSvc.listar()
    }).subscribe({
      next: (d) => {
        this.totalDisponibilidade = d.disp?.length ?? 0;
        this.totalInteresse = d.int?.length ?? 0;
        this.totalTitulacoes = d.tit?.length ?? 0;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
      }
    });
  }
}