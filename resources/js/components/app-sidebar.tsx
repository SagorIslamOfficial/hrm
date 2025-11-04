'use client';

import { BookOpen, Clock, Folder, Grid2x2Check, Users } from 'lucide-react';
import type * as React from 'react';
import AppLogo from './app-logo';

import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as attendance } from '@/routes/attendance';
import { index as departments } from '@/routes/departments';
import { index as designations } from '@/routes/designations/index';
import { index as employees } from '@/routes/employees';
import { index as employmentTypes } from '@/routes/employment-types';

const data = {
    teams: [
        {
            name: 'Reverse Coders',
            logo: AppLogo,
            plan: 'Enterprise',
        },
    ],

    navMain: [
        {
            title: 'Dashboard',
            url: dashboard().url,
            icon: Grid2x2Check,
            isActive: false,
        },

        {
            title: 'HR Management',
            url: '#',
            icon: Users,
            isActive: false,
            items: [
                {
                    title: 'Employee',
                    url: '#',
                    icon: Folder,
                    isActive: false,
                    items: [
                        {
                            title: 'All Employees',
                            url: employees().url,
                            isActive: false,
                        },
                        {
                            title: 'Employment Types',
                            url: employmentTypes().url,
                            isActive: false,
                        },
                    ],
                },
                {
                    title: 'Organization',
                    url: '#',
                    icon: Folder,
                    isActive: false,
                    items: [
                        {
                            title: 'Departments',
                            url: departments().url,
                            isActive: false,
                        },
                        {
                            title: 'Designations',
                            url: designations().url,
                            isActive: false,
                        },
                    ],
                },
            ],
        },

        {
            title: 'Attendance',
            url: attendance().url,
            icon: Clock,
            isActive: false,
        },
    ],
};

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
