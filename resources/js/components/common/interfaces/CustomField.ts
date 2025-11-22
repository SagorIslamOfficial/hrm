export interface CustomField {
    id: string;
    field_key: string;
    field_value?: string | null;
    field_type:
        | 'text'
        | 'number'
        | 'date'
        | 'boolean'
        | 'select'
        | 'textarea'
        | 'email'
        | 'phone'
        | 'url';
    section?: 'general' | 'operational' | 'technical' | 'other';
    _isNew?: boolean;
    _isModified?: boolean;
    _isDeleted?: boolean;
}
