import { FormActions, FormField } from '@/components/common';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

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

// Contact Form Component
interface ContactFormProps {
    contact?: Contact;
    onSuccess: (contactData: Contact) => void;
    onCancel: () => void;
    resourceLabel?: string;
    subjectLabel?: string;
}

export function ContactForm({
    contact,
    onSuccess,
    onCancel,
    resourceLabel = '',
    subjectLabel = '',
}: ContactFormProps) {
    const [formData, setFormData] = useState({
        contact_name: contact?.contact_name || '',
        relationship: contact?.relationship || '',
        phone: contact?.phone || '',
        email: contact?.email || '',
        address: contact?.address || '',
        is_primary: contact?.is_primary || false,
    });
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(
        contact?.photo_url || null,
    );
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const photoInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async () => {
        setSubmitting(true);
        setErrors({});

        try {
            // Basic validation
            const validationErrors: Record<string, string> = {};
            if (!formData.contact_name.trim()) {
                validationErrors.contact_name = 'Contact name is required';
            }
            if (!formData.relationship.trim()) {
                validationErrors.relationship = 'Relationship is required';
            }
            if (!formData.phone.trim()) {
                validationErrors.phone = 'Phone number is required';
            }

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }

            // Create staged contact data (no API call yet)
            const stagedContact: Contact = {
                id: contact?.id || `temp_${Date.now()}`, // Temporary ID for new contacts
                contact_name: formData.contact_name,
                relationship: formData.relationship,
                phone: formData.phone,
                email: formData.email || '',
                address: formData.address || '',
                is_primary: formData.is_primary,
                photo: photo ? photo.name : contact?.photo || '',
                photo_url: photoPreview || contact?.photo_url || '',
                created_at: contact?.created_at || new Date().toISOString(),
                updated_at: new Date().toISOString(),
                // Store the photo file for later upload
                _photoFile: photo || undefined,
                _isNew: !contact,
                _isModified: !!contact,
            };

            toast.success(
                contact
                    ? `Contact changes staged - save ${subjectLabel.toLowerCase()} to apply`
                    : `Contact staged - save ${subjectLabel.toLowerCase()} to apply`,
            );

            onSuccess(stagedContact);
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handlePhotoChange = (file: File | null) => {
        if (!file) {
            setPhoto(null);
            setPhotoPreview(contact?.photo_url || null);
            if (photoInputRef.current) photoInputRef.current.value = '';
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Photo must not exceed 2MB in size.');
            if (photoInputRef.current) photoInputRef.current.value = '';
            return;
        }

        // Validate image dimensions
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(objectUrl);

            // Check dimensions (100x100 to 1000x1000)
            if (
                img.width < 100 ||
                img.height < 100 ||
                img.width > 1000 ||
                img.height > 1000
            ) {
                toast.error(
                    'Photo must be between 100x100 and 1000x1000 pixels.',
                );
                if (photoInputRef.current) photoInputRef.current.value = '';
                return;
            }

            // Validation passed - set the photo
            setPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            toast.error('Invalid image file.');
            if (photoInputRef.current) photoInputRef.current.value = '';
        };

        img.src = objectUrl;
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    type="text"
                    id="contact_name"
                    label="Contact Name"
                    value={formData.contact_name}
                    onChange={(value: string) =>
                        setFormData((prev) => ({
                            ...prev,
                            contact_name: value,
                        }))
                    }
                    error={errors.contact_name}
                    placeholder="e.g., Uzzal Islam"
                    required
                />
                <FormField
                    type="select"
                    id="relationship"
                    label="Relationship"
                    value={formData.relationship}
                    onChange={(value: string) =>
                        setFormData((prev) => ({
                            ...prev,
                            relationship: value,
                        }))
                    }
                    options={[
                        { value: 'spouse', label: 'Spouse' },
                        { value: 'parent', label: 'Parent' },
                        { value: 'child', label: 'Child' },
                        { value: 'sibling', label: 'Sibling' },
                        { value: 'relative', label: 'Relative' },
                        { value: 'friend', label: 'Friend' },
                        { value: 'colleague', label: 'Colleague' },
                        { value: 'other', label: 'Other' },
                    ]}
                    error={errors.relationship}
                    placeholder="Select relationship"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    type="tel"
                    id="phone"
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(value: string) =>
                        setFormData((prev) => ({
                            ...prev,
                            phone: value,
                        }))
                    }
                    error={errors.phone}
                    placeholder="e.g., +8801933126160"
                    required
                />
                <FormField
                    type="email"
                    id="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={(value: string) =>
                        setFormData((prev) => ({
                            ...prev,
                            email: value,
                        }))
                    }
                    error={errors.email}
                    placeholder="e.g., uzzal@sagorislam.dev"
                />
            </div>

            <FormField
                type="textarea"
                id="address"
                label="Address"
                value={formData.address}
                onChange={(value: string) =>
                    setFormData((prev) => ({
                        ...prev,
                        address: value,
                    }))
                }
                error={errors.address}
                placeholder="e.g., 123 Main Street, Apt 4B, City, State, ZIP"
                rows={3}
            />

            <div>
                <FormField
                    type="file"
                    id="photo"
                    label={`${resourceLabel} Photo`}
                    value={photo?.name || null}
                    onChange={handlePhotoChange}
                    accept="image/*"
                    previewUrl={photoPreview || undefined}
                    error={errors.photo}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                    Upload a photo of the {resourceLabel.toLowerCase()} (max
                    2MB, 100x100 to 1000x1000 pixels)
                </p>
            </div>

            <FormField
                type="checkbox"
                id="is_primary"
                label={`Primary ${resourceLabel.toLowerCase()}`}
                value={formData.is_primary}
                onChange={(value: boolean) =>
                    setFormData((prev) => ({
                        ...prev,
                        is_primary: value,
                    }))
                }
            />

            <FormActions
                type="dialog"
                onCancel={onCancel}
                onSubmit={handleSubmit}
                submitLabel={contact ? 'Update' : 'Add'}
                submitting={submitting}
            />
        </div>
    );
}
