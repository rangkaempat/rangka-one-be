# Enterprise System Guide

---

A **comprehensive list of databases** (tables/collections), designed with **modularity, reusability, and scalability** in mind. Each database includes:

- Its **purpose**
- Its **key relationships** to other databases
- **Why** the connection exists
- Follows **normalized relational DB design** and **modular boundaries** (each module owns its DBs but can reference shared entities like `User`, `Department`, etc.)

---

## 🧩 CORE SYSTEM DATABASES

These are global and shared across all systems/modules.

---

### 1. **Users**

- Purpose: Stores all users of the system.
- Key Fields: `id`, `name`, `email`, `role`, `department_id`, `organization_id`,
- Relations:

  - ➡️ `Department` (many-to-one) – for access control
  - ➡️ `Organization` (many-to-one) – for multi-tenant support
  - ⬅️ Used by nearly all systems (HR, Finance, Sales, etc.)

- Why: Central identity for authentication and RBAC (role-based access control)

---

### 2. **Departments**

- Purpose: Organizational grouping of users.
- Key Fields: `id`, `name`, `parent_id` (nullable for sub-departments)
- Relations:

  - ⬅️ `Users` (one-to-many)
  - ⬅️ `Permissions` (many-to-many via pivot)

- Why: Departments define **module/system access** beyond just roles.

---

### 3. **Organizations**

- Purpose: Company-level abstraction (multi-tenant support).
- Key Fields: `id`, `name`, `plan`, `active_modules`
- Relations:

  - ⬅️ `Users`, `Departments`, `Modules`, etc.

- Why: For reuse across different clients (e.g., Hyrax Oil, other companies).

---

### 4. **Permissions / AccessMatrix**

- Purpose: Define who can access what system/module.
- Key Fields: `id`, `department_id`, `module_key`, `can_read`, `can_write`, etc.
- Relations:

  - ➡️ `Departments`
  - ➡️ `Modules`

- Why: Granular permission control, extensible.

---

### 5. **Modules**

- Purpose: Registered list of available systems/modules.
- Key Fields: `id`, `name`, `key`, `description`, `is_active`
- Relations:

  - ⬅️ Referenced by `Permissions`, `Organizations`

- Why: Enables feature toggling and modular system control.

---

---

## 👥 HUMAN RESOURCE SYSTEM DATABASES

---

### 7. **Employees**

- Purpose: Full profile separate from `Users` (e.g., private HR info)
- Fields: `user_id`, `employee_code`, `positionW`, `salary`, `join_date`
- Relations:

  - ➡️ `Users` (one-to-one)
  - ⬅️ `LeaveRequests`, `Attendance`, `Payroll`

- Why: Decouple system login from HR-specific data.

---

### 8. **AttendanceRecords**

- Purpose: Clock-in/out logs
- Fields: `employee_id`, `date`, `clock_in`, `clock_out`, `method`
- Relations:

  - ➡️ `Employees` (many-to-one)

- Why: Time tracking per employee

---

### 9. **LeaveRequests**

- Purpose: Leave applications
- Fields: `employee_id`, `leave_type_id`, `start_date`, `end_date`, `status`
- Relations:

  - ➡️ `Employees`
  - ➡️ `LeaveTypes`

- Why: Modular leave management

---

### 10. **LeaveTypes**

- Purpose: Types of leave (sick, annual, etc.)
- Fields: `id`, `name`, `max_days`, `carry_forward`
- Relations:

  - ⬅️ `LeaveRequests`

- Why: Extendable leave policies

---

### 11. **Payroll**

- Purpose: Monthly salary data
- Fields: `employee_id`, `month`, `base_salary`, `deductions`, `net_pay`
- Relations:

  - ➡️ `Employees`

- Why: Maintain historical payroll data

---

---

## 💼 SALES / CRM SYSTEM DATABASES

---

### 12. **Clients**

