import {
    DataTableActions,
    FormActions,
    FormField,
    InfoCard,
} from '@/components/common';
import { ReactNode, useState } from 'react';
import { toast } from 'sonner';

export interface DynamicListItem {
    key: string;
    value: unknown;
    display?: ReactNode;
}

export interface DynamicListField {
    id: string;
    label: string;
    type: 'text' | 'number' | 'email' | 'password' | 'date';
    placeholder?: string;
    disabled?: boolean;
    min?: number;
    max?: number;
    step?: number;
}

export interface DynamicListInputProps {
    value: Record<string, unknown> | null;
    onChange: (value: Record<string, unknown>) => void;
    error?: string;
    listTitle: string;
    addTitle: string;
    editTitle: string;
    fields: DynamicListField[];
    getItemDisplay: (key: string, value: unknown) => ReactNode;
    getItemKey: (formValues: Record<string, unknown>) => string;
    onBeforeAdd?: (key: string, value: unknown) => boolean;
    onBeforeUpdate?: (key: string, oldKey: string, value: unknown) => boolean;
    onBeforeDelete?: (key: string, value: unknown) => boolean;
    itemAddedMessage?: string;
    itemUpdatedMessage?: string;
    itemDeletedMessage?: string;
    itemExistsMessage?: string;
    itemEmptyMessage?: string;
    gridCols?: string;
}

