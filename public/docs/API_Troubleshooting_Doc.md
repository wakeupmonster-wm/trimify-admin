# Trimify Admin — API Troubleshooting & Corrections

> **Version:** 1.0.0 | **Format:** JSON
> This document tracks API endpoints that were reported as not working properly, providing corrected payloads and troubleshooting steps based on the core `APIs.md` and `APIs2.md` documentation.

---

## Table of Contents

1. [SubAdmin Management](#1-subadmin-management)
   - [POST /admin/add-subadmin](#post-adminadd-subadmin)
   - [GET /admin/view-subadmin](#get-adminview-subadmin)

---

# 1. SubAdmin Management

### POST /admin/add-subadmin

#### Description
Creates a new sub-administrator account. There was an issue identified where the string name of the role was being passed instead of the expected integer ID.

#### Endpoint
```http
POST /admin/add-subadmin
```

#### Authentication
Required — Bearer Token

#### Corrected Request Payload

The `role` field must be an integer ID (e.g., `2` for "Sub-Admin User") rather than a string representation.

```json
{
    "name": "New SubAdmin",
    "email": "subadmin@trimify.com.au",
    "hospital": "Dental clinic",
    "location": "Australia",
    "phone": "1234567890",
    "designation": "Dental",
    "password": "123456789",
    "role": 2  
}
```

#### Field Notes (Troubleshooting)
| Field  | Issue Identified | Resolution |
| ------------- | ------------- | ------------- |
| `role` | String passed (`"Sub-Admin User"`) | Change to Integer ID (e.g. `2`). APIs typically expect the Foreign Key ID. |
| `email` | Validation failure (422) | Ensure `subadmin@trimify.com.au` does not already exist in the database. |

#### Expected Success Response
```json
{
  "status": "success",
  "message": "Sub-Admin added successfully",
  "subAdmin": {
    "id": 2,
    "name": "New SubAdmin",
    "email": "subadmin@trimify.com.au",
    "hospital": "Dental clinic",
    "location": "Australia",
    "phone": "1234567890",
    "designation": "Dental",
    "role": 2,
    "status": "Active",
    "created_at": "2026-07-15T11:00:00.000000Z",
    "updated_at": "2026-07-15T11:00:00.000000Z"
  }
}
```

---

### GET /admin/view-subadmin

#### Description
Retrieves a list of all sub-administrators. The frontend attempts to use pagination and search parameters (`page`, `limit`, and `search`), but the backend does not currently support these filters dynamically or is ignoring them.

#### Endpoint
```http
GET /admin/view-subadmin
```

#### Authentication
Required — Bearer Token

#### Query Parameters Sent by Frontend
| Parameter | Description | Expected Behavior |
| --------- | ----------- | ----------------- |
| `page`    | Current page number (e.g., `1`) | API should return the specific page of data. |
| `limit`   | Number of items per page (e.g., `10`) | API should respect this limit instead of defaulting to 50. |
| `search`  | Search string (e.g., `test`) | API should filter the results based on this keyword. |

#### Field Notes (Troubleshooting)
| Issue Identified | Resolution / Recommended Action |
| ---------------- | ------------------------------- |
| **Missing Parameter Support** | According to `APIs.md`, this endpoint has a hardcoded default of **50 items per page** and does not explicitly list query parameters for filtering/limiting. |
| **Action for Backend Dev** | The backend must be updated to accept `page`, `limit`, and `search` query parameters, apply them to the database query builder, and reflect the `current_page`, `last_page`, and `total` dynamically in the `pagination` object in the response. |

#### Expected Corrected API Request
```http
GET https://testadmin.trimify.com.au/api/admin/view-subadmin?page=1&limit=10&search=test
Authorization: Bearer YOUR_TOKEN_HERE
```