- Purpose: Customer data
- Fields: `id`, `name`, `industry`, `contact_person`, `sales_rep_id`
- Relations:

  - ➡️ `Users` (sales_rep)
  - ⬅️ `Costings`, `Proposals`, `Invoices`

- Why: CRM central point

---

### 13. **Costings**

- Purpose: Cost calculations for projects/products
- Fields: `client_id`, `created_by`, `items`, `total_amount`
- Relations:

  - ➡️ `Clients`
  - ➡️ `Users` (creator)
  - ⬅️ `Proposals`, `FinanceApprovals`

- Why: Used by Sales & Finance

---

### 14. **Proposals**

- Purpose: Proposal docs for clients
- Fields: `client_id`, `costing_id`, `pdf_url`, `status`
- Relations:

  - ➡️ `Clients`
  - ➡️ `Costings`
  - ➡️ `Users` (created_by)

- Why: Reuse costings in sales proposals

---

---

## 💰 FINANCE SYSTEM DATABASES

---

### 15. **Invoices**

- Purpose: Billing to clients
- Fields: `client_id`, `amount`, `status`, `due_date`, `costing_id`
- Relations:

  - ➡️ `Clients`
  - ➡️ `Costings`

- Why: Linked to costing → proposal → invoice chain

---

### 16. **Expenses**

- Purpose: Track company expenses
- Fields: `category`, `amount`, `paid_by_user_id`, `department_id`, `date`
- Relations:

  - ➡️ `Users`
  - ➡️ `Departments`

- Why: Department-wise financial tracking

---

### 17. **FinanceApprovals**

- Purpose: Approval logs for costing, expenses, payroll
- Fields: `related_table`, `related_id`, `approved_by`, `status`
- Relations:

  - ➡️ `Users`

- Why: Unified approval tracker

---

---

## 🏭 PRODUCTION SYSTEM DATABASES

---

### 18. **ProductionOrders**

- Purpose: Production run info
- Fields: `id`, `product`, `quantity`, `scheduled_date`, `status`
- Relations:

  - ➡️ `Users` (created_by, approved_by)
  - ⬅️ `QALogs`

- Why: Production planning

---

### 19. **InventoryItems**

- Purpose: Raw materials, WIP, finished goods
- Fields: `sku`, `name`, `type`, `quantity`, `location`
- Relations:

  - ⬅️ `StockMovements`

- Why: Stock control

---

### 20. **StockMovements**

- Purpose: Logs for inventory changes
- Fields: `item_id`, `type`, `quantity`, `from`, `to`, `user_id`
- Relations:

  - ➡️ `InventoryItems`
  - ➡️ `Users`

- Why: Audit trail

---

---

## ✅ QA SYSTEM DATABASES

---

### 21. **QAChecks**

- Purpose: QA checklist results
- Fields: `production_order_id`, `checklist_id`, `status`, `inspected_by`
- Relations:

  - ➡️ `ProductionOrders`
  - ➡️ `Users`

- Why: Quality validation

---

### 22. **Checklists**

- Purpose: Reusable templates
- Fields: `name`, `items[]`
- Relations:

  - ⬅️ `QAChecks`

- Why: DRY quality standards

---

### 23. **NCRs (Non-Conformance Reports)**

- Purpose: Quality issue reports
- Fields: `qa_check_id`, `description`, `action_taken`, `resolved_by`
- Relations:

  - ➡️ `QAChecks`
  - ➡️ `Users`

- Why: Continuous improvement

---

---

## 📊 STRATEGY & ANALYTICS DATABASES

---

### 24. **KPIRecords**

- Purpose: Track progress vs goals
- Fields: `department_id`, `title`, `target`, `current`, `updated_by`
- Relations:

  - ➡️ `Departments`
  - ➡️ `Users`

- Why: Strategy-level goal tracking

---

### 25. **Projects**

- Purpose: Strategic or departmental projects
- Fields: `title`, `department_id`, `start_date`, `end_date`, `status`
- Relations:

  - ➡️ `Departments`
  - ➡️ `Users` (manager, contributors)

