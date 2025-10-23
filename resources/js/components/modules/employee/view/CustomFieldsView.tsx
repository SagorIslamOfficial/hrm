import { InfoCard } from '@/components/common';
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
    return (
        <InfoCard title="Custom Fields">
            {customFields && customFields.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                    {customFields.map((field) => (
                        <div key={field.id}>
                            <label className="text-sm font-medium text-muted-foreground">
                                {field.field_key.replace(/-/g, ' ')}{' '}
                                <Badge variant="outline" className="ml-1">
                                    {field.field_type}
                                </Badge>
                            </label>
                            <p className="text-sm font-medium">
                                {field.field_value}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">
                    No custom fields available
                </p>
            )}
        </InfoCard>
    );
}
