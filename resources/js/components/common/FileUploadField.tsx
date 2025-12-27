import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';
import { useRef } from 'react';

interface FileUploadFieldProps {
    id: string;
    label: string;
    value: File | null;
    onChange: (file: File | null) => void;
    error?: string;
    accept?: string;
    maxSize?: number; // in bytes
    required?: boolean;
    helperText?: string;
    currentFile?: {
        name: string;
        size?: number;
    };
}

export function FileUploadField({
    id,
    label,
    value,
    onChange,
    error,
    accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png',
    maxSize = 10 * 1024 * 1024, // 10MB default
    required = false,
    helperText = 'Upload a file',
    currentFile,
}: FileUploadFieldProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size
        if (file.size > maxSize) {
            if (fileInputRef.current) fileInputRef.current.value = '';
            // Note: Parent component should handle toast notifications
            onChange(null);
            return;
        }

        // Validate file type if accept prop is provided
        if (accept) {
            const acceptedExtensions = accept
                .split(',')
                .map((ext) => ext.trim());
            const fileExtension =
                '.' + file.name.split('.').pop()?.toLowerCase();
            const acceptedMimeTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'image/jpeg',
                'image/jpg',
                'image/png',
            ];

            if (
                !acceptedExtensions.includes(fileExtension) &&
                !acceptedMimeTypes.includes(file.type)
            ) {
                if (fileInputRef.current) fileInputRef.current.value = '';
                onChange(null);
                return;
            }
        }

        onChange(file);
    };

    const handleFileRemove = () => {
        onChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <div>
            <Label htmlFor={id}>
                {label} {required && '*'}
            </Label>
            <div className="space-y-4">
                {/* Show selected file */}
                {value && (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 rounded-md border p-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{value.name}</span>
                            <span className="text-xs text-muted-foreground">
                                ({formatFileSize(value.size)})
                            </span>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleFileRemove}
                        >
                            Remove File
                        </Button>
                    </div>
                )}

                {/* Show current file (for edit mode) */}
                {!value && currentFile && (
                    <div className="flex items-center gap-2 rounded-md border p-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                            Current: {currentFile.name}
                        </span>
                        {currentFile.size !== undefined && (
                            <span className="text-xs text-muted-foreground">
                                ({formatFileSize(currentFile.size)})
                            </span>
                        )}
                    </div>
                )}

                {/* File input */}
                <Input
                    ref={fileInputRef}
                    id={id}
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    className={error ? 'border-destructive' : ''}
                />

                {/* Helper text */}
                {helperText && (
                    <p className="text-xs text-muted-foreground">
                        {helperText}
                    </p>
                )}

                {/* Error message */}
                {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
        </div>
    );
}
