<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Complaint Module Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration options for the Complaint module.
    |
    */

    /*
    |--------------------------------------------------------------------------
    | SLA Settings
    |--------------------------------------------------------------------------
    |
    | Default SLA hours for complaints without category-specific SLA.
    |
    */
    'default_sla_hours' => env('COMPLAINT_DEFAULT_SLA_HOURS', 72),

    /*
    |--------------------------------------------------------------------------
    | Auto-escalation Settings
    |--------------------------------------------------------------------------
    |
    | Settings for automatic escalation of overdue complaints.
    |
    */
    'auto_escalation' => [
        'enabled' => env('COMPLAINT_AUTO_ESCALATION_ENABLED', true),
        'hours_before_escalation' => env('COMPLAINT_ESCALATION_HOURS', 48),
    ],

    /*
    |--------------------------------------------------------------------------
    | File Upload Settings
    |--------------------------------------------------------------------------
    |
    | Maximum file size in kilobytes and allowed file types for document uploads.
    |
    */
    'uploads' => [
        'max_size_kb' => env('COMPLAINT_MAX_UPLOAD_SIZE', 10240), // 10MB
        'allowed_extensions' => ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif', 'xls', 'xlsx', 'txt'],
        'disk' => env('COMPLAINT_UPLOAD_DISK', 'private'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Notification Settings
    |--------------------------------------------------------------------------
    |
    | Settings for complaint notifications.
    |
    */
    'notifications' => [
        'notify_on_submission' => true,
        'notify_on_status_change' => true,
        'notify_on_escalation' => true,
        'notify_on_comment' => true,
        'notify_on_resolution' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Privacy Settings
    |--------------------------------------------------------------------------
    |
    | Default privacy settings for new complaints.
    |
    */
    'privacy' => [
        'default_confidential' => true,
        'allow_anonymous' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Reminder Settings
    |--------------------------------------------------------------------------
    |
    | Settings for follow-up reminders.
    |
    */
    'reminders' => [
        'sla_warning_hours_before' => 12,
        'follow_up_days_after_resolution' => 7,
    ],
];
