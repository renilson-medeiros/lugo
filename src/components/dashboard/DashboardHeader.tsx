"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  };
}

export function DashboardHeader({ title, subtitle, action }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">{title}</h1>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
      {action && (
        <Link href={action.href}>
          <Button size="lg" className="gap-2 w-full md:w-fit bg-tertiary hover:bg-tertiary/90">
            {action.icon || <Plus className="h-4 w-4" aria-hidden="true" />}
            {action.label}
          </Button>
        </Link>
      )}
    </div>
  );
}
