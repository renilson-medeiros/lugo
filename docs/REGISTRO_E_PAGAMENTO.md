# 💳 Fluxo de Registro e Pagamento - Alugue Fácil

Este documento detalha a análise técnica, o fluxo proposto e as **regras de negócio** para a integração do sistema de registro de usuários com a cobrança recorrente (SaaS) da plataforma.

## 🔍 Análise do Estado Atual

Atualmente, o projeto possui a funcionalidade de registro técnica funcional, mas a parte de pagamento é apenas **visual**.

- **Registro**: O formulário em `src/modules/Register.tsx` coleta dados e cria o usuário no Supabase Auth.
- **Perfil**: Um trigger no banco de dados cria automaticamente uma entrada na tabela `profiles`.
- **Pagamento**: Existe um card visual informativo sobre o valor de **R$ 29,90/mês**.

---

## 🚀 Fluxo de Registro e Trial (7 Dias)

Para garantir uma boa experiência inicial e segurança comercial, o fluxo segue estas regras:

### 1. Cadastro e Início do Trial
Ao criar a conta, o usuário recebe automaticamente **7 dias de teste grátis**.
- **Status Inicial**: `trial`
- **Data de Expiração**: `data_cadastro + 7 dias`

### 2. Acesso durante o Trial
Durante os 7 dias, o proprietário tem acesso às ferramentas para vivenciar o valor do serviço, mas com uma trava de segurança para evitar uso massivo abusivo antes da conversão:
- 🏠 **Máximo de 1 Imóvel**: Permite configurar e gerenciar completamente um imóvel para teste do "efeito uau".
- 👤 **Inquilinos e Comprovantes**: Ilimitados para este imóvel único.

> [!NOTE]
> Essa limitação de volume **não deve ser anunciada na Landing Page**, onde o foco é a liberdade e os 7 dias grátis. A trava serve como um "limite de segurança" técnico.

### 3. O Paywall (Bloqueio de Acesso)
Assim que os **7 dias expirarem**:
- O sistema verifica o campo `expires_at` e `subscription_status`.
- Caso o status não seja `active`, o usuário será redirecionado para uma **Página de Pagamento Obrigatória**.
- O acesso ao Dashboard e ferramentas de gestão fica totalmente bloqueado até a confirmação do pagamento.

### 💳 Escolha da Plataforma de Pagamento: Asaas

O **Asaas** foi escolhido como a plataforma oficial para o Alugue Fácil devido à sua especialização em SaaS, recorrência e ambiente de testes (Sandbox) superior.

| Característica | Benefício para o Alugue Fácil |
| :--- | :--- |
| **Recorrência** | Gestão nativa de assinaturas mensais de R$ 29,90. |
| **PIX e Boleto** | Cobrança profissional com notificações automáticas. |
| **Sandbox** | Permite testar todo o fluxo de pagamento sem usar dinheiro real. |
| **Webhooks** | Ativação instantânea do plano após o pagamento. |

---

## 🛠️ Alterações de Infraestrutura (Banco de Dados)

Devemos expandir a tabela `profiles` com os seguintes campos de controle:

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `subscription_status` | `text` | `trial`, `active`, `past_due`, `canceled` |
| `expires_at` | `timestamp` | Fim do trial ou do mês pago |
| `subscription_id` | `text` | ID da assinatura/cliente no Asaas |

---

## 🛡️ Lógica de Acesso (Paywall) e Regras de Segurança

---

##  Regras de Segurança e Middleware

1. **Middleware de Assinatura**:
   - Se `current_date > expires_at` E `status != 'active'`, redireciona para `/checkout`.
2. **Validação de Limites**:
   - Ao tentar criar o 2º imóvel ou inquilino, o sistema verifica se o usuário é `active`. Se for `trial`, exibe um convite para assinar o plano completo.

---

> [!TIP]
> O uso do Mercado Pago permitirá que a ativação da conta após os 7 dias seja automática e sem intervenção manual, mantendo a experiência do usuário fluida.
