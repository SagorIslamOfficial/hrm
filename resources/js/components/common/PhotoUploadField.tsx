import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';

interface PhotoUploadFieldProps {
    label?: string;
    value?: File | null;
    onChange: (file: File | null) => void;
    onDelete?: () => void;
    error?: string;
    helpText?: string;
    accept?: string;
    maxSizeText?: string;
    previewUrl?: string | null;
    className?: string;
    required?: boolean;
}

export function PhotoUploadField({
    label = 'Photo',
    value,
    onChange,
    onDelete,
    error,
    helpText = 'Upload a photo (max 2MB, JPEG/PNG/WebP)',
    accept = 'image/*',
    maxSizeText,
    previewUrl,
    className,
    required = false,
}: PhotoUploadFieldProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

    const currentPreviewUrl = previewUrl || localPreviewUrl;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        onChange(file);

        if (file) {
            const url = URL.createObjectURL(file);
            setLocalPreviewUrl(url);
        } else {
            setLocalPreviewUrl(null);
        }
    };

    const handleDelete = () => {
        onChange(null);
        setLocalPreviewUrl(null);
        onDelete?.();
    };

    return (
        <div className={className}>
            <Label htmlFor="photo">
                {label} {required && '*'}
            </Label>
            <div className="flex items-start">
                {currentPreviewUrl && (
                    <div className="relative mr-4">
                        <img
                            src={currentPreviewUrl}
                            alt="Photo preview"
                            className="size-24 rounded-lg"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -right-2 -bottom-2 size-6 cursor-pointer p-0 hover:scale-110"
                            onClick={handleDelete}
                        >
                            <Trash2 className="size-3" />
                        </Button>
                    </div>
                )}
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-4">
                        <Input
                            ref={fileInputRef}
                            id="photo"
                            type="file"
                            accept={accept}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2"
                        >
                            <Upload className="size-4" />
                            {value ? 'Change Photo' : 'Upload Photo'}
                        </Button>
                        {value && (
                            <span className="text-sm text-muted-foreground">
                                {value.name}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {helpText}
                        {maxSizeText && ` (${maxSizeText})`}
                    </p>
                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
