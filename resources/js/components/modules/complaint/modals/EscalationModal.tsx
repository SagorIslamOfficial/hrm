import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFormatError } from '@/components/common/utils/formatUtils';
import escalations from '@/routes/complaints/escalations';
import { Employee } from '@/types/complaint';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { BaseComplaintModal } from './BaseComplaintModal';

interface Props {
    complaintId: string;
    employees: Employee[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EscalationModal({
    complaintId,
    employees,
    open,
    onOpenChange,
}: Props) {
    const { formatFieldName } = useFormatError();
    const { data, setData, post, processing, errors, reset } = useForm<{
        escalated_to: string[];
        reason: string;
    }>({
        escalated_to: [],
        reason: '',
    });

    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(
            escalations.store(complaintId).url,
            {
                onSuccess: () => {
                    toast.success('Complaint escalated successfully');
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
            },
        );
    };

    return (
        <BaseComplaintModal
            open={open}
            onOpenChange={onOpenChange}
            title="Escalate Complaint"
            description="Escalate this complaint to another employee for further investigation or decision making."
            onSubmit={handleSubmit}
            isSubmitting={processing}
            submitButtonText="Escalate Complaint"
        >
            <div className="space-y-2">
                <Label htmlFor="escalated_to">Escalate To</Label>
                <div className="max-h-60 overflow-y-auto rounded-md border p-2">
                    {employees.length === 0 ? (
                        <p className="p-2 text-sm text-muted-foreground">
                            No employees available for escalation.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {employees.map((employee) => {
                                const userId = employee.user_id;
                                if (!userId) return null; // Skip employees without users

                                const isChecked =
                                    data.escalated_to.includes(userId);
                                const toggleSelection = (checked: boolean) => {
                                    if (checked) {
                                        setData('escalated_to', [
                                            ...data.escalated_to,
                                            userId,
                                        ]);
                                    } else {
                                        setData(
                                            'escalated_to',
                                            data.escalated_to.filter(
                                                (id) => id !== userId,
                                            ),
                                        );
                                    }
                                };

                                return (
                                    <div
                                        key={employee.id}
                                        className="flex items-start space-x-2"
                                    >
                                        <Checkbox
                                            id={`escalate-${employee.id}`}
                                            checked={isChecked}
                                            onCheckedChange={toggleSelection}
                                        />
                                        <Label
                                            htmlFor={`escalate-${employee.id}`}
                                            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {employee.user_name ||
                                                `${employee.first_name} ${employee.last_name}`}
                                        </Label>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                {errors.escalated_to && (
                    <p className="text-sm text-red-500">
                        {errors.escalated_to}
                    </p>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="reason">Reason for Escalation</Label>
                <Textarea
                    id="reason"
                    value={data.reason}
                    onChange={(e) => setData('reason', e.target.value)}
                    placeholder="Please explain why this complaint is being escalated..."
                    required
                />
                {errors.reason && (
                    <p className="text-sm text-red-500">{errors.reason}</p>
                )}
            </div>
        </BaseComplaintModal>
    );
}
