import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DiaSemana,
  HorarioPeriodoRequest,
  HorarioPeriodoResponse,
  Turno
} from "src/app/shared/models/models";
import { HorarioPeriodoService } from "src/app/core/services/api.services";

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1>Horários / Períodos</h1>
      <button class="btn btn-primary" (click)="abrirModal()">+ Novo Horário</button>
    </div>

    <div class="card">

      <!-- LOADING -->
      <div *ngIf="carregando" style="text-align:center;padding:2rem">
        <div class="spinner" style="margin:0 auto"></div>
      </div>

      <!-- TABELA -->
      <div *ngIf="!carregando" class="table-container">
        <table>
          <thead>
            <tr>
              <th>Dia</th>
              <th>Turno</th>
              <th>Início</th>
              <th>Fim</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr *ngFor="let h of lista">
              <td>{{ labelDia(h.diaSemana) }}</td>

              <td>
                <span class="badge"
                      [class.badge-warning]="h.turno==='MANHA'"
                      [class.badge-info]="h.turno==='TARDE'"
                      [class.badge-purple]="h.turno==='NOITE'">
                  {{ labelTurno(h.turno) }}
                </span>
              </td>

              <td>{{ h.horaInicio }}</td>
              <td>{{ h.horaFim }}</td>

              <td>
                <span class="badge"
                      [class.badge-success]="h.ativo"
                      [class.badge-danger]="!h.ativo">
                  {{ h.ativo ? 'Ativo' : 'Inativo' }}
                </span>
              </td>

              <!-- TOGGLE STATUS -->
              <td>
                <button
                  class="btn btn-sm"
                  [class.btn-danger]="h.ativo"
                  [class.btn-success]="!h.ativo"
                  (click)="toggleStatus(h.id)">

                  {{ h.ativo ? 'Inativar' : 'Ativar' }}
                </button>
              </td>
            </tr>

            <tr *ngIf="lista.length === 0">
              <td colspan="6" style="text-align:center;color:var(--text-muted);padding:1.5rem">
                Nenhum horário cadastrado.
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL -->
    <div class="modal-overlay" *ngIf="modalAberto" (click)="fecharModal()">
      <div class="modal-box" (click)="$event.stopPropagation()">

        <div class="modal-header">
          <span class="modal-title">Novo Horário</span>
          <button class="btn btn-secondary btn-sm" (click)="fecharModal()">✕</button>
        </div>

        <div *ngIf="erro" class="alert alert-danger">{{ erro }}</div>

        <div class="form-row form-row-2">
          <div class="form-group">
            <label>Dia da semana *</label>
            <select class="form-control" [(ngModel)]="form.diaSemana">
              <option value="" disabled>Selecione...</option>
              <option *ngFor="let d of dias" [value]="d.valor">
                {{ d.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Turno *</label>
            <select class="form-control" [(ngModel)]="form.turno">
              <option value="" disabled>Selecione...</option>
              <option value="MANHA">Manhã</option>
              <option value="TARDE">Tarde</option>
              <option value="NOITE">Noite</option>
            </select>
          </div>
        </div>

        <div class="form-row form-row-2">
          <div class="form-group">
            <label>Hora início *</label>
            <input class="form-control" type="time" [(ngModel)]="form.horaInicio">
          </div>

          <div class="form-group">
            <label>Hora fim *</label>
            <input class="form-control" type="time" [(ngModel)]="form.horaFim">
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="fecharModal()">Cancelar</button>

          <button class="btn btn-primary"
                  (click)="salvar()"
                  [disabled]="salvando">

            {{ salvando ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>

      </div>
    </div>
  `
})
export default class HorariosComponent implements OnInit {

  lista: HorarioPeriodoResponse[] = [];
  carregando = true;

  modalAberto = false;

  form: HorarioPeriodoRequest = {
    diaSemana: 'SEG',
    turno: 'MANHA',
    horaInicio: '',
    horaFim: ''
  };

  erro = '';
  salvando = false;

  dias = [
    { valor: 'SEG', label: 'Segunda-feira' },
    { valor: 'TER', label: 'Terça-feira' },
    { valor: 'QUA', label: 'Quarta-feira' },
    { valor: 'QUI', label: 'Quinta-feira' },
    { valor: 'SEX', label: 'Sexta-feira' },
    { valor: 'SAB', label: 'Sábado' },
  ];

  constructor(private svc: HorarioPeriodoService) {}

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando = true;

    this.svc.listar().subscribe({
      next: d => {
        this.lista = d;
        this.carregando = false;
      },
      error: () => this.carregando = false
    });
  }

  abrirModal() {
    this.erro = '';
    this.form = {
      diaSemana: 'SEG',
      turno: 'MANHA',
      horaInicio: '',
      horaFim: ''
    };
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
  }

  salvar() {
    if (!this.form.horaInicio || !this.form.horaFim) {
      this.erro = 'Preencha os horários.';
      return;
    }

    this.salvando = true;

    this.svc.criar(this.form).subscribe({
      next: () => {
        this.salvando = false;
        this.fecharModal();
        this.carregar();
      },
      error: () => {
        this.salvando = false;
        this.erro = 'Erro ao salvar.';
      }
    });
  }

  // 🔥 TOGGLE STATUS (ATIVAR / INATIVAR)
  toggleStatus(id: number) {
    this.svc.toggleStatus(id).subscribe(() => this.carregar());
  }

  labelDia(d: DiaSemana): string {
    const map: Record<DiaSemana, string> = {
      SEG: 'Segunda',
      TER: 'Terça',
      QUA: 'Quarta',
      QUI: 'Quinta',
      SEX: 'Sexta',
      SAB: 'Sábado'
    };
    return map[d];
  }

  labelTurno(t: Turno): string {
    const map: Record<Turno, string> = {
      MANHA: 'Manhã',
      TARDE: 'Tarde',
      NOITE: 'Noite'
    };
    return map[t];
  }
}