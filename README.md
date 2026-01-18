# 🏠 Lugo - Sistema de Gestão de Imóveis

> **Sistema completo e profissional para gestão de imóveis de aluguel, projetado para simplificar a vida de proprietários com tecnologia de ponta.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

## 🎯 Sobre o Projeto

O **Lugo** é uma solução SaaS (Software as a Service) focada na automação e organização da gestão imobiliária. Desenvolvido para proprietários que buscam uma alternativa moderna às planilhas, o sistema oferece gestão de contratos, controle de recebimentos e geração de documentos de forma intuitiva.

### 🌟 Diferenciais Técnicos para Recrutadores

- **Arquitetura Moderna**: Implementação robusta do Next.js 14 App Router com Server Components e Server Actions.
- **Performance de Elite**: Otimização agressiva com Memoization, Lazy Loading e Image Optimization, garantindo um Lighthouse score superior.
- **Segurança Avançada**: Implementação de Row Level Security (RLS) no Supabase, garantindo que cada usuário acesse apenas seus próprios dados.
- **UX Premium**: Interface rica com shadcn/ui, animações sutis e feedback imediato ao usuário (Toasts, Loading States).
- **Código Limpo (Clean Code)**: Segregação de responsabilidades, TypeScript Strict Mode e componentes altamente reutilizáveis.

---

## 🚀 Funcionalidades Principais

### 📋 Gestão de Ativos & Pessoas
- **Gestão de Imóveis**: Dashboard completo com status em tempo real (Disponível, Alugado, Manutenção).
- **Controle de Inquilinos**: Histórico completo, gestão de datas críticas e dados de contato.
- **Upload de Fotos & Documentos**: Integração com Supabase Storage para armazenamento seguro de imagens dos imóveis e contratos.

### 💰 Financeiro & Documentação
- **Geração de Comprovantes**: Emissão instantânea de recibos de aluguel e comprovantes de residência.
- **Monitoramento de Receita**: Visualização clara do fluxo financeiro mensal.
- **Relatórios**: Exportação de dados essenciais para gestão contábil.

---

## 🛠️ Stack Tecnológica

### Frontend & UI
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Componentes**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Formulários**: React Hook Form + Zod

### Backend & Infra
- **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/) (via Supabase)
- **Autenticação**: Supabase Auth (OAuth & Email/Password)
- **Storage**: Supabase Storage
- **Infra**: Vercel

---

## 🏗️ Estrutura do Projeto

```bash
/src
  /app          # Rotas e Páginas (Next.js 14)
  /components   # Componentes Shared & UI (Atomic Design)
  /contexts     # Contextos React (Auth, etc)
  /lib          # Configurações de API e Utilitários (Supabase client/middleware)
  /modules      # Lógica de Negócio por domínio (Dashboard, Checkout)
/supabase
  /migrations   # Scripts de estrutura de banco de dados e RLS
/docs           # Documentação técnica e guias de uso
```

---

## �🔒 Segurança & Boas Práticas (Showcase Técnico)

Este projeto foi construído focando em padrões de **Enterprise SaaS**, demonstrando domínio sobre:

- **Isolamento de Dados**: Uso de Row Level Security (RLS) no PostgreSQL para garantir multi-tenancy seguro.
- **Arquitetura de Software**: Separação clara entre lógica de API, componentes de UI e regras de negócio.
- **Validação de Dados**: Esquemas robustos com Zod para garantir integridade em toda a stack.
- **Performance**: Monitoramento constante de Web Vitals e otimização de renderização.

---

## 👨‍💻 Desenvolvedor

**Renilson Medeiros** - Desenvolvedor Front-end

- **LinkedIn**: [Renilson Medeiros](https://www.linkedin.com/in/renilsonmedeiros/)
- **GitHub**: [@renilson-medeiros](https://github.com/renilson-medeiros)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  <p>Projeto desenvolvido como demonstração de competência técnica em arquitetura Next.js e ecossistema Supabase.</p>
</div>
