export interface Document {
    id: string;
    doc_type: string;
    title: string;
    file_name?: string | null;
    file_path?: string | null;
    file_url?: string | null;
    file_size?: number | null;
    expiry_date?: string | null;
    is_expired?: boolean;
    is_expiring_soon?: boolean;
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
