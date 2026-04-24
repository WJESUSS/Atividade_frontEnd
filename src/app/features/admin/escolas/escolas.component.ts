import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {EscolaRequest, EscolaResponse, IesResponse} from "../../../shared/models/models";
import {EscolaService, IesService} from "src/app/core/services/api.services";


@Component({
  selector: 'app-escolas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1>Escolas</h1>
      <button class="btn btn-primary" (click)="abrirModal()">+ Nova Escola</button>
    </div>

    <div class="card">
      <div *ngIf="carregando" style="text-align:center;padding:2rem"><div class="spinner" style="margin:0 auto"></div></div>
      <div *ngIf="!carregando" class="table-container">
        <table>
          <thead><tr><th>Nome</th><th>Coordenador</th><th>IES</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            <tr *ngFor="let e of lista">
              <td>{{ e.nome }}</td>
              <td>{{ e.nomeCoordenador }}</td>
              <td>{{ e.nomeIes }}</td>
              <td><span class="badge" [class.badge-success]="e.ativo" [class.badge-danger]="!e.ativo">{{ e.ativo ? 'Ativa' : 'Inativa' }}</span></td>
              <td style="display:flex;gap:6px">
                <button class="btn btn-secondary btn-sm" (click)="abrirModal(e)">Editar</button>
                <button class="btn btn-sm" [class.btn-danger]="e.ativo" [class.btn-accent]="!e.ativo" (click)="toggleStatus(e)">{{ e.ativo ? 'Inativar' : 'Ativar' }}</button>
                <button class="btn btn-danger btn-sm" (click)="excluir(e.id)">Excluir</button>
              </td>
            </tr>
            <tr *ngIf="lista.length === 0"><td colspan="5" style="text-align:center;color:var(--text-muted);padding:1.5rem">Nenhuma escola cadastrada.</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal-overlay" *ngIf="modalAberto" (click)="fecharModal()">
      <div class="modal-box" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <span class="modal-title">{{ editandoId ? 'Editar' : 'Nova' }} Escola</span>
          <button class="btn btn-secondary btn-sm" (click)="fecharModal()">✕</button>
        </div>
        <div *ngIf="erro" class="alert alert-danger">{{ erro }}</div>
        <div class="form-group">
          <label class="form-label">Nome *</label>
          <input class="form-control" [(ngModel)]="form.nome">
        </div>
        <div class="form-group">
          <label class="form-label">Coordenador *</label>
          <input class="form-control" [(ngModel)]="form.nomeCoordenador">
        </div>
        <div class="form-group">
          <label class="form-label">IES *</label>
          <select class="form-control" [(ngModel)]="form.iesId">
            <option [value]="0" disabled>Selecione...</option>
            <option *ngFor="let i of ies" [value]="i.id">{{ i.nome }}</option>
          </select>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="fecharModal()">Cancelar</button>
          <button class="btn btn-primary" (click)="salvar()" [disabled]="salvando">{{ salvando ? 'Salvando...' : 'Salvar' }}</button>
        </div>
      </div>
    </div>
  `
})
export class EscolasComponent implements OnInit {
  lista: EscolaResponse[] = [];
  ies: IesResponse[] = [];
  carregando = true;
  modalAberto = false;
  editandoId: number | null = null;
  form: EscolaRequest = { nome: '', nomeCoordenador: '', iesId: 0 };
  erro = '';
  salvando = false;

  constructor(private svc: EscolaService, private iesSvc: IesService) {}

  ngOnInit() {
    this.iesSvc.listar().subscribe(i => this.ies = i);
    this.carregar();
  }

  carregar() {
    this.carregando = true;
    this.svc.listar().subscribe({ next: d => { this.lista = d; this.carregando = false; }, error: () => this.carregando = false });
  }

  abrirModal(e?: EscolaResponse) {
    this.erro = '';
    this.editandoId = e ? e.id : null;
    this.form = e ? { nome: e.nome, nomeCoordenador: e.nomeCoordenador, iesId: e.iesId } : { nome: '', nomeCoordenador: '', iesId: 0 };
    this.modalAberto = true;
  }

  fecharModal() { this.modalAberto = false; }

  salvar() {
    if (!this.form.nome || !this.form.nomeCoordenador || !this.form.iesId) {
      this.erro = 'Preencha todos os campos.';
      return;
    }
    this.salvando = true;
    const op = this.editandoId
        ? this.svc.atualizar(this.editandoId, this.form)
        : this.svc.criar(this.form);

    op.subscribe({
      next: () => {
        this.salvando = false;
        this.fecharModal();
        this.carregar();
      },
      error: (err) => {
        this.salvando = false;
        this.erro = err?.error?.message || 'Erro ao salvar. Tente novamente.';
      }
    });
  }

  toggleStatus(e: EscolaResponse) { this.svc.alterarStatus(e.id, !e.ativo).subscribe(() => this.carregar()); }
  excluir(id: number) { if (confirm('Confirma exclusão?')) this.svc.excluir(id).subscribe(() => this.carregar()); }
}
