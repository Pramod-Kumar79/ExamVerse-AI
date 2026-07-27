# Authentication Module

## Overview

The Authentication module handles all authentication-related functionality for ExamVerse AI.

This module provides:

- User registration
- User login
- JWT authentication
- Refresh token support
- Password hashing
- Authentication validation
- Shared authentication types

---

## Folder Structure

```
auth/
├── dto/
│   ├── register.dto.ts
│   └── login.dto.ts
│
├── schemas/
│   └── auth.schema.ts
│
├── auth.constants.ts
├── auth.types.ts
├── index.ts
└── README.md
```

---

## DTOs

### RegisterDto

Validated using `registerSchema`.

Fields:

- name
- email
- password

---

### LoginDto

Validated using `loginSchema`.

Fields:

- email
- password

---

## Validation

Implemented using **Zod**.

Validation includes:

- Email validation
- Email normalization
- Password complexity
- Name validation
- Strict object validation

---

## Constants

Centralized values include:

- JWT expiration
- Password rules
- Cookie names
- Authentication messages
- Error codes

---

## Types

Shared interfaces include:

- JwtPayload
- AuthUser
- AuthResponse
- RegisterRequest
- LoginRequest
- TokenPair

---

## Exports

Import everything through:

```ts
import {
  registerSchema,
  loginSchema,
  AUTH_MESSAGES,
} from "@/modules/auth";
```

---

## Next Package

Authentication Part 2

Repository Layer

- AuthRepository
- Database queries
- User lookup
- User creation
- Refresh token persistence