import { InfoCard } from '@/components/common';
import { Button } from '@/components/ui/button';

export function DocumentsEdit() {
    return (
        <InfoCard title="Employee Documents">
            <div className="py-8 text-center">
                <p className="mb-4 text-sm text-muted-foreground">
                    Upload and manage employee documents like contracts,
                    certificates, and identification.
                </p>
                <Button variant="outline" disabled>
                    Upload Document
                </Button>
            </div>
        </InfoCard>
    );
}
