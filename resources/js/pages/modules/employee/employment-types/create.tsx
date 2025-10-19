import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import {
    create as employmentTypesCreate,
    index as employmentTypesIndex,
    store as employmentTypesStore,
} from '@/routes/employment-types/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import { useMemo } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employees',
        href: '/dashboard/employees',
    },
    {
        title: 'Employment Types',
        href: employmentTypesIndex().url,
    },
    {
        title: 'Create Employment Type',
        href: employmentTypesCreate().url,
    },
];

export default function Create() {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            code: '',
            description: '',
            is_active: '1',
        });

    // Check if required fields are filled
    const isFormValid = useMemo(() => {
        return data.name.trim() !== '' && data.code.trim() !== '';
    }, [data.name, data.code]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(employmentTypesStore().url, {
            onSuccess: () => {
                toast.success('Employment type created successfully!');
                reset();
                clearErrors();
            },
            onError: () => {
                toast.error(
                    'Failed to create employment type. Please try again.',
                );
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Employment Type" />

            <div className="mx-auto flex h-full w-7xl flex-1 flex-col gap-8 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Create Employment Type
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Add a new employment type to the system
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={employmentTypesIndex().url}>
                                Cancel
                            </Link>
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="size-5" />
                                Employment Type Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Name{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="e.g., Full-time Employee"
                                        className={
                                            errors.name
                                                ? 'border-destructive'
                                                : ''
                                        }
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="code">
                                        Code{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="code"
                                        value={data.code}
                                        onChange={(e) =>
                                            setData('code', e.target.value)
                                        }
                                        placeholder="e.g., FTE"
                                        className={
                                            errors.code
                                                ? 'border-destructive'
                                                : ''
                                        }
                                    />
                                    {errors.code && (
                                        <p className="text-sm text-destructive">
                                            {errors.code}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="is_active">Status</Label>
                                    <Select
                                        value={data.is_active}
                                        onValueChange={(value) =>
                                            setData('is_active', value)
                                        }
                                    >
                                        <SelectTrigger
                                            className={
                                                errors.is_active
                                                    ? 'border-destructive'
                                                    : ''
                                            }
                                        >
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">
                                                Active
                                            </SelectItem>
                                            <SelectItem value="0">
                                                Inactive
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.is_active && (
                                        <p className="text-sm text-destructive">
                                            {errors.is_active}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLTextAreaElement>,
                                        ) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Optional description of this employment type"
                                        rows={3}
                                        className={
                                            errors.description
                                                ? 'border-destructive'
                                                : ''
                                        }
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-destructive">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                reset();
                                clearErrors();
                            }}
                            disabled={processing}
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || !isFormValid}
                        >
                            {processing ? 'Creating...' : 'Create'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
