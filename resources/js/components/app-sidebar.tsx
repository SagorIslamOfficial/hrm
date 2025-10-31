import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as attendance } from '@/routes/attendance/index';
import { index as departments } from '@/routes/departments/index';
import { index as employees } from '@/routes/employees/index';
import { index as employmentTypes } from '@/routes/employment-types/index';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    ChevronDown,
    Clock,
    Folder,
    LayoutGrid,
    Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'HR Management',
        href: '#',
        icon: Users,
        items: [
            {
                title: 'Employee',
                href: '#',
                icon: Folder,
                items: [
                    {
                        title: 'All Employees',
                        href: employees(),
                    },
                    {
                        title: 'Employment Types',
                        href: employmentTypes(),
                    },
                ],
            },
            {
                title: 'Organization',
                href: '#',
                icon: Folder,
                items: [
                    {
                        title: 'Departments',
                        href: departments(),
                    },
                ],
            },
        ],
    },
    {
        title: 'Attendance',
        href: attendance(),
        icon: Clock,
    },
];

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

export function AppSidebar() {
    const { url } = usePage();
    const [manualOpenParent, setManualOpenParent] = useState<string | null>(
        null,
    );
    const [manualOpenSub, setManualOpenSub] = useState<string | null>(null);

    // Centralized helper: determines whether `href` should be considered parent of `currentPath`.
    // Matches when exact, or when the remainder starts with an id/uuid or 'create'/'new'.
    const isChildPath = (href?: string, currentPathInner?: string): boolean => {
        if (!href || href === '#') return false;
        const base = new URL(href, window.location.origin).pathname;
        if (!currentPathInner) return false;
        if (currentPathInner === base) return true;
        const normalized = base.endsWith('/') ? base : base + '/';
        if (!currentPathInner.startsWith(normalized)) return false;
        const rest = currentPathInner.slice(normalized.length);
        const first = rest.split('/')[0];
        const isCreateLike = first === 'create' || first === 'new';
        const isDynamicId =
            /^[0-9]+$/.test(first) || /^[0-9a-fA-F-]{36}$/.test(first);
        return isCreateLike || isDynamicId;
    };

    const { activeParent, activeSub } = useMemo(() => {
        let activeParentResult: string | null = null;
        let activeSubResult: string | null = null;

        const currentPath = new URL(url, window.location.origin).pathname;

        for (const parent of mainNavItems) {
            if (parent.items) {
                for (const sub of parent.items) {
                    if (sub.items) {
                        for (const nested of sub.items) {
                            const href =
                                typeof nested.href === 'string'
                                    ? nested.href
                                    : nested.href.url;
                            if (isChildPath(href, currentPath)) {
                                activeParentResult = parent.title;
                                activeSubResult = sub.title;
                                break;
                            }
                        }
                        if (activeParentResult) break;
                    }
                }
                if (activeParentResult) break;
            }
        }

        return { activeParent: activeParentResult, activeSub: activeSubResult };
    }, [url]);

    useEffect(() => {
        if (!activeParent) {
            setManualOpenParent(null);
            setManualOpenSub(null);
        }
    }, [activeParent]);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu className="p-2">
                    {mainNavItems.map((item) =>
                        item.items ? (
                            <Collapsible
                                key={item.title}
                                open={
                                    activeParent === item.title
                                        ? true
                                        : manualOpenParent === item.title
                                }
                                onOpenChange={(open) => {
                                    setManualOpenParent(
                                        open ? item.title : null,
                                    );
                                    if (!open) setManualOpenSub(null);
                                }}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items.map((subItem) => (
                                                <div key={subItem.title}>
                                                    {subItem.items ? (
                                                        <Collapsible
                                                            open={
                                                                activeParent ===
                                                                    item.title &&
                                                                activeSub ===
                                                                    subItem.title
                                                                    ? true
                                                                    : manualOpenSub ===
                                                                      subItem.title
                                                            }
                                                            onOpenChange={(
                                                                open,
                                                            ) =>
                                                                setManualOpenSub(
                                                                    open
                                                                        ? subItem.title
                                                                        : null,
                                                                )
                                                            }
                                                            className="group/collapsible-sub"
                                                        >
                                                            <SidebarMenuSubItem>
                                                                <CollapsibleTrigger
                                                                    asChild
                                                                >
                                                                    <SidebarMenuSubButton>
                                                                        {subItem.icon && (
                                                                            <subItem.icon />
                                                                        )}
                                                                        <span>
                                                                            {
                                                                                subItem.title
                                                                            }
                                                                        </span>
                                                                        <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible-sub:rotate-180" />
                                                                    </SidebarMenuSubButton>
                                                                </CollapsibleTrigger>
                                                            </SidebarMenuSubItem>
                                                            <CollapsibleContent>
                                                                <SidebarMenuSub>
                                                                    {subItem.items.map(
                                                                        (
                                                                            nestedItem,
                                                                        ) => (
                                                                            <SidebarMenuSubItem
                                                                                key={
                                                                                    nestedItem.title
                                                                                }
                                                                            >
                                                                                <SidebarMenuSubButton
                                                                                    asChild
                                                                                    className={(() => {
                                                                                        const href =
                                                                                            typeof nestedItem.href ===
                                                                                            'string'
                                                                                                ? nestedItem.href
                                                                                                : nestedItem
                                                                                                      .href
                                                                                                      ?.url;
                                                                                        const currentPath =
                                                                                            new URL(
                                                                                                url,
                                                                                                window.location.origin,
                                                                                            )
                                                                                                .pathname;
                                                                                        if (
                                                                                            !href ||
                                                                                            href ===
                                                                                                '#'
                                                                                        )
                                                                                            return '';
                                                                                        return isChildPath(
                                                                                            href,
                                                                                            currentPath,
                                                                                        )
                                                                                            ? 'bg-accent text-accent-foreground'
                                                                                            : '';
                                                                                    })()}
                                                                                >
                                                                                    <Link
                                                                                        href={
                                                                                            nestedItem.href
                                                                                        }
                                                                                        prefetch
                                                                                    >
                                                                                        {nestedItem.icon && (
                                                                                            <nestedItem.icon />
                                                                                        )}
                                                                                        <span>
                                                                                            {
                                                                                                nestedItem.title
                                                                                            }
                                                                                        </span>
                                                                                    </Link>
                                                                                </SidebarMenuSubButton>
                                                                            </SidebarMenuSubItem>
                                                                        ),
                                                                    )}
                                                                </SidebarMenuSub>
                                                            </CollapsibleContent>
                                                        </Collapsible>
                                                    ) : (
                                                        <SidebarMenuSubItem>
                                                            <SidebarMenuSubButton
                                                                asChild
                                                                className={(() => {
                                                                    const href =
                                                                        typeof subItem.href ===
                                                                        'string'
                                                                            ? subItem.href
                                                                            : subItem
                                                                                  .href
                                                                                  ?.url;
                                                                    const currentPath =
                                                                        new URL(
                                                                            url,
                                                                            window.location.origin,
                                                                        )
                                                                            .pathname;
                                                                    if (
                                                                        !href ||
                                                                        href ===
                                                                            '#'
                                                                    )
                                                                        return '';
                                                                    return isChildPath(
                                                                        href,
                                                                        currentPath,
                                                                    )
                                                                        ? 'bg-accent text-accent-foreground'
                                                                        : '';
                                                                })()}
                                                            >
                                                                <Link
                                                                    href={
                                                                        subItem.href
                                                                    }
                                                                    prefetch
                                                                >
                                                                    {subItem.icon && (
                                                                        <subItem.icon />
                                                                    )}
                                                                    <span>
                                                                        {
                                                                            subItem.title
                                                                        }
                                                                    </span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    )}
                                                </div>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        ) : (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    className={(() => {
                                        const href =
                                            typeof item.href === 'string'
                                                ? item.href
                                                : item.href?.url;
                                        const currentPath = new URL(
                                            url,
                                            window.location.origin,
                                        ).pathname;
                                        const itemPath = new URL(
                                            href || '',
                                            window.location.origin,
                                        ).pathname;
                                        if (!href || href === '#') return '';
                                        return currentPath === itemPath
                                            ? 'bg-accent text-accent-foreground'
                                            : '';
                                    })()}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ),
                    )}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
