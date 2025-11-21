import { DynamicListField, DynamicListInput } from '@/components/common';
import { ReactNode } from 'react';

interface ApprovalHierarchyInputProps {
    value: string[] | null;
    onChange: (hierarchy: string[]) => void;
    error?: string;
}

const FIELDS: DynamicListField[] = [
    {
        id: 'level',
        label: 'Approval Level Name',
        type: 'text',
        placeholder: 'e.g., Manager, Director, Head, CFO',
    },
];

export function ApprovalHierarchyInput({
    value,
    onChange,
    error,
}: ApprovalHierarchyInputProps) {
    const getItemKey = (formValues: Record<string, null | string>) => {
        const level = String(formValues.level).trim();
        if (!level) return '';
        return level.toLowerCase().replace(/\s+/g, '_');
    };

    // Convert string[] to Record<string, string> for DynamicListInput
    const hierarchyRecord: Record<string, string | null> = {};
    if (Array.isArray(value)) {
        value.forEach((level) => {
            const key = String(level).toLowerCase().replace(/\s+/g, '_');
            hierarchyRecord[key] = level;
        });
    }

    const handleChange = (updatedRecord: Record<string, string | null>) => {
        const newHierarchy = Object.values(updatedRecord)
            .filter(
                (value): value is string =>
                    typeof value === 'string' && value.trim().length > 0,
            )
            .map((value) => value.trim());
        onChange(newHierarchy);
    };

    const getItemDisplay = (key: string, level: string): ReactNode => {
        const index = (Array.isArray(value) ? value : []).indexOf(level);
        return (
            <div className="flex items-center gap-2 truncate">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                    {Math.max(index + 1, 1)}
                </span>
                <span className="truncate">{level}</span>
            </div>
        );
    };

    return (
        <DynamicListInput
            value={hierarchyRecord}
            onChange={handleChange}
            error={error}
            listTitle="Approval Chain"
            addTitle="Add New Approval Level"
            editTitle="Edit Approval Level"
            fields={FIELDS}
            getItemDisplay={getItemDisplay}
            getItemKey={getItemKey}
            itemAddedMessage="Approval level added."
            itemUpdatedMessage="Approval level updated."
            itemDeletedMessage="Approval level removed."
            itemExistsMessage="This approval level already exists."
            gridCols="md:grid-cols-4"
        />
    );
}
