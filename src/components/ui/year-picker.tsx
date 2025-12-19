"use client"

import * as React from "react"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface YearPickerProps {
    value: string
    onChange: (year: string) => void
    startYear?: number
    endYear?: number
    placeholder?: string
    disabled?: boolean
    className?: string
}

export function YearPicker({
    value,
    onChange,
    startYear = 2020,
    endYear = 2099,
    placeholder = "Selecione o ano",
    disabled,
    className
}: YearPickerProps) {
    const [open, setOpen] = React.useState(false)

    // Create array of years
    const years = Array.from(
        { length: endYear - startYear + 1 },
        (_, i) => (startYear + i).toString()
    )

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground",
                        className
                    )}
                    disabled={disabled}
                >
                    <CalendarIcon className="h-4 w-4 text-blue-500" />
                    {value ? value : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3" align="start">
                <div className="grid grid-cols-3 gap-2">
                    {years.map((year) => (
                        <Button
                            key={year}
                            variant={value === year ? "default" : "ghost"}
                            className={cn(
                                "h-9 w-full font-normal",
                                value === year && "bg-blue-500 hover:bg-blue-400 text-white"
                            )}
                            onClick={() => {
                                onChange(year)
                                setOpen(false)
                            }}
                        >
                            {year}
                        </Button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}
