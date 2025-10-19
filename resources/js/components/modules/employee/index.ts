// Common Employee interface for all employee components
export interface Employee {
    id: number;
    employee_code: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    department_id?: number;
    designation_id?: number;
    department_name: string;
    designation_title: string;
    employment_status: string;
    employment_type?: string;
    joining_date: string;
    created_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

// Export all components
export { EmployeeDeleteDialog } from './EmployeeDeleteDialog';
export { EmployeeEmptyState } from './EmployeeEmptyState';
export { EmployeePageHeader } from './EmployeePageHeader';
export { UseEmployeeColumns } from './UseEmployeeColumns';
