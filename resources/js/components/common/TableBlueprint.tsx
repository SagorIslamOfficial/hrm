'use client';

import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

interface TableBlueprintProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchPlaceholder?: string;
    globalSearchKeys?: (keyof TData)[];
}

export function TableBlueprint<TData, TValue>({
    columns,
    data,
    searchPlaceholder = 'Search...',
    globalSearchKeys,
}: TableBlueprintProps<TData, TValue>) {
    return (
        <DataTable
            columns={columns}
            data={data}
            searchPlaceholder={searchPlaceholder}
            globalSearchKeys={globalSearchKeys}
        />
    );
}
