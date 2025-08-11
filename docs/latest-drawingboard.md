# DRAWING BOARD

---

## 🔧 SYSTEM DESIGN: Core Concepts

### 👤 **User (Tenant-Aware)**

- Belongs to **1 Company (Tenant)**
- Belongs to **1 Department**
- Has **multiple Permissions** (assigned per user, _not via department_)
- Has **1 Role**: `user` or `admin` (used for global bypass logic)

---

## 📘 USER PERMISSIONS MODEL

Each `Permission` entry assigned to a user has:

| Field     | Description                                                           |
| --------- | --------------------------------------------------------------------- |
| `module`  | e.g., `"HR"`, `"Finance"`, `"Sales"`                                  |
| `feature` | e.g., `"attendance"`, `"payroll"`, `"invoices"` (based on the module) |
| `access`  | `["create", "read", "update", "delete"]` (matches REST operations)    |
| `scope`   | `"self"`, `"department"`, `"all"` – governs **data visibility**       |

**Examples:**

- A user in the Sales department might have:

  ```json
  {
    "module": "Sales",
    "feature": "leads",
    "access": ["read", "update"],
    "scope": "self"
  }
  ```

- A manager might have:

  ```json
  {
    "module": "HR",
    "feature": "leaves",
    "access": ["read", "approve"],
    "scope": "department"
  }
  ```

---

## 🔄 DATABASE MODELS AND RELATIONSHIPS

### 🧩 `User` model

- Fields: `id`, `name`, `email`, `role`, etc.
- **Associations**:

  - `User.belongsTo(Company)`
  - `User.belongsTo(Department)`
  - `User.hasMany(Permission)` ✅

### 🧩 `Permission` model

- Fields: `id`, `module`, `feature`, `access` (JSON array), `scope`
- **Associations**:

  - `Permission.belongsTo(User)`

### 🧩 `Department` model

- Fields: `id`, `name`, etc.
- **Associations**:

  - `Department.belongsTo(Company)`
  - `Department.hasMany(User)`

### 🧩 `Company` model

- Fields: `id`, `name`, `industry`, etc.
- **Associations**:

  - `Company.hasMany(Department)`
  - `Company.hasMany(User)`

✅ These are handled in your `associations.js`, NOT repeated in model files.
Models only define their structure (`sequelize.define(...)`), and associations (like `hasMany`, `belongsTo`) go into one centralized place.

---

## 🔐 AUTHORIZATION MIDDLEWARE

### ✅ `authorizeAccess({ module, feature, requiredAccess, scope })`

Checks:

1. `req.user.role === 'admin'` → **always allowed**
2. Else → loop through `req.user.permissions` and:

   - Match `module`, `feature`
   - Ensure all `requiredAccess` values exist
   - Ensure scope is compatible (`all` overrides all)

Used for **per-user**, **per-feature** control with **granular scope**.

---

## ✅ EXAMPLE USAGE IN ROUTES

```js
userRouter.get(
  "/:id",
  authenticateUser,
  authorizeAccess({
    module: "HR",
    feature: "profile",
    requiredAccess: ["read"],
    scope: "self",
  }),
  getUser
);
```

In this case:

- Admin bypasses
- Regular user must have `permissions[]` containing:

  ```js
  {
    module: "HR",
    feature: "profile",
    access: ["read"],
    scope: "self" or "all"
  }
  ```

---

## 📦 SUMMARY OF MODELS AND ASSOCIATIONS

| Model        | Key Relationships                                                  |
| ------------ | ------------------------------------------------------------------ |
| `User`       | belongsTo `Company`, belongsTo `Department`, hasMany `Permissions` |
| `Permission` | belongsTo `User`                                                   |
| `Department` | belongsTo `Company`, hasMany `Users`                               |
| `Company`    | hasMany `Departments`, hasMany `Users`                             |

---

## 🛠️ NEXT STEPS

1. ✅ **Model Definitions** – ensure `Permission` is implemented as a table and associated to `User`.
2. ✅ **Associations** – correctly handled in `associations.js`.
3. ✅ **Seeders** – insert dummy users, companies, permissions for testing.
4. ✅ **Middleware** – `authorizeAccess` already uses `req.user.permissions`, no need to query again.
5. ✅ **Data Scoping Logic** – use `req.accessScope` to filter DB query results per route.

---

Would you like me to:

- Write the full Sequelize model for `Permission`?
- Give you a visual ERD diagram?
- Or write a sample seeder setup for Users and Permissions?

Let’s keep everything clean, modular, and bulletproof.
