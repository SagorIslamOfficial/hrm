import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const [openItems, setOpenItems] = useState<string[]>([]);

    const getItemUrl = (item: NavItem) => {
        return typeof item.href === 'string' ? item.href : item.href.url;
    };

    const isActive = (item: NavItem) => {
        const itemUrl = getItemUrl(item);
        const currentUrl = page.url;

        // For dashboard, only match exact '/dashboard'
        if (item.title === 'Dashboard') {
            return currentUrl === '/dashboard';
        }

        return currentUrl.startsWith(itemUrl) && currentUrl !== '/dashboard';
    };

    const toggleItem = (title: string) => {
        setOpenItems((prev) =>
            prev.includes(title)
                ? prev.filter((item) => item !== title)
                : [...prev, title],
        );
    };

    const renderNavItem = (item: NavItem) => {
        const hasSubItems = item.items && item.items.length > 0;
        const isItemActive = isActive(item);
        const isOpen = openItems.includes(item.title);

        // If item has sub-items, check if any sub-item is active
        const hasActiveSubItem =
            hasSubItems && item.items!.some((subItem) => isActive(subItem));

        if (hasSubItems) {
            return (
                <Collapsible
                    key={item.title}
                    asChild
                    open={isOpen || hasActiveSubItem}
                    onOpenChange={() => toggleItem(item.title)}
                >
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                                tooltip={{ children: item.title }}
                                isActive={isItemActive || hasActiveSubItem}
                            >
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[collapsible=icon]:hidden group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenuSub>
                                {item.items!.map((subItem) => (
                                    <SidebarMenuSubItem key={subItem.title}>
                                        <SidebarMenuSubButton
                                            asChild
                                            isActive={isActive(subItem)}
                                        >
                                            <Link
                                                href={getItemUrl(subItem)}
                                                prefetch
                                            >
                                                {subItem.icon && (
                                                    <subItem.icon />
                                                )}
                                                <span>{subItem.title}</span>
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                ))}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </SidebarMenuItem>
                </Collapsible>
            );
        }

        return (
            <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                    asChild
                    isActive={isItemActive}
                    tooltip={{ children: item.title }}
                >
                    <Link href={getItemUrl(item)} prefetch>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>{items.map(renderNavItem)}</SidebarMenu>
        </SidebarGroup>
    );
}
