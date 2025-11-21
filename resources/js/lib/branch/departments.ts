import axios from 'axios';

export interface DepartmentPayload {
    department_id: string;
    budget_allocation?: number | null;
    is_primary?: boolean;
}

export interface DepartmentUpdatePayload {
    budget_allocation?: number | null;
    is_primary?: boolean;
}

export async function attachDepartment(
    branchId: string | number,
    payload: DepartmentPayload,
) {
    return axios.post(
        `/dashboard/hr/organization/branches/${branchId}/departments/assign`,
        payload,
    );
}

export async function updateDepartment(
    branchId: string | number,
    departmentId: string | number,
    payload: DepartmentUpdatePayload,
) {
    return axios.put(
        `/dashboard/hr/organization/branches/${branchId}/departments/${departmentId}`,
        payload,
    );
}

export async function detachDepartment(
    branchId: string | number,
    departmentId: string | number,
) {
    return axios.delete(
        `/dashboard/hr/organization/branches/${branchId}/departments/${departmentId}`,
    );
}

export default { attachDepartment, updateDepartment, detachDepartment };
