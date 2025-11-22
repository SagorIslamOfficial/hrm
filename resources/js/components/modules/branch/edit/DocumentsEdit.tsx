import {
    DataTableActions,
    DeleteDialog,
    EmptyActionState,
    formatDateForDisplay,
    InfoCard,
    ResourceDialog,
} from '@/components/common';
import { DocumentForm } from '@/components/common/DocumentForm';
import { EntityHeader, GetBorderClass } from '@/components/common/EntityHeader';
import { titleCase } from '@/components/common/utils/formatUtils';
import { Button } from '@/components/ui/button';
import type { BranchDocument } from '@/types/branch';
import { FileText } from 'lucide-react';
import { useState } from 'react';

// Branch Document Types
const BRANCH_DOCUMENT_TYPES = [
    { value: 'license', label: 'Business License' },
    { value: 'contract', label: 'Lease/Property Contract' },
    { value: 'permit', label: 'Operating Permit' },
    { value: 'certificate', label: 'Registration Certificate' },
    { value: 'report', label: 'Inspection/Audit Report' },
];

interface DocumentsEditProps {
    documents: BranchDocument[];
    onDocumentAdd: (documentData: Partial<BranchDocument>) => void;
    onDocumentEdit: (documentData: Partial<BranchDocument>) => void;
    onDocumentDelete: (documentId: string) => void;
}

