import axios from 'axios';

export interface CustomFieldPayload {
    employee_id?: string | number;
    field_key: string;
    field_value: string;
    field_type?: string;
    section?: string;
}

export async function createCustomField(
    employeeId: string | number,
    payload: CustomFieldPayload,
) {
    return axios.post(
        `/dashboard/employees/${employeeId}/custom-fields`,
        payload,
    );
}

export async function updateCustomField(
    employeeId: string | number,
    fieldId: string | number,
    payload: Partial<CustomFieldPayload>,
) {
    return axios.put(
        `/dashboard/employees/${employeeId}/custom-fields/${fieldId}`,
        payload,
    );
}

export async function deleteCustomField(
    employeeId: string | number,
    fieldId: string | number,
) {
    return axios.delete(
        `/dashboard/employees/${employeeId}/custom-fields/${fieldId}`,
    );
}

export default {
    createCustomField,
    updateCustomField,
    deleteCustomField,
};
