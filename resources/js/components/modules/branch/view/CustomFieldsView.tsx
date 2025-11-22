import { InfoCard } from '@/components/common';
import type { BranchCustomField } from '@/types/branch';

interface CustomFieldsViewProps {
    customFields: BranchCustomField[];
}

export function CustomFieldsView({ customFields }: CustomFieldsViewProps) {
    const formatFieldKey = (fieldKey: string) => {
        return fieldKey
            .split(/[-_]/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const formatSection = (section: string) => {
        return section.charAt(0).toUpperCase() + section.slice(1);
    };

    const groupedFields = (customFields || []).reduce(
        (acc, field) => {
            const section = field.section || 'other';
            if (!acc[section]) {
                acc[section] = [];
            }
            acc[section].push(field);
            return acc;
        },
        {} as Record<string, BranchCustomField[]>,
    );

    const sections = ['general', 'operational', 'technical', 'other'];

    return (
        <InfoCard title="Custom Fields">
            {customFields && customFields.length > 0 ? (
                <div className="space-y-6">
                    {sections.map((section) => {
                        const fields = groupedFields[section] || [];
                        if (fields.length === 0) return null;

                        return (
                            <div key={section}>
                                <h4 className="mb-3 text-sm font-semibold text-muted-foreground">
                                    {formatSection(section)}
                                </h4>
                                <div className="space-y-3">
                                    {fields.map((field) => (
                                        <div
                                            key={field.id}
                                            className="rounded-lg border border-sidebar-border/70 p-4"
                                        >
                                            <div className="space-y-1">
                                                <h5 className="font-semibold">
                                                    {formatFieldKey(
                                                        field.field_key,
                                                    )}
                                                </h5>
                                                <p className="text-sm text-muted-foreground">
                                                    {field.field_value ||
                                                        'No value set'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">
                    No custom fields available.
                </p>
            )}
        </InfoCard>
    );
}
