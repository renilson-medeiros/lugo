"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="py-12">
      <CardContent className="flex flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
          {icon}
        </div>
        <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        {action && (
          <Link href={action.href} className="mt-4">
            <Button className="gap-2 bg-tertiary hover:bg-tertiary/90">
              <Plus className="h-4 w-4" aria-hidden="true" />
              {action.label}
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
