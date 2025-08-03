# User Model Schema (Reusable)

This table provides a **modular and complete user schema** for:

- ✅ Authenticated apps
- ✅ SaaS platforms
- ✅ Multi-tenant systems
- ✅ Admin dashboards
- ✅ Reusable backend APIs

You can choose to **include/exclude fields as needed per project**, but using this as your base gives you production-level structure from day one.

It’s designed to be:

- ✅ **Scalable** (can grow with complex roles, tenants, metadata)
- ✅ **Reusable** (portable to future projects)
- ✅ **Secure** (handles auth, sessions, tokens)
- ✅ **Modular** (easy to split into microservices or domain-specific models)

Below is the **complete, merged table** with **all essential fields** grouped by purpose.

---

## Recommended Route Structure

| **Section**        | **Route**                 | **Method** | **Use Case**                                                   |
| ------------------ | ------------------------- | ---------- | -------------------------------------------------------------- |
| Security           | `/api/users/security`     | `PATCH`    | Change password, reset password, lockout logic (Self or Admin) |
| Identity           | `/api/users/identity`     | `PATCH`    | Update name, bio, profile photo (Self or Admin)                |
| Account Status     | `/api/users/account`      | `PATCH`    | Updates to status/roles (Admin)                                |
| Preferences        | `/api/users/preferences`  | `PATCH`    | Change UI language, email settings (Self or Admin)             |
| Organization       | `/api/users/organization` | `PATCH`    | Assign to org, set roles/departments (Self or Admin)           |
| Activity Log       | `/api/users/activity`     | `GET`      | Fetch activity log (Self or Admin)                             |
| All-in-one Profile | `/api/users/me`           | `GET`      | Fetch combined user profile                                    |
|                    | `/api/users/:id`          | `GET`      | (Admin only) fetch specific user info                          |

## ✅ Complete User Schema Reference Table (Production-Grade)

### 🔐 Security & Authentication

| **Field**                | **Type**  | **Description**                                                             |
| ------------------------ | --------- | --------------------------------------------------------------------------- |
| `password`               | `String`  | Hashed password using bcrypt. Required for login.                           |
| `isVerified`             | `Boolean` | Whether the user has verified their email. Helps reduce spam/fake accounts. |
| `emailVerificationToken` | `String`  | Token sent to user’s email for verification flow. Temporary.                |
| `resetPasswordToken`     | `String`  | Token generated for password reset.                                         |
| `resetPasswordExpires`   | `Date`    | Expiration for reset token to prevent reuse.                                |
| `lastLogin`              | `Date`    | Records the last login timestamp. Useful for auditing and security.         |
| `loginAttempts`          | `Number`  | Number of failed login attempts (for brute force protection).               |
| `lockUntil`              | `Date`    | Locks login temporarily if too many failed attempts.                        |

---

### 👤 User Identity & Personalization

| **Field**        | **Type**             | **Description**                                                  |
| ---------------- | -------------------- | ---------------------------------------------------------------- |
| `name`           | `String`             | Full name of the user. Required.                                 |
| `username`       | `String`             | Optional unique handle (e.g., for social or commenting systems). |
| `email`          | `String`             | Unique email, lowercased. Used as primary identifier.            |
| `profilePicture` | `String` (URL)       | Path or link to user’s avatar image.                             |
| `phone`          | `String`             | Optional phone number (for profile, 2FA, or contact).            |
| `bio`            | `String`             | Short user description or “about me”.                            |
| `gender`         | `String`             | Optional gender field (`"male"`, `"female"`, `"other"`).         |
| `birthDate`      | `Date`               | Optional date of birth, useful for age-based features.           |
| `location`       | `Object` or `String` | Country, city, or coordinates. Useful for regional features.     |
| `language`       | `String`             | Preferred UI language (e.g., `"en"`, `"ms"`, `"zh"`).            |

---

### ⚙️ Account & System Management

| **Field**     | **Type**                 | **Description**                                                              |
| ------------- | ------------------------ | ---------------------------------------------------------------------------- |
| `role`        | `String`                 | Role assigned to the user (`"user"`, `"admin"` by default, can be expanded). |
| `permissions` | `Array`                  | Optional fine-grained permissions (used in RBAC systems).                    |
| `status`      | `String`                 | Account status: `"active"`, `"inactive"`, `"suspended"`.                     |
| `deletedAt`   | `Date`                   | Timestamp for soft deletion (preserve data but restrict access).             |
| `createdBy`   | `ObjectId` (ref: `User`) | Tracks who created this user (e.g., by admin).                               |
| `updatedBy`   | `ObjectId` (ref: `User`) | Tracks who last modified this user.                                          |
| `metadata`    | `Mixed` (Object)         | Flexible field for storing custom or dynamic data.                           |

---

### 🏢 Business / Organization Support

| **Field**      | **Type**                         | **Description**                                             |
| -------------- | -------------------------------- | ----------------------------------------------------------- |
| `organization` | `ObjectId` (ref: `Organization`) | Link to company, tenant, or team in a multi-tenant app.     |
| `position`     | `String`                         | Optional job title or position within the organization.     |
| `department`   | `String`                         | Optional department or team (e.g., Marketing, Engineering). |
| `orgRole`      | `String`                         | Optional org-specific role (e.g., `"manager"`, `"member"`). |

---

### 📈 Activity Tracking

| **Field**          | **Type**                       | **Description**                                                        |
| ------------------ | ------------------------------ | ---------------------------------------------------------------------- |
| `activityLog`      | `Array` or External Collection | Optionally track login events, actions, or changes.                    |
| `termsAcceptedAt`  | `Date`                         | When the user accepted Terms & Conditions or Privacy Policy.           |
| `emailPreferences` | `Object`                       | User choices for emails (e.g., `{ newsletter: true, alerts: false }`). |
| `lastActiveAt`     | `Date`                         | Optional tracking of the last time user interacted with the app.       |

---

## User Model Schema (`user.model.js`)

```js
// models/user.model.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // 🔐 Security & Authentication
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: 6,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: {
      type: Date,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },

    // 🧑 User Identity & Personalization
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    avatarUrl: {
      type: String,
    },
    bio: {
      type: String,
      maxLength: 280,
    },
    location: {
      type: String,
    },
    timezone: {
      type: String,
    },

    // ⚙️ Account & System Management
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    preferences: {
      theme: { type: String, enum: ["light", "dark"], default: "light" },
      language: { type: String, default: "en" },
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: false },
      },
    },

    // 🏢 Business / Organization Support
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // 🧭 Activity Tracking
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deletedAt: {
      type: Date,
    },
    lastActivityAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
```

---

## Organization Model Schema (`organization.model.js`)

```js
// models/organization.model.js

import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
    },
    industry: {
      type: String,
    },
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    phone: String,
    website: String,

    // Team members
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: {
          type: String,
          enum: ["admin", "member", "viewer"],
          default: "member",
        },
        joinedAt: Date,
      },
    ],

    // Billing
    billing: {
      plan: { type: String, default: "free" },
      stripeCustomerId: String,
      subscriptionId: String,
      trialEndsAt: Date,
      billingEmail: String,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Organization = mongoose.model("Organization", organizationSchema);
export default Organization;
```
