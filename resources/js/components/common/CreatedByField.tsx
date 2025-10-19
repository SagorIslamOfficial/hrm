import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreatedByFieldProps {
    label?: string;
    userName?: string;
    className?: string;
    required?: boolean;
}

export function CreatedByField({
    label = 'Created By',
    userName,
    className,
    required = true,
}: CreatedByFieldProps) {
    return (
        <div className={className}>
            <Label htmlFor="created_by">
                {label} {required && '*'}
            </Label>
            <Input
                id="created_by"
                value={userName || 'Current User'}
                disabled
                className="bg-muted"
            />
        </div>
    );
}
