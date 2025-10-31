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

function basePath(href?: unknown): string | undefined {
    let n: string | undefined;
    if (typeof href === 'string') n = href;
    else if (typeof href === 'object' && href !== null) {
        const hrefObj = href as Record<string, unknown>;
        if (typeof hrefObj.url === 'string') n = hrefObj.url;
        else {
            const str = String(href);
            if (str && str !== '[object Object]') n = str;
        }
    }
    if (!n || n === '#') return undefined;
    try {
        const path = new URL(n, window.location.origin).pathname.replace(
            /\/+$/,
            '',
        );
        return path === '' ? '/' : path;
    } catch {
        return undefined;
    }
}

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

type RenderMenuProps = {
    items: NavItem[];
    level: 'main' | 'sub' | 'nested';
    openStates: Record<string, boolean>;
    onOpenChange: (key: string, open: boolean) => void;
    getActiveClass: (href?: unknown) => string;
    currentPath: string;
    parentKey?: string;
};

function RenderMenu({
    items,
    level,
    openStates,
    onOpenChange,
    getActiveClass,
    currentPath,
    parentKey = '',
}: RenderMenuProps) {
    const isMain = level === 'main';
    const Item = isMain ? SidebarMenuItem : SidebarMenuSubItem;
    const Button = isMain ? SidebarMenuButton : SidebarMenuSubButton;
    const chevronSize = isMain ? '' : 'h-4 w-4';

    return (
        <>
            {items.map((item) => {
                const key = parentKey
                    ? `${parentKey}.${item.title}`
                    : item.title;
                const isOpen = openStates[key] ?? false;
                const hasSubItems = !!item.items?.length;

                if (hasSubItems) {
                    return (
                        <Collapsible
                            key={key}
                            open={isOpen}
                            onOpenChange={(open) => onOpenChange(key, open)}
                            className="group"
                        >
                            <Item>
                                <CollapsibleTrigger asChild>
                                    <Button
                                        className={getActiveClass(item.href)}
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        <ChevronDown
                                            className={`ml-auto transition-transform group-data-[state=open]:rotate-180 ${chevronSize}`}
                                        />
                                    </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        <RenderMenu
                                            items={item.items!}
                                            level={isMain ? 'sub' : 'nested'}
                                            openStates={openStates}
                                            onOpenChange={onOpenChange}
                                            getActiveClass={getActiveClass}
                                            currentPath={currentPath}
                                            parentKey={key}
                                        />
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </Item>
                        </Collapsible>
                    );
                }

                return (
                    <Item key={key}>
                        <Button asChild className={getActiveClass(item.href)}>
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </Button>
                    </Item>
                );
            })}
        </>
    );
}

export function AppSidebar() {
    const { url } = usePage();
    const currentPath = useMemo(
        () => new URL(url, window.location.origin).pathname,
        [url],
    );

    const bestMatchHref = useMemo(() => {
        let best: string | undefined = undefined;
        let bestLen = -1;

        const consider = (href?: unknown) => {
            const base = basePath(href);
            if (!base || !currentPath) return;
            const isMatch =
                currentPath === base ||
                (base !== '/' && currentPath.startsWith(base + '/'));
            if (isMatch && base.length > bestLen) {
                bestLen = base.length;
                best = base;
            }
        };

        const traverse = (items: NavItem[]) => {
            for (const item of items) {
                consider(item.href);
                if (item.items) traverse(item.items);
            }
        };

        traverse(mainNavItems);
        return best;
    }, [currentPath]);

    const getActiveClass = (href?: unknown): string => {
        const base = basePath(href);
        return base === bestMatchHref ? 'bg-accent text-accent-foreground' : '';
    };

    const [openStates, setOpenStates] = useState<Record<string, boolean>>({});

    const handleOpenChange = (key: string, open: boolean) => {
        setOpenStates((prev) => ({ ...prev, [key]: open }));
        if (!open) {
            // Close all descendants
            setOpenStates((prev) => {
                const updated = { ...prev };
                Object.keys(updated).forEach((k) => {
                    if (k.startsWith(key + '.')) delete updated[k];
                });
                return updated;
            });
        }
    };

    useEffect(() => {
        if (!bestMatchHref) {
            setOpenStates({});
            return;
        }

        const newOpenStates: Record<string, boolean> = {};

        const traverse = (items: NavItem[], parentKey = '') => {
            for (const item of items) {
                const key = parentKey
                    ? `${parentKey}.${item.title}`
                    : item.title;
                const base = basePath(item.href);
                if (
                    base &&
                    (currentPath === base || currentPath.startsWith(base + '/'))
                ) {
                    newOpenStates[key] = true;
                }
                if (item.items) traverse(item.items, key);
            }
        };

        traverse(mainNavItems);

        // Open all ancestors of active items
        Object.keys(newOpenStates).forEach((key) => {
            const parts = key.split('.');
            parts.reduce((acc, part, idx) => {
                const ancestorKey = parts.slice(0, idx + 1).join('.');
                newOpenStates[ancestorKey] = true;
                return ancestorKey;
            }, '');
        });

        setOpenStates((prev) => ({ ...prev, ...newOpenStates }));
    }, [bestMatchHref, currentPath]);

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
                    <RenderMenu
                        items={mainNavItems}
                        level="main"
                        openStates={openStates}
                        onOpenChange={handleOpenChange}
                        getActiveClass={getActiveClass}
                        currentPath={currentPath}
                    />
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
