# Postman Test Cases

This file contains all of the test cases for the Costing System API.
It includes:

- POSTMAN input headers & body
- POSTMAN output success/error, message and data

---

## 📚 Table of Contents

- [Postman Test Cases](#postman-test-cases)
  - [📚 Table of Contents](#-table-of-contents)
  - [Authentication (/api/auth)](#authentication-apiauth)
    - [Register New User (Public Access)](#register-new-user-public-access)
    - [Login User (Public Access)](#login-user-public-access)
    - [Logout User (All Users)](#logout-user-all-users)
  - [Users (/api/users)](#users-apiusers)
    - [GET All Users (Admin Only)](#get-all-users-admin-only)
    - [GET a User by ID (Self or Admin Only)](#get-a-user-by-id-self-or-admin-only)
    - [UPDATE user details (Self or Admin Only)](#update-user-details-self-or-admin-only)
    - [DELETE user (Self or Admin Only)](#delete-user-self-or-admin-only)
  - [Service Items (/api/services)](#service-items-apiservices)
    - [GET All Service Items (All Users)](#get-all-service-items-all-users)
    - [CREATE New Service Item (Admin Only)](#create-new-service-item-admin-only)
    - [UPDATE Service Item (Admin Only)](#update-service-item-admin-only)
    - [DELETE Service Item (Admin Only)](#delete-service-item-admin-only)
  - [Costing (/api/costing)](#costing-apicosting)
    - [GET All Costings (Admin Only)](#get-all-costings-admin-only)
    - [GET a Costing by Costing ID (Costing Owner or Admin Only)](#get-a-costing-by-costing-id-costing-owner-or-admin-only)
    - [CREATE New Costing (All Users)](#create-new-costing-all-users)
    - [UPDATE Costing By Costing ID (Costing Owner or Admin Only)](#update-costing-by-costing-id-costing-owner-or-admin-only)
    - [GET Costing by User ID (Self or Admin Only)](#get-costing-by-user-id-self-or-admin-only)
    - [DELETE Costing by Costing ID (Costing Owner or Admin Only)](#delete-costing-by-costing-id-costing-owner-or-admin-only)
  - [Admin-Only Routes (/api/admin)](#admin-only-routes-apiadmin)
    - [CREATE new User (Admin Only)](#create-new-user-admin-only)

---

## Authentication (/api/auth)

### Register New User (Public Access)

- Input

```json
{
  "title": "Register new user",
  "method": "POST",
  "url": "/api/auth/register",
  "body": {
    "name": "testuser2",
    "email": "testuser2@example.com",
    "password": "password123"
  }
}
```

- Output: Success

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODhhY2ZkOWVlYmFkZjcwZTg4NTQ5ZTEiLCJpYXQiOjE3NTM5Mjc2NDEsImV4cCI6MTc1NDAxNDA0MX0.AFbL4xWAtNrbSXf1GmTdRTJ8cpOQHLPa_I8UT2nEePw",
    "user": {
      "name": "testuser2",
      "email": "testuser2@example.com",
      "password": "$2b$10$aZqXtuMPNH17Gbv/vdy32..TtUJjiBz5c27u7VCPYv6QVsyV5CjRW",
      "role": "user",
      "_id": "688acfd9eebadf70e88549e1",
      "createdAt": "2025-07-31T02:07:21.007Z",
      "updatedAt": "2025-07-31T02:07:21.007Z",
      "__v": 0
    }
  }
}
```

- Output: Error - User already exists

```json
{
  "success": false,
  "error": "User already exists"
}
```

### Login User (Public Access)

---

- Input: Registered User

```json
{
  "title": "Login user",
  "method": "POST",
  "url": "/api/auth/login",
  "body": {
    "email": "testuser2@example.com",
    "password": "password123"
  }
}
```

- Output: Success

```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODhhY2ZkOWVlYmFkZjcwZTg4NTQ5ZTEiLCJpYXQiOjE3NTM5Mjc3NDYsImV4cCI6MTc1NDAxNDE0Nn0.pUUEWHMvpkQNoO-ZAyQr6FLGj88K5odg3vO2UANS6MY",
    "user": {
      "_id": "688acfd9eebadf70e88549e1",
      "name": "testuser2",
      "email": "testuser2@example.com",
      "password": "$2b$10$aZqXtuMPNH17Gbv/vdy32..TtUJjiBz5c27u7VCPYv6QVsyV5CjRW",
      "role": "user",
      "createdAt": "2025-07-31T02:07:21.007Z",
      "updatedAt": "2025-07-31T02:07:21.007Z",
      "__v": 0
    }
  }
}
```

---

- Input: Non-registered User

```json
{
  "email": "notregistered@example.com",
  "password": "password"
}
```

- Output: Error - User not found

```json
{
  "success": false,
  "error": "User not found"
}
```

---

- Input: Invalid password

```json
{
  "email": "testuser2@example.com",
  "password": "wrong"
}
```

- Output: Error - Invalid password

```json
{
  "success": false,
  "error": "Invalid password"
}
```

---

### Logout User (All Users)

```json
{
  "title": "Logout",
  "method": "POST",
  "url": "/api/auth/logout"
}
```

---

## Users (/api/users)

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

## Service Items (/api/services)

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

## Costing (/api/costing)

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
    "projectName": "Rebranding Website",
    "clientName": "Hyrax Oil",
    "notes": "Testing Out",
    "servicesUsed": [
      {
        "service": "6887a2db8f9c02ee043cdd6c",
        "hours": 30
      },
      {
        "service": "6887a7b08f9c02ee043cdd73",
        "hours": 15
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

## Admin-Only Routes (/api/admin)

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