- Why: Project tracking

---

---

## 🧱 Cross-Module Utilities

### 26. **Notifications**

- Purpose: System-wide alerts
- Fields: `user_id`, `type`, `content`, `read_at`
- Relations:

  - ➡️ `Users`

- Why: Internal communication

---

### 27. **AuditLogs**

- Purpose: Tracks changes to important data
- Fields: `table_name`, `row_id`, `action`, `performed_by`, `timestamp`
- Relations:

  - ➡️ `Users`

- Why: Compliance, debugging, traceability

---

### 28. **Documents**

- Purpose: Uploads and attachments
- Fields: `url`, `type`, `linked_to_table`, `linked_to_id`
- Relations:

  - Dynamic via table references

- Why: Modular file attachment system

---

## ✅ Notes on Design Principles

- **All foreign keys are indexed** for speed and referential integrity.
- All systems relate to `Users`, `Departments`, and optionally `Organizations`.
- Use **soft deletes** for auditability.
- **AuditLogs** and **Documents** are shared utilities across all modules.
- You can add **multi-language/localization** fields later (e.g., `name_en`, `name_ms`).
- Use **UUIDs** as primary keys for all tables for global uniqueness.

---

Would you like:

- A visual **relational map (ERD)** generated?
- A folder-based backend architecture matching these modules?
- Seed data templates for each of these databases?

Let me know and I’ll prepare them for you.

---

## ✅ Revised Role Architecture Decision

You’ve decided:

- **System-level roles are only**: `["admin", "user"]`, placed **directly inside the `users` table**.
- Department-based **access levels or positions (e.g. manager, executive)** should influence module permission granularity.

This is **perfect** for:

- Simplifying global roles
- Keeping admin vs non-admin logic clean
- Allowing departments to scale access rules without overcomplicating the role table

---

## 🧠 Recommended Access Flow (Best Practice)

```text
User → Organization → Department → Position → AccessMatrix (Permissions) → Module Access
```

Here’s how access decisions happen:

| Level                        | Usage                                                 |
| ---------------------------- | ----------------------------------------------------- |
| **System Role (user/admin)** | Basic gatekeeping (admin dashboard, logged in routes) |
| **Organization**             | Multi-tenant boundary                                 |
| **Department**               | Grouping of users by function (HR, Sales, etc.)       |
| **Position / Title**         | Varying privilege level (e.g., manager vs executive)  |
| **Permissions**              | Final decision-maker for access per module/action     |

---

## 🧩 Updated Core Tables (Schemas)

### 1. **users**

| Field                       | Type            | Notes                     |
| --------------------------- | --------------- | ------------------------- |
| `id`                        | UUID (PK)       |                           |
| `name`                      | String          |                           |
| `email`                     | String (Unique) |                           |
| `password`                  | String          | Hashed                    |
| `roles`                     | Array<String>   | `["admin"]` or `["user"]` |
| `organization_id`           | UUID (FK)       | ↪ `organizations.id`      |
| `department_id`             | UUID (FK)       | ↪ `departments.id`        |
| `position_id`               | UUID (FK)       | ↪ `positions.id`          |
| `is_active`                 | Boolean         | Default true              |
| `created_at` / `updated_at` | Timestamp       |                           |

🔗 **References**:

- ➡️ `organization_id → organizations`
- ➡️ `department_id → departments`
- ➡️ `position_id → positions` ← New addition

---

### 2. **departments**

| Field                       | Type            | Notes                                  |
| --------------------------- | --------------- | -------------------------------------- |
| `id`                        | UUID (PK)       |                                        |
| `name`                      | String          | E.g., "Human Resources"                |
| `parent_id`                 | UUID (nullable) | For sub-departments (↪ self-reference) |
| `organization_id`           | UUID (FK)       | ↪ `organizations.id`                   |
| `created_at` / `updated_at` | Timestamp       |                                        |

🔗 References:

- ⬅️ From `users`
- ⬅️ From `positions`
- ⬅️ From `permissions`

