import { FormField, InfoCard } from '@/components/common';

interface BasicEditProps {
    data: {
        name: string;
        email: string;
    };
    errors: Record<string, string>;
    onDataChange: (field: string, value: string) => void;
}

export function BasicEdit({ data, errors, onDataChange }: BasicEditProps) {
    return (
        <InfoCard title="Basic Information">
            <div className="grid gap-4">
                <FormField
                    id="name"
                    label="Full Name"
                    type="text"
                    value={data.name}
                    onChange={(value) => onDataChange('name', value)}
                    error={errors.name}
                    required
                    placeholder="Enter full name"
                />

                <FormField
                    id="email"
                    label="Email Address"
                    type="email"
                    value={data.email}
                    onChange={(value) => onDataChange('email', value)}
                    error={errors.email}
                    required
                    placeholder="Enter email address"
                />
            </div>
        </InfoCard>
    );
}
