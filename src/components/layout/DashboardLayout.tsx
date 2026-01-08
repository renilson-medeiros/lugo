"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Home,
  Building2,
  Users,
  Receipt,
  Settings,
  LogOut,
  Menu,
  Plus,
  Lock
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/ui/Logo";
import { Paywall } from "@/components/dashboard/Paywall";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { icon: Home, label: "Painel", href: "/dashboard" },
  { icon: Building2, label: "Imóveis", href: "/dashboard/imoveis" },
  { icon: Users, label: "Inquilinos", href: "/dashboard/inquilinos" },
  { icon: Receipt, label: "Comprovantes", href: "/dashboard/comprovantes" },
  { icon: Settings, label: "Configurações", href: "/dashboard/configuracoes" },
];

function NavItem({
  item,
  isActive,
  disabled,
  onClick
}: {
  item: typeof menuItems[0];
  isActive: boolean;
  disabled?: boolean;
  onClick?: () => void
}) {
  if (disabled) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium opacity-50 cursor-not-allowed text-muted-foreground"
        )}
      >
        <item.icon className="h-5 w-5" aria-hidden="true" />
        {item.label}
        <Lock className="h-3 w-3 ml-auto text-muted-foreground/50" />
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-primary/10 text-tertiary"
          : "text-tertiary/90 hover:bg-tertiary hover:text-white"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <item.icon className="h-5 w-5" aria-hidden="true" />
      {item.label}
    </Link>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, profile } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      router.refresh(); // Limpa cache do roteador
      router.push("/login");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  // Verificação de Trial Expirado (Paywall)
  const isExpired = !!(
    profile?.subscription_status === 'trial' &&
    profile?.expires_at &&
    new Date(profile.expires_at) < new Date()
  );

  const isSettingsPage = pathname === "/dashboard/configuracoes";

  return (
    <div className="min-h-screen bg-primary/5">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-border/40 bg-card lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b border-border/40 px-6">
            <Logo />
          </div>

          <nav className="flex-1 space-y-2 p-4" aria-label="Menu do painel">
            {menuItems.map((item) => {
              const isDisabled = isExpired && item.href !== "/dashboard/configuracoes" && item.href !== "/dashboard";
              return (
                <NavItem
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href}
                  disabled={isDisabled}
                />
              );
            })}
          </nav>

          <div className="border-t border-border/40 p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-white hover:bg-red-500"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" aria-hidden="true" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Logo size="sm" />
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Abrir menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-96 p-0">
              <div className="flex h-full flex-col">
                <div className="flex h-16 items-center gap-2 border-b border-border/40 px-6">
                  <span className="font-display text-lg font-semibold">Menu</span>
                </div>

                <nav className="flex-1 space-y-1 p-4" aria-label="Menu mobile">
                  {menuItems.map((item) => {
                    const isDisabled = isExpired && item.href !== "/dashboard/configuracoes" && item.href !== "/dashboard";
                    return (
                      <NavItem
                        key={item.href}
                        item={item}
                        isActive={pathname === item.href}
                        disabled={isDisabled}
                        onClick={() => setIsOpen(false)}
                      />
                    );
                  })}
                </nav>

                <div className="border-t border-border/40 p-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-3 h-5 w-5" aria-hidden="true" />
                    Sair
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="container px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {isExpired && !isSettingsPage ? (
            <Paywall />
          ) : (
            children
          )}
        </div>
      </main>
    </div>
  );
}

