import Link from "next/link";
import { Building2, Home } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-secondary/5">
      <div className="container px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="transition-opacity hover:opacity-80">
              <Logo size="sm" />
            </Link>
            <p className="text-sm mt-4 text-muted-foreground">
              Plataforma de aluguel direto com o proprietário. Simples, seguro e sem intermediários.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-display font-semibold">Plataforma</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/como-funciona" className="transition-colors hover:text-tertiary">Como funciona</Link></li>
              <li><Link href="/precos" className="transition-colors hover:text-tertiary">Preços</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display font-semibold">Suporte</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/faq" className="transition-colors hover:text-tertiary">FAQ</Link></li>
              <li><Link href="/contato" className="transition-colors hover:text-tertiary">Contato</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/termos" className="transition-colors hover:text-tertiary">Termos de uso</Link></li>
              <li><Link href="/privacidade" className="transition-colors hover:text-tertiary">Privacidade</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-secondary/10 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Lugo. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
