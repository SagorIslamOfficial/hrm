<?php

namespace App\Modules\Department\Database\Seeders;

use App\Modules\Department\Models\Department;
use App\Modules\Department\Models\Designation;
use Illuminate\Database\Seeder;

class DesignationSeeder extends Seeder
{
    public function run(): void
    {
        $designationsByDepartment = [
            'HR' => [
                ['title' => 'HR Manager', 'code' => 'HR-MGR'],
                ['title' => 'HR Executive', 'code' => 'HR-EXE'],
                ['title' => 'Recruiter', 'code' => 'HR-REC'],
            ],
            'IT' => [
                ['title' => 'IT Manager', 'code' => 'IT-MGR'],
                ['title' => 'Senior Developer', 'code' => 'IT-SDEV'],
                ['title' => 'Junior Developer', 'code' => 'IT-JDEV'],
                ['title' => 'DevOps Engineer', 'code' => 'IT-DEVOPS'],
                ['title' => 'System Administrator', 'code' => 'IT-SYSADM'],
            ],
            'FIN' => [
                ['title' => 'Finance Manager', 'code' => 'FIN-MGR'],
                ['title' => 'Accountant', 'code' => 'FIN-ACC'],
                ['title' => 'Financial Analyst', 'code' => 'FIN-ANA'],
            ],
            'MKT' => [
                ['title' => 'Marketing Manager', 'code' => 'MKT-MGR'],
                ['title' => 'Marketing Executive', 'code' => 'MKT-EXE'],
                ['title' => 'Content Writer', 'code' => 'MKT-CW'],
            ],
            'SAL' => [
                ['title' => 'Sales Manager', 'code' => 'SAL-MGR'],
                ['title' => 'Sales Executive', 'code' => 'SAL-EXE'],
                ['title' => 'Business Development Manager', 'code' => 'SAL-BDM'],
            ],
            'OPS' => [
                ['title' => 'Operations Manager', 'code' => 'OPS-MGR'],
                ['title' => 'Operations Executive', 'code' => 'OPS-EXE'],
            ],
            'CS' => [
                ['title' => 'Customer Service Manager', 'code' => 'CS-MGR'],
                ['title' => 'Customer Service Representative', 'code' => 'CS-REP'],
            ],
            'ENG' => [
                ['title' => 'Engineering Manager', 'code' => 'ENG-MGR'],
                ['title' => 'Lead Engineer', 'code' => 'ENG-LEAD'],
                ['title' => 'Senior Engineer', 'code' => 'ENG-SR'],
                ['title' => 'Junior Engineer', 'code' => 'ENG-JR'],
            ],
            'LGL' => [
                ['title' => 'Legal Manager', 'code' => 'LGL-MGR'],
                ['title' => 'Legal Counsel', 'code' => 'LGL-COUNSEL'],
                ['title' => 'Compliance Officer', 'code' => 'LGL-COMP'],
            ],
            'RND' => [
                ['title' => 'R&D Manager', 'code' => 'RND-MGR'],
                ['title' => 'Senior Researcher', 'code' => 'RND-SR'],
                ['title' => 'Junior Researcher', 'code' => 'RND-JR'],
                ['title' => 'Research Analyst', 'code' => 'RND-ANA'],
            ],
            'QA' => [
                ['title' => 'QA Manager', 'code' => 'QA-MGR'],
                ['title' => 'Senior QA Engineer', 'code' => 'QA-SR'],
                ['title' => 'QA Tester', 'code' => 'QA-TESTER'],
            ],
            'BD' => [
                ['title' => 'Business Development Manager', 'code' => 'BD-MGR'],
                ['title' => 'Business Development Executive', 'code' => 'BD-EXE'],
                ['title' => 'Partnership Specialist', 'code' => 'BD-PART'],
            ],
        ];

        foreach ($designationsByDepartment as $deptCode => $designations) {
            $department = Department::where('code', $deptCode)->first();

            if ($department) {
                foreach ($designations as $designation) {
                    Designation::firstOrCreate(
                        ['code' => $designation['code']],
                        [
                            'title' => $designation['title'],
                            'description' => null,
                            'department_id' => $department->id,
                            'is_active' => true,
                        ]
                    );
                }
            }
        }
    }
}
