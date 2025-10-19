import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TextFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
    disabled?: boolean;
    type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';
}

export function TextField({
    id,
    label,
    value,
    onChange,
    error,
    placeholder,
    required = false,
    className,
    disabled = false,
    type = 'text',
}: TextFieldProps) {
    return (
        <div className={className}>
            <Label htmlFor={id}>
                {label} {required && '*'}
            </Label>
            <Input
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={error ? 'border-destructive' : ''}
                placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                disabled={disabled}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
