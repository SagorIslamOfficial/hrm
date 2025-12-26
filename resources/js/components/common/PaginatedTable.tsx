'use client';

import { EmptyActionState } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { router } from '@inertiajs/react';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { ChevronDown, ListFilterPlus } from 'lucide-react';
import * as React from 'react';

export interface PaginationMeta {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
}

export interface PaginatedData<T> extends PaginationMeta {
    data: T[];
}

export function arrayToPaginatedData<T>(data: T[]): PaginatedData<T> {
    const total = data.length;

    // Get pagination params from URL
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get('page') || '1', 10);
    const perPage = parseInt(urlParams.get('per_page') || '10', 10);

    // Calculate pagination
    const lastPage = Math.max(1, Math.ceil(total / perPage));
    const validPage = Math.min(Math.max(1, currentPage), lastPage);
    const startIndex = (validPage - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, total);

    // Slice data for current page
    const paginatedItems = data.slice(startIndex, endIndex);

    return {
        data: paginatedItems,
        current_page: validPage,
        from: total > 0 ? startIndex + 1 : null,
        last_page: lastPage,
        per_page: perPage,
        to: total > 0 ? endIndex : null,
        total,
    };
}

interface PaginatedTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    paginatedData: PaginatedData<TData>;
    searchPlaceholder?: string;
    globalSearchKeys?: (keyof TData | string)[];
    className?: string;
    getRowProps?: (
        row: Row<TData>,
    ) => React.HTMLAttributes<HTMLTableRowElement>;
}

export function PaginatedTable<TData, TValue>({
    columns,
    paginatedData,
    searchPlaceholder = 'Search...',
    globalSearchKeys,
    className,
    getRowProps,
}: PaginatedTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState('');

    const { data, current_page, per_page, total, from, to, last_page } =
        paginatedData;

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, _columnId, filterValue) => {
            const searchValue = filterValue.toLowerCase().trim();
            if (!searchValue) {
                return true;
            }

            // Helper to get nested value from path like 'employee.first_name'
            const getNestedValue = (obj: unknown, path: string): unknown => {
                return path.split('.').reduce((acc: unknown, part: string) => {
                    if (acc && typeof acc === 'object' && part in acc) {
                        return (acc as Record<string, unknown>)[part];
                    }
                    return undefined;
                }, obj);
            };

            if (globalSearchKeys && globalSearchKeys.length > 0) {
                return globalSearchKeys.some((key) => {
                    const value = getNestedValue(row.original, String(key));
                    return value
                        ? String(value).toLowerCase().includes(searchValue)
                        : false;
                });
            }

            const rowValues = row.getAllCells().map((cell) => {
                const value = cell.getValue();
                return value ? String(value).toLowerCase() : '';
            });

            return rowValues.some((value) => {
                if (!value) {
                    return false;
                }
                return value.includes(searchValue);
            });
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
        manualPagination: true,
        pageCount: last_page,
    });

    const handlePageChange = (page: number) => {
        router.get(
            window.location.pathname,
            { page, per_page },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handlePerPageChange = (newPerPage: string) => {
        router.get(
            window.location.pathname,
            { page: 1, per_page: Number(newPerPage) },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <div className={className || 'mx-4'}>
            <div className="flex items-center py-4">
                <Input
                    placeholder={searchPlaceholder}
                    value={globalFilter ?? ''}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            <ListFilterPlus className="ml-2 h-4 w-4" />
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                const header =
                                    typeof column.columnDef.header === 'string'
                                        ? column.columnDef.header
                                        : column.id;
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {header}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                    {...(getRowProps ? getRowProps(row) : {})}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length}>
                                    <EmptyActionState
                                        message="No data found! Try adjusting your search, filters or adding new data."
                                        buttonText="Reset Filters, Search or Add"
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Show:</span>
                    <Combobox
                        options={[
                            { label: '10', value: '10' },
                            { label: '20', value: '20' },
                            { label: '30', value: '30' },
                            { label: '40', value: '40' },
                            { label: '50', value: '50' },
                        ]}
                        value={per_page.toString()}
                        onValueChange={handlePerPageChange}
                        placeholder="10"
                        searchPlaceholder="Search..."
                        emptyText="No page sizes found."
                        className="w-[100px] cursor-pointer"
                    />
                </div>
                <div className="flex-1 text-sm text-muted-foreground">
                    {total === 0
                        ? 'No entries found.'
                        : `Showing ${from} to ${to} of ${total} entries`}
                </div>
                <div className="flex items-center space-x-2">
                    <div className="text-sm text-muted-foreground">
                        Page {current_page} of {last_page}
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            className="cursor-pointer"
                            size="sm"
                            onClick={() => handlePageChange(current_page - 1)}
                            disabled={current_page <= 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            className="cursor-pointer"
                            size="sm"
                            onClick={() => handlePageChange(current_page + 1)}
                            disabled={current_page >= last_page}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaginatedTable;
