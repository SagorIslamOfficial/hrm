import { InfoCard } from '@/components/common';
import { FileText } from 'lucide-react';

interface Document {
    id: string;
    doc_type: string;
    title: string;
    file_name: string;
    file_size: number;
    expiry_date: string | null;
    created_at: string;
}

interface DocumentsViewProps {
    documents?: Document[];
}

export function DocumentsView({ documents }: DocumentsViewProps) {
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
                                <FileText className="size-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">{doc.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {doc.doc_type
                                            .split('_')
                                            .map(
                                                (word) =>
                                                    word
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                    word.slice(1),
                                            )
                                            .join(' ')}{' '}
                                        • {(doc.file_size / 1024).toFixed(2)} KB
                                        {doc.expiry_date && (
                                            <>
                                                {' '}
                                                • Expires:{' '}
                                                {new Date(
                                                    doc.expiry_date,
                                                ).toLocaleDateString()}
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">
                    No documents available
                </p>
            )}
        </InfoCard>
    );
}
