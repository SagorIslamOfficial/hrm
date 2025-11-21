<?php

namespace App\Modules\HR\Organization\Branch\Database\Seeders;

use App\Modules\HR\Employee\Models\Employee;
use App\Modules\HR\Organization\Branch\Models\Branch;
use Illuminate\Database\Seeder;

class BranchManagerSeeder extends Seeder
{
    public function run(): void
    {
        $branches = Branch::all();
        $employees = Employee::all();

        if ($employees->isEmpty()) {
            return;
        }

        // Assign managers to branches
        foreach ($branches as $branch) {
            // Assign a random employee as manager
            $manager = $employees->random();

            $branch->update([
                'manager_id' => $manager->id,
            ]);
        }
    }
}
