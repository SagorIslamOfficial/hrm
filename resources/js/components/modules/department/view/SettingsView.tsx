import { EmptyActionState, FormField, InfoCard } from '@/components/common';
import DetailRow from '@/components/common/DetailRow';

interface DepartmentSettings {
    overtime_allowed?: boolean;
    travel_allowed?: boolean;
    home_office_allowed?: boolean;
    meeting_room_count?: number;
    desk_count?: number;
    requires_approval?: boolean;
    approval_level?: string;
}

interface SettingsViewProps {
    settings?: DepartmentSettings;
}

export function SettingsView({ settings }: SettingsViewProps) {
    return (
        <InfoCard title="Department Settings">
            {settings ? (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                            type="checkbox"
                            id="overtime_allowed"
                            label="Overtime Allowed"
                            value={settings.overtime_allowed || false}
                            onChange={() => {}}
                            disabled
                        />

                        <FormField
                            type="checkbox"
                            id="travel_allowed"
                            label="Travel Allowed"
                            value={settings.travel_allowed || false}
                            onChange={() => {}}
                            disabled
                        />

                        <FormField
                            type="checkbox"
                            id="home_office_allowed"
                            label="Home Office Allowed"
                            value={settings.home_office_allowed || false}
                            onChange={() => {}}
                            disabled
                        />

                        <FormField
                            type="checkbox"
                            id="requires_approval"
                            label="Requires Approval"
                            value={settings.requires_approval || false}
                            onChange={() => {}}
                            disabled
                        />
                    </div>

                    <div className="border-t pt-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <DetailRow
                                label="Meeting Rooms"
                                value={
                                    settings.meeting_room_count?.toString() ||
                                    '0'
                                }
                            />

                            <DetailRow
                                label="Desks"
                                value={settings.desk_count?.toString() || '0'}
                            />

                            <DetailRow
                                label="Approval Level"
                                value={settings.approval_level || 'N/A'}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <EmptyActionState
                    message="Add department settings to track more information."
                    buttonText="Add Department Settings"
                />
            )}
        </InfoCard>
    );
}
