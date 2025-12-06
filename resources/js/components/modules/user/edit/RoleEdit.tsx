import { FormField, InfoCard } from '@/components/common';
import { type Role } from '@/components/modules/user';

interface RoleEditProps {
    data: {
        role: string;
    };
    errors: Record<string, string>;
    roles: Role[];
    onDataChange: (field: string, value: string) => void;
}

export function RoleEdit({ data, errors, roles, onDataChange }: RoleEditProps) {
    return (
        <InfoCard title="Role">
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                    Select a role for this user
                </p>
                <FormField
                    id="role"
                    type="select"
                    value={data.role}
                    onChange={(value) => onDataChange('role', value)}
                    error={errors.role}
                    options={roles.map((role) => ({
                        value: role.name,
                        label: role.name,
                    }))}
                    helperText="By default 'Employee' role is selected."
                />
            </div>
        </InfoCard>
    );
}
