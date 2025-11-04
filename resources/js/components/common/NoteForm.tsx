import { FormActions, FormField } from '@/components/common';
import type { Note } from '@/components/common/interfaces';
import { useState } from 'react';
import { toast } from 'sonner';

const NOTE_CATEGORIES = [
    { value: 'general', label: 'General' },
    { value: 'performance', label: 'Performance' },
    { value: 'disciplinary', label: 'Disciplinary' },
    { value: 'achievement', label: 'Achievement' },
    { value: 'other', label: 'Other' },
];

interface NoteFormProps {
    note?: Note;
    currentUser?: {
        id: string;
        name?: string;
    };
    onSuccess: (noteData: Note) => void;
    onCancel: () => void;
    subjectLabel?: string;
    supportsPrivacy?: boolean;
}

export function NoteForm({
    note,
    currentUser,
    onSuccess,
    onCancel,
    subjectLabel = '',
    supportsPrivacy = true,
}: NoteFormProps) {
    const [formData, setFormData] = useState({
        title: note?.title || '',
        note: note?.note || '',
        category: note?.category || 'general',
        is_private: note?.is_private || false,
    });
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async () => {
        setSubmitting(true);
        setErrors({});

        try {
            const validationErrors: Record<string, string> = {};
            if (!formData.title.trim()) {
                validationErrors.title = 'Title is required';
            }
            if (!formData.note.trim()) {
                validationErrors.note = 'Note content is required';
            }
            if (!formData.category.trim()) {
                validationErrors.category = 'Category is required';
            }

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }

            const stagedNote: Note = {
                id: note?.id || `temp-${Date.now()}`,
                title: formData.title,
                note: formData.note,
                category: formData.category,
                is_private: formData.is_private,
                created_at: note?.created_at || new Date().toISOString(),
                creator: note?.creator || {
                    name: currentUser?.name,
                },
                _isNew: !note,
                _isModified: !!note,
            };

            toast.success(
                note
                    ? `Note changes staged - save ${subjectLabel.toLowerCase()} to apply`
                    : `Note staged - save ${subjectLabel.toLowerCase()} to apply`,
            );

            onSuccess(stagedNote);
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            <FormField
                type="text"
                id="title"
                label="Title"
                value={formData.title}
                onChange={(value: string) =>
                    setFormData((prev) => ({
                        ...prev,
                        title: value,
                    }))
                }
                error={errors.title}
                placeholder="Brief title for this note"
            />

            <FormField
                type="textarea"
                id="note"
                label="Note"
                value={formData.note}
                onChange={(value: string) =>
                    setFormData((prev) => ({
                        ...prev,
                        note: value,
                    }))
                }
                error={errors.note}
                placeholder="Enter your note here..."
                required
                rows={5}
            />

            <div
                className={`grid gap-4 ${supportsPrivacy ? 'grid-cols-2' : 'grid-cols-1'}`}
            >
                <FormField
                    type="select"
                    id="category"
                    label="Category"
                    value={formData.category}
                    onChange={(value: string) =>
                        setFormData((prev) => ({
                            ...prev,
                            category: value,
                        }))
                    }
                    options={NOTE_CATEGORIES}
                    error={errors.category}
                    placeholder="Select category"
                    required
                />

                {supportsPrivacy && (
                    <FormField
                        type="checkbox"
                        id="is_private"
                        label="Private Note"
                        value={formData.is_private}
                        onChange={(checked: boolean) =>
                            setFormData((prev) => ({
                                ...prev,
                                is_private: checked,
                            }))
                        }
                        helperText="Private notes are only visible to you"
                    />
                )}
            </div>

            <FormActions
                type="dialog"
                onCancel={onCancel}
                onSubmit={handleSubmit}
                submitLabel={note ? 'Update' : 'Add'}
                submitting={submitting}
            />
        </div>
    );
}
