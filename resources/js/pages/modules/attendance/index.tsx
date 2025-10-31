import {
    formatDateForDisplay,
    formatTimeForDisplay,
} from '@/components/common';
import { Head, Link } from '@inertiajs/react';

interface Attendance {
    id: number;
    employee: {
        id: number;
        first_name: string;
        last_name: string;
        employee_id: string;
    };
    check_in: string;
    check_out: string | null;
    work_hours: number | null;
    status: string;
    notes: string | null;
}

interface Props {
    attendances: {
        data: Attendance[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    todayStats: {
        total_check_ins: number;
        total_check_outs: number;
        average_hours: number;
    };
}

export default function Index({ attendances, todayStats }: Props) {
    return (
        <>
            <Head title="Attendance Records" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6 flex items-center justify-between">
                                <h1 className="text-2xl font-bold">
                                    Attendance Records
                                </h1>
                                <div className="space-x-2">
                                    <Link
                                        href="/attendance/my"
                                        className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
                                    >
                                        My Attendance
                                    </Link>
                                    <Link
                                        href="/attendance/report"
                                        className="rounded bg-purple-500 px-4 py-2 font-bold text-white hover:bg-purple-700"
                                    >
                                        Reports
                                    </Link>
                                </div>
                            </div>

                            {/* Today's Stats */}
                            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="rounded-lg bg-blue-50 p-4">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {todayStats.total_check_ins}
                                    </div>
                                    <div className="text-sm text-blue-800">
                                        Check-ins Today
                                    </div>
                                </div>
                                <div className="rounded-lg bg-green-50 p-4">
                                    <div className="text-2xl font-bold text-green-600">
                                        {todayStats.total_check_outs}
                                    </div>
                                    <div className="text-sm text-green-800">
                                        Check-outs Today
                                    </div>
                                </div>
                                <div className="rounded-lg bg-yellow-50 p-4">
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {todayStats.average_hours.toFixed(1)}h
                                    </div>
                                    <div className="text-sm text-yellow-800">
                                        Average Hours
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-2 text-left">
                                                Employee
                                            </th>
                                            <th className="px-4 py-2 text-left">
                                                Date
                                            </th>
                                            <th className="px-4 py-2 text-left">
                                                Check In
                                            </th>
                                            <th className="px-4 py-2 text-left">
                                                Check Out
                                            </th>
                                            <th className="px-4 py-2 text-left">
                                                Hours
                                            </th>
                                            <th className="px-4 py-2 text-left">
                                                Status
                                            </th>
                                            <th className="px-4 py-2 text-left">
                                                Notes
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendances.data.map((attendance) => (
                                            <tr
                                                key={attendance.id}
                                                className="border-t"
                                            >
                                                <td className="px-4 py-2 font-medium">
                                                    {
                                                        attendance.employee
                                                            .first_name
                                                    }{' '}
                                                    {
                                                        attendance.employee
                                                            .last_name
                                                    }
                                                    <br />
                                                    <span className="text-sm text-gray-500">
                                                        (
                                                        {
                                                            attendance.employee
                                                                .employee_id
                                                        }
                                                        )
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2">
                                                    {formatDateForDisplay(
                                                        attendance.check_in,
                                                    )}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {formatTimeForDisplay(
                                                        attendance.check_in,
                                                    )}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {attendance.check_out
                                                        ? formatTimeForDisplay(
                                                              attendance.check_out,
                                                          )
                                                        : 'Not checked out'}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {attendance.work_hours
                                                        ? `${attendance.work_hours.toFixed(2)}h`
                                                        : 'N/A'}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <span
                                                        className={`rounded px-2 py-1 text-xs ${
                                                            attendance.status ===
                                                            'present'
                                                                ? 'bg-green-100 text-green-800'
                                                                : attendance.status ===
                                                                    'late'
                                                                  ? 'bg-yellow-100 text-yellow-800'
                                                                  : attendance.status ===
                                                                      'absent'
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                    >
                                                        {attendance.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2">
                                                    {attendance.notes || 'N/A'}
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
