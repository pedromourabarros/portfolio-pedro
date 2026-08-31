# Pedro Moura Barros

Portfólio pessoal de Pedro Moura Barros, com foco em análise de dados, Business Intelligence e desenvolvimento de soluções para transformar informação em decisões mais claras.

O site reúne experiências profissionais, projetos, formação, um dashboard interativo e uma área de contato.

## Stack

- Next.js 16 com App Router
- React 19 e TypeScript
- Tailwind CSS 4
- Motion para animações de interface
- Recharts para gráficos
- Better Auth para autenticação do painel administrativo
- Neon Postgres com Drizzle ORM
- Vercel Analytics

## Rodando localmente

Você precisa ter Node.js e pnpm instalados.

```bash
pnpm install
pnpm dev
```

Depois, abra [http://localhost:3000](http://localhost:3000).

Para conferir a versão de produção localmente:

```bash
pnpm build
pnpm start
```

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com as variáveis usadas pelo ambiente:

```env
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
```

`BETTER_AUTH_SECRET` deve ser uma chave aleatória com pelo menos 32 caracteres. Nunca publique esse arquivo ou qualquer credencial no repositório.

## Estrutura

```text
app/
  api/auth/        Rotas da autenticação
  admin/           Área administrativa
  layout.tsx       Layout e metadados globais
  page.tsx         Página principal
components/
  sections/        Seções do portfólio
  ui/              Componentes de interface reutilizáveis
lib/
  data.ts          Conteúdo do portfólio
  knowledge.ts     Conteúdo usado pelo PedroGPT
  auth.ts          Configuração do Better Auth
  db/              Conexão e schema do banco
public/             Imagens e arquivos estáticos
```

## Scripts

| Comando | O que faz |
| --- | --- |
| `pnpm dev` | Inicia o servidor de desenvolvimento |
| `pnpm build` | Gera a build de produção |
| `pnpm start` | Executa a build de produção |
| `pnpm lint` | Verifica problemas de lint |

## Conteúdo

Os textos, experiências, projetos e informações de contato ficam concentrados em `lib/data.ts`. Isso facilita atualizar o portfólio sem espalhar conteúdo pelos componentes.

O dashboard usa dados ilustrativos para demonstrar filtros, gráficos e consultas SQL. Ele não representa dados reais de clientes ou empresas.

## Deploy

O projeto pode ser publicado na Vercel conectado ao repositório. Antes do deploy, confira as variáveis de ambiente do projeto e execute a build localmente.

## Licença

O código da interface está disponível para estudo e referência. O conteúdo pessoal, as imagens e a identidade visual pertencem a Pedro Moura Barros.

## Contato

- LinkedIn: [linkedin.com/in/pedromourabarros](https://www.linkedin.com/in/pedromourabarros/)
- GitHub: [github.com/pedromourabarros](https://github.com/pedromourabarros)
- Site: [pedromourabarros.vercel.app](https://pedromourabarros.vercel.app)
