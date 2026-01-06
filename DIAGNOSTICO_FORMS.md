# Diagnóstico Técnico: Travamento em Formulários (Lugo)

## 1. O Problema

Ao preencher formulários longos (Imóveis, Inquilinos, Comprovantes), o botão de cadastrar fica em estado "Carregando" infinitamente após o clique, sem finalizar a operação ou mostrar erro.

## 2. Causa Raiz (Análise de Especialista)

O problema não é uma falha de lógica simples (como esquecer de resetar o loading), mas sim um problema de **Resiliência de Rede e Sessão**:

- **Expiração de JWT (Token)**: O Supabase renova o token automaticamente, mas se a aba ficar inativa por muito tempo ou o computador entrar em suspensão, o mecanismo de refresh pode falhar. Quando você clica em "Cadastrar", a biblioteca do Supabase tenta renovar a sessão antes da requisição. Se essa renovação "engasgar", a requisição fica em um estado de `await` eterno.
- **Falta de Timeout nas Requisições**: Atualmente, as chamadas para o banco de dados não possuem um tempo limite (timeout). Se o servidor demorar ou a rede oscilar exatamente naquele momento, o código JavaScript fica esperando a resposta para sempre, mantendo o `isSubmitting` como `true`.
- **Estado de Sessão Stale**: O componente `AuthContext` pode acreditar que o usuário ainda está logado (estado local), mas a sessão real no `storage` pode ter expirado ou sido invalidada.

## 3. Plano de Melhoria e Blindagem

Para resolver isso definitivamente e elevar o nível da plataforma, propomos:

### A. Implementação de Timeouts Globais

Não permitiremos que nenhuma submissão de formulário dure mais do que **15-20 segundos**. Se passar disso, o sistema deve cancelar a tentativa, resetar o botão e avisar o usuário: "A conexão está lenta. Tente novamente".

### B. Validação de Sessão Antecipada

Antes de iniciar o `insert` no banco, adicionaremos uma verificação explícita:

```typescript
const {
  data: { session },
} = await supabase.auth.getSession();
if (!session) {
  toast.error(
    "Sua sessão expirou por inatividade. Por favor, faça login novamente."
  );
  setIsSubmitting(false);
  return;
}
```

### C. Persistência de Rascunho (LocalDraft)

Para formulários longos (como o de Imóveis), implementaremos o salvamento automático no `localStorage`. Se a página precisar ser recarregada por perda de sessão, o usuário não perde os dados preenchidos.

---

**Status**: Documento pronto para implementação.
