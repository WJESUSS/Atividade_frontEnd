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
    const id = Number(this.filtroEscola);

    return id
        ? this.lista.filter(d => d.escolaId === id)
        : this.lista;
  }
  abrirModal(d?: DisciplinaResponse) {
    this.erro = '';
    this.modalAberto = true;

    if (d?.id) {
      this.editandoId = d.id;

      this.svc.buscar(d.id).subscribe({
        next: (data) => {
          this.form = {
            sigla: data.sigla,
            descricao: data.descricao,
            cargaHoraria: data.cargaHoraria,
            escolaId: data.escolaId
          };
        }
      });

    } else {
      this.editandoId = null;
      this.form = { sigla: '', descricao: '', cargaHoraria: 60, escolaId: 0 };
    }
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
        let mensagem = 'Erro ao salvar.';
        if (err?.error?.message) mensagem = err.error.message;
        else if (typeof err?.error === 'string') mensagem = err.error;
        this.erro = mensagem;
      }
    });
  }

  toggleStatus(d: DisciplinaResponse) { this.svc.alterarStatus(d.id, !d.ativo).subscribe(() => this.carregar()); }
  excluir(id: number) { if (confirm('Confirma exclusão?')) this.svc.excluir(id).subscribe(() => this.carregar()); }
}
