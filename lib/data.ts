export const personal = {
  nome: "Pedro Moura Barros",
  primeiroNome: "Pedro",
  cargo: "Analista de Dados & Business Intelligence",
  cargoCurto: "Analista de Dados · BI",
  local: "São Paulo, SP",
  email: "pedromb303@gmail.com",
  telefone: "+55 (11) 99939-5606",
  whatsapp: "5511999395606",
  linkedin: "https://linkedin.com/in/pedromourabarros",
  github: "https://github.com/pedromourabarros",
  foto: "/pedro.jpeg",
  resumo:
    "Analista de Dados com experiência em SQL, Power BI, DAX, Databricks e ETL, criando dashboards executivos, análises exploratórias e cruzamento de bases para dar suporte à decisão estratégica em ambiente corporativo. Base sólida em engenharia de dados aplicada a negócios, com conhecimento complementar em desenvolvimento full stack (React, Node.js, PostgreSQL) voltado à automação de processos e integração de dados.",
  titulosRotativos: [
    "Analista de Dados",
    "Especialista em Power BI",
    "Engenheiro de Dados",
    "Desenvolvedor Full Stack",
  ],
}

export const stats = [
  { valor: "9.23", sufixo: "", label: "Média global em Engenharia de Software (FIAP)" },
  { valor: "3", sufixo: "+", label: "Anos transformando dados em decisão" },
  { valor: "11", sufixo: "", label: "Certificações técnicas concluídas" },
  { valor: "B2", sufixo: "", label: "Inglês avançado (Yázigi)" },
]

export const valores = [
  {
    titulo: "Decisão orientada a dados",
    descricao:
      "Transformo bases brutas em indicadores claros que sustentam decisões executivas com precisão e velocidade.",
    icon: "target",
  },
  {
    titulo: "Rigor analítico",
    descricao:
      "Validação de integridade, governança e modelagem consistente do dado cru até o insight confiável.",
    icon: "shield-check",
  },
  {
    titulo: "Visão de produto",
    descricao:
      "Experiência full stack me permite conectar dados a sistemas, automatizando processos ponta a ponta.",
    icon: "workflow",
  },
  {
    titulo: "Aprendizado contínuo",
    descricao:
      "Curiosidade constante por novas ferramentas, técnicas e formas de gerar valor com informação.",
    icon: "trending-up",
  },
]

export type Experiencia = {
  empresa: string
  cargo: string
  periodo: string
  local: string
  resumo: string
  destaques: string[]
  stack: string[]
  atual?: boolean
}

export const experiencias: Experiencia[] = [
  {
    empresa: "Bradesco Prime",
    cargo: "Business Intelligence I",
    periodo: "Abr 2026 — Atual",
    local: "Osasco, SP",
    atual: true,
    resumo:
      "Suporte analítico a decisões de negócio em nível executivo, com foco em SQL em ambiente Databricks e dashboards estratégicos no Power BI.",
    destaques: [
      "Extração, tratamento e análise de dados com SQL em ambiente Databricks, dando suporte a decisões de negócio em nível executivo.",
      "Desenvolvimento de consultas SQL complexas para geração de insights, otimizando o tempo de resposta a demandas analíticas.",
      "Criação e manutenção de dashboards executivos e visualizações interativas no Power BI, usados por múltiplas áreas.",
      "Consultas e validações de integridade de dados utilizando SQL Server e SAS.",
      "Análise de indicadores de performance e identificação de tendências para oportunidades de melhoria de processos.",
      "Apoio a projetos estratégicos de Business Intelligence e iniciativas de governança de dados.",
    ],
    stack: ["SQL", "Databricks", "Power BI", "SQL Server", "SAS", "DAX"],
  },
  {
    empresa: "Bradesco",
    cargo: "Estagiário em Análise de Dados",
    periodo: "Out 2024 — Mar 2026",
    local: "Osasco, SP",
    resumo:
      "Análises estruturadas para áreas de negócio internas, construção de KPIs em Power BI e consolidação de bases com Excel avançado.",
    destaques: [
      "Suporte a análises estruturadas de dados para áreas de negócio internas.",
      "Extração e consulta de dados via SQL em ambiente SAS.",
      "Construção de dashboards e indicadores (KPIs) em Power BI utilizando DAX.",
      "Cruzamento e consolidação de bases de dados utilizando Excel Avançado.",
      "Elaboração de relatórios estratégicos de apoio à tomada de decisão.",
    ],
    stack: ["SQL", "SAS", "Power BI", "DAX", "Excel Avançado"],
  },
  {
    empresa: "Cielo",
    cargo: "Aprendiz em Análise de Dados",
    periodo: "Jul 2024 — Out 2024",
    local: "Barueri, SP",
    resumo:
      "Monitoramento de indicadores operacionais, análises exploratórias em Python e automação de processos manuais.",
    destaques: [
      "Criação de dashboards de monitoramento de indicadores operacionais.",
      "Condução de análises exploratórias de dados utilizando Python.",
      "Automação de processos manuais, reduzindo tempo de execução de tarefas repetitivas.",
      "Suporte a análises estruturadas para times de negócio.",
    ],
    stack: ["Python", "Power BI", "Análise Exploratória"],
  },
]

