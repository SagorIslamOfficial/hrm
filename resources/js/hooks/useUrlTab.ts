import { useEffect, useState } from 'react';

/**
 * Custom hook for managing tab state with URL persistence
 *
 * @param defaultTab - The default tab to show if no tab is specified in URL
 * @param paramName - The URL parameter name (defaults to 'tab')
 * @returns [activeTab, handleTabChange] - Current active tab and function to change tabs
 *
 * @example
 * const [activeTab, handleTabChange] = useUrlTab('basic');
 *
 * <Tabs value={activeTab} onValueChange={handleTabChange}>
 *   ...
 * </Tabs>
 */
export function useUrlTab(
    defaultTab: string,
    paramName: string = 'tab',
): [string, (value: string) => void] {
    // Get initial tab from URL or use default
    const getInitialTab = (): string => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get(paramName) || defaultTab;
        }
        return defaultTab;
    };

    const [activeTab, setActiveTab] = useState<string>(getInitialTab());

    // Update URL when tab changes
    const handleTabChange = (value: string): void => {
        setActiveTab(value);

        // Update URL without page reload
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set(paramName, value);
            window.history.replaceState({}, '', url.toString());
        }
    };

    // Sync tab from URL on page load (for browser back/forward)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const tabFromUrl = params.get(paramName);
            if (tabFromUrl && tabFromUrl !== activeTab) {
                setActiveTab(tabFromUrl);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return [activeTab, handleTabChange];
}
