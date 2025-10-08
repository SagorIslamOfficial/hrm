# HRM Application Development Roadmap

**Stack:** Laravel 12 + React + TypeScript (Inertia.js) + MySQL

---

## Phase 1: Foundation & Setup (Weeks 1-2)

### Project Architecture & Setup

- [x] Install Laravel 12, configure environment variables, set up DB, mail, and code versioning.
- [x] Install and configure Inertia.js with React and TypeScript.
- [x] Set up modular directory structure (`/modules`, `/resources/js/pages`).
- [x] Configure Git, ESLint, and Prettier.

### Core Architecture Implementation

- [x] Implement SOLID design:
    - [x] Single Responsibility Principle via focused services.
    - [x] Interfaces + extensible abstractions, dependency injection.
- [x] Set up repository pattern and service layer.
- [x] Install and configure Laravel Pennant (feature flags) and frontend integration.
- [x] Prepare PEST and Testing Library (React).

### Authentication & Authorization Foundation

- [x] Use Laravel’s built-in session-based auth.
- [x] Set up custom registration/login forms in React (Inertia approach).
- [x] Install Spatie Permission for roles/permissions (Admin, HR, Manager, Employee).
- [x] Create middleware for role-based navigation and protected pages.
- [x] Enable Rate limiting.

### Week 2: Database Design & Migrations

- [ ] Design full schema (ERD), plan relationships, soft deletes, and indexing.
- [ ] Write migrations for key entities, use UUID primary keys.
- [x] Create seeders/factories for users and roles.
- [x] Set up backup (spatie/laravel-backup).

---

## Phase 2: Core HR Modules (Weeks 3-5)

### Week 3: Employee Database & Profiles

- [ ] Build Employee model (personal, contact, job, bank details).
- [ ] Set up relations: department, manager, emergency contacts.
- [ ] CRUD via repositories; add validation, list/search UI, and profile views.
- [ ] Profile picture/document upload & import/export (CSV).
- [ ] Version and audit important fields.

### Week 3: Organization Structure

- [ ] Create Department, Team, and JobTitle models; define hierarchy.
- [ ] Use nested sets/table for org chart and reporting lines.
- [ ] Build management pages for structure editing.
- [ ] Interactive React org chart (tree or drag/drop).
- [ ] Add reporting line management/delegation.

### Week 4: Employee Self-Service (ESS)

- [ ] Build ESS dashboard: notifications, events, company directory.
- [ ] Self-edit of specific profile fields, emergency contacts.
- [ ] Download policies, handbooks, and company forms.
- [ ] Submit change requests for restricted data (with approval).
- [ ] Log all ESS actions.

### Week 5: Document Management

- [ ] Document storage with categories (local/cloud).
- [ ] Access control (role-based), document versioning.
- [ ] React file viewer/upload UI with progress, previews, and approval workflow.
- [ ] Track expirations, automate renewal reminders.

---

## Phase 3: Workforce Management (Weeks 6-9)

### Week 6: Attendance Tracking

- [ ] Attendance model: in/out, location, overtime, shift rules.
- [ ] React: clock-in/out, calendar heatmap, manual entry with justification.
- [ ] Supervisor correction approval, bulk imports, live dashboards.
- [ ] Late/absent/attendance scoring algorithms and analytics/reporting (not sure how much I can do about that).

### Week 7: Leave & Holiday Management

- [ ] Leave/LeaveType/public holiday models.
- [ ] Leave accrual, policy builder per role/location.
- [ ] Multi-level leave approval, self-serve calendar UI.
- [ ] Reporting: usage, patterns, overlap, and forecasts.

### Week 8: Biometric/Device Integration & Advanced Reports

- [ ] Import attendance from devices, process data, and handle exceptions/duplicates.
- [ ] Real-time and predicted absentee monitoring.
- [ ] Labor law and compliance report templates.
- [ ] Export engines for external payroll/accounting systems.

### Week 9: Remote/Hybrid Work Management (not sure about that -- will touch them after all)

- [ ] Log work locations, approve remote days, and hybrid schedules.
- [ ] Productivity, compliance checks, virtual presence indicators.
- [ ] Desk/meeting room/shift bookings for hybrid teams.
- [ ] Dashboard for real-time team status.

---

## Phase 4: Payroll & Compensation (Weeks 10-12)

### Week 10: Payroll Processing

- [ ] Payroll & PayrollItem models for salary structures (base, OT, bonus, deductions).
- [ ] Attendance-linked salary calculations, approval workflows.
- [ ] Payroll finalization/locking process, revision tracking.
- [ ] Bank file and direct transfer export logic.

### Week 11: Payslips & Statements

- [ ] Payslip PDF generator (multi-language/branding).
- [ ] ESS payslip viewer & downloadable archive.
- [ ] Secure access logs, salary history, and compliance retention.

### Week 11: Expense Claims & Reimbursements

- [ ] Expense models (categories, rules), claim forms, validation engine.
- [ ] Receipt OCR and storage, approval ladder, claim batch actions.
- [ ] Sync approved claims to the monthly payroll.

### Week 12: Bonuses & Incentives

- [ ] Bonus/BonusScheme models, performance, and custom formula handling.
- [ ] React configuration UI for bonuses and scenarios.
- [ ] Scheduling, approval, full audit trail.

---

## Phase 5: Performance & Analytics (Weeks 13-15)

### Week 13: Goal & OKR Management

- [ ] Goal/Objective/KeyResult models, templates, and company-to-user linking.
- [ ] OKR dashboard (progress, status, comments).
- [ ] Quarterly achievement & goal alignment visualizations.

### Week 14: Performance Reviews / 360° Feedback

- [ ] Review/Feedback models, flexible review cycles (annual/quarterly).
- [ ] Manager, peer, self-assessments; anonymized feedback.
- [ ] Scheduling/forms/drafting in React, calibration tools.

### Week 15: Skill Matrix & Career Development

- [ ] Skill/Assessment models, career ladders, and gaps analysis.
- [ ] Suggested upskilling, learning path, certifications.
- [ ] Visualization: team skill heatmaps, path explorer.

---

## Phase 6: Advanced/Compliance/Deployment (Weeks 16-20)

### Week 16: Compliance & Security

- [ ] Consent/privacy logs (GDPR, right-to-be-forgotten).
- [ ] Certification/training tracking and expiring alert mailbox.
- [ ] Health & safety/ticketing/audit logs.
- [ ] Full encryption, access control, and incident monitoring.

### Week 17-18: Recruitment Module (Advanced)

- [ ] Applicant/job models, pipeline manager, sourcing stats.
- [ ] Job posting UI, apply flow, resume parsing.
- [ ] Interview scheduling/feedback, candidate comms automation.

### Week 19: Testing, Optimization, Deployment

- [ ] Full-stack unit, integration, E2E, and performance tests.
- [ ] DB/caching optimization (Redis), lazy loading, CDN/image optimizations.
- [ ] Security: penetration/GDPR audit, HTTPS/hardening, backup drills.
- [ ] CI/CD scripts, doc handoff, monitoring/alert setups, user UAT.

### Week: Advanced Features & AI (after all)

- [ ] Retention prediction models, automated alerts.
- [ ] Elastic/advanced search, recommendation engines.
- [ ] Mobile PWA, offline support, notification push, chatbot integration.
