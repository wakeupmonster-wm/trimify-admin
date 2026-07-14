# Trimify Admin — API Documentation

> **Version:** 1.0.0 &nbsp;|&nbsp; **Last Updated:** 2026-07-09 &nbsp;|&nbsp; **Format:** JSON

---

## Table of Contents

1. [Introduction](#introduction)
2. [Authentication](#authentication)
3. [Common Error Responses](#common-error-responses)
4. [HTTP Status Codes Reference](#http-status-codes-reference)
5. [API Groups](#api-groups)
   - [Admin Auth](#1-admin-auth)
   - [Account Settings](#2-account-settings)
   - [SubAdmin Management](#3-subadmin-management)
   - [FAQ Management](#4-faq-management)
   - [Notification Management](#5-notification-management)
   - [CMS Management](#6-cms-management)
   - [Blog Management](#7-blog-management)
   - [Program Management](#8-program-management)
   - [Nutrition / Diet Meal Data](#9-nutrition--diet-meal-data)
   - [Users](#10-users)
   - [Dashboard](#11-dashboard)
   - [Fitzone Management](#12-fitzone-management)
   - [Transactions](#13-transactions)
6. [API Best Practices](#api-best-practices)

---

## Introduction

This document describes the **Trimify Admin REST API** — the backend interface powering the Trimify admin panel. It is intended for:

- **Frontend developers** integrating admin panel UI with backend services
- **Backend developers** maintaining and extending the API
- **QA engineers** writing test cases and validating edge cases
- **Technical leads & maintainers** reviewing system architecture

### Base URL

```
https://apibackend.trimify.com.au/api
```

> All endpoints are prefixed with `/admin`. The full URL for any endpoint is:
> `BASE_URL + /admin + endpoint`

### Request Format

- All requests must use `Content-Type: application/json` for JSON payloads.
- For file upload endpoints, use `Content-Type: multipart/form-data`.

### Response Format

All API responses are returned in **JSON format**. A typical success response looks like:

```json
{
  "status": "success",
  "message": "Operation completed successfully.",
  "data": {}
}
```

### Pagination

List endpoints return paginated data in the following format:

```json
{
  "pagination": {
    "current_page": 1,
    "last_page": 5,
    "total": 250
  }
}
```

> Default page size is **50 items per page** unless stated otherwise.

---

## Authentication

Protected endpoints require a **Bearer Token** passed in the `Authorization` header.

### Obtaining a Token

1. Call `POST /admin/login` with valid credentials.
2. If credentials are valid, an OTP is sent to the admin's email.
3. Call `POST /admin/verify-login-otp` with the OTP.
4. On success, a `token` is returned — use this for all subsequent requests.

### Authorization Header

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Example

```http
GET /admin/users HTTP/1.1
Host: apibackend.trimify.com.au
Authorization: Bearer 1|abcdef1234567890
Content-Type: application/json
```

> Tokens are invalidated upon logout. Always store tokens securely and never expose them in client-side code or logs.

---

## Common Error Responses

### Validation Error (422)

```json
{
  "status": "error",
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

### Unauthorized (401)

```json
{
  "status": "error",
  "message": "Unauthenticated."
}
```

### Forbidden (403)

```json
{
  "status": "error",
  "message": "You are not authorized to perform this action."
}
```

### Not Found (404)

```json
{
  "status": "error",
  "message": "Resource not found."
}
```

### Server Error (500)

```json
{
  "status": "error",
  "message": "An internal server error occurred."
}
```

---

## HTTP Status Codes Reference

| Code  | Status                | Meaning                                          |
| ----- | --------------------- | ------------------------------------------------ |
| `200` | OK                    | Request succeeded                                |
| `400` | Bad Request           | Invalid request data (e.g., expired/invalid OTP) |
| `401` | Unauthorized          | Missing or invalid credentials / token           |
| `403` | Forbidden             | Authenticated but lacks permission               |
| `404` | Not Found             | Requested resource does not exist                |
| `422` | Unprocessable Entity  | Validation failed                                |
| `500` | Internal Server Error | Unexpected server-side failure                   |

---

## API Groups

---

# 1. Admin Auth

Handles administrator authentication including login, OTP verification, and logout.

---

### POST /admin/login

#### Description

Authenticates an administrator using their email and password. On successful credential verification, a 6-digit OTP is dispatched to the registered email address. The admin must then verify this OTP to complete the login and obtain an access token.

#### Endpoint

```http
POST /admin/login
```

#### Authentication

Not Required

#### Request Body

| Field      | Type   | Required | Validation         | Description                          |
| ---------- | ------ | -------- | ------------------ | ------------------------------------ |
| `email`    | string | Yes      | Valid email format | The admin's registered email address |
| `password` | string | Yes      | Non-empty string   | The admin's account password         |

#### Example Request

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

#### Success Response

Returns a `pending_otp` status indicating the OTP has been dispatched. The `admin_id` and `email` are returned for use in the subsequent OTP verification step.

```json
{
  "status": "pending_otp",
  "message": "OTP has been sent to your email. Please verify to continue.",
  "admin_id": 1,
  "email": "admin@example.com"
}
```

#### Response Fields

| Field      | Type    | Description                          |
| ---------- | ------- | ------------------------------------ |
| `status`   | string  | Always `"pending_otp"` on success    |
| `message`  | string  | Human-readable status message        |
| `admin_id` | integer | The ID of the authenticated admin    |
| `email`    | string  | The email address where OTP was sent |

#### HTTP Status Codes

| Code  | Meaning                                                       |
| ----- | ------------------------------------------------------------- |
| `200` | Credentials valid, OTP sent successfully                      |
| `401` | Email not registered or password is incorrect                 |
| `422` | Validation error (e.g., invalid email format, missing fields) |

#### Edge Cases

- Returns `401` if the email is not registered in the system.
- Returns `401` if the password does not match.
- Returns `422` if email format is invalid or required fields are missing.

#### Notes

After a successful login, store the `admin_id` and `email` temporarily for the OTP verification step. Do not proceed to protected routes until a bearer token is received from `POST /admin/verify-login-otp`.

---

### POST /admin/verify-login-otp

#### Description

Verifies the 6-digit OTP sent to the admin's email during the login step. On successful verification, a Bearer token is issued which must be included in all subsequent authenticated requests.

#### Endpoint

```http
POST /admin/verify-login-otp
```

#### Authentication

Not Required

#### Request Body

| Field   | Type   | Required | Validation                | Description                |
| ------- | ------ | -------- | ------------------------- | -------------------------- |
| `email` | string | Yes      | Valid email format        | The admin's email address  |
| `otp`   | string | Yes      | Numeric, exactly 6 digits | The OTP received via email |

#### Example Request

```json
{
  "email": "admin@example.com",
  "otp": "482910"
}
```

#### Success Response

Returns a `bearer` token and basic admin profile information.

```json
{
  "status": "success",
  "token": "1|abcdef1234567890",
  "token_type": "bearer",
  "message": "Logged in Successfully",
  "admin": {
    "name": "Admin User",
    "email": "admin@example.com"
  }
}
```

#### Response Fields

| Field         | Type   | Description                                    |
| ------------- | ------ | ---------------------------------------------- |
| `status`      | string | `"success"` on valid OTP                       |
| `token`       | string | Bearer token to use for authenticated requests |
| `token_type`  | string | Always `"bearer"`                              |
| `message`     | string | Human-readable success message                 |
| `admin.name`  | string | Full name of the authenticated admin           |
| `admin.email` | string | Email of the authenticated admin               |

#### HTTP Status Codes

| Code  | Meaning                                      |
| ----- | -------------------------------------------- |
| `200` | OTP verified, token issued                   |
| `400` | OTP is invalid or has expired                |
| `401` | Email not found in the system                |
| `422` | Validation error (e.g., OTP is not 6 digits) |

#### Edge Cases

- Returns `400` if the OTP does not match or has expired.
- Returns `401` if the provided email is not found.
- OTP digits must be exactly 6 — any deviation returns `422`.

#### Notes

Store the token securely (e.g., in `httpOnly` cookies or secure local storage). Include it in the `Authorization: Bearer <token>` header for all protected API calls.

---

### POST /admin/logout

#### Description

Invalidates the current admin's Bearer token, effectively ending the session. All subsequent requests using the invalidated token will return `401 Unauthorized`.

#### Endpoint

```http
POST /admin/logout
```

#### Authentication

Required — Bearer Token

#### Request Body

No request body required.

#### Example Request

```http
POST /admin/logout
Authorization: Bearer 1|abcdef1234567890
```

#### Success Response

```json
{
  "message": "Successfully logged out",
  "status": 200
}
```

#### Response Fields

| Field     | Type    | Description            |
| --------- | ------- | ---------------------- |
| `message` | string  | Confirmation of logout |
| `status`  | integer | HTTP status code `200` |

#### HTTP Status Codes

| Code  | Meaning                 |
| ----- | ----------------------- |
| `200` | Logged out successfully |

#### Edge Cases

- Requires a valid Bearer token in the `Authorization` header.
- Sending a request without a token will return `401`.

---

# 2. Account Settings

Manages the authenticated admin's account settings, including password changes and email updates with OTP verification.

---

### POST /admin/change-password

#### Description

Allows the authenticated admin to change their account password by providing the current (old) password and a new password.

#### Endpoint

```http
POST /admin/change-password
```

#### Authentication

Required — Bearer Token

#### Request Body

| Field          | Type   | Required | Validation               | Description                  |
| -------------- | ------ | -------- | ------------------------ | ---------------------------- |
| `old_password` | string | Yes      | Non-empty                | The admin's current password |
| `new_password` | string | Yes      | String, min 6 characters | The desired new password     |

#### Example Request

```json
{
  "old_password": "currentPassword123",
  "new_password": "newSecurePassword456"
}
```

#### Success Response

```json
{
  "status": "success",
  "message": "Your password has been updated successfully.",
  "data": {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com",
    "created_at": "2026-06-10T11:01:59.000000Z",
    "updated_at": "2026-06-10T11:09:50.000000Z"
  }
}
```

#### Response Fields

| Field             | Type    | Description                           |
| ----------------- | ------- | ------------------------------------- |
| `status`          | string  | `"success"`                           |
| `message`         | string  | Confirmation message                  |
| `data.id`         | integer | Admin's ID                            |
| `data.name`       | string  | Admin's name                          |
| `data.email`      | string  | Admin's email                         |
| `data.created_at` | string  | Account creation timestamp (ISO 8601) |
| `data.updated_at` | string  | Last update timestamp (ISO 8601)      |

#### HTTP Status Codes

| Code  | Meaning                                 |
| ----- | --------------------------------------- |
| `200` | Password updated successfully           |
| `401` | Old password is incorrect               |
| `403` | Unauthorized — token invalid or missing |
| `422` | Validation error                        |

#### Edge Cases

- Returns `401` if `old_password` does not match the stored password.
- Returns `403` if the request is made without a valid token.
- `new_password` must be at least 6 characters; shorter values return `422`.

---

### POST /admin/update-email

#### Description

Initiates an email update request for the authenticated admin. An OTP is dispatched to the **new** email address provided. The email is not changed until the OTP is verified via `POST /admin/verify-otp`.

#### Endpoint

```http
POST /admin/update-email
```

#### Authentication

Required — Bearer Token

#### Request Body

| Field   | Type   | Required | Validation                          | Description                        |
| ------- | ------ | -------- | ----------------------------------- | ---------------------------------- |
| `email` | string | Yes      | Valid email, different from current | The new email address to update to |

#### Example Request

```json
{
  "email": "newemail@example.com"
}
```

#### Success Response

```json
{
  "status": "success",
  "message": "OTP has been sent to your email."
}
```

#### Response Fields

| Field     | Type   | Description                    |
| --------- | ------ | ------------------------------ |
| `status`  | string | `"success"`                    |
| `message` | string | Confirmation that OTP was sent |

#### HTTP Status Codes

| Code  | Meaning                                                        |
| ----- | -------------------------------------------------------------- |
| `200` | OTP sent to the new email                                      |
| `422` | Validation error (e.g., email same as current, invalid format) |

#### Edge Cases

- Returns `422` if the provided email is the same as the admin's current email.
- The email address is not updated until `POST /admin/verify-otp` is called successfully.

---

### POST /admin/verify-otp

#### Description

Verifies the OTP sent to the new email address during the email update flow. On success, the admin's email is permanently updated and they are required to log in again with the new email.

#### Endpoint

```http
POST /admin/verify-otp
```

#### Authentication

Required — Bearer Token

#### Request Body

| Field   | Type   | Required | Validation                | Description                     |
| ------- | ------ | -------- | ------------------------- | ------------------------------- |
| `otp`   | string | Yes      | Numeric, exactly 6 digits | OTP received at the new email   |
| `email` | string | Yes      | Valid email format        | The new email address to verify |

#### Example Request

```json
{
  "otp": "391847",
  "email": "newemail@example.com"
}
```

#### Success Response

```json
{
  "status": "success",
  "message": "Email updated successfully. Please log in again."
}
```

#### Response Fields

| Field     | Type   | Description                         |
| --------- | ------ | ----------------------------------- |
| `status`  | string | `"success"`                         |
| `message` | string | Confirmation that email was updated |

#### HTTP Status Codes

| Code  | Meaning                    |
| ----- | -------------------------- |
| `200` | Email updated successfully |
| `400` | OTP is invalid or expired  |
| `422` | Validation error           |

#### Edge Cases

- Returns `400` if the OTP does not match or has expired.
- After a successful response, the admin's session is invalidated and they must log in again with the new email.

---

# 3. SubAdmin Management

Provides full CRUD operations for managing sub-administrators under the main admin account.

---

### POST /admin/add-subadmin

#### Description

Creates a new sub-administrator account with profile information, hospital association, and role assignment.

#### Endpoint

```http
POST /admin/add-subadmin
```

#### Authentication

Required — Bearer Token

#### Request Body

| Field         | Type           | Required | Validation               | Description                            |
| ------------- | -------------- | -------- | ------------------------ | -------------------------------------- |
| `name`        | string         | Yes      | String                   | Full name of the sub-admin             |
| `email`       | string         | Yes      | Valid email, unique      | Email address (must not already exist) |
| `hospital`    | string         | Yes      | String                   | Hospital or organization name          |
| `location`    | string         | Yes      | Required                 | Geographic location                    |
| `phone`       | string         | Yes      | Exactly 10 digits        | Contact phone number                   |
| `designation` | string         | Yes      | String                   | Job title or role description          |
| `password`    | string         | Yes      | String, min 8 characters | Account password                       |
| `role`        | string/integer | Yes      | Required                 | Role identifier                        |

#### Example Request

```json
{
  "name": "John Smith",
  "email": "john@cityhospital.com",
  "hospital": "City Hospital",
  "location": "New York, NY",
  "phone": "1234567890",
  "designation": "Manager",
  "password": "securePass123",
  "role": 1
}
```

#### Success Response

```json
{
  "status": "success",
  "message": "Sub-Admin added successfully",
  "subAdmin": {
    "id": 1,
    "name": "John",
    "email": "john@gmail.com",
    "hospital": "City Hospital",
    "location": "NY",
    "phone": "1234567890",
    "designation": "Manager",
    "role": 1,
    "status": "Active",
    "created_at": "2026-06-10T11:01:59.000000Z",
    "updated_at": "2026-06-10T11:09:50.000000Z"
  }
}
```

#### Response Fields

| Field                  | Type    | Description                            |
| ---------------------- | ------- | -------------------------------------- |
| `status`               | string  | `"success"`                            |
| `message`              | string  | Confirmation message                   |
| `subAdmin.id`          | integer | Newly created sub-admin ID             |
| `subAdmin.name`        | string  | Sub-admin's name                       |
| `subAdmin.email`       | string  | Sub-admin's email                      |
| `subAdmin.hospital`    | string  | Hospital name                          |
| `subAdmin.location`    | string  | Location                               |
| `subAdmin.phone`       | string  | Phone number                           |
| `subAdmin.designation` | string  | Designation                            |
| `subAdmin.role`        | integer | Assigned role                          |
| `subAdmin.status`      | string  | Account status (`"Active"` by default) |
| `subAdmin.created_at`  | string  | Creation timestamp                     |
| `subAdmin.updated_at`  | string  | Last update timestamp                  |

#### HTTP Status Codes

| Code  | Meaning                                                 |
| ----- | ------------------------------------------------------- |
| `200` | Sub-admin created successfully                          |
| `422` | Validation error (e.g., duplicate email, invalid phone) |

#### Edge Cases

- Email uniqueness is enforced — submitting a duplicate email returns `422`.
- Phone number must be exactly 10 digits; any other length returns `422`.
- Minimum password length is 8 characters.

---

### GET /admin/view-subadmin

#### Description

Retrieves a paginated list of all sub-administrators registered in the system.

#### Endpoint

```http
GET /admin/view-subadmin
```

#### Authentication

Required — Bearer Token

#### Request Body

No request body required.

#### Success Response

```json
{
  "status": "success",
  "subAdmins": [
    {
      "id": 15,
      "name": "Rajat",
      "email": "rajatkhoware@gmail.com",
      "hospital": "Rajat Medical",
      "location": "Australia",
      "phone": "9999999888",
      "designation": "manager",
      "password": "$2y$10$...",
      "profile_image": "profile/1781089790_download.png",
      "otp": null,
      "status": "Active",
      "created_at": "2026-06-10T11:01:59.000000Z",
      "updated_at": "2026-06-10T11:09:50.000000Z",
      "role": 1,
      "profile": null
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 1,
    "total": 1
  }
}
```

#### Response Fields

| Field                       | Type        | Description                      |
| --------------------------- | ----------- | -------------------------------- |
| `status`                    | string      | `"success"`                      |
| `subAdmins`                 | array       | List of sub-admin objects        |
| `subAdmins[].id`            | integer     | Sub-admin ID                     |
| `subAdmins[].name`          | string      | Full name                        |
| `subAdmins[].email`         | string      | Email address                    |
| `subAdmins[].hospital`      | string      | Associated hospital              |
| `subAdmins[].location`      | string      | Location                         |
| `subAdmins[].phone`         | string      | Phone number                     |
| `subAdmins[].designation`   | string      | Job designation                  |
| `subAdmins[].profile_image` | string      | Relative path to profile image   |
| `subAdmins[].otp`           | string/null | Current OTP (null if none)       |
| `subAdmins[].status`        | string      | `"Active"` or `"Inactive"`       |
| `subAdmins[].role`          | integer     | Assigned role ID                 |
| `subAdmins[].profile`       | object/null | Extended profile object (if any) |
| `pagination.current_page`   | integer     | Current page number              |
| `pagination.last_page`      | integer     | Total number of pages            |
| `pagination.total`          | integer     | Total sub-admin count            |

#### HTTP Status Codes

| Code  | Meaning                    |
| ----- | -------------------------- |
| `200` | List returned successfully |

#### Edge Cases

- Returns paginated data with **50 records per page**.
- Returns an empty `subAdmins` array if no records exist.

---

### POST /admin/update-subadmin/{id}

#### Description

Updates the profile information of an existing sub-administrator identified by their `id`. All fields are optional except `id` — only provided fields will be updated.

#### Endpoint

```http
POST /admin/update-subadmin/{id}
```

#### URL Parameters

| Parameter | Type    | Description        |
| --------- | ------- | ------------------ |
| `id`      | integer | The sub-admin's ID |

#### Authentication

Required — Bearer Token

#### Request Body

| Field         | Type           | Required | Validation      | Description                |
| ------------- | -------------- | -------- | --------------- | -------------------------- |
| `id`          | string/integer | Yes      | Required        | Sub-admin ID to update     |
| `name`        | string         | No       | String          | Full name                  |
| `email`       | string         | No       | Valid email     | Email address              |
| `hospital`    | string         | No       | String          | Hospital name              |
| `location`    | string         | No       | String          | Location                   |
| `phone`       | string         | No       | String          | Phone number               |
| `designation` | string         | No       | String          | Job designation            |
| `role`        | string         | No       | String          | Role identifier            |
| `newPassword` | string         | No       | Optional string | New password (if changing) |

#### Example Request

```json
{
  "id": 15,
  "name": "Rajat Kumar",
  "designation": "Senior Manager",
  "newPassword": "newPassword123"
}
```

#### Success Response

```json
{
  "status": "success",
  "message": "Sub-admin updated successfully."
}
```

#### HTTP Status Codes

| Code  | Meaning                               |
| ----- | ------------------------------------- |
| `200` | Sub-admin updated successfully        |
| `404` | Sub-admin with the given ID not found |

#### Edge Cases

- Returns `404` if no sub-admin exists with the provided `id`.

---

### PATCH /admin/toggle-status/{id}

#### Description

Toggles the active/inactive status of a sub-administrator. Used to temporarily disable or re-enable a sub-admin's account access.

#### Endpoint

```http
PATCH /admin/toggle-status/{id}
```

#### URL Parameters

| Parameter | Type    | Description        |
| --------- | ------- | ------------------ |
| `id`      | integer | The sub-admin's ID |

#### Authentication

Required — Bearer Token

#### Request Body

| Field    | Type   | Required | Validation                 | Description          |
| -------- | ------ | -------- | -------------------------- | -------------------- |
| `status` | string | Yes      | `"Active"` or `"Inactive"` | The new status value |

#### Example Request

```json
{
  "status": "Inactive"
}
```

#### Success Response

```json
{
  "status": "success",
  "message": "Status updated successfully",
  "updated_status": "Inactive"
}
```

#### Response Fields

| Field            | Type   | Description                  |
| ---------------- | ------ | ---------------------------- |
| `status`         | string | `"success"`                  |
| `message`        | string | Confirmation message         |
| `updated_status` | string | The new status value applied |

#### HTTP Status Codes

| Code  | Meaning                     |
| ----- | --------------------------- |
| `200` | Status updated successfully |
| `404` | Sub-admin ID not found      |

#### Edge Cases

- Returns `404` if no record matches the provided `id`.
- Accepted values for `status` are `"Active"` and `"Inactive"`.

---

### DELETE /admin/delete-subadmin/{id}

#### Description

Permanently deletes a sub-administrator account by their ID. This action is irreversible.

#### Endpoint

```http
DELETE /admin/delete-subadmin/{id}
```

#### URL Parameters

| Parameter | Type    | Description                  |
| --------- | ------- | ---------------------------- |
| `id`      | integer | The sub-admin's ID to delete |

#### Authentication

Required — Bearer Token

#### Request Body

No request body required.

#### Success Response

```json
{
  "status": "success",
  "message": "Sub-admin deleted successfully"
}
```

#### HTTP Status Codes

| Code  | Meaning             |
| ----- | ------------------- |
| `200` | Sub-admin deleted   |
| `404` | Sub-admin not found |

#### Edge Cases

- Returns `404` if the user does not exist.
- Deletion is permanent. Consider using `PATCH /admin/toggle-status/{id}` to disable instead.

---

# 4. FAQ Management

Provides CRUD operations for managing Frequently Asked Questions (FAQs) displayed in the application.

---

### POST /admin/add-faqs

#### Description

Creates a new FAQ entry with a question and its corresponding answer.

#### Endpoint

```http
POST /admin/add-faqs
```

#### Authentication

Required — Bearer Token

#### Request Body

| Field      | Type   | Required | Validation                        | Description      |
| ---------- | ------ | -------- | --------------------------------- | ---------------- |
| `question` | string | Yes      | String, min 4, max 100 characters | The FAQ question |
| `answer`   | string | Yes      | String, min 4, max 250 characters | The FAQ answer   |

#### Example Request

```json
{
  "question": "How do I reset my password?",
  "answer": "Navigate to Account Settings and click Change Password."
}
```

#### Success Response

```json
{
  "message": "FAQ added successfully",
  "data": {
    "id": 1,
    "question": "How to reset password?",
    "answer": "Go to settings.",
    "status": "Active",
    "created_at": "2026-06-10T11:01:59.000000Z",
    "updated_at": "2026-06-10T11:01:59.000000Z"
  }
}
```

#### Response Fields

| Field             | Type    | Description           |
| ----------------- | ------- | --------------------- |
| `message`         | string  | Confirmation message  |
| `data.id`         | integer | Newly created FAQ ID  |
| `data.question`   | string  | The FAQ question      |
| `data.answer`     | string  | The FAQ answer        |
| `data.status`     | string  | `"Active"` by default |
| `data.created_at` | string  | Creation timestamp    |
| `data.updated_at` | string  | Last update timestamp |

#### HTTP Status Codes

| Code  | Meaning                                              |
| ----- | ---------------------------------------------------- |
| `200` | FAQ created successfully                             |
| `422` | Validation error (e.g., field too short or too long) |

#### Edge Cases

- `question` must be between 4 and 100 characters.
- `answer` must be between 4 and 250 characters.

---

### GET /admin/view-faqs

#### Description

Retrieves a paginated list of all FAQ entries.

#### Endpoint

```http
GET /admin/view-faqs
```

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "faqs": [
    {
      "id": 1,
      "question": "How to reset password?",
      "answer": "Go to settings.",
      "status": "Active",
      "created_at": "2026-06-10T11:01:59.000000Z",
      "updated_at": "2026-06-10T11:01:59.000000Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 1,
    "total": 1
  }
}
```

#### HTTP Status Codes

| Code  | Meaning                    |
| ----- | -------------------------- |
| `200` | List returned successfully |

#### Edge Cases

- Returns paginated data — **50 items per page**.

---

### PUT /admin/update-faqs/{editId}

#### Description

Updates an existing FAQ entry by its ID.

#### Endpoint

```http
PUT /admin/update-faqs/{editId}
```

#### URL Parameters

| Parameter | Type    | Description                 |
| --------- | ------- | --------------------------- |
| `editId`  | integer | The ID of the FAQ to update |

#### Authentication

Required — Bearer Token

#### Request Body

| Field      | Type   | Required | Validation                        | Description           |
| ---------- | ------ | -------- | --------------------------------- | --------------------- |
| `question` | string | Yes      | String, min 4, max 100 characters | Updated question text |
| `answer`   | string | Yes      | String, min 4, max 250 characters | Updated answer text   |

#### Example Request

```json
{
  "question": "How do I reset my password?",
  "answer": "Go to Settings > Account > Change Password."
}
```

#### Success Response

```json
{
  "message": "FAQ updated successfully",
  "data": {
    "id": 1,
    "question": "How to reset password updated?",
    "answer": "Go to settings updated.",
    "status": "Active",
    "created_at": "2026-06-10T11:01:59.000000Z",
    "updated_at": "2026-06-10T11:01:59.000000Z"
  }
}
```

#### HTTP Status Codes

| Code  | Meaning                  |
| ----- | ------------------------ |
| `200` | FAQ updated successfully |
| `404` | FAQ not found            |
| `422` | Validation error         |

#### Edge Cases

- Returns `404` if no FAQ exists with the given `editId`.

---

### PATCH /admin/toggle-status-faq/{id}

#### Description

Toggles the active/inactive status of a specific FAQ.

#### Endpoint

```http
PATCH /admin/toggle-status-faq/{id}
```

#### URL Parameters

| Parameter | Type    | Description  |
| --------- | ------- | ------------ |
| `id`      | integer | The FAQ's ID |

#### Authentication

Required — Bearer Token

#### Request Body

| Field    | Type   | Required | Validation | Description                                   |
| -------- | ------ | -------- | ---------- | --------------------------------------------- |
| `status` | string | Yes      | String     | New status value (`"Active"` or `"Inactive"`) |

#### Example Request

```json
{
  "status": "Active"
}
```

#### Success Response

```json
{
  "status": "success",
  "message": "Status Updated! The Faq is now Active!",
  "updated_status": "Active"
}
```

#### HTTP Status Codes

| Code  | Meaning        |
| ----- | -------------- |
| `200` | Status updated |
| `404` | FAQ not found  |

---

### DELETE /admin/delete-faq/{id}

#### Description

Permanently deletes a FAQ entry by its ID.

#### Endpoint

```http
DELETE /admin/delete-faq/{id}
```

#### URL Parameters

| Parameter | Type    | Description            |
| --------- | ------- | ---------------------- |
| `id`      | integer | The FAQ's ID to delete |

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "message": "Faq deleted successfully"
}
```

#### HTTP Status Codes

| Code  | Meaning       |
| ----- | ------------- |
| `200` | FAQ deleted   |
| `404` | FAQ not found |

---

# 5. Notification Management

Manages push notifications sent to all application users from the admin panel.

---

### POST /admin/add-notification

#### Description

Sends a push notification to all registered application users. Internally, this endpoint dispatches background jobs to handle bulk push notification delivery.

#### Endpoint

```http
POST /admin/add-notification
```

#### Authentication

Required — Bearer Token

#### Request Body

| Field     | Type   | Required | Validation                  | Description                   |
| --------- | ------ | -------- | --------------------------- | ----------------------------- |
| `message` | string | Yes      | String, max 1000 characters | The notification message body |

#### Example Request

```json
{
  "message": "A new update is available. Please update your app to the latest version."
}
```

#### Success Response

```json
{
  "status": "success",
  "message": "Notification sent successfully!",
  "notification": {
    "id": 1,
    "title": "Notification From Admin",
    "message": "Update available",
    "created_at": "2026-06-10T11:01:59.000000Z",
    "updated_at": "2026-06-10T11:01:59.000000Z"
  }
}
```

#### Response Fields

| Field                     | Type    | Description                             |
| ------------------------- | ------- | --------------------------------------- |
| `status`                  | string  | `"success"`                             |
| `message`                 | string  | Confirmation message                    |
| `notification.id`         | integer | Notification record ID                  |
| `notification.title`      | string  | Auto-set to `"Notification From Admin"` |
| `notification.message`    | string  | The sent message body                   |
| `notification.created_at` | string  | Creation timestamp                      |
| `notification.updated_at` | string  | Last update timestamp                   |

#### HTTP Status Codes

| Code  | Meaning                                                  |
| ----- | -------------------------------------------------------- |
| `200` | Notification dispatched                                  |
| `422` | Validation error (e.g., message exceeds 1000 characters) |

#### Edge Cases

- Push notifications are dispatched via background jobs — delivery is asynchronous.
- Message must not exceed 1000 characters.

---

### GET /admin/get-notification

#### Description

Retrieves a paginated list of all previously sent notifications.

#### Endpoint

```http
GET /admin/get-notification
```

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "notification": [
    {
      "id": 1,
      "title": "Notification From Admin",
      "message": "Update available",
      "created_at": "2026-06-10T11:01:59.000000Z",
      "updated_at": "2026-06-10T11:01:59.000000Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 1,
    "total": 1
  }
}
```

#### HTTP Status Codes

| Code  | Meaning                       |
| ----- | ----------------------------- |
| `200` | Notification history returned |

#### Edge Cases

- Returns paginated data — **50 items per page**.

---

# 6. CMS Management

Manages Content Management System (CMS) pages such as Terms and Conditions, Privacy Policy, and other static content pages.

---

### GET /admin/get_pages

#### Description

Retrieves a paginated list of all CMS pages managed through the admin panel.

#### Endpoint

```http
GET /admin/get_pages
```

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "Cms": [
    {
      "id": 1,
      "page_name": "Terms and Conditions",
      "description": "<p>Content</p>",
      "status": "Active",
      "created_at": "2026-06-10T11:01:59.000000Z",
      "updated_at": "2026-06-10T11:01:59.000000Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 1,
    "total": 1
  }
}
```

#### Response Fields

| Field               | Type    | Description                |
| ------------------- | ------- | -------------------------- |
| `status`            | string  | `"success"`                |
| `Cms`               | array   | List of CMS page objects   |
| `Cms[].id`          | integer | Page ID                    |
| `Cms[].page_name`   | string  | Name of the CMS page       |
| `Cms[].description` | string  | HTML content of the page   |
| `Cms[].status`      | string  | `"Active"` or `"Inactive"` |
| `Cms[].created_at`  | string  | Creation timestamp         |
| `Cms[].updated_at`  | string  | Last update timestamp      |

#### HTTP Status Codes

| Code  | Meaning            |
| ----- | ------------------ |
| `200` | CMS pages returned |

#### Notes

- Returns paginated data — 50 items per page.
- The `description` field contains raw HTML content.

---

### PUT /admin/update-page-content/{id}

#### Description

Updates the name and/or content of an existing CMS page by its ID.

#### Endpoint

```http
PUT /admin/update-page-content/{id}
```

#### URL Parameters

| Parameter | Type    | Description       |
| --------- | ------- | ----------------- |
| `id`      | integer | The CMS page's ID |

#### Authentication

Required — Bearer Token

#### Request Body

| Field         | Type   | Required | Validation                 | Description                       |
| ------------- | ------ | -------- | -------------------------- | --------------------------------- |
| `page_name`   | string | Yes      | String, max 255 characters | The page title                    |
| `description` | string | Yes      | String                     | The full HTML content of the page |

#### Example Request

```json
{
  "page_name": "Privacy Policy",
  "description": "<h1>Privacy Policy</h1><p>We respect your privacy...</p>"
}
```

#### Success Response

```json
{
  "message": "Page content updated successfully."
}
```

#### HTTP Status Codes

| Code  | Meaning                        |
| ----- | ------------------------------ |
| `200` | Page updated                   |
| `500` | Database save operation failed |

#### Edge Cases

- Returns `500` if an internal database error occurs during the save operation.

---

### PATCH /admin/toggle-status-cms/{id}

#### Description

Toggles the active/inactive status of a CMS page.

#### Endpoint

```http
PATCH /admin/toggle-status-cms/{id}
```

#### URL Parameters

| Parameter | Type    | Description       |
| --------- | ------- | ----------------- |
| `id`      | integer | The CMS page's ID |

#### Authentication

Required — Bearer Token

#### Request Body

| Field    | Type   | Required | Validation | Description                             |
| -------- | ------ | -------- | ---------- | --------------------------------------- |
| `status` | string | Yes      | String     | New status (`"Active"` or `"Inactive"`) |

#### Success Response

```json
{
  "status": "success",
  "message": "Status updated successfully",
  "updated_status": "Inactive"
}
```

#### HTTP Status Codes

| Code  | Meaning            |
| ----- | ------------------ |
| `200` | Status toggled     |
| `404` | CMS page not found |

---

# 7. Blog Management

Full CRUD operations for blog categories and blog posts, including image management and status control.

---

### POST /admin/add-blogcategory

#### Description

Creates a new blog category with a title, description, and an icon image.

#### Endpoint

```http
POST /admin/add-blogcategory
```

#### Authentication

Required — Bearer Token

#### Request Body

Use `Content-Type: multipart/form-data` due to file upload.

| Field         | Type   | Required | Validation                               | Description          |
| ------------- | ------ | -------- | ---------------------------------------- | -------------------- |
| `title`       | string | Yes      | String, min 2, max 100 characters        | Category title       |
| `description` | string | Yes      | String, min 2, max 500 characters        | Category description |
| `icon`        | file   | Yes      | File, formats: jpg, jpeg, png, gif, webp | Category icon image  |

#### Success Response

```json
{
  "message": "Blog Category added successfully",
  "data": {
    "id": 1,
    "title": "Health Tips",
    "description": "Category for health tips",
    "icon": "images/blogcategory/icon.png",
    "status": "Active",
    "created_at": "2026-06-10T11:01:59.000000Z",
    "updated_at": "2026-06-10T11:01:59.000000Z"
  },
  "status": "success"
}
```

#### HTTP Status Codes

| Code  | Meaning                                            |
| ----- | -------------------------------------------------- |
| `200` | Category created                                   |
| `422` | Validation error (invalid file type, field length) |

#### Edge Cases

- Only image file formats are accepted for `icon`: jpg, jpeg, png, gif, webp.

---

### GET /admin/get-blogcategories

#### Description

Retrieves a paginated list of all blog categories.

#### Endpoint

```http
GET /admin/get-blogcategories
```

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "blogs": [
    {
      "id": 1,
      "title": "Health Tips",
      "description": "Category for health tips",
      "icon": "images/blogcategory/icon.png",
      "status": "Active",
      "created_at": "2026-06-10T11:01:59.000000Z",
      "updated_at": "2026-06-10T11:01:59.000000Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 1,
    "total": 1
  }
}
```

#### HTTP Status Codes

| Code  | Meaning             |
| ----- | ------------------- |
| `200` | Categories returned |

---

### PATCH /admin/toggle-status-blog-category/{id}

#### Description

Toggles the active/inactive status of a blog category.

#### Endpoint

```http
PATCH /admin/toggle-status-blog-category/{id}
```

#### URL Parameters

| Parameter | Type    | Description      |
| --------- | ------- | ---------------- |
| `id`      | integer | Blog category ID |

#### Authentication

Required — Bearer Token

#### Request Body

| Field    | Type   | Required | Validation | Description      |
| -------- | ------ | -------- | ---------- | ---------------- |
| `status` | string | Yes      | String     | New status value |

#### Success Response

```json
{
  "status": "success",
  "message": "Status Updated! The blog category is now Active!",
  "updated_status": "Active"
}
```

#### HTTP Status Codes

| Code  | Meaning            |
| ----- | ------------------ |
| `200` | Status updated     |
| `404` | Category not found |

---

### DELETE /admin/delete-blogcategories/{id}

#### Description

Permanently deletes a blog category by its ID.

#### Endpoint

```http
DELETE /admin/delete-blogcategories/{id}
```

#### URL Parameters

| Parameter | Type    | Description                |
| --------- | ------- | -------------------------- |
| `id`      | integer | Blog category ID to delete |

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "message": "Blog Category deleted successfully"
}
```

#### HTTP Status Codes

| Code  | Meaning            |
| ----- | ------------------ |
| `200` | Deleted            |
| `404` | Category not found |

---

### POST /admin/update-blogcategory/{id}

#### Description

Updates an existing blog category. If a new icon file is provided, the old icon is deleted from storage and replaced with the new one.

#### Endpoint

```http
POST /admin/update-blogcategory/{id}
```

#### URL Parameters

| Parameter | Type    | Description      |
| --------- | ------- | ---------------- |
| `id`      | integer | Blog category ID |

#### Authentication

Required — Bearer Token

#### Request Body

Use `Content-Type: multipart/form-data` if uploading a new icon.

| Field         | Type   | Required | Validation                                                          | Description          |
| ------------- | ------ | -------- | ------------------------------------------------------------------- | -------------------- |
| `title`       | string | Yes      | String, min 2, max 100                                              | Category title       |
| `description` | string | Yes      | String, min 2, max 500                                              | Category description |
| `icon`        | file   | No       | Optional file, formats: jpg, jpeg, png, gif, webp, pdf, max 6144 KB | New category icon    |

#### Success Response

```json
{
  "message": "Blog Category updated successfully",
  "data": {
    "id": 1,
    "title": "Health Tips",
    "description": "Category for health tips",
    "icon": "images/blogcategory/icon.png",
    "status": "Active",
    "created_at": "2026-06-10T11:01:59.000000Z",
    "updated_at": "2026-06-10T11:01:59.000000Z"
  },
  "status": "success"
}
```

#### HTTP Status Codes

| Code  | Meaning            |
| ----- | ------------------ |
| `200` | Category updated   |
| `404` | Category not found |
| `422` | Validation error   |

#### Edge Cases

- If a new icon is uploaded, the existing icon file is deleted from storage.
- Maximum icon file size is **6 MB** (6144 KB).

---

### POST /admin/add-blog

#### Description

Creates a new blog post and associates it with an existing blog category.

#### Endpoint

```http
POST /admin/add-blog
```

#### Authentication

Required — Bearer Token

#### Request Body

Use `Content-Type: multipart/form-data` if uploading an image.

| Field         | Type    | Required | Validation             | Description                        |
| ------------- | ------- | -------- | ---------------------- | ---------------------------------- |
| `title`       | string  | Yes      | String, min 3, max 100 | Blog post title                    |
| `content`     | string  | Yes      | String, min 5          | Blog post content (HTML supported) |
| `category_id` | integer | Yes      | Integer                | ID of the blog category            |
| `status`      | string  | Yes      | String                 | Publication status                 |
| `image`       | file    | No       | Optional file          | Featured image for the blog post   |

#### Example Request

```json
{
  "title": "10 Tips for a Healthy Diet",
  "content": "<p>Here are 10 tips to maintain a healthy diet...</p>",
  "category_id": 1,
  "status": "Active"
}
```

#### Success Response

```json
{
  "message": "Blog Added Successfully",
  "data": {
    "id": 1,
    "title": "How to lose weight",
    "description": "Content of the blog",
    "blog_category_id": 1,
    "visibility_status": "Public",
    "image": "images/blog/img.png",
    "status": "Active",
    "created_at": "2026-06-10T11:01:59.000000Z",
    "updated_at": "2026-06-10T11:01:59.000000Z"
  },
  "status": "success"
}
```

#### HTTP Status Codes

| Code  | Meaning           |
| ----- | ----------------- |
| `200` | Blog post created |
| `422` | Validation error  |

---

### GET /admin/view-blog

#### Description

Retrieves a paginated list of all blog posts, each including its associated category details.

#### Endpoint

```http
GET /admin/view-blog
```

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "blogs": [
    {
      "id": 1,
      "title": "How to lose weight",
      "description": "Content of the blog",
      "blog_category_id": 1,
      "visibility_status": "Public",
      "image": "images/blog/img.png",
      "status": "Active",
      "created_at": "2026-06-10T11:01:59.000000Z",
      "updated_at": "2026-06-10T11:01:59.000000Z",
      "category": {
        "id": 1,
        "title": "Health Tips",
        "description": "Category for health tips",
        "icon": "images/blogcategory/icon.png",
        "status": "Active",
        "created_at": "2026-06-10T11:01:59.000000Z",
        "updated_at": "2026-06-10T11:01:59.000000Z"
      }
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 1,
    "total": 1
  }
}
```

#### HTTP Status Codes

| Code  | Meaning            |
| ----- | ------------------ |
| `200` | Blog list returned |

#### Edge Cases

- Each blog entry includes its full `category` relation object.

---

### POST /admin/update-blog/{id}

#### Description

Updates an existing blog post. If a new image is provided, the old image is replaced.

#### Endpoint

```http
POST /admin/update-blog/{id}
```

#### URL Parameters

| Parameter | Type    | Description  |
| --------- | ------- | ------------ |
| `id`      | integer | Blog post ID |

#### Authentication

Required — Bearer Token

#### Request Body

| Field         | Type    | Required | Validation             | Description        |
| ------------- | ------- | -------- | ---------------------- | ------------------ |
| `title`       | string  | Yes      | String, min 3, max 100 | Blog post title    |
| `content`     | string  | Yes      | String                 | Blog post content  |
| `category_id` | integer | Yes      | Integer                | Blog category ID   |
| `status`      | string  | Yes      | String                 | Status value       |
| `image`       | file    | No       | Optional file          | New featured image |

#### Success Response

```json
{
  "message": "Blog Updated Successfully",
  "data": {
    "id": 1,
    "title": "How to lose weight updated",
    "description": "Content of the blog",
    "blog_category_id": 1,
    "visibility_status": "Public",
    "image": "images/blog/img.png",
    "status": "Active",
    "created_at": "2026-06-10T11:01:59.000000Z",
    "updated_at": "2026-06-10T11:01:59.000000Z"
  },
  "status": "success"
}
```

#### HTTP Status Codes

| Code  | Meaning          |
| ----- | ---------------- |
| `200` | Blog updated     |
| `404` | Blog not found   |
| `422` | Validation error |

#### Edge Cases

- If a new image is uploaded, the old blog image is removed from storage.

---

### DELETE /admin/delete-blog/{id}

#### Description

Permanently deletes a blog post by its ID.

#### Endpoint

```http
DELETE /admin/delete-blog/{id}
```

#### URL Parameters

| Parameter | Type    | Description            |
| --------- | ------- | ---------------------- |
| `id`      | integer | Blog post ID to delete |

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "message": "Blog deleted successfully"
}
```

#### HTTP Status Codes

| Code  | Meaning        |
| ----- | -------------- |
| `200` | Blog deleted   |
| `404` | Blog not found |

---

# 8. Program Matnagement

Manages health and fitness programs, including diet plans, program replication, and food visibility settings.

---

### POST /admin/add-program

#### Description

Creates a new health program with a title, description, duration, and a required cover image.

#### Endpoint

```http
POST /admin/add-program
```

#### Authentication

Required — Bearer Token

#### Request Body

Use `Content-Type: multipart/form-data` due to file upload.

| Field         | Type   | Required | Validation                                       | Description                        |
| ------------- | ------ | -------- | ------------------------------------------------ | ---------------------------------- |
| `title`       | string | Yes      | String, max 255                                  | Program title                      |
| `description` | string | Yes      | String                                           | Program description                |
| `duration`    | string | Yes      | Required                                         | Program duration (e.g., "30 days") |
| `image`       | file   | Yes      | File, formats: jpeg, png, gif, webp, max 6144 KB | Program cover image                |

#### Example Request

```json
{
  "title": "Weight Loss Program",
  "description": "A 30-day program focused on caloric deficit and strength training.",
  "duration": "30 days"
}
```

#### Success Response

```json
{
  "message": "Program Added Successfully",
  "data": {
    "id": 1,
    "title": "Weight Loss Program",
    "description": "Program description",
    "image": "images/manage_programs/img.png",
    "duration": "30 days",
    "status": "Active",
    "is_approve_nonapproved_foods_show": 1,
    "created_at": "2026-06-10T11:01:59.000000Z",
    "updated_at": "2026-06-10T11:01:59.000000Z"
  },
  "status": "success"
}
```

#### Response Fields

| Field                                    | Type    | Description                                       |
| ---------------------------------------- | ------- | ------------------------------------------------- |
| `data.id`                                | integer | Program ID                                        |
| `data.title`                             | string  | Program title                                     |
| `data.description`                       | string  | Program description                               |
| `data.image`                             | string  | Relative path to cover image                      |
| `data.duration`                          | string  | Duration string                                   |
| `data.status`                            | string  | `"Active"` by default                             |
| `data.is_approve_nonapproved_foods_show` | integer | Whether unapproved foods are visible (`1` = show) |

#### HTTP Status Codes

| Code  | Meaning          |
| ----- | ---------------- |
| `200` | Program created  |
| `422` | Validation error |

---

### POST /admin/update-program/{id}

#### Description

Updates an existing program. The image field is optional — if a new image is uploaded, the old one is deleted.

#### Endpoint

```http
POST /admin/update-program/{id}
```

#### URL Parameters

| Parameter | Type    | Description |
| --------- | ------- | ----------- |
| `id`      | integer | Program ID  |

#### Authentication

Required — Bearer Token

#### Request Body

| Field         | Type   | Required | Validation                                                | Description         |
| ------------- | ------ | -------- | --------------------------------------------------------- | ------------------- |
| `title`       | string | Yes      | String, max 255                                           | Program title       |
| `description` | string | Yes      | String                                                    | Program description |
| `duration`    | string | Yes      | Required                                                  | Program duration    |
| `image`       | file   | No       | Nullable file, formats: jpeg, png, gif, webp, max 6144 KB | New cover image     |

#### Success Response

```json
{
  "message": "Program updated successfully",
  "data": {
    "id": 1,
    "title": "Weight Loss Program",
    "description": "Program description",
    "image": "images/manage_programs/img.png",
    "duration": "30 days",
    "status": "Active",
    "is_approve_nonapproved_foods_show": 1,
    "created_at": "2026-06-10T11:01:59.000000Z",
    "updated_at": "2026-06-10T11:01:59.000000Z"
  },
  "status": "success"
}
```

#### HTTP Status Codes

| Code  | Meaning           |
| ----- | ----------------- |
| `200` | Program updated   |
| `404` | Program not found |
| `422` | Validation error  |

---

### GET /admin/view-programs

#### Description

Retrieves a paginated list of all health programs.

#### Endpoint

```http
GET /admin/view-programs
```

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "programs": [
    {
      "id": 1,
      "title": "Weight Loss Program",
      "description": "Program description",
      "image": "images/manage_programs/img.png",
      "duration": "30 days",
      "status": "Active",
      "is_approve_nonapproved_foods_show": 1,
      "created_at": "2026-06-10T11:01:59.000000Z",
      "updated_at": "2026-06-10T11:01:59.000000Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 1,
    "total": 1
  }
}
```

#### HTTP Status Codes

| Code  | Meaning                |
| ----- | ---------------------- |
| `200` | Programs list returned |

---

### DELETE /admin/delete-program/{id}

#### Description

Permanently deletes a program by its ID.

#### Endpoint

```http
DELETE /admin/delete-program/{id}
```

#### URL Parameters

| Parameter | Type    | Description          |
| --------- | ------- | -------------------- |
| `id`      | integer | Program ID to delete |

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "message": "Program deleted successfully"
}
```

#### HTTP Status Codes

| Code  | Meaning           |
| ----- | ----------------- |
| `200` | Program deleted   |
| `404` | Program not found |

---

### PATCH /admin/toggle-status-program/{id}

#### Description

Toggles the active/inactive status of a program.

#### Endpoint

```http
PATCH /admin/toggle-status-program/{id}
```

#### URL Parameters

| Parameter | Type    | Description |
| --------- | ------- | ----------- |
| `id`      | integer | Program ID  |

#### Authentication

Required — Bearer Token

#### Request Body

| Field    | Type   | Required | Validation | Description                             |
| -------- | ------ | -------- | ---------- | --------------------------------------- |
| `status` | string | Yes      | String     | New status (`"Active"` or `"Inactive"`) |

#### Success Response

```json
{
  "status": "success",
  "message": "Status Updated! The program is now Active!",
  "updated_status": "Active"
}
```

#### HTTP Status Codes

| Code  | Meaning           |
| ----- | ----------------- |
| `200` | Status updated    |
| `404` | Program not found |

---

### PATCH /admin/toggle-status-food-visibility/{id}

#### Description

Toggles the boolean `is_approve_nonapproved_foods_show` flag on a program. When enabled, unapproved food items are visible to users assigned to this program.

#### Endpoint

```http
PATCH /admin/toggle-status-food-visibility/{id}
```

#### URL Parameters

| Parameter | Type    | Description |
| --------- | ------- | ----------- |
| `id`      | integer | Program ID  |

#### Authentication

Required — Bearer Token

#### Request Body

No request body required.

#### Success Response

```json
{
  "status": "success",
  "message": "Food visibility status updated successfully!",
  "new_status": true
}
```

#### Response Fields

| Field        | Type    | Description                               |
| ------------ | ------- | ----------------------------------------- |
| `status`     | string  | `"success"`                               |
| `message`    | string  | Confirmation message                      |
| `new_status` | boolean | The new value of the food visibility flag |

#### HTTP Status Codes

| Code  | Meaning                    |
| ----- | -------------------------- |
| `200` | Visibility toggled         |
| `404` | Program not found          |
| `500` | Server error during toggle |

#### Edge Cases

- Toggles the boolean field `is_approve_nonapproved_foods_show` on the program record.

---

### POST /admin/replicate/{id}

#### Description

Duplicates an existing program along with all its related data including intro content, associated food items, and diet plans. A new program record is created with the suffix `" - Copy"` appended to the title.

#### Endpoint

```http
POST /admin/replicate/{id}
```

#### URL Parameters

| Parameter | Type    | Description                    |
| --------- | ------- | ------------------------------ |
| `id`      | integer | ID of the program to duplicate |

#### Authentication

Required — Bearer Token

#### Request Body

No request body required.

#### Success Response

```json
{
  "message": "Program duplicated successfully",
  "status": "success",
  "new_program": {
    "id": 2,
    "title": "Weight Loss Program - Copy",
    "description": "Program description",
    "image": "images/manage_programs/img.png",
    "duration": "30 days",
    "status": "Active",
    "is_approve_nonapproved_foods_show": 1,
    "created_at": "2026-06-10T11:01:59.000000Z",
    "updated_at": "2026-06-10T11:01:59.000000Z"
  }
}
```

#### Response Fields

| Field         | Type   | Description                         |
| ------------- | ------ | ----------------------------------- |
| `message`     | string | Confirmation message                |
| `status`      | string | `"success"`                         |
| `new_program` | object | The newly duplicated program object |

#### HTTP Status Codes

| Code  | Meaning                  |
| ----- | ------------------------ |
| `200` | Program duplicated       |
| `400` | Bad request              |
| `404` | Source program not found |

#### Edge Cases

- Duplicates the program and all related intro, food, and diet plan data.
- The new program title gets `" - Copy"` appended.

---

# 9. Nutrition / Diet Meal Data

Manages the nutritional meal database used in diet programs and meal plans.

---

### GET /admin/nutrition

#### Description

Retrieves a paginated list of all active nutrition/meal records from the `DietMealData` table.

#### Endpoint

```http
GET /admin/nutrition
```

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "nutrition": [
    {
      "id": 1,
      "Meal_title": "Oats",
      "Meal_Protien_In_gm": 10,
      "Meal_Carbs_In_gm": 20,
      "Meal_Calories_In_gm": 150,
      "Meal_Fats_In_gm": 5,
      "Meal_Description": "Healthy oats",
      "Meal_Image_url": "image.png",
      "Meal_instructions": "[\"Boil water\"]",
      "Meal_ingredients": "[\"Oats\"]",
      "Meal_Serving": 1,
      "Meal_Type": "Breakfast",
      "Meal_Status": "Active",
      "created_at": "2026-06-10T11:01:59.000000Z",
      "updated_at": "2026-06-10T11:01:59.000000Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 1,
    "total": 1
  }
}
```

#### Response Fields

| Field                             | Type    | Description                                            |
| --------------------------------- | ------- | ------------------------------------------------------ |
| `nutrition[].id`                  | integer | Meal record ID                                         |
| `nutrition[].Meal_title`          | string  | Meal name                                              |
| `nutrition[].Meal_Protien_In_gm`  | number  | Protein content in grams                               |
| `nutrition[].Meal_Carbs_In_gm`    | number  | Carbohydrates in grams                                 |
| `nutrition[].Meal_Calories_In_gm` | number  | Calorie content                                        |
| `nutrition[].Meal_Fats_In_gm`     | number  | Fat content in grams                                   |
| `nutrition[].Meal_Description`    | string  | Short description                                      |
| `nutrition[].Meal_Image_url`      | string  | Image URL                                              |
| `nutrition[].Meal_instructions`   | string  | JSON-encoded array of preparation instructions         |
| `nutrition[].Meal_ingredients`    | string  | JSON-encoded array of ingredients                      |
| `nutrition[].Meal_Serving`        | number  | Serving size                                           |
| `nutrition[].Meal_Type`           | string  | Meal type (e.g., `"Breakfast"`, `"Lunch"`, `"Dinner"`) |
| `nutrition[].Meal_Status`         | string  | `"Active"` or `"Inactive"`                             |

#### HTTP Status Codes

| Code  | Meaning                 |
| ----- | ----------------------- |
| `200` | Nutrition list returned |
| `500` | Server error            |

#### Edge Cases

- Only returns records where `Meal_Status` is `"Active"`.

---

### POST /admin/add-nutrition

#### Description

Creates a new nutrition/meal record. Multi-line text for ingredients and instructions is automatically converted into JSON arrays.

#### Endpoint

```http
POST /admin/add-nutrition
```

#### Authentication

Required — Bearer Token

#### Request Body

| Field              | Type   | Required | Validation                       | Description                                 |
| ------------------ | ------ | -------- | -------------------------------- | ------------------------------------------- |
| `title`            | string | Yes      | String, max 255                  | Meal name                                   |
| `protein`          | number | Yes      | Numeric, min 0                   | Protein in grams                            |
| `carbs`            | number | Yes      | Numeric, min 0                   | Carbs in grams                              |
| `calories`         | number | Yes      | Numeric, min 0                   | Calories                                    |
| `fats`             | number | Yes      | Numeric, min 0                   | Fats in grams                               |
| `description`      | string | No       | Nullable, max 500                | Meal description                            |
| `image`            | string | No       | String                           | Image URL or path                           |
| `Meal_Serving`     | number | Yes      | Numeric                          | Serving size                                |
| `Meal_Type`        | string | Yes      | Required                         | Meal type (e.g., `"Breakfast"`)             |
| `meal_description` | string | No       | Optional text, newline-separated | Instructions (each line becomes array item) |
| `meal_ingredients` | string | No       | Optional text, newline-separated | Ingredients (each line becomes array item)  |

#### Example Request

```json
{
  "title": "Oats with Milk",
  "protein": 10,
  "carbs": 25,
  "calories": 180,
  "fats": 4,
  "description": "Nutritious breakfast option",
  "Meal_Serving": 1,
  "Meal_Type": "Breakfast",
  "meal_ingredients": "Oats\nMilk\nHoney",
  "meal_description": "Boil water\nAdd oats\nStir for 5 minutes"
}
```

#### Success Response

```json
{
  "message": "Added! Nutrition Added Successfully",
  "data": {
    "id": 1,
    "Meal_title": "Oats",
    "Meal_Protien_In_gm": 10,
    "Meal_Carbs_In_gm": 20,
    "Meal_Calories_In_gm": 150,
    "Meal_Fats_In_gm": 5,
    "Meal_Description": "Healthy oats",
    "Meal_Image_url": "image.png",
    "Meal_instructions": "[\"Boil water\"]",
    "Meal_ingredients": "[\"Oats\"]",
    "Meal_Serving": 1,
    "Meal_Type": "Breakfast",
    "Meal_Status": "Active",
    "created_at": "2026-06-10T11:01:59.000000Z",
    "updated_at": "2026-06-10T11:01:59.000000Z"
  },
  "status": "success"
}
```

#### HTTP Status Codes

| Code  | Meaning                  |
| ----- | ------------------------ |
| `200` | Nutrition record created |
| `422` | Validation error         |

#### Edge Cases

- Multi-line `meal_description` and `meal_ingredients` are split by newlines and stored as JSON arrays.

---

### POST /admin/update-nutrition/{id}

#### Description

Updates an existing nutrition/meal record by its ID. All provided values replace existing ones.

#### Endpoint

```http
POST /admin/update-nutrition/{id}
```

#### URL Parameters

| Parameter | Type    | Description         |
| --------- | ------- | ------------------- |
| `id`      | integer | Nutrition record ID |

#### Authentication

Required — Bearer Token

#### Request Body

| Field          | Type   | Required | Validation              | Description                |
| -------------- | ------ | -------- | ----------------------- | -------------------------- |
| `title`        | string | Yes      | String, max 255, unique | Meal name (must be unique) |
| `protein`      | number | Yes      | Numeric, min 0          | Protein in grams           |
| `carbs`        | number | Yes      | Numeric, min 0          | Carbs in grams             |
| `calories`     | number | Yes      | Numeric, min 0          | Calories                   |
| `fats`         | number | Yes      | Numeric, min 0          | Fats in grams              |
| `description`  | string | No       | Nullable, max 500       | Meal description           |
| `image`        | string | No       | String                  | Image URL                  |
| `Meal_Serving` | number | Yes      | Numeric                 | Serving size               |
| `Meal_Type`    | string | No       | Optional string         | Meal type                  |

#### Success Response

```json
{
  "message": "Nutrition updated successfully!",
  "data": {
    "id": 1,
    "Meal_title": "Oats",
    "Meal_Protien_In_gm": 10,
    "Meal_Carbs_In_gm": 20,
    "Meal_Calories_In_gm": 150,
    "Meal_Fats_In_gm": 5,
    "Meal_Description": "Healthy oats",
    "Meal_Image_url": "image.png",
    "Meal_instructions": "[\"Boil water\"]",
    "Meal_ingredients": "[\"Oats\"]",
    "Meal_Serving": 1,
    "Meal_Type": "Breakfast",
    "Meal_Status": "Active",
    "created_at": "2026-06-10T11:01:59.000000Z",
    "updated_at": "2026-06-10T11:01:59.000000Z"
  },
  "status": "success"
}
```

#### HTTP Status Codes

| Code  | Meaning                                  |
| ----- | ---------------------------------------- |
| `200` | Nutrition updated                        |
| `404` | Record not found                         |
| `422` | Validation error (e.g., duplicate title) |

#### Edge Cases

- The `title` field must be unique across all `DietMealData` records.

---

### POST /admin/upload-nutrition

#### Description

Bulk imports nutrition records from an array of meal objects. Before inserting, each item's title is checked for existence to prevent duplicates.

#### Endpoint

```http
POST /admin/upload-nutrition
```

#### Authentication

Required — Bearer Token

#### Request Body

| Field  | Type  | Required | Validation            | Description                          |
| ------ | ----- | -------- | --------------------- | ------------------------------------ |
| `data` | array | Yes      | Array of meal objects | Array of nutrition objects to import |

#### Example Request

```json
{
  "data": [
    {
      "title": "Brown Rice",
      "protein": 5,
      "carbs": 45,
      "calories": 215,
      "fats": 2
    }
  ]
}
```

#### Success Response

```json
{
  "success": true,
  "message": "Nutrition data uploaded successfully",
  "status": "success"
}
```

#### HTTP Status Codes

| Code  | Meaning                |
| ----- | ---------------------- |
| `200` | Bulk upload successful |
| `400` | Bad request            |
| `422` | Validation error       |

#### Edge Cases

- Each item's title is checked — if it already exists, that item is skipped (no duplicate insertion).

---

# 10. Users

Provides access to the registered application user list with relational data.

---

### GET /admin/users

#### Description

Retrieves a paginated list of all registered application users, including their associated sub-admin, subscription plan, and transaction history.

#### Endpoint

```http
GET /admin/users
```

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "users": [
    {
      "id": 1,
      "user_id": "ABC12",
      "name": "John Doe",
      "email": "john@example.com",
      "mobileNo": "1234567890",
      "dob": "1990-01-01",
      "height": "180",
      "weight": "75",
      "gender": "Male",
      "status": "Active",
      "subadmin_id": 1,
      "created_at": "2026-06-10T11:01:59.000000Z",
      "updated_at": "2026-06-10T11:01:59.000000Z",
      "subAdmin": null,
      "plan": null,
      "transactions": []
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 1,
    "total": 1
  }
}
```

#### Response Fields

| Field                  | Type        | Description                                 |
| ---------------------- | ----------- | ------------------------------------------- |
| `users[].id`           | integer     | Internal database user ID                   |
| `users[].user_id`      | string      | Public-facing user identifier               |
| `users[].name`         | string      | User's full name                            |
| `users[].email`        | string      | Email address                               |
| `users[].mobileNo`     | string      | Mobile phone number                         |
| `users[].dob`          | string      | Date of birth (`YYYY-MM-DD`)                |
| `users[].height`       | string      | Height value                                |
| `users[].weight`       | string      | Weight value                                |
| `users[].gender`       | string      | Gender                                      |
| `users[].status`       | string      | Account status (`"Active"` or `"Inactive"`) |
| `users[].subadmin_id`  | integer     | Associated sub-admin ID                     |
| `users[].subAdmin`     | object/null | Linked sub-admin details (if any)           |
| `users[].plan`         | object/null | Active subscription plan (if any)           |
| `users[].transactions` | array       | List of transaction records                 |

#### HTTP Status Codes

| Code  | Meaning            |
| ----- | ------------------ |
| `200` | User list returned |
| `500` | Server error       |

#### Edge Cases

- Returns users with eager-loaded relations: `subAdmin`, `plan`, and `transactions`.

---

# 11. Dashboard

Provides summary statistics for the admin dashboard overview.

---

### GET /admin/dashboard

#### Description

Returns a count of all registered sub-administrators along with a list of sub-admin records for dashboard display.

#### Endpoint

```http
GET /admin/dashboard
```

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "subadminCount": 10,
  "subadmin": []
}
```

#### Response Fields

| Field           | Type    | Description                |
| --------------- | ------- | -------------------------- |
| `status`        | string  | `"success"`                |
| `subadminCount` | integer | Total number of sub-admins |
| `subadmin`      | array   | List of sub-admin data     |

#### HTTP Status Codes

| Code  | Meaning                 |
| ----- | ----------------------- |
| `200` | Dashboard data returned |

---

### GET /admin/userscount

#### Description

Returns the total count of registered application users for dashboard statistics.

#### Endpoint

```http
GET /admin/userscount
```

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "usersCount": 50,
  "users": []
}
```

#### Response Fields

| Field        | Type    | Description                      |
| ------------ | ------- | -------------------------------- |
| `status`     | string  | `"success"`                      |
| `usersCount` | integer | Total number of registered users |
| `users`      | array   | List of user data                |

#### HTTP Status Codes

| Code  | Meaning        |
| ----- | -------------- |
| `200` | Count returned |

---

# 12. Fitzone Management

Manages fitness zones — structured workout categories with headings, descriptions, and images.

---

### POST /admin/add-fitzone

#### Description

Creates a new Fitzone entry with a unique title, description, workout heading, sub-heading, and a cover image.

#### Endpoint

```http
POST /admin/add-fitzone
```

#### Authentication

Required — Bearer Token

#### Request Body

Use `Content-Type: multipart/form-data` due to file upload.

| Field                 | Type   | Required | Validation                                  | Description                   |
| --------------------- | ------ | -------- | ------------------------------------------- | ----------------------------- |
| `title`               | string | Yes      | String, max 255, unique in `fitzones` table | Fitzone title                 |
| `description`         | string | Yes      | String                                      | Fitzone description           |
| `workout_heading`     | string | Yes      | String                                      | Primary workout heading       |
| `workout_sub_heading` | string | Yes      | String                                      | Secondary workout sub-heading |
| `image`               | file   | Yes      | Formats: jpeg, jpg, png, gif, webp          | Fitzone cover image           |

#### Example Request

```json
{
  "title": "Yoga Basics",
  "description": "An introduction to yoga for beginners.",
  "workout_heading": "Start Your Yoga Journey",
  "workout_sub_heading": "Build flexibility and inner peace"
}
```

#### Success Response

```json
{
  "message": "Fitzone Added Successfully",
  "data": {
    "id": 1,
    "title": "Yoga Basics",
    "description": "Yoga for beginners",
    "image": "images/fitzone/yoga.png",
    "workout_heading": "Yoga Heading",
    "workout_sub_heading": "Yoga Sub",
    "status": "Active",
    "created_at": "2026-06-10T11:01:59.000000Z",
    "updated_at": "2026-06-10T11:01:59.000000Z"
  },
  "status": "success"
}
```

#### Response Fields

| Field                      | Type    | Description            |
| -------------------------- | ------- | ---------------------- |
| `data.id`                  | integer | Fitzone ID             |
| `data.title`               | string  | Fitzone title          |
| `data.description`         | string  | Description            |
| `data.image`               | string  | Relative path to image |
| `data.workout_heading`     | string  | Primary heading        |
| `data.workout_sub_heading` | string  | Sub heading            |
| `data.status`              | string  | `"Active"` by default  |

#### HTTP Status Codes

| Code  | Meaning                                                |
| ----- | ------------------------------------------------------ |
| `200` | Fitzone created                                        |
| `422` | Validation error (e.g., duplicate title, invalid file) |

#### Edge Cases

- The `title` field must be unique across all fitzone records.

---

### GET /admin/view-fitzone

#### Description

Retrieves a paginated list of all Fitzone entries.

#### Endpoint

```http
GET /admin/view-fitzone
```

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "fitzones": [
    {
      "id": 1,
      "title": "Yoga Basics",
      "description": "Yoga for beginners",
      "image": "images/fitzone/yoga.png",
      "workout_heading": "Yoga Heading",
      "workout_sub_heading": "Yoga Sub",
      "status": "Active",
      "created_at": "2026-06-10T11:01:59.000000Z",
      "updated_at": "2026-06-10T11:01:59.000000Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 1,
    "total": 1
  }
}
```

#### HTTP Status Codes

| Code  | Meaning               |
| ----- | --------------------- |
| `200` | Fitzone list returned |

---

# 13. Transactions

Manages payment transactions and subscription plan administration.

---

### GET /admin/transactions

#### Description

Retrieves a paginated list of all payment transactions. Each transaction includes user details, plan information, and a dynamically constructed invoice URL.

#### Endpoint

```http
GET /admin/transactions
```

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "transactions": [
    {
      "transaction_id": "TX123",
      "amount": "99.99",
      "status": "Success",
      "invoice_url": "https://apibackend.trimify.com.au/public/invoice.pdf",
      "user_id": 1,
      "plan_id": 1,
      "created_at": "2026-06-10T11:01:59.000000Z",
      "user": {
        "id": 1,
        "name": "John Doe",
        "plan": {
          "id": 1,
          "name": "Pro"
        }
      },
      "plan": {
        "id": 1,
        "name": "Pro"
      }
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 1,
    "total": 1
  }
}
```

#### Response Fields

| Field                           | Type    | Description                              |
| ------------------------------- | ------- | ---------------------------------------- |
| `transactions[].transaction_id` | string  | Unique transaction identifier            |
| `transactions[].amount`         | string  | Transaction amount                       |
| `transactions[].status`         | string  | Transaction status (e.g., `"Success"`)   |
| `transactions[].invoice_url`    | string  | Full URL to the downloadable invoice PDF |
| `transactions[].user_id`        | integer | ID of the user who made the transaction  |
| `transactions[].plan_id`        | integer | ID of the subscribed plan                |
| `transactions[].created_at`     | string  | Transaction timestamp                    |
| `transactions[].user`           | object  | User relation (name and plan)            |
| `transactions[].plan`           | object  | Plan relation (id and name)              |

#### HTTP Status Codes

| Code  | Meaning               |
| ----- | --------------------- |
| `200` | Transactions returned |
| `500` | Server error          |

#### Edge Cases

- The `invoice_url` is constructed by prepending the `API_URL` environment variable to the stored URL path if it exists.

---

### GET /admin/subscription

#### Description

Retrieves a paginated list of all available subscription plans.

#### Endpoint

```http
GET /admin/subscription
```

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "plans": [
    {
      "id": 1,
      "price": "99.99",
      "features": "Pro features",
      "created_at": "2026-06-10T11:01:59.000000Z",
      "updated_at": "2026-06-10T11:01:59.000000Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 1,
    "total": 1
  }
}
```

#### Response Fields

| Field                | Type    | Description                  |
| -------------------- | ------- | ---------------------------- |
| `plans[].id`         | integer | Plan ID                      |
| `plans[].price`      | string  | Plan price                   |
| `plans[].features`   | string  | Description of plan features |
| `plans[].created_at` | string  | Plan creation timestamp      |
| `plans[].updated_at` | string  | Last update timestamp        |

#### HTTP Status Codes

| Code  | Meaning        |
| ----- | -------------- |
| `200` | Plans returned |
| `500` | Server error   |

---

### POST /admin/update-subscription/{id}

#### Description

Updates the price and features of an existing subscription plan.

#### Endpoint

```http
POST /admin/update-subscription/{id}
```

#### URL Parameters

| Parameter | Type    | Description          |
| --------- | ------- | -------------------- |
| `id`      | integer | Subscription plan ID |

#### Authentication

Required — Bearer Token

#### Request Body

| Field      | Type   | Required | Validation | Description                 |
| ---------- | ------ | -------- | ---------- | --------------------------- |
| `price`    | string | Yes      | String     | New price for the plan      |
| `features` | string | Yes      | String     | Updated feature description |

#### Example Request

```json
{
  "price": "129.99",
  "features": "All Pro features + Priority support + Unlimited programs"
}
```

#### Success Response

```json
{
  "message": "Subscription Updated Successfully",
  "data": {
    "id": 1,
    "price": "99.99",
    "features": "Pro features",
    "created_at": "2026-06-10T11:01:59.000000Z",
    "updated_at": "2026-06-10T11:01:59.000000Z"
  },
  "status": "success"
}
```

#### HTTP Status Codes

| Code  | Meaning              |
| ----- | -------------------- |
| `200` | Subscription updated |
| `404` | Plan not found       |
| `422` | Validation error     |

#### Edge Cases

- Updates only `price` and `features` fields for the identified plan.

---

# API Best Practices

## Authentication

- Always use HTTPS when making requests in production environments.
- Store Bearer tokens securely — avoid `localStorage`; prefer `httpOnly` cookies.
- Tokens are invalidated on logout — clear them immediately after calling `POST /admin/logout`.

## Error Handling

- Always check the HTTP status code before parsing the response body.
- Handle `401` globally — redirect to the login page when authentication expires.
- Display user-friendly messages for `422` validation errors.
- Log `500` errors server-side and surface a generic message to the user.

## Validation

- Validate all inputs client-side before making API calls to reduce unnecessary round-trips.
- Follow the validation rules documented for each endpoint to avoid `422` responses.
- For file uploads, validate file types and sizes before submitting.

## Pagination

- Always handle paginated responses by checking `pagination.last_page` before requesting the next page.
- Use the `current_page` and `total` fields to render pagination UI components.

## File Uploads

- Use `multipart/form-data` content type for all endpoints that accept file uploads.
- Respect the documented `mimes` and `max` file size constraints.
- Do not rely on client-side validation alone — the server will reject non-compliant uploads with `422`.

## Security Recommendations

- Never log Bearer tokens or sensitive request data.
- Rotate tokens periodically and re-authenticate when required.
- Use environment variables to store the base URL and tokens — do not hardcode them.
- Ensure that only admin-role users can access these endpoints.

## Request Conventions

- Set `Content-Type: application/json` for all JSON requests.
- Set `Accept: application/json` to ensure JSON error responses from the server.
- For PATCH requests, only include the fields you intend to update.
- Include `Authorization: Bearer <token>` on every protected endpoint.

---

_Documentation generated from `data.json` — Trimify Admin API v1.0.0_
