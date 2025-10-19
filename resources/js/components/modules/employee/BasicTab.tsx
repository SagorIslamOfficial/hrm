import {
    CreatedByField,
    DateField,
    PhotoUploadField,
    SelectField,
    TextField,
} from '@/components/common';
import { useState } from 'react';

interface BasicTabProps {
    data: {
        employee_code: string;
        email: string;
        first_name: string;
        last_name: string;
        phone: string;
        department_id: string;
        designation_id: string;
        employment_status: string;
        employment_type: string;
        joining_date: string;
        photo: File | null;
        delete_photo: boolean;
    };
    existingPhotoUrl?: string;
    setData: (key: string, value: string | File | null | boolean) => void;
    errors: Record<string, string>;
    departments: Array<{ id: string; name: string }>;
    designations: Array<{ id: string; title: string }>;
    employmentTypes: Array<{ code: string; name: string }>;
    auth?: {
        user?: {
            name?: string;
        };
    };
}

export function BasicTab({
    data,
    existingPhotoUrl,
    setData,
    errors,
    departments,
    designations,
    employmentTypes,
    auth,
}: BasicTabProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        existingPhotoUrl || null,
    );

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Employee Code Field */}
            <TextField
                id="employee_code"
                label="Employee Code"
                value={data.employee_code}
                onChange={(value) => setData('employee_code', value)}
                error={errors.employee_code}
                required
                placeholder="Enter employee code (e.g., EMP001)"
            />

            {/* Email Field */}
            <TextField
                id="email"
                label="Email Address"
                type="email"
                value={data.email}
                onChange={(value) => setData('email', value)}
                error={errors.email}
                required
                placeholder="Enter email address (e.g., me@sagorislam.dev)"
            />

            {/* First Name Field */}
            <TextField
                id="first_name"
                label="First Name"
                value={data.first_name}
                onChange={(value) => setData('first_name', value)}
                error={errors.first_name}
                required
                placeholder="Enter first name (e.g., Sagor)"
            />

            {/* Last Name Field */}
            <TextField
                id="last_name"
                label="Last Name"
                value={data.last_name}
                onChange={(value) => setData('last_name', value)}
                error={errors.last_name}
                required
                placeholder="Enter last name (e.g., Islam)"
            />

            {/* Phone Number Field */}
            <TextField
                id="phone"
                label="Phone Number"
                type="tel"
                value={data.phone}
                onChange={(value) => setData('phone', value)}
                error={errors.phone}
                placeholder="Enter phone number (e.g., +8801933126160)"
            />

            {/* Department Field */}
            <SelectField
                id="department_id"
                label="Department"
                required
                value={data.department_id}
                onChange={(value) => setData('department_id', value)}
                options={departments.map((dept) => ({
                    value: dept.id,
                    label: dept.name,
                }))}
            />

            {/* Designation Field */}
            <SelectField
                id="designation_id"
                label="Designation"
                required
                value={data.designation_id}
                onChange={(value) => setData('designation_id', value)}
                options={designations.map((desig) => ({
                    value: desig.id,
                    label: desig.title,
                }))}
            />

            {/* Employment Status Fields */}
            <SelectField
                id="employment_status"
                label="Employment Status"
                required
                value={data.employment_status}
                onChange={(value) => setData('employment_status', value)}
                options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'InActive' },
                    { value: 'terminated', label: 'Terminated' },
                    { value: 'on_leave', label: 'On Leave' },
                ]}
            />

            {/* Employment Type Field */}
            <SelectField
                id="employment_type"
                label="Employment Type"
                required
                value={data.employment_type}
                onChange={(value) => setData('employment_type', value)}
                options={employmentTypes.map((type) => ({
                    value: type.code,
                    label: type.name,
                }))}
            />

            {/* Joining Date */}
            <DateField
                id="joining_date"
                label="Joining Date"
                value={data.joining_date}
                onChange={(value) => setData('joining_date', value)}
                error={errors.joining_date}
                required
            />

            {/* Photo upload field */}
            <PhotoUploadField
                value={data.photo}
                onChange={(file) => {
                    setData('photo', file);
                    if (file) {
                        const url = URL.createObjectURL(file);
                        setPreviewUrl(url);
                        setData('delete_photo', false);
                    }
                }}
                onDelete={() => {
                    setData('delete_photo', true);
                    setPreviewUrl(null);
                }}
                helpText="Upload a profile photo (max 2MB, JPEG/PNG/WebP)"
                error={errors.photo}
                previewUrl={previewUrl}
            />

            {/* Created By field */}
            <CreatedByField userName={auth?.user?.name} />
        </div>
    );
}
