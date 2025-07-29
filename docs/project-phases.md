# Costing Web Application

Build a full-stack web application for Rangka Empat Studio that allows the team to:

- Log in securely.
- Create, manage, and export client cost estimations (quotations).
- Store project templates and track cost components.
- Support internal roles like Admin and Team Members.

## 🗂️ PHASE 1: Core Backend & Authentication

### 🔐 Authentication & User Management

1. User model & DB table: email, password (hashed), name, role (admin, member), created_at.
2. Register route: /api/auth/register

   - Accepts name, email, password.
   - Hash password with bcrypt.
   - Store in MySQL.

3. Login route: /api/auth/login

   - Validate user, return JWT as HttpOnly cookie.

4. Logout route: /api/auth/logout

   - Clears JWT cookie.

5. JWT middleware: verifyToken to protect private routes.
6. Role-based middleware: Allow only admin to manage users.

### 📦 Backend Setup & Structure

Project initialized with: express, cors, body-parser, cookie-parser, dotenv, mysql2, jsonwebtoken, bcrypt.

**File Structure:**

```bash
/server
├── /controllers
├── /routes
├── /middleware
├── /models
├── /services
├── /config
└── server.js
```

Use .env for all sensitive config (DB, JWT_SECRET, etc.)

📋 PHASE 2: Costing Engine & Project CRUD
🧾 Costing Projects
Project model & DB table

title, client_name, created_by (user_id), date_created, project_type, status, total_cost

Create Project: /api/projects/create

Edit Project: /api/projects/:id/edit

Get All Projects: /api/projects

Get One Project: /api/projects/:id

Delete Project: /api/projects/:id/delete

Authorization check: Only project owner or admin can edit/delete

🧩 Cost Components (Project Items)
Nested under each project

Each item includes:

name, category (e.g., design, dev), estimated_hours, hourly_rate, subtotal

Add/Edit/Delete item routes:

/api/projects/:projectId/items/add

/api/projects/:projectId/items/:itemId/edit

/api/projects/:projectId/items/:itemId/delete

Calculate total_cost automatically from items

💼 PHASE 3: Templates & Quotation Management
📑 Quotation Templates
Predefined sets of tasks/items (e.g., “Standard Website”, “Ecommerce Build”)

Save templates for re-use

Route: /api/templates

Ability to apply a template to a new project

📤 Export / Download
Generate PDF (or just JSON for now) of the costing

Include client name, project summary, itemized breakdown, total

Route: /api/projects/:id/export

🛠️ PHASE 4: User Roles, Settings, and Dashboard
👥 Roles & Permissions
Role in users table: admin, member

Admin:

Can manage users

View all projects

Member:

Can only view/edit own projects

⚙️ Profile & Settings
Update password, name, email

Route: /api/users/:id/update

📊 Dashboard (Frontend)
Show total projects, recent activity, total revenue estimated

Group projects by status (e.g., draft, sent, closed)

🧪 PHASE 5: Frontend Integration & API Connection (React + Vike)
Frontend form for login/register with API calls

Protected pages using JWT stored in HttpOnly cookies

Use fetch or axios to connect to backend routes

Display project list, create form, edit UI

Live itemized costing form with real-time totals

🧰 Optional / Future Additions
Email quotation to client (via Nodemailer)

Activity logs (who updated what, when)

Tagging or categorizing projects

Search/filter projects or templates

Trash/archive feature for deleted items
