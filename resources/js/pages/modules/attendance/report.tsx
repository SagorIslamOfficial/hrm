import { Head, Link, useForm } from '@inertiajs/react';

interface ReportData {
    employee_name: string;
    employee_id: string;
    total_days: number;
    present_days: number;
    absent_days: number;
    late_days: number;
    total_hours: number;
    average_hours: number;
    attendance_rate: number;
}

interface Props {
    report: ReportData[];
    filters: {
        start_date: string;
        end_date: string;
        department_id?: number;
    };
    departments: Array<{
        id: number;
        name: string;
    }>;
}

export default function Report({ report, filters, departments }: Props) {
    const { data, setData, get, processing } = useForm({
        start_date: filters.start_date,
        end_date: filters.end_date,
        department_id: filters.department_id || '',
    });

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        get('/attendance/report', {
            preserveState: true,
        });
    };

    return (
        <>
            <Head title="Attendance Reports" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6 flex items-center justify-between">
                                <h1 className="text-2xl font-bold">
                                    Attendance Reports
                                </h1>
                                <div className="space-x-2">
                                    <Link
                                        href="/attendance"
                                        className="rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700"
                                    >
                                        All Records
                                    </Link>
                                    <Link
                                        href="/attendance/my"
                                        className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
                                    >
                                        My Attendance
                                    </Link>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="mb-6 rounded-lg bg-gray-50 p-4">
                                <h2 className="mb-4 text-lg font-semibold">
                                    Report Filters
                                </h2>
                                <form
                                    onSubmit={handleFilter}
                                    className="grid grid-cols-1 gap-4 md:grid-cols-4"
                                >
                                    <div>
                                        <label
                                            htmlFor="start_date"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            id="start_date"
                                            value={data.start_date}
                                            onChange={(e) =>
                                                setData(
                                                    'start_date',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="end_date"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            id="end_date"
                                            value={data.end_date}
                                            onChange={(e) =>
                                                setData(
                                                    'end_date',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="department_id"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Department
                                        </label>
                                        <select
                                            id="department_id"
                                            value={data.department_id}
                                            onChange={(e) =>
                                                setData(
                                                    'department_id',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="">
                                                All Departments
                                            </option>
                                            {departments.map((department) => (
                                                <option
                                                    key={department.id}
                                                    value={department.id}
                                                >
                                                    {department.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex items-end">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            {processing
                                                ? 'Generating...'
                                                : 'Generate Report'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Report Data */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-2 text-left">
                                                Employee
                                            </th>
                                            <th className="px-4 py-2 text-center">
                                                Total Days
                                            </th>
                                            <th className="px-4 py-2 text-center">
                                                Present
                                            </th>
                                            <th className="px-4 py-2 text-center">
                                                Absent
                                            </th>
                                            <th className="px-4 py-2 text-center">
                                                Late
                                            </th>
                                            <th className="px-4 py-2 text-center">
                                                Total Hours
                                            </th>
                                            <th className="px-4 py-2 text-center">
                                                Avg Hours/Day
                                            </th>
                                            <th className="px-4 py-2 text-center">
                                                Attendance Rate
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {report.map((record, index) => (
                                            <tr
                                                key={index}
                                                className="border-t"
                                            >
                                                <td className="px-4 py-2 font-medium">
                                                    {record.employee_name}
                                                    <br />
                                                    <span className="text-sm text-gray-500">
                                                        ({record.employee_id})
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    {record.total_days}
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <span className="font-medium text-green-600">
                                                        {record.present_days}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <span className="font-medium text-red-600">
                                                        {record.absent_days}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <span className="font-medium text-yellow-600">
                                                        {record.late_days}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    {record.total_hours.toFixed(
                                                        1,
                                                    )}
                                                    h
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    {record.average_hours.toFixed(
                                                        1,
                                                    )}
                                                    h
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <span
                                                        className={`rounded px-2 py-1 text-xs font-medium ${
                                                            record.attendance_rate >=
                                                            90
                                                                ? 'bg-green-100 text-green-800'
                                                                : record.attendance_rate >=
                                                                    75
                                                                  ? 'bg-yellow-100 text-yellow-800'
                                                                  : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {record.attendance_rate.toFixed(
                                                            1,
                                                        )}
                                                        %
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {report.length === 0 && (
                                <div className="py-8 text-center">
                                    <p className="text-gray-500">
                                        No attendance data found for the
                                        selected period.
                                    </p>
                                </div>
                            )}

                            {/* Summary Stats */}
                            {report.length > 0 && (
                                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                                    <div className="rounded-lg bg-blue-50 p-4 text-center">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {(
                                                report.reduce(
                                                    (sum, r) =>
                                                        sum + r.total_days,
                                                    0,
                                                ) / report.length
                                            ).toFixed(1)}
                                        </div>
                                        <div className="text-sm text-blue-800">
                                            Avg Total Days
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-green-50 p-4 text-center">
                                        <div className="text-2xl font-bold text-green-600">
                                            {(
                                                report.reduce(
                                                    (sum, r) =>
                                                        sum + r.present_days,
                                                    0,
                                                ) / report.length
                                            ).toFixed(1)}
                                        </div>
                                        <div className="text-sm text-green-800">
                                            Avg Present Days
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-yellow-50 p-4 text-center">
                                        <div className="text-2xl font-bold text-yellow-600">
                                            {(
                                                report.reduce(
                                                    (sum, r) =>
                                                        sum + r.total_hours,
                                                    0,
                                                ) / report.length
                                            ).toFixed(1)}
                                            h
                                        </div>
                                        <div className="text-sm text-yellow-800">
                                            Avg Total Hours
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-purple-50 p-4 text-center">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {(
                                                report.reduce(
                                                    (sum, r) =>
                                                        sum + r.attendance_rate,
                                                    0,
                                                ) / report.length
                                            ).toFixed(1)}
                                            %
                                        </div>
                                        <div className="text-sm text-purple-800">
                                            Avg Attendance Rate
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
