import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';

interface AddItemInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    placeholder?: string;
    label?: string;
    helperText?: React.ReactNode;
    buttonLabel?: string;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    buttonDisabled?: boolean;
    className?: string;
}

export function AddItemInput({
    value,
    onChange,
    onSubmit,
    placeholder = 'Type an item and press Enter',
    label = 'Add New Item',
    helperText,
    buttonLabel = 'Add',
    onKeyDown,
    disabled = false,
    buttonDisabled = false,
    className = '',
}: AddItemInputProps) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (onKeyDown) {
            onKeyDown(e);
        }
    };

    return (
        <div className={`border-t pt-4 ${className}`}>
            <label className="mb-3 block text-sm font-medium text-gray-900 dark:text-gray-100">
                {label}
            </label>
            <div className="space-y-2">
                <div className="flex gap-2">
                    <Input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="flex-1"
                        disabled={disabled}
                    />

                    <Button
                        type="button"
                        onClick={onSubmit}
                        disabled={buttonDisabled}
                        className="cursor-pointer"
                        variant="default"
                    >
                        {buttonLabel}
                    </Button>
                </div>

                {helperText && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {helperText}
                    </p>
                )}
            </div>
        </div>
    );
}