export type Projeto = {
  titulo: string
  categoria: string
  resumo: string
  problema: string
  solucao: string
  arquitetura: string
  desafios: string
  impacto: string
  metricas: { valor: string; label: string }[]
  stack: string[]
  imagem: string
  link?: string
  linkLabel?: string
  destaque?: boolean
}

export const projetos: Projeto[] = [
  {
    titulo: "Fyncop",
    categoria: "SaaS · Fintech com IA",
    resumo:
      "Plataforma financeira completa com inteligência artificial para geração automática de insights sobre gastos e projeções.",
    problema:
      "Pessoas e pequenos negócios lutam para entender para onde vai o dinheiro e prever o futuro financeiro sem ferramentas caras ou planilhas manuais.",
    solucao:
      "Um SaaS de gestão financeira que centraliza contas, categoriza transações e usa IA para gerar insights automáticos sobre gastos e projeções financeiras em linguagem natural.",
    arquitetura:
      "Front-end em React, back-end em Node.js/Express com APIs REST, banco de dados PostgreSQL via Supabase, autenticação segura e integração com gateways de pagamento por webhooks.",
    desafios:
      "Modelar dados financeiros consistentes, garantir segurança e integridade nas transações e orquestrar a camada de IA para gerar insights confiáveis a partir de dados reais dos usuários.",
    impacto:
      "Produto em produção, com arquitetura escalável que conecta dados financeiros a insights acionáveis e automação de projeções.",
    metricas: [
      { valor: "Em produção", label: "Status atual" },
      { valor: "IA", label: "Insights automáticos" },
      { valor: "SaaS", label: "Arquitetura escalável" },
    ],
    stack: ["React", "Node.js", "Express", "Supabase", "PostgreSQL", "APIs REST", "Webhooks"],
    imagem: "/projetos/fyncop.png",
    link: "https://fyncop.com",
    linkLabel: "fyncop.com",
    destaque: true,
  },
  {
    titulo: "Dashboard de Vendas",
    categoria: "Business Intelligence",
    resumo:
      "Dashboard analítico de vendas com indicadores de performance, filtros dinâmicos e medidas DAX customizadas.",
    problema:
      "A área de vendas precisava de uma visão consolidada e interativa dos indicadores de performance para acompanhar metas e tendências.",
    solucao:
      "Construção de um dashboard analítico no Power BI com filtros dinâmicos, drill-down por dimensões e medidas DAX customizadas para KPIs de vendas.",
    arquitetura:
      "Modelagem de dados com relacionamentos em estrela, tratamento e ETL das bases via SQL e medidas DAX otimizadas para performance de cálculo.",
    desafios:
      "Garantir performance nas medidas DAX, consistência entre bases e uma experiência de navegação clara para usuários de negócio.",
    impacto:
      "Visão executiva unificada dos indicadores de vendas, acelerando a análise de performance e a tomada de decisão.",
    metricas: [
      { valor: "DAX", label: "Medidas customizadas" },
      { valor: "Filtros", label: "Interatividade dinâmica" },
      { valor: "KPIs", label: "Performance de vendas" },
    ],
    stack: ["Power BI", "SQL", "DAX", "Modelagem de Dados"],
    imagem: "/projetos/dashboard-vendas.png",
    link: "https://app.powerbi.com/links/hH3JvaCD_E",
    linkLabel: "Abrir no Power BI",
    destaque: true,
  },
  {
    titulo: "Calculadora Financeira",
    categoria: "Aplicação Web",
    resumo:
      "Aplicação web para simulações financeiras, com foco em usabilidade e cálculos precisos.",
    problema:
      "Usuários precisavam de uma forma rápida e acessível de simular cenários financeiros sem planilhas complexas.",
    solucao:
      "Uma aplicação web leve e intuitiva para simulações financeiras, com interface limpa e cálculos instantâneos.",
    arquitetura:
      "Aplicação front-end em JavaScript, HTML e CSS, com lógica de cálculo no cliente e deploy contínuo.",
    desafios:
      "Garantir precisão nos cálculos e uma experiência simples e responsiva em diferentes dispositivos.",
    impacto:
      "Ferramenta pública e funcional que simplifica simulações financeiras do dia a dia.",
    metricas: [
      { valor: "Web", label: "Acessível a qualquer um" },
      { valor: "Instantâneo", label: "Cálculos em tempo real" },
      { valor: "Deploy", label: "Publicado online" },
    ],
    stack: ["JavaScript", "HTML", "CSS"],
    imagem: "/projetos/calculadora.png",
    link: "https://calculadora-financeiraa.netlify.app",
    linkLabel: "calculadora-financeiraa.netlify.app",
  },
]

