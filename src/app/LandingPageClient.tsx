"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Check, 
  ChevronRight, 
  Home, 
  Megaphone, 
  UserPlus, 
  FileText, 
  Briefcase, 
  Sheet, 
  Handshake, 
  X,
  Star,
  ShieldCheck,
  Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

// Images - Placeholders
const heroImage = "/lp_hero.png";
const feature1Image = "/lp_imoveis.png";
const feature2Image = "/lp_inquilinos.png";
const feature3Image = "/lp_comprovante.png";
const feature4Image = "/frame-preview.png";
const avatarCarlos = "https://i.pravatar.cc/150?u=carlos";
const avatarFernanda = "https://i.pravatar.cc/150?u=fernanda";
const avatarRoberto = "https://i.pravatar.cc/150?u=roberto";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function LandingPageClient() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground overflow-x-hidden">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="pt-10 pb-10 md:pt-40 md:pb-32 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-12 md:gap-20">
            <motion.div 
              className="flex-1 max-w-2xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              variants={staggerContainer}
            >              
              <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-secondary leading-[1.1] mb-6">
                Administre seus aluguéis sem pagar <span className="text-tertiary">taxa de imobiliária</span>
              </motion.h1>
              
              <motion.p variants={fadeIn} className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 max-w-lg">
                Controle total dos seus imóveis, inquilinos e pagamentos por apenas <strong className="text-tertiary">R$ 9,90/mês</strong> — sem percentuais, sem intermediários, sem limite de imóveis.
              </motion.p>
              
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/registro">
                    <Button size="lg" className="bg-tertiary hover:bg-tertiary/90 text-white h-14 px-8 text-lg shadow-sm shadow-blue-900/10 rounded-lg transition-all w-full sm:w-auto">
                    Teste grátis por 7 dias <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                </Link>
                <Link href="/login">
                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-secondary/10 text-gray-700 hover:bg-gray-50 rounded-lg w-full sm:w-auto">
                    Entrar na plataforma
                    </Button>
                </Link>
              </motion.div>
              
              <motion.div variants={fadeIn} className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-green-500" /> Cancele quando quiser
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-green-500" /> Sem taxas escondidas
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-green-500" /> Imóveis ilimitados
                </span>
              </motion.div>
            </motion.div>

            <motion.div 
              className="flex-1 relative w-full"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative z-10">
                <img 
                  src={heroImage} 
                  alt="Lugo Dashboard Mockup" 
                  className="w-full h-auto drop-shadow-sm rounded-lg transform md:rotate-1 md:hover:rotate-0 transition-transform duration-500"
                />
                
                {/* Floating Elements */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100 hidden md:block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <Check className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase">Economia Mensal</p>
                      <p className="text-lg font-bold text-gray-900">R$ 1320,00</p>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Decorative blobs */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/50 rounded-full blur-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-semibold tracking-wide uppercase text-sm mb-2 block">Por que Lugo?</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">Pare de pagar 8% do aluguel todo mês</h2>
            <p className="text-gray-600 text-lg">Compare o custo real de cada alternativa ao longo de 12 meses e veja a diferença.</p>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[600px] bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-3 p-6 border-b border-gray-100 bg-gray-50/50">
                <div className="col-span-1"></div>
                <div className="col-span-1 text-center">
                  <div className="inline-flex items-center justify-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-tertiary rounded flex items-center justify-center text-white font-bold text-xs">L</div>
                    <span className="font-bold text-lg text-tertiary">Lugo</span>
                  </div>
                </div>
                <div className="col-span-1 text-center font-bold text-lg text-gray-700">Imobiliária</div>
              </div>

              {[
                { label: "Custo mensal", lugo: "R$ 9,90 fixo", imob: "8-10% do aluguel*", highlight: true },
                { label: "Imóveis ilimitados", lugo: "Sim", imob: "Paga por cada", check: true },
                { label: "Comprovantes profissionais", lugo: "PDF Automático", imob: "Sim", check: true },
                { label: "Alertas de vencimento", lugo: "Automático", imob: "Sim", check: true },
                { label: "Divulgação com link único", lugo: "Sim", imob: "Não", check: true },
                { label: "Controle de inquilinos", lugo: "Completo", imob: "Limitado", check: true },
              ].map((row, i) => (
                <div key={i} className={`grid grid-cols-3 p-5 items-center border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${row.highlight ? 'bg-blue-50/50' : ''}`}>
                  <div className="col-span-1 font-medium text-gray-700">{row.label}</div>
                  <div className={`col-span-1 text-center font-bold ${row.highlight ? 'text-tertiary' : 'text-gray-800'}`}>
                    {row.check && row.lugo === "Sim" ? <Check className="mx-auto text-green-500 w-5 h-5" /> : row.lugo}
                  </div>
                  <div className="col-span-1 text-center text-gray-500">
                    {row.check && row.imob === "Não" ? <X className="mx-auto text-red-400 w-5 h-5" /> : row.imob}
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-3 p-6 items-center bg-blue-900 text-white">
                <div className="col-span-1 font-bold text-blue-100">Custo anual (Aluguel R$ 1.500)</div>
                <div className="col-span-1 text-center font-bold text-2xl text-white">R$ 118,80</div>
                <div className="col-span-1 text-center font-bold text-xl text-white/80">R$ 1.440,00</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-primary font-semibold tracking-wide uppercase text-sm mb-2 block">Como funciona</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">Tudo que você precisa para administrar seus aluguéis</h2>
            <p className="text-gray-600 text-lg">Controle completo, profissionalismo e economia — sem complicação.</p>
          </div>

          <div className="space-y-24">
            {/* Feature 1 */}
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
              <motion.div 
                className="flex-1"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-gray-100 rounded-lg p-2 md:p-4 shadow-inner">
                  <img src={feature1Image} alt="Cadastro e Divulgação" className="w-full rounded-lg shadow-sm border border-secondary/10" />
                </div>
              </motion.div>
              <motion.div 
                className="flex-1"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center text-primary mb-6">
                  <Megaphone className="w-6 h-6" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Divulgue seus imóveis em segundos</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Cadastre fotos, descrição e valor do aluguel. A Lugo gera automaticamente um link único compartilhável — perfeito para WhatsApp, Facebook, Instagram ou onde você quiser. Quando alguém se interessa, um botão conecta direto ao seu WhatsApp.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-700">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <span>Link exclusivo para cada imóvel</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <span>Botão direto para seu WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <span>Layout profissional e atraente</span>
                  </li>
                </ul>
              </motion.div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20">
              <motion.div 
                className="flex-1"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-gray-100 rounded-lg p-2 md:p-4 shadow-inner">
                  <img src={feature2Image} alt="Gestão de Inquilinos" className="w-full rounded-lg shadow-sm border border-secondary/10" />
                </div>
              </motion.div>
              <motion.div 
                className="flex-1"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center text-primary mb-6">
                  <UserPlus className="w-6 h-6" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Controle total do histórico de locações</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Cadastre inquilinos, registre a data de entrada, valor do aluguel e dia de vencimento. Quando o contrato terminar, finalize a locação com um clique e cadastre o próximo inquilino — tudo fica registrado no histórico para consulta futura.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-700">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <span>Histórico completo de inquilinos</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <span>Status de pagamento visual</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <span>Dados centralizados e seguros</span>
                  </li>
                </ul>
              </motion.div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
              <motion.div 
                className="flex-1"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-gray-100 rounded-lg p-2 md:p-4 shadow-inner">
                  <img src={feature3Image} alt="Comprovantes e Alertas" className="w-full rounded-lg shadow-sm border border-secondary/10" />
                </div>
              </motion.div>
              <motion.div 
                className="flex-1"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center text-primary mb-6">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Comprovantes profissionais e alertas automáticos</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Gere comprovantes de pagamento em PDF com um clique — muito mais profissional que anotações ou prints de planilha. Receba alertas automáticos de vencimento de aluguéis para nunca esquecer de cobrar.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-700">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <span>PDFs profissionais instantâneos</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <span>Notificações de vencimento</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <span>Edição flexível de valores</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="py-20 bg-tertiary text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-white/70 font-semibold tracking-wide uppercase text-sm mb-2 block">Simples e direto</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Como funciona na prática</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <Home className="w-6 h-6" />, title: "Cadastre seus imóveis", desc: "Adicione fotos, endereço, valor e descrição. A Lugo gera um link único para você compartilhar." },
              { icon: <Megaphone className="w-6 h-6" />, title: "Divulgue onde quiser", desc: "Compartilhe o link no WhatsApp, redes sociais ou onde preferir. Interessados clicam e falam direto com você." },
              { icon: <UserPlus className="w-6 h-6" />, title: "Cadastre o inquilino", desc: "Quando fechar negócio, registre o inquilino na plataforma com data de entrada e vencimento do aluguel." },
              { icon: <FileText className="w-6 h-6" />, title: "Gere comprovantes", desc: "Emita comprovantes profissionais em PDF e receba lembretes automáticos de vencimento." },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="rounded-lg p-6 border border-white/10 hover:border-primary transition-colors h-full">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-white mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-white text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Customers */}
      <section className="py-20 bg-blue-50/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-semibold tracking-wide uppercase text-sm mb-2 block">Perfeito para</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">Feito para quem aluga diretamente com o inquilino</h2>
            <p className="text-gray-600">Se você não usa imobiliária e quer economizar sem perder o controle, a Lugo é para você.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Home className="w-6 h-6" />, title: "Pequenos Proprietários", desc: "Proprietários de 1-3 imóveis que buscam organização." },
              { icon: <Briefcase className="w-6 h-6" />, title: "Investidores Independentes", desc: "Quem prefere controlar tudo diretamente." },
              { icon: <Sheet className="w-6 h-6" />, title: "Quem usa Planilhas", desc: "Troque o Excel por automação e design profissional." },
              { icon: <Handshake className="w-6 h-6" />, title: "Aluguel Flexível", desc: "Para quem aluga sem fiador ou com caução." },
            ].map((card, i) => (
              <div key={i} className="bg-white py-8 px-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  {card.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing and FAQ Combined Section */}
      <section id="precos" className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Pricing Column */}
            <div className="flex flex-col">
              <div className="max-w-md mx-auto lg:mx-0 w-full">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-blue-100 relative">
                  <div className="absolute top-0 inset-x-0 h-2 bg-linear-to-r from-primary to-tertiary" />
                  <div className="p-8 text-center border-b border-gray-100">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-tertiary text-xs font-bold uppercase tracking-wide mb-4">
                      Acesso Profissional
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <span className="text-2xl text-gray-400 font-medium">R$</span>
                      <span className="text-6xl font-bold text-gray-900 tracking-tight">9,90</span>
                      <span className="text-lg text-gray-500 self-end mb-2">/mês</span>
                    </div>
                    <p className="text-gray-500 text-sm">Cobrado mensalmente. Sem fidelidade.</p>
                  </div>
                  
                  <div className="p-8 bg-gray-50/50">
                    <ul className="space-y-4 mb-8">
                      {[
                        "Imóveis ilimitados",
                        "Inquilinos ilimitados",
                        "Comprovantes profissionais em PDF",
                        "Alertas automáticos de vencimento",
                        "Links únicos para divulgação",
                        "Histórico completo de locações",
                        "Acesso web e mobile",
                        "Suporte prioritário"
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-700">
                          <div className="w-5 h-5 rounded-full border border-green-600 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-green-600" />
                          </div>
                          <span className="text-sm font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link href="/registro">
                        <Button className="w-full bg-tertiary hover:bg-tertiary/90 text-white h-12 rounded-lg text-base font-semibold shadow-sm shadow-blue-900/10 mb-4">
                        Começar teste grátis de 7 dias
                        </Button>
                    </Link>
                    <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                      <ShieldCheck className="w-3 h-3" /> Sem cartão de crédito • Cancele quando quiser
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Column */}
            <div className="flex flex-col">
              <div className="text-center lg:text-left mb-10">
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary mb-4">Perguntas frequentes</h2>
                   <p className="text-gray-600 text-lg">Tire suas dúvidas sobre a Lugo.</p>
              </div>
            
              <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-4">
                <AccordionItem value="item-1" className="bg-white hover:bg-white/80 transition-colors border border-secondary/10 hover:border-tertiary/50 rounded-lg px-6 shadow-sm">
                  <AccordionTrigger className="text-left cursor-pointer font-semibold hover:no-underline hover:text-tertiary py-6">Quanto custa a Lugo?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                    R$ 9,90 por mês, sem taxas adicionais. Você pode cadastrar quantos imóveis e inquilinos quiser — tudo incluído no mesmo valor. Oferecemos 7 dias de teste grátis para você experimentar sem compromisso.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="bg-white hover:bg-white/80 transition-colors border border-secondary/10 hover:border-tertiary/50 rounded-lg px-6 shadow-sm">
                  <AccordionTrigger className="text-left cursor-pointer font-semibold hover:no-underline hover:text-tertiary py-6">A Lugo cobra percentual sobre o aluguel?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                    Não! Diferente das imobiliárias que cobram 8-10% do valor do aluguel todo mês, a Lugo cobra apenas uma taxa fixa de R$ 9,90. O pagamento do aluguel é feito diretamente entre você e o inquilino.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="bg-white hover:bg-white/80 transition-colors border border-secondary/10 hover:border-tertiary/50 rounded-lg px-6 shadow-sm">
                  <AccordionTrigger className="text-left cursor-pointer font-semibold hover:no-underline hover:text-tertiary py-6">Posso cancelar a qualquer momento?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                    Sim! Não há contrato de fidelidade. Você pode cancelar quando quiser, sem multa e sem burocracia. Sua assinatura será encerrada no próximo ciclo de cobrança.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4" className="bg-white hover:bg-white/80 transition-colors border border-secondary/10 hover:border-tertiary rounded-lg px-6 shadow-sm">
                  <AccordionTrigger className="text-left cursor-pointer font-semibold hover:no-underline hover:text-tertiary py-6">Quantos imóveis posso cadastrar?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                    Quantos você tiver! A Lugo não tem limite de imóveis ou inquilinos. O valor de R$ 9,90/mês cobre todo o seu portfólio.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