export function DocumentsEdit({
    documents,
    onDocumentAdd,
    onDocumentEdit,
    onDocumentDelete,
}: DocumentsEditProps) {
    const [isAddDocumentDialogOpen, setIsAddDocumentDialogOpen] =
        useState(false);
    const [editDocumentDialogOpen, setEditDocumentDialogOpen] = useState<
        string | null
    >(null);
    const [deleteDocumentDialogOpen, setDeleteDocumentDialogOpen] = useState<
        string | null
    >(null);

    const handleDocumentAdd = (documentData: Partial<BranchDocument>) => {
        onDocumentAdd(documentData);
        setIsAddDocumentDialogOpen(false);
    };

    const handleDocumentEdit = (documentData: Partial<BranchDocument>) => {
        onDocumentEdit(documentData);
        setEditDocumentDialogOpen(null);
    };

    const handleDocumentAddCancel = () => {
        setIsAddDocumentDialogOpen(false);
    };

    const handleDocumentEditCancel = () => {
        setEditDocumentDialogOpen(null);
    };

    const handleDeleteDocumentConfirm = (documentId: string) => {
        onDocumentDelete(documentId);
        setDeleteDocumentDialogOpen(null);
    };

    const formatDocType = (type: string): string => titleCase(type);

    const formatFileSize = (bytes?: number | null): string => {
        if (!bytes) return '0 B';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <>
            <InfoCard
                title="Documents"
                action={
                    <Button
                        type="button"
                        variant="secondary"
                        className="cursor-pointer border-2 border-blue-700"
                        onClick={() => setIsAddDocumentDialogOpen(true)}
                    >
                        Upload Document
                    </Button>
                }
            >
                {documents.filter((doc) => !doc._isDeleted).length > 0 ? (
                    <div className="space-y-4">
                        {documents
                            .filter((doc) => !doc._isDeleted)
                            .map((doc) => {
                                const borderClass = GetBorderClass(
                                    doc._isNew,
                                    doc._isModified,
                                );

                                return (
                                    <div
                                        key={doc.id}
                                        className={`relative rounded-lg ${borderClass} p-4`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div>
                                                <FileText className="size-8 text-muted-foreground" />
                                            </div>

                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <EntityHeader
                                                        name={doc.title}
                                                        badges={[
                                                            {
                                                                show: doc._isNew,
                                                                label: 'New',
                                                                variant:
                                                                    'outline',
                                                                className:
                                                                    'border-green-500 bg-green-100 text-green-800 hover:bg-green-200',
                                                            },
                                                            {
                                                                show: doc._isModified,
                                                                label: 'Modified',
                                                                variant:
                                                                    'outline',
                                                                className:
                                                                    'border-yellow-500 bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
                                                            },
                                                            {
                                                                show: doc.is_expired,
                                                                label: 'Expired',
                                                                variant:
                                                                    'destructive',
                                                            },
                                                            {
                                                                show:
                                                                    !doc.is_expired &&
                                                                    doc.is_expiring_soon,
                                                                label: 'Expiring Soon',
                                                                variant:
                                                                    'outline',
                                                                className:
                                                                    'border-yellow-500 bg-yellow-50 text-yellow-700',
                                                            },
                                                        ]}
                                                    />
                                                </div>

                                                <div className="space-y-1 text-sm">
                                                    <div>
                                                        <span className="text-muted-foreground">
                                                            Type:
                                                        </span>{' '}
                                                        <span className="mr-16">
                                                            {formatDocType(
                                                                doc.doc_type,
                                                            )}
                                                        </span>
                                                        <span className="text-muted-foreground">
                                                            File:
                                                        </span>{' '}
                                                        {doc.file_name}
                                                    </div>

                                                    <div>
                                                        <span className="text-muted-foreground">
                                                            Size:
                                                        </span>{' '}
                                                        <span className="mr-16">
                                                            {formatFileSize(
                                                                doc.file_size,
                                                            )}
                                                        </span>
                                                        {doc.expiry_date && (
                                                            <>
                                                                <span className="text-muted-foreground">
                                                                    Expiry:
                                                                </span>{' '}
                                                                {formatDateForDisplay(
                                                                    doc.expiry_date,
                                                                )}
                                                            </>
                                                        )}
                                                    </div>

                                                    {doc.uploader && (
                                                        <div>
                                                            <span className="text-muted-foreground">
                                                                Uploaded by:
                                                            </span>{' '}
                                                            {doc.uploader.name}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="absolute top-1/2 right-4 flex -translate-y-1/2 gap-2">
                                                <DataTableActions
                                                    item={doc}
                                                    onEdit={() =>
                                                        setEditDocumentDialogOpen(
                                                            doc.id,
                                                        )
                                                    }
                                                    onDelete={() =>
                                                        setDeleteDocumentDialogOpen(
                                                            doc.id,
                                                        )
                                                    }
                                                    showView={false}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                ) : (
                    <EmptyActionState
                        message="Upload and manage branch documents like leases, permits, and certificates."
                        buttonText="Add Document"
                    />
                )}
            </InfoCard>

            {/* Add Document Dialog */}
            <ResourceDialog
                mode="add"
                open={isAddDocumentDialogOpen}
                resourceLabel="Document"
                subjectLabel="branch"
            >
                <DocumentForm
                    onSuccess={handleDocumentAdd}
                    onCancel={handleDocumentAddCancel}
                    subjectLabel="branch"
                    documentTypes={BRANCH_DOCUMENT_TYPES}
                />
            </ResourceDialog>

            {/* Edit Document Dialog */}
            <ResourceDialog
                mode="edit"
                open={!!editDocumentDialogOpen}
                resourceLabel="Document"
                subjectLabel="branch"
            >
                <DocumentForm
                    document={documents.find(
                        (d) => d.id === editDocumentDialogOpen,
                    )}
                    onSuccess={handleDocumentEdit}
                    onCancel={handleDocumentEditCancel}
                    subjectLabel="branch"
                    documentTypes={BRANCH_DOCUMENT_TYPES}
                />
            </ResourceDialog>

            {/* Delete Document Dialog */}
            <DeleteDialog
                open={!!deleteDocumentDialogOpen}
                onOpenChange={(open) => {
                    if (!open) setDeleteDocumentDialogOpen(null);
                }}
                onConfirm={() => {
                    if (deleteDocumentDialogOpen) {
                        handleDeleteDocumentConfirm(deleteDocumentDialogOpen);
                    }
                }}
                title="Delete Document"
                description="Are you sure you want to delete this document? This action cannot be undone."
                confirmLabel="Delete Document"
            />
        </>
    );
}
