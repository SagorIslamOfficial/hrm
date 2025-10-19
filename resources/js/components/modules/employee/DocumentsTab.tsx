import { Button } from '@/components/ui/button';

export function DocumentsTab() {
    return (
        <div className="py-8 text-center">
            <h3 className="mb-2 text-lg font-semibold">Employee Documents</h3>
            <p className="mb-4 text-sm text-muted-foreground">
                Upload and manage employee documents like contracts,
                certificates, and identification.
            </p>
            <Button variant="outline" disabled>
                Upload Document
            </Button>
        </div>
    );
}
