import { FormField, InfoCard } from '@/components/common';
import { STATUS_OPTIONS } from '@/constants/status';

interface StatusEditProps {
    status: string;
    onStatusChange: (status: string) => void;
    error?: string;
}

export function StatusEdit({ status, onStatusChange, error }: StatusEditProps) {
    return (
        <InfoCard title="Account Status">
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                    Select a status for this user
                </p>
                <FormField
                    type="select"
                    id="status"
                    value={status}
                    onChange={(value: string) => onStatusChange(value)}
                    options={STATUS_OPTIONS}
                    error={error}
                    helperText="Inactive and terminated users will be logged out automatically."
                />
            </div>
        </InfoCard>
    );
}
