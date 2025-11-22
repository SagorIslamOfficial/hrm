import axios from 'axios';

export interface DocumentPayload {
    branch_id?: string;
    doc_type: string;
    title: string;
    file: File;
    expiry_date?: string | null;
    uploaded_by?: string;
}

export interface DocumentUpdatePayload {
    doc_type?: string;
    title?: string;
    file?: File;
    expiry_date?: string | null;
}

export async function createDocument(
    branchId: string | number,
    payload: FormData,
) {
    return axios.post(
        `/dashboard/hr/organization/branches/${branchId}/documents`,
        payload,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    );
}

export async function updateDocument(
    branchId: string | number,
    docId: string,
    payload: FormData,
) {
    // Add _method field for Laravel to treat this as PUT request
    payload.append('_method', 'PUT');

    return axios.post(
        `/dashboard/hr/organization/branches/${branchId}/documents/${docId}`,
        payload,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    );
}

export async function deleteDocument(branchId: string | number, docId: string) {
    return axios.delete(
        `/dashboard/hr/organization/branches/${branchId}/documents/${docId}`,
    );
}

export function downloadDocument(branchId: string | number, docId: string) {
    window.open(
        `/dashboard/hr/organization/branches/${branchId}/documents/${docId}/download`,
        '_blank',
    );
}
