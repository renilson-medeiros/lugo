import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-secondary/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Home className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
              </div>
              <span className="font-display text-lg font-semibold">AlugaFácil</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Plataforma de aluguel direto com o proprietário. Simples, seguro e sem intermediários.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 font-display font-semibold">Plataforma</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/registro" className="transition-colors hover:text-foreground">Como funciona</Link></li>
              <li><Link to="/registro" className="transition-colors hover:text-foreground">Preços</Link></li>
              <li><Link to="/registro" className="transition-colors hover:text-foreground">Para proprietários</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 font-display font-semibold">Suporte</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="#" className="transition-colors hover:text-foreground">Central de ajuda</Link></li>
              <li><Link to="#" className="transition-colors hover:text-foreground">Contato</Link></li>
              <li><Link to="#" className="transition-colors hover:text-foreground">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 font-display font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="#" className="transition-colors hover:text-foreground">Termos de uso</Link></li>
              <li><Link to="#" className="transition-colors hover:text-foreground">Privacidade</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AlugaFácil. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
