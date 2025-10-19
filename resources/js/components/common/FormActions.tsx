import { Button } from '@/components/ui/button';

interface FormActionsProps {
    onReset?: () => void;
    onSubmit?: () => void;
    submitLabel?: string;
    resetLabel?: string;
    processing?: boolean;
    showReset?: boolean;
    disabled?: boolean;
    className?: string;
}

export function FormActions({
    onReset,
    onSubmit,
    submitLabel = 'Save',
    resetLabel = 'Reset',
    processing = false,
    showReset = true,
    disabled = false,
    className = 'mt-6 flex justify-end gap-4',
}: FormActionsProps) {
    return (
        <div className={className}>
            {showReset && onReset && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={onReset}
                    disabled={processing || disabled}
                >
                    {resetLabel}
                </Button>
            )}
            <Button
                type={onSubmit ? 'button' : 'submit'}
                onClick={onSubmit}
                disabled={processing || disabled}
            >
                {processing ? 'Saving...' : submitLabel}
            </Button>
        </div>
    );
}
