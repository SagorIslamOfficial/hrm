import type { ComplaintPriority, ComplaintStatus } from '@/types/complaint';

export function getPriorityLabel(priority: ComplaintPriority): string {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
}

export function getStatusLabel(status: ComplaintStatus): string {
    return status
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

export function canEditComplaint(status: ComplaintStatus): boolean {
    return status === 'draft';
}

export function canSubmitComplaint(status: ComplaintStatus): boolean {
    return status === 'draft';
}

export function canDeleteComplaint(status: ComplaintStatus): boolean {
    return status === 'draft';
}

export function isComplaintActive(status: ComplaintStatus): boolean {
    return !['resolved', 'closed', 'rejected'].includes(status);
}

export default {
    getPriorityLabel,
    getStatusLabel,
    canEditComplaint,
    canSubmitComplaint,
    canDeleteComplaint,
    isComplaintActive,
};
