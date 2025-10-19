import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NumberFieldProps {
    id: string;
    label: string;
    value: number | string;
    onChange: (value: number) => void;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

export function NumberField({
    id,
    label,
    value,
    onChange,
    placeholder,
    min,
    max,
    step = 1,
    required = false,
    disabled = false,
    className = '',
}: NumberFieldProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numValue = e.target.value === '' ? 0 : Number(e.target.value);
        onChange(numValue);
    };

    return (
        <div className={className}>
            <Label htmlFor={id}>
                {label}
                {required && <span className="ml-1 text-destructive">*</span>}
            </Label>
            <Input
                id={id}
                type="number"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                min={min}
                max={max}
                step={step}
                required={required}
                disabled={disabled}
            />
        </div>
    );
}
