import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { useState } from 'react';

export interface CategorySelectorProps {
    categories: string[];
    onCategoriesChange: (categories: string[]) => void;
    predefinedCategories?: string[];
    label?: string;
    placeholder?: string;
    addButtonLabel?: string;
    required?: boolean;
    error?: string;
    maxCategories?: number;
    allowCustom?: boolean;
    toLowerCase?: boolean;
    className?: string;
}

export function CategorySelector({
    categories,
    onCategoriesChange,
    predefinedCategories = [],
    label = 'Categories',
    placeholder = 'Add custom category...',
    addButtonLabel = 'Add',
    required = false,
    error,
    maxCategories,
    allowCustom = true,
    toLowerCase = true,
    className = '',
}: CategorySelectorProps) {
    const [categoryInput, setCategoryInput] = useState('');

    const addCategory = (category: string) => {
        const trimmed = toLowerCase
            ? category.trim().toLowerCase()
            : category.trim();

        // Validation checks
        if (!trimmed) return;
        if (categories.includes(trimmed)) return;
        if (maxCategories && categories.length >= maxCategories) {
            return;
        }

        onCategoriesChange([...categories, trimmed]);
        setCategoryInput('');
    };

    const removeCategory = (category: string) => {
        onCategoriesChange(categories.filter((c) => c !== category));
    };

    const handleCategoryKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addCategory(categoryInput);
        }
    };

    const canAddMore = !maxCategories || categories.length < maxCategories;

    return (
        <div className={`my-6 ${className}`}>
            <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                    {label}{' '}
                    {required && <span className="text-destructive">*</span>}
                </Label>
                {maxCategories && (
                    <span className="text-xs text-muted-foreground">
                        {categories.length}/{maxCategories}
                    </span>
                )}
            </div>

            <div className="space-y-4 rounded-md border border-sidebar-border/70 p-6">
                {/* Predefined categories */}
                {predefinedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {predefinedCategories.map((category) => {
                            const isSelected = categories.includes(category);
                            const canSelect = isSelected || canAddMore;

                            return (
                                <Badge
                                    key={category}
                                    variant={isSelected ? 'default' : 'outline'}
                                    className={`capitalize ${canSelect ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                                    onClick={() => {
                                        if (!canSelect) return;

                                        if (isSelected) {
                                            removeCategory(category);
                                        } else {
                                            addCategory(category);
                                        }
                                    }}
                                >
                                    {category.replace(/_/g, ' ')}
                                </Badge>
                            );
                        })}
                    </div>
                )}

                {/* Custom category input */}
                {allowCustom && (
                    <div className="flex gap-2">
                        <Input
                            value={categoryInput}
                            onChange={(e) => setCategoryInput(e.target.value)}
                            onKeyDown={handleCategoryKeyDown}
                            placeholder={placeholder}
                            className="flex-1"
                            disabled={!canAddMore}
                        />
                        <Button
                            type="button"
                            variant="default"
                            className="cursor-pointer"
                            onClick={() => addCategory(categoryInput)}
                            disabled={!categoryInput.trim() || !canAddMore}
                        >
                            {addButtonLabel}
                        </Button>
                    </div>
                )}

                {/* Selected categories */}
                {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        <span className="text-sm text-muted-foreground">
                            Selected:
                        </span>
                        {categories.map((category) => (
                            <Badge
                                key={category}
                                variant="secondary"
                                className="gap-1 capitalize"
                            >
                                {category.replace(/_/g, ' ')}
                                <button
                                    type="button"
                                    onClick={() => removeCategory(category)}
                                    className="ml-1 hover:text-destructive"
                                >
                                    <X className="size-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}

                {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
        </div>
    );
}
