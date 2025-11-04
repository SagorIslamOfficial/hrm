export interface Note {
    id: string;
    title?: string;
    note: string;
    category: string;
    is_private?: boolean | null;
    created_at: string;
    creator?: {
        id?: number;
        name?: string;
    };
    updater?: {
        id?: number;
        name?: string;
    };
    updated_at?: string;
    _isNew?: boolean;
    _isModified?: boolean;
    _isDeleted?: boolean;
}
