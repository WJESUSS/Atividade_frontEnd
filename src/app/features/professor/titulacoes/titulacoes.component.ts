import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {CategoriaTitulacao, TitulacaoRequest, TitulacaoResponse} from "../../../shared/models/models";
import {TitulacaoService} from "../../../core/services/api.services";


@Component({
  selector: 'app-titulacoes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1>Minhas Titulações</h1>
      <button class="btn btn-primary" (click)="abrirModal()">+ Nova Titulação</button>
    </div>

    <div class="card">
      <div *ngIf="carregando" style="text-align:center;padding:2rem"><div class="spinner" style="margin:0 auto"></div></div>
      <div *ngIf="!carregando" class="table-container">
        <table>
          <thead><tr><th>Categoria</th><th>Curso</th><th>Instituição</th><th>Conclusão</th><th>Ações</th></tr></thead>
          <tbody>
            <tr *ngFor="let t of lista">
              <td><span class="badge badge-purple">{{ t.categoria }}</span></td>
              <td>{{ t.nomeCurso }}</td>
              <td>{{ t.nomeInstituicao }}</td>
              <td>{{ t.anoConclusao }}</td>
              <td style="display:flex;gap:6px">
                <button class="btn btn-secondary btn-sm" (click)="abrirModal(t)">Editar</button>
                <button class="btn btn-danger btn-sm" (click)="excluir(t.id)">Excluir</button>
              </td>
            </tr>
            <tr *ngIf="lista.length === 0"><td colspan="5" style="text-align:center;color:var(--text-muted);padding:1.5rem">Nenhuma titulação cadastrada.</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal-overlay" *ngIf="modalAberto" (click)="fecharModal()">
      <div class="modal-box" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <span class="modal-title">{{ editandoId ? 'Editar' : 'Nova' }} Titulação</span>
          <button class="btn btn-secondary btn-sm" (click)="fecharModal()">✕</button>
        </div>
        <div *ngIf="erro" class="alert alert-danger">{{ erro }}</div>
        <div class="form-group">
          <label class="form-label">Categoria *</label>
          <select class="form-control" [(ngModel)]="form.categoria">
            <option value="" disabled>Selecione...</option>
            <option *ngFor="let c of categorias" [value]="c.valor">{{ c.label }}</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Nome do Curso *</label>
          <input class="form-control" [(ngModel)]="form.nomeCurso">
        </div>
        <div class="form-group">
          <label class="form-label">Instituição *</label>
          <input class="form-control" [(ngModel)]="form.nomeInstituicao">
        </div>
        <div class="form-group">
          <label class="form-label">Ano de Conclusão *</label>
          <input class="form-control" type="number" [(ngModel)]="form.anoConclusao" min="1970" [max]="anoAtual">
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="fecharModal()">Cancelar</button>
          <button class="btn btn-primary" (click)="salvar()" [disabled]="salvando">{{ salvando ? 'Salvando...' : 'Salvar' }}</button>
        </div>
      </div>
    </div>
  `
})
export class TitulacoesComponent implements OnInit {
  lista: TitulacaoResponse[] = [];
  carregando = true;
  modalAberto = false;
  editandoId: number | null = null;
  form: TitulacaoRequest = { categoria: 'GRADUACAO', nomeInstituicao: '', nomeCurso: '', anoConclusao: 2020 };
  erro = '';
  salvando = false;
  anoAtual = new Date().getFullYear();

  categorias = [
    { valor: 'GRADUACAO', label: 'Graduação' },
    { valor: 'ESPECIALIZACAO', label: 'Especialização' },
    { valor: 'MBA', label: 'MBA' },
    { valor: 'MESTRADO', label: 'Mestrado' },
    { valor: 'DOUTORADO', label: 'Doutorado' },
    { valor: 'POS_GRADUACAO', label: 'Pós-graduação' },
  ];

  constructor(private svc: TitulacaoService) {}

  ngOnInit() { this.carregar(); }

  carregar() {
    this.carregando = true;
    this.svc.listar().subscribe({ next: d => { this.lista = d; this.carregando = false; }, error: () => this.carregando = false });
  }

  abrirModal(t?: TitulacaoResponse) {
    this.erro = '';
    this.editandoId = t ? t.id : null;
    this.form = t
      ? { categoria: t.categoria as CategoriaTitulacao, nomeCurso: t.nomeCurso, nomeInstituicao: t.nomeInstituicao, anoConclusao: t.anoConclusao }
      : { categoria: 'GRADUACAO', nomeInstituicao: '', nomeCurso: '', anoConclusao: this.anoAtual };
    this.modalAberto = true;
  }

  fecharModal() { this.modalAberto = false; }

  salvar() {
    if (!this.form.nomeCurso || !this.form.nomeInstituicao || !this.form.anoConclusao) { this.erro = 'Preencha todos os campos.'; return; }
    this.salvando = true;
    const op = this.editandoId ? this.svc.atualizar(this.editandoId, this.form) : this.svc.criar(this.form);
    op.subscribe({ next: () => { this.salvando = false; this.fecharModal(); this.carregar(); }, error: () => { this.salvando = false; this.erro = 'Erro ao salvar.'; } });
  }

  excluir(id: number) { if (confirm('Confirma exclusão?')) this.svc.deletar(id).subscribe(() => this.carregar()); }
}
