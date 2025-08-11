# Database Architecture

- Scalable: Core never depends on HR tables; HR can evolve without touching Core.
- Modular: You can drop in/out modules without schema breaking.
- Efficient: Minimal but necessary FKs keep joins intentional, not bloated.
- Secure: Sensitive PII stored in employee_details with its own access layer.
- Flexible: Supports employees without logins; supports users without HR profiles.

---

## Core Module New

| Table             | Fields                                                                                                                                                                                    | Purpose & Notes                                                         | Relations / FK Justification                                                                                             |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **users**         | id (PK), name, username, email, password_hash, role (`admin`, `user`, `manager`, etc.), status (`active`, `inactive`, `suspended`), created_at, updated_at, last_login_at                 | Authentication & identity only. **No HR fields** to keep Core modular.  | No FK to departments — keeps Core independent of HR.                                                                     |
| **permissions**   | id (PK), user_id (FK), module_id (FK), feature_id (FK), access_level (`create`, `read`, `update`, `delete`), scope (`all`, `department`, `self`), granted_by (FK to users.id), created_at | Fine-grained feature access. `scope` lets you filter by data ownership. | FK to `users` for who has access, FK to `modules` & `features` for what they can access, FK to `users` for `granted_by`. |
| **modules**       | id (PK), name, code (short unique), description, is_core (boolean), created_at                                                                                                            | Top-level functional areas (Core, HR, Sales…).                          | No FK — modules are independent definitions.                                                                             |
| **features**      | id (PK), module_id (FK), name, code, description, created_at                                                                                                                              | Specific actions/pages within a module.                                 | FK to `modules` — ties each feature to its parent module.                                                                |
| **notifications** | id (PK), user_id (FK), title, message, type (`info`, `warning`, `error`, `success`), read_status (boolean), created_at, read_at                                                           | Per-user system messages.                                               | FK to `users` — because notifications are delivered to a specific account.                                               |
| **audit_logs**    | id (PK), user_id (FK), module_id (FK), feature_id (FK), action, target_id, target_type, details (JSON), created_at                                                                        | Tracks important actions for compliance/security.                       | FKs to `users`, `modules`, and `features` — logs always tied to a user + the feature/module where it happened.           |
| **settings**      | id (PK), key, value, description, created_at, updated_at                                                                                                                                  | Stores global config (e.g., company name, theme).                       | No FK — settings are system-wide.                                                                                        |
| **attachments**   | id (PK), uploaded_by (FK), module_id (FK), feature_id (FK), file_name, file_path, file_type, size, created_at                                                                             | Centralized file store for any module.                                  | FK to `users` (uploader), FK to `modules` and `features` to track where the file belongs.                                |

## HR Module New

| Table                  | Fields                                                                                                                                                                           | Purpose & Notes                                                            | Relations / FK Justification                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **departments**        | id (PK), name, code, description, created_at                                                                                                                                     | Logical grouping of employees.                                             | No FK to `users` — keeps HR optional.                                                            |
| **employees**          | id (PK), user_id (FK, nullable), department_id (FK), employee_code, job_title, hire_date, employment_status (`active`, `on_leave`, `terminated`), created_at                     | Primary HR record. `user_id` nullable to allow employees without accounts. | FK to `users` (optional, to link system account), FK to `departments` for org structure.         |
| **employee_details**   | id (PK), employee_id (FK), date_of_birth, gender, phone, address, emergency_contact_name, emergency_contact_phone, national_id, tax_number, bank_account, created_at, updated_at | Sensitive extended profile.                                                | FK to `employees` — 1:1 relationship keeps PII separate and secured.                             |
| **leave_requests**     | id (PK), employee_id (FK), leave_type (`annual`, `sick`…), start_date, end_date, reason, status (`pending`, `approved`, `rejected`), approved_by (FK to users.id), created_at    | Leave tracking.                                                            | FK to `employees` (requester), FK to `users` (approver) — because approvers are system accounts. |
| **attendance_records** | id (PK), employee_id (FK), date, check_in_time, check_out_time, status (`present`, `absent`, `late`, `on_leave`), created_at                                                     | Tracks daily attendance.                                                   | FK to `employees` — attendance belongs to an employee, not directly to a `user`.                 |

---

---

## Core Module New

