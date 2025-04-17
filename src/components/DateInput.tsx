import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Label } from "./ui/label"

interface DateInputProps {
    label: string
    value?: Date
    onChange?: (date: Date | undefined) => void
    className?: string
}

export default function DateInput({
    label,
    value,
    onChange,
    className,
}: DateInputProps) {
    const [date, setDate] = useState<Date | undefined>(value)

    const handleSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate)
        if (onChange) {
            onChange(selectedDate)
        }
    }

    return (
        <div className={cn("space-y-2", className)}>
            <Label htmlFor="date-input">{label}</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal cursor-pointer", date ? "bg-muted text-muted-foreground" : "bg-transparent")}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Select a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleSelect}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
