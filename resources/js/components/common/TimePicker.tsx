import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ClockIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TimePickerProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: boolean;
    disabled?: boolean;
    className?: string;
    format?: '12h' | '24h';
}

export function TimePicker({
    value,
    onChange,
    placeholder = 'Pick a time',
    error = false,
    disabled = false,
    className,
}: TimePickerProps) {
    // Auto-detect format from value if it contains AM/PM
    const detectFormatFromValue = (timeString: string) => {
        if (!timeString || timeString.trim() === '') return null; // Return null to indicate no preference
        return (
            !timeString.toUpperCase().includes('AM') &&
            !timeString.toUpperCase().includes('PM')
        );
    };

    const [open, setOpen] = useState(false);
    const [is24Hour, setIs24Hour] = useState(() => {
        const detected = detectFormatFromValue(value);
        return detected !== null ? detected : false; // Default to 12-hour if no value
    });

    // Update format detection when value changes
    useEffect(() => {
        const detected = detectFormatFromValue(value);
        if (detected !== null) {
            setIs24Hour(detected);
        }
    }, [value]);

    // Parse time value (supports both HH:MM, HH:MM:SS, and H:MM AM/PM formats)
    const parseTime = (timeString: string) => {
        if (!timeString) return { hours: 9, minutes: 0, period: 'AM' };

        // Check if it's 12-hour format with AM/PM
        const twelveHourMatch = timeString.match(
            /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s+(AM|PM)$/i,
        );
        if (twelveHourMatch) {
            let hours = parseInt(twelveHourMatch[1], 10);
            const minutes = parseInt(twelveHourMatch[2], 10);
            const period = twelveHourMatch[4].toUpperCase();

            // Convert 12-hour to 24-hour for internal use
            if (period === 'PM' && hours !== 12) {
                hours += 12;
            } else if (period === 'AM' && hours === 12) {
                hours = 0;
            }

            return { hours, minutes, period };
        }

        // Check if it's 24-hour format (HH:MM or HH:MM:SS)
        const twentyFourHourMatch = timeString.match(
            /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/,
        );
        if (twentyFourHourMatch) {
            const hours = parseInt(twentyFourHourMatch[1], 10);
            const minutes = parseInt(twentyFourHourMatch[2], 10);
            const period = hours >= 12 ? 'PM' : 'AM';

            return { hours, minutes, period };
        }

        // Fallback
        return { hours: 9, minutes: 0, period: 'AM' };
    };

    const { hours, minutes, period } = parseTime(value);

    const formatTime = (h: number, m: number, p: string = 'AM') => {
        if (is24Hour) {
            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        } else {
            const displayHours = h === 0 ? 12 : h > 12 ? h - 12 : h;
            return `${displayHours}:${String(m).padStart(2, '0')} ${p}`;
        }
    };

    const handleTimeSelect = (
        newHours: number,
        newMinutes: number,
        newPeriod: string = period,
    ) => {
        let adjustedHours = newHours;

        // Adjust hours based on period for 12-hour format
        if (!is24Hour) {
            if (newPeriod === 'PM' && newHours !== 12) {
                adjustedHours = newHours + 12;
            } else if (newPeriod === 'AM' && newHours === 12) {
                adjustedHours = 0;
            } else if (newPeriod === 'AM') {
                adjustedHours = newHours;
            } else if (newPeriod === 'PM' && newHours === 12) {
                adjustedHours = 12;
            }
        }

        // Store in the format that matches the current display mode
        const timeString = is24Hour
            ? `${String(adjustedHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`
            : `${newHours === 0 ? 12 : newHours > 12 ? newHours - 12 : newHours}:${String(newMinutes).padStart(2, '0')} ${newPeriod}`;

        onChange(timeString);
    };

    const generateHours = () => {
        if (is24Hour) {
            return Array.from({ length: 24 }, (_, i) => i);
        } else {
            return Array.from({ length: 12 }, (_, i) => i + 1); // 1-12 for 12-hour format
        }
    };

    const generateMinutes = () => {
        return Array.from({ length: 60 }, (_, i) => i);
    };

    const displayHours = is24Hour
        ? hours
        : hours === 0
          ? 12
          : hours > 12
            ? hours - 12
            : hours;
    const displayPeriod = hours >= 12 ? 'PM' : 'AM';

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        'w-full justify-start text-left font-normal',
                        !value && 'text-muted-foreground',
                        error && 'border-destructive',
                        className,
                    )}
                    disabled={disabled}
                >
                    <ClockIcon className="mr-2 h-4 w-4" />
                    {value ? (
                        <span>
                            {formatTime(displayHours, minutes, displayPeriod)}
                        </span>
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Select Time</div>
                        <div className="flex items-center space-x-2">
                            <Button
                                size="sm"
                                variant={is24Hour ? 'default' : 'outline'}
                                onClick={() => setIs24Hour(true)}
                                className="h-7 px-2 text-xs"
                            >
                                24H
                            </Button>
                            <Button
                                size="sm"
                                variant={!is24Hour ? 'default' : 'outline'}
                                onClick={() => setIs24Hour(false)}
                                className="h-7 px-2 text-xs"
                            >
                                12H
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="mb-2 block text-xs text-muted-foreground">
                                Hours
                            </label>
                            <div className="max-h-32 overflow-y-auto rounded border">
                                {generateHours().map((hour) => (
                                    <button
                                        key={hour}
                                        type="button"
                                        className={cn(
                                            'w-full px-3 py-1 text-left text-sm hover:bg-accent hover:text-accent-foreground',
                                            hour === displayHours &&
                                                'bg-accent font-medium text-accent-foreground',
                                        )}
                                        onClick={() =>
                                            handleTimeSelect(
                                                hour,
                                                minutes,
                                                is24Hour ? 'AM' : period, // Period doesn't matter for 24h mode
                                            )
                                        }
                                    >
                                        {String(hour).padStart(
                                            is24Hour ? 2 : 1,
                                            '0',
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs text-muted-foreground">
                                Minutes
                            </label>
                            <div className="max-h-32 overflow-y-auto rounded border">
                                {generateMinutes().map((minute) => (
                                    <button
                                        key={minute}
                                        type="button"
                                        className={cn(
                                            'w-full px-3 py-1 text-left text-sm hover:bg-accent hover:text-accent-foreground',
                                            minute === minutes &&
                                                'bg-accent font-medium text-accent-foreground',
                                        )}
                                        onClick={() =>
                                            handleTimeSelect(
                                                is24Hour ? hours : displayHours,
                                                minute,
                                                period,
                                            )
                                        }
                                    >
                                        {String(minute).padStart(2, '0')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {!is24Hour && (
                            <div>
                                <label className="mb-2 block text-xs text-muted-foreground">
                                    Period
                                </label>
                                <div className="space-y-1">
                                    {['AM', 'PM'].map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            className={cn(
                                                'w-full rounded border px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground',
                                                p === period &&
                                                    'bg-accent font-medium text-accent-foreground',
                                            )}
                                            onClick={() =>
                                                handleTimeSelect(
                                                    displayHours,
                                                    minutes,
                                                    p,
                                                )
                                            }
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between border-t pt-2">
                        <div className="text-sm text-muted-foreground">
                            Selected:{' '}
                            {formatTime(displayHours, minutes, displayPeriod)}
                        </div>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Done
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
