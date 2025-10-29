<?php

namespace App\Modules\Attendance\Http\Controllers;

use App\Modules\Attendance\Contracts\AttendanceRepositoryInterface;
use App\Modules\Attendance\Http\Requests\CheckInRequest;
use App\Modules\Attendance\Http\Requests\CheckOutRequest;
use App\Modules\Attendance\Services\AttendanceService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController
{
    public function __construct(
        private AttendanceService $attendanceService,
        private AttendanceRepositoryInterface $attendanceRepository,
    ) {}

    public function index(Request $request)
    {
        $attendances = $this->attendanceRepository->paginate($request->get('per_page', 15));

        return Inertia::render('modules/attendance/index', [
            'attendances' => $attendances,
        ]);
    }

    public function myAttendance(Request $request)
    {
        $user = $request->user();
        $employee = $user->employee; // Assuming relationship exists

        if (! $employee) {
            abort(404, 'Employee record not found');
        }

        $month = $request->get('month', now()->format('Y-m'));
        $attendances = $this->attendanceService->getEmployeeAttendance($employee->id, $month);
        $stats = $this->attendanceService->getAttendanceStats($employee->id, $month);

        return Inertia::render('modules/attendance/my-attendance', [
            'attendances' => $attendances,
            'stats' => $stats,
            'currentMonth' => $month,
        ]);
    }

    public function checkIn(CheckInRequest $request)
    {
        $user = $request->user();
        $employee = $user->employee;

        if (! $employee) {
            return response()->json(['error' => 'Employee record not found'], 404);
        }

        try {
            $attendance = $this->attendanceService->checkIn($employee->id, $request->validated());

            return response()->json([
                'message' => 'Checked in successfully',
                'attendance' => $attendance,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function checkOut(CheckOutRequest $request, int $id)
    {
        try {
            $attendance = $this->attendanceService->checkOut($id, $request->validated());

            return response()->json([
                'message' => 'Checked out successfully',
                'attendance' => $attendance,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function report(Request $request)
    {
        $month = $request->get('month', now()->format('Y-m'));
        $attendances = $this->attendanceRepository->getMonthlyReport($month);

        return Inertia::render('modules/attendance/report', [
            'attendances' => $attendances,
            'currentMonth' => $month,
        ]);
    }
}
