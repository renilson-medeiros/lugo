import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
    const lastUpdate = new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <section className="container px-4 py-16 md:py-24">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-blue-500">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h1 className="font-display text-4xl font-bold tracking-tight">Política de Privacidade</h1>
                        </div>

                        <p className="text-muted-foreground mb-8">
                            Última atualização: {lastUpdate}
                        </p>

                        <div className="prose prose-slate max-w-none space-y-8 text-muted-foreground">
                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground font-display">1. Introdução</h2>
                                <p>
                                    O Aluga Fácil valoriza a sua privacidade. Esta Política de Privacidade explica como coletamos, usamos,
                                    protegemos e compartilhamos suas informações pessoais ao utilizar nossa plataforma.
                                    Ao acessar o Aluga Fácil, você concorda com as práticas descritas nesta política.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground font-display">2. Informações que Coletamos</h2>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold text-foreground">Informações de Conta</h3>
                                    <p>
                                        Ao se cadastrar como locador, coletamos seu nome completo, CPF, e-mail, telefone e senha.
                                        Essas informações são essenciais para a segurança da plataforma e para que você possa gerenciar seus imóveis.
                                    </p>

                                    <h3 className="text-xl font-semibold text-foreground">Informações de Imóveis e Inquilinos</h3>
                                    <p>
                                        Coletamos dados sobre os imóveis que você cadastra (endereço, fotos, valores) e informações sobre seus inquilinos
                                        para a geração de comprovantes de pagamento.
                                    </p>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground font-display">3. Como Usamos Suas Informações</h2>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Para fornecer e manter nossa plataforma;</li>
                                    <li>Para permitir a divulgação de seus imóveis para interessados;</li>
                                    <li>Para gerar comprovantes e gerenciar o histórico de pagamentos;</li>
                                    <li>Para enviar notificações importantes sobre sua conta;</li>
                                    <li>Para prevenir fraudes e garantir a segurança de todos os usuários.</li>
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground font-display">4. Compartilhamento de Dados</h2>
                                <p>
                                    Não vendemos suas informações para terceiros. Seus dados de contato (nome e WhatsApp) são compartilhados
                                    apenas na página pública dos seus imóveis disponíveis para permitir que interessados entrem em contato diretamente.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground font-display">5. Segurança dos Dados</h2>
                                <p>
                                    Utilizamos medidas de segurança técnicas e administrativas, incluindo criptografia e serviços de infraestrutura
                                    confiáveis (como Supabase/PostgreSQL), para proteger seus dados contra acesso não autorizado ou perda.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground font-display">6. Seus Direitos</h2>
                                <p>
                                    Você tem o direito de acessar, corrigir ou excluir seus dados pessoais a qualquer momento através do seu painel de controle
                                    ou entrando em contato com nosso suporte.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground font-display">7. Contato</h2>
                                <p>
                                    Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco através da nossa página de suporte.
                                </p>
                            </section>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
