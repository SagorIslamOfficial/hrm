import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DateFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
    min?: string;
    max?: string;
    disabled?: boolean;
}

export function DateField({
    id,
    label,
    value,
    onChange,
    error,
    placeholder,
    required = false,
    className,
    min,
    max,
    disabled = false,
}: DateFieldProps) {
    return (
        <div className={className}>
            <Label htmlFor={id}>
                {label} {required && '*'}
            </Label>
            <Input
                id={id}
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={error ? 'border-destructive' : ''}
                placeholder={placeholder}
                min={min}
                max={max}
                disabled={disabled}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
