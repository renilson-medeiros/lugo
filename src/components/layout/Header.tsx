import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/registro";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between" aria-label="Navegação principal">
        <Link 
          to="/" 
          className="flex items-center gap-2 transition-opacity hover:opacity-80 focus-visible:opacity-80"
          aria-label="AlugaFácil - Página inicial"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Home className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
          </div>
          <span className="font-display text-xl font-semibold text-foreground">AlugaFácil</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-4 md:flex">
          {!isAuthPage && (
            <>
              <Link to="/login">
                <Button variant="ghost" className="font-medium">
                  Entrar
                </Button>
              </Link>
              <Link to="/registro">
                <Button className="font-medium">
                  Começar agora
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Abrir menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[320px]">
            <div className="flex flex-col gap-6 pt-6">
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-semibold">Menu</span>
              </div>
              <nav className="flex flex-col gap-3" aria-label="Menu mobile">
                {!isAuthPage && (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start font-medium">
                        Entrar
                      </Button>
                    </Link>
                    <Link to="/registro" onClick={() => setIsOpen(false)}>
                      <Button className="w-full font-medium">
                        Começar agora
                      </Button>
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
