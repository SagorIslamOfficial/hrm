import {
    formatDateForDisplay,
    formatTimeForDisplay,
} from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { index as attendanceIndex } from '@/routes/attendance/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Calendar, Clock, LogIn, LogOut, TrendingUp } from 'lucide-react';

interface Attendance {
    id: number;
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
    todayAttendance: Attendance | null;
    canCheckIn: boolean;
    canCheckOut: boolean;
    stats: {
        this_month_hours: number;
        this_week_hours: number;
        average_daily_hours: number;
        attendance_rate: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Attendance',
        href: attendanceIndex().url,
    },
    {
        title: 'My Attendance',
        href: '/attendance/my',
    },
];

export default function MyAttendance({
    attendances,
    todayAttendance,
    canCheckIn,
    canCheckOut,
    stats,
}: Props) {
    const { post, processing: checkInProcessing } = useForm();
    const { put, processing: checkOutProcessing } = useForm();

    const handleCheckIn = () => {
        post('/attendance/check-in');
    };

    const handleCheckOut = () => {
        if (todayAttendance) {
            put(`/attendance/check-out/${todayAttendance.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Attendance" />

            <div className="mx-auto flex h-full w-7xl flex-1 flex-col gap-8 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div>
                            <h1 className="text-2xl font-bold">
                                My Attendance
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Track your daily attendance and work hours
                            </p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={attendanceIndex().url}>All Records</Link>
                    </Button>
                </div>

                {/* Today's Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="size-5" />
                            Today's Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-4">
                                {todayAttendance ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">
                                                Check-in:
                                            </span>
                                            <Badge variant="default">
                                                {formatTimeForDisplay(
                                                    todayAttendance.check_in,
                                                )}
                                            </Badge>
                                        </div>
                                        {todayAttendance.check_out && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">
                                                    Check-out:
                                                </span>
                                                <Badge variant="secondary">
                                                    {formatTimeForDisplay(
                                                        todayAttendance.check_out,
                                                    )}
                                                </Badge>
                                            </div>
                                        )}
                                        {todayAttendance.work_hours && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">
                                                    Work Hours:
                                                </span>
                                                <Badge variant="outline">
                                                    {todayAttendance.work_hours}
                                                    h
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No attendance record for today
                                    </p>
                                )}

                                <div className="flex gap-2">
                                    {canCheckIn && (
                                        <Button
                                            onClick={handleCheckIn}
                                            disabled={checkInProcessing}
                                            className="flex items-center gap-2"
                                        >
                                            <LogIn className="size-4" />
                                            {checkInProcessing
                                                ? 'Checking In...'
                                                : 'Check In'}
                                        </Button>
                                    )}
                                    {canCheckOut && (
                                        <Button
                                            onClick={handleCheckOut}
                                            disabled={checkOutProcessing}
                                            variant="outline"
                                            className="flex items-center gap-2"
                                        >
                                            <LogOut className="size-4" />
                                            {checkOutProcessing
                                                ? 'Checking Out...'
                                                : 'Check Out'}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="space-y-3">
                                <h3 className="flex items-center gap-2 font-semibold">
                                    <TrendingUp className="size-4" />
                                    This Month
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Total Hours:</span>
                                        <span className="font-medium">
                                            {stats.this_month_hours}h
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Attendance Rate:</span>
                                        <span className="font-medium">
                                            {stats.attendance_rate}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Average Daily:</span>
                                        <span className="font-medium">
                                            {stats.average_daily_hours}h
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Attendance History */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="size-5" />
                            Attendance History
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {attendances.data.length === 0 ? (
                                <p className="py-8 text-center text-muted-foreground">
                                    No attendance records found
                                </p>
                            ) : (
                                attendances.data.map((attendance) => (
                                    <div
                                        key={attendance.id}
                                        className="flex items-center justify-between rounded-lg border p-4"
                                    >
                                        <div className="space-y-1">
                                            <p className="font-medium">
                                                {formatDateForDisplay(
                                                    attendance.check_in,
                                                )}
                                            </p>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span>
                                                    Check-in:{' '}
                                                    {formatTimeForDisplay(
                                                        attendance.check_in,
                                                    )}
                                                </span>
                                                {attendance.check_out && (
                                                    <span>
                                                        Check-out:{' '}
                                                        {formatTimeForDisplay(
                                                            attendance.check_out,
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            {attendance.work_hours && (
                                                <Badge variant="outline">
                                                    {attendance.work_hours}h
                                                    worked
                                                </Badge>
                                            )}
                                            <p className="text-sm text-muted-foreground capitalize">
                                                {attendance.status}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
