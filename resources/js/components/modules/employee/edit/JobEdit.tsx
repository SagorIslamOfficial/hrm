import { FormField, InfoCard } from '@/components/common';

interface JobTabProps {
    data: {
        job_detail: {
            job_title: string;
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
    isSuperAdminOrOwner: boolean;
}

export function JobEdit({
    data,
    setData,
    supervisors,
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
        <InfoCard title="Job Details">
            <div className="grid gap-6 md:grid-cols-2">
                <FormField
                    type="text"
                    id="job_title"
                    label="Job Title"
                    required
                    value={data.job_detail.job_title}
                    onChange={(value: string) =>
                        updateJobDetail('job_title', value)
                    }
                    placeholder="e.g., Software Engineer"
                />

                <FormField
                    type="combobox"
                    id="supervisor_id"
                    label="Supervisor"
                    value={data.job_detail.supervisor_id}
                    onChange={(value: string) =>
                        updateJobDetail('supervisor_id', value)
                    }
                    options={supervisors.map((supervisor) => ({
                        value: supervisor.id,
                        label: `${supervisor.name} (${supervisor.employee_code})`,
                    }))}
                    required={!isSuperAdminOrOwner}
                    searchPlaceholder="Search supervisors..."
                    emptyText="No supervisors found."
                />

                <FormField
                    type="select"
                    id="work_shift"
                    label="Work Shift"
                    required
                    value={data.job_detail.work_shift}
                    onChange={(value: string) =>
                        updateJobDetail('work_shift', value)
                    }
                    options={[
                        { value: 'day', label: 'Day' },
                        { value: 'night', label: 'Night' },
                        { value: 'rotating', label: 'Rotating' },
                        { value: 'flexible', label: 'Flexible' },
                    ]}
                />

                <FormField
                    type="date"
                    id="probation_end_date"
                    label="Probation End Date"
                    required
                    value={data.job_detail.probation_end_date}
                    onChange={(value: string) =>
                        updateJobDetail('probation_end_date', value)
                    }
                />

                <FormField
                    type="date"
                    id="contract_end_date"
                    label="Contract End Date"
                    required
                    value={data.job_detail.contract_end_date}
                    onChange={(value: string) =>
                        updateJobDetail('contract_end_date', value)
                    }
                />
            </div>
        </InfoCard>
    );
}
