export type ComplaintPriority =
    | 'low'
    | 'medium'
    | 'high'
    | 'urgent'
    | 'critical';

export type ComplaintStatus =
    | 'draft'
    | 'submitted'
    | 'acknowledged'
    | 'under_review'
    | 'investigating'
    | 'pending_info'
    | 'escalated'
    | 'resolved'
    | 'closed'
    | 'rejected';

export interface ComplaintSubject {
    id: string;
    complaint_id: string;
    subject_id: string;
    subject_type: string;
    subject_name?: string;
    relationship_to_complainant?: string;
    specific_issue: string;
    is_primary: boolean;
    desired_outcome?: string;
    witnesses?: Witness[];
    previous_attempts_to_resolve: boolean;
    previous_resolution_attempts?: string;
    subject?: Employee | User; // Polymorphic
    created_at: string;
    updated_at: string;
    _isNew?: boolean;
    _isModified?: boolean;
    _isDeleted?: boolean;
}

export interface Complaint {
    id: string;
    complaint_number: string;
    title: string;
    categories: string[];
    priority: ComplaintPriority;
    status: ComplaintStatus;
    employee_id: string;
    department_id?: string;
    assigned_to?: string;
    incident_date?: string;
    incident_location?: string;
    brief_description: string;
    is_anonymous: boolean;
    is_confidential: boolean;
    is_recurring: boolean;
    sla_hours?: number;
    sla_breach_at?: string;
    is_escalated: boolean;
    escalated_at?: string;
    escalated_to?: string;
    submitted_at?: string;
    acknowledged_at?: string;
    resolved_at?: string;
    closed_at?: string;
    due_date?: string;
    follow_up_date?: string;
    resolution?: ComplaintResolution;
    created_at: string;
    updated_at: string;
    deleted_at?: string;

    // Relationships
    employee?: Employee;
    department?: Department;
    assignedTo?: User;
    escalatedTo?: User;
    subjects?: ComplaintSubject[];
    status_history?: ComplaintStatusHistory[];
    comments?: ComplaintComment[];
    documents?: ComplaintDocument[];
    escalations?: ComplaintEscalation[];
    reminders?: ComplaintReminder[];

    // Appended attributes
    status_label?: string;
    priority_label?: string;
    priority_badge_class?: string;
    status_badge_class?: string;
    is_overdue?: boolean;
    is_sla_breached?: boolean;

    // Counts
    comments_count?: number;
    documents_count?: number;
}

export interface Witness {
    name: string;
    contact?: string;
    relationship?: string;
}

export interface ComplaintStatusHistory {
    id: string;
    complaint_id: string;
    from_status?: string;
    to_status: string;
    notes?: string;
    changed_by: string;
    changedBy?: User;
    created_at: string;
    updated_at: string;
}

export interface ComplaintComment {
    id: string;
    complaint_id: string;
    comment: string;
    comment_type: 'internal' | 'external';
    is_private: boolean;
    created_by: string;
    creator?: User;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    _isNew?: boolean;
    _isModified?: boolean;
    _isDeleted?: boolean;
}

export interface ComplaintDocument {
    id: string;
    complaint_id: string;
    title: string;
    description?: string;
    doc_type: 'evidence' | 'resolution' | 'supporting' | 'other';
    file_path: string;
    uploaded_by: string;
    uploader?: User;
    file_url?: string;
    file?: File; // For staged uploads
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    _isNew?: boolean;
    _isModified?: boolean;
    _isDeleted?: boolean;
}

export interface ComplaintEscalation {
    id: string;
    complaint_id: string;
    escalated_from?: string;
    escalated_to: string;
    escalation_level: string;
    reason: string;
    escalated_at: string;
    escalated_by: string;
    escalatedFromUser?: User;
    escalatedToUser?: User;
    escalated_to_users?: User[];
    escalatedBy?: User;
    created_at: string;
    updated_at: string;
}

export interface ResolutionData {
    resolution_summary: string;
    actions_taken: string;
    preventive_measures?: string;
    satisfactory_to_complainant?: boolean;
    satisfaction_rating?: number;
    complainant_feedback?: string;
}

export interface ComplaintResolution {
    id: string;
    complaint_id: string;
    data: ResolutionData;
    resolved_by?: string;
    resolved_at?: string;
    created_at: string;
    updated_at: string;
}

export interface ComplaintReminder {
    id: string;
    complaint_id: string;
    reminder_type: 'follow_up' | 'sla_warning' | 'overdue';
    remind_at: string;
    is_sent: boolean;
    sent_at?: string;
    message?: string;
    created_at: string;
    updated_at: string;
}

export interface ComplaintStats {
    total: number;
    active: number;
    overdue: number;
    sla_breached: number;
    escalated: number;
    by_status: Record<string, number>;
    by_priority: Record<string, number>;
}

// Supporting types from other modules
export interface Employee {
    id: string;
    user_id?: string;
    user_name?: string;
    first_name: string;
    last_name: string;
    employee_code: string;
    email?: string;
    phone?: string;
    photo?: string;
    department_id?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

export interface Department {
    id: string;
    name: string;
    code?: string;
}

export interface Branch {
    id: string;
    name: string;
    code?: string;
}

// Editable subject type
export type EditableComplaintSubject = Omit<
    ComplaintSubject,
    'id' | 'complaint_id' | 'created_at' | 'updated_at' | 'subject'
> & {
    id?: string;
    complaint_id?: string;
    created_at?: string;
    updated_at?: string;
    subject?: Employee | User;
    _isNew?: boolean;
    _isModified?: boolean;
    _isDeleted?: boolean;
};

// Form data types
export interface ComplaintFormData {
    title: string;
    categories: string[];
    priority: ComplaintPriority;
    department_id?: string;
    incident_date?: string;
    incident_location?: string;
    brief_description: string;
    is_anonymous?: boolean;
    is_confidential?: boolean;
    is_recurring?: boolean;
    subjects: EditableComplaintSubject[];
}
