# Postman Test Cases

---

## Authentication (/api/auth)

### Register New User (Public Access)

```json
{
  "title": "Register new user",
  "method": "POST",
  "url": "/api/auth/register",
  "body": {
    "name": "testuser",
    "email": "testuser@example.com",
    "password": "password123"
  }
}
```

### Login User (Public Access)

```json
{
  "title": "Login user",
  "method": "POST",
  "url": "/api/auth/login",
  "body": {
    "email": "testuser@example.com",
    "password": "password123"
  }
}
```

### Logout User (All Users)

```json
{
  "title": "Logout",
  "method": "POST",
  "url": "/api/auth/logout"
}
```

---

## Users

### GET All Users (Admin Only)

```json
{
  "title": "Get all users (admin only)",
  "method": "GET",
  "url": "/api/users",
  "headers": {
    "Authorization": "Bearer <ADMIN_TOKEN>"
  }
}
```

### GET a User by ID (Self or Admin Only)

```json
{
  "title": "Get one user (self or admin)",
  "method": "GET",
  "url": "/api/users/<USER_ID>",
  "headers": {
    "Authorization": "Bearer <USER_TOKEN>"
  }
}
```

### UPDATE user details (Self or Admin Only)

```json
{
  "title": "Update user (self or admin)",
  "method": "PUT",
  "url": "/api/users/<USER_ID>",
  "headers": {
    "Authorization": "Bearer <USER_TOKEN>"
  },
  "body": {
    "name": "updatedUser",
    "email": "updated@example.com"
  }
}
```

### DELETE user (Self or Admin Only)

```json
{
  "title": "Delete user (self or admin)",
  "method": "DELETE",
  "url": "/api/users/<USER_ID>",
  "headers": {
    "Authorization": "Bearer <USER_TOKEN>"
  }
}
```

---

## Service Items

### GET All Service Items (All Users)

```json
{
  "title": "Get all service items",
  "method": "GET",
  "url": "/api/services",
  "headers": {
    "Authorization": "Bearer <USER_TOKEN>"
  }
}
```

### CREATE New Service Item (Admin Only)

```json
{
  "title": "Create service item (admin only)",
  "method": "POST",
  "url": "/api/services",
  "headers": {
    "Authorization": "Bearer <ADMIN_TOKEN>"
  },
  "body": {
    "title": "Frontend Development",
    "description": "Custom React UI development",
    "hourlyRate": 120
  }
}
```

### UPDATE Service Item (Admin Only)

```json
{
  "title": "Update service item (admin only)",
  "method": "PUT",
  "url": "/api/services/<SERVICE_ID>",
  "headers": {
    "Authorization": "Bearer <ADMIN_TOKEN>"
  },
  "body": {
    "hourlyRate": 150
  }
}
```

### DELETE Service Item (Admin Only)

```json
{
  "title": "Delete service item (admin only)",
  "method": "DELETE",
  "url": "/api/services/<SERVICE_ID>",
  "headers": {
    "Authorization": "Bearer <ADMIN_TOKEN>"
  }
}
```

---

## Costing

### GET All Costings (Admin Only)

```json
{
  "title": "Get all costings (admin only)",
  "method": "GET",
  "url": "/api/costing",
  "headers": {
    "Authorization": "Bearer <ADMIN_TOKEN>"
  }
}
```

### GET a Costing by Costing ID (Costing Owner or Admin Only)

```json
{
  "title": "Get costing by ID",
  "method": "GET",
  "url": "/api/costing/<COSTING_ID>",
  "headers": {
    "Authorization": "Bearer <USER_TOKEN>"
  }
}
```

### CREATE New Costing (All Users)

```json
{
  "title": "Create costing",
  "method": "POST",
  "url": "/api/costing",
  "headers": {
    "Authorization": "Bearer <USER_TOKEN>"
  },
  "body": {
    "projectName": "Website Revamp",
    "clientName": "Client A",
    "notes": "Urgent deadline",
    "servicesUsed": [
      {
        "service": "<SERVICE_ID_1>",
        "hours": 20
      },
      {
        "service": "<SERVICE_ID_2>",
        "hours": 10
      }
    ]
  }
}
```

### UPDATE Costing By Costing ID (Costing Owner or Admin Only)

```json
{
  "title": "Update costing",
  "method": "PUT",
  "url": "/api/costing/<COSTING_ID>",
  "headers": {
    "Authorization": "Bearer <USER_TOKEN>"
  },
  "body": {
    "notes": "Updated scope of work"
  }
}
```

### GET Costing by User ID (Self or Admin Only)

```json
{
  "title": "Get costings by user ID",
  "method": "GET",
  "url": "/api/costing/users/<USER_ID>",
  "headers": {
    "Authorization": "Bearer <USER_TOKEN>"
  }
}
```

### DELETE Costing by Costing ID (Costing Owner or Admin Only)

```json
{
  "title": "Delete costing",
  "method": "DELETE",
  "url": "/api/costing/<COSTING_ID>",
  "headers": {
    "Authorization": "Bearer <USER_TOKEN>"
  }
}
```

---

## Admin-Only Routes

### CREATE new User (Admin Only)

```json
{
  "title": "Create new user",
  "method": "POST",
  "url": "/api/admin/create-user",
  "body": {
    "name": "testuser2",
    "email": "testuser2@example.com",
    "password": "password123",
    "role": "admin"
  }
}
```
