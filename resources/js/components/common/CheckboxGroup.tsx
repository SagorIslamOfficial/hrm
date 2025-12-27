import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export interface CheckboxGroupItem {
    key: string;
    label: string;
    description?: string;
    value: boolean;
    id?: string;
}

export interface CheckboxGroupProps {
    items: CheckboxGroupItem[];
    onChange: (key: string, value: boolean) => void;
    title?: string;
    columns?: 1 | 2 | 3 | 4;
    error?: string;
    className?: string;
}

export function CheckboxGroup({
    items,
    onChange,
    title,
    columns = 3,
    error,
    className = '',
}: CheckboxGroupProps) {
    const gridColsClass = {
        1: 'md:grid-cols-1',
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-4',
    }[columns];

    return (
        <div className={className}>
            {title && <Label className="text-sm font-medium">{title}</Label>}

            <div
                className={`grid gap-6 rounded-md border border-sidebar-border/70 p-6 ${gridColsClass}`}
            >
                {items.map((item) => {
                    const checkboxId = item.id || item.key;

                    return (
                        <div
                            key={item.key}
                            className="flex items-start space-x-3"
                        >
                            <Checkbox
                                id={checkboxId}
                                className="mt-1"
                                checked={item.value}
                                onCheckedChange={(checked) =>
                                    onChange(item.key, checked as boolean)
                                }
                            />
                            <div>
                                <Label
                                    htmlFor={checkboxId}
                                    className="cursor-pointer font-medium"
                                >
                                    {item.label}
                                </Label>
                                {item.description && (
                                    <p className="text-xs text-muted-foreground">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </div>
    );
}
