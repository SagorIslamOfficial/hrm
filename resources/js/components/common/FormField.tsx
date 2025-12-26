import { DatePicker } from '@/components/common/DatePicker';
import { Checkbox } from '@/components/ui/checkbox';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface SelectOption {
    value: string;
    label: string;
}

interface BaseFieldProps {
    id: string;
    label?: string;
    error?: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
    disabled?: boolean;
    helperText?: string;
}

interface TextFieldProps extends BaseFieldProps {
    type: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';
    value: string;
    onChange: (value: string) => void;
}

interface NumberFieldProps extends BaseFieldProps {
    type: 'number';
    value: number | string;
    onChange: (value: number | string) => void;
    min?: number;
    max?: number;
    step?: number;
}

interface DateFieldProps extends BaseFieldProps {
    type: 'date';
    value: string;
    onChange: (value: string) => void;
    min?: string;
    max?: string;
}

interface TextareaFieldProps extends BaseFieldProps {
    type: 'textarea';
    value: string;
    onChange: (value: string) => void;
    rows?: number;
}

interface SelectFieldProps extends BaseFieldProps {
    type: 'select';
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
}

interface ComboboxFieldProps extends BaseFieldProps {
    type: 'combobox';
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    searchPlaceholder?: string;
    emptyText?: string;
}

interface FileFieldProps extends BaseFieldProps {
    type: 'file';
    value?: string | null;
    onChange: (file: File | null) => void;
    accept?: string;
    maxSize?: number;
    previewUrl?: string | null;
    onPreviewChange?: (preview: string | null) => void;
}

interface CheckboxFieldProps extends BaseFieldProps {
    type: 'checkbox';
    value: boolean;
    onChange: (value: boolean) => void;
    helperText?: string;
}

type FormFieldProps =
    | TextFieldProps
    | NumberFieldProps
    | DateFieldProps
    | TextareaFieldProps
    | SelectFieldProps
    | ComboboxFieldProps
    | FileFieldProps
    | CheckboxFieldProps;

export function FormField(props: FormFieldProps) {
    const {
        id,
        label,
        error,
        placeholder,
        required = false,
        className,
        disabled = false,
        helperText,
    } = props;

    const renderInput = () => {
        switch (props.type) {
            case 'select': {
                const selectValue = props.value || undefined;
                return (
                    <Select
                        value={selectValue}
                        onValueChange={props.onChange}
                        disabled={disabled}
                    >
                        <SelectTrigger
                            className={error ? 'border-destructive' : ''}
                        >
                            <SelectValue
                                placeholder={
                                    placeholder ||
                                    `Select ${label?.toLowerCase()}`
                                }
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {props.options.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            }

            case 'combobox': {
                const comboboxProps = props as ComboboxFieldProps;
                return (
                    <Combobox
                        options={comboboxProps.options}
                        value={comboboxProps.value}
                        onValueChange={comboboxProps.onChange}
                        placeholder={
                            placeholder || `Select ${label?.toLowerCase()}`
                        }
                        searchPlaceholder={
                            comboboxProps.searchPlaceholder || 'Search...'
                        }
                        emptyText={
                            comboboxProps.emptyText || 'No options found.'
                        }
                        className={cn(
                            'w-full',
                            error ? 'border-destructive' : '',
                        )}
                    />
                );
            }

            case 'textarea': {
                const textProps = props as TextareaFieldProps;
                return (
                    <Textarea
                        id={id}
                        value={textProps.value}
                        onChange={(e) => textProps.onChange(e.target.value)}
                        className={error ? 'border-destructive' : ''}
                        placeholder={
                            placeholder || `Enter ${label?.toLowerCase()}`
                        }
                        disabled={disabled}
                        rows={textProps.rows || 3}
                    />
                );
            }

            case 'number': {
                const numProps = props as NumberFieldProps;
                const handleChange = (
                    e: React.ChangeEvent<HTMLInputElement>,
                ) => {
                    // Pass raw string value so callers can decide how to parse (allows entering .50)
                    numProps.onChange(e.target.value);
                };
                return (
                    <Input
                        id={id}
                        type="number"
                        value={numProps.value}
                        onChange={handleChange}
                        className={error ? 'border-destructive' : ''}
                        placeholder={placeholder}
                        min={numProps.min}
                        max={numProps.max}
                        step={numProps.step ?? 'any'}
                        disabled={disabled}
                    />
                );
            }

            case 'date': {
                const dateProps = props as DateFieldProps;
                return (
                    <DatePicker
                        value={dateProps.value}
                        onChange={dateProps.onChange}
                        placeholder={placeholder || 'Pick a date'}
                        error={!!error}
                        disabled={disabled}
                    />
                );
            }

            case 'file':
            case 'checkbox':
                // These are handled separately below with special rendering
                return null;

            default: {
                const textProps = props as TextFieldProps;
                return (
                    <Input
                        id={id}
                        type={textProps.type}
                        value={textProps.value}
                        onChange={(e) => textProps.onChange(e.target.value)}
                        className={error ? 'border-destructive' : ''}
                        placeholder={
                            placeholder || `Enter ${label?.toLowerCase()}`
                        }
                        disabled={disabled}
                    />
                );
            }
        }
    };

    // Special handling for checkbox (render without wrapper div)
    if ('value' in props && props.type === 'checkbox') {
        return (
            <div className={`flex items-center space-x-2 ${className || ''}`}>
                <Checkbox
                    id={id}
                    checked={props.value}
                    onCheckedChange={props.onChange}
                    disabled={disabled}
                />
                <Label htmlFor={id} className="cursor-pointer">
                    {label} {required && '*'}
                </Label>
                {props.helperText && (
                    <p className="text-xs text-muted-foreground">
                        {props.helperText}
                    </p>
                )}
                {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
        );
    }

    // Special handling for file input
    if ('onChange' in props && props.type === 'file') {
        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) {
                props.onChange(null);
                if (props.onPreviewChange) {
                    props.onPreviewChange(null);
                }
                return;
            }

            // Validate file size if maxSize is provided
            if (props.maxSize && file.size > props.maxSize) {
                // Caller will handle validation error via props.error
                return;
            }

            props.onChange(file);
        };

        return (
            <div className={className}>
                <Label htmlFor={id}>
                    {label} {required && '*'}
                </Label>
                <div className="space-y-2">
                    {props.previewUrl && (
                        <img
                            src={props.previewUrl}
                            alt="File preview"
                            className="size-16 rounded-full border"
                        />
                    )}
                    <Input
                        id={id}
                        type="file"
                        accept={props.accept}
                        onChange={handleFileChange}
                        className={error ? 'border-destructive' : ''}
                        disabled={disabled}
                    />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
        );
    }

    return (
        <div className={className}>
            <Label htmlFor={id}>
                {label} {required && '*'}
            </Label>
            {renderInput()}
            {helperText && (
                <p className="text-xs text-muted-foreground opacity-80">
                    {helperText}
                </p>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}

// Re-export the SelectOption type for convenience
export type { SelectOption };
