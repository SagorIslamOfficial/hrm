import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface EmptyActionStateProps {
    message: string;
    buttonText: string;
    buttonIcon?: ReactNode;
    onButtonClick?: () => void;
}

export function EmptyActionState({
    message,
    buttonText,
    buttonIcon,
    onButtonClick,
}: EmptyActionStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="mb-4 text-sm text-muted-foreground">{message}</p>
            <Button
                type="button"
                variant="secondary"
                className="border"
                disabled={!onButtonClick}
                onClick={onButtonClick}
            >
                {buttonIcon}
                {buttonText}
            </Button>
        </div>
    );
}
