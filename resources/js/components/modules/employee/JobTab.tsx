import { DateField, SelectField, TextField } from '@/components/common';

interface JobTabProps {
    data: {
        job_detail: {
            job_title: string;
            employment_type: string;
            supervisor_id: string;
            work_shift: string;
            probation_end_date: string;
            contract_end_date: string;
        };
    };
    setData: (
        key: string,
        value:
            | string
            | number
            | boolean
            | File
            | null
            | Record<string, unknown>,
    ) => void;
    supervisors: Array<{ id: string; name: string; employee_code: string }>;
    employmentTypes: Array<{ code: string; name: string }>;
    isSuperAdminOrOwner: boolean;
}

export function JobTab({
    data,
    setData,
    supervisors,
    employmentTypes,
    isSuperAdminOrOwner,
}: JobTabProps) {
    // Helper function to update nested job_detail object
    const updateJobDetail = (field: string, value: string) => {
        setData('job_detail', {
            ...data.job_detail,
            [field]: value,
        });
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Job Title Field */}
            <TextField
                id="job_title"
                label="Job Title"
                required
                value={data.job_detail.job_title}
                onChange={(value) => updateJobDetail('job_title', value)}
                placeholder="e.g., Software Engineer"
            />

            {/* Employment Type Field */}
            <SelectField
                id="employment_type"
                label="Employment Type"
                required
                value={data.job_detail.employment_type}
                onChange={(value) => updateJobDetail('employment_type', value)}
                options={employmentTypes.map((type) => ({
                    value: type.code,
                    label: type.name,
                }))}
            />

            {/* Supervisor Field */}
            <SelectField
                id="supervisor_id"
                label="Supervisor"
                value={data.job_detail.supervisor_id}
                onChange={(value) => updateJobDetail('supervisor_id', value)}
                options={supervisors.map((supervisor) => ({
                    value: supervisor.id,
                    label: `${supervisor.name} (${supervisor.employee_code})`,
                }))}
                required={!isSuperAdminOrOwner}
            />

            {/* Work Shift Field */}
            <SelectField
                id="work_shift"
                label="Work Shift"
                required
                value={data.job_detail.work_shift}
                onChange={(value) => updateJobDetail('work_shift', value)}
                options={[
                    { value: 'day', label: 'Day' },
                    { value: 'night', label: 'Night' },
                    { value: 'rotating', label: 'Rotating' },
                    { value: 'flexible', label: 'Flexible' },
                ]}
            />

            {/* Probation End Date Field */}
            <DateField
                id="probation_end_date"
                label="Probation End Date"
                required
                value={data.job_detail.probation_end_date}
                onChange={(value) =>
                    updateJobDetail('probation_end_date', value)
                }
            />

            {/* Contract End Date Field */}
            <DateField
                id="contract_end_date"
                label="Contract End Date"
                required
                value={data.job_detail.contract_end_date}
                onChange={(value) =>
                    updateJobDetail('contract_end_date', value)
                }
            />
        </div>
    );
}
