<?php

return [
    /*
    |--------------------------------------------------------------------------
    | User Module Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains configuration options for the User module.
    |
    */

    'pagination' => [
        'per_page' => 10,
    ],

    /*
    |--------------------------------------------------------------------------
    | Auto-Create User Account Settings
    |--------------------------------------------------------------------------
    |
    | Configure how user accounts are created for employees.
    |
    | Options:
    | - 'disabled': Never auto-create user accounts for employees
    | - 'with_invite': Auto-create and send credentials email
    | - 'manual': Only create when explicitly requested
    |
    */
    'auto_create_for_employee' => env('USER_AUTO_CREATE_FOR_EMPLOYEE', 'manual'),

    /*
    |--------------------------------------------------------------------------
    | Password Settings
    |--------------------------------------------------------------------------
    */
    'password' => [
        // Length of auto-generated passwords
        'generated_length' => 12,

        // Include special characters in generated passwords
        'include_special_chars' => true,

        // Send password reset email along with credentials
        'send_reset_link' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Email Sync Settings
    |--------------------------------------------------------------------------
    |
    | When a User is linked to an Employee, which email takes precedence?
    |
    | Options:
    | - 'user': User's email is the source of truth (syncs to Employee)
    | - 'employee': Employee's email is the source of truth (syncs to User)
    | - 'first_created': Whichever entity was created first has precedence
    |
    */
    'email_sync_source' => env('USER_EMAIL_SYNC_SOURCE', 'first_created'),

    /*
    |--------------------------------------------------------------------------
    | Default Role Settings
    |--------------------------------------------------------------------------
    */
    'default_role' => [
        // Default role when creating user for employee
        'for_employee' => 'Employee',

        // Default role when creating standalone user
        'standalone' => null, // No default role, must be selected
    ],
];
