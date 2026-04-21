import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HorarioPeriodoResponse} from "../../../shared/models/models";
import {DisponibilidadeService, HorarioPeriodoService} from "../../../core/services/api.services";


interface CelulaDisp {
  horario: HorarioPeriodoResponse;
  selecionado: boolean;
}

@Component({
  selector: 'app-disponibilidade',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './disponibilidade.component.html'
})
export class DisponibilidadeComponent implements OnInit {
  celulas: CelulaDisp[] = [];
  carregando = true;
  salvando = false;
  mensagem = '';
  erro = '';

  dias = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
  turnos = ['MANHA', 'TARDE', 'NOITE'];
  labelDia: Record<string, string> = {SEG: 'Seg', TER: 'Ter', QUA: 'Qua', QUI: 'Qui', SEX: 'Sex', SAB: 'Sab'};
  labelTurno: Record<string, string> = {MANHA: 'Manha', TARDE: 'Tarde', NOITE: 'Noite'};

  constructor(private dispSvc: DisponibilidadeService, private horarioSvc: HorarioPeriodoService) {
  }

  ngOnInit() {
    this.horarioSvc.listar().subscribe(horarios => {
      const ativos = horarios.filter(h => h.ativo);
      this.dispSvc.listar().subscribe(selecionados => {
        this.celulas = ativos.map(h => ({
          horario: h,
          selecionado: selecionados.some(s =>
              s.diaSemana === h.diaSemana && s.turno === h.turno &&
              s.horaInicio === h.horaInicio && s.horaFim === h.horaFim
          )
        }));
        this.carregando = false;
      });
    });
  }

  celulasPorDiaTurno(dia: string, turno: string): CelulaDisp[] {
    return this.celulas.filter(c => c.horario.diaSemana === dia && c.horario.turno === turno);
  }

  contarSelecionadosPorTurno(turno: string): number {
    return this.celulas.filter(c => c.horario.turno === turno && c.selecionado).length;
  }

  toggle(c: CelulaDisp) {
    c.selecionado = !c.selecionado;
  }

  salvar() {
    this.salvando = true;
    this.mensagem = '';
    this.erro = '';

    const ids = this.celulas
        .filter(c => c.selecionado)
        .map(c => c.horario.id);

    this.dispSvc.substituir({horarioPeriodoIds: ids}).subscribe({
      next: () => {
        this.salvando = false;
        this.mensagem = 'Disponibilidade salva com sucesso!';
      },
      error: (err) => {
        this.salvando = false;

        let message = 'Erro ao salvar disponibilidade.';

        if (err?.error) {
          if (typeof err.error === 'string') {
            message = err.error;
          } else if (err.error.message) {
            message = err.error.message; // padrão ideal
          } else if (err.error.erro) {
            message = err.error.erro; // fallback
          } else if (Object.values(err.error).length > 0) {
            message = Object.values(err.error)[0] as string;
          }
        }

        this.erro = `⚠️ ${message}`;

        console.error('Erro completo:', err);
      }
    });
  }
}