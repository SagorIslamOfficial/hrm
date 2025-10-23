import { DeleteDialog, DocumentDialog, InfoCard } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, SquarePen, Trash2 } from 'lucide-react';
import { useState } from 'react';

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

interface DocumentsEditProps {
    documents: Document[];
    onDocumentAdd: (documentData: Document) => void;
    onDocumentEdit: (documentData: Document) => void;
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

    const handleDocumentAdd = (documentData: Document) => {
        onDocumentAdd(documentData);
        setIsAddDocumentDialogOpen(false);
    };

    const handleDocumentEdit = (documentData: Document) => {
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

    const formatDocType = (type: string): string => {
        return type
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const formatFileSize = (bytes: number): string => {
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
                                // Determine border color based on staging state
                                let borderClass = 'border';
                                if (doc._isNew) {
                                    borderClass = 'border-2 border-green-500';
                                } else if (doc._isModified) {
                                    borderClass = 'border-2 border-yellow-500';
                                }

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
                                                    <h4 className="text-lg font-semibold">
                                                        {doc.title}
                                                    </h4>
                                                    {doc._isNew && (
                                                        <Badge
                                                            className="border-green-500 bg-green-100 text-green-800 hover:bg-green-200"
                                                            variant="outline"
                                                        >
                                                            New
                                                        </Badge>
                                                    )}
                                                    {doc._isModified && (
                                                        <Badge
                                                            className="border-yellow-500 bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                                            variant="outline"
                                                        >
                                                            Modified
                                                        </Badge>
                                                    )}
                                                    {doc.is_expired && (
                                                        <Badge variant="destructive">
                                                            Expired
                                                        </Badge>
                                                    )}
                                                    {!doc.is_expired &&
                                                        doc.is_expiring_soon && (
                                                            <Badge
                                                                variant="outline"
                                                                className="border-yellow-500 bg-yellow-50 text-yellow-700"
                                                            >
                                                                Expiring Soon
                                                            </Badge>
                                                        )}
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
                                                                {new Date(
                                                                    doc.expiry_date,
                                                                ).toLocaleDateString()}
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
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="cursor-pointer"
                                                    onClick={() =>
                                                        setEditDocumentDialogOpen(
                                                            doc.id,
                                                        )
                                                    }
                                                >
                                                    <SquarePen className="h-4 w-4 text-primary" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="cursor-pointer"
                                                    onClick={() =>
                                                        setDeleteDocumentDialogOpen(
                                                            doc.id,
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <p className="mb-4 text-sm text-muted-foreground">
                            Upload and manage employee documents like contracts,
                            certificates, and identification.
                        </p>
                        <Button
                            type="button"
                            variant="secondary"
                            className="border"
                            disabled
                        >
                            Upload Document
                        </Button>
                    </div>
                )}
            </InfoCard>

            {/* Add Document Dialog */}
            <DocumentDialog
                mode="add"
                open={isAddDocumentDialogOpen}
                onSuccess={handleDocumentAdd}
                onCancel={handleDocumentAddCancel}
                resourceLabel="Document"
                subjectLabel="employee"
            />

            {/* Edit Document Dialog */}
            <DocumentDialog
                mode="edit"
                open={!!editDocumentDialogOpen}
                document={documents.find(
                    (d) => d.id === editDocumentDialogOpen,
                )}
                onSuccess={handleDocumentEdit}
                onCancel={handleDocumentEditCancel}
                resourceLabel="Document"
                subjectLabel="employee"
            />

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
