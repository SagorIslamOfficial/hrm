import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface PhotoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    photoUrl: string | null;
    photoName: string;
    title?: string;
}

export function PhotoDialog({
    open,
    onOpenChange,
    photoUrl,
    photoName,
    title,
}: PhotoDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{title || `${photoName} - Photo`}</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center">
                    {photoUrl && (
                        <img
                            src={photoUrl}
                            alt={photoName}
                            className="max-h-96 max-w-full rounded-lg border object-contain"
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
