# MUSICPLAY

Plataforma web gamificada para estudar instrumentos musicais no próprio ritmo.

**HTML5 · CSS3 · JavaScript ES Modules · Mobile first · Sem frameworks · Dados locais**

## Sumário

1. [Visão geral](#1-visão-geral)
2. [Funcionalidades](#2-funcionalidades)
3. [Telas](#3-telas)
4. [Capturas de tela](#4-capturas-de-tela)
5. [Como rodar](#5-como-rodar)
6. [Como usar](#6-como-usar)
7. [Stack e decisões técnicas](#7-stack-e-decisões-técnicas)
8. [Estrutura de pastas](#8-estrutura-de-pastas)
9. [Arquitetura e dados](#9-arquitetura-e-dados)
10. [Design system](#10-design-system)
11. [Gamificação](#11-gamificação)
12. [Conteúdo e vídeos](#12-conteúdo-e-vídeos)
13. [Acessibilidade e responsividade](#13-acessibilidade-e-responsividade)
14. [Robustez e limitações](#14-robustez-e-limitações)
15. [Testes manuais](#15-testes-manuais)
16. [Convenções de código e commits](#16-convenções-de-código-e-commits)
17. [Histórico de desenvolvimento](#17-histórico-de-desenvolvimento)
18. [Decisões, suposições e pendências](#18-decisões-suposições-e-pendências)
19. [Próximos passos](#19-próximos-passos)
20. [Créditos](#20-créditos)

## 1. Visão geral

O MUSICPLAY reúne trilhas de aprendizagem, aulas, atividades e acompanhamento do progresso em um único protótipo web. A proposta é ajudar crianças, jovens e adultos a manter uma rotina de estudo musical com passos claros, prática curta e feedback sobre cada avanço.

O percurso da trilha varia conforme o instrumento escolhido no onboarding. O progresso e a conta são armazenados localmente no navegador; não há serviço de autenticação ou sincronização remota.

## 2. Funcionalidades

- Cadastro, login e logout locais, com dados separados por e-mail.
- Onboarding com seleção de instrumento, nível de experiência e objetivos.
- Trilhas de 12 aulas para cada um dos 10 instrumentos.
- Aulas com objetivos, conteúdo teórico, prática e conclusão explícita; a liberação das aulas é progressiva.
- Player de vídeo por aula e instrumento, preparado para carregar embeds após clique. No estado atual, os IDs estão pendentes.
- Quiz Musical com questões do instrumento e teoria musical comum; uma rodada seleciona até três perguntas.
- Seis cards de jogos; apenas Quiz Musical é jogável. Os demais mostram aviso de disponibilidade futura.
- Área de Músicas com sete faixas e prática simulada; não há reprodução de áudio.
- Doze conquistas, perfil com calendário local, XP, níveis e sequência de estudos.
- Navegação inferior em telas menores e sidebar a partir do breakpoint desktop.

## 3. Telas

| Tela | Arquivo | Acesso |
|---|---|---|
| Landing | `index.html` | Pública |
| Cadastro | `pages/signup.html` | Pública |
| Login | `pages/login.html` | Pública |
| Onboarding | `pages/onboarding.html` | Fluxo de conta; exige sessão |
| Dashboard | `pages/dashboard.html` | Logada |
| Aprender | `pages/learn.html` | Logada |
| Aula | `pages/lesson.html` | Logada |
| Jogos | `pages/games.html` | Logada |
| Quiz | `pages/quiz.html` | Logada |
| Músicas | `pages/songs.html` | Logada |
| Conquistas | `pages/achievements.html` | Logada |
| Perfil | `pages/profile.html` | Logada |

## 4. Capturas de tela

As imagens ainda não foram adicionadas. Salve as capturas na pasta `docs/screenshots/` com os nomes abaixo; as larguras são sugestões para documentar estados mobile e desktop.

| Arquivo | Tela | Largura sugerida |
|---|---|---:|
| `landing-mobile.png` | Landing | 390 px |
| `landing-desktop.png` | Landing | 1440 px |
| `onboarding-mobile.png` | Onboarding | 390 px |
| `dashboard-mobile.png` | Dashboard | 390 px |
| `dashboard-desktop.png` | Dashboard | 1440 px |
| `lesson-mobile.png` | Aula | 390 px |
| `quiz-mobile.png` | Quiz | 390 px |
| `songs-mobile.png` | Músicas | 390 px |
| `achievements-mobile.png` | Conquistas | 390 px |
| `profile-mobile.png` | Perfil | 390 px |
| `profile-desktop.png` | Perfil | 1440 px |

**Capturas pendentes:** todos os 11 arquivos da tabela. Depois de capturar, insira no README referências como `![Dashboard mobile](docs/screenshots/dashboard-mobile.png)`.

## 5. Como rodar

### Pré-requisitos

- VS Code e um navegador moderno.
- Extensão Live Server ou outro servidor estático local.
- Conexão com a internet para carregar Google Fonts e, quando configurados e reproduzidos, embeds do YouTube.

### Live Server no VS Code

1. Abra a pasta raiz do projeto no VS Code.
2. Instale ou habilite a extensão **Live Server**.
3. Clique com o botão direito em `index.html` e escolha **Open with Live Server**.
4. Acesse o endereço HTTP local aberto no navegador.

### Alternativas

Na raiz do projeto, também é possível iniciar um servidor estático com:

```sh
npx serve .
```

ou:

```sh
python -m http.server 8000
```

Depois, abra o endereço local informado pelo servidor (por exemplo, `http://localhost:8000`).

**Não abra o HTML por `file://`:** os módulos ES são carregados pelo navegador como módulos e precisam de uma origem HTTP; o embed do YouTube também deve ser testado por servidor. `crypto.subtle` requer contexto seguro: `localhost` normalmente é tratado como seguro pelos navegadores; em outro host, use HTTPS.

## 6. Como usar

Roteiro de demonstração de aproximadamente 2 a 3 minutos:

1. Na landing, abra **Começar agora** e crie uma conta com dados de teste.
2. No onboarding, escolha um dos dez instrumentos, nível e objetivo.
3. No dashboard, confira a saudação, XP e atalho para a aula atual.
4. Abra a trilha, entre na aula liberada e conclua-a pelo botão explícito. A próxima aula é liberada após essa conclusão.
5. Acesse **Jogos** e inicie o **Quiz Musical**; uma rodada contém até três perguntas e concede XP por resposta correta ao finalizar.
6. Visite **Conquistas** e **Perfil** para conferir os marcos, estatísticas e calendário de estudos.

Vídeos exigem IDs reais no mapa `js/data/videos.js`. Até que IDs sejam fornecidos e cadastrados, o player informa que o vídeo chegará em breve; não há vídeo reproduzível no conjunto atual.

## 7. Stack e decisões técnicas

- HTML5 semântico, CSS3 puro e JavaScript nativo com ES Modules.
- Sem frameworks, bibliotecas, dependências de runtime, backend ou build step.
- `localStorage` guarda contas locais e progresso; o estado é separado por e-mail e por instrumento.
- Layout mobile first: estilos base atendem telas pequenas, com media queries progressivas.
- Breakpoints observados no CSS: `40rem` (640 px), `48rem` (768 px), `64rem` (1024 px) e `80rem` (1280 px). Nem todo componente usa todos os breakpoints; `64rem` define a navegação desktop.
- Exceções de serviços externos: Google Fonts (Poppins e Inter) e, após ação explícita de play, iframe do YouTube em `youtube-nocookie.com`. Nenhum iframe é criado antes do clique.
- Fontes solicitadas: Inter 400/500/600/700 e Poppins 700/800, com `display=swap` e fallback `system-ui, sans-serif`.
- Senhas locais são processadas com SHA-256 pela Web Crypto API. Isso é apenas uma demonstração educacional, não uma medida de segurança real.

## 8. Estrutura de pastas

Árvore conferida com os arquivos existentes; `docs/screenshots/` foi criada nesta etapa para receber as capturas.

```text
MusicPlayProject/
├── .editorconfig                         # Convenções do editor
├── .gitignore                            # Arquivos ignorados
├── README.md                             # Documentação principal
├── index.html                             # Landing page
├── assets/
│   ├── fonts/.gitkeep                     # Reserva para fontes locais
│   ├── icons/.gitkeep                     # Reserva para ícones locais
│   └── img/.gitkeep                       # Reserva para imagens locais
├── docs/
│   └── screenshots/
│       └── .gitkeep                       # Pasta das capturas pendentes
├── css/
│   ├── main.css                           # Imports únicos, por camada
│   ├── base/
│   │   ├── .gitkeep
│   │   ├── reset.css
│   │   ├── tokens.css                     # Tokens de design
│   │   ├── typography.css
│   │   └── utilities.css
│   ├── layout/
│   │   ├── .gitkeep
│   │   ├── app-shell.css
│   │   ├── bottom-nav.css
│   │   ├── container.css
│   │   ├── grid.css
│   │   └── sidebar.css
│   ├── components/
│   │   ├── .gitkeep
│   │   ├── badge.css
│   │   ├── button.css
│   │   ├── calendar.css
│   │   ├── card.css
│   │   ├── form.css
│   │   ├── lesson-item.css
│   │   ├── progress.css
│   │   ├── quiz-option.css
│   │   ├── stat-card.css
│   │   └── toast.css
│   └── pages/
│       ├── .gitkeep
│       ├── achievements.css
│       ├── auth.css
│       ├── dashboard.css
│       ├── games.css
│       ├── landing.css
│       ├── learn.css
│       ├── lesson.css
│       ├── onboarding.css
│       ├── profile.css
│       ├── quiz.css
│       └── songs.css
├── pages/
│   ├── .gitkeep
│   ├── achievements.html
│   ├── dashboard.html
│   ├── games.html
│   ├── learn.html
│   ├── lesson.html
│   ├── login.html
│   ├── onboarding.html
│   ├── profile.html
│   ├── quiz.html
│   ├── signup.html
│   └── songs.html
└── js/
    ├── environment-warning.js             # Aviso sobre file://
    ├── main.js                             # Seleção e inicialização de páginas
    ├── data/
    │   ├── .gitkeep
    │   ├── achievements.js
    │   ├── instruments.js
    │   ├── lessons.js
    │   ├── levels.js
    │   ├── quiz-questions.js
    │   ├── songs.js
    │   └── videos.js                      # Mapa editável de vídeos por aula
    ├── dev/
    │   ├── check-robustness.js             # Verificações puras opt-in
    │   ├── check-videos.js                  # Contagem de IDs ausentes
    │   └── devtools.js                      # Snippets manuais opt-in
    ├── modules/
    │   ├── .gitkeep
    │   ├── achievements.js
    │   ├── auth.js
    │   ├── calendar.js
    │   ├── form-ui.js
    │   ├── lessons.js
    │   ├── navigation.js
    │   ├── onboarding.js
    │   ├── quiz.js
    │   ├── session-sync.js
    │   ├── state.js
    │   ├── storage.js
    │   ├── streak.js
    │   ├── toast.js
    │   ├── user-ui.js
    │   ├── utils.js
    │   ├── xp.js
    │   └── youtube.js
    └── pages/
        ├── achievements.js
        ├── dashboard.js
        ├── games.js
        ├── learn.js
        ├── lesson.js
        ├── profile.js
        ├── quiz.js
        └── songs.js
```

## 9. Arquitetura e dados

### Inicialização

Cada HTML informa sua página por `data-page`. `js/main.js` lê esse valor e importa dinamicamente o inicializador correspondente. Cadastro e login carregam módulos de autenticação; onboarding carrega seu fluxo; páginas logadas validam a sessão, carregam `user-ui.js` e o módulo da página. Um erro de inicialização é registrado e recebe uma mensagem genérica para o usuário.

### Fluxo de estado

```text
localStorage → modules/storage.js → modules/state.js → módulos de domínio → pages/*.js → HTML
```

`storage.js` encapsula leitura e gravação. `state.js` normaliza/migra o usuário e expõe operações de conta e progresso. Módulos de domínio implementam autenticação, aulas, XP, quiz, sequência, conquistas, calendário e player; os módulos `js/pages/` conectam essas funções aos elementos da tela.

### Chaves do navegador

| Chave | Conteúdo |
|---|---|
| `musicplay:v1` | Objeto JSON com `schemaVersion: 2` e mapa `users` por e-mail normalizado. |
| `musicplay:session` | E-mail atual serializado como string JSON. |
| `musicplay:backup:*` | Cópias locais de conteúdo corrompido, quando o navegador permite gravá-las. |

### Modelo resumido de usuário

O valor real contém também os campos normalizados e metadados; o esquema abaixo ilustra os principais:

```json
{
  "schemaVersion": 2,
  "users": {
    "aluno@example.com": {
      "schemaVersion": 2,
      "name": "Nome do Aluno",
      "email": "aluno@example.com",
      "passwordHash": "sha256-em-hexadecimal",
      "createdAt": "data ISO",
      "onboardingDone": true,
      "instrument": "guitar",
      "level": "beginner",
      "goals": ["learn-songs"],
      "onboardingDraft": null,
      "progress": {
        "xp": 0,
        "studyDays": [],
        "instrumentProgressById": {
          "guitar": {
            "completedLessons": [],
            "lessonProgress": {},
            "currentLessonId": "lesson-1",
            "unlockedLessons": ["lesson-1"]
          }
        },
        "quizStats": {},
        "songProgress": {},
        "unlockedAchievements": {}
      }
    }
  }
}
```

O progresso é separado por `instrumentProgressById`. Para manter a compatibilidade, os IDs antigos de aulas de Violão (`lesson-1` a `lesson-7`) permanecem estáveis; as novas aulas de Violão continuam a sequência, e instrumentos novos usam IDs próprios. O modelo mantém progresso de instrumentos não reconhecidos como dados inativos; não há controle na interface para trocar instrumento.

## 10. Design system

Os tokens estão em `css/base/tokens.css`. Os principais grupos reais são:

| Grupo | Exemplos |
|---|---|
| Cores e gradientes | `--color-background`, `--color-surface`, `--color-primary`, `--color-cyan`, `--gradient-brand` |
| Tipografia | `--font-family-heading`, `--font-family-body`, `--font-size-md` |
| Espaçamento | `--space-1` a `--space-20` |
| Forma e profundidade | `--radius-sm` a `--radius-pill`, `--shadow-card`, `--shadow-focus` |
| Camadas e movimento | `--z-index-navigation`, `--duration-standard`, `--ease-standard` |
| Layout | `--container-width`, `--container-gutter`, `--bottom-nav-height`, `--sidebar-width` |

O CSS é importado uma vez por `css/main.css` na ordem base → layout → componentes → páginas. Componentes reutilizáveis incluem botões, cards, formulários, badges, progresso, itens de aula, opções do quiz, calendário, estatísticas e toasts.

Convenções principais:

- Classes em inglês, kebab-case e BEM (`bloco__elemento--modificador`).
- Tokens em custom properties, agrupados por prefixos semânticos.
- `data-*` conecta HTML e JavaScript, com nomes por domínio: `data-page`, `data-user`, `data-lesson`, `data-quiz`, `data-stat`, `data-calendar` e `data-action`.
- Conteúdo de usuário é inserido por `textContent`/`createElement`, não por interpolação HTML.

## 11. Gamificação

### Níveis

Os limiares são cumulativos. Após o Nível 6, cada nível adicional requer mais 300 XP.

| Nível | XP acumulado necessário |
|---:|---:|
| 1 | 0 |
| 2 | 100 |
| 3 | 250 |
| 4 | 450 |
| 5 | 700 |
| 6 | 1.000 |

O título de músico depende do instrumento e da faixa: níveis 1–3 são Iniciante, 4–6 Intermediário e 7 ou mais Avançado. O XP armazenado é inteiro, não negativo e limitado a 1.000.000.000.

### Regras de XP

| Atividade | Recompensa |
|---|---:|
| Conclusão de aula | XP definido na aula: +30 nas três primeiras; +40 nas demais |
| Resposta correta no quiz | +20 XP por questão correta, consolidado ao finalizar a rodada |
| Sessão simulada de prática musical | +10 XP por sessão |

As aulas concluídas e as músicas já completadas não concedem novamente suas recompensas. Uma sessão de quiz não finalizada não grava XP.

### Sequência de estudos

`studyDays` registra datas locais `YYYY-MM-DD`. Uma data é registrada uma vez por dia de estudo. A sequência considera dias consecutivos até hoje ou ontem; visitar páginas apenas recalcula a sequência, sem registrar estudo. Datas inválidas ou futuras não contam.

### As 12 conquistas

| Conquista | Regra |
|---|---|
| Primeira Aula | Concluir uma aula. |
| 3 Dias Seguidos | Estudar em três dias consecutivos. |
| 100 XP | Alcançar 100 XP. |
| Primeira Nota | Atingir o marco de primeira nota/som do percurso. |
| Primeiro Acorde | Atingir o marco de primeiro acorde ou padrão musical completo. |
| Mestre das Notas | Completar um quiz perfeito. |
| 7 Dias Seguidos | Estudar em sete dias consecutivos. |
| Atirador Certeiro | Acertar dez questões seguidas, inclusive entre rodadas. |
| Primeira Música | Completar uma faixa na prática simulada. |
| Velocista | Concluir uma aula em até dez minutos após abri-la nesta sessão. |
| 100 Questões | Responder 100 questões de quiz. |
| Módulo Completo | Concluir as quatro aulas do Módulo 1. |

Para instrumentos sem acordes tradicionais, o marco “Primeiro Acorde” é o padrão musical definido pelo percurso, como uma levada ou frase inicial.

## 12. Conteúdo e vídeos

### Instrumentos e aulas

Os dados em `js/data/lessons.js` contêm três módulos de quatro aulas para cada instrumento. O catálogo total é 120 aulas.

| Instrumento | Aulas | Vídeos com ID |
|---|---:|---:|
| Violão | 12 | 0 |
| Teclado | 12 | 0 |
| Piano | 12 | 0 |
| Bateria | 12 | 0 |
| Guitarra | 12 | 0 |
| Violino | 12 | 0 |
| Flauta | 12 | 0 |
| Cavaquinho | 12 | 0 |
| Ukulele | 12 | 0 |
| Sanfona / Acordeão | 12 | 0 |
| **Total** | **120** | **0** |

As aulas usam conteúdo específico por instrumento, IDs estáveis e XP da aula. A trilha exibe as aulas, mas só a aula atual liberada pode ser concluída; concluir a aula libera a seguinte. Assim, vídeos não estão “todos liberados” para tocar hoje: além do bloqueio progressivo da aula, todos os IDs de vídeo ainda estão nulos.

### Cadastrar vídeos reais

`js/data/videos.js` mapeia instrumento e `lessonId` para `{ videoId, title, channel, duration }`. Para habilitar um vídeo:

1. Obtenha um ID ou link real do vídeo que corresponda ao instrumento e à aula.
2. Na entrada exata do mapa, substitua `videoId: null` pelo ID de 11 caracteres ou URL suportada; preencha também metadados quando disponíveis.
3. Não invente IDs: o parser `parseYouTubeId()` rejeita formatos inválidos e domínios externos.
4. Rode o app por HTTP local, abra a aula liberada e clique em play. O iframe é criado sob demanda usando `youtube-nocookie.com`.
5. Execute `js/dev/check-videos.js` para ver a contagem de IDs ausentes por instrumento.

O mapa contém atualmente **120 entradas com `videoId: null`**; portanto, **0 de 120 aulas têm vídeo cadastrado**. Para que todos os vídeos funcionem, ainda é necessário fornecer e associar IDs reais às 120 aulas. A aula continua utilizável sem vídeo e mostra “O vídeo desta aula chega em breve”.

### Quiz e música

O banco de quiz tem perguntas de instrumento complementadas por seis questões de teoria musical comum. O Violão tem seis específicas e cada outro instrumento tem quatro específicas. A seleção do aluno recebe questões específicas do instrumento e as comuns.

A seção Músicas tem sete faixas no catálogo de `js/data/songs.js`; os acordes são organizados para o repertório de violão. O estado atual simula sessões de prática, não reproduz áudio nem apresenta cifra interativa.

## 13. Acessibilidade e responsividade

### Acessibilidade

- HTML em português (`lang="pt-BR"`), landmarks, títulos hierárquicos, labels e link de salto para o conteúdo.
- Navegação por teclado e foco visível; elementos nativos para links, botões e formulários.
- Estados de navegação, filtros, progresso, calendário, onboarding e quiz comunicados com texto e atributos ARIA quando necessários.
- Conteúdo variável inserido sem HTML de usuário; mensagens e resultados usam regiões de feedback.
- Preferências de movimento reduzido, contraste elevado e cores forçadas recebem estilos específicos.
- Os contrastes de pares principais foram auditados estaticamente; isso não substitui teste assistivo no navegador.

**Como testar:** navegue com Tab/Shift+Tab, acione controles com Enter/Espaço, confira foco após mudar etapa/pergunta, teste zoom e alto contraste e verifique rótulos com leitor de tela.

### Responsividade

- Mobile first, com barra inferior fixa abaixo de 1024 px e sidebar fixa a partir de `64rem` (1024 px).
- Breakpoints de layout usados: `40rem` (640 px), `48rem` (768 px), `64rem` (1024 px) e `80rem` (1280 px), além de regras específicas para largura muito estreita e paisagem baixa.
- Shell autenticado adapta conteúdo ao espaço da viewport; sidebar permite rolagem própria em pouca altura.

**Como testar:** verificar 390 px e 768 px, além de desktop a 1024, 1280 e 1440 px; conferir sidebar, navegação inferior, conteúdo sem sobreposição ou rolagem horizontal e layout em paisagem.

## 14. Robustez e limitações

- O storage usa `schemaVersion: 2`; usuários antigos/incompletos são normalizados e o progresso legado de Violão migra para `instrumentProgressById.guitar`.
- Dados JSON corrompidos podem receber cópia em `musicplay:backup:*` antes da recuperação. Se o storage estiver indisponível ou sem espaço, o app usa valores seguros quando possível e informa que não conseguiu salvar.
- Uma sessão sem usuário correspondente é limpa; páginas protegidas redirecionam para login. Eventos `storage` e retorno pelo bfcache revalidam a sessão.
- `updateCurrentUser()` relê o usuário persistido antes de atualizar, mas `localStorage` não fornece transação ou trava entre abas; gravações simultâneas ainda podem competir.
- O estado local pode ser editado pelo DevTools, apagado pelo usuário ou perdido com o perfil do navegador. Não é armazenamento protegido.
- **Aviso de segurança:** este projeto é educacional e não tem backend. O hash SHA-256 local **NÃO é segurança real** e não deve ser usado para proteger contas, credenciais ou dados sensíveis.
- O estado de disponibilidade de um vídeo externo não é completamente detectável sem a IFrame API, que não é usada. Um embed removido ou bloqueado pode não emitir um erro detectável pelo navegador.
- O projeto exige servidor HTTP local/HTTPS; `file://` não é suportado. Um script clássico exibe aviso e as páginas incluem `<noscript>`.

## 15. Testes manuais

Não há runner ou suíte automatizada configurados. Os arquivos em `js/dev/` são ferramentas opt-in e não são importados pelas páginas de produção:

- `js/dev/check-robustness.js`: verificações leves de funções puras; carregar como módulo no Console do navegador.
- `js/dev/check-videos.js`: imprime a contagem de vídeos sem ID por instrumento.
- `js/dev/devtools.js`: exemplos de formatação, contas isoladas e recuperação de dados para testes manuais. Use com cautela e restaure os dados de teste.

Checklist essencial:

1. Criar uma conta de teste, concluir onboarding e recarregar para verificar persistência das escolhas.
2. Concluir uma aula, confirmar XP uma única vez e conferir a liberação da próxima aula.
3. Finalizar um quiz e verificar que somente respostas corretas concedem XP.
4. Conferir conquista, perfil, calendário e sequência depois de estudar.
5. Testar login/logout com duas contas e duas abas; dados de alunos diferentes não devem se misturar.
6. Testar dado corrompido e limites de storage somente com dados de teste e backup salvo.
7. Sem IDs de vídeo, confirmar placeholder sem botão de play. Com ID real cadastrado, verificar que não há iframe antes do clique.
8. Testar as larguras e recursos assistivos descritos na seção [Acessibilidade e responsividade](#13-acessibilidade-e-responsividade).

## 16. Convenções de código e commits

- HTML semântico; CSS mobile first, tokens e BEM; JavaScript em ES Modules, funções pequenas e sem dependências.
- Nomes de arquivo em kebab-case; funções e variáveis JavaScript em camelCase.
- Interface em português do Brasil e identificadores técnicos em inglês.
- Commits seguem Conventional Commits: `tipo(escopo): descrição curta`, por exemplo `fix(css): restore desktop sidebar navigation`.

O histórico Git não foi consultado nesta revisão, portanto os exemplos são mensagens representativas das etapas, não afirmações de que esses commits foram criados. Para incluir mensagens reais, elas devem ser conferidas no histórico do repositório pelos responsáveis pelos commits.

## 17. Histórico de desenvolvimento

- [x] Fase 0 — Estrutura inicial e documentação.
- [x] Fase 1.1 — HTML da landing, cadastro e login.
- [x] Fase 1.2 — HTML do onboarding.
- [x] Fase 1.3 — HTML do dashboard e trilha.
- [x] Fase 1.4 — HTML da aula, jogos e quiz.
- [x] Fase 1.5 — HTML de músicas, conquistas e perfil.
- [x] Fase 2.1 — Fundação CSS: tokens, reset, tipografia e componentes.
- [x] Fase 2.2 — Estilos da landing e autenticação.
- [x] Fase 2.3 — Estilos do onboarding.
- [x] Fase 2.4 — Shell autenticado e navegação responsiva.
- [x] Fase 2.5 — Estilos do dashboard e trilha.
- [x] Fase 2.6 — Estilos de aula, jogos e quiz.
- [x] Fase 2.7 — Estilos de músicas, conquistas e perfil.
- [x] Fase 3.1 — Storage, estado, utilitários e dados.
- [x] Fase 3.2 — Autenticação local e onboarding.
- [x] Fase 3.3 — Navegação protegida, personalização, dashboard, perfil e sequência.
- [x] Fase 3.4 — Aulas, progresso e conclusão.
- [x] Fase 3.5 — Quiz Musical e área de jogos.
- [x] Fase 3.6 — Conquistas, músicas e calendário.
- [x] Fase 4.1 — Auditoria estática de responsividade.
- [x] Fase 4.2 — Auditoria estática de acessibilidade.
- [x] Fase 4.3 — Performance e consistência.
- [x] Fase 4.4-A — Aulas e mecanismo de vídeo para dez instrumentos.
- [x] Fase 4.4-B — Robustez de storage, sessão, entradas e fluxos.
- [x] Fase 4.5 — Revisão final e documentação.

## 18. Decisões, suposições e pendências

### Decisões e suposições consolidadas

- O projeto permanece frontend estático, sem backend, build ou dependências de runtime.
- O onboarding guarda escolhas e rascunho local; cada usuário tem seu progresso e mapa de progresso por instrumento.
- IDs antigos de aulas de Violão foram preservados para compatibilidade dos dados locais.
- A navegação desktop usa sidebar em `64rem`; telas menores usam navegação inferior.
- O acesso às aulas permanece progressivo: a Aula 1 inicia liberada e a conclusão libera a próxima. Essa foi a preferência confirmada para o estado atual.
- Vídeos são vinculados por aula/instrumento; só IDs reais devem ser cadastrados. A preferência é ter vídeo funcional em todas as aulas, mas os IDs ainda precisam ser fornecidos.
- A comparação visual final com capturas Figma não pode ser atestada neste README sem as imagens/renderizações correspondentes.

### Pendências conhecidas

- **120 vídeos:** todos os IDs ainda são `null`; é necessário receber e cadastrar os IDs reais específicos para cada instrumento e aula.
- **Marketing:** `index.html` anuncia “48 aulas”, enquanto o catálogo tem 120 (12 por instrumento). A landing também anuncia “+50 conquistas”, enquanto o código define 12; os textos de marketing divergem dos dados reais e não foram alterados nesta etapa documental.
- Jogos além do Quiz Musical estão “em breve”; há seis cards, mas somente o quiz é jogável.
- Músicas têm prática simulada, sem tela própria de reprodução ou cifra, e os acordes atuais são específicos de violão.
- A tela de resultado do quiz foi implementada, embora não houvesse frame correspondente do Figma informado.
- Capturas de tela e validação visual no navegador permanecem pendentes.
- A conta local não oferece segurança real nem sincronização entre dispositivos.

## 19. Próximos passos

- Cadastrar os IDs reais dos vídeos em `js/data/videos.js`.
- Atualizar e aprovar as contagens exibidas na landing.
- Criar uma tela de música com playback/cifra e adaptar repertório por instrumento.
- Implementar os demais jogos e desafios.
- Adicionar uma opção de troca de instrumento, preservando o progresso por percurso.
- Considerar backend, autenticação real e sincronização entre dispositivos antes de tratar contas como seguras.
- Avaliar build/minificação e PWA/offline caso o escopo deixe de exigir arquivos estáticos sem etapa de build.
- Escolher uma licença apropriada para o projeto; nenhum arquivo `LICENSE` foi criado.
- Adicionar testes automatizados repetíveis além das verificações manuais atuais.

## 20. Créditos

**Projeto Integrador de Ciência da Computação**

Criadores:

- Pedro Henrique Gomes
- Guilherme Oliveira de Santana
