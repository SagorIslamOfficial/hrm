import { FormField, InfoCard } from '@/components/common';

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

export function PersonalEdit({ data, setData }: PersonalTabProps) {
    // Helper function to update nested personal_detail fields
    const updatePersonalDetail = (field: string, value: string) => {
        setData('personal_detail', {
            ...data.personal_detail,
            [field]: value,
        });
    };

    return (
        <InfoCard title="Personal Details">
            <div className="grid gap-6 md:grid-cols-2">
                <FormField
                    type="date"
                    id="date_of_birth"
                    label="Date of Birth"
                    value={data.personal_detail.date_of_birth}
                    onChange={(value: string) =>
                        updatePersonalDetail('date_of_birth', value)
                    }
                />

                <FormField
                    type="select"
                    id="gender"
                    label="Gender"
                    required
                    value={data.personal_detail.gender}
                    onChange={(value: string) =>
                        updatePersonalDetail('gender', value)
                    }
                    options={[
                        { value: 'male', label: 'Male' },
                        { value: 'female', label: 'Female' },
                    ]}
                />

                <FormField
                    type="select"
                    id="marital_status"
                    label="Marital Status"
                    required
                    value={data.personal_detail.marital_status}
                    onChange={(value: string) =>
                        updatePersonalDetail('marital_status', value)
                    }
                    options={[
                        { value: 'single', label: 'Single' },
                        { value: 'married', label: 'Married' },
                        { value: 'divorced', label: 'Divorced' },
                        { value: 'widowed', label: 'Widowed' },
                    ]}
                />

                <FormField
                    type="select"
                    id="blood_group"
                    label="Blood Group"
                    value={data.personal_detail.blood_group}
                    onChange={(value: string) =>
                        updatePersonalDetail('blood_group', value)
                    }
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

                <FormField
                    type="text"
                    id="national_id"
                    label="National ID"
                    required
                    value={data.personal_detail.national_id}
                    onChange={(value: string) =>
                        updatePersonalDetail('national_id', value)
                    }
                    placeholder="e.g., 12345678901234"
                />

                <FormField
                    type="text"
                    id="passport_number"
                    label="Passport Number"
                    value={data.personal_detail.passport_number}
                    onChange={(value: string) =>
                        updatePersonalDetail('passport_number', value)
                    }
                    placeholder="e.g., A123456789"
                />

                <FormField
                    type="text"
                    id="address"
                    label="Address"
                    required
                    value={data.personal_detail.address}
                    onChange={(value: string) =>
                        updatePersonalDetail('address', value)
                    }
                    placeholder="e.g., 123 Main St, Apt 4B"
                />

                <FormField
                    type="text"
                    id="city"
                    label="City"
                    required
                    value={data.personal_detail.city}
                    onChange={(value: string) =>
                        updatePersonalDetail('city', value)
                    }
                    placeholder="e.g., Dhaka"
                />

                <FormField
                    type="text"
                    id="country"
                    label="Country"
                    required
                    value={data.personal_detail.country}
                    onChange={(value: string) =>
                        updatePersonalDetail('country', value)
                    }
                    placeholder="e.g., Bangladesh"
                />
            </div>
        </InfoCard>
    );
}
