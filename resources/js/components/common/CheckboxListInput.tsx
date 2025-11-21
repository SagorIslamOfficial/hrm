import { AddItemInput, CheckboxGrid } from '@/components/common';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export interface CheckboxListItem {
    name: string;
}

export interface CheckboxListInputProps {
    selectedItems: (string | CheckboxListItem)[];
    hardcodedItems: string[];
    onChange: (items: CheckboxListItem[]) => void;
    error?: string;
    itemTypeLabel: string;
    addLabel: string;
    placeholder: string;
    columns?: number;
    helperText?: React.ReactNode;
    emptyInputMessage?: string;
    duplicateItemMessage?: string;
    alreadySelectedMessage?: string;
}

export function CheckboxListInput({
    selectedItems: selectedItemsProp,
    hardcodedItems,
    onChange,
    error,
    itemTypeLabel,
    addLabel,
    placeholder,
    columns = 5,
    helperText,
    emptyInputMessage = 'Please enter a value to add.',
    duplicateItemMessage,
    alreadySelectedMessage,
}: CheckboxListInputProps) {
    const [inputValue, setInputValue] = useState('');

    // Convert legacy string array to CheckboxListItem objects
    const selectedItems: CheckboxListItem[] = selectedItemsProp.map((item) => {
        if (typeof item === 'string') {
            return { name: item };
        }
        return item as CheckboxListItem;
    });

    // Extract custom items from selectedItems
    const customItems = selectedItems
        .filter((item) => !hardcodedItems.includes(item.name))
        .map((item) => item.name);

    // Get all available item names
    const allAvailableItems = [...hardcodedItems, ...customItems];

    // Get currently selected item names
    const selectedItemNames = selectedItems.map((item) => item.name);

    const handleCheckboxToggle = (itemName: string) => {
        if (selectedItemNames.includes(itemName)) {
            // Remove item
            onChange(selectedItems.filter((item) => item.name !== itemName));
        } else {
            // Add item
            onChange([...selectedItems, { name: itemName }]);
        }
    };

    const handleAddCustomItem = () => {
        const trimmedValue = inputValue.trim();
        if (!trimmedValue) {
            toast.error(emptyInputMessage);
            return;
        }
        if (allAvailableItems.includes(trimmedValue)) {
            toast.error(
                duplicateItemMessage || `This ${itemTypeLabel} already exists.`,
            );
            setInputValue('');
            return;
        }
        if (selectedItemNames.includes(trimmedValue)) {
            toast.error(
                alreadySelectedMessage ||
                    `This ${itemTypeLabel} is already selected.`,
            );
            setInputValue('');
            return;
        }

        // Auto-select the new item (checked by default)
        onChange([...selectedItems, { name: trimmedValue }]);

        setInputValue('');
    };

    const handleRemoveCustomItem = (itemName: string) => {
        onChange(selectedItems.filter((item) => item.name !== itemName));
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddCustomItem();
        } else if (e.key === 'Escape') {
            setInputValue('');
        }
    };

    // Build checkbox grid items
    const checkboxItems = [...hardcodedItems, ...customItems].map(
        (itemName) => {
            const isHardcoded = hardcodedItems.includes(itemName);
            const isCustom = customItems.includes(itemName);
            const isSelected = selectedItemNames.includes(itemName);

            return {
                name: itemName,
                isSelected,
                onChange: () => handleCheckboxToggle(itemName),
                isCustom,
                isHardcoded,
                actions: (
                    <>
                        {/* Show remove button for custom items */}
                        {isCustom && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => handleRemoveCustomItem(itemName)}
                                title={`Remove custom ${itemTypeLabel}`}
                                className="flex h-6 w-6 flex-shrink-0 cursor-pointer items-center justify-center bg-transparent p-0 hover:bg-transparent hover:text-red-500 dark:hover:text-red-400"
                            >
                                <X size={14} />
                            </Button>
                        )}
                    </>
                ),
            };
        },
    );

    return (
        <div className="space-y-4">
            <CheckboxGrid items={checkboxItems} columns={columns} />

            {/* Add Custom Item Section */}
            <AddItemInput
                value={inputValue}
                onChange={setInputValue}
                onSubmit={handleAddCustomItem}
                onKeyDown={handleInputKeyDown}
                label={addLabel}
                placeholder={placeholder}
                buttonLabel="Add"
                helperText={helperText}
                buttonDisabled={!inputValue.trim()}
                className="mt-2"
            />

            {/* Error Message */}
            {error && (
                <p className="text-sm text-red-500 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}