---

### 3. **positions**

| Field                       | Type      | Notes                                                |
| --------------------------- | --------- | ---------------------------------------------------- |
| `id`                        | UUID (PK) |                                                      |
| `title`                     | String    | E.g., "Executive", "Manager", "Assistant Manager"    |
| `level`                     | Int       | Optional: hierarchy indicator (higher = more access) |
| `department_id`             | UUID (FK) | ↪ `departments.id`                                   |
| `organization_id`           | UUID (FK) | ↪ `organizations.id`                                 |
| `created_at` / `updated_at` | Timestamp |                                                      |

🔗 Used by:

- ⬅️ `users` (to define internal access level)
- ➡️ `permissions` (to customize per title)

✅ **This solves** your question about internal access variation within a department.

---

### 4. **organizations**

| Field                       | Type                  | Notes                     |
| --------------------------- | --------------------- | ------------------------- |
| `id`                        | UUID (PK)             |                           |
| `name`                      | String                |                           |
| `plan`                      | String                | Optional (for SaaS)       |
| `active_modules`            | JSON or Array<String> | E.g., `["hr", "finance"]` |
| `created_at` / `updated_at` | Timestamp             |                           |

🔗 Referenced by:

- ⬅️ `users`, `departments`, `positions`, `permissions`

---

### 5. **modules**

| Field                       | Type      | Notes                                    |
| --------------------------- | --------- | ---------------------------------------- |
| `id`                        | UUID (PK) |                                          |
| `name`                      | String    | Human-readable                           |
| `key`                       | String    | Slug/identifier (e.g., `costing_system`) |
| `description`               | String    |                                          |
| `is_active`                 | Boolean   | Globally or per org                      |
| `created_at` / `updated_at` | Timestamp |                                          |

---

### 6. **permissions** (AccessMatrix)

| Field                       | Type            | Notes                |
| --------------------------- | --------------- | -------------------- |
| `id`                        | UUID (PK)       |                      |
| `organization_id`           | UUID (FK)       | ↪ `organizations.id` |
| `department_id`             | UUID (FK)       | ↪ `departments.id`   |
| `position_id`               | UUID (FK)       | ↪ `positions.id`     |
| `module_key`                | String          | ↪ `modules.key`      |
| `can_view`                  | Boolean         |                      |
| `can_create`                | Boolean         |                      |
| `can_edit`                  | Boolean         |                      |
| `can_delete`                | Boolean         |                      |
| `custom_permissions`        | JSON (Optional) | Extendable           |
| `created_at` / `updated_at` | Timestamp       |                      |

🔗 References:

- ➡️ `departments`, `positions`, `modules`, `organizations`

✅ This is now **granular per position**, scalable, and easily extendable.

---

## 🔐 Best Practice Access Control Flow

When a user logs in:

```js
1. Get user info:
   - system role (admin/user)
   - department_id
   - position_id
   - organization_id

2. Check if module is enabled for their organization:
   - FROM: `organizations.active_modules`

3. Check their permissions for that module:
   - Query `permissions` WHERE:
     organization_id = user.organization_id
     department_id = user.department_id
     position_id = user.position_id
     module_key = 'costing_system'

4. Evaluate permissions:
   - If `can_view` or `can_edit`, grant access
```

---

## ⚙️ Summary of Advantages

| Design Feature                 | Benefit                                        |
| ------------------------------ | ---------------------------------------------- |
| Roles inside `users`           | Simplifies system-wide access logic            |
| `positions` table              | Adds intra-department flexibility              |
| `permissions` matrix           | Supports dynamic control per org/dept/position |
| Organization-scoped            | Built for multi-tenant SaaS                    |
| Modular `active_modules` field | Plug-and-play systems                          |

---

Would you like me to generate:

1. SQL table creation scripts?
2. ERD (Entity Relationship Diagram)?
3. Sample seed data (admin user, departments, permissions)?
4. Access middleware logic in Node.js?

Let me know and I’ll generate the next step!
