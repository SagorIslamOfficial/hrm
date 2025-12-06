<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserSystemSettingsController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display the system settings page.
     */
    public function index(): Response
    {
        $this->authorize('viewAny', User::class);

        return Inertia::render('settings/user-system', [
            'settings' => $this->getSettings(),
            'roles' => Role::pluck('name'),
        ]);
    }

    /**
     * Update system settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $this->authorize('viewAny', User::class);

        $validated = $request->validate([
            'user.auto_create_for_employee' => ['required', 'string', 'in:disabled,with_invite,manual'],
            'user.password.generated_length' => ['required', 'integer', 'min:8', 'max:32'],
            'user.password.send_reset_link' => ['required', 'boolean'],
            'user.email_sync_source' => ['required', 'string', 'in:user,employee,first_created'],
            'user.default_role.for_employee' => ['required', 'string', 'exists:roles,name'],
        ]);

        // For now, we'll store settings in cache (in production, use database or write to .env)
        cache()->forever('system_settings', $validated);

        return back()->with('success', 'Settings updated successfully.');
    }

    /**
     * Get current settings (from cache, config, or defaults).
     */
    private function getSettings(): array
    {
        // Try to get from cache first
        $cached = cache()->get('system_settings', []);

        return [
            'user' => [
                'auto_create_for_employee' => $cached['user']['auto_create_for_employee']
                    ?? config('user.auto_create_for_employee', 'manual'),
                'password' => [
                    'generated_length' => $cached['user']['password']['generated_length']
                        ?? config('user.password.generated_length', 12),
                    'send_reset_link' => $cached['user']['password']['send_reset_link']
                        ?? config('user.password.send_reset_link', true),
                ],
                'email_sync_source' => $cached['user']['email_sync_source']
                    ?? config('user.email_sync_source', 'first_created'),
                'default_role' => [
                    'for_employee' => $cached['user']['default_role']['for_employee']
                        ?? config('user.default_role.for_employee', 'Employee'),
                ],
            ],
        ];
    }
}
