import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IesRequest, IesResponse} from "../../../shared/models/models";
import { IesService } from "src/app/core/services/api.services";


@Component({
  selector: 'app-ies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1>IES – Instituições de Ensino Superior</h1>
      <button class="btn btn-primary" (click)="abrirModal()">+ Nova IES</button>
    </div>

    <div class="card">
      <div *ngIf="carregando" style="text-align:center;padding:2rem"><div class="spinner" style="margin:0 auto"></div></div>
      <div *ngIf="!carregando" class="table-container">
        <table>
          <thead><tr><th>Nome</th><th>Endereço</th><th>Telefone</th><th>Ações</th></tr></thead>
          <tbody>
            <tr *ngFor="let i of lista">
              <td>{{ i.nome }}</td>
              <td>{{ i.endereco }}</td>
              <td>{{ i.telefone }}</td>
              <td><button class="btn btn-secondary btn-sm" (click)="abrirModal(i)">Editar</button></td>
            </tr>
            <tr *ngIf="lista.length === 0"><td colspan="4" style="text-align:center;color:var(--text-muted);padding:1.5rem">Nenhuma IES cadastrada.</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal-overlay" *ngIf="modalAberto" (click)="fecharModal()">
      <div class="modal-box" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <span class="modal-title">{{ editandoId ? 'Editar' : 'Nova' }} IES</span>
          <button class="btn btn-secondary btn-sm" (click)="fecharModal()">✕</button>
        </div>
        <div *ngIf="erro" class="alert alert-danger">{{ erro }}</div>
        <div class="form-group">
          <label class="form-label">Nome *</label>
          <input class="form-control" [(ngModel)]="form.nome">
        </div>
        <div class="form-group">
          <label class="form-label">Endereço *</label>
          <input class="form-control" [(ngModel)]="form.endereco">
        </div>
        <div class="form-group">
          <label class="form-label">Telefone *</label>
          <input class="form-control" [(ngModel)]="form.telefone" placeholder="(71) 3333-3333">
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="fecharModal()">Cancelar</button>
          <button class="btn btn-primary" (click)="salvar()" [disabled]="salvando">{{ salvando ? 'Salvando...' : 'Salvar' }}</button>
        </div>
      </div>
    </div>
  `
})
export class IesComponent implements OnInit {
  lista: IesResponse[] = [];
  carregando = true;
  modalAberto = false;
  editandoId: number | null = null;
  form: IesRequest = { nome: '', endereco: '', telefone: '' };
  erro = '';
  salvando = false;

  constructor(private svc: IesService) {}

  ngOnInit() { this.carregar(); }

  carregar() {
    this.carregando = true;
    this.svc.listar().subscribe({ next: d => { this.lista = d; this.carregando = false; }, error: () => this.carregando = false });
  }

  abrirModal(i?: IesResponse) {
    this.erro = '';
    this.editandoId = i ? i.id : null;
    this.form = i ? { nome: i.nome, endereco: i.endereco, telefone: i.telefone } : { nome: '', endereco: '', telefone: '' };
    this.modalAberto = true;
  }

  fecharModal() { this.modalAberto = false; }

  salvar() {
    if (!this.form.nome || !this.form.endereco || !this.form.telefone) { this.erro = 'Preencha todos os campos.'; return; }
    this.salvando = true;
    const op = this.editandoId ? this.svc.atualizar(this.editandoId, this.form) : this.svc.criar(this.form);
    op.subscribe({ next: () => { this.salvando = false; this.fecharModal(); this.carregar(); }, error: () => { this.salvando = false; this.erro = 'Erro ao salvar.'; } });
  }
}
