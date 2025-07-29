# API

## ✅ Recommended `docs/` Structure (Table of Contents)

```bash
docs/
├── 1. API Overview.md
├── 2. Authentication.md
├── 3. Costings.md
├── 4. Services.md
├── 5. Middleware & Access Control.md
├── 6. Error Handling.md
├── 7. Testing Guide.md
└── 8. Glossary.md
```

---

### 📚 Content Outline

1. **`1. API Overview.md`**

   - Brief summary of API structure and use
   - Base URL info
   - Authentication requirements
   - Link to each individual module doc
   - Versioning info (if applicable)

2. **`2. Authentication.md`**

   - Routes: `/auth/register`, `/auth/login`
   - Request/response samples
   - JWT handling (how to send in `Authorization` header)
   - Common auth errors

3. **`3. Costings.md`**

   - CRUD routes for costings
   - Request/response schema
   - Role/access behavior (who can edit what)
   - Example payloads (create, update)

4. **`4. Services.md`**

   - Admin-only create route
   - Public access to service list
   - Sample responses for list and creation
   - Data structure explanation

5. **`5. Middleware & Access Control.md`**

   - Auth middleware (`requireAuth`)
   - Role middleware (`requireAdmin`, `allowSelfOrAdmin`)
   - Flow diagrams (optional)
   - Edge cases or common pitfalls

6. **`6. Error Handling.md`**

   - Global error handler behavior
   - Standard error response format
   - Known error types (`401`, `403`, `404`, `500`)
   - How frontend should interpret errors

7. **`7. Testing Guide.md`**

   - How to run tests (manual or automated)
   - Postman collection / curl usage
   - Test users or example JWTs (if safe for internal dev)
   - Data seeding strategy (if relevant)

8. **`8. Glossary.md`**

   - Terms like JWT, RBAC, MVC, CRUD
   - Internal jargon (if any)
   - Links to external resources if needed
