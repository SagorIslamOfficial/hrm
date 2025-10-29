<?php

namespace App\Modules\Attendance\Contracts;

use App\Modules\Attendance\Models\Attendance;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface AttendanceRepositoryInterface
{
    public function create(array $data): Attendance;

    public function findById(int $id): Attendance;

    public function update(Attendance $attendance, array $data): bool;

    public function delete(Attendance $attendance): bool;

    public function findByEmployeeAndDate(int $employeeId, string $date): ?Attendance;

    public function getEmployeeAttendance(int $employeeId, ?string $month = null): Collection;

    public function paginate(int $perPage = 15): LengthAwarePaginator;

    public function getMonthlyReport(?string $month = null): Collection;
}
