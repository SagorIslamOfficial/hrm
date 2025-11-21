import { FormField, InfoCard } from '@/components/common';
import { TimePicker } from '@/components/common/TimePicker';
import { SUPPORTED_CURRENCIES } from '@/config/currency';
import { SUPPORTED_LANGUAGES } from '@/config/languages';
import { type BranchSettings } from '@/types/branch';
import { ApprovalHierarchyInput } from './helper/ApprovalHierarchyInput';
import { CustomSettingsInput } from './helper/CustomSettingsInput';
import { LeavePoliciesInput } from './helper/LeavePoliciesInput';
import { SecurityComplianceInput } from './helper/SecurityComplianceInput';

interface Props {
    data: {
        settings: Partial<BranchSettings>;
    };
    errors: Record<string, string>;
    setData: (key: string, value: unknown) => void;
}

export function SettingsEdit({ data, errors, setData }: Props) {
    const handleSettingsChange = (field: string, value: unknown) => {
        setData('settings', {
            ...data.settings,
            [field]: value,
        });
    };

    return (
        <>
            {/* Attendance & Work Policies */}
            <InfoCard title="Attendance & Work Policies">
                <div className="grid gap-6 md:grid-cols-5">
                    <FormField
                        type="checkbox"
                        id="allow_overtime"
                        label="Allow Overtime"
                        value={data.settings.allow_overtime || false}
                        onChange={(checked: boolean) =>
                            handleSettingsChange('allow_overtime', checked)
                        }
                        error={errors['settings.allow_overtime']}
                    />

                    {data.settings.allow_overtime && (
                        <FormField
                            type="number"
                            id="overtime_rate"
                            label="Overtime Rate (Multiplier)"
                            value={
                                data.settings.overtime_rate
                                    ? String(data.settings.overtime_rate)
                                    : '1.5'
                            }
                            onChange={(value: string | number) =>
                                handleSettingsChange(
                                    'overtime_rate',
                                    Number(value),
                                )
                            }
                            error={errors['settings.overtime_rate']}
                            placeholder="e.g., 1.5"
                            min={1}
                            step={0.1}
                        />
                    )}

                    <div className="space-y-2">
                        <label
                            htmlFor="standard_work_start"
                            className="text-sm font-medium"
                        >
                            Standard Work Start Time
                        </label>
                        <TimePicker
                            value={data.settings.standard_work_start || ''}
                            onChange={(value: string) =>
                                handleSettingsChange(
                                    'standard_work_start',
                                    value,
                                )
                            }
                            placeholder="Select start time"
                            error={!!errors['settings.standard_work_start']}
                        />
                        {errors['settings.standard_work_start'] && (
                            <p className="text-sm text-destructive">
                                {errors['settings.standard_work_start']}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="standard_work_end"
                            className="text-sm font-medium"
                        >
                            Standard Work End Time
                        </label>
                        <TimePicker
                            value={data.settings.standard_work_end || ''}
                            onChange={(value: string) =>
                                handleSettingsChange('standard_work_end', value)
                            }
                            placeholder="Select end time"
                            error={!!errors['settings.standard_work_end']}
                        />
                        {errors['settings.standard_work_end'] && (
                            <p className="text-sm text-destructive">
                                {errors['settings.standard_work_end']}
                            </p>
                        )}
                    </div>

                    <FormField
                        type="number"
                        id="standard_work_hours"
                        label="Standard Work Hours"
                        value={
                            data.settings.standard_work_hours
                                ? String(data.settings.standard_work_hours)
                                : '8'
                        }
                        onChange={(value: string | number) =>
                            handleSettingsChange(
                                'standard_work_hours',
                                Number(value),
                            )
                        }
                        error={errors['settings.standard_work_hours']}
                        placeholder="e.g., 8"
                        min={0}
                        max={24}
                    />

                    <FormField
                        type="checkbox"
                        id="allow_remote_work"
                        label="Allow Remote Work"
                        value={data.settings.allow_remote_work || false}
                        onChange={(checked: boolean) =>
                            handleSettingsChange('allow_remote_work', checked)
                        }
                        error={errors['settings.allow_remote_work']}
                    />

                    {data.settings.allow_remote_work && (
                        <FormField
                            type="number"
                            id="remote_work_days_per_week"
                            label="Remote Work Days Per Week"
                            value={
                                data.settings.remote_work_days_per_week
                                    ? String(
                                          data.settings
                                              .remote_work_days_per_week,
                                      )
                                    : ''
                            }
                            onChange={(value: string | number) =>
                                handleSettingsChange(
                                    'remote_work_days_per_week',
                                    Number(value),
                                )
                            }
                            error={errors['settings.remote_work_days_per_week']}
                            placeholder="0-7"
                            min={0}
                            max={7}
                        />
                    )}
                </div>
            </InfoCard>

            {/* Security & Compliance */}
            <InfoCard title="Security & Compliance">
                <SecurityComplianceInput
                    selectedFeatures={data.settings.security_features || []}
                    onChange={(features) =>
                        handleSettingsChange('security_features', features)
                    }
                    error={errors['settings.security_features']}
                />
            </InfoCard>

            {/* Financial Settings */}
            <InfoCard title="Financial Settings">
                <div className="grid gap-6 md:grid-cols-3">
                    <FormField
                        type="combobox"
                        id="currency"
                        label="Currency"
                        value={data.settings.currency || 'BDT'}
                        onChange={(value: string) =>
                            handleSettingsChange('currency', value)
                        }
                        error={errors['settings.currency']}
                        options={SUPPORTED_CURRENCIES.map((c) => ({
                            value: c.code,
                            label: `${c.code} (${c.name})`,
                        }))}
                    />

                    <FormField
                        type="select"
                        id="payment_method"
                        label="Payment Method"
                        value={data.settings.payment_method || ''}
                        onChange={(value: string) =>
                            handleSettingsChange('payment_method', value)
                        }
                        error={errors['settings.payment_method']}
                        options={[
                            {
                                value: 'cash',
                                label: 'Cash',
                            },
                            {
                                value: 'bank',
                                label: 'Bank Transfer',
                            },
                            {
                                value: 'paypal',
                                label: 'PayPal',
                            },
                            {
                                value: 'stripe',
                                label: 'Stripe',
                            },
                            {
                                value: 'cheque',
                                label: 'Cheque',
                            },
                            {
                                value: 'mobile_banking',
                                label: 'Mobile Banking',
                            },
                            {
                                value: 'cryptocurrency',
                                label: 'Cryptocurrency',
                            },
                            { value: 'other', label: 'Other' },
                        ]}
                    />

                    <FormField
                        type="number"
                        id="salary_payment_day"
                        label="Salary Payment Day"
                        value={
                            data.settings.salary_payment_day
                                ? String(data.settings.salary_payment_day)
                                : ''
                        }
                        onChange={(value: string | number) =>
                            handleSettingsChange(
                                'salary_payment_day',
                                Number(value),
                            )
                        }
                        error={errors['settings.salary_payment_day']}
                        placeholder="e.g., 25"
                        min={1}
                        max={31}
                    />
                </div>
            </InfoCard>

            {/* Leave Policies */}
            <InfoCard title="Leave Policies">
                <LeavePoliciesInput
                    value={data.settings.leave_policies ?? null}
                    onChange={(policies) =>
                        handleSettingsChange('leave_policies', policies)
                    }
                    error={errors['settings.leave_policies']}
                />
            </InfoCard>

            {/* Approval Hierarchy */}
            <InfoCard title="Approval Hierarchy">
                <ApprovalHierarchyInput
                    value={data.settings.approval_hierarchy ?? null}
                    onChange={(hierarchy) =>
                        handleSettingsChange('approval_hierarchy', hierarchy)
                    }
                    error={errors['settings.approval_hierarchy']}
                />
            </InfoCard>

            {/* Communication Settings */}
            <InfoCard title="Communication Settings">
                <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                        type="combobox"
                        id="primary_language"
                        label="Primary Language"
                        value={data.settings.primary_language || 'en'}
                        onChange={(value: string) =>
                            handleSettingsChange('primary_language', value)
                        }
                        error={errors['settings.primary_language']}
                        options={SUPPORTED_LANGUAGES.map((l) => ({
                            value: l.code,
                            label: `${l.name} (${l.code})`,
                        }))}
                    />

                    <FormField
                        type="text"
                        id="supported_languages"
                        label="Supported Languages"
                        value={
                            data.settings.supported_languages
                                ? data.settings.supported_languages.join(', ')
                                : ''
                        }
                        onChange={(value: string) => {
                            const languages = value
                                .split(',')
                                .map((lang) => lang.trim())
                                .filter((lang) => lang);
                            handleSettingsChange(
                                'supported_languages',
                                languages,
                            );
                        }}
                        error={errors['settings.supported_languages']}
                        placeholder="e.g., English, Bangla, Arabic, French (comma separated)"
                    />
                </div>
            </InfoCard>

            {/* Emergency Information */}
            <InfoCard title="Emergency Information">
                <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                        type="text"
                        id="emergency_contact_name"
                        label="Emergency Contact Name"
                        value={data.settings.emergency_contact_name || ''}
                        onChange={(value: string) =>
                            handleSettingsChange(
                                'emergency_contact_name',
                                value,
                            )
                        }
                        error={errors['settings.emergency_contact_name']}
                        placeholder="Name"
                    />

                    <FormField
                        type="tel"
                        id="emergency_contact_phone"
                        label="Emergency Contact Phone"
                        value={data.settings.emergency_contact_phone || ''}
                        onChange={(value: string) =>
                            handleSettingsChange(
                                'emergency_contact_phone',
                                value,
                            )
                        }
                        error={errors['settings.emergency_contact_phone']}
                        placeholder="e.g., +880 1700000000"
                    />

                    <FormField
                        type="text"
                        id="nearest_hospital"
                        label="Nearest Hospital"
                        value={data.settings.nearest_hospital || ''}
                        onChange={(value: string) =>
                            handleSettingsChange('nearest_hospital', value)
                        }
                        error={errors['settings.nearest_hospital']}
                        placeholder="Hospital name and location"
                    />

                    <FormField
                        type="text"
                        id="nearest_police_station"
                        label="Nearest Police Station"
                        value={data.settings.nearest_police_station || ''}
                        onChange={(value: string) =>
                            handleSettingsChange(
                                'nearest_police_station',
                                value,
                            )
                        }
                        error={errors['settings.nearest_police_station']}
                        placeholder="Police station name and location"
                    />
                </div>
            </InfoCard>

            {/* Custom Settings */}
            <InfoCard title="Custom Settings">
                <CustomSettingsInput
                    value={data.settings.custom_settings ?? null}
                    onChange={(settings) =>
                        handleSettingsChange('custom_settings', settings)
                    }
                    error={errors['settings.custom_settings']}
                />
            </InfoCard>
        </>
    );
}
