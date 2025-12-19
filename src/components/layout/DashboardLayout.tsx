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
  Plus
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

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

function NavItem({ item, isActive, onClick }: { item: typeof menuItems[0]; isActive: boolean; onClick?: () => void }) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-blue-50 text-blue-500"
          : "text-muted-foreground hover:bg-blue-50 hover:text-accent-foreground"
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
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-border/40 bg-card lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center gap-2 border-b border-border/40 px-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500">
              <Building2 className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
            </div>
            <span className="font-display text-xl font-semibold">Alugue Fácil</span>
          </div>

          <nav className="flex-1 space-y-1 p-4" aria-label="Menu do painel">
            {menuItems.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                isActive={pathname === item.href}
              />
            ))}
          </nav>

          <div className="border-t border-border/40 p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-400 hover:text-red-500 hover:bg-red-50"
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
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
              <Building2 className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
            </div>
            <span className="font-display text-lg font-semibold">Alugue Fácil</span>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Abrir menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-full flex-col">
                <div className="flex h-16 items-center gap-2 border-b border-border/40 px-6">
                  <span className="font-display text-lg font-semibold">Menu</span>
                </div>

                <nav className="flex-1 space-y-1 p-4" aria-label="Menu mobile">
                  {menuItems.map((item) => (
                    <NavItem
                      key={item.href}
                      item={item}
                      isActive={pathname === item.href}
                      onClick={() => setIsOpen(false)}
                    />
                  ))}
                </nav>

                <div className="border-t border-border/40 p-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-400"
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
        <div className="container px-4 md:px-8 py-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
