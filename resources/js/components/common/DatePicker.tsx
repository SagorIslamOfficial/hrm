import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

interface DatePickerProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: boolean;
    disabled?: boolean;
    className?: string;
}

const formatDateToString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export function DatePicker({
    value,
    onChange,
    placeholder = 'Pick a date',
    error = false,
    disabled = false,
    className,
}: DatePickerProps) {
    const [open, setOpen] = useState(false);
    const selectedDate = value ? new Date(value) : undefined;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        'w-full justify-start text-left font-normal',
                        !selectedDate && 'text-muted-foreground',
                        error && 'border-destructive',
                        className,
                    )}
                    disabled={disabled}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                        format(selectedDate, 'PPP')
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                        setOpen(false);
                        const newValue = date ? formatDateToString(date) : '';
                        onChange(newValue);
                    }}
                    autoFocus
                />
            </PopoverContent>
        </Popover>
    );
}
