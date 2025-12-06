// Common User interface for all user components
export interface User {
    id: number;
    name: string;
    email: string;
    employee_id: string | null;
    status: 'active' | 'inactive' | 'terminated' | 'on_leave';
    created_at: string;
    created_by?: number | null;
    photo_url?: string;
    roles: Array<{
        id: number;
        name: string;
    }>;
    creator?: {
        id: number;
        name: string;
    };
    employee?: {
        id: string;
        first_name: string;
        last_name: string;
        employee_code: string;
        email?: string;
        photo_url?: string;
        department?: {
            id: string;
            name: string;
        };
        designation?: {
            id: string;
            title: string;
        };
    };
}

export interface Role {
    id: number;
    name: string;
}

export interface UnlinkedEmployee {
    id: string;
    first_name: string;
    last_name: string;
    employee_code: string;
    email: string;
    employment_status: string;
}

export interface UserActivityLog {
    id: number;
    user_id: number;
    action:
        | 'add'
        | 'edit'
        | 'delete'
        | 'link_employee'
        | 'unlink_employee'
        | 'sync_name';
    description: string;
    changed_data: Record<string, unknown> | null;
    causer_id: number | null;
    causer_name: string | null;
    created_at: string;
}

// Export all components
export { UserEditForm } from './UserEditForm';
export { UserShow } from './UserShow';
export { UseUserColumns } from './UseUserColumns';
