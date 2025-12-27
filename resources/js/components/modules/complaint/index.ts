export { ComplaintEditForm } from './ComplaintEditForm';
export { ComplaintShow } from './ComplaintShow';
export * from './edit';
export { useComplaintColumns } from './UseComplaintColumns';
export * from './view';

// Re-export types from central location
export type {
    Complaint,
    ComplaintPriority,
    ComplaintResolution,
    ComplaintStatus,
    ComplaintSubject,
} from '@/types/complaint';
