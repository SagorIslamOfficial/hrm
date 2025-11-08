<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Department Module Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains configuration options for the Department module.
    |
    */

    'pagination' => [
        'per_page' => env('DEPARTMENT_PAGINATION_PER_PAGE', 15),
    ],

    'features' => [
        'enable_budget_tracking' => env('DEPARTMENT_ENABLE_BUDGET_TRACKING', true),
        'enable_location_tracking' => env('DEPARTMENT_ENABLE_LOCATION_TRACKING', true),
        'require_manager_assignment' => env('DEPARTMENT_REQUIRE_MANAGER_ASSIGNMENT', false),
    ],

    'validation' => [
        'budget_min' => 0,
        'budget_max' => 10000000, // 10 million
        'name_max_length' => 255,
        'description_max_length' => 1000,
        'location_max_length' => 255,
    ],

    'cache' => [
        'ttl' => env('DEPARTMENT_CACHE_TTL', 3600), // 1 hour
    ],
];
