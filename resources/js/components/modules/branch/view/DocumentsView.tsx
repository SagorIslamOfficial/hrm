import {
    EmptyActionState,
    formatDateForDisplay,
    InfoCard,
} from '@/components/common';
import { titleCase } from '@/components/common/utils/formatUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { downloadDocument } from '@/lib/branch/documents';
import type { BranchDocument } from '@/types/branch';
import { Download, FileText } from 'lucide-react';

interface DocumentsViewProps {
    documents: BranchDocument[];
    branchId: string;
}

export function DocumentsView({ documents, branchId }: DocumentsViewProps) {
    const formatDocType = (type: string): string => titleCase(type);

    const formatFileSize = (bytes?: number | null): string => {
        if (!bytes) return '0 B';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const handleDownload = (docId: string) => {
        downloadDocument(branchId, docId);
    };

    return (
        <InfoCard title="Documents">
            {documents && documents.length > 0 ? (
                <div className="space-y-4">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="relative rounded-lg border border-sidebar-border/70 p-4"
                        >
                            <div className="flex items-start gap-4">
                                <div>
                                    <FileText className="size-8 text-muted-foreground" />
                                </div>

                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold">
                                            {doc.title}
                                        </h4>
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
                                                {formatDocType(doc.doc_type)}
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
                                                {formatFileSize(doc.file_size)}
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
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDownload(doc.id)}
                                    >
                                        <Download className="mr-2 size-4" />
                                        Download
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyActionState
                    message="No documents found."
                    buttonText="Add Document"
                />
            )}
        </InfoCard>
    );
}
