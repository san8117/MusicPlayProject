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

Na última pergunta, o botão passa a ser “Ver resultado”. A tela de resultado não existe no Figma: sua proposta deverá ser apresentada e alinhada antes de implementar a tela, sem inventar detalhes visuais que dependam de referências ausentes. O estado de resposta é comunicado em região `aria-live`.

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
- A sequência conta dias de estudo e começa em zero. A regra exata para calcular XP por nível e continuidade da sequência ainda precisa ser definida antes de implementar essas mecânicas.

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
├── index.html                         # Landing page (etapa posterior)
├── .gitignore
├── .editorconfig
├── README.md
├── pages/
│   ├── signup.html                    # Cadastro (etapa posterior)
│   ├── login.html                     # Login (etapa posterior)
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
    ├── modules/                       # storage, state, auth, onboarding, quiz,
    │                                  # lessons, achievements, xp, navigation,
    │                                  # calendar, toast, ui
    └── data/                          # instruments, lessons, quiz-questions,
                                       # achievements, songs
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

Rascunho inicial; validar e implementar em uma etapa própria. Guardar os dados de todos os usuários na chave versionada `musicplay:v1` e o identificador do usuário autenticado na chave separada `musicplay:session`. O progresso pertence ao usuário correspondente e não pode ser compartilhado acidentalmente entre contas.

```json
{
  "schemaVersion": 1,
  "users": {
    "aluno@email.com": {
      "profile": {
        "fullName": "Guilherme Souza",
        "email": "aluno@email.com",
        "instrument": "guitar",
        "level": "beginner",
        "goals": []
      },
      "credentials": {
        "passwordHash": "sha256-hash"
      },
      "progress": {
        "xp": 0,
        "level": 1,
        "streakDays": 0,
        "lastStudyDate": null,
        "unlockedLessons": ["lesson-1"],
        "completedLessons": [],
        "achievements": [],
        "quizStats": {
          "answered": 0,
          "correct": 0
        },
        "studyDates": []
      },
      "createdAt": "ISO-8601",
      "lastLoginAt": null
    }
  }
}
```

```json
{
  "userEmail": "aluno@email.com"
}
```

`musicplay:v1` contém o objeto versionado com contas e progresso. `musicplay:session` contém somente a referência à conta atual; encerrar a sessão remove essa referência, sem apagar os dados de progresso. O formato acima é um rascunho de documentação, não uma implementação nem garantia de segurança.

## Como rodar

Como o projeto usa ES Modules, abrir `index.html` diretamente por `file://` não é suportado. Servir a pasta do projeto por um servidor estático local:

1. Abrir a pasta no VS Code.
2. Iniciar a extensão Live Server (ou outro servidor estático local) na raiz do projeto.
3. Acessar no navegador o endereço local informado pelo servidor.

Não é necessário build ou backend. As páginas serão adicionadas nas etapas de implementação; até lá, a estrutura de setup pode não conter uma aplicação navegável.

## Plano de desenvolvimento

Executar somente a etapa solicitada. Ao concluir cada etapa, parar, listar os arquivos alterados (incluindo este README), resumir decisões e suposições em 3 a 5 linhas, encerrar com “✅ Etapa X concluída. Pode fazer o commit.” e sugerir uma mensagem Conventional Commits. Esperar “continuar” antes de avançar. Não executar comandos Git.

Etapas de alto nível abaixo são um checklist de acompanhamento; a descrição de cada etapa é indicativa e pode ser refinada antes de seu início, sem adiantar implementação:

### Fase 0 — Setup e documentação

- [x] 0 — Estrutura inicial, arquivos de configuração e README completo (sem páginas HTML, CSS ou JS).

### Fase 1 — Base visual e páginas públicas

- [ ] 1.1 — Tokens, reset, tipografia e utilitários CSS.
- [ ] 1.2 — Componentes e layouts compartilhados.
- [ ] 1.3 — Landing page.
- [ ] 1.4 — Cadastro e login.
- [ ] 1.5 — Onboarding de três passos.

### Fase 2 — Área do aluno e aprendizagem

- [ ] 2.1 — Shell autenticado e navegação responsiva.
- [ ] 2.2 — Dashboard personalizado.
- [ ] 2.3 — Trilha Aprender.
- [ ] 2.4 — Aula e conclusão.
- [ ] 2.5 — Jogos.
- [ ] 2.6 — Músicas.
- [ ] 2.7 — Perfil, estatísticas e calendário.

### Fase 3 — Dados e gamificação

- [ ] 3.1 — Persistência local, contas e sessão.
- [ ] 3.2 — Quiz Musical e resultado.
- [ ] 3.3 — XP e níveis.
- [ ] 3.4 — Sequência de estudos.
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

### Suposições

## Pendências conhecidas

- A tela de resultado do quiz não existe no Figma; propor uma solução no mesmo estilo e avisar antes de implementar.
- Há um frame do Figma com sidebar dentro de um celular; tratar como erro de design e usar barra inferior em mobile.
- Os ícones de Músicas e Perfil aparecem como círculos/quebrados; usar nota musical e usuário em SVG.
- “Setembro 2024” no calendário é dado de exemplo visual, não uma data fixa. O calendário deve representar os dados reais do aluno.
- As telas do Figma são a referência visual. Se uma tela estiver ausente ou houver ambiguidade, perguntar antes de inventar detalhes.
- Os limites exatos de níveis, regras de sequência e critérios de desbloqueio de conquistas precisam ser definidos antes de codificar quando as referências não forem suficientes.

## Créditos

**Projeto Integrador de Ciência da Computação**

Criadores:

- Pedro Henrique Gomes
- Guilherme Oliveira de Santana
