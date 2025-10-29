import {
    Dialog,
    DialogContent,
    DialogDescription,
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
            <DialogContent className="max-w-2xl rounded-md border-primary/40 bg-gray-700 text-white [&>button]:cursor-pointer">
                <DialogHeader>
                    <DialogTitle>{title || `${photoName} - Photo`}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="flex justify-center">
                    {photoUrl && (
                        <img
                            src={photoUrl}
                            alt={photoName}
                            className="max-h-full max-w-full rounded-sm border-none object-contain"
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