export type Skill = { nome: string; nivel: number }
export type SkillGroup = { grupo: string; icon: string; skills: Skill[] }

export const skillGroups: SkillGroup[] = [
  {
    grupo: "Data & Analytics",
    icon: "bar-chart-3",
    skills: [
      { nome: "SQL", nivel: 95 },
      { nome: "Power BI", nivel: 92 },
      { nome: "DAX", nivel: 88 },
      { nome: "Excel Avançado", nivel: 90 },
      { nome: "ETL", nivel: 85 },
      { nome: "Databricks", nivel: 82 },
      { nome: "Tableau", nivel: 78 },
      { nome: "PySpark", nivel: 75 },
      { nome: "Python", nivel: 80 },
    ],
  },
  {
    grupo: "Bancos de Dados",
    icon: "database",
    skills: [
      { nome: "PostgreSQL", nivel: 85 },
      { nome: "Supabase", nivel: 84 },
      { nome: "Oracle", nivel: 78 },
      { nome: "SQL Server", nivel: 86 },
    ],
  },
  {
    grupo: "Desenvolvimento",
    icon: "code-2",
    skills: [
      { nome: "React.js", nivel: 84 },
      { nome: "Node.js", nivel: 82 },
      { nome: "Express", nivel: 80 },
      { nome: "TypeScript", nivel: 80 },
      { nome: "APIs REST", nivel: 85 },
      { nome: "Arquitetura SaaS", nivel: 78 },
    ],
  },
]

/* Stack organizada em pills por categoria — leitura rápida e organizada. */
export type StackGroup = { grupo: string; itens: string[] }

export const stackGroups: StackGroup[] = [
  {
    grupo: "Data & Analytics",
    itens: ["SQL", "Power BI", "DAX", "Excel Avançado", "ETL", "Databricks", "Tableau", "PySpark", "SAS"],
  },
  {
    grupo: "Bancos de Dados",
    itens: ["PostgreSQL", "Supabase", "Oracle", "SQL Server"],
  },
  {
    grupo: "Linguagens",
    itens: ["SQL", "Python", "JavaScript", "TypeScript", "HTML", "CSS"],
  },
  {
    grupo: "Desenvolvimento",
    itens: ["React.js", "Node.js", "Express", "APIs REST", "Webhooks", "Arquitetura SaaS"],
  },
  {
    grupo: "Ferramentas",
    itens: ["Git", "Deploy", "Integração de APIs"],
  },
]

