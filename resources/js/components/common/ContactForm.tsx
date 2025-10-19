import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
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

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePhotoRemove = () => {
        setPhoto(null);
        setPhotoPreview(contact?.photo_url || null);
        if (photoInputRef.current) {
            photoInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="contact_name">Contact Name *</Label>
                    <Input
                        id="contact_name"
                        value={formData.contact_name}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                contact_name: e.target.value,
                            }))
                        }
                        className={
                            errors.contact_name ? 'border-destruction' : ''
                        }
                        placeholder="e.g., Uzzal Islam"
                    />
                    {errors.contact_name && (
                        <p className="text-destruction mt-1 text-sm">
                            {errors.contact_name}
                        </p>
                    )}
                </div>
                <div>
                    <Label htmlFor="relationship">Relationship *</Label>
                    <Select
                        value={formData.relationship}
                        onValueChange={(value) =>
                            setFormData((prev) => ({
                                ...prev,
                                relationship: value,
                            }))
                        }
                    >
                        <SelectTrigger
                            className={
                                errors.relationship ? 'border-destruction' : ''
                            }
                        >
                            <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="spouse">Spouse</SelectItem>
                            <SelectItem value="parent">Parent</SelectItem>
                            <SelectItem value="child">Child</SelectItem>
                            <SelectItem value="sibling">Sibling</SelectItem>
                            <SelectItem value="relative">Relative</SelectItem>
                            <SelectItem value="friend">Friend</SelectItem>
                            <SelectItem value="colleague">Colleague</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.relationship && (
                        <p className="text-destruction mt-1 text-sm">
                            {errors.relationship}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                phone: e.target.value,
                            }))
                        }
                        className={errors.phone ? 'border-destruction' : ''}
                        placeholder="e.g., +8801933126160"
                    />
                    {errors.phone && (
                        <p className="text-destruction mt-1 text-sm">
                            {errors.phone}
                        </p>
                    )}
                </div>
                <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                email: e.target.value,
                            }))
                        }
                        className={errors.email ? 'border-destruction' : ''}
                        placeholder="e.g., uzzal@sagorislam.dev"
                    />
                    {errors.email && (
                        <p className="text-destruction mt-1 text-sm">
                            {errors.email}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            address: e.target.value,
                        }))
                    }
                    className={errors.address ? 'border-destruction' : ''}
                    rows={3}
                    placeholder="e.g., 123 Main Street, Apt 4B, City, State, ZIP"
                />
                {errors.address && (
                    <p className="text-destruction mt-1 text-sm">
                        {errors.address}
                    </p>
                )}
            </div>

            <div>
                <Label htmlFor="photo">{resourceLabel} Photo</Label>
                <div className="space-y-4">
                    {photoPreview && (
                        <div className="flex items-center gap-4">
                            <img
                                src={photoPreview}
                                alt="Contact preview"
                                className="size-16 rounded-full"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handlePhotoRemove}
                            >
                                Remove Photo
                            </Button>
                        </div>
                    )}
                    <Input
                        ref={photoInputRef}
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className={errors.photo ? 'border-destruction' : ''}
                    />
                    <p className="text-xs text-muted-foreground">
                        Upload a photo of the {resourceLabel.toLowerCase()} (max
                        2MB, 100x100 to 1000x1000 pixels)
                    </p>
                    {errors.photo && (
                        <p className="text-destruction text-sm">
                            {errors.photo}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="is_primary"
                    checked={formData.is_primary}
                    onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                            ...prev,
                            is_primary: !!checked,
                        }))
                    }
                />
                <Label htmlFor="is_primary">
                    Primary {resourceLabel.toLowerCase()}
                </Label>
            </div>

            <div className="flex justify-end gap-2 border-t pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={submitting}
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting
                        ? 'Saving...'
                        : contact
                          ? 'Update Contact'
                          : 'Add Contact'}
                </Button>
            </div>
        </div>
    );
}
