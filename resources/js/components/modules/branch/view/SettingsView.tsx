import { InfoCard } from '@/components/common';
import DetailRow from '@/components/common/DetailRow';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SUPPORTED_CURRENCIES } from '@/config/currency';
import { SUPPORTED_LANGUAGES } from '@/config/languages';
import { type BranchSettings } from '@/types/branch';
import { ChevronRight } from 'lucide-react';
import React from 'react';

interface SettingsViewProps {
    settings?: BranchSettings;
}

export function SettingsView({ settings }: SettingsViewProps) {
    const getCurrencyName = (code?: string) => {
        if (!code) return 'N/A';
        const currency = SUPPORTED_CURRENCIES.find((c) => c.code === code);
        return currency ? `${currency.name} (${currency.code})` : code;
    };

    const getLanguageName = (code?: string) => {
        if (!code) return 'N/A';
        const language = SUPPORTED_LANGUAGES.find((l) => l.code === code);
        return language ? `${language.name} (${language.code})` : code;
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Attendance & Work Policies */}
            <InfoCard title="Attendance & Work Policies">
                <div className="grid grid-cols-2 gap-4">
                    <DetailRow
                        label="Overtime"
                        value={
                            <Badge
                                variant={
                                    settings?.allow_overtime
                                        ? 'default'
                                        : 'secondary'
                                }
                            >
                                {settings?.allow_overtime
                                    ? 'Allowed'
                                    : 'Not Allowed'}
                            </Badge>
                        }
                    />

                    <DetailRow
                        label="Remote Work"
                        value={
                            <Badge
                                variant={
                                    settings?.allow_remote_work
                                        ? 'default'
                                        : 'secondary'
                                }
                            >
                                {settings?.allow_remote_work
                                    ? 'Allowed'
                                    : 'Not Allowed'}
                            </Badge>
                        }
                    />
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-4">
                    {settings?.allow_overtime && settings?.overtime_rate && (
                        <>
                            <DetailRow
                                label="Overtime Rate"
                                value={`${settings.overtime_rate}x`}
                            />
                        </>
                    )}

                    {settings?.allow_remote_work &&
                        settings?.remote_work_days_per_week && (
                            <>
                                <DetailRow
                                    label="Remote Days/Week"
                                    value={`${settings.remote_work_days_per_week} days`}
                                />
                            </>
                        )}

                    <DetailRow
                        label="Work Hours"
                        value={
                            settings?.standard_work_start &&
                            settings?.standard_work_end
                                ? `${settings.standard_work_start} - ${settings.standard_work_end}${settings?.standard_work_hours ? ` (${settings.standard_work_hours}h)` : ''}`
                                : 'Not set'
                        }
                    />
                </div>
            </InfoCard>

            {/* Security & Compliance */}
            <InfoCard title="Security & Compliance">
                <div className="space-y-4">
                    {settings?.security_features &&
                    settings.security_features.length > 0 ? (
                        <div className="space-y-3">
                            <DetailRow
                                label="Security Features"
                                value={
                                    <div className="flex flex-wrap gap-1">
                                        {settings.security_features.map(
                                            (feature, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {typeof feature === 'string'
                                                        ? feature
                                                        : feature.name}
                                                </Badge>
                                            ),
                                        )}
                                    </div>
                                }
                            />
                        </div>
                    ) : (
                        <DetailRow
                            label="Security Features"
                            value="No security features configured"
                        />
                    )}
                </div>
            </InfoCard>

            {/* Financial Settings */}
            <InfoCard title="Financial Settings">
                <div className="grid grid-cols-2 gap-4">
                    <DetailRow
                        label="Currency"
                        value={
                            settings?.currency
                                ? getCurrencyName(settings.currency)
                                : 'Not set'
                        }
                    />

                    <DetailRow
                        label="Payment Method"
                        value={
                            settings?.payment_method
                                ? settings.payment_method.replace('_', ' ')
                                : 'Not set'
                        }
                    />

                    <DetailRow
                        label="Salary Payment Day"
                        value={
                            settings?.salary_payment_day
                                ? `${settings.salary_payment_day}th of month`
                                : 'Not set'
                        }
                    />
                </div>
            </InfoCard>

            {/* Communication Settings */}
            <InfoCard title="Communication Settings">
                <div className="space-y-4">
                    <DetailRow
                        label="Primary Language"
                        value={
                            settings?.primary_language
                                ? getLanguageName(settings.primary_language)
                                : 'Not set'
                        }
                    />

                    {settings?.supported_languages &&
                        settings.supported_languages.length > 0 && (
                            <>
                                <Separator />
                                <DetailRow
                                    label="Supported Languages"
                                    value={
                                        <div className="flex flex-wrap gap-1">
                                            {settings.supported_languages.map(
                                                (lang, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {getLanguageName(lang)}
                                                    </Badge>
                                                ),
                                            )}
                                        </div>
                                    }
                                />
                            </>
                        )}
                </div>
            </InfoCard>

            {/* Emergency Information */}
            <InfoCard title="Emergency Information">
                <div className="grid grid-cols-2 gap-4">
                    <DetailRow
                        label="Emergency Contact"
                        value={settings?.emergency_contact_name || 'Not set'}
                    />

                    <DetailRow
                        label="Emergency Phone"
                        value={settings?.emergency_contact_phone || 'Not set'}
                    />

                    <DetailRow
                        label="Nearest Hospital"
                        value={settings?.nearest_hospital || 'Not set'}
                    />

                    <DetailRow
                        label="Nearest Police Station"
                        value={settings?.nearest_police_station || 'Not set'}
                    />
                </div>
            </InfoCard>

            {/* Policies & Settings */}
            <InfoCard title="Policies & Settings">
                <div className="space-y-4">
                    {/* Leave Policies */}
                    <DetailRow
                        label="Leave Policies"
                        value={
                            settings?.leave_policies &&
                            Object.keys(settings.leave_policies).length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                    {Object.entries(
                                        settings.leave_policies,
                                    ).map(([type, days]) => (
                                        <Badge
                                            key={type}
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            {type.replace(/_/g, ' ')}:{' '}
                                            {Number(days)}d
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                'No leave policies configured'
                            )
                        }
                    />

                    {/* Approval Hierarchy */}
                    <DetailRow
                        label="Approval Hierarchy"
                        value={
                            settings?.approval_hierarchy &&
                            (settings.approval_hierarchy as unknown as string[])
                                .length > 0 ? (
                                <div className="flex flex-wrap items-center gap-1">
                                    {(
                                        settings.approval_hierarchy as unknown as string[]
                                    ).map((level: string, index: number) => (
                                        <React.Fragment key={index}>
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {index + 1}. {level}
                                            </Badge>
                                            {index <
                                                (
                                                    settings.approval_hierarchy as unknown as string[]
                                                ).length -
                                                    1 && (
                                                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            ) : (
                                'No approval hierarchy configured'
                            )
                        }
                    />

                    {/* Custom Settings */}
                    <DetailRow
                        label="Custom Settings"
                        value={
                            settings?.custom_settings &&
                            Object.keys(settings.custom_settings).length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                    {Object.entries(
                                        settings.custom_settings,
                                    ).map(([key, value]) => (
                                        <Badge
                                            key={key}
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            {key}:{' '}
                                            {typeof value === 'object'
                                                ? JSON.stringify(value)
                                                : String(value)}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                'No custom settings configured'
                            )
                        }
                    />
                </div>
            </InfoCard>
        </div>
    );
}
