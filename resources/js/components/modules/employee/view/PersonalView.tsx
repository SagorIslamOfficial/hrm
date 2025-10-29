import { EmptyActionState, InfoCard } from '@/components/common';

interface PersonalDetail {
    date_of_birth: string;
    gender: string;
    marital_status: string;
    blood_group: string;
    national_id: string;
    passport_number: string | null;
    address: string;
    city: string;
    country: string;
}

interface PersonalViewProps {
    personalDetail?: PersonalDetail;
}

export function PersonalView({ personalDetail }: PersonalViewProps) {
    return (
        <InfoCard title="Personal Information">
            {personalDetail ? (
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Date of Birth
                        </label>
                        <p className="text-sm font-medium">
                            {new Date(
                                personalDetail.date_of_birth,
                            ).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Gender
                        </label>
                        <p className="text-sm font-medium capitalize">
                            {personalDetail.gender}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Marital Status
                        </label>
                        <p className="text-sm font-medium capitalize">
                            {personalDetail.marital_status}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Blood Group
                        </label>
                        <p className="text-sm font-medium">
                            {personalDetail.blood_group}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            National ID
                        </label>
                        <p className="text-sm font-medium">
                            {personalDetail.national_id}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Passport Number
                        </label>
                        <p className="text-sm font-medium">
                            {personalDetail.passport_number || 'Not provided'}
                        </p>
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-sm font-medium text-muted-foreground">
                            Address
                        </label>
                        <p className="text-sm font-medium">
                            {personalDetail.address}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            City
                        </label>
                        <p className="text-sm font-medium">
                            {personalDetail.city}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Country
                        </label>
                        <p className="text-sm font-medium">
                            {personalDetail.country}
                        </p>
                    </div>
                </div>
            ) : (
                <EmptyActionState
                    message="Add personal details to employee profile."
                    buttonText="Add Personal Details"
                />
            )}
        </InfoCard>
    );
}
