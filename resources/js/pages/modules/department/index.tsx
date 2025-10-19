import { Head, Link } from '@inertiajs/react';

interface Department {
    id: number;
    name: string;
    description: string;
    manager?: {
        id: number;
        first_name: string;
        last_name: string;
    };
    budget: number;
    location: string;
    status: string;
    employee_count: number;
}

interface Props {
    departments: {
        data: Department[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function Index({ departments }: Props) {
    return (
        <>
            <Head title="Departments" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6 flex items-center justify-between">
                                <h1 className="text-2xl font-bold">
                                    Departments
                                </h1>
                                <Link
                                    href="/departments/create"
                                    className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                                >
                                    Add Department
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-2 text-left">
                                                Name
                                            </th>
                                            <th className="px-4 py-2 text-left">
                                                Manager
                                            </th>
                                            <th className="px-4 py-2 text-left">
                                                Employees
                                            </th>
                                            <th className="px-4 py-2 text-left">
                                                Budget
                                            </th>
                                            <th className="px-4 py-2 text-left">
                                                Location
                                            </th>
                                            <th className="px-4 py-2 text-left">
                                                Status
                                            </th>
                                            <th className="px-4 py-2 text-center">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {departments.data.map((department) => (
                                            <tr
                                                key={department.id}
                                                className="border-t"
                                            >
                                                <td className="px-4 py-2 font-medium">
                                                    {department.name}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {department.manager
                                                        ? `${department.manager.first_name} ${department.manager.last_name}`
                                                        : 'Not assigned'}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {department.employee_count}
                                                </td>
                                                <td className="px-4 py-2">
                                                    $
                                                    {department.budget?.toLocaleString()}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {department.location ||
                                                        'N/A'}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <span
                                                        className={`rounded px-2 py-1 text-xs ${
                                                            department.status ===
                                                            'active'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {department.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <Link
                                                        href={`/departments/${department.id}`}
                                                        className="mr-2 text-blue-600 hover:text-blue-900"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link
                                                        href={`/departments/${department.id}/edit`}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Edit
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination can be added here */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
