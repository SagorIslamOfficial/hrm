import axios from 'axios';

export interface DocumentPayload {
    doc_type: string;
    title: string;
    expiry_date?: string | null;
    _documentFile?: File | null;
}

export async function createDocument(
    employeeId: string | number,
    payload: DocumentPayload,
) {
    const formData = new FormData();
    formData.append('doc_type', payload.doc_type);
    formData.append('title', payload.title);
    if (payload.expiry_date) {
        formData.append('expiry_date', payload.expiry_date);
    }
    if (payload._documentFile) {
        formData.append('file', payload._documentFile);
    }

    return axios.post(
        `/dashboard/employees/${employeeId}/documents`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    );
}

export async function updateDocument(
    employeeId: string | number,
    documentId: string | number,
    payload: DocumentPayload,
) {
    const formData = new FormData();
    formData.append('doc_type', payload.doc_type);
    formData.append('title', payload.title);
    if (payload.expiry_date) {
        formData.append('expiry_date', payload.expiry_date);
    }
    formData.append('_method', 'put');
    if (payload._documentFile) {
        formData.append('file', payload._documentFile);
    }

    return axios.post(
        `/dashboard/employees/${employeeId}/documents/${documentId}`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    );
}

export async function deleteDocument(
    employeeId: string | number,
    documentId: string | number,
) {
    return axios.delete(
        `/dashboard/employees/${employeeId}/documents/${documentId}`,
    );
}

export default {
    createDocument,
    updateDocument,
    deleteDocument,
};
