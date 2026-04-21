import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {DisciplinaRequest, DisciplinaResponse, EscolaResponse} from "../../../shared/models/models";
import {DisciplinaService, EscolaService} from "../../../core/services/api.services";


@Component({
  selector: 'app-disciplinas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './disciplinas.component.html'
})
export class DisciplinasComponent implements OnInit {
  lista: DisciplinaResponse[] = [];
  escolas: EscolaResponse[] = [];
  carregando = true;
  modalAberto = false;
  editandoId: number | null = null;
  form: DisciplinaRequest = { sigla: '', descricao: '', cargaHoraria: 60, escolaId: 0 };
  erro = '';
  salvando = false;
  filtroEscola = 0;

  constructor(private svc: DisciplinaService, private escolaSvc: EscolaService) {}

  ngOnInit() {
    this.escolaSvc.listar().subscribe(e => this.escolas = e);
    this.carregar();
  }

  carregar() {
    this.carregando = true;
    this.svc.listar().subscribe({ next: d => { this.lista = d; this.carregando = false; }, error: () => this.carregando = false });
  }

  get listaFiltrada() {
    return this.filtroEscola ? this.lista.filter(d => d.escolaId === this.filtroEscola) : this.lista;
  }

  abrirModal(d?: DisciplinaResponse) {
    this.erro = '';
    this.editandoId = d ? d.id : null;
    this.form = d
      ? { sigla: d.sigla, descricao: d.descricao, cargaHoraria: d.cargaHoraria, escolaId: d.escolaId }
      : { sigla: '', descricao: '', cargaHoraria: 60, escolaId: 0 };
    this.modalAberto = true;
  }

  fecharModal() { this.modalAberto = false; }

  salvar() {
    if (!this.form.sigla || !this.form.descricao || !this.form.escolaId) {
      this.erro = 'Preencha todos os campos obrigatórios.';
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
        this.erro = err?.error?.erro || 'Erro ao salvar.'; // ✅ exibe mensagem do backend
      }
    });
  }

  toggleStatus(d: DisciplinaResponse) { this.svc.alterarStatus(d.id, !d.ativo).subscribe(() => this.carregar()); }
  excluir(id: number) { if (confirm('Confirma exclusão?')) this.svc.excluir(id).subscribe(() => this.carregar()); }
}
