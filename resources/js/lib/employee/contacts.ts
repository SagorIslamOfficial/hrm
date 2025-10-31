import axios from 'axios';

export interface ContactPayload {
    contact_name: string;
    relationship?: string;
    phone?: string;
    email?: string | null;
    address?: string | null;
    is_primary?: boolean;
    _photoFile?: File | null;
}

// Helper function to build FormData from ContactPayload
function buildContactFormData(payload: ContactPayload): FormData {
    const formData = new FormData();
    if (payload.contact_name !== undefined && payload.contact_name !== null) {
        formData.append('contact_name', payload.contact_name);
    }
    if (payload.relationship !== undefined && payload.relationship !== null) {
        formData.append('relationship', payload.relationship);
    }
    if (payload.phone !== undefined && payload.phone !== null) {
        formData.append('phone', payload.phone);
    }
    if (payload.email !== undefined && payload.email !== null) {
        formData.append('email', payload.email);
    }
    if (payload.address !== undefined && payload.address !== null) {
        formData.append('address', payload.address);
    }
    if (payload.is_primary !== undefined) {
        formData.append('is_primary', payload.is_primary ? '1' : '0');
    }
    if (payload._photoFile) {
        formData.append('photo', payload._photoFile);
    }
    return formData;
}

export async function createContact(
    employeeId: string | number,
    payload: ContactPayload,
) {
    const formData = buildContactFormData(payload);
    return axios.post(
        `/dashboard/hr/employee/${employeeId}/contacts`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    );
}

export async function updateContact(
    employeeId: string | number,
    contactId: string | number,
    payload: ContactPayload,
) {
    const formData = buildContactFormData(payload);
    formData.append('_method', 'put');
    return axios.post(
        `/dashboard/hr/employee/${employeeId}/contacts/${contactId}`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    );
}

export async function deleteContact(
    employeeId: string | number,
    contactId: string | number,
) {
    return axios.delete(
        `/dashboard/hr/employee/${employeeId}/contacts/${contactId}`,
    );
}

export default {
    createContact,
    updateContact,
    deleteContact,
};
