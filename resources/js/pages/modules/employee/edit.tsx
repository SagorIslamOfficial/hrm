import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import {
    edit as employeesEdit,
    index as employeesIndex,
    show as employeesShow,
    update as employeesUpdate,
} from '@/routes/employees/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import axios from 'axios';
import {
    ArrowLeft,
    Briefcase,
    Calendar,
    Clock,
    Contact,
    DollarSign,
    Edit as EditIcon,
    FileText,
    Folder,
    Phone,
    Plus,
    Settings,
    StickyNote,
    Trash2,
    Upload,
    User,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface Contact {
    id: string;
    contact_name: string;
    relationship: string;
    phone: string;
    email?: string;
    address?: string;
    photo?: string;
    photo_url?: string;
    is_primary: boolean;
    created_at: string;
    updated_at: string;
    // Staging properties for pending changes
    _photoFile?: File;
    _isNew?: boolean;
    _isModified?: boolean;
    _isDeleted?: boolean;
}

interface Employee {
    id: string;
    employee_code: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    photo?: string;
    photo_url?: string;
    employment_status: string;
    employment_type: string;
    joining_date: string;
    department?: {
        id: string;
        name: string;
    };
    designation?: {
        id: string;
        title: string;
    };
    personalDetail?: {
        date_of_birth?: string;
        gender?: string;
        marital_status?: string;
        blood_group?: string;
        national_id?: string;
        passport_number?: string;
        address?: string;
        city?: string;
        country?: string;
    };
    jobDetail?: {
        job_title?: string;
        employment_type?: string;
        supervisor_id?: string;
        work_shift?: string;
        probation_end_date?: string;
        contract_end_date?: string;
    };
    salaryDetail?: {
        basic_salary?: number;
        allowances?: number;
        deductions?: number;
        net_salary?: number;
        bank_name?: string;
        bank_account_number?: string;
        bank_branch?: string;
        tax_id?: string;
    };
    contacts?: Contact[];
    documents?: Array<{
        id: string;
        document_type: string;
        document_name: string;
        file_path: string;
        uploaded_at: string;
    }>;
    notes?: Array<{
        id: string;
        title: string;
        content: string;
        created_at: string;
    }>;
    customFields?: Array<{
        id: string;
        field_name: string;
        field_value: string;
        field_type: string;
    }>;
}

interface Props {
    employee: Employee;
    departments: Array<{ id: string; name: string }>;
    designations: Array<{ id: string; title: string }>;
    employmentTypes: Array<{ code: string; name: string }>;
    supervisors: Array<{ id: string; name: string; employee_code: string }>;
}

// Contact Form Component
interface ContactFormProps {
    contact?: Contact;
    onSuccess: (contactData: Contact) => void;
    onCancel: () => void;
}

function ContactForm({ contact, onSuccess, onCancel }: ContactFormProps) {
    const [formData, setFormData] = useState({
        contact_name: contact?.contact_name || '',
        relationship: contact?.relationship || '',
        phone: contact?.phone || '',
        email: contact?.email || '',
        address: contact?.address || '',
        is_primary: contact?.is_primary || false,
    });
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(
        contact?.photo_url || null,
    );
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const photoInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async () => {
        setSubmitting(true);
        setErrors({});

        try {
            // Basic validation
            const validationErrors: Record<string, string> = {};
            if (!formData.contact_name.trim()) {
                validationErrors.contact_name = 'Contact name is required';
            }
            if (!formData.relationship.trim()) {
                validationErrors.relationship = 'Relationship is required';
            }
            if (!formData.phone.trim()) {
                validationErrors.phone = 'Phone number is required';
            }

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }

            // Create staged contact data (no API call yet)
            const stagedContact: Contact = {
                id: contact?.id || `temp_${Date.now()}`, // Temporary ID for new contacts
                contact_name: formData.contact_name,
                relationship: formData.relationship,
                phone: formData.phone,
                email: formData.email || '',
                address: formData.address || '',
                is_primary: formData.is_primary,
                photo: photo ? photo.name : contact?.photo || '',
                photo_url: photoPreview || contact?.photo_url || '',
                created_at: contact?.created_at || new Date().toISOString(),
                updated_at: new Date().toISOString(),
                // Store the photo file for later upload
                _photoFile: photo || undefined,
                _isNew: !contact,
                _isModified: !!contact,
            };

            toast.success(
                contact
                    ? 'Contact changes staged - save employee to apply'
                    : 'Contact staged - save employee to apply',
            );

            onSuccess(stagedContact);
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePhotoRemove = () => {
        setPhoto(null);
        setPhotoPreview(contact?.photo_url || null);
        if (photoInputRef.current) {
            photoInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="contact_name">Contact Name *</Label>
                    <Input
                        id="contact_name"
                        value={formData.contact_name}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                contact_name: e.target.value,
                            }))
                        }
                        className={errors.contact_name ? 'border-red-500' : ''}
                    />
                    {errors.contact_name && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.contact_name}
                        </p>
                    )}
                </div>
                <div>
                    <Label htmlFor="relationship">Relationship *</Label>
                    <Select
                        value={formData.relationship}
                        onValueChange={(value) =>
                            setFormData((prev) => ({
                                ...prev,
                                relationship: value,
                            }))
                        }
                    >
                        <SelectTrigger
                            className={
                                errors.relationship ? 'border-red-500' : ''
                            }
                        >
                            <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="spouse">Spouse</SelectItem>
                            <SelectItem value="parent">Parent</SelectItem>
                            <SelectItem value="child">Child</SelectItem>
                            <SelectItem value="sibling">Sibling</SelectItem>
                            <SelectItem value="friend">Friend</SelectItem>
                            <SelectItem value="colleague">Colleague</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.relationship && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.relationship}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                phone: e.target.value,
                            }))
                        }
                        className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.phone}
                        </p>
                    )}
                </div>
                <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                email: e.target.value,
                            }))
                        }
                        className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.email}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            address: e.target.value,
                        }))
                    }
                    className={errors.address ? 'border-red-500' : ''}
                    rows={3}
                />
                {errors.address && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.address}
                    </p>
                )}
            </div>

            <div>
                <Label htmlFor="photo">Contact Photo</Label>
                <div className="space-y-4">
                    {photoPreview && (
                        <div className="flex items-center gap-4">
                            <img
                                src={photoPreview}
                                alt="Contact preview"
                                className="size-16 rounded-full border object-cover"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handlePhotoRemove}
                            >
                                <Trash2 className="mr-2 size-3" />
                                Remove Photo
                            </Button>
                        </div>
                    )}
                    <Input
                        ref={photoInputRef}
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className={errors.photo ? 'border-red-500' : ''}
                    />
                    <p className="text-xs text-muted-foreground">
                        Upload a photo of the emergency contact (max 2MB,
                        100x100 to 1000x1000 pixels)
                    </p>
                    {errors.photo && (
                        <p className="text-sm text-red-500">{errors.photo}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="is_primary"
                    checked={formData.is_primary}
                    onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                            ...prev,
                            is_primary: !!checked,
                        }))
                    }
                />
                <Label htmlFor="is_primary">Primary emergency contact</Label>
            </div>

            <div className="flex justify-end gap-2 border-t pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={submitting}
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting
                        ? 'Saving...'
                        : contact
                          ? 'Update Contact'
                          : 'Add Contact'}
                </Button>
            </div>
        </div>
    );
}

