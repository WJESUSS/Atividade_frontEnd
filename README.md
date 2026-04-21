# UCSAL – Disponibilidade Docente (Frontend Angular 17)

Frontend completo integrado ao backend Spring Boot do projeto.

## Pré-requisitos

- Node.js 18+
- Angular CLI 17: `npm install -g @angular/cli`

## Instalação e execução

```bash
npm install
ng serve
```

Acesse: `http://localhost:4200`

## Configuração do backend

Edite `src/environments/environment.ts` e ajuste a URL se necessário:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'   // URL do seu Spring Boot
};
```

## Estrutura do projeto

```
src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts          # authGuard, adminGuard, professorGuard
│   ├── interceptors/
│   │   └── auth.interceptor.ts    # Injeta Bearer token + trata 401
│   └── services/
│       ├── auth.service.ts        # Login / logout / estado do usuário
│       └── api.services.ts        # Todos os serviços de API (IES, Escola, etc.)
│
├── shared/
│   └── models/
│       └── models.ts              # Todas as interfaces TypeScript
│
├── features/
│   ├── auth/
│   │   └── login/                 # Tela de login
│   │
│   ├── admin/                     # Área administrativa (ROLE_ADMIN)
│   │   ├── admin-layout.component # Sidebar + topbar do admin
│   │   ├── dashboard/             # Cards com totais
│   │   ├── ies/                   # CRUD de IES
│   │   ├── escolas/               # CRUD de Escolas
│   │   ├── professores/           # CRUD de Professores
│   │   ├── disciplinas/           # CRUD de Disciplinas
│   │   ├── horarios/              # Horários/Períodos
│   │   └── relatorios/            # 3 relatórios: disponibilidade, disciplinas, interesse
│   │
│   └── professor/                 # Área do professor (ROLE_PROFESSOR)
│       ├── professor-layout.component
│       ├── dashboard/             # Resumo do professor
│       ├── disponibilidade/       # Grade de disponibilidade clicável
│       ├── disciplinas-interesse/ # Seleção e ordenação por prioridade
│       └── titulacoes/            # CRUD de titulações
│
├── app.routes.ts                  # Rotas com lazy loading
├── app.config.ts                  # Bootstrap standalone + interceptor
└── app.component.ts               # Root component
```

## Rotas

| Rota | Perfil | Descrição |
|------|--------|-----------|
| `/login` | Público | Tela de login |
| `/admin/dashboard` | ADMIN | Dashboard com totais |
| `/admin/ies` | ADMIN | Gestão de IES |
| `/admin/escolas` | ADMIN | Gestão de Escolas |
| `/admin/professores` | ADMIN | Gestão de Professores |
| `/admin/disciplinas` | ADMIN | Gestão de Disciplinas |
| `/admin/horarios` | ADMIN | Horários/Períodos |
| `/admin/relatorios` | ADMIN | Relatórios |
| `/professor/dashboard` | PROFESSOR | Resumo |
| `/professor/disponibilidade` | PROFESSOR | Grade de disponibilidade |
| `/professor/disciplinas-interesse` | PROFESSOR | Interesse em disciplinas |
| `/professor/titulacoes` | PROFESSOR | Titulações |

## Segurança

- **JWT** armazenado em `localStorage` (`token` e `usuario`)
- **Interceptor** adiciona `Authorization: Bearer <token>` em todas as requisições
- **Guards** redirecionam usuários não autenticados ou sem permissão
- Erros **401** fazem logout automático e redirecionam para `/login`

## CORS no Spring Boot

Certifique-se de que o backend aceita `http://localhost:4200`:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:4200")
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE")
            .allowedHeaders("*");
    }
}
```
# Frontend Angular

## 📌 Descrição
Aplicação web desenvolvida em Angular.

## 🚀 Tecnologias
- Angular
- TypeScript
- HTML/CSS

## 🔀 Branches
- main → produção
- develop → desenvolvimento
