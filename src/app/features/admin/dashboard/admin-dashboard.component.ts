import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import {DisciplinaService, EscolaService, IesService, ProfessorService} from "../../../core/services/api.services";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header" style="display:flex; justify-content:space-between; align-items:center;">
      <h1>Dashboard</h1>
      <button class="btn btn-secondary" (click)="sair()">Sair</button>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Professores ativos</div>
        <div class="stat-value">{{ professoresAtivos }}</div>
        <div class="stat-sub">de {{ totalProfessores }} cadastrados</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Escolas</div>
        <div class="stat-value">{{ totalEscolas }}</div>
        <div class="stat-sub">{{ escolasAtivas }} ativas</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Disciplinas</div>
        <div class="stat-value">{{ totalDisciplinas }}</div>
        <div class="stat-sub">{{ disciplinasAtivas }} ativas</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">IES cadastradas</div>
        <div class="stat-value">{{ totalIes }}</div>
      </div>
    </div>
    <div class="card" *ngIf="carregando" style="text-align:center;padding:2rem">
      <div class="spinner" style="margin:0 auto"></div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  carregando = true;
  totalProfessores = 0; professoresAtivos = 0;
  totalEscolas = 0;     escolasAtivas = 0;
  totalDisciplinas = 0; disciplinasAtivas = 0;
  totalIes = 0;

  constructor(
      private professorSvc: ProfessorService,
      private escolaSvc: EscolaService,
      private disciplinaSvc: DisciplinaService,
      private iesSvc: IesService,
      private router: Router // ✅ adicionado
  ) {}

  sair() {
    localStorage.removeItem('token'); // ✅ limpa o JWT
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    forkJoin({
      professores: this.professorSvc.listar(),
      escolas: this.escolaSvc.listar(),
      disciplinas: this.disciplinaSvc.listar(),
      ies: this.iesSvc.listar()
    }).subscribe({
      next: d => {
        this.totalProfessores = d.professores.length;
        this.professoresAtivos = d.professores.filter((p: { ativo: any; }) => p.ativo).length;
        this.totalEscolas = d.escolas.length;
        this.escolasAtivas = d.escolas.filter((e: { ativo: any; }) => e.ativo).length;
        this.totalDisciplinas = d.disciplinas.length;
        this.disciplinasAtivas = d.disciplinas.filter((d: { ativo: any; }) => d.ativo).length;
        this.totalIes = d.ies.length;
        this.carregando = false;
      },
      error: () => this.carregando = false
    });
  }
}