export default function Edit({
    employee,
    departments,
    designations,
    employmentTypes,
    supervisors,
}: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Employees',
            href: employeesIndex().url,
        },
        {
            title: `${employee.first_name} ${employee.last_name}`,
            href: employeesShow(employee.id).url,
        },
        {
            title: 'Edit',
            href: employeesEdit(employee.id).url,
        },
    ];

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        employee.photo_url || null,
    );
    const [contacts, setContacts] = useState(employee.contacts || []);
    const [activeTab, setActiveTab] = useState<string>('basic');

    // Dialog state management
    const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(false);
    const [editContactDialogOpen, setEditContactDialogOpen] = useState<
        string | null
    >(null);
    const [deleteContactDialogOpen, setDeleteContactDialogOpen] = useState<
        string | null
    >(null);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            // Basic employee data
            employee_code: employee.employee_code,
            first_name: employee.first_name,
            last_name: employee.last_name,
            email: employee.email,
            phone: employee.phone || '',
            photo: null as File | null,
            delete_photo: false,
            _method: 'put',
            department_id: employee.department?.id || '',
            designation_id: employee.designation?.id || '',
            employment_status: employee.employment_status,
            employment_type: employee.employment_type,
            joining_date: employee.joining_date,

            // Personal details
            personal_detail: {
                date_of_birth: employee.personalDetail?.date_of_birth || '',
                gender: employee.personalDetail?.gender || '',
                marital_status: employee.personalDetail?.marital_status || '',
                blood_group: employee.personalDetail?.blood_group || '',
                national_id: employee.personalDetail?.national_id || '',
                passport_number: employee.personalDetail?.passport_number || '',
                address: employee.personalDetail?.address || '',
                city: employee.personalDetail?.city || '',
                country: employee.personalDetail?.country || '',
            },

            // Job details
            job_detail: {
                job_title: employee.jobDetail?.job_title || '',
                employment_type:
                    employee.jobDetail?.employment_type ||
                    employee.employment_type,
                supervisor_id: employee.jobDetail?.supervisor_id || '',
                work_shift: employee.jobDetail?.work_shift || '',
                probation_end_date:
                    employee.jobDetail?.probation_end_date || '',
                contract_end_date: employee.jobDetail?.contract_end_date || '',
            },

            // Salary details
            salary_detail: {
                basic_salary: employee.salaryDetail?.basic_salary || '',
                allowances: employee.salaryDetail?.allowances || '',
                deductions: employee.salaryDetail?.deductions || '',
                net_salary: employee.salaryDetail?.net_salary || '',
                bank_name: employee.salaryDetail?.bank_name || '',
                bank_account_number:
                    employee.salaryDetail?.bank_account_number || '',
                bank_branch: employee.salaryDetail?.bank_branch || '',
                tax_id: employee.salaryDetail?.tax_id || '',
            },
        });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // First update the employee
            await new Promise<void>((resolve, reject) => {
                post(employeesUpdate(employee.id).url, {
                    forceFormData: true,
                    onSuccess: () => resolve(),
                    onError: () => reject(new Error('Employee update failed')),
                });
            });

            // Then handle staged contacts
            const stagedContacts = contacts.filter(
                (contact) =>
                    contact._isNew || contact._isModified || contact._isDeleted,
            );

            for (const contact of stagedContacts) {
                try {
                    if (contact._isDeleted && !contact._isNew) {
                        // Delete existing contact
                        await axios.delete(
                            `/dashboard/employees/${employee.id}/contacts/${contact.id}`,
                        );
                    } else if (contact._isNew) {
                        // Create new contact
                        const formData = new FormData();
                        formData.append('contact_name', contact.contact_name);
                        formData.append('relationship', contact.relationship);
                        formData.append('phone', contact.phone);
                        formData.append('email', contact.email || '');
                        formData.append('address', contact.address || '');
                        formData.append(
                            'is_primary',
                            contact.is_primary ? '1' : '0',
                        );

                        if (contact._photoFile) {
                            formData.append('photo', contact._photoFile);
                        }

                        await axios.post(
                            `/dashboard/employees/${employee.id}/contacts`,
                            formData,
                            {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                            },
                        );
                    } else if (contact._isModified) {
                        // Update existing contact
                        const formData = new FormData();
                        formData.append('contact_name', contact.contact_name);
                        formData.append('relationship', contact.relationship);
                        formData.append('phone', contact.phone);
                        formData.append('email', contact.email || '');
                        formData.append('address', contact.address || '');
                        formData.append(
                            'is_primary',
                            contact.is_primary ? '1' : '0',
                        );
                        formData.append('_method', 'PUT');

                        if (contact._photoFile) {
                            formData.append('photo', contact._photoFile);
                        }

                        await axios.post(
                            `/dashboard/employees/${employee.id}/contacts/${contact.id}`,
                            formData,
                            {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                            },
                        );
                    }
                } catch (contactError) {
                    console.error(
                        'Failed to sync contact:',
                        contact,
                        contactError,
                    );
                    toast.error(
                        `Failed to sync contact: ${contact.contact_name}`,
                    );
                }
            }

            router.reload({
                only: ['employee'],
                onSuccess: (page) => {
                    const freshEmployee = page.props
                        .employee as typeof employee;
                    if (freshEmployee?.contacts) {
                        // Update local state with fresh data from server
                        setContacts(freshEmployee.contacts);
                        console.log(
                            'Contacts refreshed via Inertia:',
                            freshEmployee.contacts,
                        );
                    }
                    toast.success(
                        'Employee and contacts updated successfully!',
                    );
                },
                onError: () => {
                    toast.error(
                        'Failed to refresh data. Please refresh the page.',
                    );
                },
            });
        } catch (error) {
            console.error('Update failed:', error);
            toast.error('Failed to update employee. Please try again.');
        }
    };

    const handleReset = () => {
        reset();
        clearErrors();
    };

    const handleDeleteContact = (contactId: string) => {
        // Mark contact as deleted (staged)
        setContacts(
            contacts.map((contact) =>
                contact.id === contactId
                    ? { ...contact, _isDeleted: true }
                    : contact,
            ),
        );
        toast.success('Contact deletion staged - save employee to apply');
        setActiveTab('contacts');
    };

    const handleContactAdd = (contactData: Contact) => {
        // Add new staged contact
        setContacts([...contacts, contactData]);
        setIsAddContactDialogOpen(false);
        setActiveTab('contacts');
    };

    const handleContactEdit = (contactData: Contact) => {
        // Update existing contact (staged)
        setContacts(
            contacts.map((contact) =>
                contact.id === contactData.id ? contactData : contact,
            ),
        );
        setEditContactDialogOpen(null);
        setActiveTab('contacts');
    };

    const handleContactAddCancel = () => {
        setIsAddContactDialogOpen(false);
    };

    const handleContactEditCancel = () => {
        setEditContactDialogOpen(null);
    };

    const handleDeleteContactConfirm = (contactId: string) => {
        handleDeleteContact(contactId);
        setDeleteContactDialogOpen(null);
    };

    const handleDeleteContactCancel = () => {
        setDeleteContactDialogOpen(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${employee.first_name} ${employee.last_name}`} />

            <div className="mx-auto flex h-full w-7xl flex-1 flex-col gap-8 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div>
                            <h1 className="text-2xl font-bold">
                                Edit Employee Profile
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Complete profile information for{' '}
                                <span className="font-bold">
                                    {employee.first_name} {employee.last_name}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" asChild>
                            <Link href={employeesIndex().url}>
                                <ArrowLeft className="mr-1 size-4" />
                                Back
                            </Link>
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="space-y-6"
                    >
                        <TabsList className="grid w-full grid-cols-10">
                            <TabsTrigger
                                value="basic"
                                className="flex items-center gap-1"
                            >
                                <User className="size-3" />
                                Basic
                            </TabsTrigger>
                            <TabsTrigger
                                value="personal"
                                className="flex items-center gap-1"
                            >
                                <FileText className="size-3" />
                                Personal
                            </TabsTrigger>
                            <TabsTrigger
                                value="job"
                                className="flex items-center gap-1"
                            >
                                <Briefcase className="size-3" />
                                Job
                            </TabsTrigger>
                            <TabsTrigger
                                value="salary"
                                className="flex items-center gap-1"
                            >
                                <DollarSign className="size-3" />
                                Salary
                            </TabsTrigger>
                            <TabsTrigger
                                value="contacts"
                                className="flex items-center gap-1"
                            >
                                <Contact className="size-3" />
                                Contacts
                            </TabsTrigger>
                            <TabsTrigger
                                value="documents"
                                className="flex items-center gap-1"
                            >
                                <Folder className="size-3" />
                                Documents
                            </TabsTrigger>
                            <TabsTrigger
                                value="notes"
                                className="flex items-center gap-1"
                            >
                                <StickyNote className="size-3" />
                                Notes
                            </TabsTrigger>
                            <TabsTrigger
                                value="attendance"
                                className="flex items-center gap-1"
                            >
                                <Clock className="size-3" />
                                Attendance
                            </TabsTrigger>
                            <TabsTrigger
                                value="leave"
                                className="flex items-center gap-1"
                            >
                                <Calendar className="size-3" />
                                Leave
                            </TabsTrigger>
                            <TabsTrigger
                                value="additional"
                                className="flex items-center gap-1"
                            >
                                <Settings className="size-3" />
                                Additional
                            </TabsTrigger>
                        </TabsList>

                        {/* Basic Information Tab */}
                        <TabsContent value="basic">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <EditIcon className="size-5" />
                                        Basic Employee Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="employee_code">
                                                Employee Code *
                                            </Label>
                                            <Input
                                                id="employee_code"
                                                value={data.employee_code}
                                                onChange={(e) =>
                                                    setData(
                                                        'employee_code',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Enter employee code"
                                                required
                                            />
                                            {errors.employee_code && (
                                                <p className="text-sm text-destructive">
                                                    {errors.employee_code}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">
                                                Email *
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Enter email address"
                                                required
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-destructive">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="first_name">
                                                First Name *
                                            </Label>
                                            <Input
                                                id="first_name"
                                                value={data.first_name}
                                                onChange={(e) =>
                                                    setData(
                                                        'first_name',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Enter first name"
                                                required
                                            />
                                            {errors.first_name && (
                                                <p className="text-sm text-destructive">
                                                    {errors.first_name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="last_name">
                                                Last Name *
                                            </Label>
                                            <Input
                                                id="last_name"
                                                value={data.last_name}
                                                onChange={(e) =>
                                                    setData(
                                                        'last_name',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Enter last name"
                                                required
                                            />
                                            {errors.last_name && (
                                                <p className="text-sm text-destructive">
                                                    {errors.last_name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={data.phone}
                                                onChange={(e) =>
                                                    setData(
                                                        'phone',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Enter phone number"
                                            />
                                            {errors.phone && (
                                                <p className="text-sm text-destructive">
                                                    {errors.phone}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="department_id">
                                                Department *
                                            </Label>
                                            <Select
                                                value={data.department_id}
                                                onValueChange={(value) =>
                                                    setData(
                                                        'department_id',
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select department" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {departments.map(
                                                        (department) => (
                                                            <SelectItem
                                                                key={
                                                                    department.id
                                                                }
                                                                value={
                                                                    department.id
                                                                }
                                                            >
                                                                {
                                                                    department.name
                                                                }
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {errors.department_id && (
                                                <p className="text-sm text-destructive">
                                                    {errors.department_id}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="designation_id">
                                                Designation *
                                            </Label>
                                            <Select
                                                value={data.designation_id}
                                                onValueChange={(value) =>
                                                    setData(
                                                        'designation_id',
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select designation" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {designations.map(
                                                        (designation) => (
                                                            <SelectItem
                                                                key={
                                                                    designation.id
                                                                }
                                                                value={
                                                                    designation.id
                                                                }
                                                            >
                                                                {
                                                                    designation.title
                                                                }
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {errors.designation_id && (
                                                <p className="text-sm text-destructive">
                                                    {errors.designation_id}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="employment_status">
                                                Employment Status *
                                            </Label>
                                            <Select
                                                value={data.employment_status}
                                                onValueChange={(value) =>
                                                    setData(
                                                        'employment_status',
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">
                                                        Active
                                                    </SelectItem>
                                                    <SelectItem value="inactive">
                                                        Inactive
                                                    </SelectItem>
                                                    <SelectItem value="terminated">
                                                        Terminated
                                                    </SelectItem>
                                                    <SelectItem value="on_leave">
                                                        On Leave
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.employment_status && (
                                                <p className="text-sm text-destructive">
                                                    {errors.employment_status}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="employment_type">
                                                Employment Type *
                                            </Label>
                                            <Select
                                                value={data.employment_type}
                                                onValueChange={(value) =>
                                                    setData(
                                                        'employment_type',
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {employmentTypes.map(
                                                        (type) => (
                                                            <SelectItem
                                                                key={type.code}
                                                                value={
                                                                    type.code
                                                                }
                                                            >
                                                                {type.name}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {errors.employment_type && (
                                                <p className="text-sm text-destructive">
                                                    {errors.employment_type}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="joining_date">
                                                Joining Date *
                                            </Label>
                                            <Input
                                                id="joining_date"
                                                type="date"
                                                value={data.joining_date}
                                                onChange={(e) =>
                                                    setData(
                                                        'joining_date',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                            {errors.joining_date && (
                                                <p className="text-sm text-destructive">
                                                    {errors.joining_date}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label>Photo</Label>
                                            <div className="flex items-start gap-6 pt-3">
                                                {previewUrl && (
                                                    <div className="relative">
                                                        <img
                                                            src={previewUrl}
                                                            alt="Employee photo"
                                                            className="size-24 rounded-lg"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            className="absolute -right-2 -bottom-2 size-6 p-0"
                                                            onClick={() => {
                                                                setData(
                                                                    'delete_photo',
                                                                    true,
                                                                );
                                                                setPreviewUrl(
                                                                    null,
                                                                );
                                                            }}
                                                        >
                                                            <Trash2 className="size-3" />
                                                        </Button>
                                                    </div>
                                                )}
                                                <div className="flex-1 space-y-2">
                                                    <div className="mt-4 flex items-center gap-4">
                                                        <Input
                                                            ref={fileInputRef}
                                                            id="photo"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const file =
                                                                    e.target
                                                                        .files?.[0] ||
                                                                    null;
                                                                setData(
                                                                    'photo',
                                                                    file,
                                                                );
                                                                if (file) {
                                                                    const url =
                                                                        URL.createObjectURL(
                                                                            file,
                                                                        );
                                                                    setPreviewUrl(
                                                                        url,
                                                                    );
                                                                    setData(
                                                                        'delete_photo',
                                                                        false,
                                                                    );
                                                                }
                                                            }}
                                                            className="hidden"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() =>
                                                                fileInputRef.current?.click()
                                                            }
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Upload className="size-4" />
                                                            {data.photo
                                                                ? 'Change Photo'
                                                                : 'Upload Photo'}
                                                        </Button>
                                                        {data.photo && (
                                                            <span className="text-sm text-muted-foreground">
                                                                {
                                                                    data.photo
                                                                        .name
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Upload a profile photo
                                                        (max 2MB, JPEG/PNG/WebP)
                                                    </p>
                                                    {errors.photo && (
                                                        <p className="text-sm text-destructive">
                                                            {errors.photo}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Personal Details Tab */}
                        <TabsContent value="personal">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="size-5" />
                                        Personal Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="date_of_birth">
                                                Date of Birth
                                            </Label>
                                            <Input
                                                id="date_of_birth"
                                                type="date"
                                                value={
                                                    data.personal_detail
                                                        .date_of_birth
                                                }
                                                onChange={(e) =>
                                                    setData('personal_detail', {
                                                        ...data.personal_detail,
                                                        date_of_birth:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                            {errors[
                                                'personal_detail.date_of_birth'
                                            ] && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            'personal_detail.date_of_birth'
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="gender">
                                                Gender
                                            </Label>
                                            <Select
                                                value={
                                                    data.personal_detail.gender
                                                }
                                                onValueChange={(value) =>
                                                    setData('personal_detail', {
                                                        ...data.personal_detail,
                                                        gender: value,
                                                    })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="male">
                                                        Male
                                                    </SelectItem>
                                                    <SelectItem value="female">
                                                        Female
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors[
                                                'personal_detail.gender'
                                            ] && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            'personal_detail.gender'
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="marital_status">
                                                Marital Status
                                            </Label>
                                            <Select
                                                value={
                                                    data.personal_detail
                                                        .marital_status
                                                }
                                                onValueChange={(value) =>
                                                    setData('personal_detail', {
                                                        ...data.personal_detail,
                                                        marital_status: value,
                                                    })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select marital status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="single">
                                                        Single
                                                    </SelectItem>
                                                    <SelectItem value="married">
                                                        Married
                                                    </SelectItem>
                                                    <SelectItem value="divorced">
                                                        Divorced
                                                    </SelectItem>
                                                    <SelectItem value="widowed">
                                                        Widowed
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors[
                                                'personal_detail.marital_status'
                                            ] && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            'personal_detail.marital_status'
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="blood_group">
                                                Blood Group
                                            </Label>
                                            <Select
                                                value={
                                                    data.personal_detail
                                                        .blood_group
                                                }
                                                onValueChange={(value) =>
                                                    setData('personal_detail', {
                                                        ...data.personal_detail,
                                                        blood_group: value,
                                                    })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select blood group" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="A+">
                                                        A+
                                                    </SelectItem>
                                                    <SelectItem value="A-">
                                                        A-
                                                    </SelectItem>
                                                    <SelectItem value="B+">
                                                        B+
                                                    </SelectItem>
                                                    <SelectItem value="B-">
                                                        B-
                                                    </SelectItem>
                                                    <SelectItem value="AB+">
                                                        AB+
                                                    </SelectItem>
                                                    <SelectItem value="AB-">
                                                        AB-
                                                    </SelectItem>
                                                    <SelectItem value="O+">
                                                        O+
                                                    </SelectItem>
                                                    <SelectItem value="O-">
                                                        O-
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors[
                                                'personal_detail.blood_group'
                                            ] && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            'personal_detail.blood_group'
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="national_id">
                                                National ID
                                            </Label>
                                            <Input
                                                id="national_id"
                                                value={
                                                    data.personal_detail
                                                        .national_id
                                                }
                                                onChange={(e) =>
                                                    setData('personal_detail', {
                                                        ...data.personal_detail,
                                                        national_id:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Enter national ID"
                                            />
                                            {errors[
                                                'personal_detail.national_id'
                                            ] && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            'personal_detail.national_id'
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="passport_number">
                                                Passport Number
                                            </Label>
                                            <Input
                                                id="passport_number"
                                                value={
                                                    data.personal_detail
                                                        .passport_number
                                                }
                                                onChange={(e) =>
                                                    setData('personal_detail', {
                                                        ...data.personal_detail,
                                                        passport_number:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Enter passport number"
                                            />
                                            {errors[
                                                'personal_detail.passport_number'
                                            ] && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            'personal_detail.passport_number'
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="address">
                                                Address
                                            </Label>
                                            <Input
                                                id="address"
                                                value={
                                                    data.personal_detail.address
                                                }
                                                onChange={(e) =>
                                                    setData('personal_detail', {
                                                        ...data.personal_detail,
                                                        address: e.target.value,
                                                    })
                                                }
                                                placeholder="Enter full address"
                                            />
                                            {errors[
                                                'personal_detail.address'
                                            ] && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            'personal_detail.address'
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                id="city"
                                                value={
                                                    data.personal_detail.city
                                                }
                                                onChange={(e) =>
                                                    setData('personal_detail', {
                                                        ...data.personal_detail,
                                                        city: e.target.value,
                                                    })
                                                }
                                                placeholder="Enter city"
                                            />
                                            {errors['personal_detail.city'] && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            'personal_detail.city'
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="country">
                                                Country
                                            </Label>
                                            <Input
                                                id="country"
                                                value={
                                                    data.personal_detail.country
                                                }
                                                onChange={(e) =>
                                                    setData('personal_detail', {
                                                        ...data.personal_detail,
                                                        country: e.target.value,
                                                    })
                                                }
                                                placeholder="Enter country"
                                            />
                                            {errors[
                                                'personal_detail.country'
                                            ] && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            'personal_detail.country'
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Job Details Tab */}
                        <TabsContent value="job">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Briefcase className="size-5" />
                                        Job Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="job_title">
                                                Job Title
                                            </Label>
                                            <Input
                                                id="job_title"
                                                value={
                                                    data.job_detail.job_title
                                                }
                                                onChange={(e) =>
                                                    setData('job_detail', {
                                                        ...data.job_detail,
                                                        job_title:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Enter job title"
                                            />
                                            {errors['job_detail.job_title'] && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            'job_detail.job_title'
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="supervisor_id">
                                                Supervisor
                                            </Label>
                                            <Select
                                                value={
                                                    data.job_detail
                                                        .supervisor_id
                                                }
                                                onValueChange={(value) =>
                                                    setData('job_detail', {
                                                        ...data.job_detail,
                                                        supervisor_id: value,
                                                    })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select supervisor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {supervisors.map(
                                                        (supervisor) => (
                                                            <SelectItem
                                                                key={
                                                                    supervisor.id
                                                                }
                                                                value={
                                                                    supervisor.id
                                                                }
                                                            >
                                                                {
                                                                    supervisor.name
                                                                }{' '}
                                                                (
                                                                {
                                                                    supervisor.employee_code
                                                                }
                                                                )
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {errors[
                                                'job_detail.supervisor_id'
                                            ] && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            'job_detail.supervisor_id'
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="work_shift">
                                                Work Shift
                                            </Label>
                                            <Select
                                                value={
                                                    data.job_detail.work_shift
                                                }
                                                onValueChange={(value) =>
                                                    setData('job_detail', {
                                                        ...data.job_detail,
                                                        work_shift: value,
                                                    })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select work shift" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="day">
                                                        Day
                                                    </SelectItem>
                                                    <SelectItem value="night">
                                                        Night
                                                    </SelectItem>
                                                    <SelectItem value="rotating">
                                                        Rotating
                                                    </SelectItem>
                                                    <SelectItem value="flexible">
                                                        Flexible
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors[
                                                'job_detail.work_shift'
                                            ] && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            'job_detail.work_shift'
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="probation_end_date">
                                                Probation End Date
                                            </Label>
                                            <Input
                                                id="probation_end_date"
                                                type="date"
                                                value={
                                                    data.job_detail
                                                        .probation_end_date
                                                }
                                                onChange={(e) =>
                                                    setData('job_detail', {
                                                        ...data.job_detail,
                                                        probation_end_date:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                            {errors[
                                                'job_detail.probation_end_date'
                                            ] && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            'job_detail.probation_end_date'
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="contract_end_date">
                                                Contract End Date
                                            </Label>
                                            <Input
                                                id="contract_end_date"
                                                type="date"
                                                value={
                                                    data.job_detail
                                                        .contract_end_date
                                                }
                                                onChange={(e) =>
                                                    setData('job_detail', {
                                                        ...data.job_detail,
                                                        contract_end_date:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                            {errors[
                                                'job_detail.contract_end_date'
                                            ] && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            'job_detail.contract_end_date'
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Salary Details Tab */}
                        <TabsContent value="salary">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <DollarSign className="size-5" />
                                        Salary Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="basic_salary">
                                                Basic Salary
                                            </Label>
                                            <Input
                                                id="basic_salary"
                                                type="number"
                                                step="0.01"
                                                value={
                                                    data.salary_detail
                                                        .basic_salary
                                                }
                                                onChange={(e) =>
                                                    setData('salary_detail', {
                                                        ...data.salary_detail,
                                                        basic_salary:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Enter basic salary"
                                            />
                                            {errors[
                                                'salary_detail.basic_salary'
                                            ] && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            'salary_detail.basic_salary'
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="allowances">
                                                Allowances
                                            </Label>
                                            <Input
                                                id="allowances"
                                                type="number"
                                                step="0.01"
                                                value={
                                                    data.salary_detail
                                                        .allowances
                                                }
                                                onChange={(e) =>
                                                    setData('salary_detail', {
                                                        ...data.salary_detail,
                                                        allowances:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Enter allowances"
                                            />
                                            {errors[
                                                'salary_detail.allowances'
                                            ] && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            'salary_detail.allowances'
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="deductions">
                                                Deductions
                                            </Label>
                                            <Input
                                                id="deductions"
                                                type="number"
                                                step="0.01"
                                                value={
                                                    data.salary_detail
                                                        .deductions
                                                }
                                                onChange={(e) =>
                                                    setData('salary_detail', {
                                                        ...data.salary_detail,
                                                        deductions:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Enter deductions"
                                            />
                                            {errors[
                                                'salary_detail.deductions'
                                            ] && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            'salary_detail.deductions'
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="net_salary">
                                                Net Salary
                                            </Label>
                                            <Input
                                                id="net_salary"
                                                type="number"
                                                step="0.01"
                                                value={
                                                    data.salary_detail
                                                        .net_salary
                                                }
                                                onChange={(e) =>
                                                    setData('salary_detail', {
                                                        ...data.salary_detail,
                                                        net_salary:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Enter net salary"
                                            />
                                            {errors[
                                                'salary_detail.net_salary'
                                            ] && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            'salary_detail.net_salary'
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="bank_name">
                                                Bank Name
                                            </Label>
                                            <Input
                                                id="bank_name"
                                                value={
                                                    data.salary_detail.bank_name
                                                }
                                                onChange={(e) =>
                                                    setData('salary_detail', {
                                                        ...data.salary_detail,
                                                        bank_name:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Enter bank name"
                                            />
                                            {errors[
                                                'salary_detail.bank_name'
                                            ] && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            'salary_detail.bank_name'
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="bank_account_number">
                                                Bank Account Number
                                            </Label>
                                            <Input
                                                id="bank_account_number"
                                                value={
                                                    data.salary_detail
                                                        .bank_account_number
                                                }
                                                onChange={(e) =>
                                                    setData('salary_detail', {
                                                        ...data.salary_detail,
                                                        bank_account_number:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Enter account number"
                                            />
                                            {errors[
                                                'salary_detail.bank_account_number'
                                            ] && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            'salary_detail.bank_account_number'
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="bank_branch">
                                                Bank Branch
                                            </Label>
                                            <Input
                                                id="bank_branch"
                                                value={
                                                    data.salary_detail
                                                        .bank_branch
                                                }
                                                onChange={(e) =>
                                                    setData('salary_detail', {
                                                        ...data.salary_detail,
                                                        bank_branch:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Enter bank branch"
                                            />
                                            {errors[
                                                'salary_detail.bank_branch'
                                            ] && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            'salary_detail.bank_branch'
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="tax_id">
                                                Tax ID
                                            </Label>
                                            <Input
                                                id="tax_id"
                                                value={
                                                    data.salary_detail.tax_id
                                                }
                                                onChange={(e) =>
                                                    setData('salary_detail', {
                                                        ...data.salary_detail,
                                                        tax_id: e.target.value,
                                                    })
                                                }
                                                placeholder="Enter tax ID"
                                            />
                                            {errors['salary_detail.tax_id'] && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            'salary_detail.tax_id'
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Additional Information Tab */}
                        <TabsContent value="additional">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="size-5" />
                                        Additional Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">
                                            Contacts
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Contact information is managed
                                            separately. You can add emergency
                                            contacts and additional phone
                                            numbers after saving.
                                        </p>

                                        <h3 className="mt-6 text-lg font-semibold">
                                            Documents
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Employee documents can be uploaded
                                            after saving the profile. This
                                            includes contracts, certifications,
                                            and identification documents.
                                        </p>

                                        <h3 className="mt-6 text-lg font-semibold">
                                            Notes
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Internal notes and comments about
                                            the employee can be added in the
                                            employee detail view.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Contacts Tab - Outside of form to prevent form submission conflicts */}
                        <TabsContent value="contacts">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Contact className="size-5" />
                                            Emergency Contacts
                                        </div>
                                        <Dialog
                                            open={isAddContactDialogOpen}
                                            onOpenChange={
                                                setIsAddContactDialogOpen
                                            }
                                        >
                                            <DialogTrigger asChild>
                                                <Button size="sm">
                                                    <Plus className="mr-2 size-4" />
                                                    Add Contact
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Add Emergency Contact
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        Add emergency contact
                                                        information for this
                                                        employee. Changes will
                                                        be applied when you save
                                                        the employee.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <ContactForm
                                                    onSuccess={handleContactAdd}
                                                    onCancel={
                                                        handleContactAddCancel
                                                    }
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {contacts &&
                                    contacts.filter((c) => !c._isDeleted)
                                        .length > 0 ? (
                                        contacts
                                            .filter((c) => !c._isDeleted)
                                            .map((contact) => (
                                                <div
                                                    key={contact.id}
                                                    className={`space-y-2 rounded-lg border p-4 ${
                                                        contact._isNew
                                                            ? 'border-green-300 bg-green-50'
                                                            : contact._isModified
                                                              ? 'border-blue-300 bg-blue-50'
                                                              : ''
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-start gap-3">
                                                            {contact.photo_url && (
                                                                <img
                                                                    src={
                                                                        contact.photo_url
                                                                    }
                                                                    alt={
                                                                        contact.contact_name
                                                                    }
                                                                    className="size-20 rounded-full border object-cover"
                                                                />
                                                            )}
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-2">
                                                                    <h4 className="font-medium">
                                                                        {
                                                                            contact.contact_name
                                                                        }
                                                                    </h4>
                                                                    {contact.is_primary && (
                                                                        <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                                                                            Primary
                                                                        </span>
                                                                    )}
                                                                    {contact._isNew && (
                                                                        <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                                                                            New
                                                                        </span>
                                                                    )}
                                                                    {contact._isModified && (
                                                                        <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                                                                            Modified
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {
                                                                        contact.relationship
                                                                    }
                                                                </p>
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center gap-2 text-sm">
                                                                        <Phone className="size-3" />
                                                                        {
                                                                            contact.phone
                                                                        }
                                                                    </div>
                                                                    {contact.email && (
                                                                        <div className="text-sm text-muted-foreground">
                                                                            {
                                                                                contact.email
                                                                            }
                                                                        </div>
                                                                    )}
                                                                    {contact.address && (
                                                                        <div className="text-sm text-muted-foreground">
                                                                            {
                                                                                contact.address
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Dialog
                                                                open={
                                                                    editContactDialogOpen ===
                                                                    contact.id
                                                                }
                                                                onOpenChange={(
                                                                    open,
                                                                ) =>
                                                                    setEditContactDialogOpen(
                                                                        open
                                                                            ? contact.id
                                                                            : null,
                                                                    )
                                                                }
                                                            >
                                                                <DialogTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                    >
                                                                        <EditIcon className="size-3" />
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>
                                                                            Edit
                                                                            Emergency
                                                                            Contact
                                                                        </DialogTitle>
                                                                        <DialogDescription>
                                                                            Update
                                                                            emergency
                                                                            contact
                                                                            information
                                                                            for
                                                                            this
                                                                            employee.
                                                                            Changes
                                                                            will
                                                                            be
                                                                            applied
                                                                            when
                                                                            you
                                                                            save
                                                                            the
                                                                            employee.
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <ContactForm
                                                                        contact={
                                                                            contact
                                                                        }
                                                                        onSuccess={
                                                                            handleContactEdit
                                                                        }
                                                                        onCancel={
                                                                            handleContactEditCancel
                                                                        }
                                                                    />
                                                                </DialogContent>
                                                            </Dialog>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    setDeleteContactDialogOpen(
                                                                        contact.id,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="size-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                    ) : (
                                        <div className="py-8 text-center">
                                            <Contact className="mx-auto mb-4 size-12 text-muted-foreground" />
                                            <h3 className="mb-2 text-lg font-semibold">
                                                No Emergency Contacts
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Add emergency contact
                                                information for this employee.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Delete Contact Confirmation Dialog */}
                        <AlertDialog open={deleteContactDialogOpen !== null}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Delete Emergency Contact
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete this
                                        emergency contact? Changes will be
                                        applied when you save the employee
                                        profile.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel
                                        onClick={handleDeleteContactCancel}
                                    >
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() =>
                                            deleteContactDialogOpen &&
                                            handleDeleteContactConfirm(
                                                deleteContactDialogOpen,
                                            )
                                        }
                                    >
                                        Delete Contact
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        {/* Documents Tab */}
                        <TabsContent value="documents">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Folder className="size-5" />
                                        Documents
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="py-8 text-center">
                                        <Folder className="mx-auto mb-4 size-12 text-muted-foreground" />
                                        <h3 className="mb-2 text-lg font-semibold">
                                            Employee Documents
                                        </h3>
                                        <p className="mb-4 text-sm text-muted-foreground">
                                            Upload and manage employee documents
                                            like contracts, certificates, and
                                            identification.
                                        </p>
                                        <Button variant="outline" disabled>
                                            Upload Document
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Notes Tab */}
                        <TabsContent value="notes">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <StickyNote className="size-5" />
                                        Internal Notes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="py-8 text-center">
                                        <StickyNote className="mx-auto mb-4 size-12 text-muted-foreground" />
                                        <h3 className="mb-2 text-lg font-semibold">
                                            Internal Notes
                                        </h3>
                                        <p className="mb-4 text-sm text-muted-foreground">
                                            Add internal notes and comments
                                            about this employee.
                                        </p>
                                        <Button variant="outline" disabled>
                                            Add Note
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Attendance Tab */}
                        <TabsContent value="attendance">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="size-5" />
                                        Attendance Records
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="py-8 text-center">
                                        <Clock className="mx-auto mb-4 size-12 text-muted-foreground" />
                                        <h3 className="mb-2 text-lg font-semibold">
                                            Attendance History
                                        </h3>
                                        <p className="mb-4 text-sm text-muted-foreground">
                                            View and manage employee attendance
                                            records and time tracking.
                                        </p>
                                        <Button variant="outline" disabled>
                                            View Attendance
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Leave Tab */}
                        <TabsContent value="leave">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="size-5" />
                                        Leave Records
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="py-8 text-center">
                                        <Calendar className="mx-auto mb-4 size-12 text-muted-foreground" />
                                        <h3 className="mb-2 text-lg font-semibold">
                                            Leave History
                                        </h3>
                                        <p className="mb-4 text-sm text-muted-foreground">
                                            View and manage employee leave
                                            requests and balances.
                                        </p>
                                        <Button variant="outline" disabled>
                                            View Leave Records
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Form Submit Buttons */}
                    <div className="mt-6 flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleReset}
                            disabled={processing}
                        >
                            Reset
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
