import { FormField } from '@/components/common';

interface DepartmentSettings {
    overtime_allowed?: boolean;
    travel_allowed?: boolean;
    home_office_allowed?: boolean;
    meeting_room_count?: number;
    desk_count?: number;
    requires_approval?: boolean;
    approval_level?: string;
    branch_id?: string;
}

interface Branch {
    id: string;
    name: string;
    code?: string;
}

interface Props {
    data: DepartmentSettings;
    errors: Record<string, string>;
    branches: Branch[];
    setData: (key: string, value: string | number | boolean) => void;
}

export function SettingsEdit({ data, errors, branches, setData }: Props) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                    type="checkbox"
                    id="overtime_allowed"
                    label="Overtime Allowed"
                    value={data.overtime_allowed || false}
                    onChange={(checked) => setData('overtime_allowed', checked)}
                    error={errors.overtime_allowed}
                />

                <FormField
                    type="checkbox"
                    id="travel_allowed"
                    label="Travel Allowed"
                    value={data.travel_allowed || false}
                    onChange={(checked) => setData('travel_allowed', checked)}
                    error={errors.travel_allowed}
                />

                <FormField
                    type="checkbox"
                    id="home_office_allowed"
                    label="Home Office Allowed"
                    value={data.home_office_allowed || false}
                    onChange={(checked) =>
                        setData('home_office_allowed', checked)
                    }
                    error={errors.home_office_allowed}
                />

                <FormField
                    type="checkbox"
                    id="requires_approval"
                    label="Requires Approval"
                    value={data.requires_approval || false}
                    onChange={(checked) =>
                        setData('requires_approval', checked)
                    }
                    error={errors.requires_approval}
                />
            </div>

            <div className="border-t pt-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                        id="meeting_room_count"
                        label="Meeting Rooms"
                        type="number"
                        value={data.meeting_room_count || ''}
                        onChange={(value) =>
                            setData('meeting_room_count', value)
                        }
                        error={errors.meeting_room_count}
                    />

                    <FormField
                        id="desk_count"
                        label="Desks"
                        type="number"
                        value={data.desk_count || ''}
                        onChange={(value) => setData('desk_count', value)}
                        error={errors.desk_count}
                    />

                    <FormField
                        id="approval_level"
                        label="Approval Level"
                        type="select"
                        value={data.approval_level || 'none'}
                        onChange={(value) =>
                            setData(
                                'approval_level',
                                value === 'none' ? '' : value,
                            )
                        }
                        options={[
                            { value: 'none', label: 'Select level' },
                            { value: 'Manager', label: 'Manager' },
                            { value: 'Director', label: 'Director' },
                            { value: 'Head', label: 'Department Head' },
                            { value: 'C-Level', label: 'C-Level' },
                        ]}
                        error={errors.approval_level}
                    />

                    <FormField
                        type="combobox"
                        id="branch_id"
                        label="Branch"
                        value={data.branch_id || ''}
                        onChange={(value: string) =>
                            setData('branch_id', value)
                        }
                        options={branches.map((branch) => ({
                            value: branch.id,
                            label: `${branch.name}${branch.code ? ` (${branch.code})` : ''}`,
                        }))}
                        searchPlaceholder="Search branches..."
                        emptyText="No branches found."
                        error={errors.branch_id}
                    />
                </div>
            </div>
        </div>
    );
}
