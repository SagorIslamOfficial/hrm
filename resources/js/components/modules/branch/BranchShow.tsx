import { PhotoDialog, TabsNavigation } from '@/components/common';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useUrlTab } from '@/hooks';
import { useState } from 'react';
import {
    DepartmentsView,
    DetailsView,
    NotesView,
    OverviewView,
    SettingsView,
} from './view';

import { type Branch } from '@/types/branch';

interface BranchShowProps {
    branch: Branch;
    stats?: {
        allocated_budget?: number;
        remaining_budget?: number;
        budget?: number;
    };
    className?: string;
}

export function BranchShow({ branch, className, stats }: BranchShowProps) {
    const [activeTab, handleTabChange] = useUrlTab('overview');
    const [selectedPhoto, setSelectedPhoto] = useState<{
        url: string;
        name: string;
    } | null>(null);

    const branchTabs = [
        { value: 'overview', label: 'Overview' },
        { value: 'details', label: 'Details' },
        { value: 'departments', label: 'Departments' },
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
                <TabsNavigation tabs={branchTabs} />

                <TabsContent value="overview" className="space-y-4">
                    <OverviewView branch={branch} stats={stats} />
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                    <DetailsView
                        detail={branch.detail}
                        onPhotoClick={setSelectedPhoto}
                    />
                </TabsContent>

                <TabsContent value="departments" className="space-y-4">
                    <DepartmentsView
                        departments={branch.departments}
                        stats={stats}
                    />
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                    <SettingsView settings={branch.settings} />
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                    <NotesView notes={branch.notes} />
                </TabsContent>
            </Tabs>

            {/* Photo Popup Dialog */}
            <PhotoDialog
                open={selectedPhoto !== null}
                onOpenChange={(open) => !open && setSelectedPhoto(null)}
                photoUrl={selectedPhoto?.url || null}
                photoName={selectedPhoto?.name || ''}
            />
        </div>
    );
}
