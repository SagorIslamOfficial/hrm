<?php

namespace App\Modules\Attendance\Repositories;

use App\Modules\Attendance\Contracts\AttendanceRepositoryInterface;
use App\Modules\Attendance\Models\Attendance;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class AttendanceRepository implements AttendanceRepositoryInterface
{
    public function create(array $data): Attendance
    {
        return Attendance::create($data);
    }

    public function findById(int $id): Attendance
    {
        return Attendance::findOrFail($id);
    }

    public function update(Attendance $attendance, array $data): bool
    {
        return $attendance->update($data);
    }

    public function delete(Attendance $attendance): bool
    {
        return $attendance->delete();
    }

    public function findByEmployeeAndDate(int $employeeId, string $date): ?Attendance
    {
        return Attendance::where('employee_id', $employeeId)
            ->where('date', $date)
            ->first();
    }

    public function getEmployeeAttendance(int $employeeId, ?string $month = null): Collection
    {
        $query = Attendance::where('employee_id', $employeeId);

        if ($month) {
            $query->whereYear('date', substr($month, 0, 4))
                ->whereMonth('date', substr($month, 5, 2));
        }

        return $query->orderBy('date', 'desc')->get();
    }

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Attendance::with('employee')->paginate($perPage);
    }

    public function getMonthlyReport(?string $month = null): Collection
    {
        $query = Attendance::with('employee');

        if ($month) {
            $query->whereYear('date', substr($month, 0, 4))
                ->whereMonth('date', substr($month, 5, 2));
        }

        return $query->get();
    }
}
