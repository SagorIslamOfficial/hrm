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

export async function createContact(
    employeeId: string | number,
    payload: ContactPayload,
) {
    const formData = new FormData();
    formData.append('contact_name', payload.contact_name);
    formData.append('relationship', payload.relationship || '');
    formData.append('phone', payload.phone || '');
    formData.append('email', payload.email || '');
    formData.append('address', payload.address || '');
    formData.append('is_primary', payload.is_primary ? '1' : '0');

    if (payload._photoFile) {
        formData.append('photo', payload._photoFile);
    }

    return axios.post(`/dashboard/hr/employee/${employeeId}/contacts`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export async function updateContact(
    employeeId: string | number,
    contactId: string | number,
    payload: ContactPayload,
) {
    const formData = new FormData();
    formData.append('contact_name', payload.contact_name);
    formData.append('relationship', payload.relationship || '');
    formData.append('phone', payload.phone || '');
    formData.append('email', payload.email || '');
    formData.append('address', payload.address || '');
    formData.append('is_primary', payload.is_primary ? '1' : '0');
    formData.append('_method', 'put');

    if (payload._photoFile) {
        formData.append('photo', payload._photoFile);
    }

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
