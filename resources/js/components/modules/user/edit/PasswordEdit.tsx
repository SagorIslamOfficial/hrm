import { FormField, InfoCard } from '@/components/common';

interface PasswordEditProps {
    data: {
        password: string;
        password_confirmation: string;
    };
    errors: Record<string, string>;
    onDataChange: (field: string, value: string) => void;
}

export function PasswordEdit({
    data,
    errors,
    onDataChange,
}: PasswordEditProps) {
    return (
        <InfoCard title="Change Password (Optional)">
            <div className="grid gap-4">
                <p className="text-sm text-muted-foreground">
                    Leave blank to keep the current password
                </p>
                <FormField
                    id="password"
                    label="New Password"
                    type="password"
                    value={data.password}
                    onChange={(value) => onDataChange('password', value)}
                    error={errors.password}
                    placeholder="Enter new password"
                />

                <FormField
                    id="password_confirmation"
                    label="Confirm New Password"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(value) =>
                        onDataChange('password_confirmation', value)
                    }
                    error={errors.password_confirmation}
                    placeholder="Confirm new password"
                />
            </div>
        </InfoCard>
    );
}
