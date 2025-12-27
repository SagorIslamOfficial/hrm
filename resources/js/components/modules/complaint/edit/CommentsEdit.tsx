import {
    DataTableActions,
    EmptyActionState,
    FormActions,
    FormField,
    InfoCard,
    ResourceDialog,
} from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { ComplaintComment } from '@/types/complaint';
import { usePage } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface CommentsEditProps {
    comments: ComplaintComment[];
    onCommentsChange: (comments: ComplaintComment[]) => void;
    commentTypes?: { value: string; label: string }[];
}

interface PageProps extends Record<string, unknown> {
    auth: {
        user: {
            id: string;
            name: string;
            email: string;
        };
    };
}

export default function CommentsEdit({
    comments,
    onCommentsChange,
    commentTypes = [],
}: CommentsEditProps) {
    const { auth } = usePage<PageProps>().props;
    const currentUserId = auth.user.id;

    const [dialogMode, setDialogMode] = useState<'add' | 'edit' | null>(null);
    const [selectedComment, setSelectedComment] =
        useState<ComplaintComment | null>(null);
    const [formData, setFormData] = useState({
        comment: '',
        comment_type: 'internal' as ComplaintComment['comment_type'],
        is_private: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const openAddDialog = () => {
        resetForm();
        setDialogMode('add');
    };

    const openEditDialog = (comment: ComplaintComment) => {
        setSelectedComment(comment);
        setFormData({
            comment: comment.comment,
            comment_type: comment.comment_type,
            is_private: comment.is_private,
        });
        setDialogMode('edit');
    };

    const closeDialog = () => {
        setDialogMode(null);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            comment: '',
            comment_type: 'internal',
            is_private: false,
        });
        setSelectedComment(null);
        setErrors({});
    };

    const handleSubmit = () => {
        if (!formData.comment.trim()) {
            setErrors({ comment: 'Comment is required' });
            return;
        }

        const updatedComments = [...comments];

        if (dialogMode === 'add') {
            // Create new staged comment
            const newComment: ComplaintComment = {
                id: `temp-${Date.now()}`,
                complaint_id: '',
                comment: formData.comment.trim(),
                comment_type: formData.comment_type,
                is_private: formData.is_private,
                created_by: currentUserId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                _isNew: true,
            };
            updatedComments.unshift(newComment);
            toast.success('Comment staged');
        } else if (dialogMode === 'edit' && selectedComment) {
            // Update existing comment
            const index = updatedComments.findIndex(
                (c) => c.id === selectedComment.id,
            );
            if (index !== -1) {
                updatedComments[index] = {
                    ...selectedComment,
                    comment: formData.comment.trim(),
                    comment_type: formData.comment_type,
                    is_private: formData.is_private,
                    updated_at: new Date().toISOString(),
                    _isModified: !selectedComment._isNew,
                    _isNew: selectedComment._isNew,
                };
                toast.success('Comment updated');
            }
        }

        onCommentsChange(updatedComments);
        closeDialog();
    };

    const handleDelete = (comment: ComplaintComment) => {
        if (comment._isNew) {
            // Remove staged comments entirely
            onCommentsChange(comments.filter((c) => c.id !== comment.id));
            toast.success('Comment removed');
        } else {
            // Mark saved comments as deleted
            const updated = comments.map((c) =>
                c.id === comment.id ? { ...c, _isDeleted: true } : c,
            );
            onCommentsChange(updated);
            toast.success('Comment marked for deletion');
        }
    };

    // Filter comments
    const visibleComments = comments.filter((c) => !c._isDeleted);
    const stagedComments = visibleComments.filter((c) => c._isNew);
    const savedComments = visibleComments.filter((c) => !c._isNew);

    return (
        <>
            <InfoCard
                title="Comments"
                action={
                    <Button
                        type="button"
                        variant="secondary"
                        className="cursor-pointer border-2 border-blue-700"
                        onClick={openAddDialog}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Comment
                    </Button>
                }
            >
                {/* Staged Comments */}
                {stagedComments.length > 0 && (
                    <div className="mb-6 space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">
                            Pending Comments ({stagedComments.length})
                        </h4>
                        <div className="space-y-2">
                            {stagedComments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-900/20"
                                >
                                    <div className="flex min-w-0 flex-1 items-center gap-3">
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                                <Badge
                                                    variant="outline"
                                                    className="h-5 flex-shrink-0 border-green-500/30 bg-green-500/10 text-[10px] text-green-600"
                                                >
                                                    New
                                                </Badge>
                                                <Badge
                                                    variant="secondary"
                                                    className="h-5 flex-shrink-0 text-[10px]"
                                                >
                                                    {comment.comment_type}
                                                </Badge>
                                                {comment.is_private && (
                                                    <Badge
                                                        variant="destructive"
                                                        className="h-5 flex-shrink-0 text-[10px]"
                                                    >
                                                        Private
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                                {comment.comment}
                                            </p>
                                        </div>
                                    </div>
                                    <DataTableActions
                                        item={comment}
                                        onEdit={() => openEditDialog(comment)}
                                        onDelete={() => handleDelete(comment)}
                                        showView={false}
                                        editLabel="Edit comment"
                                        deleteLabel="Remove comment"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Saved Comments */}
                {savedComments.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">
                            History ({savedComments.length})
                        </h4>
                        <div className="space-y-2">
                            {savedComments.map((comment) => {
                                const canModify =
                                    comment.created_by === currentUserId;
                                const isModified = comment._isModified;

                                return (
                                    <div
                                        key={comment.id}
                                        className={`flex items-center justify-between rounded-lg border p-4 ${
                                            isModified
                                                ? 'border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20'
                                                : ''
                                        }`}
                                    >
                                        <div className="flex min-w-0 flex-1 items-center gap-3">
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                                    {comment.creator?.name && (
                                                        <span className="flex-shrink-0 text-sm font-medium">
                                                            {
                                                                comment.creator
                                                                    .name
                                                            }
                                                        </span>
                                                    )}
                                                    {isModified && (
                                                        <Badge
                                                            variant="outline"
                                                            className="h-5 flex-shrink-0 border-amber-500/30 bg-amber-500/10 text-[10px] text-amber-600"
                                                        >
                                                            Modified
                                                        </Badge>
                                                    )}
                                                    <Badge
                                                        variant="secondary"
                                                        className="h-5 flex-shrink-0 text-[10px]"
                                                    >
                                                        {comment.comment_type}
                                                    </Badge>
                                                    {comment.is_private && (
                                                        <Badge
                                                            variant="destructive"
                                                            className="h-5 flex-shrink-0 text-[10px]"
                                                        >
                                                            Private
                                                        </Badge>
                                                    )}
                                                    <span className="flex-shrink-0 text-xs text-muted-foreground">
                                                        Created{' '}
                                                        {formatDistanceToNow(
                                                            new Date(
                                                                comment.created_at,
                                                            ),
                                                            { addSuffix: true },
                                                        )}
                                                    </span>
                                                    {comment.updated_at &&
                                                        comment.updated_at !==
                                                            comment.created_at && (
                                                            <>
                                                                <span>•</span>
                                                                <span className="flex-shrink-0 text-xs text-muted-foreground">
                                                                    Updated{' '}
                                                                    {formatDistanceToNow(
                                                                        new Date(
                                                                            comment.updated_at,
                                                                        ),
                                                                        {
                                                                            addSuffix: true,
                                                                        },
                                                                    )}
                                                                </span>
                                                            </>
                                                        )}
                                                </div>
                                                <p className="text-sm whitespace-pre-wrap">
                                                    {comment.comment}
                                                </p>
                                            </div>
                                        </div>
                                        {canModify && (
                                            <div className="ml-4 flex-shrink-0">
                                                <DataTableActions
                                                    item={comment}
                                                    onEdit={() =>
                                                        openEditDialog(comment)
                                                    }
                                                    onDelete={() =>
                                                        handleDelete(comment)
                                                    }
                                                    showView={false}
                                                    editLabel="Edit comment"
                                                    deleteLabel="Delete comment"
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {visibleComments.length === 0 && (
                    <EmptyActionState
                        message="No comments added"
                        buttonText="Add Comment"
                        onButtonClick={openAddDialog}
                    />
                )}
            </InfoCard>

            {/* Add/Edit Dialog */}
            <ResourceDialog
                mode={dialogMode === 'add' ? 'add' : 'edit'}
                open={dialogMode === 'add' || dialogMode === 'edit'}
                resourceLabel="Comment"
                subjectLabel="complaint"
            >
                <div className="space-y-4">
                    <FormField
                        type="textarea"
                        id="comment"
                        label="Comment"
                        value={formData.comment}
                        onChange={(value: string) =>
                            setFormData((prev) => ({
                                ...prev,
                                comment: value,
                            }))
                        }
                        error={errors.comment}
                        placeholder="Write your comment..."
                        rows={4}
                        required
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="comment_type" className="text-sm">
                                Comment Type
                            </Label>
                            <Select
                                value={formData.comment_type}
                                onValueChange={(
                                    value: ComplaintComment['comment_type'],
                                ) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        comment_type: value,
                                    }))
                                }
                            >
                                <SelectTrigger id="comment_type">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {commentTypes.map((type) => (
                                        <SelectItem
                                            key={type.value}
                                            value={type.value}
                                        >
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="mt-6 flex items-center gap-2">
                            <Checkbox
                                id="is_private"
                                checked={formData.is_private}
                                onCheckedChange={(checked) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        is_private: checked === true,
                                    }))
                                }
                            />
                            <Label
                                htmlFor="is_private"
                                className="text-sm font-normal"
                            >
                                Private
                            </Label>
                        </div>
                    </div>

                    <FormActions
                        type="dialog"
                        onCancel={closeDialog}
                        onSubmit={handleSubmit}
                        submitLabel={dialogMode === 'add' ? 'Add' : 'Update'}
                    />
                </div>
            </ResourceDialog>
        </>
    );
}
