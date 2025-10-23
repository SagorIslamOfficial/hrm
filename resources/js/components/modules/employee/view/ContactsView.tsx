import { InfoCard } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Image } from 'lucide-react';

interface Contact {
    id: string;
    contact_name: string;
    relationship: string;
    phone: string;
    email: string | null;
    address: string;
    photo?: string;
    photo_url?: string;
    is_primary: boolean;
}

interface ContactsViewProps {
    contacts?: Contact[];
    onPhotoClick: (photo: { url: string; name: string }) => void;
}

export function ContactsView({ contacts, onPhotoClick }: ContactsViewProps) {
    return (
        <InfoCard title="Emergency Contacts">
            {contacts && contacts.length > 0 ? (
                <div className="space-y-4">
                    {contacts.map((contact) => (
                        <div key={contact.id} className="rounded-lg border p-4">
                            <div className="flex items-start gap-3">
                                {contact.photo_url && (
                                    <div className="group relative">
                                        <img
                                            src={contact.photo_url}
                                            alt={contact.contact_name}
                                            className="size-20 cursor-pointer rounded-full border object-cover transition-opacity hover:opacity-80"
                                            onClick={() =>
                                                onPhotoClick({
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
                                <div className="space-y-2">
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
                                    </h4>
                                    <div className="grid gap-2 text-sm md:grid-cols-2">
                                        <div>
                                            <span className="text-muted-foreground">
                                                Relationship:
                                            </span>{' '}
                                            <span className="capitalize">
                                                {contact.relationship}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">
                                                Phone:
                                            </span>{' '}
                                            {contact.phone}
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
                                                Address:
                                            </span>{' '}
                                            {contact.address}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">
                    No contacts available
                </p>
            )}
        </InfoCard>
    );
}
