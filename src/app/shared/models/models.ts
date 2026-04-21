// ===== AUTH =====
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  nome: string;
  perfil: 'ROLE_ADMIN' | 'ROLE_PROFESSOR';
  professorId: number | null;
}

// ===== IES =====
export interface IesRequest {
  nome: string;
  endereco: string;
  telefone: string;
}

export interface IesResponse {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
}

// ===== ESCOLA =====
export interface EscolaRequest {
  nome: string;
  nomeCoordenador: string;
  iesId: number;
}

export interface EscolaResponse {
  id: number;
  nome: string;
  nomeCoordenador: string;
  ativo: boolean;
  iesId: number;
  nomeIes: string;
}

// ===== PROFESSOR =====
export interface ProfessorRequest {
  matricula: string;
  nomeCompleto: string;
  email: string;
  telefone: string;
  escolaId: number;
}

export interface ProfessorResponse {
  id: number;
  matricula: string;
  nomeCompleto: string;
  email: string;
  telefone: string;
  ativo: boolean;
  escolaId: number;
  escolaNome: string;
}

// ===== DISCIPLINA =====
export interface DisciplinaRequest {
  sigla: string;
  descricao: string;
  cargaHoraria: number;
  escolaId: number;
}

export interface DisciplinaResponse {
  id: number;
  sigla: string;
  descricao: string;
  cargaHoraria: number;
  ativo: boolean;
  escolaId: number;
  nomeEscola: string;
  dataCadastro: string;
}

// ===== HORARIO PERIODO =====
export type DiaSemana = 'SEG' | 'TER' | 'QUA' | 'QUI' | 'SEX' | 'SAB';
export type Turno = 'MANHA' | 'TARDE' | 'NOITE';

export interface HorarioPeriodoRequest {
  diaSemana: DiaSemana;
  turno: Turno;
  horaInicio: string;
  horaFim: string;
}

export interface HorarioPeriodoResponse {
  id: number;
  diaSemana: DiaSemana;
  turno: Turno;
  horaInicio: string;
  horaFim: string;
  ativo: boolean;
}

// ===== DISPONIBILIDADE =====
export interface DisponibilidadeRequest {
  horarioPeriodoIds: number[];
}

export interface DisponibilidadeResponse {
  diaSemana: DiaSemana;
  turno: Turno;
  horaInicio: string;
  horaFim: string;
}

// ===== DISCIPLINA INTERESSE =====
export interface DisciplinaInteresseItem {
  disciplinaId: number;
  prioridade: number;
}

export interface DisciplinaInteresseRequest {
  disciplinas: DisciplinaInteresseItem[];
}

export interface DisciplinaInteresseResponse {
  disciplinaId: number;
  nome: string;
  sigla: string;
  prioridade: number;
}

// ===== TITULACAO =====
export type CategoriaTitulacao =
  'GRADUACAO' | 'ESPECIALIZACAO' | 'MBA' | 'MESTRADO' | 'DOUTORADO' | 'POS_GRADUACAO';

export interface TitulacaoRequest {
  categoria: CategoriaTitulacao;
  nomeInstituicao: string;
  nomeCurso: string;
  anoConclusao: number;
}

export interface TitulacaoResponse {
  id: number;
  nomeCurso: string;
  nomeInstituicao: string;
  anoConclusao: number;
  categoria: string;
}

// ===== RELATORIOS =====
export interface ProfessorDisponibilidadeDTO {
  id: number;
  nome: string;
  escola: string;
  disponibilidades: DisponibilidadeResponse[];
}

export interface ProfessorDisciplinasDTO {
  professorId: number;
  professorNome: string;
  escolaNome: string;
  disciplinas: { disciplinaNome: string; prioridade: number }[];
}

export interface DisciplinaInteresseDTO {
  disciplinaId: number;
  disciplinaNome: string;
  professores: { professorId: number; professorNome: string; prioridade: number }[];
}
