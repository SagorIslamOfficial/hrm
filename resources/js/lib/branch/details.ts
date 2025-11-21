import axios from 'axios';

export interface BranchDetailPayload {
    latitude?: number | string | null;
    longitude?: number | string | null;
    working_hours?: Record<string, unknown> | null;
    facilities?: string[] | null;
    total_area?: number | string | null;
    total_floors?: number | string | null;
    floor_number?: string | null;
    accessibility_features?: string | null;
    monthly_rent?: number | string | null;
    monthly_utilities?: number | string | null;
    monthly_maintenance?: number | string | null;
    security_deposit?: number | string | null;
    building_name?: string | null;
    building_type?: string | null;
    lease_start_date?: string | null;
    lease_end_date?: string | null;
    lease_terms?: string | null;
    property_contact_name?: string | null;
    property_contact_phone?: string | null;
    property_contact_email?: string | null;
    property_contact_address?: string | null;
    property_contact_photo?: File | null;
    delete_photo?: boolean;
}

// Helper function to build FormData from BranchDetailPayload
function buildDetailFormData(payload: BranchDetailPayload): FormData {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]: [string, unknown]) => {
        if (value === null || value === undefined) {
            return;
        }

        if (key === 'property_contact_photo' && value instanceof File) {
            formData.append('detail[property_contact_photo]', value);
        } else if (key === 'working_hours' || key === 'facilities') {
            // Handle nested objects/arrays as JSON
            if (typeof value === 'object') {
                formData.append(`detail[${key}]`, JSON.stringify(value));
            }
        } else if (
            [
                'latitude',
                'longitude',
                'total_area',
                'total_floors',
                'monthly_rent',
                'monthly_utilities',
                'monthly_maintenance',
                'security_deposit',
            ].includes(key)
        ) {
            // Handle numeric fields
            formData.append(`detail[${key}]`, String(value));
        } else if (key === 'delete_photo') {
            formData.append(`detail[${key}]`, value ? '1' : '0');
        } else {
            // Handle string fields
            formData.append(`detail[${key}]`, String(value));
        }
    });

    return formData;
}

export async function updateBranchDetail(
    branchId: string | number,
    payload: BranchDetailPayload,
) {
    const formData = buildDetailFormData(payload);

    return axios.put(
        `/dashboard/hr/organization/branches/${branchId}`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    );
}

export default {
    updateBranchDetail,
};
