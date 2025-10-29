export interface Note {
    id: string;
    note: string;
    category: string;
    is_private: boolean;
    created_at: string;
    creator?: {
        name?: string;
    };
    updated_at?: string;
    updater?: {
        name?: string;
    };
    _isNew?: boolean;
    _isModified?: boolean;
    _isDeleted?: boolean;
}
