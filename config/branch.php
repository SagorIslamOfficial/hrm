<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Branch Module Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains configuration options for the Branch module.
    |
    */

    'types' => [
        'head_office' => 'Head Office',
        'regional_office' => 'Regional Office',
        'branch_office' => 'Branch Office',
        'sub_branch' => 'Sub Branch',
        'warehouse' => 'Warehouse',
        'sales_office' => 'Sales Office',
        'service_center' => 'Service Center',
        'others' => 'Other',
    ],

    'pagination' => [
        'per_page' => env('BRANCH_PAGINATION_PER_PAGE', 10),
    ],

    'features' => [
        'enable_hierarchical_branches' => env('BRANCH_ENABLE_HIERARCHICAL', 'true') === 'true',
        'enable_budget_tracking' => env('BRANCH_ENABLE_BUDGET_TRACKING', 'true') === 'true',
        'enable_working_hours' => env('BRANCH_ENABLE_WORKING_HOURS', 'true') === 'true',
        'require_manager_assignment' => env('BRANCH_REQUIRE_MANAGER', 'false') === 'true',
    ],

    'validation' => [
        'budget_min' => 0,
        'budget_max' => 50000000,
        'name_max_length' => 255,
        'address_max_length' => 500,
    ],

    'cache' => [
        'ttl' => env('BRANCH_CACHE_TTL', 3600),
    ],
];
