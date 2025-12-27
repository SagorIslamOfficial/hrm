import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useFormatError } from '@/components/common/utils/formatUtils';
import reminders from '@/routes/complaints/reminders';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { BaseComplaintModal } from './BaseComplaintModal';

interface Props {
    complaintId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reminderTypes?: { value: string; label: string }[];
}

export function ReminderModal({ complaintId, open, onOpenChange, reminderTypes = [] }: Props) {
    const { formatFieldName } = useFormatError();
    const { data, setData, post, processing, errors, reset, transform } =
        useForm({
            reminder_type: 'follow_up',
            remind_at: '',
            message: '',
        });

    useEffect(() => {
        transform((data) => ({
            ...data,
            remind_at: data.remind_at
                ? new Date(data.remind_at).toISOString()
                : '',
        }));
    }, [transform]);

    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(reminders.store(complaintId).url, {
            onSuccess: () => {
                toast.success('Reminder set successfully');
                onOpenChange(false);
            },
            onError: (errors: unknown) => {
                if (typeof errors === 'object' && errors !== null) {
                    Object.entries(errors).forEach(([field, messages]) => {
                        const fieldName = formatFieldName(field);
                        if (Array.isArray(messages)) {
                            messages.forEach((message) => {
                                toast.error(`${fieldName}: ${message}`);
                            });
                        } else if (typeof messages === 'string') {
                            toast.error(`${fieldName}: ${messages}`);
                        }
                    });
                }
            },
        });
    };

    return (
        <BaseComplaintModal
            open={open}
            onOpenChange={onOpenChange}
            title="Set Reminder"
            description="Schedule a reminder for this complaint. You will be notified when it is due."
            onSubmit={handleSubmit}
            isSubmitting={processing}
            submitButtonText="Set Reminder"
        >
            <div className="space-y-2">
                <Label htmlFor="reminder_type">Type</Label>
                <Select
                    value={data.reminder_type}
                    onValueChange={(value) => setData('reminder_type', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        {reminderTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                                {type.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.reminder_type && (
                    <p className="text-sm text-red-500">
                        {errors.reminder_type}
                    </p>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="remind_at">Remind At</Label>
                <Input
                    id="remind_at"
                    type="datetime-local"
                    value={data.remind_at}
                    onChange={(e) => setData('remind_at', e.target.value)}
                    required
                />
                {errors.remind_at && (
                    <p className="text-sm text-red-500">{errors.remind_at}</p>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                    id="message"
                    value={data.message}
                    onChange={(e) => setData('message', e.target.value)}
                    placeholder="Reminder details..."
                />
                {errors.message && (
                    <p className="text-sm text-red-500">{errors.message}</p>
                )}
            </div>
        </BaseComplaintModal>
    );
}
