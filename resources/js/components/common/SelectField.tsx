import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    error?: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
    disabled?: boolean;
}

export function SelectField({
    id,
    label,
    value,
    onChange,
    options,
    error,
    placeholder,
    required = false,
    className,
    disabled = false,
}: SelectFieldProps) {
    // Convert empty string to undefined so placeholder shows
    const selectValue = value || undefined;

    return (
        <div className={className}>
            <Label htmlFor={id}>
                {label} {required && '*'}
            </Label>
            <Select
                value={selectValue}
                onValueChange={onChange}
                disabled={disabled}
            >
                <SelectTrigger className={error ? 'border-destructive' : ''}>
                    <SelectValue
                        placeholder={
                            placeholder || `Select ${label.toLowerCase()}`
                        }
                    />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
