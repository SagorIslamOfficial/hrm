import { EmptyActionState, InfoCard } from '@/components/common';
import { Badge } from '@/components/ui/badge';

interface CustomField {
    id: string;
    field_key: string;
    field_value: string;
    field_type: string;
    section: string;
}

interface CustomFieldsViewProps {
    customFields?: CustomField[];
}

export function CustomFieldsView({ customFields }: CustomFieldsViewProps) {
    const formatFieldKey = (key: string) => {
        return key
            .split(/[-_]/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const formatFieldType = (type: string) => {
        return type.charAt(0).toUpperCase() + type.slice(1);
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
        {} as Record<string, CustomField[]>,
    );

    const sections = ['personal', 'professional', 'other'];

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
                                            className="rounded-lg border p-4"
                                        >
                                            <div className="flex items-center gap-2">
                                                <h5 className="font-medium">
                                                    {formatFieldKey(
                                                        field.field_key,
                                                    )}
                                                </h5>
                                                <Badge variant="outline">
                                                    {formatFieldType(
                                                        field.field_type,
                                                    )}
                                                </Badge>
                                            </div>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {field.field_value ||
                                                    'No value set'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <EmptyActionState
                    message="Add custom fields to track employee information."
                    buttonText="Add Custom Field"
                />
            )}
        </InfoCard>
    );
}
