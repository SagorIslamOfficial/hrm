import {
    FormActions,
    SelectField,
    TextareaField,
    TextField,
} from '@/components/common';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { toast } from 'sonner';

interface CustomField {
    id: string;
    field_key: string;
    field_value: string;
    field_type: string;
    section: string;
    _isNew?: boolean;
    _isModified?: boolean;
    _isDeleted?: boolean;
}

const FIELD_TYPES = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'url', label: 'URL' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'select', label: 'Select' },
    { value: 'boolean', label: 'Boolean' },
];

const SECTIONS = [
    { value: 'personal', label: 'Personal' },
    { value: 'professional', label: 'Professional' },
    { value: 'other', label: 'Other' },
];

interface CustomFieldFormProps {
    customField?: CustomField;
    onSuccess: (customFieldData: CustomField) => void;
    onCancel: () => void;
    subjectLabel?: string;
}

export function CustomFieldForm({
    customField,
    onSuccess,
    onCancel,
    subjectLabel = '',
}: CustomFieldFormProps) {
    const [formData, setFormData] = useState({
        field_key: customField?.field_key || '',
        field_value: customField?.field_value || '',
        field_type: customField?.field_type || 'text',
        section: customField?.section || 'other',
    });
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const formatFieldKey = (value: string) => {
        return value
            .toLowerCase()
            .replace(/[^a-z0-9-_]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    };

    const handleFieldKeyChange = (value: string) => {
        const formatted = formatFieldKey(value);
        setFormData((prev) => ({
            ...prev,
            field_key: formatted,
        }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setErrors({});

        try {
            const validationErrors: Record<string, string> = {};
            if (!formData.field_key.trim()) {
                validationErrors.field_key = 'Field name is required';
            }
            if (!formData.field_type.trim()) {
                validationErrors.field_type = 'Field type is required';
            }

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }

            const stagedCustomField: CustomField = {
                id: customField?.id || `temp-${Date.now()}`,
                field_key: formData.field_key,
                field_value: formData.field_value,
                field_type: formData.field_type,
                section: formData.section,
                _isNew: !customField,
                _isModified: !!customField,
            };

            toast.success(
                customField
                    ? `Custom field changes staged - save ${subjectLabel.toLowerCase()} to apply`
                    : `Custom field staged - save ${subjectLabel.toLowerCase()} to apply`,
            );

            onSuccess(stagedCustomField);
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const renderValueInput = () => {
        switch (formData.field_type) {
            case 'textarea':
                return (
                    <TextareaField
                        id="field_value"
                        label="Value"
                        value={formData.field_value}
                        onChange={(value) =>
                            setFormData((prev) => ({
                                ...prev,
                                field_value: value,
                            }))
                        }
                        error={errors.field_value}
                        placeholder="Enter value"
                        rows={4}
                    />
                );
            case 'boolean':
                return (
                    <div className="space-y-2">
                        <Label htmlFor="field_value">Value</Label>
                        <Select
                            value={formData.field_value}
                            onValueChange={(value) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    field_value: value,
                                }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select value" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Yes</SelectItem>
                                <SelectItem value="false">No</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.field_value && (
                            <p className="text-sm text-destructive">
                                {errors.field_value}
                            </p>
                        )}
                    </div>
                );
            case 'date':
                return (
                    <div className="space-y-2">
                        <Label htmlFor="field_value">Value</Label>
                        <Input
                            id="field_value"
                            type="date"
                            value={formData.field_value}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    field_value: e.target.value,
                                }))
                            }
                        />
                        {errors.field_value && (
                            <p className="text-sm text-destructive">
                                {errors.field_value}
                            </p>
                        )}
                    </div>
                );
            case 'number':
                return (
                    <div className="space-y-2">
                        <Label htmlFor="field_value">Value</Label>
                        <Input
                            id="field_value"
                            type="number"
                            value={formData.field_value}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    field_value: e.target.value,
                                }))
                            }
                            placeholder="Enter number"
                        />
                        {errors.field_value && (
                            <p className="text-sm text-destructive">
                                {errors.field_value}
                            </p>
                        )}
                    </div>
                );
            case 'email':
                return (
                    <TextField
                        id="field_value"
                        label="Value"
                        type="email"
                        value={formData.field_value}
                        onChange={(value) =>
                            setFormData((prev) => ({
                                ...prev,
                                field_value: value,
                            }))
                        }
                        error={errors.field_value}
                        placeholder="email@example.com"
                    />
                );
            case 'phone':
                return (
                    <TextField
                        id="field_value"
                        label="Value"
                        type="tel"
                        value={formData.field_value}
                        onChange={(value) =>
                            setFormData((prev) => ({
                                ...prev,
                                field_value: value,
                            }))
                        }
                        error={errors.field_value}
                        placeholder="+1 (555) 000-0000"
                    />
                );
            case 'url':
                return (
                    <TextField
                        id="field_value"
                        label="Value"
                        type="url"
                        value={formData.field_value}
                        onChange={(value) =>
                            setFormData((prev) => ({
                                ...prev,
                                field_value: value,
                            }))
                        }
                        error={errors.field_value}
                        placeholder="https://example.com"
                    />
                );
            default:
                return (
                    <TextField
                        id="field_value"
                        label="Value"
                        type="text"
                        value={formData.field_value}
                        onChange={(value) =>
                            setFormData((prev) => ({
                                ...prev,
                                field_value: value,
                            }))
                        }
                        error={errors.field_value}
                        placeholder="Enter value"
                    />
                );
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="field_key">
                    Field Name <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="field_key"
                    value={formData.field_key}
                    onChange={(e) => handleFieldKeyChange(e.target.value)}
                    placeholder="e.g., shirt-size, parking-spot"
                />
                {errors.field_key && (
                    <p className="text-sm text-destructive">
                        {errors.field_key}
                    </p>
                )}
                <p className="text-xs text-muted-foreground">
                    Use lowercase letters, numbers, hyphens, and underscores
                </p>
            </div>

            <SelectField
                id="field_type"
                label="Field Type"
                value={formData.field_type}
                onChange={(value) =>
                    setFormData((prev) => ({
                        ...prev,
                        field_type: value,
                    }))
                }
                options={FIELD_TYPES}
                error={errors.field_type}
                placeholder="Select type"
                required
            />

            {renderValueInput()}

            <SelectField
                id="section"
                label="Section"
                value={formData.section}
                onChange={(value) =>
                    setFormData((prev) => ({
                        ...prev,
                        section: value,
                    }))
                }
                options={SECTIONS}
                error={errors.section}
                placeholder="Select section"
            />

            <FormActions
                type="dialog"
                onCancel={onCancel}
                onSubmit={handleSubmit}
                submitLabel={customField ? 'Update' : 'Add'}
                submitting={submitting}
            />
        </div>
    );
}
