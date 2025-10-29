import { Head, Link } from '@inertiajs/react';

interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    position: string;
    hire_date: string;
}

interface Department {
    id: number;
    name: string;
    description: string;
    manager?: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
    };
    budget: number;
    location: string;
    status: string;
    employees: Employee[];
    created_at: string;
    updated_at: string;
}

interface Props {
    department: Department;
}

export default function Show({ department }: Props) {
    return (
        <>
            <Head title={`Department: ${department.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6 flex items-center justify-between">
                                <h1 className="text-2xl font-bold">
                                    {department.name}
                                </h1>
                                <div className="space-x-2">
                                    <Link
                                        href={`/departments/${department.id}/edit`}
                                        className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        href="/departments"
                                        className="rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700"
                                    >
                                        Back to Departments
                                    </Link>
                                </div>
                            </div>

                            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <h2 className="mb-4 text-lg font-semibold">
                                        Department Details
                                    </h2>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Name
                                            </label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {department.name}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Description
                                            </label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {department.description ||
                                                    'No description'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Manager
                                            </label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {department.manager
                                                    ? `${department.manager.first_name} ${department.manager.last_name} (${department.manager.email})`
                                                    : 'Not assigned'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Budget
                                            </label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                $
                                                {department.budget?.toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Location
                                            </label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {department.location || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Status
                                            </label>
                                            <span
                                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                                    department.status ===
                                                    'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {department.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="mb-4 text-lg font-semibold">
                                        Timestamps
                                    </h2>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Created
                                            </label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {new Date(
                                                    department.created_at,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Last Updated
                                            </label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {new Date(
                                                    department.updated_at,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="mb-4 text-lg font-semibold">
                                    Employees ({department.employees.length})
                                </h2>
                                {department.employees.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full table-auto">
                                            <thead>
                                                <tr className="bg-gray-50">
                                                    <th className="px-4 py-2 text-left">
                                                        Name
                                                    </th>
                                                    <th className="px-4 py-2 text-left">
                                                        Email
                                                    </th>
                                                    <th className="px-4 py-2 text-left">
                                                        Position
                                                    </th>
                                                    <th className="px-4 py-2 text-left">
                                                        Hire Date
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {department.employees.map(
                                                    (employee) => (
                                                        <tr
                                                            key={employee.id}
                                                            className="border-t"
                                                        >
                                                            <td className="px-4 py-2 font-medium">
                                                                {
                                                                    employee.first_name
                                                                }{' '}
                                                                {
                                                                    employee.last_name
                                                                }
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                {employee.email}
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                {
                                                                    employee.position
                                                                }
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                {new Date(
                                                                    employee.hire_date,
                                                                ).toLocaleDateString()}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">
                                        No employees assigned to this
                                        department.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
