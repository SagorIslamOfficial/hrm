<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\LinkEmployeeRequest;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Models\User;
use App\Modules\HR\Employee\Models\Employee;
use App\Services\UserService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private UserService $userService
    ) {}

    /**
     * Display a listing of users.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', User::class);

        $users = User::with(['roles', 'employee:id,first_name,last_name,employee_code'])
            ->select(['id', 'name', 'email', 'employee_id', 'status', 'created_at'])
            ->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 10));

        return Inertia::render('users/index', [
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create(): Response
    {
        $this->authorize('create', User::class);

        $roles = Role::select('id', 'name')->orderBy('name')->get();
        $unlinkedEmployees = Employee::doesntHave('user')
            ->select('id', 'first_name', 'last_name', 'employee_code', 'email', 'employment_status')
            ->orderBy('first_name')
            ->get();

        return Inertia::render('users/create', [
            'roles' => $roles,
            'employees' => $unlinkedEmployees,
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $this->authorize('create', User::class);

        $user = $this->userService->createUser($request->validated());

        return redirect()
            ->route('users.show', $user)
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): Response
    {
        $this->authorize('view', $user);

        $user->load(['roles', 'creator:id,name', 'employee:id,first_name,last_name,employee_code,photo,department_id,designation_id,email', 'employee.department:id,name', 'employee.designation:id,title']);

        return Inertia::render('users/show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user): Response
    {
        $this->authorize('update', $user);

        // Refresh to get latest data from database
        $user = $user->fresh(['roles', 'employee']);

        $roles = Role::select('id', 'name')->orderBy('name')->get();
        $unlinkedEmployees = Employee::doesntHave('user')
            ->select('id', 'first_name', 'last_name', 'employee_code', 'email', 'employment_status')
            ->orderBy('first_name')
            ->get();

        // Include current linked employee in the list
        if ($user->employee) {
            $unlinkedEmployees->prepend($user->employee);
        }

        return Inertia::render('users/edit', [
            'user' => $user,
            'roles' => $roles,
            'employees' => $unlinkedEmployees,
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $this->userService->updateUser($user, $request->validated());

        return redirect()
            ->route('users.show', $user)
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user.
     */
    public function destroy(User $user): RedirectResponse
    {
        $this->authorize('delete', $user);

        // Prevent self-deletion
        if ($user->id === Auth::id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $this->userService->deleteUser($user);

        return redirect()
            ->route('users.index')
            ->with('success', 'User deleted successfully.');
    }

    /**
     * Link an employee to a user.
     */
    public function linkEmployee(LinkEmployeeRequest $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $this->userService->linkEmployee($user, $request->validated('employee_id'));

        return back()->with('success', 'Employee linked successfully.');
    }

    /**
     * Unlink employee from a user.
     */
    public function unlinkEmployee(User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $this->userService->unlinkEmployee($user);

        return back()->with('success', 'Employee unlinked successfully.');
    }

    /**
     * Update user status (active, inactive, terminated).
     */
    public function updateStatus(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);
        $this->authorize('manage-others');

        $validated = $request->validated();

        $this->userService->updateUserStatus($user, $validated['status']);

        return back()->with('success', "User status updated to {$validated['status']}.");
    }

    /**
     * Send welcome email with user credentials and password reset link.
     */
    public function sendWelcomeEmail(User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $this->userService->sendWelcomeEmail($user);

        return redirect()->back()->with('success', "Welcome email sent to {$user->email}.");
    }
}
