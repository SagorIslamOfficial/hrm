'use client';

import { EmptyActionState } from '@/components/common';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { ChevronDown, ListFilterPlus } from 'lucide-react';
import * as React from 'react';

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

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchPlaceholder?: string;
    globalSearchKeys?: (keyof TData)[];
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchPlaceholder = 'Search all columns...',
    globalSearchKeys,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState('');

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, columnId, filterValue) => {
            const searchValue = filterValue.toLowerCase().trim();
            if (!searchValue) return true;

            if (globalSearchKeys && globalSearchKeys.length > 0) {
                return globalSearchKeys.some((key) => {
                    const value = row.original[key];
                    return value
                        ? String(value).toLowerCase().includes(searchValue)
                        : false;
                });
            }

            // Fallback to original cell-based search
            const rowValues = row.getAllCells().map((cell) => {
                const value = cell.getValue();
                return value ? String(value).toLowerCase() : '';
            });

            return rowValues.some((value) => {
                if (!value) return false;
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
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    return (
        <div className="mx-4">
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
                        value={table.getState().pagination.pageSize.toString()}
                        onValueChange={(value) =>
                            table.setPageSize(Number(value))
                        }
                        placeholder="10"
                        searchPlaceholder="Search..."
                        emptyText="No page sizes found."
                        className="w-[80px] cursor-pointer"
                    />
                </div>
                <div className="flex-1 text-sm text-muted-foreground">
                    {(() => {
                        const totalRows =
                            table.getFilteredRowModel().rows.length;
                        const pageSize = table.getState().pagination.pageSize;
                        const pageIndex = table.getState().pagination.pageIndex;
                        const startRow = pageIndex * pageSize + 1;
                        const endRow = Math.min(
                            (pageIndex + 1) * pageSize,
                            totalRows,
                        );

                        if (totalRows === 0) {
                            return 'No entries found.';
                        }

                        return `Showing ${startRow} to ${endRow} of ${totalRows} entries`;
                    })()}
                </div>
                <div className="flex items-center space-x-2">
                    <div className="text-sm text-muted-foreground">
                        Page {table.getState().pagination.pageIndex + 1} of{' '}
                        {Math.ceil(
                            table.getFilteredRowModel().rows.length /
                                table.getState().pagination.pageSize,
                        )}
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            className="cursor-pointer"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            className="cursor-pointer"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
