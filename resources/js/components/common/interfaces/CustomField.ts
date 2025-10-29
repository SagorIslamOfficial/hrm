export interface CustomField {
    id: string;
    field_key: string;
    field_value: string;
    field_type: string;
    section: string;
    _isNew?: boolean;
    _isModified?: boolean;
    _isDeleted?: boolean;
}
