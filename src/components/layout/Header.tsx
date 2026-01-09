"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, X, Building2, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/ui/Logo";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const isAuthPage = pathname === "/login" || pathname === "/registro";
  const isPropertyPublicPage = pathname.startsWith("/imovel/");
  const showNav = user || (!isPropertyPublicPage && !isAuthPage);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    router.refresh();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <nav className="container px-4 flex h-16 items-center justify-between" aria-label="Navegação principal">
        <Link
          href="/"
          className="transition-opacity hover:opacity-80 focus-visible:opacity-80"
          aria-label="Lugo - Página inicial"
        >
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-4 md:flex">
          {showNav && !isAuthPage && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  <Link href="/dashboard">
                    <Button className="font-medium bg-tertiary hover:bg-tertiary/90 gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="font-medium text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={handleSignOut}
                  >
                    Sair
                  </Button>
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="font-medium">
                      Entrar
                    </Button>
                  </Link>
                  <Link href="/registro">
                    <Button className="font-medium bg-tertiary hover:bg-tertiary/90">
                      Começar agora
                    </Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        {showNav && (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Abrir menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-96 sm:w-[320px]">
              <div className="flex flex-col gap-6 pt-6">
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-semibold">Menu</span>
                </div>
                <nav className="flex flex-col gap-3" aria-label="Menu mobile">
                  {!isAuthPage && (
                    <>
                      {user ? (
                        <div className="flex flex-col gap-3">
                          <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                            <Button className="w-full font-medium bg-tertiary hover:bg-tertiary/90 gap-2">
                              <LayoutDashboard className="h-4 w-4" />
                              Dashboard
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            className="w-full justify-start font-medium text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={handleSignOut}
                          >
                            Sair
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Link href="/login" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start font-medium">
                              Entrar
                            </Button>
                          </Link>
                          <Link href="/registro" onClick={() => setIsOpen(false)}>
                            <Button className="w-full font-medium bg-tertiary hover:bg-tertiary/90">
                              Começar agora
                            </Button>
                          </Link>
                        </>
                      )}
                    </>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </nav>
    </header>
  );
}
