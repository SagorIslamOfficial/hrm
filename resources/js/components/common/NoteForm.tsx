import { FormActions, SelectField, TextareaField } from '@/components/common';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { toast } from 'sonner';

interface Note {
    id: string;
    note: string;
    category: string;
    is_private: boolean;
    created_at: string;
    creator?: {
        name?: string;
    };
    updated_at?: string;
    updater?: {
        name?: string;
    };
    _isNew?: boolean;
    _isModified?: boolean;
    _isDeleted?: boolean;
}

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
}

export function NoteForm({
    note,
    currentUser,
    onSuccess,
    onCancel,
    subjectLabel = '',
}: NoteFormProps) {
    const [formData, setFormData] = useState({
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
            <TextareaField
                id="note"
                label="Note"
                value={formData.note}
                onChange={(value) =>
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

            <div className="grid grid-cols-2 gap-4">
                <SelectField
                    id="category"
                    label="Category"
                    value={formData.category}
                    onChange={(value) =>
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

                <div className="flex items-center justify-between pt-5">
                    <Label htmlFor="is_private">Private Note</Label>
                    <Switch
                        id="is_private"
                        checked={formData.is_private}
                        onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                                ...prev,
                                is_private: checked,
                            }))
                        }
                    />
                </div>
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