export const certificacoes = [
  "Programa de Capacitação em Data Analytics — Bradesco",
  "Data Visualization — FIAP ON",
  "Tableau — Alura",
  "Power BI — Alura",
  "Banco de Dados Oracle — FIAP ON",
  "Inteligência Artificial — FIAP ON",
  "Python — FIAP ON",
  "JavaScript Completo — Curso em Vídeo",
  "Front-end — FIAP ON",
  "Lógica de Programação — Alura",
  "Algoritmos — FIAP ON",
]

export const formacao = [
  {
    instituicao: "FIAP — Faculdade de Informática e Administração Paulista",
    curso: "Engenharia de Software",
    periodo: "2023 — Presente",
    detalhe: "Média global: 9.23",
  },
  {
    instituicao: "Yázigi",
    curso: "Inglês — Nível B2",
    periodo: "2021 — 2024",
    detalhe: "Proficiência avançada",
  },
]

/* ----------------------------------------------------------------
   Dashboard BI — dados ilustrativos (KPIs, séries e composições)
   Demonstram o tipo de análise que o Pedro entrega no dia a dia.
------------------------------------------------------------------- */
// KPIs executivos (formatados como cartões de leitura rápida)
export const dashboardKpis = [
  { label: "Receita acumulada", valor: "R$ 67.240.000", delta: 90.8, positivo: true, nota: "no período" },
  { label: "Atingimento de meta", valor: "117,7%", delta: 17.7, positivo: true, nota: "vs. meta" },
  { label: "Ticket médio", valor: "R$ 306", delta: 8.4, positivo: true, nota: "vs. período anterior" },
  { label: "Atendimentos", valor: "22.020", delta: 12.6, positivo: true, nota: "vs. período anterior" },
]

// Série anual: receita realizada x meta (R$ milhões)
export const dashboardReceita = [
  { mes: "Jan", receita: 4.2, meta: 4.0 },
  { mes: "Fev", receita: 4.5, meta: 4.2 },
  { mes: "Mar", receita: 4.4, meta: 4.4 },
  { mes: "Abr", receita: 5.1, meta: 4.6 },
  { mes: "Mai", receita: 5.0, meta: 4.8 },
  { mes: "Jun", receita: 5.6, meta: 5.0 },
  { mes: "Jul", receita: 5.9, meta: 5.2 },
  { mes: "Ago", receita: 5.7, meta: 5.4 },
  { mes: "Set", receita: 6.3, meta: 5.6 },
  { mes: "Out", receita: 6.8, meta: 5.8 },
  { mes: "Nov", receita: 7.2, meta: 6.0 },
  { mes: "Dez", receita: 7.9, meta: 6.2 },
]

// Receita por região (barras verticais — R$ milhões)
export const dashboardRegioes = [
  { regiao: "Sudeste", valor: 5.9 },
  { regiao: "Sul", valor: 1.7 },
  { regiao: "Nordeste", valor: 1.3 },
  { regiao: "Centro-Oeste", valor: 1.0 },
  { regiao: "Norte", valor: 0.6 },
]

// Mix por canal (donut — participação percentual)
export const dashboardCategorias = [
  { categoria: "Digital", valor: 42, fill: "var(--color-digital)" },
  { categoria: "Agência", valor: 27, fill: "var(--color-agencia)" },
  { categoria: "Parceiros", valor: 19, fill: "var(--color-parceiros)" },
  { categoria: "Telefone", valor: 12, fill: "var(--color-telefone)" },
]

// Ranking de crescimento (barras horizontais — variação % ano contra ano)
export const dashboardRanking = [
  { regiao: "Nordeste", valor: 22.7 },
  { regiao: "Sudeste", valor: 18.4 },
  { regiao: "Norte", valor: 14.1 },
  { regiao: "Sul", valor: 11.2 },
  { regiao: "Centro-Oeste", valor: 9.8 },
]

export const navLinks = [
  { href: "#sobre", label: "Sobre" },
  { href: "#experiencia", label: "Experiência" },
  { href: "#projetos", label: "Projetos" },
  { href: "#dashboard", label: "Painel BI" },
  { href: "#pedrogpt", label: "PedroGPT" },
  { href: "#contato", label: "Contato" },
]
