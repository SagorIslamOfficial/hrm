import { FormActions, TabsNavigation } from '@/components/common';
import { useFormatError } from '@/components/common/utils/formatUtils';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useUrlTab } from '@/hooks';
import { update } from '@/routes/complaints';
import type {
    Branch,
    Complaint,
    ComplaintComment,
    ComplaintDocument,
    Department,
    Employee,
    PriorityOption,
} from '@/types/complaint';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import {
    BasicEdit,
    CommentsEdit,
    DocumentsEdit,
    ResolutionEdit,
    StatusActions,
    SubjectsEdit,
} from './edit';

interface Props {
    complaint: Complaint;
    employees: Employee[];
    departments?: Department[];
    branches?: Branch[];
    predefinedCategories?: string[];
    priorities?: PriorityOption[];
    assignees?: { value: string; label: string }[];
    subjectTypes?: { value: string; label: string }[];
    commentTypes?: { value: string; label: string }[];
    reminderTypes?: { value: string; label: string }[];
    className?: string;
}

export function ComplaintEditForm({
    complaint,
    employees,
    departments = [],
    branches = [],
    predefinedCategories = [],
    priorities = [],
    assignees = [],
    subjectTypes = [],
    commentTypes = [],
    reminderTypes = [],
    className,
}: Props) {
    const [activeTab, handleTabChange] = useUrlTab('basic');

    const { data, setData, post, processing, errors, reset } = useForm({
        _method: 'PUT',
        title: complaint.title,
        categories: complaint.categories || [],
        priority: complaint.priority,
        department_id: complaint.department_id || '',
        assigned_to: complaint.assigned_to || '',
        incident_date: complaint.incident_date || '',
        incident_location: complaint.incident_location || '',
        brief_description: complaint.brief_description,
        is_anonymous: complaint.is_anonymous,
        is_confidential: complaint.is_confidential,
        is_recurring: complaint.is_recurring || false,
        subjects: complaint.subjects || [],
        comments: complaint.comments || ([] as ComplaintComment[]),
        documents: complaint.documents || ([] as ComplaintDocument[]),
    });

    // Check if form has any changes
    const subjectsChanged = data.subjects.some(
        (s) => s._isNew || s._isModified || s._isDeleted,
    );
    const commentsChanged = data.comments.some(
        (c) => c._isNew || c._isModified || c._isDeleted,
    );
    const documentsChanged = data.documents.some(
        (d) => d._isNew || d._isModified || d._isDeleted,
    );

    const hasChanges =
        data.title !== (complaint.title || '') ||
        JSON.stringify(data.categories) !==
            JSON.stringify(complaint.categories || []) ||
        data.priority !== complaint.priority ||
        data.department_id !== (complaint.department_id || '') ||
        data.assigned_to !== (complaint.assigned_to || '') ||
        data.incident_date !== (complaint.incident_date || '') ||
        data.incident_location !== (complaint.incident_location || '') ||
        data.brief_description !== (complaint.brief_description || '') ||
        data.is_anonymous !== (complaint.is_anonymous || false) ||
        data.is_confidential !== (complaint.is_confidential || false) ||
        data.is_recurring !== (complaint.is_recurring || false) ||
        subjectsChanged ||
        commentsChanged ||
        documentsChanged;

    const isResolved = ['resolved', 'closed'].includes(complaint.status);
    const hasComments = complaint.comments && complaint.comments.length > 0;
    const hasDocuments = complaint.documents && complaint.documents.length > 0;

    const editTabs = [
        { value: 'basic', label: 'Basic' },
        { value: 'subjects', label: 'Subjects' },
        {
            value: 'comments',
            label: `Comments${hasComments ? ` (${complaint.comments!.length})` : ''}`,
        },
        {
            value: 'documents',
            label: `Documents${hasDocuments ? ` (${complaint.documents!.length})` : ''}`,
        },
        ...(isResolved ? [{ value: 'resolution', label: 'Resolution' }] : []),
    ];

    const { formatFieldName } = useFormatError();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Use post with _method: PUT for file uploads
        data._method = 'PUT';

        post(update(complaint.id).url, {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Complaint updated successfully');
            },
            onError: (errors) => {
                // Extract error messages from response
                const errorMessages: string[] = [];

                if (typeof errors === 'object' && errors !== null) {
                    Object.entries(errors).forEach(([fieldPath, value]) => {
                        const readableFieldName = formatFieldName(fieldPath);

                        if (Array.isArray(value)) {
                            value.forEach((msg) => {
                                // Replace field name in message if it exists
                                const formattedMsg = msg.replace(
                                    fieldPath,
                                    readableFieldName,
                                );
                                errorMessages.push(formattedMsg);
                            });
                        } else if (typeof value === 'string') {
                            const formattedMsg = value.replace(
                                fieldPath,
                                readableFieldName,
                            );
                            errorMessages.push(formattedMsg);
                        }
                    });
                }

                // Show errors in toast
                if (errorMessages.length > 0) {
                    errorMessages.forEach((message) => {
                        toast.error(message);
                    });
                } else {
                    toast.error('Failed to update complaint');
                }
            },
        });
    };

    const handleReset = () => {
        reset();
        toast.info('Form reset to original values');
    };

    return (
        <form onSubmit={handleSubmit} className={className}>
            <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="space-y-6"
            >
                <div className="flex items-center justify-between">
                    <TabsNavigation tabs={editTabs} />
                    <StatusActions
                        complaint={complaint}
                        employees={employees}
                        reminderTypes={reminderTypes}
                    />
                </div>

                <TabsContent value="basic" className="space-y-4">
                    <BasicEdit
                        data={{
                            title: data.title,
                            categories: data.categories,
                            priority: data.priority,
                            department_id: data.department_id,
                            assigned_to: data.assigned_to,
                            incident_date: data.incident_date,
                            incident_location: data.incident_location,
                            brief_description: data.brief_description,
                            is_anonymous: data.is_anonymous,
                            is_confidential: data.is_confidential,
                            is_recurring: data.is_recurring,
                        }}
                        errors={errors}
                        setData={(key: string, value: unknown) =>
                            setData(key as keyof typeof data, value as never)
                        }
                        predefinedCategories={predefinedCategories}
                        priorities={priorities}
                        assignees={assignees}
                    />
                </TabsContent>

                <TabsContent value="subjects" className="space-y-4">
                    <SubjectsEdit
                        subjects={data.subjects}
                        onSubjectsChange={(subjects) =>
                            setData('subjects', subjects)
                        }
                        employees={employees}
                        departments={departments}
                        branches={branches}
                        subjectTypes={subjectTypes}
                    />
                </TabsContent>

                <TabsContent value="comments" className="space-y-4">
                    <CommentsEdit
                        comments={data.comments}
                        onCommentsChange={(comments) =>
                            setData('comments', comments)
                        }
                        commentTypes={commentTypes}
                    />
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                    <DocumentsEdit
                        documents={data.documents}
                        onDocumentsChange={(documents) =>
                            setData('documents', documents)
                        }
                    />
                </TabsContent>

                {isResolved && (
                    <TabsContent value="resolution" className="space-y-4">
                        <ResolutionEdit
                            data={complaint.resolution || {}}
                            errors={errors}
                            setData={(key: string, value: unknown) =>
                                setData(
                                    key as keyof typeof data,
                                    value as never,
                                )
                            }
                        />
                    </TabsContent>
                )}
            </Tabs>

            <FormActions
                onReset={handleReset}
                submitLabel="Update"
                processing={processing}
                disabled={!hasChanges}
            />
        </form>
    );
}
