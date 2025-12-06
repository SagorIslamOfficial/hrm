import { PhotoDialog, TabsNavigation } from '@/components/common';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useUrlTab } from '@/hooks';
import { useState } from 'react';
import { ActivityLogs } from './ActivityLogs';
import { type User } from './index';
import { OverviewView } from './view/OverviewView';

interface UserShowProps {
    user: User;
    className?: string;
}

export function UserShow({ user, className }: UserShowProps) {
    const [activeTab, handleTabChange] = useUrlTab('overview');
    const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);

    const handlePhotoClick = (url: string) => {
        setPhotoUrl(url);
        setPhotoDialogOpen(true);
    };

    const userTabs = [
        { value: 'overview', label: 'Overview' },
        { value: 'activity-logs', label: 'Activity Logs' },
    ];

    return (
        <div className={className}>
            <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="space-y-6"
            >
                <TabsNavigation tabs={userTabs} />

                <TabsContent value="overview">
                    <OverviewView user={user} onPhotoClick={handlePhotoClick} />
                </TabsContent>

                <TabsContent value="activity-logs">
                    <ActivityLogs userId={user.id} />
                </TabsContent>
            </Tabs>

            <PhotoDialog
                open={photoDialogOpen}
                photoUrl={photoUrl}
                photoName={user.name}
                onOpenChange={setPhotoDialogOpen}
            />
        </div>
    );
}
