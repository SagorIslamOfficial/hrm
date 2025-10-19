import { ContactDialog } from '@/components/common/ContactDialog';
import { DeleteDialog } from '@/components/common/DeleteDialog';
import { PhotoDialog } from '@/components/common/PhotoDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Image, SquarePen, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Contact {
    id: string;
    contact_name: string;
    relationship: string;
    phone: string;
    email?: string;
    address?: string;
    photo?: string;
    photo_url?: string;
    is_primary: boolean;
    created_at: string;
    updated_at: string;
    // Staging properties for pending changes
    _photoFile?: File;
    _isNew?: boolean;
    _isModified?: boolean;
    _isDeleted?: boolean;
}

interface ContactsTabProps {
    contacts: Contact[];
    onContactAdd: (contactData: Contact) => void;
    onContactEdit: (contactData: Contact) => void;
    onContactDelete: (contactId: string) => void;
}

export function ContactsTab({
    contacts,
    onContactAdd,
    onContactEdit,
    onContactDelete,
}: ContactsTabProps) {
    const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(false);
    const [editContactDialogOpen, setEditContactDialogOpen] = useState<
        string | null
    >(null);
    const [deleteContactDialogOpen, setDeleteContactDialogOpen] = useState<
        string | null
    >(null);
    const [selectedPhoto, setSelectedPhoto] = useState<{
        url: string;
        name: string;
    } | null>(null);

    const handleContactAdd = (contactData: Contact) => {
        onContactAdd(contactData);
        setIsAddContactDialogOpen(false);
    };

    const handleContactEdit = (contactData: Contact) => {
        onContactEdit(contactData);
        setEditContactDialogOpen(null);
    };

    const handleContactAddCancel = () => {
        setIsAddContactDialogOpen(false);
    };

    const handleContactEditCancel = () => {
        setEditContactDialogOpen(null);
    };

    const handleDeleteContactConfirm = (contactId: string) => {
        onContactDelete(contactId);
        setDeleteContactDialogOpen(null);
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Emergency Contacts</h3>
                <Button
                    type="button"
                    variant="secondary"
                    className="border-2 border-blue-700"
                    onClick={() => setIsAddContactDialogOpen(true)}
                >
                    Add Contact
                </Button>
            </div>

            <div className="space-y-4">
                {contacts
                    .filter((contact) => !contact._isDeleted)
                    .map((contact) => {
                        // Determine border color based on staging state
                        let borderClass = 'border';
                        if (contact._isNew) {
                            borderClass = 'border-2 border-green-500';
                        } else if (contact._isModified) {
                            borderClass = 'border-2 border-yellow-500';
                        }

                        return (
                            <div
                                key={contact.id}
                                className={`rounded-lg ${borderClass} p-4`}
                            >
                                <div className="flex items-start gap-3">
                                    {contact.photo_url && (
                                        <div className="group relative">
                                            <img
                                                src={contact.photo_url}
                                                alt={contact.contact_name}
                                                className="size-20 cursor-pointer rounded-full border object-cover transition-opacity hover:opacity-80"
                                                onClick={() =>
                                                    setSelectedPhoto({
                                                        url: contact.photo_url!,
                                                        name: contact.contact_name,
                                                    })
                                                }
                                            />
                                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                                                <Image className="size-6 text-white" />
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold">
                                                {contact.contact_name}
                                                {contact.is_primary && (
                                                    <Badge
                                                        className="ml-2"
                                                        variant="default"
                                                    >
                                                        Primary
                                                    </Badge>
                                                )}
                                                {contact._isNew && (
                                                    <Badge
                                                        className="ml-2 border-green-500 bg-green-100 text-green-800 hover:bg-green-200"
                                                        variant="outline"
                                                    >
                                                        New
                                                    </Badge>
                                                )}
                                                {contact._isModified && (
                                                    <Badge
                                                        className="ml-2 border-yellow-500 bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                                        variant="outline"
                                                    >
                                                        Modified
                                                    </Badge>
                                                )}
                                            </h4>
                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="cursor-pointer"
                                                    onClick={() =>
                                                        setEditContactDialogOpen(
                                                            contact.id,
                                                        )
                                                    }
                                                >
                                                    <SquarePen className="h-4 w-4 text-primary" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="cursor-pointer"
                                                    onClick={() =>
                                                        setDeleteContactDialogOpen(
                                                            contact.id,
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="grid gap-2 text-sm md:grid-cols-2">
                                            <div>
                                                <span className="text-muted-foreground">
                                                    Relationship:
                                                </span>{' '}
                                                <span className="capitalize">
                                                    {contact.relationship}
                                                </span>
                                            </div>
                                            {contact.email && (
                                                <div className="md:col-span-2">
                                                    <span className="text-muted-foreground">
                                                        Email:
                                                    </span>{' '}
                                                    {contact.email}
                                                </div>
                                            )}
                                            <div className="md:col-span-2">
                                                <span className="text-muted-foreground">
                                                    Phone:
                                                </span>{' '}
                                                {contact.phone}
                                            </div>
                                            <div className="md:col-span-2">
                                                <span className="text-muted-foreground">
                                                    Address:
                                                </span>{' '}
                                                {contact.address}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>

            {/* Add Contact Dialog */}
            <ContactDialog
                mode="add"
                open={isAddContactDialogOpen}
                onSuccess={handleContactAdd}
                onCancel={handleContactAddCancel}
                resourceLabel="Emergency Contact"
                subjectLabel="employee"
            />

            {/* Edit Contact Dialog */}
            <ContactDialog
                mode="edit"
                open={!!editContactDialogOpen}
                contact={contacts.find((c) => c.id === editContactDialogOpen)}
                onSuccess={handleContactEdit}
                onCancel={handleContactEditCancel}
                resourceLabel="Emergency Contact"
                subjectLabel="employee"
            />

            {/* Delete Contact Dialog */}
            <DeleteDialog
                open={!!deleteContactDialogOpen}
                onOpenChange={(open) => {
                    if (!open) setDeleteContactDialogOpen(null);
                }}
                onConfirm={() => {
                    if (deleteContactDialogOpen) {
                        handleDeleteContactConfirm(deleteContactDialogOpen);
                    }
                }}
                title="Delete Emergency Contact"
                description="Are you sure you want to delete this emergency contact? This action cannot be undone."
                confirmLabel="Delete Contact"
            />

            {/* Photo Popup Dialog */}
            <PhotoDialog
                open={selectedPhoto !== null}
                onOpenChange={(open) => !open && setSelectedPhoto(null)}
                photoUrl={selectedPhoto?.url || null}
                photoName={selectedPhoto?.name || ''}
                title={`${selectedPhoto?.name} - Contact Photo`}
            />
        </>
    );
}
