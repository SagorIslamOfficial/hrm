import { DynamicListField, DynamicListInput } from '@/components/common';
import type { CustomSettingValue } from '@/types/branch';
import { ReactNode } from 'react';

interface CustomSettingsInputProps {
    value: Record<string, CustomSettingValue> | null;
    onChange: (settings: Record<string, CustomSettingValue>) => void;
    error?: string;
}

const FIELDS: DynamicListField[] = [
    {
        id: 'key',
        label: 'Setting Key',
        type: 'text',
        placeholder: 'e.g., Dress Code, Parking Fee',
    },
    {
        id: 'val',
        label: 'Setting Value',
        type: 'text',
        placeholder: 'e.g., Business Casual, 176.28',
    },
];

export function CustomSettingsInput({
    value,
    onChange,
    error,
}: CustomSettingsInputProps) {
    const getItemDisplay = (
        key: string,
        val: CustomSettingValue,
    ): ReactNode => {
        if (val === null) {
            return `${key}: (empty)`;
        }
        return `${key}: ${String(val)}`;
    };

    const getItemKey = (formValues: Record<string, string | undefined>) => {
        const key = String(formValues.key ?? '').trim();
        if (!key) return '';
        return key;
    };

    return (
        <DynamicListInput
            value={value}
            onChange={onChange}
            error={error}
            listTitle="Settings"
            addTitle="Add New Setting"
            editTitle="Edit Setting"
            fields={FIELDS}
            getItemDisplay={getItemDisplay}
            getItemKey={getItemKey}
            itemAddedMessage="Setting added."
            itemUpdatedMessage="Setting updated."
            itemDeletedMessage="Setting removed."
            itemExistsMessage="This setting key already exists."
            gridCols="md:grid-cols-3"
        />
    );
}
