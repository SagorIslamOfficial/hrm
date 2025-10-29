import {
    DocumentPreviewDialog,
    EmptyActionState,
    InfoCard,
} from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Eye, FileText } from 'lucide-react';
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
}

interface DocumentsViewProps {
    documents?: Document[];
    employeeId: string;
}

export function DocumentsView({ documents, employeeId }: DocumentsViewProps) {
    const [selectedDocument, setSelectedDocument] = useState<{
        url: string;
        name: string;
        type: string;
        title: string;
        id: string;
    } | null>(null);

    const handleDownload = (documentId: string) => {
        window.location.href = `/dashboard/employees/${employeeId}/documents/${documentId}/download`;
    };

    const handlePreview = (doc: Document) => {
        setSelectedDocument({
            url: doc.file_url,
            name: doc.file_name,
            type: doc.doc_type,
            title: doc.title,
            id: doc.id,
        });
    };

    const formatDocType = (docType: string) => {
        return docType
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <InfoCard title="Documents">
            {documents && documents.length > 0 ? (
                <div className="space-y-2">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="flex items-center justify-between rounded-lg border p-3"
                        >
                            <div className="flex items-center gap-3">
                                <FileText className="mr-4 size-10 text-muted-foreground" />
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-lg font-medium">
                                            {doc.title}
                                        </p>
                                        {doc.is_expired && (
                                            <Badge
                                                variant="destructive"
                                                className="text-xs"
                                            >
                                                Expired
                                            </Badge>
                                        )}
                                        {!doc.is_expired &&
                                            doc.is_expiring_soon && (
                                                <Badge
                                                    variant="outline"
                                                    className="border-yellow-500 bg-yellow-100 text-xs text-yellow-800"
                                                >
                                                    Expiring Soon
                                                </Badge>
                                            )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDocType(doc.doc_type)} -{' '}
                                        {doc.file_name} -{' '}
                                        {(doc.file_size / 1024).toFixed(2)} KB
                                    </p>
                                    {doc.expiry_date && (
                                        <p className="text-sm text-muted-foreground">
                                            Expires:{' '}
                                            {new Date(
                                                doc.expiry_date,
                                            ).toLocaleDateString()}
                                        </p>
                                    )}
                                    {doc.uploader && (
                                        <p className="text-sm text-muted-foreground">
                                            Uploaded by {doc.uploader.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="cursor-pointer"
                                    onClick={() => handlePreview(doc)}
                                >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Preview
                                </Button>
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="cursor-pointer"
                                    onClick={() => handleDownload(doc.id)}
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyActionState
                    message="Upload and manage employee documents like contracts,
                        certificates, and identification."
                    buttonText="Add Document"
                />
            )}

            {/* Document Preview Dialog */}
            <DocumentPreviewDialog
                open={selectedDocument !== null}
                onOpenChange={(open) => !open && setSelectedDocument(null)}
                documentUrl={selectedDocument?.url || null}
                documentName={selectedDocument?.name || ''}
                documentType={selectedDocument?.type || ''}
                title={selectedDocument?.title}
                onDownload={
                    selectedDocument
                        ? () => handleDownload(selectedDocument.id)
                        : undefined
                }
            />
        </InfoCard>
    );
}
