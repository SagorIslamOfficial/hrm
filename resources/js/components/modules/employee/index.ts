// Common Employee interface for all employee components
export interface Employee {
    id: string;
    employee_code: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    department_id?: string;
    designation_id?: string;
    department_name: string;
    designation_title: string;
    employment_status: string;
    employment_type?: string;
    joining_date: string;
    photo_url?: string;
    created_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

export interface Contact {
    id: string;
    contact_name: string;
    relationship: string;
    phone: string;
    email?: string;
    address?: string;
    photo?: string;
    photo_url?: string;
    is_primary: boolean;
    created_at: string;
    updated_at: string;
    // Staging properties for pending changes
    _photoFile?: File;
    _isNew?: boolean;
    _isModified?: boolean;
    _isDeleted?: boolean;
}

// Export all components
export { EmployeeEditForm } from './EmployeeEditForm';
export { EmployeeShow } from './EmployeeShow';
export { UseEmployeeColumns } from './UseEmployeeColumns';
export { UseEmploymentTypeColumns } from './UseEmploymentTypeColumns';
