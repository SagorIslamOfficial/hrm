import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TabItem {
    value: string;
    label: string;
}

interface TabsNavigationProps {
    tabs: TabItem[];
    className?: string;
}

export function TabsNavigation({ tabs, className = '' }: TabsNavigationProps) {
    return (
        <TabsList
            className={`grid w-full grid-cols-${tabs.length} ${className}`}
        >
            {tabs.map((tab) => (
                <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="cursor-pointer"
                >
                    {tab.label}
                </TabsTrigger>
            ))}
        </TabsList>
    );
}
