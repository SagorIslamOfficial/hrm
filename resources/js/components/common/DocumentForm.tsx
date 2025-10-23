import {
    DateField,
    FileUploadField,
    FormActions,
    formatDateForInput,
    SelectField,
    TextField,
} from '@/components/common';
import { useState } from 'react';
import { toast } from 'sonner';

interface Document {
    id: string;
    doc_type: string;
    title: string;
    file_name: string;
    file_path: string;
    file_url: string;
    file_size: number;
    expiry_date: string | null;
    is_expired: boolean;
    is_expiring_soon: boolean;
    uploader?: {
        id: string;
        name: string;
    };
    created_at: string;
    // Staging properties for pending changes
    _documentFile?: File;
    _isNew?: boolean;
    _isModified?: boolean;
    _isDeleted?: boolean;
}

// Document Types from backend config
const DOCUMENT_TYPES = [
    { value: 'contract', label: 'Employment Contract' },
    { value: 'offer_letter', label: 'Offer Letter' },
    { value: 'resume', label: 'Resume/CV' },
    { value: 'certificate', label: 'Educational Certificate' },
    { value: 'id_proof', label: 'ID Proof (NID/Passport)' },
    { value: 'medical', label: 'Medical Certificate' },
    { value: 'police_clearance', label: 'Police Clearance' },
    { value: 'reference', label: 'Reference Letter' },
    { value: 'resignation', label: 'Resignation Letter' },
    { value: 'termination', label: 'Termination Letter' },
    { value: 'appraisal', label: 'Performance Appraisal' },
    { value: 'training', label: 'Training Certificate' },
    { value: 'other', label: 'Other Documents' },
];

interface DocumentFormProps {
    document?: Document;
    onSuccess: (documentData: Document) => void;
    onCancel: () => void;
    subjectLabel?: string;
}

export function DocumentForm({
    document,
    onSuccess,
    onCancel,
    subjectLabel = '',
}: DocumentFormProps) {
    const [formData, setFormData] = useState({
        doc_type: document?.doc_type || '',
        title: document?.title || '',
        expiry_date: formatDateForInput(document?.expiry_date || ''),
    });
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async () => {
        setSubmitting(true);
        setErrors({});

        try {
            // Basic validation
            const validationErrors: Record<string, string> = {};
            if (!formData.doc_type.trim()) {
                validationErrors.doc_type = 'Document type is required';
            }
            if (!formData.title.trim()) {
                validationErrors.title = 'Title is required';
            }
            // File is required for new documents
            if (!document && !documentFile) {
                validationErrors.file = 'Document file is required';
            }

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }

            // Create staged document data (no API call yet)
            const stagedDocument: Document = {
                id: document?.id || `temp_${Date.now()}`, // Temporary ID for new documents
                doc_type: formData.doc_type,
                title: formData.title,
                file_name: documentFile
                    ? documentFile.name
                    : document?.file_name || '',
                file_path: document?.file_path || '',
                file_url: document?.file_url || '',
                file_size: documentFile
                    ? documentFile.size
                    : document?.file_size || 0,
                expiry_date: formData.expiry_date || null,
                is_expired: false,
                is_expiring_soon: false,
                uploader: document?.uploader,
                created_at: document?.created_at || new Date().toISOString(),
                // Store the document file for later upload
                _documentFile: documentFile || undefined,
                _isNew: !document,
                _isModified: !!document,
            };

            toast.success(
                document
                    ? `Document changes staged - save ${subjectLabel.toLowerCase()} to apply`
                    : `Document staged - save ${subjectLabel.toLowerCase()} to apply`,
            );

            onSuccess(stagedDocument);
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <SelectField
                    id="doc_type"
                    label="Document Type"
                    value={formData.doc_type}
                    onChange={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            doc_type: value,
                        }))
                    }
                    options={DOCUMENT_TYPES}
                    error={errors.doc_type}
                    placeholder="Select document type"
                    required
                />
                <TextField
                    id="title"
                    label="Title"
                    value={formData.title}
                    onChange={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            title: value,
                        }))
                    }
                    error={errors.title}
                    placeholder="e.g., Passport Copy"
                    required
                />
            </div>

            <DateField
                id="expiry_date"
                label="Expiry Date (Optional)"
                value={formData.expiry_date}
                onChange={(value) =>
                    setFormData((prev) => ({
                        ...prev,
                        expiry_date: value,
                    }))
                }
                error={errors.expiry_date}
            />

            <FileUploadField
                id="file"
                label="Document File"
                value={documentFile}
                onChange={(file) => {
                    if (file === null) {
                        setDocumentFile(null);
                    } else {
                        // Validate file size
                        if (file.size > 10 * 1024 * 1024) {
                            toast.error(
                                'Document must not exceed 10MB in size.',
                            );
                            return;
                        }
                        // Validate file type
                        const allowedTypes = [
                            'application/pdf',
                            'application/msword',
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            'image/jpeg',
                            'image/jpg',
                            'image/png',
                        ];
                        if (!allowedTypes.includes(file.type)) {
                            toast.error(
                                'Invalid file type. Allowed: PDF, DOC, DOCX, JPG, JPEG, PNG',
                            );
                            return;
                        }
                        setDocumentFile(file);
                    }
                }}
                error={errors.file}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                maxSize={10 * 1024 * 1024}
                required={!document}
                helperText="Upload a document (max 10MB, PDF, DOC, DOCX, JPG, JPEG, PNG)"
                currentFile={
                    document
                        ? {
                              name: document.file_name,
                              size: document.file_size,
                          }
                        : undefined
                }
            />

            <FormActions
                type="dialog"
                onCancel={onCancel}
                onSubmit={handleSubmit}
                submitLabel={document ? 'Update' : 'Add'}
                submitting={submitting}
            />
        </div>
    );
}
