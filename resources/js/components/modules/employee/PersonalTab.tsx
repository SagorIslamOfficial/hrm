import { DateField, SelectField, TextField } from '@/components/common';

interface PersonalTabProps {
    data: {
        personal_detail: {
            date_of_birth: string;
            gender: string;
            marital_status: string;
            blood_group: string;
            national_id: string;
            passport_number: string;
            address: string;
            city: string;
            country: string;
        };
    };
    setData: (
        key: string,
        value: string | File | null | boolean | Record<string, string | number>,
    ) => void;
}

export function PersonalTab({ data, setData }: PersonalTabProps) {
    // Helper function to update nested personal_detail fields
    const updatePersonalDetail = (field: string, value: string) => {
        setData('personal_detail', {
            ...data.personal_detail,
            [field]: value,
        });
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Date of Birth Field */}
            <DateField
                id="date_of_birth"
                label="Date of Birth"
                value={data.personal_detail.date_of_birth}
                onChange={(value) =>
                    updatePersonalDetail('date_of_birth', value)
                }
            />

            {/* Gender Field */}
            <SelectField
                id="gender"
                label="Gender"
                required
                value={data.personal_detail.gender}
                onChange={(value) => updatePersonalDetail('gender', value)}
                options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                ]}
            />

            {/* Marital Status Field */}
            <SelectField
                id="marital_status"
                label="Marital Status"
                required
                value={data.personal_detail.marital_status}
                onChange={(value) =>
                    updatePersonalDetail('marital_status', value)
                }
                options={[
                    { value: 'single', label: 'Single' },
                    { value: 'married', label: 'Married' },
                    { value: 'divorced', label: 'Divorced' },
                    { value: 'widowed', label: 'Widowed' },
                ]}
            />

            {/* Blood Group Field */}
            <SelectField
                id="blood_group"
                label="Blood Group"
                value={data.personal_detail.blood_group}
                onChange={(value) => updatePersonalDetail('blood_group', value)}
                options={[
                    { value: 'A+', label: 'A+' },
                    { value: 'A-', label: 'A-' },
                    { value: 'B+', label: 'B+' },
                    { value: 'B-', label: 'B-' },
                    { value: 'AB+', label: 'AB+' },
                    { value: 'AB-', label: 'AB-' },
                    { value: 'O+', label: 'O+' },
                    { value: 'O-', label: 'O-' },
                ]}
            />

            {/* National ID Field */}
            <TextField
                id="national_id"
                label="National ID"
                required
                value={data.personal_detail.national_id}
                onChange={(value) => updatePersonalDetail('national_id', value)}
                placeholder="e.g., 12345678901234"
            />

            {/* Passport Number Field */}
            <TextField
                id="passport_number"
                label="Passport Number"
                value={data.personal_detail.passport_number}
                onChange={(value) =>
                    updatePersonalDetail('passport_number', value)
                }
                placeholder="e.g., A123456789"
            />

            {/* Address Field */}
            <TextField
                id="address"
                label="Address"
                required
                value={data.personal_detail.address}
                onChange={(value) => updatePersonalDetail('address', value)}
                placeholder="e.g., 123 Main St, Apt 4B"
            />

            {/* City Field */}
            <TextField
                id="city"
                label="City"
                required
                value={data.personal_detail.city}
                onChange={(value) => updatePersonalDetail('city', value)}
                placeholder="e.g., Dhaka"
            />

            {/* Country Field */}
            <TextField
                id="country"
                label="Country"
                required
                value={data.personal_detail.country}
                onChange={(value) => updatePersonalDetail('country', value)}
                placeholder="e.g., Bangladesh"
            />
        </div>
    );
}
