import Link from "next/link";
import { Building2, Home } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-secondary/30">
      <div className="container px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
                <Building2 className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
              </div>
              <span className="font-display text-lg font-semibold">Alugue Fácil</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Plataforma de aluguel direto com o proprietário. Simples, seguro e sem intermediários.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-display font-semibold">Plataforma</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/como-funciona" className="transition-colors hover:text-blue-500">Como funciona</Link></li>
              <li><Link href="/precos" className="transition-colors hover:text-blue-500">Preços</Link></li>
              <li><Link href="/como-funciona" className="transition-colors hover:text-blue-500">Para proprietários</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display font-semibold">Suporte</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/faq" className="transition-colors hover:text-blue-500">Central de ajuda</Link></li>
              <li><Link href="/contato" className="transition-colors hover:text-blue-500">Contato</Link></li>
              <li><Link href="/faq" className="transition-colors hover:text-blue-500">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/termos" className="transition-colors hover:text-blue-500">Termos de uso</Link></li>
              <li><Link href="/privacidade" className="transition-colors hover:text-blue-500">Privacidade</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Alugue Fácil. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
