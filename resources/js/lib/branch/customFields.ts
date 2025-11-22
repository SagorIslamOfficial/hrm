import axios from 'axios';

export interface CustomFieldPayload {
    branch_id: string;
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
}

export interface CustomFieldUpdatePayload {
    field_key?: string;
    field_value?: string | null;
    field_type?:
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
}

export async function createCustomField(payload: CustomFieldPayload) {
    return axios.post(
        `/dashboard/hr/organization/branches/${payload.branch_id}/custom-fields`,
        payload,
    );
}

export async function updateCustomField(
    branchId: string | number,
    fieldId: string,
    payload: CustomFieldUpdatePayload,
) {
    return axios.put(
        `/dashboard/hr/organization/branches/${branchId}/custom-fields/${fieldId}`,
        payload,
    );
}

export async function deleteCustomField(
    branchId: string | number,
    fieldId: string,
) {
    return axios.delete(
        `/dashboard/hr/organization/branches/${branchId}/custom-fields/${fieldId}`,
    );
}

export async function syncCustomFields(
    branchId: string | number,
    fields: CustomFieldPayload[],
) {
    return axios.post(
        `/dashboard/hr/organization/branches/${branchId}/custom-fields/sync`,
        {
            custom_fields: fields,
        },
    );
}
