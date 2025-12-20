import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    iconOnly?: boolean;
    size?: "sm" | "md" | "lg";
}

export function Logo({ className, iconOnly = false, size = "md" }: LogoProps) {
    const sizes = {
        sm: {
            box: "h-7 w-7 rounded-md text-sm",
            text: "text-lg",
        },
        md: {
            box: "h-9 w-9 rounded-lg text-lg",
            text: "text-xl",
        },
        lg: {
            box: "h-12 w-12 rounded-xl text-2xl",
            text: "text-2xl",
        },
    };

    const currentSize = sizes[size];

    return (
        <div className={cn("flex items-center gap-2.5", className)}>
            <div
                className={cn(
                    "flex items-center justify-center bg-blue-600 font-bold text-white shadow-sm",
                    currentSize.box
                )}
            >
                L
            </div>
            {!iconOnly && (
                <span className={cn("font-display font-bold tracking-tight text-foreground", currentSize.text)}>
                    Lugo
                </span>
            )}
        </div>
    );
}
