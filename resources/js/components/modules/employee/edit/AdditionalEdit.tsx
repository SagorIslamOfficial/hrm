import { InfoCard } from '@/components/common';

export function AdditionalEdit() {
    return (
        <div className="space-y-6">
            <InfoCard title="Contacts">
                <p className="text-sm text-muted-foreground">
                    Contact information is managed separately. You can add
                    emergency contacts and additional phone numbers after
                    saving.
                </p>
            </InfoCard>

            <InfoCard title="Documents">
                <p className="text-sm text-muted-foreground">
                    Employee documents can be uploaded after saving the profile.
                    This includes contracts, certifications, and identification
                    documents.
                </p>
            </InfoCard>

            <InfoCard title="Notes">
                <p className="text-sm text-muted-foreground">
                    Internal notes and comments about the employee can be added
                    in the employee detail view.
                </p>
            </InfoCard>
        </div>
    );
}
