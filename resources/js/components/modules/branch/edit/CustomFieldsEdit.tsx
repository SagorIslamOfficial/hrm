import {
    DataTableActions,
    DeleteDialog,
    EmptyActionState,
    InfoCard,
    ResourceDialog,
} from '@/components/common';
import { CustomFieldForm } from '@/components/common/CustomFieldForm';
import { EntityHeader, GetBorderClass } from '@/components/common/EntityHeader';
import { Button } from '@/components/ui/button';
import type { BranchCustomField } from '@/types/branch';
import { useState } from 'react';

interface CustomFieldsEditProps {
    customFields: BranchCustomField[];
    onCustomFieldAdd: (customFieldData: Partial<BranchCustomField>) => void;
    onCustomFieldEdit: (customFieldData: Partial<BranchCustomField>) => void;
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

    const openEditDialog = (customField: BranchCustomField) => {
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
        {} as Record<string, BranchCustomField[]>,
    );

    const sections = ['general', 'operational', 'technical', 'other'];

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
                                            const borderClass = GetBorderClass(
                                                field._isNew,
                                                field._isModified,
                                            );

                                            return (
                                                <div
                                                    key={field.id}
                                                    className={`relative rounded-lg ${borderClass} p-4`}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex-1">
                                                            <EntityHeader
                                                                name={formatFieldKey(
                                                                    field.field_key,
                                                                )}
                                                                badges={[
                                                                    {
                                                                        show: field._isNew,
                                                                        label: 'New',
                                                                        variant:
                                                                            'outline',
                                                                        className:
                                                                            'border-green-500 bg-green-100 text-green-800 hover:bg-green-200',
                                                                    },
                                                                    {
                                                                        show: field._isModified,
                                                                        label: 'Modified',
                                                                        variant:
                                                                            'outline',
                                                                        className:
                                                                            'border-yellow-500 bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
                                                                    },
                                                                ]}
                                                            />

                                                            <p className="text-sm text-muted-foreground">
                                                                {field.field_value ??
                                                                    'No value set'}
                                                            </p>
                                                        </div>

                                                        <div className="absolute top-1/2 right-4 flex -translate-y-1/2 gap-2">
                                                            <DataTableActions
                                                                item={{
                                                                    id: field.id,
                                                                    name: formatFieldKey(
                                                                        field.field_key,
                                                                    ),
                                                                }}
                                                                onEdit={() =>
                                                                    openEditDialog(
                                                                        field,
                                                                    )
                                                                }
                                                                onDelete={() =>
                                                                    setDeleteDialogOpen(
                                                                        field.id,
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
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <EmptyActionState
                        message="Add custom fields to track branch-specific information."
                        buttonText="Add Custom Field"
                    />
                )}
            </InfoCard>

            {/* Add Custom Field Dialog */}
            <ResourceDialog
                mode="add"
                open={isAddDialogOpen}
                resourceLabel="Custom Field"
                subjectLabel="branch"
            >
                <CustomFieldForm
                    onSuccess={(
                        customFieldData: Partial<BranchCustomField>,
                    ) => {
                        onCustomFieldAdd(customFieldData);
                        setIsAddDialogOpen(false);
                    }}
                    onCancel={() => setIsAddDialogOpen(false)}
                    subjectLabel="branch"
                />
            </ResourceDialog>

            {/* Edit Custom Field Dialog */}
            <ResourceDialog
                mode="edit"
                open={!!editDialogOpen}
                resourceLabel="Custom Field"
                subjectLabel="branch"
            >
                <CustomFieldForm
                    customField={
                        editDialogOpen
                            ? (customFields || []).find(
                                  (f) => f.id === editDialogOpen,
                              )
                            : undefined
                    }
                    onSuccess={(
                        customFieldData: Partial<BranchCustomField>,
                    ) => {
                        onCustomFieldEdit(customFieldData);
                        setEditDialogOpen(null);
                    }}
                    onCancel={() => setEditDialogOpen(null)}
                    subjectLabel="branch"
                />
            </ResourceDialog>

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
