<?php

namespace App\Modules\Employee\Database\Factories;

use App\Models\User;
use App\Modules\Employee\Models\Employee;
use App\Modules\Employee\Models\EmployeeDocument;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EmployeeDocument>
 */
class EmployeeDocumentFactory extends Factory
{
    protected $model = EmployeeDocument::class;

    public function definition(): array
    {
        $docType = $this->faker->randomElement(['resume', 'contract', 'certificate', 'id_proof', 'other']);
        $fileName = $this->faker->word().'.pdf';

        return [
            'employee_id' => Employee::factory(),
            'doc_type' => $docType,
            'title' => $this->faker->sentence(3),
            'file_path' => 'documents/employees/'.$fileName,
            'file_name' => $fileName,
            'file_size' => $this->faker->numberBetween(100000, 5000000), // bytes
            'mime_type' => 'application/pdf',
            'expiry_date' => $this->faker->optional()->dateTimeBetween('now', '+5 years'),
            'uploaded_by' => User::factory(),
        ];
    }
}
