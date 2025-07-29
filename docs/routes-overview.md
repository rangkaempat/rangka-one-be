# 📦 API Routes & Middleware Overview

This document serves as a concise overview of all backend routes, their access levels, and the middlewares used for authorization and access control.

---

## 📚 Table of Contents

- [📦 API Routes \& Middleware Overview](#-api-routes--middleware-overview)
  - [📚 Table of Contents](#-table-of-contents)
  - [🧩 Middleware Access Control](#-middleware-access-control)
  - [✅ Best Practices](#-best-practices)
  - [🧑‍💻 Authentication Routes](#-authentication-routes)
  - [👤 User Routes](#-user-routes)
  - [💰 Costing Routes](#-costing-routes)
  - [🛠️ Service Items Routes](#️-service-items-routes)
  - [🛡️ Admin-Only Routes](#️-admin-only-routes)

---

## 🧩 Middleware Access Control

| Middleware                     | Purpose                                | Usage Example                             |
| ------------------------------ | -------------------------------------- | ----------------------------------------- |
| `authorize`                    | Any authenticated user (via JWT)       | All protected routes                      |
| `authorizeAdmin`               | Only for users with `role === 'admin'` | Admin routes (user list, service control) |
| `authorizeSelfOrAdmin`         | Only the user themselves, or an admin  | Routes like `GET/PUT/DELETE /users/:id`   |
| `authorizeCostingOwnerOrAdmin` | Only the costing owner, or an admin    | Routes like `GET/PUT/DELETE /costing/:id` |

---

## ✅ Best Practices

- Always apply `authorize` before any role-based middleware.
- Use `authorizeSelfOrAdmin` for routes where users should only see/edit their own data unless they’re an admin.
- Consider future roles (e.g., `manager`, `editor`) by making middleware easily extendable.

---

## 🧑‍💻 Authentication Routes

```js
app.use("/api/auth", authRouter);
```

| Method | Route     | Access    | Middleware  | Description            |
| ------ | --------- | --------- | ----------- | ---------------------- |
| POST   | /register | Public    | None        | Register a new account |
| POST   | /login    | Public    | None        | Log in a user          |
| POST   | /logout   | All Users | `authorize` | Log out the user       |

---

## 👤 User Routes

```js
app.use("/api/users", userRouter);
```

User schema includes:

- `name`
- `email`
- `password`
- `role`: `"user"` or `"admin"`

| Method | Route | Access             | Middleware                          | Description                 |
| ------ | ----- | ------------------ | ----------------------------------- | --------------------------- |
| GET    | /     | Admin Only         | `authorize`, `authorizeAdmin`       | Get all users               |
| GET    | /\:id | Self or Admin Only | `authorize`, `authorizeSelfOrAdmin` | Get a specific user profile |
| POST   | /     | Public             | None                                | Create a new user (public?) |
| PUT    | /\:id | Self or Admin Only | `authorize`, `authorizeSelfOrAdmin` | Update a user profile       |
| DELETE | /\:id | Self or Admin Only | `authorize`, `authorizeSelfOrAdmin` | Delete a user profile       |

---

## 💰 Costing Routes

```js
app.use("/api/costing", costingRouter);
```

Costing document structure:

- `createdBy`: user ID
- `projectName`: string
- `clientName`: string (clients DB planned)
- `notes`: optional
- `servicesUsed`: array of service items

  - `service`: references `serviceItems` model
  - `hours`, `hourlyRate`, `subtotal`

- `totalAmount`: sum of subtotals

| Method | Route       | Access                      | Middleware                                  | Description                  |
| ------ | ----------- | --------------------------- | ------------------------------------------- | ---------------------------- |
| GET    | /           | Admin Only                  | `authorize`, `authorizeAdmin`               | Get all costings             |
| GET    | /\:id       | Costing Owner or Admin Only | `authorize`, `authorizeCostingOwnerOrAdmin` | Get costing by costing ID    |
| POST   | /           | All Users                   | `authorize`                                 | Create a new costing         |
| PUT    | /\:id       | Costing Owner or Admin Only | `authorize`, `authorizeCostingOwnerOrAdmin` | Update costing by costing ID |
| DELETE | /\:id       | Costing Owner or Admin Only | `authorize`, `authorizeCostingOwnerOrAdmin` | Delete costing by costing ID |
| GET    | /users/\:id | Self or Admin Only          | `authorize`, `authorizeSelfOrAdmin`         | Get all costings by user ID  |

---

## 🛠️ Service Items Routes

```js
app.use("/api/services", serviceItemRouter);
```

ServiceItem schema:

- `name`
- `description`
- `hourlyRate`

| Method | Route | Access     | Middleware                    | Description               |
| ------ | ----- | ---------- | ----------------------------- | ------------------------- |
| GET    | /     | All Users  | `authorize`                   | Get all service items     |
| POST   | /     | Admin Only | `authorize`, `authorizeAdmin` | Create a new service item |
| PUT    | /\:id | Admin Only | `authorize`, `authorizeAdmin` | Update a service item     |
| DELETE | /\:id | Admin Only | `authorize`, `authorizeAdmin` | Delete a service item     |

---

## 🛡️ Admin-Only Routes

```js
app.use("/api/admin", adminRouter);
```

| Method | Route        | Access     | Middleware                    | Description          |
| ------ | ------------ | ---------- | ----------------------------- | -------------------- |
| POST   | /create-user | Admin Only | `authorize`, `authorizeAdmin` | Create user as admin |
