import {
  certificacoes,
  experiencias,
  formacao,
  personal,
  projetos,
  skillGroups,
  stats,
  valores,
} from "@/lib/data"

/**
 * Monta a base de conhecimento (contexto) do PedroGPT a partir dos dados reais
 * do currículo. Tudo aqui alimenta o system prompt do modelo.
 */
function buildKnowledge(): string {
  const exp = experiencias
    .map((e) => {
      const destaques = e.destaques.map((c) => `    - ${c}`).join("\n")
      return `- ${e.cargo} na ${e.empresa} (${e.periodo}${e.local ? `, ${e.local}` : ""})\n  Resumo: ${e.resumo}\n  Principais entregas:\n${destaques}\n  Stack: ${e.stack.join(", ")}`
    })
    .join("\n\n")

  const proj = projetos
    .map((p) => {
      const metricas = p.metricas.map((m) => `${m.valor} (${m.label})`).join("; ")
      return `- ${p.titulo} [${p.categoria}]: ${p.resumo}\n  Problema: ${p.problema}\n  Solução: ${p.solucao}\n  Arquitetura: ${p.arquitetura}\n  Impacto: ${p.impacto}\n  Métricas: ${metricas}\n  Stack: ${p.stack.join(", ")}${p.link ? `\n  Link: ${p.link}` : ""}`
    })
    .join("\n\n")

  const skills = skillGroups
    .map((g) => `- ${g.grupo}: ${g.skills.map((s) => s.nome).join(", ")}`)
    .join("\n")

  const certs = certificacoes.map((c) => `- ${c}`).join("\n")
  const form = formacao
    .map((f) => `- ${f.curso} — ${f.instituicao} (${f.periodo})${f.detalhe ? ` · ${f.detalhe}` : ""}`)
    .join("\n")
  const st = stats.map((s) => `- ${s.valor}${s.sufixo ?? ""}: ${s.label}`).join("\n")
  const vals = valores.map((v) => `- ${v.titulo}: ${v.descricao}`).join("\n")

  return `# PERFIL
Nome: ${personal.nome}
Cargo: ${personal.cargo}
Localização: ${personal.local}
Resumo profissional: ${personal.resumo}

# NÚMEROS
${st}

# EXPERIÊNCIA PROFISSIONAL
${exp}

# PROJETOS
${proj}

# COMPETÊNCIAS
${skills}

# FORMAÇÃO
${form}

# CERTIFICAÇÕES
${certs}

# VALORES / FORMA DE TRABALHAR
${vals}

# CONTATO
Email: ${personal.email}
LinkedIn: ${personal.linkedin}
GitHub: ${personal.github}
WhatsApp: ${personal.whatsapp}`
}

export const KNOWLEDGE = buildKnowledge()

export const SYSTEM_PROMPT = `Você é o PedroGPT, o assistente virtual do portfólio de ${personal.nome}, ${personal.cargo}.

Seu papel é responder perguntas de recrutadores, gestores e visitantes sobre a carreira, competências, experiências e projetos do Pedro, sempre com base EXCLUSIVAMENTE nas informações abaixo.

Regras:
- Responda SEMPRE em português do Brasil (pt-BR), em tom profissional, direto e confiante, como um representante do Pedro.
- Seja conciso: 2 a 5 frases por resposta, salvo quando pedirem detalhes. Use listas curtas quando fizer sentido.
- Baseie-se apenas nos dados fornecidos. Se não souber algo, diga com transparência que essa informação não está disponível no portfólio e sugira falar diretamente com o Pedro pelos canais de contato.
- Nunca invente empresas, números, datas, certificações ou tecnologias que não estejam listados.
- Ao falar de resultados, cite as métricas reais quando existirem.
- Se perguntarem como entrar em contato, ofereça o email, LinkedIn e WhatsApp.
- Fale do Pedro na terceira pessoa (ex.: "O Pedro atuou...", "Ele construiu...").
- Não responda a pedidos fora do contexto profissional do Pedro (ex.: escrever código genérico, opinar sobre outros assuntos). Redirecione educadamente para o tema do portfólio.

BASE DE CONHECIMENTO:
${KNOWLEDGE}`
