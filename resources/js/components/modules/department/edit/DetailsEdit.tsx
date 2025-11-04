import { FormField } from '@/components/common';

interface DepartmentDetail {
    founded_date?: string;
    division?: string;
    cost_center?: string;
    internal_code?: string;
    office_phone?: string;
}

interface Props {
    data: DepartmentDetail;
    errors: Record<string, string>;
    setData: (key: string, value: string | null) => void;
}

export function DetailsEdit({ data, errors, setData }: Props) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                    id="founded_date"
                    type="date"
                    label="Founded Date"
                    value={data.founded_date || ''}
                    onChange={(value) => setData('founded_date', value)}
                    error={errors.founded_date}
                />

                <FormField
                    id="division"
                    type="text"
                    label="Division"
                    value={data.division || ''}
                    onChange={(value) => setData('division', value)}
                    error={errors.division}
                    placeholder="e.g., Corporate, Regional"
                />

                <FormField
                    id="cost_center"
                    type="text"
                    label="Cost Center"
                    value={data.cost_center || ''}
                    onChange={(value) => setData('cost_center', value)}
                    error={errors.cost_center}
                    placeholder="e.g., CC-00001"
                />

                <FormField
                    id="internal_code"
                    type="text"
                    label="Internal Code"
                    value={data.internal_code || ''}
                    onChange={(value) => setData('internal_code', value)}
                    error={errors.internal_code}
                    placeholder="e.g., HR-0001"
                />

                <FormField
                    id="office_phone"
                    type="tel"
                    label="Office Phone"
                    value={data.office_phone || ''}
                    onChange={(value) => setData('office_phone', value)}
                    error={errors.office_phone}
                    placeholder="e.g., +1-234-567-8900"
                />
            </div>
        </div>
    );
}