| Table             | Fields                                                                                                                                                                                    |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **users**         | id (PK), name, username, email, password_hash, role (`admin`, `user`, `manager`, etc.), status (`active`, `inactive`, `suspended`), created_at, updated_at, last_login_at                 |
| **permissions**   | id (PK), user_id (FK), module_id (FK), feature_id (FK), access_level (`create`, `read`, `update`, `delete`), scope (`all`, `department`, `self`), granted_by (FK to users.id), created_at |
| **modules**       | id (PK), name, code (short unique), description, is_core (boolean), created_at                                                                                                            |
| **features**      | id (PK), module_id (FK), name, code, description, created_at                                                                                                                              |
| **notifications** | id (PK), user_id (FK), title, message, type (`info`, `warning`, `error`, `success`), read_status (boolean), created_at, read_at                                                           |
| **audit_logs**    | id (PK), user_id (FK), module_id (FK), feature_id (FK), action, target_id, target_type, details (JSON), created_at                                                                        |
| **settings**      | id (PK), key, value, description, created_at, updated_at                                                                                                                                  |
| **attachments**   | id (PK), uploaded_by (FK), module_id (FK), feature_id (FK), file_name, file_path, file_type, size, created_at                                                                             |
| **sessions**      | id (PK), user_id (FK), refresh_token, ip_address, user_agent, expires_at, revoked_at, created_at                                                                                          |

## HR Module New

| Table                  | Fields                                                                                                                                                                           |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **departments**        | id (PK), name, code, description, created_at                                                                                                                                     |
| **positions**          | id (PK), department_id (FK), title, description, created_at                                                                                                                      |
| **employees**          | id (PK), user_id (FK, nullable), department_id (FK), position_id (FK), employee_code, hire_date, employment_status (`active`, `on_leave`, `terminated`), created_at              |
| **employee_details**   | id (PK), employee_id (FK), date_of_birth, gender, phone, address, emergency_contact_name, emergency_contact_phone, national_id, tax_number, bank_account, created_at, updated_at |
| **employee_documents** | id (PK), employee_id (FK), file_name, file_path, file_type, uploaded_by (FK), created_at                                                                                         |
| **leave_requests**     | id (PK), employee_id (FK), leave_type (`annual`, `sick`…), start_date, end_date, reason, status (`pending`, `approved`, `rejected`), approved_by (FK to users.id), created_at    |
| **attendance_records** | id (PK), employee_id (FK), date, check_in_time, check_out_time, status (`present`, `absent`, `late`, `on_leave`), created_at                                                     |

Purpose:

- `users` : Stores all system user accounts
- `permissions` : Manages fine-grained, per-user access rights to modules and features
- `modules` : Stores high-level system modules (Core, HR, Finance, etc.)
- `features` : Defines individual functional features within a module
- `notifications` : Stores system notifications to users
- `audit_logs` : Tracks significant system actions performed by users for accountability.
- `settings` : Stores system-wide configuration settings (company name, currency, etc.)
- `attachments` : Stores metadata for files uploaded to the system
- `sessions` : Tracks active user sessions for authentication and token management

- `departments` : Stores all organizational departments
- `positions` : Defines job titles within each department
- `employees` : Stores records for all employees in the organization
- `employee_details` : Holds sensitive personal and employment-related data
- `employee_documents` : Stores references to documents associated with an employee (employment contracts, etc.)
- `leave_requests` : Tracks employee leave applications
- `attendance_records` : Stores daily attendance logs

---

## Relationship Map

### Core Module

```bash
users -< permissions
users -< notifications
users -< audit_logs
users -< attachments
users -< sessions

modules -< features
features -< permissions
features -< audit_logs
features -< attachments

modules -< permissions
modules -< audit_logs
modules -< attachments
```

### HR Module

```bash
departments -< positions
departments -< employees

positions -< employees

employees -< employee_details (1:1)
employees -< employee_documents
employees -< leave_requests
employees -< attendance_records

employees (optional) -> users  // employees.user_id -> users.id

leave_requests (approved_by) -> users
employee_documents (uploaded_by) -> users
```

## FK List

```bash
# Core Module
permissions.user_id -> users.id
permissions.feature_id -> features.id
permissions.module_id -> modules.id
permissions.granted_by -> users.id

features.module_id -> modules.id

notifications.user_id -> users.id

audit_logs.user_id -> users.id
audit_logs.module_id -> modules.id
audit_logs.feature_id -> features.id

attachments.uploaded_by -> users.id
attachments.module_id -> modules.id
attachments.feature_id -> features.id

sessions.user_id -> users.id

# HR Module
positions.department_id -> departments.id

employees.user_id -> users.id  (nullable, optional)
employees.department_id -> departments.id
employees.position_id -> positions.id

employee_details.employee_id -> employees.id

employee_documents.employee_id -> employees.id
employee_documents.uploaded_by -> users.id

leave_requests.employee_id -> employees.id
leave_requests.approved_by -> users.id

attendance_records.employee_id -> employees.id
```
