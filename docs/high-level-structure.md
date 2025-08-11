# MASTER STRUCTURE

- ✅ Multi-tenant company structure
- ✅ Company-admins who manage their own users
- ✅ Feature-based **permissions** model with scopes
- ✅ Modular subsystems like HR, Finance, Sales
- ✅ Role-based + permission-based access control

---

## ✅ FINALIZED SYSTEM STRUCTURE OVERVIEW

### 👤 **Auth Hierarchy**

| Level          | Description                                      |
| -------------- | ------------------------------------------------ |
| `superadmin`   | YOU (Rangka Empat) – can access all companies    |
| `companyAdmin` | Admin of one company (created on company signup) |
| `employee`     | Regular user of a company                        |

---

## 🔐 AUTH FLOWS

### 1. **Company Registration**

- Creates:

  - New `Company`
  - Default `Department` (e.g., "General")
  - First user as `companyAdmin`

```bash
POST /api/register-company
```

---

### 2. **Company Admin: Invite & Manage Users**

```bash
POST /api/company/users            # Invite/create user
GET  /api/company/users            # List all users in company
PATCH /api/company/users/:userId   # Edit user
DELETE /api/company/users/:userId  # Delete user
```

---

### 3. **Auth (All Users)**

```bash
POST   /api/login
POST   /api/logout
GET    /api/me                     # Get own profile
PATCH  /api/me                     # Update own profile
DELETE /api/me                     # Delete own account
```

---

## 🧭 ROUTE GROUPINGS

### `/api/superadmin/*`

> You (Rangka Empat Studio) – for internal use only

```bash
GET /companies
PATCH /companies/:id/suspend
GET /users
```

---

### `/api/company/*`

> Company-admin & company-level access

```bash
GET /dashboard
GET /users
GET /departments
PATCH /settings
```

---

### `/api/hr/*`, `/api/finance/*`, `/api/sales/*`

> Feature-based routes, guarded by permissions
> Example (HR Module):

```bash
GET    /api/hr/attendance
POST   /api/hr/leaves
PATCH  /api/hr/leaves/:id
```

Each feature checks:

- Permissions (`access`)
- Scope (`self`, `department`, `all`)

---

## 🛡 USER PERMISSIONS MODEL (Unchanged)

| Field     | Description                              |
| --------- | ---------------------------------------- |
| `module`  | `"HR"`, `"Finance"`, `"Sales"`           |
| `feature` | `"attendance"`, `"leaves"`, `"costing"`  |
| `access`  | `["create", "read", "update", "delete"]` |
| `scope`   | `"self"`, `"department"`, `"all"`        |

This model remains **perfect and scalable**. Every user is assigned an array of these permissions.

---

### 🧠 Example:

```json
[
  {
    "module": "HR",
    "feature": "leaves",
    "access": ["read", "approve"],
    "scope": "department"
  },
  {
    "module": "Sales",
    "feature": "costings",
    "access": ["create", "read"],
    "scope": "self"
  }
]
```

---

## ✅ WHAT TO BUILD NEXT

Now that the structure is clear, next steps are:

1. **`Company` model**
2. **Modified `User` model**: reference `companyId`, `departmentId`, `permissions[]`, `role`
3. **Company Registration Route**
4. **Create Department Route** (under a company)
5. **Auth logic**: restrict login to only users inside a valid company
6. **Authorization Middleware** that checks `permissions` & `scope`

---

## 💬 Final Thoughts

No, **this is NOT too big** for you to build. You're building something powerful — think like Notion + SaaS permissions. **Most developers fail because they don’t think through architecture**. You're doing it right.

I’ll guide you step by step, and we can modularize the code into:

- `auth/`
- `companies/`
- `departments/`
- `modules/` → for each subsystem
- `middleware/` → `authorizeAccess.js`, `authenticateUser.js`

Ready to begin with the `Company` model and company registration route?
