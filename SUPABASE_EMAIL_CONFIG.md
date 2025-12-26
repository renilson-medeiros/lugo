# Guia de Configuração do Supabase - Email de Confirmação

## Problema

Você está recebendo o erro: **"Error sending confirmation email"** ao tentar cadastrar usuários.

Isso acontece porque o Supabase está configurado para enviar emails de confirmação, mas não tem um servidor SMTP configurado.

## Soluções

### Opção 1: Desabilitar Confirmação de Email (Recomendado para Desenvolvimento)

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Selecione seu projeto: `lxottyfriwprurshinsq`
3. Vá em **Authentication** → **Providers** → **Email**
4. Desabilite a opção **"Confirm email"**
5. Clique em **Save**

**Pronto!** Agora os usuários podem se cadastrar sem precisar confirmar o email.

---

### Opção 2: Configurar SMTP Customizado (Recomendado para Produção)

Se você quiser enviar emails de confirmação, precisa configurar um servidor SMTP:

#### 1. Escolha um Provedor de Email

Opções gratuitas/baratas:
- **Resend** (recomendado) - 3.000 emails/mês grátis
- **SendGrid** - 100 emails/dia grátis
- **Mailgun** - 5.000 emails/mês grátis
- **Gmail SMTP** - grátis, mas limitado

#### 2. Configure no Supabase

1. Acesse **Authentication** → **Email Templates** → **SMTP Settings**
2. Preencha os dados do seu provedor SMTP:
   ```
   Host: smtp.resend.com (ou outro provedor)
   Port: 587
   Username: seu_usuario
   Password: sua_senha
   Sender email: noreply@seudominio.com
   Sender name: Aluguel Fácil
   ```
3. Clique em **Save**

#### 3. Teste o Envio

Tente cadastrar um novo usuário e verifique se o email é enviado.

---

### Opção 3: Usar Email do Supabase (Limitado)

O Supabase oferece um serviço de email básico, mas é muito limitado (apenas para testes):

1. Vá em **Authentication** → **Email Templates**
2. Certifique-se de que **"Use Supabase SMTP"** está habilitado
3. **Atenção**: Este serviço tem limite de 4 emails/hora e pode não funcionar em produção

---

## Configuração Recomendada para Desenvolvimento

Para facilitar o desenvolvimento, recomendo:

1. **Desabilitar confirmação de email** (Opção 1)
2. Adicionar esta configuração no `AuthContext.tsx`:

```typescript
// No signUp, adicionar opção para pular confirmação
const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${window.location.origin}/dashboard`,
    data: {
      nome_completo: userData.nome_completo,
      cpf: userData.cpf.replace(/\D/g, ''),
      telefone: userData.telefone.replace(/\D/g, ''),
    },
  },
});
```

---

## Verificar Configuração Atual

Para ver sua configuração atual:

1. Acesse o Dashboard do Supabase
2. Vá em **Authentication** → **Providers** → **Email**
3. Verifique se **"Confirm email"** está habilitado ou desabilitado

---

## Próximos Passos

Depois de configurar o Supabase:

1. Limpe o cache do navegador (Ctrl + Shift + Delete)
2. Tente cadastrar um novo usuário
3. Se ainda der erro, verifique os logs no Dashboard do Supabase em **Logs** → **Auth Logs**

---

## Suporte

Se precisar de ajuda, você pode:
- Verificar a [documentação oficial do Supabase](https://supabase.com/docs/guides/auth/auth-smtp)
- Consultar os logs de erro no Dashboard do Supabase
- Entrar em contato com o suporte do Supabase
