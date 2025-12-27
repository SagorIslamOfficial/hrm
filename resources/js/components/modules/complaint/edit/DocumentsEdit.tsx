import {
    DataTableActions,
    DocumentPreviewDialog,
    EmptyActionState,
    FileUploadField,
    FormActions,
    FormField,
    InfoCard,
    ResourceDialog,
} from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ComplaintDocument } from '@/types/complaint';
import { usePage } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { FileText } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface DocumentsEditProps {
    documents: ComplaintDocument[];
    onDocumentsChange: (documents: ComplaintDocument[]) => void;
}

interface PageProps extends Record<string, unknown> {
    auth: {
        user: {
            id: string;
            name: string;
            email: string;
        };
    };
}

const DOCUMENT_TYPES = [
    { value: 'evidence', label: 'Evidence' },
    { value: 'resolution', label: 'Resolution' },
    { value: 'supporting', label: 'Supporting' },
    { value: 'other', label: 'Other' },
];

export default function DocumentsEdit({
    documents,
    onDocumentsChange,
}: DocumentsEditProps) {
    const { auth } = usePage<PageProps>().props;
    const currentUserId = auth.user.id;

    const [dialogMode, setDialogMode] = useState<
        'add' | 'edit' | 'view' | null
    >(null);
    const [selectedDoc, setSelectedDoc] = useState<ComplaintDocument | null>(
        null,
    );
    const [previewDoc, setPreviewDoc] = useState<ComplaintDocument | null>(
        null,
    );
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        doc_type: 'evidence' as ComplaintDocument['doc_type'],
    });
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const openAddDialog = () => {
        resetForm();
        setDialogMode('add');
    };

    const openEditDialog = (doc: ComplaintDocument) => {
        setSelectedDoc(doc);
        setFormData({
            title: doc.title,
            description: doc.description || '',
            doc_type: doc.doc_type,
        });
        setDocumentFile(null);
        setDialogMode('edit');
    };

    const closeDialog = () => {
        setDialogMode(null);
        setSelectedDoc(null);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            doc_type: 'evidence',
        });
        setDocumentFile(null);
        setErrors({});
    };

    const handleSubmit = () => {
        setErrors({});

        // Validation
        const validationErrors: Record<string, string> = {};
        if (!formData.title.trim()) {
            validationErrors.title = 'Title is required';
        }
        if (dialogMode === 'add' && !documentFile) {
            validationErrors.file = 'Document file is required';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (dialogMode === 'add') {
            const newDoc: ComplaintDocument = {
                id: `temp-${Date.now()}`,
                complaint_id: '',
                title: formData.title.trim(),
                description: formData.description.trim(),
                doc_type: formData.doc_type,
                file_path: '',
                uploaded_by: currentUserId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                file: documentFile!,
                _isNew: true,
            };
            onDocumentsChange([newDoc, ...documents]);
            toast.success('Document staged for upload');
        } else if (dialogMode === 'edit' && selectedDoc) {
            const updatedDocuments = documents.map((doc) =>
                doc.id === selectedDoc.id
                    ? {
                          ...doc,
                          title: formData.title.trim(),
                          description: formData.description.trim(),
                          doc_type: formData.doc_type,
                          ...(documentFile ? { file: documentFile } : {}),
                          updated_at: new Date().toISOString(),
                          _isModified: !doc._isNew,
                      }
                    : doc,
            );
            onDocumentsChange(updatedDocuments);
            toast.success('Document updated');
        }

        closeDialog();
    };

    const handleDelete = (document: ComplaintDocument) => {
        if (document._isNew) {
            onDocumentsChange(documents.filter((d) => d.id !== document.id));
            toast.info('Staged document removed');
        } else {
            const updated = documents.map((d) =>
                d.id === document.id ? { ...d, _isDeleted: true } : d,
            );
            onDocumentsChange(updated);
            toast.info('Document marked for deletion');
        }
    };

    // Filter documents
    const visibleDocuments = documents.filter((d) => !d._isDeleted);
    const stagedDocuments = visibleDocuments.filter((d) => d._isNew);
    const savedDocuments = visibleDocuments.filter((d) => !d._isNew);

    return (
        <>
            <InfoCard
                title="Documents"
                action={
                    <Button
                        type="button"
                        variant="secondary"
                        className="cursor-pointer border-2 border-blue-700"
                        onClick={openAddDialog}
                    >
                        Upload Document
                    </Button>
                }
            >
                {/* Staged Documents */}
                {stagedDocuments.length > 0 && (
                    <div className="mb-6 space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">
                            Pending Uploads ({stagedDocuments.length})
                        </h4>
                        <div className="space-y-2">
                            {stagedDocuments.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-900/20"
                                >
                                    <div className="flex flex-1 items-center gap-3">
                                        <FileText className="h-8 w-8 flex-shrink-0 text-green-500" />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="truncate font-medium">
                                                    {doc.title}
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className="h-5 flex-shrink-0 border-green-500/30 bg-green-500/10 text-[10px] text-green-600"
                                                >
                                                    New
                                                </Badge>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {doc.description ||
                                                    'No description'}
                                            </div>
                                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                <Badge
                                                    variant="secondary"
                                                    className="h-5 text-[10px]"
                                                >
                                                    {doc.doc_type}
                                                </Badge>
                                                <span>•</span>
                                                <span className="truncate">
                                                    {doc.file?.name}
                                                </span>
                                                {doc.file && (
                                                    <>
                                                        <span>•</span>
                                                        <span>
                                                            {(
                                                                doc.file.size /
                                                                1024
                                                            ).toFixed(1)}{' '}
                                                            KB
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <DataTableActions
                                        item={doc}
                                        onEdit={() => openEditDialog(doc)}
                                        onDelete={() => handleDelete(doc)}
                                        showView={false}
                                        editLabel="Edit document"
                                        deleteLabel="Remove document"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Saved Documents */}
                {savedDocuments.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">
                            Attached Documents ({savedDocuments.length})
                        </h4>
                        <div className="space-y-2">
                            {savedDocuments.map((doc) => {
                                const isModified = doc._isModified;

                                return (
                                    <div
                                        key={doc.id}
                                        className={`flex items-center justify-between rounded-lg border p-4 ${
                                            isModified
                                                ? 'border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20'
                                                : ''
                                        }`}
                                    >
                                        <div className="flex flex-1 items-center gap-3">
                                            <FileText className="h-8 w-8 flex-shrink-0 text-blue-500" />
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-2 flex items-center gap-2">
                                                    <span className="truncate font-medium">
                                                        {doc.title}
                                                    </span>
                                                    {isModified && (
                                                        <Badge
                                                            variant="outline"
                                                            className="h-5 flex-shrink-0 border-amber-500/30 bg-amber-500/10 text-[10px] text-amber-600"
                                                        >
                                                            Modified
                                                        </Badge>
                                                    )}
                                                </div>
                                                {doc.description && (
                                                    <div className="text-sm text-muted-foreground">
                                                        {doc.description}
                                                    </div>
                                                )}
                                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                    <Badge
                                                        variant="secondary"
                                                        className="h-5 text-[10px]"
                                                    >
                                                        {doc.doc_type}
                                                    </Badge>
                                                    {doc.uploader && (
                                                        <>
                                                            <span>•</span>
                                                            <span>
                                                                {
                                                                    doc.uploader
                                                                        .name
                                                                }
                                                            </span>
                                                        </>
                                                    )}
                                                    <span>•</span>
                                                    <span>
                                                        Created{' '}
                                                        {formatDistanceToNow(
                                                            new Date(
                                                                doc.created_at,
                                                            ),
                                                            { addSuffix: true },
                                                        )}
                                                    </span>
                                                    {doc.updated_at &&
                                                        doc.updated_at !==
                                                            doc.created_at && (
                                                            <>
                                                                <span>•</span>
                                                                <span>
                                                                    Updated{' '}
                                                                    {formatDistanceToNow(
                                                                        new Date(
                                                                            doc.updated_at,
                                                                        ),
                                                                        {
                                                                            addSuffix: true,
                                                                        },
                                                                    )}
                                                                </span>
                                                            </>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <DataTableActions
                                                item={doc}
                                                onEdit={() =>
                                                    openEditDialog(doc)
                                                }
                                                onDelete={() =>
                                                    handleDelete(doc)
                                                }
                                                onView={
                                                    doc.file_url
                                                        ? () =>
                                                              setPreviewDoc(doc)
                                                        : undefined
                                                }
                                                onDownload={
                                                    doc.file_url
                                                        ? () =>
                                                              window.open(
                                                                  doc.file_url,
                                                                  '_blank',
                                                              )
                                                        : undefined
                                                }
                                                editLabel="Edit document"
                                                deleteLabel="Delete document"
                                                viewLabel="Preview document"
                                                downloadLabel="Download document"
                                                showDownload={!!doc.file_url}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {visibleDocuments.length === 0 && (
                    <EmptyActionState
                        message="No documents attached"
                        buttonText="Add Document"
                        onButtonClick={openAddDialog}
                    />
                )}
            </InfoCard>

            {/* Add/Edit Dialog */}
            <ResourceDialog
                mode={dialogMode === 'add' ? 'add' : 'edit'}
                open={dialogMode === 'add' || dialogMode === 'edit'}
                resourceLabel="Document"
                subjectLabel="complaint"
            >
                <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                            type="text"
                            id="title"
                            label="Document Title"
                            value={formData.title}
                            onChange={(value: string) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    title: value,
                                }))
                            }
                            error={errors.title}
                            placeholder="Enter document title"
                            required
                        />
                        <FormField
                            type="select"
                            id="doc_type"
                            label="Document Type"
                            value={formData.doc_type}
                            onChange={(value: string) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    doc_type:
                                        value as ComplaintDocument['doc_type'],
                                }))
                            }
                            options={DOCUMENT_TYPES}
                            placeholder="Select type"
                            required
                        />
                    </div>

                    <FormField
                        type="textarea"
                        id="description"
                        label="Description (Optional)"
                        value={formData.description}
                        onChange={(value: string) =>
                            setFormData((prev) => ({
                                ...prev,
                                description: value,
                            }))
                        }
                        placeholder="Describe the document content..."
                        rows={2}
                    />

                    <FileUploadField
                        id="file"
                        label="Document File"
                        value={documentFile}
                        onChange={(file) => setDocumentFile(file)}
                        error={errors.file}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        maxSize={10 * 1024 * 1024}
                        required={dialogMode === 'add'}
                        helperText="Upload a document (max 10MB, PDF, DOC, DOCX, JPG, JPEG, PNG)"
                        currentFile={
                            selectedDoc && selectedDoc.file_path
                                ? {
                                      name: selectedDoc.file_path
                                          .split('/')
                                          .pop()!,
                                  }
                                : undefined
                        }
                    />

                    <FormActions
                        type="dialog"
                        onCancel={closeDialog}
                        onSubmit={handleSubmit}
                        submitLabel={dialogMode === 'add' ? 'Add' : 'Update'}
                    />
                </div>
            </ResourceDialog>

            <DocumentPreviewDialog
                open={previewDoc !== null}
                onOpenChange={(open) => !open && setPreviewDoc(null)}
                documentUrl={previewDoc?.file_view_url || ''}
                documentName={
                    previewDoc?.file_path?.split('/').pop() ||
                    previewDoc?.title ||
                    ''
                }
                documentType={previewDoc?.file_path?.split('.').pop() || 'pdf'}
                title={previewDoc?.title || 'Document Preview'}
                onDownload={
                    previewDoc?.file_url
                        ? () => window.open(previewDoc.file_url, '_blank')
                        : undefined
                }
            />
        </>
    );
}
