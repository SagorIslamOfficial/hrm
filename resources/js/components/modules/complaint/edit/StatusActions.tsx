import { useFormatError } from '@/components/common/utils/formatUtils';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Complaint, ComplaintStatus } from '@/types/complaint';
import { router } from '@inertiajs/react';
import {
    CheckCircle,
    ClipboardCheck,
    Clock,
    MoreVertical,
    ShieldAlert,
    XCircle,
} from 'lucide-react';
import { toast } from 'sonner';

import { Employee } from '@/types/complaint';
import { useState } from 'react';
import { EscalationModal } from '../modals/EscalationModal';
import { ReminderModal } from '../modals/ReminderModal';
import { ResolutionModal } from '../modals/ResolutionModal';

interface Props {
    complaint: Complaint;
    employees: Employee[];
    reminderTypes?: { value: string; label: string }[];
    className?: string;
}

export function StatusActions({
    complaint,
    employees,
    reminderTypes = [],
    className,
}: Props) {
    const status = complaint.status as ComplaintStatus;
    const [showEscalationModal, setShowEscalationModal] = useState(false);
    const [showReminderModal, setShowReminderModal] = useState(false);
    const [showResolutionModal, setShowResolutionModal] = useState(false);
    const { formatFieldName } = useFormatError();

    const updateStatus = (newStatus: string) => {
        router.post(
            `/dashboard/hr/organization/complaints/${complaint.id}/status`,
            {
                status: newStatus,
                _method: 'POST',
            },
            {
                onSuccess: () => {
                    toast.success('Complaint status updated successfully');
                },
                onError: (errors) => {
                    // Extract error messages from response
                    const errorMessages: string[] = [];

                    if (typeof errors === 'object' && errors !== null) {
                        Object.entries(errors).forEach(([fieldPath, value]) => {
                            const readableFieldName =
                                formatFieldName(fieldPath);

                            if (Array.isArray(value)) {
                                value.forEach((msg) => {
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
                        toast.error('Failed to update complaint status');
                    }
                },
            },
        );
    };

    if (status === 'draft') return null;

    return (
        <>
            <div className={`flex items-center gap-2 ${className}`}>
                {/* Workflow Transitions */}
                {status === 'submitted' && (
                    <>
                        <Button
                            type="button"
                            onClick={() => updateStatus('acknowledged')}
                            variant="secondary"
                            className="gap-2"
                        >
                            <ClipboardCheck className="h-4 w-4" />
                            Acknowledge
                        </Button>
                        <Button
                            type="button"
                            onClick={() => updateStatus('investigating')}
                            variant="outline"
                            className="gap-2"
                        >
                            <Clock className="h-4 w-4" />
                            Start Investigation
                        </Button>
                    </>
                )}

                {status === 'acknowledged' && (
                    <Button
                        type="button"
                        onClick={() => updateStatus('investigating')}
                        variant="outline"
                        className="gap-2"
                    >
                        <Clock className="h-4 w-4" />
                        Start Investigation
                    </Button>
                )}

                {(status === 'investigating' ||
                    status === 'under_review' ||
                    status === 'escalated') && (
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            onClick={() => setShowResolutionModal(true)}
                            className="gap-2 bg-green-600 hover:bg-green-700"
                        >
                            <CheckCircle className="h-4 w-4" />
                            Resolve
                        </Button>
                    </div>
                )}

                {status === 'resolved' && (
                    <Button
                        type="button"
                        onClick={() => updateStatus('closed')}
                        variant="outline"
                        className="gap-2"
                    >
                        <XCircle className="h-4 w-4" />
                        Close Complaint
                    </Button>
                )}

                {/* Additional Actions Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button type="button" variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => setShowReminderModal(true)}
                        >
                            <Clock className="mr-2 h-4 w-4" />
                            Set Reminder
                        </DropdownMenuItem>

                        {/* Escalation is valid for most active states */}
                        {[
                            'submitted',
                            'submitted',
                            'acknowledged',
                            'investigating',
                            'under_review',
                        ].includes(status) && (
                            <DropdownMenuItem
                                onClick={() => setShowEscalationModal(true)}
                                className="text-orange-600 focus:text-orange-700"
                            >
                                <ShieldAlert className="mr-2 h-4 w-4" />
                                Escalate
                            </DropdownMenuItem>
                        )}

                        {/* Re-open if closed/resolved */}
                        {['resolved', 'closed'].includes(status) && (
                            <DropdownMenuItem
                                onClick={() => updateStatus('investigating')}
                            >
                                <Clock className="mr-2 h-4 w-4" />
                                Re-open Investigation
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <EscalationModal
                complaintId={complaint.id}
                employees={employees}
                open={showEscalationModal}
                onOpenChange={setShowEscalationModal}
            />

            <ReminderModal
                complaintId={complaint.id}
                open={showReminderModal}
                onOpenChange={setShowReminderModal}
                reminderTypes={reminderTypes}
            />

            <ResolutionModal
                complaintId={complaint.id}
                open={showResolutionModal}
                onOpenChange={setShowResolutionModal}
            />
        </>
    );
}
