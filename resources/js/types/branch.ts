/**
 * Central type definitions for Branch Module
 */

import type { Employee } from '@/components/modules/employee';

export type { Employee };

export interface BranchOption {
    id: string;
    name: string;
    code: string;
    type: string;
}

export interface BranchType {
    value: string;
    label: string;
}

export interface Manager {
    id: string;
    first_name?: string;
    last_name?: string;
    photo?: string;
    photo_url?: string;
}

export interface Department {
    id: string;
    name: string;
    code?: string;
    status: string;
    is_active?: boolean;
    budget?: number;
    employee_count?: number;
    manager_id?: string;
    manager?: Employee;
    employees?: Employee[];
    pivot?: {
        budget_allocation?: number;
        is_primary?: boolean;
    };
    _isNew?: boolean;
    _isModified?: boolean;
    _isDeleted?: boolean;
}

export interface BranchDetail {
    latitude?: number | null;
    longitude?: number | null;
    working_hours?: {
        [key: string]: { start?: string; end?: string };
    } | null;
    facilities?: string[] | null;
    total_area?: number | null;
    total_floors?: number | null;
    floor_number?: string;
    accessibility_features?: string;
    monthly_rent?: number | null;
    monthly_utilities?: number | null;
    monthly_maintenance?: number | null;
    security_deposit?: number | null;
    building_name?: string;
    building_type?: string;
    lease_start_date?: string | null;
    lease_end_date?: string | null;
    lease_terms?: string;
    property_contact_name?: string;
    property_contact_phone?: string;
    property_contact_email?: string;
    property_contact_photo?: string | null;
    property_contact_address?: string;
    photo_url?: string | null;
}

export type CustomSettingValue = string | number | boolean | null;

export interface BranchSettings {
    allow_overtime?: boolean;
    overtime_rate?: number | string;
    allow_remote_work?: boolean;
    remote_work_days_per_week?: number | string | null;
    standard_work_start?: string;
    standard_work_end?: string;
    standard_work_hours?: number | string;
    leave_policies?: Record<string, number | undefined> | null;
    approval_hierarchy?: string[] | null;
    security_features?: (string | { name: string })[];
    currency?: string;
    payment_method?: string;
    salary_payment_day?: number | string | null;
    primary_language?: string;
    supported_languages?: string[];
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    nearest_hospital?: string;
    nearest_police_station?: string;
    custom_settings?: Record<string, CustomSettingValue> | null;
}

export interface Note {
    id: string;
    title?: string;
    note: string;
    category: string;
    is_private?: boolean | null;
    user?: {
        id?: string;
        name?: string;
        email?: string;
    };
    creator?: {
        id?: number;
        name?: string;
    };
    created_at: string;
    updated_at?: string;
    _isNew?: boolean;
    _isModified?: boolean;
    _isDeleted?: boolean;
}

export interface BranchDocument {
    id: string;
    branch_id: string;
    doc_type: string;
    title: string;
    file_path?: string | null;
    file_name?: string | null;
    file_size?: number | null;
    mime_type?: string | null;
    expiry_date?: string | null;
    uploaded_by?: string;
    uploader?: {
        id: string;
        name: string;
    };
    file_url?: string | null;
    is_expired?: boolean;
    is_expiring_soon?: boolean;
    created_at: string;
    updated_at: string;
    file?: File;
    _documentFile?: File;
    _isNew?: boolean;
    _isModified?: boolean;
    _isDeleted?: boolean;
}

export interface BranchCustomField {
    id: string;
    branch_id: string;
    field_key: string;
    field_value?: string | null;
    field_type:
        | 'text'
        | 'number'
        | 'date'
        | 'boolean'
        | 'select'
        | 'textarea'
        | 'email'
        | 'phone'
        | 'url';
    section?: 'general' | 'operational' | 'technical' | 'other';
    created_at: string;
    updated_at: string;
    _isNew?: boolean;
    _isModified?: boolean;
    _isDeleted?: boolean;
}

export interface Branch {
    id: string;
    name: string;
    code: string;
    type: string;
    description?: string;
    parent_id?: string;
    manager_id?: string;
    address_line_1?: string;
    address_line_2?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    timezone?: string;
    phone?: string;
    phone_2?: string;
    email?: string;
    opening_date?: string;
    parent_branch?: {
        id: string;
        name: string;
        code: string;
    };
    child_branches?: {
        id: string;
        name: string;
        code: string;
    }[];
    is_active: boolean;
    status: string;
    max_employees?: number;
    budget?: number;
    cost_center?: string;
    tax_registration_number?: string;
    employee_count?: number;
    department_count?: number;
    full_address?: string;
    type_label?: string;
    manager?: Employee;
    detail?: BranchDetail;
    settings?: BranchSettings;
    departments?: Department[];
    notes?: Note[];
    documents?: BranchDocument[];
    custom_fields?: BranchCustomField[];
    created_at: string;
    updated_at: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
}

// Form-related types
export type BasicEditData = Pick<
    Branch,
    | 'name'
    | 'code'
    | 'type'
    | 'status'
    | 'parent_id'
    | 'manager_id'
    | 'description'
    | 'address_line_1'
    | 'address_line_2'
    | 'city'
    | 'state'
    | 'country'
    | 'postal_code'
    | 'timezone'
    | 'phone'
    | 'phone_2'
    | 'email'
    | 'opening_date'
    | 'max_employees'
    | 'budget'
    | 'cost_center'
    | 'tax_registration_number'
>;

export interface DetailsData {
    detail: Partial<BranchDetail>;
    property_contact_photo: File | null;
    delete_property_contact_photo: boolean;
}

export interface Facility {
    name: string;
}

export interface SecurityFeature {
    name: string;
}

export interface BranchEditFormData {
    name: string;
    code: string;
    type: string;
    description: string;
    parent_id?: string;
    manager_id?: string;
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    timezone: string;
    phone: string;
    phone_2: string;
    email: string;
    opening_date?: string;
    status: string;
    is_active: boolean;
    max_employees?: number;
    budget?: number;
    cost_center: string;
    tax_registration_number: string;
    detail: Partial<BranchDetail>;
    property_contact_photo: File | null;
    delete_property_contact_photo: boolean;
    settings: Partial<BranchSettings>;
    _method: string;
}
