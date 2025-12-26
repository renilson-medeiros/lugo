import { Check, X } from "lucide-react";

interface PasswordStrengthMeterProps {
    password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
    if (!password) return null;

    return (
        <div className="space-y-1.5 mt-2">
            <div className="flex items-center gap-2 text-xs">
                {password.length >= 8 ? (
                    <Check className="h-3 w-3 text-green-600" />
                ) : (
                    <X className="h-3 w-3 text-red-500" />
                )}
                <span className={password.length >= 8 ? "text-green-600" : "text-muted-foreground"}>
                    Mínimo 8 caracteres
                </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
                {/[A-Z]/.test(password) ? (
                    <Check className="h-3 w-3 text-green-600" />
                ) : (
                    <X className="h-3 w-3 text-red-500" />
                )}
                <span className={/[A-Z]/.test(password) ? "text-green-600" : "text-muted-foreground"}>
                    Uma letra maiúscula
                </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
                {/[a-z]/.test(password) ? (
                    <Check className="h-3 w-3 text-green-600" />
                ) : (
                    <X className="h-3 w-3 text-red-500" />
                )}
                <span className={/[a-z]/.test(password) ? "text-green-600" : "text-muted-foreground"}>
                    Uma letra minúscula
                </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
                {/[0-9]/.test(password) ? (
                    <Check className="h-3 w-3 text-green-600" />
                ) : (
                    <X className="h-3 w-3 text-red-500" />
                )}
                <span className={/[0-9]/.test(password) ? "text-green-600" : "text-muted-foreground"}>
                    Um número
                </span>
            </div>
        </div>
    );
}
