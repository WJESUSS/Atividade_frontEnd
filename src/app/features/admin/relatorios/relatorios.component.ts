import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DisciplinaInteresseDTO,
  ProfessorDisciplinasDTO,
  ProfessorDisponibilidadeDTO
} from "../../../shared/models/models";
import {RelatorioService} from "../../../core/services/api.services";


@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './relatorios.component.html'
})
export class RelatoriosComponent implements OnInit {
  aba: 'disponibilidade' | 'disciplinas' | 'interesse' = 'disponibilidade';
  carregando = false;

  disponibilidade: ProfessorDisponibilidadeDTO[] = [];
  disciplinas: ProfessorDisciplinasDTO[] = [];
  interesse: DisciplinaInteresseDTO[] = [];

  constructor(private svc: RelatorioService) {}

  ngOnInit() { this.carregar(); }

  carregar() {
    this.carregando = true;
    if (this.aba === 'disponibilidade') {
      this.svc.professoresDisponibilidade().subscribe({ next: d => { this.disponibilidade = d; this.carregando = false; }, error: () => this.carregando = false });
    } else if (this.aba === 'disciplinas') {
      this.svc.professoresDisciplinas().subscribe({ next: d => { this.disciplinas = d; this.carregando = false; }, error: () => this.carregando = false });
    } else {
      this.svc.disciplinasInteresse().subscribe({ next: d => { this.interesse = d; this.carregando = false; }, error: () => this.carregando = false });
    }
  }

  mudarAba(aba: 'disponibilidade' | 'disciplinas' | 'interesse') {
    this.aba = aba;
    this.carregar();
  }

  labelDia(d: string): string {
    const map: Record<string, string> = { SEG:'Seg', TER:'Ter', QUA:'Qua', QUI:'Qui', SEX:'Sex', SAB:'Sáb' };
    return map[d] ?? d;
  }
}
