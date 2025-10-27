import { CustomFieldDialog, DeleteDialog, InfoCard } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SquarePen, Trash2 } from 'lucide-react';
import { useState } from 'react';

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

interface CustomFieldsEditProps {
    customFields: CustomField[];
    onCustomFieldAdd: (customFieldData: CustomField) => void;
    onCustomFieldEdit: (customFieldData: CustomField) => void;
    onCustomFieldDelete: (customFieldId: string) => void;
}

export function CustomFieldsEdit({
    customFields,
    onCustomFieldAdd,
    onCustomFieldEdit,
    onCustomFieldDelete,
}: CustomFieldsEditProps) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(
        null,
    );

    const handleDelete = (customFieldId: string) => {
        onCustomFieldDelete(customFieldId);
        setDeleteDialogOpen(null);
    };

    const openEditDialog = (customField: CustomField) => {
        setEditDialogOpen(customField.id);
    };

    const formatFieldKey = (fieldKey: string) => {
        return fieldKey
            .split(/[-_]/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const formatSection = (section: string) => {
        return section.charAt(0).toUpperCase() + section.slice(1);
    };

    const activeFields = (customFields || []).filter(
        (field) => !field._isDeleted,
    );

    const groupedFields = activeFields.reduce(
        (acc, field) => {
            const section = field.section || 'other';
            if (!acc[section]) {
                acc[section] = [];
            }
            acc[section].push(field);
            return acc;
        },
        {} as Record<string, CustomField[]>,
    );

    const sections = ['personal', 'professional', 'other'];

    return (
        <>
            <InfoCard
                title="Custom Fields"
                action={
                    <Button
                        type="button"
                        variant="secondary"
                        className="cursor-pointer border-2 border-blue-700"
                        onClick={() => setIsAddDialogOpen(true)}
                    >
                        Add Field
                    </Button>
                }
            >
                {(customFields || []).length > 0 ? (
                    <div className="space-y-6">
                        {sections.map((section) => {
                            const fields = groupedFields[section] || [];
                            if (fields.length === 0) return null;

                            return (
                                <div key={section}>
                                    <h4 className="mb-3 text-sm font-semibold text-muted-foreground">
                                        {formatSection(section)}
                                    </h4>
                                    <div className="space-y-3">
                                        {fields.map((field) => {
                                            let borderClass = 'border';
                                            if (field._isNew) {
                                                borderClass =
                                                    'border-2 border-green-500';
                                            } else if (field._isModified) {
                                                borderClass =
                                                    'border-2 border-yellow-500';
                                            }

                                            return (
                                                <div
                                                    key={field.id}
                                                    className={`relative rounded-lg ${borderClass} p-4`}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex-1">
                                                            <div className="mb-1 flex items-center gap-2">
                                                                <h5 className="font-medium">
                                                                    {formatFieldKey(
                                                                        field.field_key,
                                                                    )}
                                                                </h5>
                                                                <Badge variant="secondary">
                                                                    {
                                                                        field.field_type
                                                                    }
                                                                </Badge>
                                                                {field._isNew && (
                                                                    <Badge
                                                                        className="border-green-500 bg-green-100 text-green-800 hover:bg-green-200"
                                                                        variant="outline"
                                                                    >
                                                                        New
                                                                    </Badge>
                                                                )}
                                                                {field._isModified && (
                                                                    <Badge
                                                                        className="border-yellow-500 bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                                                        variant="outline"
                                                                    >
                                                                        Modified
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">
                                                                {field.field_value ||
                                                                    'No value set'}
                                                            </p>
                                                        </div>
                                                        <div className="absolute top-1/2 right-4 flex -translate-y-1/2 gap-2">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                className="cursor-pointer"
                                                                onClick={() =>
                                                                    openEditDialog(
                                                                        field,
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
                                                                    setDeleteDialogOpen(
                                                                        field.id,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <p className="mb-4 text-sm text-muted-foreground">
                            Add custom fields to track employee information.
                        </p>
                        <Button
                            type="button"
                            variant="secondary"
                            className="border"
                            disabled
                        >
                            Add Field
                        </Button>
                    </div>
                )}
            </InfoCard>

            {/* Add Custom Field Dialog */}
            <CustomFieldDialog
                mode="add"
                open={isAddDialogOpen}
                onSuccess={(customFieldData: CustomField) => {
                    onCustomFieldAdd(customFieldData);
                    setIsAddDialogOpen(false);
                }}
                onCancel={() => setIsAddDialogOpen(false)}
                resourceLabel="Custom Field"
                subjectLabel="employee"
            />

            {/* Edit Custom Field Dialog */}
            <CustomFieldDialog
                mode="edit"
                open={!!editDialogOpen}
                customField={
                    editDialogOpen
                        ? (customFields || []).find(
                              (f) => f.id === editDialogOpen,
                          )
                        : undefined
                }
                onSuccess={(customFieldData: CustomField) => {
                    onCustomFieldEdit(customFieldData);
                    setEditDialogOpen(null);
                }}
                onCancel={() => setEditDialogOpen(null)}
                resourceLabel="Custom Field"
                subjectLabel="employee"
            />

            {/* Delete Custom Field Dialog */}
            <DeleteDialog
                open={!!deleteDialogOpen}
                onOpenChange={(open) => {
                    if (!open) setDeleteDialogOpen(null);
                }}
                onConfirm={() => {
                    if (deleteDialogOpen) {
                        handleDelete(deleteDialogOpen);
                    }
                }}
                title="Delete Custom Field"
                description="Are you sure you want to delete this custom field? This action cannot be undone."
                confirmLabel="Delete Field"
            />
        </>
    );
}
