import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FileText } from "lucide-react";

export default function TermsPage() {
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
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-blue-600">
                                <FileText className="h-6 w-6" />
                            </div>
                            <h1 className="font-display text-4xl font-bold tracking-tight">Termos de Uso</h1>
                        </div>

                        <p className="text-muted-foreground mb-8">
                            Última atualização: {lastUpdate}
                        </p>

                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-12">
                            <h2 className="text-blue-950 font-bold mb-3 flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Resumo Simplificado
                            </h2>
                            <ul className="space-y-2 text-sm text-blue-900/80">
                                <li>• O Lugo é uma ferramenta de gestão, não uma imobiliária.</li>
                                <li>• Você é o único responsável pelos seus imóveis e negociações.</li>
                                <li>• A plataforma funciona via assinatura (R$ 29,90/mês), sem comissões sobre o aluguel.</li>
                                <li>• Seus dados são protegidos, mas as informações públicas do imóvel são acessíveis via link.</li>
                            </ul>
                        </div>

                        <div className="prose prose-slate max-w-none space-y-8 text-muted-foreground">
                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground font-display">1. Aceitação dos Termos</h2>
                                <p>
                                    Ao acessar e utilizar o Lugo, você concorda em cumprir e estar vinculado a estes Termos de Uso.
                                    Se você não concordar com qualquer parte destes termos, não deverá utilizar nossa plataforma.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground font-display">2. Descrição do Serviço</h2>
                                <p>
                                    O Lugo é uma ferramenta de gestão e divulgação para locadores diretos. Facilitamos a conexão entre
                                    proprietários e interessados, além de oferecer ferramentas de gestão de inquilinos e emissão de comprovantes.
                                    O Lugo não é uma imobiliária e não intermedia transações financeiras.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground font-display">3. Cadastro e Segurança</h2>
                                <p>
                                    Você é responsável por manter a confidencialidade de sua senha e conta. Você concorda em fornecer informações
                                    verdadeiras e atualizadas. Reservamo-nos o direito de suspender contas que violem nossas diretrizes de segurança ou ética.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground font-display">4. Responsabilidades do Locador</h2>
                                <p>
                                    O locador é o único responsável pela veracidade das informações dos imóveis cadastrados, bem como pelas negociações
                                    realizadas diretamente com os inquilinos. O Lugo não se responsabiliza por contratos de locação ou
                                    descumprimento de acordos entre as partes.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground font-display">5. Uso Público de Links</h2>
                                <p>
                                    Ao utilizar a função de compartilhamento, o locador reconhece que as informações públicas do imóvel (fotos, endereço base,
                                    valor e contato de WhatsApp) estarão acessíveis a qualquer pessoa que possuir o link.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground font-display">6. Propriedade Intelectual</h2>
                                <p>
                                    Todo o conteúdo da plataforma (marca, design, código) é de propriedade exclusiva do Lugo.
                                    É proibida a reprodução ou uso não autorizado.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground font-display">7. Limitação de Responsabilidade</h2>
                                <p>
                                    O Lugo não será responsável por quaisquer danos diretos, indiretos ou consequentes resultantes
                                    do uso ou da incapacidade de usar nossos serviços.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground font-display">8. Alterações nos Termos</h2>
                                <p>
                                    Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão
                                    notificadas aos usuários cadastrados.
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
