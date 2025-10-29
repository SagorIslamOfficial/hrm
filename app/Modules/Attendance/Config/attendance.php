<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Attendance Module Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains configuration options for the Attendance module.
    |
    */

    'work_hours' => [
        'standard_workday_hours' => env('ATTENDANCE_STANDARD_WORKDAY_HOURS', 8.0),
        'grace_period_minutes' => env('ATTENDANCE_GRACE_PERIOD_MINUTES', 15),
        'overtime_threshold_hours' => env('ATTENDANCE_OVERTIME_THRESHOLD_HOURS', 8.0),
        'minimum_work_hours' => env('ATTENDANCE_MINIMUM_WORK_HOURS', 4.0),
    ],

    'time_settings' => [
        'timezone' => env('ATTENDANCE_TIMEZONE', 'UTC'),
        'check_in_start' => env('ATTENDANCE_CHECK_IN_START', '08:00'),
        'check_in_end' => env('ATTENDANCE_CHECK_IN_END', '10:00'),
        'check_out_start' => env('ATTENDANCE_CHECK_OUT_START', '17:00'),
        'check_out_end' => env('ATTENDANCE_CHECK_OUT_END', '19:00'),
    ],

    'features' => [
        'enable_auto_checkout' => env('ATTENDANCE_ENABLE_AUTO_CHECKOUT', false),
        'enable_location_tracking' => env('ATTENDANCE_ENABLE_LOCATION_TRACKING', false),
        'enable_ip_restriction' => env('ATTENDANCE_ENABLE_IP_RESTRICTION', false),
        'enable_mobile_checkin' => env('ATTENDANCE_ENABLE_MOBILE_CHECKIN', true),
        'require_notes_for_late' => env('ATTENDANCE_REQUIRE_NOTES_FOR_LATE', true),
    ],

    'pagination' => [
        'per_page' => env('ATTENDANCE_PAGINATION_PER_PAGE', 25),
        'reports_per_page' => env('ATTENDANCE_REPORTS_PER_PAGE', 50),
    ],

    'validation' => [
        'notes_max_length' => 500,
        'max_hours_per_day' => env('ATTENDANCE_MAX_HOURS_PER_DAY', 16.0),
    ],

    'cache' => [
        'ttl' => env('ATTENDANCE_CACHE_TTL', 1800), // 30 minutes
        'stats_ttl' => env('ATTENDANCE_STATS_CACHE_TTL', 3600), // 1 hour
    ],

    'reports' => [
        'default_date_range_days' => env('ATTENDANCE_REPORT_DEFAULT_DAYS', 30),
        'max_date_range_days' => env('ATTENDANCE_REPORT_MAX_DAYS', 365),
    ],
];
