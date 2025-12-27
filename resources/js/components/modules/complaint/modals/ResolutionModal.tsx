import { useFormatError } from '@/components/common/utils/formatUtils';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import resolution from '@/routes/complaints/resolution';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { BaseComplaintModal } from './BaseComplaintModal';

interface Props {
    complaintId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ResolutionModal({ complaintId, open, onOpenChange }: Props) {
    const { formatFieldName } = useFormatError();
    const { data, setData, post, processing, errors, reset } = useForm({
        resolution_summary: '',
        actions_taken: '',
        preventive_measures: '',
    });

    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(resolution.store(complaintId).url, {
            onSuccess: () => {
                toast.success('Complaint resolved successfully');
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
            title="Resolve Complaint"
            description="Provide details about how this complaint was resolved. This information will be recorded permanently."
            onSubmit={handleSubmit}
            isSubmitting={processing}
            submitButtonText="Resolve Complaint"
            maxWidth="sm:max-w-[525px]"
        >
            <div className="space-y-2">
                <Label htmlFor="resolution_summary">Resolution Summary</Label>
                <Textarea
                    id="resolution_summary"
                    value={data.resolution_summary}
                    onChange={(e) =>
                        setData('resolution_summary', e.target.value)
                    }
                    placeholder="Briefly summarize the resolution..."
                    required
                />
                {errors.resolution_summary && (
                    <p className="text-sm text-red-500">
                        {errors.resolution_summary}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="actions_taken">Actions Taken</Label>
                <Textarea
                    id="actions_taken"
                    value={data.actions_taken}
                    onChange={(e) => setData('actions_taken', e.target.value)}
                    placeholder="What actions were taken to resolve this?"
                    required
                />
                {errors.actions_taken && (
                    <p className="text-sm text-red-500">
                        {errors.actions_taken}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="preventive_measures">
                    Preventive Measures (Optional)
                </Label>
                <Textarea
                    id="preventive_measures"
                    value={data.preventive_measures}
                    onChange={(e) =>
                        setData('preventive_measures', e.target.value)
                    }
                    placeholder="What measures are put in place to prevent recurrence?"
                />
                {errors.preventive_measures && (
                    <p className="text-sm text-red-500">
                        {errors.preventive_measures}
                    </p>
                )}
            </div>
        </BaseComplaintModal>
    );
}
