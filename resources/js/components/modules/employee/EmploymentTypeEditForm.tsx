import { FormField } from '@/components/common';

interface FormData {
    name: string;
    code: string;
    description?: string;
    is_active: string; // '1' or '0'
}

interface Props {
    data: FormData;
    setData: (key: keyof FormData, value: string) => void;
    errors?: Record<string, string> | null;
}

export default function EmploymentTypeEditForm({
    data,
    setData,
    errors,
}: Props) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                    type="text"
                    id="name"
                    label="Name"
                    value={data.name}
                    onChange={(value: string) => setData('name', value)}
                    error={errors?.name}
                    required
                    placeholder="e.g., Full-Time Employee"
                />

                <FormField
                    type="text"
                    id="code"
                    label="Code"
                    value={data.code}
                    onChange={(value: string) => setData('code', value)}
                    error={errors?.code}
                    required
                    placeholder="e.g., full_time"
                />
            </div>{' '}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                    type="select"
                    id="is_active"
                    label="Status"
                    value={data.is_active}
                    onChange={(value: string) => setData('is_active', value)}
                    error={errors?.is_active}
                    options={[
                        { value: '1', label: 'Active' },
                        { value: '0', label: 'InActive' },
                    ]}
                />

                <FormField
                    type="textarea"
                    id="description"
                    label="Description"
                    value={data.description || ''}
                    onChange={(value: string) => setData('description', value)}
                    error={errors?.description}
                    placeholder="Description of this employment type"
                    rows={3}
                />
            </div>
        </div>
    );
}
