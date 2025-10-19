export function AdditionalTab() {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contacts</h3>
            <p className="text-sm text-muted-foreground">
                Contact information is managed separately. You can add emergency
                contacts and additional phone numbers after saving.
            </p>

            <h3 className="mt-6 text-lg font-semibold">Documents</h3>
            <p className="text-sm text-muted-foreground">
                Employee documents can be uploaded after saving the profile.
                This includes contracts, certifications, and identification
                documents.
            </p>

            <h3 className="mt-6 text-lg font-semibold">Notes</h3>
            <p className="text-sm text-muted-foreground">
                Internal notes and comments about the employee can be added in
                the employee detail view.
            </p>
        </div>
    );
}
