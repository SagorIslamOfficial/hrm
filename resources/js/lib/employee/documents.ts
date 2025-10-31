import axios, { AxiosResponse } from 'axios';

export interface DocumentPayload {
    doc_type: string;
    title: string;
    expiry_date?: string | null;
    _documentFile?: File | null;
}

export async function createDocument(
    employeeId: string | number,
    payload: DocumentPayload,
): Promise<AxiosResponse<DocumentPayload>> {
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
        `/dashboard/hr/employee/${encodeURIComponent(employeeId)}/documents`,
        formData,
    );
}

export async function updateDocument(
    employeeId: string | number,
    documentId: string | number,
    payload: DocumentPayload,
): Promise<AxiosResponse<DocumentPayload>> {
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
        `/dashboard/hr/employee/${encodeURIComponent(employeeId)}/documents/${encodeURIComponent(documentId)}`,
        formData,
    );
}

export async function deleteDocument(
    employeeId: string | number,
    documentId: string | number,
): Promise<AxiosResponse> {
    return axios.delete(
        `/dashboard/hr/employee/${encodeURIComponent(employeeId)}/documents/${encodeURIComponent(documentId)}`,
    );
}

export default {
    createDocument,
    updateDocument,
    deleteDocument,
};
