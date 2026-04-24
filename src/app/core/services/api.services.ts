import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import {
  IesRequest, IesResponse,
  EscolaRequest, EscolaResponse,
  ProfessorRequest, ProfessorResponse,
  DisciplinaRequest, DisciplinaResponse,
  HorarioPeriodoRequest, HorarioPeriodoResponse,
  DisponibilidadeRequest, DisponibilidadeResponse,
  DisciplinaInteresseRequest, DisciplinaInteresseResponse,
  TitulacaoRequest, TitulacaoResponse,
  ProfessorDisponibilidadeDTO, ProfessorDisciplinasDTO, DisciplinaInteresseDTO
} from '../../shared/models/models';
import {HttpClient, HttpParams} from "@angular/common/http";

const API = environment.apiUrl;

// ---- IES ----
@Injectable({ providedIn: 'root' })
export class IesService {
  constructor(private http: HttpClient) {}
  listar()                    { return this.http.get<IesResponse[]>(`${API}/api/admin/ies`); }
  buscar(id: number)          { return this.http.get<IesResponse>(`${API}/api/admin/ies/${id}`); }
  criar(r: IesRequest)        { return this.http.post<IesResponse>(`${API}/api/admin/ies`, r); }
  atualizar(id: number, r: IesRequest) { return this.http.put<IesResponse>(`${API}/api/admin/ies/${id}`, r); }
}

// ---- ESCOLA ----
@Injectable({ providedIn: 'root' })
export class EscolaService {
  constructor(private http: HttpClient) {}
  listar()                           { return this.http.get<EscolaResponse[]>(`${API}/api/admin/escolas`); }
  buscar(id: number)                 { return this.http.get<EscolaResponse>(`${API}/api/admin/escolas/${id}`); }
  criar(r: EscolaRequest)            { return this.http.post<EscolaResponse>(`${API}/api/admin/escolas`, r); }
  atualizar(id: number, r: EscolaRequest) { return this.http.put<EscolaResponse>(`${API}/api/admin/escolas/${id}`, r); }
  alterarStatus(id: number, ativo: boolean) {
    return this.http.patch(`${API}/api/admin/escolas/${id}/status`, null, { params: new HttpParams().set('ativo', ativo) });
  }
  excluir(id: number) { return this.http.delete(`${API}/api/admin/escolas/${id}`); }
}

// ---- PROFESSOR ----
@Injectable({ providedIn: 'root' })
export class ProfessorService {
  constructor(private http: HttpClient) {}
  listar()                                { return this.http.get<ProfessorResponse[]>(`${API}/api/admin/professores`); }
  buscar(id: number)                      { return this.http.get<ProfessorResponse>(`${API}/api/admin/professores/${id}`); }
  criar(r: ProfessorRequest)              { return this.http.post<ProfessorResponse>(`${API}/api/admin/professores`, r); }
  atualizar(id: number, r: ProfessorRequest) { return this.http.put<ProfessorResponse>(`${API}/api/admin/professores/${id}`, r); }
  alterarStatus(id: number, ativo: boolean) {
    return this.http.patch(`${API}/api/admin/professores/${id}/status`, null, { params: new HttpParams().set('ativo', ativo) });
  }

  excluir(id: number) {
    return this.http.delete(`${API}/api/admin/professores/${id}`);
  }
}

// ---- DISCIPLINA ----
@Injectable({ providedIn: 'root' })
export class DisciplinaService {
  constructor(private http: HttpClient) {}
  listar()                                  { return this.http.get<DisciplinaResponse[]>(`${API}/api/admin/disciplinas`); }
  buscar(id: number)                        { return this.http.get<DisciplinaResponse>(`${API}/api/admin/disciplinas/${id}`); }
  listarPorEscola(escolaId: number)         { return this.http.get<DisciplinaResponse[]>(`${API}/api/admin/disciplinas/escola/${escolaId}`); }
  criar(r: DisciplinaRequest)               { return this.http.post<DisciplinaResponse>(`${API}/api/admin/disciplinas`, r); }
  atualizar(id: number, r: DisciplinaRequest) { return this.http.put<DisciplinaResponse>(`${API}/api/admin/disciplinas/${id}`, r); }
  alterarStatus(id: number, ativo: boolean) {
    return this.http.patch(`${API}/api/admin/disciplinas/${id}/status`, null, { params: new HttpParams().set('ativo', ativo) });
  }
  excluir(id: number) { return this.http.delete(`${API}/api/admin/disciplinas/${id}`); }
}

// ---- HORARIO PERIODO ----
@Injectable({ providedIn: 'root' })
export class HorarioPeriodoService {

  constructor(private http: HttpClient) {}

  // LISTAR TODOS
  listar() {
    return this.http.get<HorarioPeriodoResponse[]>(
        `${API}/api/admin/horarios`
    );
  }

  // CRIAR HORÁRIO
  criar(r: HorarioPeriodoRequest) {
    return this.http.post<HorarioPeriodoResponse>(
        `${API}/api/admin/horarios`,
        r
    );
  }

  // 🔥 ATIVAR / INATIVAR (TOGGLE STATUS)
  toggleStatus(id: number) {
    return this.http.patch(
        `${API}/api/admin/horarios/${id}/status`,
        null
    );
  }
}

// ---- DISPONIBILIDADE (PROFESSOR) ----
@Injectable({ providedIn: 'root' })
export class DisponibilidadeService {
  constructor(private http: HttpClient) {}
  listar()                            { return this.http.get<DisponibilidadeResponse[]>(`${API}/api/professor/disponibilidade`); }
  substituir(r: DisponibilidadeRequest) {
    return this.http.post(
        `${API}/api/professor/disponibilidade`,
        r,
        { responseType: 'text' } // ✅ instrui o HttpClient a não fazer parse JSON
    );
  }
}

// ---- DISCIPLINA INTERESSE (PROFESSOR) ----
@Injectable({ providedIn: 'root' })
export class DisciplinaInteresseService {
  constructor(private http: HttpClient) {}
  listar()                              { return this.http.get<DisciplinaInteresseResponse[]>(`${API}/api/professor/disciplinas-interesse`); }
  salvar(r: DisciplinaInteresseRequest) { return this.http.post<void>(`${API}/api/professor/disciplinas-interesse`, r); }
}

// ---- TITULACAO (PROFESSOR) ----
@Injectable({ providedIn: 'root' })
export class TitulacaoService {
  constructor(private http: HttpClient) {}
  listar()                                     { return this.http.get<TitulacaoResponse[]>(`${API}/api/professor/titulacoes`); }
  criar(r: TitulacaoRequest)                   { return this.http.post<TitulacaoResponse>(`${API}/api/professor/titulacoes`, r); }
  atualizar(id: number, r: TitulacaoRequest)   { return this.http.put<TitulacaoResponse>(`${API}/api/professor/titulacoes/${id}`, r); }
  deletar(id: number)                          { return this.http.delete<void>(`${API}/api/professor/titulacoes/${id}`); }
}

// ---- RELATORIOS ----
@Injectable({ providedIn: 'root' })
export class RelatorioService {
  constructor(private http: HttpClient) {}
  professoresDisponibilidade() { return this.http.get<ProfessorDisponibilidadeDTO[]>(`${API}/api/admin/relatorios/professores-disponibilidade`); }
  professoresDisciplinas()     { return this.http.get<ProfessorDisciplinasDTO[]>(`${API}/api/admin/relatorios/professores-disciplinas`); }
  disciplinasInteresse()       { return this.http.get<DisciplinaInteresseDTO[]>(`${API}/api/admin/relatorios/disciplinas-interesse`); }
}
