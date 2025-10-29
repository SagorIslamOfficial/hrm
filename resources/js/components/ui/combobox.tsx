'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ComboboxProps {
    options: { label: string; value: string }[];
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    className?: string;
}

export function Combobox({
    options,
    value,
    onValueChange,
    placeholder = 'Select option...',
    searchPlaceholder = 'Search...',
    emptyText = 'No options found.',
    className,
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const [showAll, setShowAll] = React.useState(false);
    const PAGE_SIZE = 10; // limit items rendered initially to keep the popover snappy

    // debounce the search input slightly to avoid re-filtering on every keystroke
    const debouncedSearch = React.useMemo(() => {
        return search.trim().toLowerCase();
    }, [search]);

    const filteredOptions = React.useMemo(() => {
        if (!debouncedSearch) return options;
        const s = debouncedSearch;
        return options.filter((opt) => {
            const v = opt.label.toLowerCase();
            return v.startsWith(s) || v.includes(` ${s}`) || v.includes(s);
        });
    }, [options, debouncedSearch]);

    const visibleOptions = React.useMemo(() => {
        if (showAll) return filteredOptions;
        return filteredOptions.slice(0, PAGE_SIZE);
    }, [filteredOptions, showAll]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn('w-full justify-between', className)}
                >
                    {value
                        ? options.find((option) => option.value === value)
                              ?.label
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command
                    filter={() => 1 /* use our own filtering for performance */}
                >
                    <CommandInput
                        placeholder={searchPlaceholder}
                        onValueChange={(v) => setSearch(v)}
                        value={search}
                    />
                    <CommandList>
                        <CommandEmpty>{emptyText}</CommandEmpty>
                        <CommandGroup>
                            {visibleOptions.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.label} // Use label for keyboard selection/search
                                    onSelect={() => {
                                        onValueChange?.(
                                            option.value === value
                                                ? ''
                                                : option.value,
                                        );
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            value === option.value
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}

                            {filteredOptions.length > PAGE_SIZE && !showAll && (
                                <CommandItem
                                    key="show-more"
                                    value="__show_more__"
                                    onSelect={() => setShowAll(true)}
                                >
                                    <div className="w-full text-center text-sm text-muted-foreground">
                                        Show all {filteredOptions.length}{' '}
                                        results
                                    </div>
                                </CommandItem>
                            )}

                            {filteredOptions.length > PAGE_SIZE && showAll && (
                                <CommandItem
                                    key="show-less"
                                    value="__show_less__"
                                    onSelect={() => setShowAll(false)}
                                >
                                    <div className="w-full text-center text-sm text-muted-foreground">
                                        Show less
                                    </div>
                                </CommandItem>
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
