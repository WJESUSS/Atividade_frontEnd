import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {EscolaResponse, ProfessorRequest, ProfessorResponse} from "../../../shared/models/models";
import {EscolaService, ProfessorService} from "../../../core/services/api.services";


@Component({
  selector: 'app-professores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './professores.component.html'
})
export class ProfessoresComponent implements OnInit {
  lista: ProfessorResponse[] = [];
  escolas: EscolaResponse[] = [];
  carregando = true;
  modalAberto = false;
  editandoId: number | null = null;
  form: ProfessorRequest = this.formVazio();
  erro = '';
  salvando = false;

  constructor(private svc: ProfessorService, private escolaSvc: EscolaService) {}

  ngOnInit() {
    this.escolaSvc.listar().subscribe(e => this.escolas = e);
    this.carregar();
  }

  carregar() {
    this.carregando = true;
    this.svc.listar().subscribe({ next: d => { this.lista = d; this.carregando = false; }, error: () => this.carregando = false });
  }

  abrirModal(prof?: ProfessorResponse) {
    this.erro = '';
    if (prof) {
      this.editandoId = prof.id;
      this.form = { matricula: prof.matricula, nomeCompleto: prof.nomeCompleto, email: prof.email, telefone: prof.telefone ?? '', escolaId: prof.escolaId };
    } else {
      this.editandoId = null;
      this.form = this.formVazio();
    }
    this.modalAberto = true;
  }

  fecharModal() { this.modalAberto = false; }

  salvar() {
    if (!this.form.matricula || !this.form.nomeCompleto || !this.form.email || !this.form.escolaId) {
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
      error: (err) => { // 🔥 só mudamos aqui
        this.salvando = false;

        let mensagem = 'Erro ao salvar professor.';

        if (err?.error) {
          if (typeof err.error === 'string') {
            mensagem = err.error;
          } else if (err.error.message) {
            mensagem = err.error.message;
          } else if (err.error.erro) {
            mensagem = err.error.erro;
          } else if (Object.values(err.error).length > 0) {
            mensagem = Object.values(err.error)[0] as string;
          }
        }

        this.erro = mensagem;
      }
    });
  }

  toggleStatus(p: ProfessorResponse) {
    this.svc.alterarStatus(p.id, !p.ativo).subscribe(() => this.carregar());
  }

  private formVazio(): ProfessorRequest {
    return { matricula: '', nomeCompleto: '', email: '', telefone: '', escolaId: 0 };
  }
  excluir(p: ProfessorResponse) {

    const confirmar = confirm(`Deseja realmente excluir o professor ${p.nomeCompleto}?`);

    if (!confirmar) return;

    this.svc.excluir(p.id).subscribe({
      next: () => {
        this.carregar();
      },
      error: (err) => {

        let mensagem = 'Erro ao excluir professor.';

        if (err?.error) {
          if (typeof err.error === 'string') {
            mensagem = err.error;
          } else if (err.error.message) {
            mensagem = err.error.message;
          } else if (err.error.erro) {
            mensagem = err.error.erro;
          }
        }

        alert(mensagem); // pode trocar por toast depois
      }
    });
  }
}
