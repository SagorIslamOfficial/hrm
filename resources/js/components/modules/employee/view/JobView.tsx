import { EmptyActionState, InfoCard } from '@/components/common';
import { formatDateForDisplay } from '@/components/common/utils/dateUtils';

interface JobDetail {
    job_title: string;
    supervisor_id: string;
    work_shift: string;
    probation_end_date: string | null;
    contract_end_date: string | null;
}

interface JobViewProps {
    jobDetail?: JobDetail;
    supervisors: Array<{ id: string; name: string; employee_code: string }>;
}

export function JobView({ jobDetail, supervisors }: JobViewProps) {
    return (
        <InfoCard title="Job Information">
            {jobDetail ? (
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Job Title
                        </label>
                        <p className="text-sm font-medium">
                            {jobDetail.job_title || 'N/A'}
                        </p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Supervisor
                        </label>
                        <p className="text-sm font-medium">
                            {jobDetail.supervisor_id
                                ? supervisors.find(
                                      (sup) =>
                                          sup.id === jobDetail.supervisor_id,
                                  )?.name || 'N/A'
                                : 'N/A'}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Work Shift
                        </label>
                        <p className="text-sm font-medium capitalize">
                            {jobDetail.work_shift || 'N/A'}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Probation End Date
                        </label>
                        <p className="text-sm font-medium">
                            {jobDetail.probation_end_date
                                ? formatDateForDisplay(jobDetail.probation_end_date)
                                : 'N/A'}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Contract End Date
                        </label>
                        <p className="text-sm font-medium">
                            {jobDetail.contract_end_date
                                ? formatDateForDisplay(jobDetail.contract_end_date)
                                : 'N/A'}
                        </p>
                    </div>
                </div>
            ) : (
                <EmptyActionState
                    message="Add job details to track employee information."
                    buttonText="Add Job Details"
                />
            )}
        </InfoCard>
    );
}
