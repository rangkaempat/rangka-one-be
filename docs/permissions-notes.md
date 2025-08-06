# Implementation of Permissions

---

## 🧭 What We’re Trying to Achieve

Building a permission system with:

- ✅ System Roles (`user`, `admin`)
- ✅ Modules (`HR`, `Finance`, `Sales`, etc.) with varying features (`employees`, `attendance`, `costings`)
- ✅ Feature-level access control (CRUD)
- ✅ Scope-based access control (`self`, `department`, `all`)
- ✅ Modular middlewares (not repetitive like `authAdmin`, `authOwner`, etc.)
- ✅ Maintainable route structure
- ✅ Reusable logic in services and controllers

---

### 🧱 Core Database Models

#### 1. `users`

Stores general user data and system-level roles (admin/user).

| Field          | Type     | Notes                   |
| -------------- | -------- | ----------------------- |
| `id`           | ObjectId | Primary Key             |
| `name`         | String   |                         |
| `email`        | String   | Unique                  |
| `password`     | String   | Hashed                  |
| `systemRole`   | Enum     | `'user' \| 'admin'`     |
| `departmentId` | ObjectId | FK to `departments._id` |
| `createdAt`    | Date     |                         |
| `updatedAt`    | Date     |                         |

---

#### 2. `departments`

A logical grouping (e.g., Sales, HR) to organize features.

| Field       | Type     | Notes         |
| ----------- | -------- | ------------- |
| `id`        | ObjectId | Primary Key   |
| `name`      | String   | e.g., "Sales" |
| `createdAt` | Date     |               |
| `updatedAt` | Date     |               |

---

#### 3. `modules`

| Field       | Type     | Notes               |
| ----------- | -------- | ------------------- |
| `id`        | ObjectId | Primary Key         |
| `name`      | String   | e.g., "Sales", "HR" |
| `createdAt` | Date     |                     |
| `updatedAt` | Date     |                     |

---

#### 4. `features`

| Field       | Type     | Notes                     |
| ----------- | -------- | ------------------------- |
| `id`        | ObjectId | Primary Key               |
| `moduleId`  | ObjectId | FK to `modules._id`       |
| `name`      | String   | e.g., "costing", "leaves" |
| `createdAt` | Date     |                           |
| `updatedAt` | Date     |                           |

---

#### 5. `permissions`

**Core** table that defines what access a user has to a feature.

| Field       | Type      | Notes                                    |
| ----------- | --------- | ---------------------------------------- |
| `id`        | ObjectId  | Primary Key                              |
| `userId`    | ObjectId  | FK to `users._id`                        |
| `module`    | String    | e.g., `"Sales"`                          |
| `feature`   | String    | e.g., `"costing"`                        |
| `access`    | String\[] | `["create", "read", "update", "delete"]` |
| `scope`     | Enum      | `"self" \| "department" \| "all"`        |
| `createdAt` | Date      |                                          |
| `updatedAt` | Date      |                                          |

> 🔍 **Why use strings for `module` and `feature` instead of FK?**
> This makes permission checks easier and faster (no join required in middleware). You can also cache them easily per user during login.

---

## 🔐 Middleware Flow (Authorization)

### Step-by-step flow for middlewares:

1. authenticateUser -> verify user is logged in
2. authorizeAccess -> based on user permissions

```js
router.get(
  "/costings",
  authenticateUser,
  authorizeAccess({
    module: "Sales",
    feature: "costing",
    requiredAccess: ["read"],
    scope: "self",
  }),
  getCostingsByScope
);
```

---

### ✅ `authenticateUser` (Step 1)

Verifies login via JWT and sets `req.user`.

```js
req.user = {
  id,
  email,
  systemRole,
  departmentId,
  permissions: [
    {
      module: "Sales",
      feature: "costing",
      access: ["read", "update"],
      scope: "self"
    },
    ...
  ]
}
```

> 🧠 Tip: You load all `permissions` for the user at login and store them in the token or session, so you avoid fetching on every request.

---

### ✅ `authorizeAccess({ module, feature, requiredAccess, scope })` (Step 2)

```js
// Example: { module: "Sales", feature: "costing", requiredAccess: ["read"], scope: "self" }
function authorizeAccess({ module, feature, requiredAccess, scope }) {
  return (req, res, next) => {
    const permissions = req.user.permissions;

    // Compare passed props with user's actual permissions
    const match = permissions.find(
      (p) =>
        p.module === module &&
        p.feature === feature &&
        requiredAccess.every((a) => p.access.includes(a)) &&
        (p.scope === scope || p.scope === "all")
    );

    // If not matching, access denied
    if (!match) {
      return res.status(403).json({ error: "Access denied." });
    }

    req.accessScope = match.scope; // Pass this to controller/service
    next();
  };
}
```

---

### ✅ Controller & Service (Step 3)

Now the controller receives `req.accessScope`, so it can filter data.

```js
// Controller layer
function getCostingsByScope(req, res) {
  const userId = req.user.id;
  const deptId = req.user.departmentId;
  const scope = req.accessScope;

  const costings = await CostingService.getByScope(userId, deptId, scope);
  res.json(costings);
}
```

```js
// Service layer
async function getByScope(userId, departmentId, scope) {
  if (scope === "all") return await Costing.find();
  if (scope === "department") return await Costing.find({ departmentId });
  if (scope === "self") return await Costing.find({ createdBy: userId });
}
```

---

## 🧠 Benefits of This Approach

- ✅ **Flexible**: Support multiple permissions per feature per user.
- ✅ **Scalable**: Add new access types (e.g. `export`, `approve`) anytime.
- ✅ **Composable**: Reusable middleware across all routes.
- ✅ **Readable**: Permission definitions are expressive and self-documenting.
- ✅ **Centralized**: Authorization logic is handled in a single middleware.

---

Would you like me to:

- Generate the sample seed data for `permissions` with this new structure?
- Write the reusable `authorizeAccess()` middleware code for copy-paste?
- Or turn this into a Markdown file for your dev docs?

Let me know!
