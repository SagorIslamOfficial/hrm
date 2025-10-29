import {
    DataTableActions,
    DeleteDialog,
    InfoCard,
    ResourceDialog,
} from '@/components/common';
import { ContactForm } from '@/components/common/ContactForm';
import DetailRow from '@/components/common/DetailRow';
import { EmptyActionState } from '@/components/common/EmptyActionState';
import { EntityHeader, GetBorderClass } from '@/components/common/EntityHeader';
import type { Contact } from '@/components/common/interfaces';
import { PhotoDialog } from '@/components/common/PhotoDialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ContactsTabProps {
    contacts: Contact[];
    onContactAdd: (contactData: Contact) => void;
    onContactEdit: (contactData: Contact) => void;
    onContactDelete: (contactId: string) => void;
}

export function ContactsEdit({
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
            <InfoCard
                title="Emergency Contacts"
                action={
                    <Button
                        type="button"
                        variant="secondary"
                        className="border-2 border-blue-700"
                        onClick={() => setIsAddContactDialogOpen(true)}
                    >
                        Add Contact
                    </Button>
                }
            >
                {(contacts || []).length > 0 ? (
                    <div className="space-y-4">
                        {contacts
                            .filter((contact) => !contact._isDeleted)
                            .map((contact) => {
                                const borderClass = GetBorderClass(
                                    contact._isNew,
                                    contact._isModified,
                                );

                                return (
                                    <div
                                        key={contact.id}
                                        className={`relative rounded-lg ${borderClass} p-4`}
                                    >
                                        <div className="flex items-start gap-4">
                                            {contact.photo_url && (
                                                <DetailRow
                                                    label="Photo"
                                                    value={contact.contact_name}
                                                    imageSrc={contact.photo_url}
                                                    imageAlt={
                                                        contact.contact_name
                                                    }
                                                    imageClassName="size-20 cursor-pointer rounded-full border object-cover transition-opacity hover:opacity-80"
                                                    imageWrapperClassName="group relative"
                                                    onImageClick={() =>
                                                        setSelectedPhoto({
                                                            url: contact.photo_url!,
                                                            name: contact.contact_name,
                                                        })
                                                    }
                                                    showValue={false}
                                                />
                                            )}

                                            <div className="flex-1 space-y-2">
                                                <EntityHeader
                                                    name={contact.contact_name}
                                                    badges={[
                                                        {
                                                            show: contact.is_primary,
                                                            label: 'Primary',
                                                            variant: 'default',
                                                        },
                                                        {
                                                            show: contact._isNew,
                                                            label: 'New',
                                                            variant: 'outline',
                                                            className:
                                                                'border-green-500 bg-green-100 text-green-800 hover:bg-green-200',
                                                        },
                                                        {
                                                            show: contact._isModified,
                                                            label: 'Modified',
                                                            variant: 'outline',
                                                            className:
                                                                'border-yellow-500 bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
                                                        },
                                                    ]}
                                                />

                                                <div className="space-y-1 text-sm">
                                                    <div>
                                                        <span className="text-muted-foreground">
                                                            Relationship:
                                                        </span>{' '}
                                                        <span className="mr-16 capitalize">
                                                            {
                                                                contact.relationship
                                                            }
                                                        </span>
                                                        <span className="text-muted-foreground">
                                                            Phone:
                                                        </span>{' '}
                                                        {contact.phone}
                                                    </div>

                                                    {contact.email && (
                                                        <div>
                                                            <span className="text-muted-foreground">
                                                                Email:
                                                            </span>{' '}
                                                            {contact.email}
                                                        </div>
                                                    )}

                                                    {contact.address && (
                                                        <div>
                                                            <span className="text-muted-foreground">
                                                                Address:
                                                            </span>{' '}
                                                            {contact.address}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="absolute top-1/2 right-4 flex -translate-y-1/2 gap-2">
                                                <DataTableActions
                                                    item={contact}
                                                    onEdit={() =>
                                                        setEditContactDialogOpen(
                                                            contact.id,
                                                        )
                                                    }
                                                    onDelete={() =>
                                                        setDeleteContactDialogOpen(
                                                            contact.id,
                                                        )
                                                    }
                                                    showView={false}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                ) : (
                    <EmptyActionState
                        message="Add contact details to track employee information."
                        buttonText="Add Contact Details"
                    />
                )}
            </InfoCard>

            {/* Add Contact Dialog */}
            <ResourceDialog
                mode="add"
                open={isAddContactDialogOpen}
                resourceLabel="Emergency Contact"
                subjectLabel="employee"
            >
                <ContactForm
                    onSuccess={handleContactAdd}
                    onCancel={handleContactAddCancel}
                    resourceLabel="Emergency Contact"
                    subjectLabel="employee"
                />
            </ResourceDialog>

            {/* Edit Contact Dialog */}
            <ResourceDialog
                mode="edit"
                open={!!editContactDialogOpen}
                resourceLabel="Emergency Contact"
                subjectLabel="employee"
            >
                <ContactForm
                    contact={contacts.find(
                        (c) => c.id === editContactDialogOpen,
                    )}
                    onSuccess={handleContactEdit}
                    onCancel={handleContactEditCancel}
                    resourceLabel="Emergency Contact"
                    subjectLabel="employee"
                />
            </ResourceDialog>

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
