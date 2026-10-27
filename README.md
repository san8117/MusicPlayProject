# MUSICPLAY

## Visão geral

O MUSICPLAY é uma plataforma web gamificada para aprender instrumentos musicais. O projeto busca resolver a dificuldade de manter uma rotina de estudos musicais clara, progressiva e motivadora, reunindo trilhas, aulas, exercícios, jogos, quizzes, músicas e conquistas em uma experiência acolhedora. Sua proposta de valor é adaptar o percurso ao instrumento e ao progresso de cada aluno, oferecendo objetivos acessíveis, feedback imediato e reconhecimento por cada avanço.

## Público-alvo

Crianças, jovens e adultos que desejam iniciar ou desenvolver seus estudos musicais.

## Instrumentos suportados

- Violão
- Teclado
- Piano
- Bateria
- Guitarra
- Violino
- Flauta
- Cavaquinho
- Ukulele
- Sanfona/acordeão

## Stack e restrições

- HTML5 semântico, CSS3 puro e JavaScript puro (ES6+ com ES Modules).
- Sem frameworks, bibliotecas de CSS, build step ou backend.
- Os dados dos alunos e o progresso ficam no navegador, em `localStorage`.
- Sem dependências externas ou CDNs, exceto Google Fonts (Poppins e Inter).
- As páginas que usam ES Modules devem ser executadas por servidor estático; não oferecer suporte a `file://`.
- Senhas não ficam em texto puro: o protótipo usa hash SHA-256 por `crypto.subtle`. Isso não torna autenticação local segura (detalhes em [Autenticação](#autenticação)).

## Abordagem responsiva

Desenvolver mobile first, considerando aproximadamente 360 px como largura inicial. Aumentar a composição com media queries `min-width` nos breakpoints previstos:

| Breakpoint | Uso previsto |
|---|---|
| 640 px | Ajustes para telas móveis maiores |
| 768 px | Composição intermediária/tablet |
| 1024 px | Layout desktop e navegação lateral |
| 1280 px | Ajustes para desktop amplo |

Os breakpoints são referências de projeto; cada componente deve responder ao espaço disponível sem perder legibilidade ou funcionalidade.

## Telas do projeto

| Tela | Arquivo | Acesso | Descrição |
|---|---|---|---|
| Landing | `index.html` | Pública | Apresenta a proposta do MUSICPLAY e direciona para cadastro ou login. |
| Cadastro | `pages/signup.html` | Pública | Cria uma conta local com nome, e-mail e senha. |
| Login | `pages/login.html` | Pública | Acesso local com e-mail e senha; tela simples no estilo do cadastro. |
| Onboarding | `pages/onboarding.html` | Pública / preparação da conta | Fluxo em três passos: instrumento, nível e objetivos. |
| Dashboard | `pages/dashboard.html` | Logada | Saudação personalizada, resumo do progresso e acesso às áreas de estudo. |
| Aprender (trilha) | `pages/learn.html` | Logada | Mostra a jornada progressiva e as aulas liberadas para o instrumento escolhido. |
| Aula | `pages/lesson.html` | Logada | Conteúdo da aula, objetivos, teoria, exercício e conclusão. |
| Jogos | `pages/games.html` | Logada | Área de jogos musicais. |
| Quiz | `pages/quiz.html` | Logada | Quiz Musical com perguntas, feedback e resultado. |
| Músicas | `pages/songs.html` | Logada | Área de músicas para estudo. |
| Conquistas | `pages/achievements.html` | Logada | Conquistas obtidas e ainda não desbloqueadas. |
| Perfil | `pages/profile.html` | Logada | Dados do aluno, estatísticas e calendário “Sequência de estudos”. |

O onboarding ocorre depois do cadastro e antes da experiência autenticada principal. A classificação na tabela indica se a tela requer navegação de app; o onboarding não deve exibir essa navegação.

## Fluxo do usuário

1. A pessoa conhece a proposta na landing page e escolhe cadastro ou login.
2. No cadastro, informa nome, e-mail e senha; após cadastro bem-sucedido, segue para o onboarding.
3. No onboarding, escolhe instrumento, nível e objetivos.
4. A aplicação cria ou carrega o perfil e o progresso local daquele e-mail.
5. O aluno acessa o dashboard e pode seguir para a trilha, aulas, jogos, quiz, músicas, conquistas ou perfil.
6. Aulas e atividades atualizam XP, sequência e conquistas conforme as regras implementadas.
7. Em acessos seguintes, o aluno pode entrar pela tela de login e retomar seu próprio progresso.

## Navegação

As páginas públicas (landing, cadastro, login e onboarding) não exibem navegação do app. Nas páginas logadas, a marcação HTML de navegação é compartilhada entre larguras; CSS define sua apresentação:

- **Mobile:** barra inferior fixa com seis itens: Início, Aprender, Jogos, Músicas, Conquistas e Perfil.
- **Desktop (a partir de 1024 px):** sidebar lateral com os mesmos seis itens.
- O item atual deve ter indicação visual e acessível de estado ativo.
- Ignorar o frame do Figma que mostra a sidebar dentro de um celular; é um erro de design.
- Usar SVG de nota musical para Músicas e SVG de usuário para Perfil. Os círculos mostrados nesses ícones no Figma parecem ser ícones quebrados.

## Identidade visual

Confirmar a aparência com as telas anexadas do Figma antes de implementar interfaces. Direção visual e tokens previstos:

| Token previsto | Valor/direção |
|---|---|
| `--color-background` | Quase preto com tom azulado/roxo |
| `--color-surface` | Azul-marinho escuro para cards |
| `--color-border` | Borda sutil sobre superfícies escuras |
| `--color-primary` | Roxo vibrante |
| `--color-brand-gradient` | Gradiente de roxo para ciano na marca MUSICPLAY |
| `--color-accent-streak` | Laranja para sequência |
| `--color-accent-xp` | Amarelo para XP |
| `--color-success` | Verde para sucesso/fácil |
| `--color-error` | Vermelho para erro/difícil |
| `--color-info` | Ciano para dicas e destaques |

Os nomes acima são rascunhos de design tokens, não valores finais de cor. A paleta e o contraste devem ser conferidos com as referências e atender WCAG AA.

- **Tipografia:** títulos em Poppins bold; textos em Inter. Google Fonts é a única exceção permitida à regra contra CDNs.
- **Botão primário:** roxo com gradiente e brilho; secundário escuro com borda.
- **Cards:** azul-marinho escuro, borda sutil e cantos arredondados.
- **Ícones:** SVG inline, com estilo e espessura de traço consistentes. Emojis somente onde o Figma os utiliza.

## Personalização por aluno

Os dados mostrados nas telas do Figma — João Silva, 850 XP, quatro dias de sequência, Nível 3 e “Setembro 2024” — são apenas exemplos de layout. Não devem ser fixados como conteúdo de todos os usuários nem como estado inicial.

### Nome e apresentação

- O nome vem do cadastro. No dashboard, a saudação usa o primeiro nome (por exemplo, “Olá, Guilherme! 👋”); no perfil aparecem nome completo, e-mail e avatar com a inicial.
- Normalizar o nome: aplicar `trim`, reduzir espaços duplicados e capitalizar as palavras. As partículas “de”, “da” e “do” ficam minúsculas (ex.: “guilherme souza” → “Guilherme Souza”).
- A saudação do primeiro acesso é “Bem-vindo, [primeiro nome]!”; nos acessos seguintes é “Bem-vindo de volta”.
- O marcador `progress.firstAccessSeen` registra se a primeira saudação do dashboard já foi exibida.
- No HTML, usar marcadores como `data-user="first-name"`, `data-user="full-name"`, `data-user="email"`, `data-user="initial"`, `data-user="xp"` e `data-user="streak"`. O texto inicial deve ser neutro, como “Aluno”, nunca “João”.
- Inserir valores do aluno com `textContent`; não usar `innerHTML` com dados do usuário.

### Estado inicial, instrumento e progresso

- Um aluno novo começa com 0 XP, 0 dias de sequência, Nível 1, 0 conquistas e somente a Aula 1 liberada.
- O progresso é isolado por aluno, inclusive quando várias contas são usadas no mesmo navegador.
- O instrumento do onboarding personaliza a trilha (por exemplo, “a jornada progressiva do violão”), os títulos de nível (por exemplo, “Violonista Iniciante” ou “Pianista Intermediário”) e o conteúdo.
- Estados vazios devem ser amigáveis e orientar o próximo passo, por exemplo: “Complete sua primeira aula para ganhar sua primeira conquista 🏆” e “Você ainda não estudou este mês, que tal começar hoje?”.

## Autenticação

Cadastro e login são locais, demonstrativos e armazenados no navegador. A senha não pode ser armazenada em texto puro: calcular seu hash com `crypto.subtle` e SHA-256. A experiência deve oferecer mostrar/ocultar senha e validação acessível dos campos.

**Aviso de segurança:** hash SHA-256 no navegador, sem backend, salt/gerenciamento de credenciais e controles de servidor, não constitui autenticação segura. Os dados podem ser inspecionados ou alterados pelo usuário no próprio navegador. Trata-se de um projeto educacional, não apropriado para proteger contas ou informações reais.

Na Etapa 3.2, o cadastro exige nome e sobrenome com no mínimo duas letras cada, e-mail válido, senha de no mínimo seis caracteres e aceite dos termos. Os erros são mostrados junto ao campo e o primeiro inválido recebe foco; e-mail repetido recebe mensagem geral amigável. O login mostra a mensagem genérica “Não encontramos essa combinação de e-mail e senha. Confira e tente de novo.” quando a combinação não confere. Se Web Crypto não estiver disponível, a interface orienta abrir a aplicação em localhost ou HTTPS.

## UX e acessibilidade

- Tom acolhedor e encorajador, em segunda pessoa informal (“você”); erros não culpam a pessoa. Exemplo: “Ops, esse e-mail parece incompleto. Exemplo: nome@email.com”.
- Formulários validam ao sair de cada campo e ao enviar. Informar erros abaixo do campo, aplicar estado visual de erro, `aria-invalid` e foco no primeiro campo inválido ao enviar.
- Todo campo deve ter label. Fornecer botão para mostrar/ocultar senha.
- Um botão desabilitado deve explicar o motivo (por exemplo, “Escolha um instrumento para continuar”).
- Alvos de toque de pelo menos 44 px; nenhuma ação pode depender somente de hover.
- Garantir landmarks, hierarquia correta de títulos, foco visível, uso por teclado e contraste WCAG AA.
- Cor nunca é a única forma de transmitir estado: combinar com texto ou ícone, como ✓ e ✕.
- Feedback dinâmico importante, incluindo ganho de XP, subida de nível e nova conquista, usa toast com `role="status"`.
- Feedback de resposta do quiz fica em região `aria-live`.
- Listas devem contemplar estados vazio, carregando e erro.
- Confirmar antes de sair de um quiz em andamento.

## Quiz Musical

O quiz usa o título “Quiz Musical 🧠”, badge de XP (por exemplo, “⭐ 0 XP”), barra de três segmentos, contador (por exemplo, “1 / 3”), card com ❓ vermelho, pergunta e quatro alternativas A, B, C e D organizadas em grade 2 × 2. A barra avança a cada pergunta.

| Estado | Apresentação e comportamento | XP |
|---|---|---|
| Sem resposta | Alternativas neutras e clicáveis. | Sem alteração. |
| Errou | Alternativa escolhida em vermelho, com borda e fundo rosado; correta em verde; demais neutras; alternativas travadas. Exibir caixa vermelha “❌ Não foi dessa vez...” com explicação e botão “Próxima pergunta →”. | Não ganha XP. |
| Acertou | Alternativa escolhida em verde. Exibir caixa verde “✅ Resposta correta!”, “+20 XP ganhos! 🎉” e explicação; atualizar badge de XP com animação leve e botão “Próxima pergunta →”. | Ganha 20 XP. |

Na última pergunta, o botão passa a ser “Ver resultado”. A tela de resultado não existe no Figma; a marcação existente registra uma proposta simples com acertos, XP, taxa de acerto, opção de jogar novamente e retorno aos jogos. O resultado deve ser tratado como suposição de produto e pode ser ajustado após validação com os responsáveis. O estado de resposta é comunicado em região `aria-live`.

## Aula

Composição para mobile e desktop, nesta ordem:

1. Link “← Voltar para a trilha”.
2. Badges de Módulo, Aula e +XP.
3. Título e descrição.
4. Metadados: minutos, objetivos e nível.
5. Player como placeholder visual com HD, botão play, 0:00 e duração; não há vídeo real.
6. Card “Objetivos da aula”.
7. Card “Conteúdo teórico resumido”, com três cartões de acorde: Am roxo, Em ciano e C verde.
8. Card “Agora é sua vez! 🎸” com botão “Iniciar exercício prático”.
9. Rodapé com “✓ Marcar como concluída” e “Próxima aula →” lado a lado.

Ao concluir a aula, mostrar toast “+40 XP”, alterar o botão para “Concluída ✓” e liberar a próxima aula.

## Gamificação

### XP, níveis e sequência

- Novo aluno começa com 0 XP e Nível 1.
- Resposta correta do quiz concede 20 XP; resposta incorreta não altera XP.
- Concluir uma aula concede 40 XP.
- Ganho de XP, subida de nível e conquista nova devem ter feedback imediato por toast acessível.
- A sequência conta dias de estudo e começa em zero. A tabela de XP foi definida na Etapa 3.1; a regra implementada na Etapa 3.3 mantém a contagem se o último estudo foi hoje ou ontem e a zera visualmente após um intervalo maior, sem apagar o histórico.

### Conquistas previstas

Implementar as 12 conquistas apresentadas no Figma, sem desbloqueá-las para alunos novos:

1. Primeira Aula
2. 3 Dias Seguidos
3. 100 XP
4. Primeira Nota
5. Primeiro Acorde
6. Mestre das Notas
7. 7 Dias Seguidos
8. Atirador Certeiro
9. Primeira Música
10. Velocista
11. 100 Questões
12. Módulo Completo

Os critérios precisos de desbloqueio devem corresponder às atividades do produto e às referências disponíveis; onde não houver definição suficiente, confirmar antes de assumir regras.

## Estrutura de pastas

Árvore prevista para o projeto. Pastas ainda vazias são mantidas no controle de versão com `.gitkeep`. A Fase 0 não cria HTML, CSS ou JavaScript de páginas.

```text
musicplay/
├── index.html                         # Landing page
├── .gitignore
├── .editorconfig
├── README.md
├── pages/
│   ├── signup.html                    # Cadastro
│   ├── login.html                     # Login
│   ├── onboarding.html                # Onboarding de três passos
│   ├── dashboard.html                 # Início da área logada
│   ├── learn.html                     # Trilha de aprendizagem
│   ├── lesson.html                    # Aula
│   ├── games.html                     # Jogos
│   ├── quiz.html                      # Quiz Musical
│   ├── songs.html                     # Músicas
│   ├── achievements.html              # Conquistas
│   └── profile.html                   # Perfil e sequência de estudos
├── assets/
│   ├── img/                           # Imagens locais
│   ├── icons/                         # Ícones e recursos SVG
│   └── fonts/                         # Fontes locais, se necessárias
├── css/
│   ├── base/                          # reset, tokens, typography, utilities
│   ├── layout/                        # container, grid, app-shell, sidebar, bottom-nav
│   ├── components/                    # button, card, form, progress, badge,
│   │                                  # stat-card, lesson-item, quiz-option,
│   │                                  # calendar, toast e componentes relacionados
│   ├── pages/                         # estilos específicos por página
│   └── main.css                       # somente @import
└── js/
    ├── main.js                        # ponto de entrada dos módulos
    ├── modules/                       # storage, state, utils, xp e módulos futuros
    ├── dev/
    │   └── devtools.js                # testes manuais no Console; não importado
    └── data/                          # instruments, lessons, quiz-questions,
                                       # achievements, songs, levels
```

## Convenções de código

- Classes CSS em BEM; design tokens em custom properties.
- CSS sem `!important`, seletores de ID ou aninhamento profundo; priorizar unidades relativas (`rem`, `%`, `fr` e `clamp`).
- ES Modules, sem variáveis globais, funções pequenas, delegação de eventos e atributos `data-*` para conectar HTML e JavaScript.
- Não usar `innerHTML` com dados fornecidos pelo usuário; preferir `textContent` e `createElement`.
- Nomes de arquivos, classes, funções e variáveis em inglês; textos de interface em português do Brasil.
- HTML semântico e acessível; ícones em SVG inline com espessura de traço consistente. Emojis apenas onde o Figma os utiliza.
- Manter o escopo em HTML, CSS e JavaScript nativos, sem frameworks, dependências ou etapa de build.
- Mensagens de commit no padrão Conventional Commits (ex.: `feat(quiz): add answer feedback states`).
- Não criar commits durante as etapas de implementação; os commits são feitos pelos criadores.

## Modelo de dados (`localStorage`)

A Etapa 3.1 implementa o armazenamento local versionado: `musicplay:v1` contém `schemaVersion` e o mapa de usuários indexado pelo e-mail normalizado; `musicplay:session` contém somente o e-mail da sessão atual. O progresso é isolado por conta. O wrapper recupera JSON corrompido, tenta remover a chave inválida e retorna fallback sem deixar erros de armazenamento escaparem.

```json
{
  "schemaVersion": 1,
  "users": {
    "aluno@email.com": {
      "name": "Guilherme Souza",
      "email": "aluno@email.com",
      "passwordHash": "sha256-em-hexadecimal",
      "createdAt": "2026-10-26T12:00:00.000Z",
      "onboardingDone": false,
      "instrument": null,
      "level": null,
      "goals": [],
      "onboardingDraft": {
        "step": 1,
        "instrument": null,
        "level": null,
        "goals": []
      },
      "progress": {
        "xp": 0,
        "level": 1,
        "streak": 0,
        "lastStudyDate": null,
        "firstAccessSeen": false,
        "studyDays": [],
        "unlockedLessons": ["lesson-1"],
        "completedLessons": [],
        "currentLessonId": "lesson-1",
        "lessonProgress": {},
        "gamesPlayed": 0,
        "quizStats": {
          "answered": 0,
          "correct": 0,
          "bestStreak": 0,
          "perfectQuizzes": 0
        },
        "songProgress": {},
        "unlockedAchievements": {},
        "studyMinutes": 0
      }
    }
  }
}
```

```json
"aluno@email.com"
```

O `level` no topo do usuário guarda a escolha do onboarding (`never-played`, `beginner` ou `some-experience`); `progress.level` é o nível numérico derivado do XP. Após cadastro bem-sucedido, `passwordHash` contém o SHA-256 em hexadecimal da senha, nunca a senha original. `onboardingDraft` salva passo e escolhas para retomar o fluxo após recarregar a página; ao concluir, o rascunho é limpo. Encerrar a sessão remove somente `musicplay:session`; `clearAll()` limpa somente as duas chaves do MUSICPLAY, sem afetar outros dados do navegador.

## Como rodar

Como o projeto usa ES Modules, abrir `index.html` diretamente por `file://` não é suportado. Servir a pasta do projeto por um servidor estático local:

1. Abrir a pasta no VS Code.
2. Iniciar a extensão Live Server (ou outro servidor estático local) na raiz do projeto.
3. Acessar no navegador o endereço local informado pelo servidor.

Não é necessário build ou backend. As páginas HTML referenciam `css/main.css` e `js/main.js`; a etapa 3.1 criou a base de módulos JavaScript, o armazenamento, o estado multiusuário e os dados iniciais. As próximas etapas conectam esse estado às interações da interface.

### Teste manual de cadastro, login e onboarding

1. Abra `pages/signup.html`, cadastre **Guilherme Oliveira** com um e-mail de teste, senha com pelo menos seis caracteres e aceite os termos; a conta deve iniciar o onboarding.
2. Selecione um instrumento e nível, avance, marque um ou mais objetivos e recarregue a página. O passo e as escolhas devem continuar selecionados.
3. Termine o onboarding; o fluxo deve abrir o dashboard. Vá ao Perfil e use **Sair**; a tela de login deve aparecer.
4. Entre com o mesmo e-mail e senha. Como o onboarding foi concluído, o destino deve ser o dashboard. Se errar e-mail ou senha, a mesma mensagem genérica deve aparecer.
5. Saia e tente cadastrar novamente o mesmo e-mail: a aplicação deve informar que já existe uma conta. Tente também uma senha curta e confirme a mensagem no campo, sem criação da conta.
6. Para exercitar o caso de e-mail repetido independentemente, `js/dev/devtools.js` contém comandos para criar usuários de teste isolados e removê-los ao final.
7. Esse arquivo também descreve testes de formatação de nome e recuperação de JSON corrompido, preservando o conteúdo anterior do storage. Não é importado pelas páginas.

### Teste manual da Etapa 3.3

1. Com uma conta recém-criada e onboarding concluído, abra o dashboard: confira “Bem-vindo, Guilherme!”, Nível 1, 0 XP, 0 dias e a indicação da Aula 1. Recarregue para conferir “Bem-vindo de volta”.
2. No perfil, confira nome, e-mail, inicial e os oito indicadores zerados; o calendário permanece no estado inicial até a Etapa 3.6.
3. Faça logout, tente abrir diretamente `pages/dashboard.html` sem sessão e confirme o redirecionamento ao login. Crie outra conta sem concluir o onboarding e tente abrir uma página logada; o destino deve ser onboarding.
4. Entre com dois e-mails diferentes no mesmo navegador, conclua onboarding com instrumentos distintos e confira que nome, instrumento, XP, aulas e demais dados não se misturam após logout/login.
5. Teste os itens de navegação: Aula deve ativar Aprender, Quiz deve ativar Jogos e apenas o link correspondente deve manter `aria-current="page"`. Recarregue páginas logadas para confirmar que a sessão continua e não ganha dias de estudo apenas por visita.

## Plano de desenvolvimento

Executar somente a etapa solicitada. Ao concluir cada etapa, parar, listar os arquivos alterados (incluindo este README), resumir decisões e suposições em 3 a 5 linhas, encerrar com “✅ Etapa X concluída. Pode fazer o commit.” e sugerir uma mensagem Conventional Commits. Esperar “continuar” antes de avançar. Não executar comandos Git.

Etapas de alto nível abaixo são um checklist de acompanhamento; a descrição de cada etapa é indicativa e pode ser refinada antes de seu início, sem adiantar implementação:

### Fase 0 — Setup e documentação

- [x] 0 — Estrutura inicial, arquivos de configuração e README completo (sem páginas HTML, CSS ou JS).

### Fase 1 — Estrutura HTML das páginas

- [x] 1.1 — HTML da landing page, cadastro e login.
- [x] 1.2 — HTML do onboarding de três passos.
- [x] 1.3 — HTML do dashboard e da trilha Aprender.
- [x] 1.4 — HTML da aula, jogos e Quiz Musical.
- [x] 1.5 — HTML de Músicas, Conquistas e Perfil.

### Fase 2 — Área do aluno e aprendizagem

- [x] 2.1 — Fundação CSS: tokens, reset, tipografia, utilitários e componentes base.
- [x] 2.2 — Estilos da landing page, cadastro e login.
- [x] 2.3 — Estilos do onboarding.
- [x] 2.4 — App shell autenticado e navegação responsiva.
- [x] 2.5 — Estilos do dashboard e da trilha Aprender.
- [x] 2.6 — Estilos da aula, jogos e Quiz Musical.
- [x] 2.7 — Estilos de Músicas, Conquistas e Perfil.

### Fase 3 — Dados e gamificação

- [x] 3.1 — Base JavaScript: storage, state, utilitários e dados.
- [x] 3.2 — Autenticação local e onboarding.
- [x] 3.3 — Navegação protegida, personalização, dashboard, perfil e base da sequência.
- [ ] 3.4 — Integração das ações de estudo e sequência nas atividades.
- [ ] 3.5 — Conquistas.
- [ ] 3.6 — Integração e feedback de estados.

### Fase 4 — Revisão e entrega

- [ ] 4.1 — Revisão de acessibilidade e navegação por teclado.
- [ ] 4.2 — Revisão responsiva contra referências do Figma.
- [ ] 4.3 — Validação de persistência e isolamento entre alunos.
- [ ] 4.4 — Revisão de conteúdo, estados vazios e mensagens.
- [ ] 4.5 — Verificação final e documentação.

## Decisões e suposições

### Decisões

- A Etapa 1.1 cria somente HTML para landing, cadastro e login; CSS e JavaScript ficam para etapas posteriores.
- As três páginas incluem links previstos para `css/main.css` e `js/main.js`, conforme o padrão solicitado para todas as páginas.
- O cadastro solicita nome, sobrenome, e-mail, senha com mínimo de seis caracteres e aceite dos termos; login solicita e-mail e senha.
- Os formulários têm labels, parágrafos de erro ligados por `aria-describedby`, regiões de feedback acessíveis e controles de mostrar/ocultar senha.
- A landing apresenta os destaques definidos, quatro passos do fluxo e seis recursos baseados nas áreas já previstas para o produto.
- O onboarding é uma única página com três seções de etapa; somente a etapa inicial fica visível no HTML e os controles de avanço e conclusão começam desabilitados, com texto explicativo associado por `aria-describedby`.
- As escolhas de instrumento e nível são grupos de radio com seleção única; objetivos são checkboxes de seleção múltipla. A página não inclui navegação do app.
- Dashboard e Aprender compartilham a mesma marcação de navegação com seis itens e ícones SVG em traço consistente; cada página marca o item atual com `aria-current="page"`.
- O dashboard usa valores neutros de aluno novo, mantém o estado vazio de conquistas oculto por padrão e oferece marcadores `data-*` para preenchimento posterior.
- A trilha apresenta as sete aulas especificadas, com a Aula 1 em andamento e as demais bloqueadas; o progresso total permanece em 0 / 12 e não foram inventadas as cinco aulas não descritas.
- Aula, Jogos e Quiz repetem a mesma navegação autenticada de seis itens; a Aula ativa Aprender e Jogos/Quiz ativam Jogos.
- A página da aula usa conteúdo de “Primeiros Acordes” como exemplo preenchido por padrão, marcadores `data-lesson`, player visual sem vídeo e cartões Am, Em e C com posições dos dedos.
- O Quiz contém marcação para pergunta, alternativas, feedback correto/incorreto, avanço, resultado e confirmação de saída; os estados que não são iniciais ficam `hidden`.
- Músicas, Conquistas e Perfil repetem a marcação padrão da navegação logada e indicam o item ativo com `aria-current="page"`.
- A biblioteca de músicas inicia com oito cartões e progresso 0%; filtros e ações têm atributos para integração posterior, sem carregar biblioteca ou serviço externo nesta etapa HTML.
- Conquistas inicia com 0 desbloqueadas e 12 bloqueadas. Datas de desbloqueio não são copiadas dos exemplos visuais do Figma; os campos ficam preparados para receber datas reais quando o aluno desbloquear cada conquista.
- Perfil inicia sem dados pessoais reais, com estatísticas zeradas e contêiner de calendário vazio para preenchimento dinâmico.
- A fundação CSS usa tokens `--color-*`, `--font-*`, `--space-*`, `--radius-*`, `--shadow-*`, `--z-index-*` e `--duration-*`; cores e proporções iniciais foram aproximadas visualmente a partir das capturas do Figma.
- A tipografia usa Poppins para títulos e Inter para textos via Google Fonts com `display=swap`, importadas pela folha `typography.css`, sem alterar a estrutura HTML.
- `css/main.css` contém somente imports, agrupados na ordem base, layout, componentes e páginas; folhas de layout e páginas ainda não implementadas foram criadas como reservas importadas.
- Componentes base incluem botões, cards, formulários, badges, progresso e toasts, com estados acessíveis, foco visível, transições e respeito a `prefers-reduced-motion`.
- A Etapa 2.2 estiliza a landing e as páginas de cadastro e login sem alterar a semântica HTML; foi adicionado apenas um `span` no título da landing para aplicar o gradiente somente a “forma incrível”.
- Os destaques da landing passam de uma coluna para três em 768 px; etapas passam a quatro colunas em 1024 px; recursos ficam em duas colunas no mobile e três em 768 px.
- O botão “Entrar” do cabeçalho da landing fica oculto até 640 px. A área de autenticação coloca nome e sobrenome lado a lado no mobile e, em desktop, mantém o título à esquerda e o formulário em card à direita.
- Os estados de erro das páginas de autenticação reaproveitam os estilos de `.form-field` e acrescentam um ícone de alerta antes da mensagem não vazia; os botões e cards reutilizam os componentes compartilhados.
- O onboarding foi estilizado sem alterações no HTML, com progresso e marca centralizados, passos responsivos e opções construídas sobre os componentes base de card, botão e progresso.
- Os ícones dos instrumentos, níveis e objetivos são emojis decorativos gerados em CSS, pois os labels existentes não continham elementos de ícone; os textos associados continuam sendo o nome acessível de cada opção.
- Inputs de escolha permanecem focáveis por teclado, visualmente ocultos sem `display: none`, com foco visível aplicado ao card; estados selecionados incluem borda, brilho e marca de seleção.
- No onboarding, instrumentos usam uma coluna no mobile e duas a partir de 768 px; níveis passam a três colunas nesse breakpoint; objetivos permanecem em uma grade 2 × 2.
- A entrada do passo ativo recebe uma animação curta respeitando `prefers-reduced-motion`; a área permanece sem navegação do app.
- O shell autenticado usa `--bottom-nav-height: 4.5rem` para reservar espaço à navegação inferior, somando `env(safe-area-inset-bottom, 0px)` tanto no conteúdo quanto na barra.
- A partir de 1024 px (`64rem`), `--sidebar-width: 15rem` define uma sidebar fixa com scroll interno; abaixo desse breakpoint, a mesma navegação torna-se barra inferior fixa com seis colunas.
- Os estilos de navegação compartilham `.app-nav__*`; ícones SVG são normalizados em 24 px no mobile e 20 px na sidebar, com cor por `currentColor`, foco visível e estado ativo reforçado por indicador não cromático.
- Foram conferidas as oito páginas logadas: todas têm um `<nav class="app-nav">` com os mesmos seis destinos, logo e estrutura de lista; cada uma muda somente o link com `aria-current="page"` conforme sua área. Músicas usa nota musical e Perfil usa usuário, ambos SVGs com `stroke="currentColor"` e traço 1.8.
- A Etapa 2.5 estiliza Dashboard e Aprender com os componentes reutilizáveis de estatísticas, cards, badges, botões e progresso, respeitando o shell autenticado da Etapa 2.4.
- Os cards estatísticos têm valores com numerais tabulares e acentos de cor; os ícones decorativos da dashboard são aplicados por pseudo-elementos sem introduzir marcação ou alterar o HTML.
- No dashboard, estatísticas mantêm três colunas inclusive em telas estreitas; recomendações passam a três colunas e atalhos a quatro em 768 px. Em desktop, continuar e dica ficam lado a lado, assim como atalhos e conquistas recentes.
- O estado vazio de conquistas recentes usa um card discreto quando exibido; a lista prevê rolagem horizontal interna para não ampliar a página.
- Na trilha, estados `completed`, `current` e `locked` recebem sinais visuais e textuais/ícones; módulos ficam em duas colunas a partir de 1024 px. Inputs, estados e estrutura HTML existentes foram preservados.
- O HTML da trilha só fornece o texto “Em andamento” para a aula atual e não define percentual de conclusão; o CSS não inventa “75%”, mantendo coerência com o progresso inicial zerado. Uma porcentagem poderá ser exibida quando o HTML/JS fornecer um valor real.
- A Etapa 2.6 estiliza Aula, Jogos e Quiz reutilizando o shell, badges, cards, botões e progresso. A aula usa uma coluna no mobile e, a partir de 1024 px, distribui player/prática/ações à esquerda e objetivos/acordes à direita.
- Na página Jogos, os cards formam uma coluna no mobile e duas a partir de 768 px; o destaque usa um emoji de guitarra decorativo por pseudo-elemento. Os selos mantêm o nome da dificuldade visível e usam cor como reforço, não como único sinal.
- O Quiz mantém opções em grade 2 × 2, com estados de resposta preparados por `.quiz-option--correct` / `.quiz-option--incorrect` ou `data-state="correct"` / `data-state="incorrect"`; travamento usa `disabled` ou `aria-disabled="true"`. O feedback utiliza as variantes existentes e o atributo `hidden`.
- O pulso do XP pode ser ativado por `.quiz-header__xp--updated` ou `data-state="updated"`; movimento é removido com `prefers-reduced-motion`. Resultado e diálogo foram estilizados usando as classes e elementos já existentes.
- O botão de conclusão da aula aceita `data-state="completed"` ou `.lesson-actions__complete--completed` como gancho futuro; a marcação HTML inicial não define esse estado. Nenhuma estrutura HTML foi alterada nesta etapa.
- A Etapa 2.7 estiliza Músicas, Conquistas e Perfil sem alterar HTML, reutilizando os componentes de botão, card, badge, progresso, estatísticas e o app shell.
- Os filtros de música usam `aria-pressed`; o JS pode usar `data-level="beginner|intermediate|advanced"` e `.song-card[data-state="studied|completed|locked|error"]` (ou modificadores equivalentes) para os estados. Conquistas usam `.achievement-card[data-state="unlocked|locked"]`, `data-achievement-id` e classes/atributos de cor opcionais.
- As células do calendário devem ser geradas pelo JS com `.study-calendar__day`, `.study-calendar__day--studied`, `.study-calendar__day--today` e `.study-calendar__day--empty` (ou atributos equivalentes descritos no CSS). O HTML não contém cabeçalho dos dias da semana, por isso ele não foi acrescentado por CSS nem por mudança estrutural.
- No perfil desktop, dados do aluno e nível ficam à esquerda, estatísticas à direita e calendário em largura total; o grid de estatísticas permanece em duas colunas para caber na coluna lateral sem comprimir rótulos.
- Todas as etapas de implementação de CSS da Fase 2 (2.1–2.7) estão concluídas; a comparação visual com as capturas continua no checklist de revisão final 4.2.
- As imagens do Figma não estão disponíveis como arquivos no workspace; os estilos seguem as especificações fornecidas, mas a comparação visual renderizada permanece para a revisão final da Etapa 4.2.
- A Etapa 3.1 cria ES Modules para storage, estado, utilitários, XP e dados. Os testes de console ficam em `js/dev/devtools.js`, fora dos imports das páginas.
- O storage guarda o objeto `{ schemaVersion, users }` em `musicplay:v1` e o e-mail da sessão em `musicplay:session`. As funções retornam fallback, booleano, `false` ou `null` em erros, removem somente a chave de aplicação inválida quando possível e nunca apagam outras chaves do navegador.
- A conta guarda `level` da escolha de onboarding; `progress.level` representa o nível numérico de XP. O progresso inicial possui 0 XP, nível 1, sequência zerada e somente `lesson-1` liberada; cópias são devolvidas para evitar mutações acidentais.
- Os dados imutáveis incluem dez instrumentos, três níveis e quatro objetivos, sete aulas disponíveis na trilha de violão (com conteúdo detalhado da Aula 4), três perguntas e sete músicas originais do Figma. Instrumentos sem conteúdo de aula recebem lista vazia; a música “Brilha, Brilha, Estrelinha”, adicionada anteriormente para completar oito cards HTML, não entra no conjunto fonte solicitado de sete faixas.
- As faixas de XP são 0, 100, 250, 450, 700 e 1.000 XP para os níveis 1 a 6; acima disso, a progressão extrapola em incrementos de 300 XP. Títulos são Iniciante até o nível 3, Intermediário do 4 ao 6 e Avançado a partir do 7.
- Duas perguntas adicionais de violão foram criadas para completar o mínimo solicitado de três. Regras sem critério explícito foram assumidas como: primeira nota tocada, primeiro acorde aprendido e conclusão de aula em até 10 minutos para “Velocista”.
- A etapa não altera HTML/CSS nem adiciona dependências; a chave de sessão separada preserva o modelo já documentado e a implementação usa apenas APIs nativas do navegador.
- A Etapa 3.2 implementa cadastro e login em ES Modules, hashing SHA-256 via Web Crypto e sessão local. O comentário de `auth.js` alerta que o hash no cliente, sem backend, não oferece segurança real; sem `crypto.subtle`, a interface recebe uma mensagem que orienta usar localhost ou HTTPS.
- Cadastro valida nome e sobrenome com letras Unicode (mínimo duas letras em cada), e-mail, senha de pelo menos seis caracteres e aceite dos termos. Login valida e-mail/senha e apresenta mensagem genérica para combinação incorreta, sem revelar qual dado falhou.
- Erros por campo são associados aos elementos já existentes por `data-field-error`, `aria-invalid` e `.form-field--error`; o primeiro inválido recebe foco. Os formulários validam no blur, durante edição de campos com erro e no envio. O feedback geral informa e-mail repetido e falhas de persistência sem culpar a pessoa.
- A visibilidade de senha atualiza o tipo, o rótulo acessível e `aria-pressed`. Durante o envio, o botão mostra “Criando sua conta...” ou “Entrando...”; links da landing já apontavam para cadastro e login corretos.
- Na Etapa 3.2, `main.js` identificava as telas públicas pelo caminho. A Etapa 3.3 adiciona `data-page` ao `<body>` das 12 páginas e roteia cada tela por esse identificador. Rotas relativas funcionam tanto na raiz quanto em `pages/`; logout continua ligado uma única vez por delegação quando a página contém `data-action="logout"`.
- O wizard salva instrumento, nível, objetivos e passo em `onboardingDraft` a cada escolha/avanço, restaura os controles no retorno, atualiza progresso e foco do título e só conclui com ao menos um objetivo. “48 aulas disponíveis” vem dos dados do violão e é atualizado no ponto já existente do HTML.
- As páginas já têm os pontos de ligação necessários; não houve mudança em HTML ou CSS. Não foi iniciada a autenticação de servidor, que não faz parte deste projeto sem backend.
- A Etapa 3.3 protege as oito páginas logadas: sem sessão, direciona para login; com onboarding incompleto, direciona para onboarding. A navegação ativa mantém `aria-current="page"` e Aula/Aprender e Quiz/Jogos compartilham seus destinos de navegação.
- A personalização global preenche os marcadores `data-user` por `textContent`, deriva nível/título a partir do XP e do instrumento e mostra a saudação de primeiro acesso uma única vez. O dashboard destaca a aula atual ou a Aula 1, recomenda a próxima aula, um jogo e uma música compatível com o nível escolhido, e mantém a mensagem vazia de conquistas quando não há desbloqueios.
- O perfil calcula aulas, músicas concluídas, jogos, taxa de acerto, sequência, XP, conquistas e tempo de estudo; valores de tempo são exibidos como `0min`, `45min` ou `3h 20min`. O calendário permanece sem integração nesta etapa para ser conectado na 3.6.
- A sequência usa datas locais `YYYY-MM-DD`: estudar hoje ou ontem mantém a contagem consecutiva; se o último estudo foi anteontem ou antes, a sequência exibida é zero sem apagar o histórico. `registerVisit()` recalcula a sequência sem registrar estudo; somente `registerStudy()` acrescenta o dia, no máximo uma vez por data.
- O registro das datas e o cálculo da sequência são separados para permitir testes com datas fornecidas; as atividades das etapas posteriores devem chamar `registerStudy()` somente após uma ação real de estudo, nunca ao abrir uma página.

### Suposições

- Na Etapa 1.1, as imagens do Figma não estavam acessíveis nos arquivos do projeto; o HTML daquela etapa seguiu a estrutura e os textos descritos no pedido, e a fidelidade visual ainda deve ser conferida com as referências antes da estilização.
- A página de login não tem tela de referência no Figma; foi criada no mesmo padrão estrutural do cadastro, com e-mail, senha, ação de entrar e link para criar conta.
- O checklist 1.1–1.5 foi alinhado à divisão de etapas informada para esta implementação; as páginas futuras continuam pendentes.
- O detalhe “48 aulas disponíveis” é exibido somente para Violão, como exemplo informado, sem inferir a quantidade de aulas dos outros instrumentos.
- Como a trilha fornecida descreve apenas sete das 12 aulas totais, as cinco restantes não foram nomeadas ou representadas como conteúdo inventado.
- A tela de resultado do Quiz não consta no Figma; para cumprir a etapa, foi proposta uma composição no mesmo padrão semântico, com acertos, XP, taxa de acerto, opção de jogar novamente e retorno aos jogos.
- A página Jogos apresenta descrições textuais para os títulos fornecidos; os outros jogos ainda são links demonstrativos até suas experiências serem implementadas.
- A lista de músicas solicitada enumera sete títulos distintos; para completar oito entradas, foi incluída “Brilha, Brilha, Estrelinha” (Tradicional), uma escolha estática de repertório tradicional, sem integração a catálogo ou biblioteca externa.
- Os exemplos de datas de desbloqueio exibidos nas capturas do Figma representam dados de demonstração; no HTML de aluno novo, todos os registros começam bloqueados e sem uma data de desbloqueio.
- A composição visual das páginas estilizadas foi implementada a partir da identidade e dos requisitos descritos; a comparação pixel a pixel com as capturas ainda precisa ser feita na revisão responsiva da Etapa 4.2.

## Pendências conhecidas

- Conferir a renderização responsiva de todas as telas contra o Figma na Etapa 4.2, quando as capturas de referência estiverem acessíveis.
- Os critérios de algumas conquistas sem definição explícita no Figma continuam sendo as suposições já documentadas e poderão ser ajustados durante a implementação da Etapa 3.5.
- SHA-256 local é somente uma demonstração educacional, não uma proteção de contas ou senhas reais.

## Créditos

**Projeto Integrador de Ciência da Computação**

Criadores:

- Pedro Henrique Gomes
- Guilherme Oliveira de Santana
