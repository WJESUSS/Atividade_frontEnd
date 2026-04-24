import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {DisciplinaInteresseItem, DisciplinaResponse} from "../../../shared/models/models";
import {DisciplinaInteresseService, DisciplinaService} from "../../../core/services/api.services";


interface ItemSelecionado {
  disciplina: DisciplinaResponse;
  prioridade: number;
}

@Component({
  selector: 'app-disciplinas-interesse',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './disciplinas-interesse.component.html'
})
export class DisciplinasInteresseComponent implements OnInit {
  todasDisciplinas: DisciplinaResponse[] = [];
  selecionadas: ItemSelecionado[] = [];
  carregando = true;
  salvando = false;
  mensagem = '';
  erro = '';

  constructor(
    private intSvc: DisciplinaInteresseService,
    private discSvc: DisciplinaService
  ) {}

  ngOnInit() {
    this.discSvc.listar().subscribe(disciplinas => {
      this.todasDisciplinas = disciplinas.filter(d => d.ativo);
      this.intSvc.listar().subscribe(interesses => {
        this.selecionadas = interesses.map(i => ({
          disciplina: disciplinas.find(d => d.id === i.disciplinaId)!,
          prioridade: i.prioridade
        })).filter(i => i.disciplina);
        this.carregando = false;
      });
    });
  }

  get disponiveis(): DisciplinaResponse[] {
    const ids = this.selecionadas.map(s => s.disciplina.id);
    return this.todasDisciplinas.filter(d => !ids.includes(d.id));
  }

  adicionar(disc: DisciplinaResponse) {
    const proxPrioridade = this.selecionadas.length + 1;
    this.selecionadas.push({ disciplina: disc, prioridade: proxPrioridade });
  }

  remover(idx: number) {
    this.selecionadas.splice(idx, 1);
    this.selecionadas.forEach((s, i) => s.prioridade = i + 1);
  }

  moverCima(idx: number) {
    if (idx === 0) return;
    [this.selecionadas[idx - 1], this.selecionadas[idx]] = [this.selecionadas[idx], this.selecionadas[idx - 1]];
    this.selecionadas.forEach((s, i) => s.prioridade = i + 1);
  }

  moverBaixo(idx: number) {
    if (idx === this.selecionadas.length - 1) return;
    [this.selecionadas[idx], this.selecionadas[idx + 1]] = [this.selecionadas[idx + 1], this.selecionadas[idx]];
    this.selecionadas.forEach((s, i) => s.prioridade = i + 1);
  }

  salvar() {
    this.salvando = true;
    this.mensagem = '';
    this.erro = '';

    const payload: DisciplinaInteresseItem[] = this.selecionadas.map(s => ({
      disciplinaId: s.disciplina.id,
      prioridade: s.prioridade
    }));

    this.intSvc.salvar({ disciplinas: payload }).subscribe({
      next: () => {
        this.salvando = false;
        this.mensagem = 'Interesses salvos com sucesso!';
      },
      error: (err) => {
        this.salvando = false;
        let mensagem = 'Erro ao salvar.';
        if (err?.error?.message) mensagem = err.error.message;
        else if (typeof err?.error === 'string') mensagem = err.error;
        this.erro = mensagem;
      }
    });
  }}
