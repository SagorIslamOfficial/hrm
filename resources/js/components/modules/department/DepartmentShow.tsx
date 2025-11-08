import { TabsNavigation } from '@/components/common';
import { Employee } from '@/components/modules/employee';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useUrlTab } from '@/hooks';
import { DetailsView, NotesView, OverviewView, SettingsView } from './view';

interface DepartmentNote {
    id: string;
    note: string;
    category: string;
    user?: {
        id?: string;
        name?: string;
        email?: string;
    };
    created_at: string;
    updated_at?: string;
}

interface DepartmentDetail {
    founded_date?: string;
    division?: string;
    cost_center?: string;
    internal_code?: string;
    office_phone?: string;
}

interface DepartmentSettings {
    overtime_allowed?: boolean;
    travel_allowed?: boolean;
    home_office_allowed?: boolean;
    meeting_room_count?: number;
    desk_count?: number;
    requires_approval?: boolean;
    approval_level?: string;
}

interface Department {
    id: string;
    name: string;
    code?: string;
    description?: string;
    location?: string;
    budget?: number;
    status: string;
    is_active: boolean;
    manager?: Employee;
    employees?: Employee[];
    detail?: DepartmentDetail;
    settings?: DepartmentSettings;
    notes?: DepartmentNote[];
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

interface DepartmentShowProps {
    department: Department;
    className?: string;
}

export function DepartmentShow({ department, className }: DepartmentShowProps) {
    const [activeTab, handleTabChange] = useUrlTab('overview');

    const departmentTabs = [
        { value: 'overview', label: 'Overview' },
        { value: 'details', label: 'Details' },
        { value: 'settings', label: 'Settings' },
        { value: 'notes', label: 'Notes' },
    ];

    return (
        <div className={className}>
            <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="space-y-6"
            >
                <TabsNavigation tabs={departmentTabs} />

                <TabsContent value="overview" className="space-y-4">
                    <OverviewView department={department} />
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                    <DetailsView detail={department.detail} />
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                    <SettingsView settings={department.settings} />
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                    <NotesView notes={department.notes} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
