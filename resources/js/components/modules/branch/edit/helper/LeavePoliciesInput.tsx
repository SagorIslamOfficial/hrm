import { DynamicListField, DynamicListInput } from '@/components/common';

interface LeavePolicies {
    [key: string]: number | undefined;
}

interface LeavePoliciesInputProps {
    value: LeavePolicies | null;
    onChange: (policies: LeavePolicies) => void;
    error?: string;
}

const DEFAULT_LEAVE_TYPES = [
    { key: 'annual', label: 'Annual Leave' },
    { key: 'sick', label: 'Sick Leave' },
    { key: 'casual', label: 'Casual Leave' },
    { key: 'maternity', label: 'Maternity Leave' },
    { key: 'paternity', label: 'Paternity Leave' },
    { key: 'bereavement', label: 'Bereavement Leave' },
];

const FIELDS: DynamicListField[] = [
    {
        id: 'label',
        label: 'Leave Type Name',
        type: 'text',
        placeholder: 'e.g., Earned Leave, Optional Holiday',
    },
    {
        id: 'days',
        label: 'Number of Days',
        type: 'number',
        placeholder: 'e.g., 15',
        min: 0,
        max: 365,
    },
];

export function LeavePoliciesInput({
    value,
    onChange,
    error,
}: LeavePoliciesInputProps) {
    const getLabel = (key: string): string => {
        const defaultType = DEFAULT_LEAVE_TYPES.find((t) => t.key === key);
        return defaultType ? defaultType.label : key.replace(/_/g, ' ');
    };

    const getItemDisplay = (key: string, days: number | undefined): string => {
        const daysValue = days ?? 0;
        return `${getLabel(key)}: ${daysValue} days`;
    };

    const getItemKey = (
        formValues: Record<string, string | number | undefined>,
    ) => {
        const label = String(formValues.label ?? '').trim();
        return label
            .toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_]/g, '');
    };

    return (
        <DynamicListInput
            value={value}
            onChange={onChange}
            error={error}
            listTitle="Leave Types & Days"
            addTitle="Add New Leave Type"
            editTitle="Edit Leave Type"
            fields={FIELDS}
            getItemDisplay={getItemDisplay}
            getItemKey={getItemKey}
            itemAddedMessage="Leave type added."
            itemUpdatedMessage="Leave type updated."
            itemDeletedMessage="Leave type removed."
            itemExistsMessage="This leave type already exists."
            itemEmptyMessage="Fields cannot be empty."
            gridCols="md:grid-cols-3"
        />
    );
}
