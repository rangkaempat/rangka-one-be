# POSTMAN inputs + outputs

---

## AUTH

### Register new user

Input:

```json
{
  "name": "Hazim Danish Bin Hamdan",
  "username": "hazim",
  "email": "hazim@example.com",
  "password": "password123"
}
```

Output:

```json

```

---

### Login user

```json
{
  "email": "hazim@example.com",
  "password": "password123"
}
```

Output:

```json
{
  "success": true,
  "message": "User logged in successfully",
  "user": {
    "id": "80d4a8d5-2239-4914-a222-cf944a78d253",
    "name": "Hazim Danish Bin Hamdan",
    "username": "hazim",
    "email": "hazim@example.com",
    "role": "admin",
    "status": "active",
    "last_login_at": "2025-08-11T06:20:34.971Z",
    "created_at": "2025-08-11T04:25:53.000Z",
    "updated_at": "2025-08-11T04:25:53.000Z"
  }
}
```

---

## MODULES

### Create new Module

Input:

```json
{
  "name": "Human Resources",
  "code": "HR",
  "description": "Handles employee records, recruitment, and payroll",
  "is_core": true // If module is part of core modules
}
```

Output:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Human Resources",
    "code": "HR",
    "description": "Handles employee records, recruitment, and payroll",
    "is_core": true,
    "updatedAt": "2025-08-11T06:27:16.003Z",
    "createdAt": "2025-08-11T06:27:16.003Z"
  }
}
```

### Get All Modules

GET /api/modules

Output:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Human Resources",
      "code": "HR",
      "description": "Handles employee records, recruitment, and payroll",
      "is_core": true,
      "createdAt": "2025-08-11T06:27:16.000Z",
      "updatedAt": "2025-08-11T06:27:16.000Z"
    }
  ]
}
```

GET /api/modules?code=HR

- Fetching by query params -> where code = HR

Output:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Human Resources",
      "code": "HR",
      "description": "Handles employee records, recruitment, and payroll",
      "is_core": true,
      "createdAt": "2025-08-11T06:27:16.000Z",
      "updatedAt": "2025-08-11T06:27:16.000Z"
    }
  ]
}
```

### Get Module by ID

GET /api/modules/1 -> ID = 1

Output:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Human Resources",
    "code": "HR",
    "description": "Handles employee records, recruitment, and payroll",
    "is_core": true,
    "createdAt": "2025-08-11T06:27:16.000Z",
    "updatedAt": "2025-08-11T06:27:16.000Z"
  }
}
```
