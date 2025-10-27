import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TextareaFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
    disabled?: boolean;
    rows?: number;
}

export function TextareaField({
    id,
    label,
    value,
    onChange,
    error,
    placeholder,
    required = false,
    className,
    disabled = false,
    rows = 3,
}: TextareaFieldProps) {
    return (
        <div className={className}>
            <Label htmlFor={id}>
                {label} {required && '*'}
            </Label>
            <Textarea
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={error ? 'border-destructive' : ''}
                placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                disabled={disabled}
                rows={rows}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
