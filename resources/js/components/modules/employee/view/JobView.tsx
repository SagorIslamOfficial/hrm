import { InfoCard } from '@/components/common';

interface JobDetail {
    job_title: string;
    employment_type: string;
    work_shift: string;
    probation_end_date: string | null;
    contract_end_date: string | null;
}

interface JobViewProps {
    jobDetail?: JobDetail;
}

export function JobView({ jobDetail }: JobViewProps) {
    return (
        <InfoCard title="Job Information">
            {jobDetail ? (
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Job Title
                        </label>
                        <p className="text-sm font-medium">
                            {jobDetail.job_title}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Employment Type
                        </label>
                        <p className="text-sm font-medium capitalize">
                            {jobDetail.employment_type.replace('_', ' ')}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Work Shift
                        </label>
                        <p className="text-sm font-medium capitalize">
                            {jobDetail.work_shift}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Probation End Date
                        </label>
                        <p className="text-sm font-medium">
                            {jobDetail.probation_end_date
                                ? new Date(
                                      jobDetail.probation_end_date,
                                  ).toLocaleDateString()
                                : 'N/A'}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Contract End Date
                        </label>
                        <p className="text-sm font-medium">
                            {jobDetail.contract_end_date
                                ? new Date(
                                      jobDetail.contract_end_date,
                                  ).toLocaleDateString()
                                : 'N/A'}
                        </p>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">
                    No job details available
                </p>
            )}
        </InfoCard>
    );
}