export function DynamicListInput({
    value,
    onChange,
    error,
    listTitle,
    addTitle,
    editTitle,
    fields,
    getItemDisplay,
    getItemKey,
    onBeforeAdd,
    onBeforeUpdate,
    onBeforeDelete,
    itemAddedMessage = 'Item added.',
    itemUpdatedMessage = 'Item updated.',
    itemDeletedMessage = 'Item removed.',
    itemExistsMessage = 'This item already exists.',
    itemEmptyMessage = 'The input fields cannot be empty.',
    gridCols = 'md:grid-cols-3',
}: DynamicListInputProps) {
    const [formValues, setFormValues] = useState<Record<string, unknown>>({});
    const [editingKey, setEditingKey] = useState<string | null>(null);

    const items = value || {};
    const entries = Object.entries(items);

    const handleFormChange = (fieldId: string, fieldValue: unknown) => {
        const newFormValues = {
            ...formValues,
            [fieldId]: fieldValue,
        };

        // For number fields, convert empty strings to undefined to ensure proper validation
        if (
            fields.find((f) => f.id === fieldId)?.type === 'number' &&
            fieldValue === ''
        ) {
            newFormValues[fieldId] = undefined;
        }

        setFormValues(newFormValues);
    };

    const isFormValid = () => {
        for (const field of fields) {
            const val = formValues[field.id];
            if (field.type === 'number') {
                const numVal = Number(val);
                if (
                    val === '' ||
                    val === null ||
                    val === undefined ||
                    isNaN(numVal) ||
                    numVal < 0
                ) {
                    return false;
                }
            } else {
                if (
                    val === '' ||
                    val === null ||
                    val === undefined ||
                    !String(val).trim()
                ) {
                    return false;
                }
            }
        }
        return true;
    };

    const getFormValue = () => {
        // For single field, return the field value
        // For multiple fields, return the second field (typically the value field)
        if (fields.length === 1) {
            return formValues[fields[0].id];
        }
        return formValues[fields[fields.length - 1].id];
    };

    const hasChangesInEditMode = () => {
        if (editingKey === null) return true;

        const oldValue = items[editingKey];

        // For single field components (like ApprovalHierarchyInput)
        if (fields.length === 1) {
            const newValue = formValues[fields[0].id];
            return JSON.stringify(oldValue) !== JSON.stringify(newValue);
        }
        // For multi-field components (like CustomSettingsInput)
        else if (fields.length === 2) {
            const newKey = getItemKey(formValues);
            const newValue = formValues[fields[1].id];
            return (
                editingKey !== newKey ||
                JSON.stringify(oldValue) !== JSON.stringify(newValue)
            );
        }

        return true;
    };

    const handleSubmit = () => {
        // Validate all fields are filled
        if (!isFormValid()) {
            toast.error(itemEmptyMessage);
            return;
        }

        const newKey = getItemKey(formValues);
        const newValue = getFormValue();

        // Prevent empty keys
        if (!String(newKey).trim()) {
            toast.error(itemEmptyMessage);
            return;
        }

        if (editingKey !== null) {
            // Update existing item
            if (
                onBeforeUpdate &&
                !onBeforeUpdate(newKey, editingKey, newValue)
            ) {
                return;
            }

            const updatedItems = { ...items };
            if (newKey !== editingKey) {
                delete updatedItems[editingKey];
            }
            updatedItems[newKey] = newValue;
            onChange(updatedItems);
            toast.success(itemUpdatedMessage);
            setEditingKey(null);
        } else {
            // Add new item
            if (items[newKey] !== undefined) {
                toast.error(itemExistsMessage);
                return;
            }

            if (onBeforeAdd && !onBeforeAdd(newKey, newValue)) {
                return;
            }

            onChange({
                ...items,
                [newKey]: newValue,
            });
            toast.success(itemAddedMessage);
        }

        setFormValues({});
    };

    const handleEdit = (key: string) => {
        const values: Record<string, unknown> = {};

        // For single field components (like ApprovalHierarchyInput)
        if (fields.length === 1) {
            values[fields[0].id] = items[key]; // The actual value
        }
        // For multi-field components (like CustomSettingsInput, LeavePoliciesInput)
        else if (fields.length === 2) {
            // For components where key is generated from first field (like LeavePoliciesInput)
            // We need to reverse-engineer the original input from the key
            if (fields[0].id === 'label') {
                // Convert key back to label (e.g., 'annual_leave' -> 'Annual Leave')
                values[fields[0].id] = key
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase());
            } else {
                values[fields[0].id] = key; // The key itself
            }
            values[fields[1].id] = items[key]; // The value
        }

        setFormValues(values);
        setEditingKey(key);
    };

    const handleDelete = (key: string) => {
        const itemValue = items[key];
        if (onBeforeDelete && !onBeforeDelete(key, itemValue)) {
            return;
        }

        const newItems = { ...items };
        delete newItems[key];
        onChange(newItems);

        if (editingKey === key) {
            setFormValues({});
            setEditingKey(null);
        }

        toast.success(itemDeletedMessage);
    };

    const handleCancel = () => {
        setFormValues({});
        setEditingKey(null);
    };

    return (
        <div className="space-y-4">
            {/* Existing Items List */}
            {entries.length > 0 && (
                <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">
                        {listTitle}
                    </div>
                    <div className={`grid auto-rows-fr gap-4 ${gridCols}`}>
                        {entries.map(([key, val]) => (
                            <InfoCard
                                key={key}
                                title={getItemDisplay(key, val)}
                                className="h-14 py-3 text-sm text-gray-700 dark:text-gray-700"
                                action={
                                    <DataTableActions
                                        item={{ key, val }}
                                        onEdit={() => handleEdit(key)}
                                        onDelete={() => handleDelete(key)}
                                        showView={false}
                                        editLabel="Edit item"
                                        deleteLabel="Remove item"
                                    />
                                }
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Add/Edit Form */}
            <InfoCard
                title={editingKey !== null ? editTitle : addTitle}
                className="text-sm text-gray-600 dark:text-gray-700"
            >
                <div className="grid gap-4 md:grid-cols-3">
                    {fields.map((field) => {
                        const fieldValue = formValues[field.id] ?? '';
                        const stringValue =
                            typeof fieldValue === 'string' ||
                            typeof fieldValue === 'number'
                                ? String(fieldValue)
                                : '';

                        return (
                            <FormField
                                key={field.id}
                                {...({
                                    type: field.type,
                                    id: field.id,
                                    label: field.label,
                                    value: stringValue,
                                    onChange: (
                                        value: string | number | boolean,
                                    ) => handleFormChange(field.id, value),
                                    placeholder: field.placeholder,
                                    min: field.min,
                                    max: field.max,
                                    step: field.step,
                                } as unknown as React.ComponentProps<
                                    typeof FormField
                                >)}
                            />
                        );
                    })}

                    <FormActions
                        onSubmit={handleSubmit}
                        onCancel={
                            editingKey !== null ? handleCancel : undefined
                        }
                        submitLabel={editingKey !== null ? 'Update' : 'Add'}
                        cancelLabel="Cancel"
                        disabled={!isFormValid() || !hasChangesInEditMode()}
                        showCancel={editingKey !== null}
                        showReset={false}
                        className="mt-5 flex justify-start gap-2"
                    />
                </div>
            </InfoCard>

            {/* Error Message */}
            {error && (
                <p className="text-sm text-red-500 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}
