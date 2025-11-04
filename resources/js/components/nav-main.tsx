'use client';

import { Link, usePage } from '@inertiajs/react';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

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

export function NavMain({
    items,
}: {
    items: {
        title: string;
        url: string;
        icon?: LucideIcon;
        isActive?: boolean;
        items?: {
            title: string;
            url: string;
            icon?: LucideIcon;
            isActive?: boolean;
            items?: {
                title: string;
                url: string;
                isActive?: boolean;
            }[];
        }[];
    }[];
}) {
    const { url: currentUrl } = usePage();
    const [openNestedItems, setOpenNestedItems] = useState<string[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize nested items that should be open based on current URL
    useEffect(() => {
        if (!isInitialized) {
            const isUrlMatch = (itemUrl: string): boolean => {
                if (!itemUrl || itemUrl === '#') return false;
                return currentUrl.includes(itemUrl);
            };

            const itemsToOpen: string[] = [];
            items.forEach((item) => {
                item.items?.forEach((subItem) => {
                    if (subItem.items) {
                        const hasMatchingChild = subItem.items.some(
                            (nestedItem) => isUrlMatch(nestedItem.url),
                        );
                        if (hasMatchingChild) {
                            itemsToOpen.push(subItem.title);
                        }
                    }
                });
            });
            if (itemsToOpen.length > 0) {
                setOpenNestedItems(itemsToOpen);
            }
            setIsInitialized(true);
        }
    }, [isInitialized, items, currentUrl]);

    const toggleNestedItem = (title: string) => {
        setOpenNestedItems((prev) =>
            prev.includes(title)
                ? prev.filter((item) => item !== title)
                : [...prev, title],
        );
    };

    const isUrlActiveMatch = (itemUrl: string): boolean => {
        if (!itemUrl || itemUrl === '#') return false;

        const normalizedCurrent = currentUrl.replace(/\/$/, '');
        const normalizedItem = itemUrl.replace(/\/$/, '');

        // Exact match
        if (normalizedCurrent === normalizedItem) {
            return true;
        }

        if (normalizedCurrent.startsWith(normalizedItem + '/')) {
            const remainingPath = normalizedCurrent.substring(
                normalizedItem.length + 1,
            );
            const segments = remainingPath.split('/');
            const nextSegment = segments[0];

            if (/^\d+$/.test(nextSegment)) {
                return true;
            }

            const siblingMenus: string[] = [];
            items.forEach((item) => {
                item.items?.forEach((subItem) => {
                    if (subItem.url && subItem.url !== '#') {
                        siblingMenus.push(subItem.url.replace(/\/$/, ''));
                    }
                    subItem.items?.forEach((ni) => {
                        if (ni.url && ni.url !== '#') {
                            siblingMenus.push(ni.url.replace(/\/$/, ''));
                        }
                    });
                });
            });

            const potentialSiblingUrl = normalizedItem + '/' + nextSegment;
            if (siblingMenus.includes(potentialSiblingUrl)) {
                return false;
            }

            return true;
        }

        return false;
    };

    // Helper for exact matching on top-level link items
    const isExactUrlMatch = (itemUrl: string): boolean => {
        if (!itemUrl || itemUrl === '#') return false;
        const normalizedCurrent = currentUrl.replace(/\/$/, '');
        const normalizedItem = itemUrl.replace(/\/$/, '');
        return normalizedCurrent === normalizedItem;
    };

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const hasChildren = item.items && item.items.length > 0;

                    if (!hasChildren) {
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={item.title}
                                    isActive={isExactUrlMatch(item.url)}
                                >
                                    <Link href={item.url}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    }

                    // Collapsible item with children
                    const isOpen =
                        item.isActive ||
                        item.items?.some((subItem) => {
                            if (currentUrl.includes(subItem.url)) return true;
                            if (subItem.items) {
                                return subItem.items.some((nestedItem) =>
                                    currentUrl.includes(nestedItem.url),
                                );
                            }
                            return false;
                        });

                    return (
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={isOpen}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                        isActive={item.isActive}
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items?.map((subItem) =>
                                            subItem.items ? (
                                                <Collapsible
                                                    key={subItem.title}
                                                    asChild
                                                    defaultOpen={
                                                        openNestedItems.includes(
                                                            subItem.title,
                                                        ) ||
                                                        subItem.items.some(
                                                            (nestedItem) =>
                                                                currentUrl.includes(
                                                                    nestedItem.url,
                                                                ),
                                                        )
                                                    }
                                                    onOpenChange={() =>
                                                        toggleNestedItem(
                                                            subItem.title,
                                                        )
                                                    }
                                                    className="group/nested-collapsible"
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
                                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/nested-collapsible:rotate-90" />
                                                            </SidebarMenuSubButton>
                                                        </CollapsibleTrigger>
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
                                                                                isActive={isUrlActiveMatch(
                                                                                    nestedItem.url,
                                                                                )}
                                                                            >
                                                                                <Link
                                                                                    href={
                                                                                        nestedItem.url
                                                                                    }
                                                                                >
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
                                                    </SidebarMenuSubItem>
                                                </Collapsible>
                                            ) : (
                                                <SidebarMenuSubItem
                                                    key={subItem.title}
                                                >
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={isUrlActiveMatch(
                                                            subItem.url,
                                                        )}
                                                    >
                                                        <Link
                                                            href={subItem.url}
                                                        >
                                                            {subItem.icon && (
                                                                <subItem.icon />
                                                            )}
                                                            <span>
                                                                {subItem.title}
                                                            </span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ),
                                        )}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
