<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Employee Module Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains configuration options for the Employee module.
    |
    */

    'pagination' => [
        'per_page' => 15,
    ],

    'features' => [
        'enable_bulk_actions' => true,
        'enable_export' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Document Types
    |--------------------------------------------------------------------------
    |
    | Define the types of documents that can be uploaded for employees.
    |
    */
    'document_types' => [
        'contract' => 'Employment Contract',
        'offer_letter' => 'Offer Letter',
        'resume' => 'Resume/CV',
        'certificate' => 'Educational Certificate',
        'id_proof' => 'ID Proof (NID/Passport)',
        'medical' => 'Medical Certificate',
        'police_clearance' => 'Police Clearance',
        'reference' => 'Reference Letter',
        'resignation' => 'Resignation Letter',
        'termination' => 'Termination Letter',
        'appraisal' => 'Performance Appraisal',
        'training' => 'Training Certificate',
        'other' => 'Other Documents',
    ],

    /*
    |--------------------------------------------------------------------------
    | Document Upload Settings
    |--------------------------------------------------------------------------
    */
    'documents' => [
        'max_file_size' => 10240, // 10MB
        'allowed_mimes' => ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
        'expiry_alert_days' => 30, // Show alert when document expires within 30 days
    ],
];
