import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface FormActionsProps {
    // Actions
    onCancel?: () => void;
    onReset?: () => void;
    onSubmit?: () => void;

    // Labels
    submitLabel?: ReactNode;
    cancelLabel?: ReactNode;
    resetLabel?: ReactNode;

    // State
    processing?: boolean;
    submitting?: boolean;
    disabled?: boolean;

    // Visibility
    showCancel?: boolean;
    showReset?: boolean;

    // Styling
    className?: string;
    variant?: 'default' | 'destructive';

    // Type (form / dialog)
    type?: 'form' | 'dialog';
}

export function FormActions({
    onCancel,
    onReset,
    onSubmit,
    submitLabel = 'Save',
    cancelLabel = 'Cancel',
    resetLabel = 'Reset',
    processing = false,
    submitting = false,
    disabled = false,
    showCancel = true,
    showReset = true,
    className,
    variant = 'default',
    type = 'form',
}: FormActionsProps) {
    // Use submitting if provided, otherwise fall back to processing
    const isProcessing = submitting || processing;

    // Auto-detect type based on onCancel presence if not explicitly set
    const isDialog =
        type === 'dialog' || (type === 'form' && onCancel && !onReset);

    // Default className based on type
    const defaultClassName = isDialog
        ? 'flex justify-end gap-2 border-t pt-4'
        : 'mt-6 flex justify-end gap-4';

    const finalClassName = className || defaultClassName;

    return (
        <div className={finalClassName}>
            {/* Cancel button */}
            {showCancel && onCancel && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="cursor-pointer"
                    disabled={isProcessing || disabled}
                >
                    {cancelLabel}
                </Button>
            )}

            {/* Reset button */}
            {showReset && onReset && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={onReset}
                    className="cursor-pointer"
                    disabled={isProcessing || disabled}
                >
                    {resetLabel}
                </Button>
            )}

            {/* Submit button */}
            <Button
                type={onSubmit ? 'button' : 'submit'}
                onClick={onSubmit}
                className="cursor-pointer"
                disabled={isProcessing || disabled}
                variant={variant}
            >
                {isProcessing ? 'Saving...' : submitLabel}
            </Button>
        </div>
    );
}
