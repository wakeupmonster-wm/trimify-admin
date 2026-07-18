# Trimify Admin — API Troubleshooting & Corrections

> **Version:** 1.0.0 | **Format:** JSON
> This document tracks API endpoints that were reported as not working properly, providing corrected payloads and troubleshooting steps based on the core `APIs.md` and `APIs2.md` documentation.

---

## Table of Contents

1. [SubAdmin Management](#1-subadmin-management)
   - [POST /admin/add-subadmin](#post-adminadd-subadmin)
   - [GET /admin/view-subadmin](#get-adminview-subadmin)
   - [POST /admin/update-subadmin/{id}](#post-adminupdate-subadminid)
2. [User Management](#2-user-management)
   - [GET /admin/users](#get-adminusers)
3. [Program Management](#3-program-management)
   - [GET /admin/view-programs](#get-adminview-programs)
4. [Food Management](#4-food-management)
   - [POST /admin/add-food](#post-adminadd-food)
   - [POST /admin/update-food/{id}](#post-adminupdate-foodid)
   - [GET /admin/get-foodcategories](#get-adminget-foodcategories)

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

| Field   | Issue Identified                   | Resolution                                                                 |
| ------- | ---------------------------------- | -------------------------------------------------------------------------- |
| `role`  | String passed (`"Sub-Admin User"`) | Change to Integer ID (e.g. `2`). APIs typically expect the Foreign Key ID. |
| `email` | Validation failure (422)           | Ensure `subadmin@trimify.com.au` does not already exist in the database.   |

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

| Parameter | Description                           | Expected Behavior                                          |
| --------- | ------------------------------------- | ---------------------------------------------------------- |
| `page`    | Current page number (e.g., `1`)       | API should return the specific page of data.               |
| `limit`   | Number of items per page (e.g., `10`) | API should respect this limit instead of defaulting to 50. |
| `search`  | Search string (e.g., `test`)          | API should filter the results based on this keyword.       |
| `role`    | Role ID (e.g., `0` or `1`)            | API should filter the results to only include this role.   |

#### Field Notes (Troubleshooting)

| Issue Identified                        | Resolution / Recommended Action                                                                                                                                                                                                                                                                           |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Missing Parameter Support (Filters)** | The backend must be updated to dynamically filter the database results when the `search` (keyword) or `role` (0 or 1) query parameters are provided. Currently, they appear to be ignored.                                                                                                                |
| **Pagination Structure Errors**         | The backend returns hardcoded pagination keys (e.g. `"current_page"`) and incorrect math. It must dynamically return keys like `"page"`, `"last_page"`, `"totalPage"`, and `"total"` matching the frontend's expected format, and correctly calculate total pages based on the `limit`.                   |
| **Role Value Mapping (`role`)**         | The backend returns raw integers (`0` or `1`) for the `role` field. It should map these values before returning them (e.g., return `"Sub-Admin User"` for `0` and `"WhiteListing User"` for `1`), or provide an additional `role_name` field, so the frontend does not have to hardcode role definitions. |

#### Expected Corrected API Request

```http
GET https://testadmin.trimify.com.au/api/admin/view-subadmin?page=1&limit=10&search=test&role=0
Authorization: Bearer YOUR_TOKEN_HERE
```

#### Erroneous API Response Example

```json
{
  "status": "success",
  "subAdmins": [
    {
      "id": 15,
      "name": "New SubAdminddv",
      "email": "info@desaconsulting.com.au",
      "hospital": "Dental clinicsdc",
      "location": "Australia",
      "phone": "1234567890",
      "designation": "Dentalc",
      "password": "$2y$10$di4Ikf9KyxUg1INtHLyHauRmJSKIj2yo8JJDayc8O/W/XRlCwIZ4S",
      "profile_image": null,
      "otp": null,
      "status": "Active",
      "created_at": "2026-07-16T06:57:49.000000Z",
      "updated_at": "2026-07-16T07:05:08.000000Z",
      "role": 0,
      "profile": null
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 1,
    "total": 10
  }
}
```

#### Expected Corrected API Response Example

```json
{
  "status": "success",
  "subAdmins": [
    {
      "id": 15,
      "name": "New SubAdminddv",
      "email": "info@desaconsulting.com.au",
      "hospital": "Dental clinicsdc",
      "location": "Australia",
      "phone": "1234567890",
      "designation": "Dentalc",
      "password": "$2y$10$di4Ikf9KyxUg1INtHLyHauRmJSKIj2yo8JJDayc8O/W/XRlCwIZ4S",
      "profile_image": null,
      "otp": null,
      "status": "Active",
      "created_at": "2026-07-16T06:57:49.000000Z",
      "updated_at": "2026-07-16T07:05:08.000000Z",
      "role": "Sub-Admin User",
      "profile": null
    }
  ],
  "pagination": {
    "page": 1,
    "last_page": 10,
    "totalPage": 2,
    "total": 20
  }
}
```

---

### POST /admin/update-subadmin/{id}

#### Description

Updates an existing sub-administrator account. An issue was identified where passing an empty string for the `role` field results in a `500 Internal Server Error`, likely due to a database type casting failure or a NOT NULL constraint violation.

#### Endpoint

```http
POST /admin/update-subadmin/{id}
```

#### Authentication

Required — Bearer Token

#### Erroneous Request Payload

```json
{
  "name": "New SubAdminddv",
  "email": "info@desaconsulting.com.au",
  "hospital": "Dental clinicsdc",
  "location": "Australia",
  "phone": "1234567890",
  "designation": "Dentalc",
  "role": "Sub-Admin User"
}
```

#### Field Notes (Troubleshooting)

| Field  | Issue Identified                                               | Resolution / Recommended Action                                                                                                                                                                                                                                                      |
| ------ | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `role` | Empty string `""` passed, causing `500 Internal Server Error`. | The frontend must ensure `role` is passed as a valid integer (e.g., `0` or `1`). The backend should implement proper validation to return a `422 Unprocessable Entity` with a clear message instead of crashing with a `500` error when invalid types or empty strings are provided. |

#### Expected Corrected Payload

```json
{
  "name": "New SubAdminddv",
  "email": "info@desaconsulting.com.au",
  "hospital": "Dental clinicsdc",
  "location": "Australia",
  "phone": "1234567890",
  "designation": "Dentalc",
  "role": "Sub-Admin User"
}
```

---

# 2. User Management

### GET /admin/users

#### Description

Retrieves a list of all application users. The frontend passes pagination, search, and status parameters, but the backend returns an incorrectly structured pagination object.

#### Endpoint

```http
GET /admin/users
```

#### Authentication

Required — Bearer Token

#### Erroneous API Response Example (Pagination)

```json
{
  "pagination": {
    "current_page": 1,
    "last_page": 74,
    "total": 740
  }
}
```

#### Field Notes (Troubleshooting)

| Issue Identified                | Resolution / Recommended Action                                                                                                                                                                                                                                                                      |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pagination Structure Errors** | The backend returns incorrect pagination keys (e.g., `"current_page"`) and is missing required fields. It must dynamically return keys like `"page"`, `"last_page"`, `"totalPage"`, and `"total"` matching the frontend's expected format, and correctly calculate total pages based on the `limit`. |

#### Expected Corrected API Response Example (Pagination)

```json
{
  "pagination": {
    "page": 1,
    "last_page": 10,
    "totalPage": 2,
    "total": 20
  }
}
```

---

# 3. Program Management

### GET /admin/view-programs

#### Description

Retrieves a list of all health and wellness programs. The frontend passes pagination, search, and duration parameters, but the backend returns an incorrectly structured pagination object.

#### Endpoint

```http
GET /admin/view-programs
```

#### Authentication

Required — Bearer Token

#### Erroneous API Response Example (Pagination)

```json
{
  "pagination": {
    "current_page": 1,
    "last_page": 74,
    "total": 740
  }
}
```

#### Field Notes (Troubleshooting)

| Issue Identified                | Resolution / Recommended Action                                                                                                                                                                                                                                                                      |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pagination Structure Errors** | The backend returns incorrect pagination keys (e.g., `"current_page"`) and is missing required fields. It must dynamically return keys like `"page"`, `"last_page"`, `"totalPage"`, and `"total"` matching the frontend's expected format, and correctly calculate total pages based on the `limit`. |

#### Expected Corrected API Response Example (Pagination)

```json
{
  "pagination": {
    "page": 1,
    "last_page": 10,
    "totalPage": 2,
    "total": 20
  }
}
```

---

# 4. Food Management

### POST /admin/add-food

#### Description

Adds a new food item to a specific program and category. A 500 Internal Server Error occurs when sending a seemingly valid payload. This indicates the backend fails to process the payload properly, potentially due to database constraints, unhandled exceptions, or issues with foreign keys (`program_id`, `category`).

#### Endpoint

```http
POST /admin/add-food
```

#### Authentication

Required — Bearer Token

#### Erroneous Request Payload (Triggering 500 Error)

```json
{
  "program_id": "99",
  "category": "89",
  "foodName": "New Soup",
  "approvalStatus": "Approved",
  "quantity": "10",
  "unit": "g"
}
```

#### Field Notes (Troubleshooting)

| Issue Identified              | Resolution / Recommended Action                                                                                                                                                                                                                                                                                                                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **500 Internal Server Error** | The server crashes instead of returning a validation or contextual error. Check backend logs for SQL exceptions, missing table relationships, or missing field expectations. Ensure the `program_id` and `category` IDs exist and are passed in the correct format (string vs. integer). If other fields are expected but undocumented, the backend should return a 422 Unprocessable Entity instead of 500. |

---

### POST /admin/update-food/{id}

#### Description

Updates an existing food item. Similar to `add-food`, a 500 Internal Server Error occurs when sending a seemingly valid payload. This indicates a backend crash, potentially related to how it processes the payload or missing route parameter handling.

#### Endpoint

```http
POST /admin/update-food/{id}
```

#### Authentication

Required — Bearer Token

#### Erroneous Request Payload (Triggering 500 Error)

```json
{
  "foodName": "Stock, dry powder or cubeeee",
  "approvalStatus": "Approved",
  "category": "92",
  "quantity": "10",
  "unit": "mg"
}
```

#### Field Notes (Troubleshooting)

| Issue Identified              | Resolution / Recommended Action                                                                                                                                                                                                                                                                                                                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **500 Internal Server Error** | The backend crashes upon receiving the payload. Verify that the `{id}` parameter is correctly mapped in the route. Ensure that the required database fields are being properly validated (returning a 422 instead of crashing). Check server logs for SQL constraints (e.g., trying to set a foreign key `category` if it expects `foodcategory_id` at the database level). |

---

### GET /admin/get-foodcategories

#### Description

Retrieves a list of food categories. The frontend passes pagination and search parameters (`page`, `limit`, and `search`), but the backend returns an incorrectly structured pagination object.

#### Endpoint

```http
GET /admin/get-foodcategories
```

#### Authentication

Required — Bearer Token

#### Erroneous API Response Example (Pagination)

```json
{
  "pagination": {
    "current_page": 1,
    "last_page": 74,
    "total": 740
  }
}
```

#### Field Notes (Troubleshooting)

| Issue Identified | Resolution / Recommended Action |
| ---------------- | ------------------------------- |
| **Pagination Structure Errors** | The backend returns incorrect pagination keys (e.g., `"current_page"`) and is missing required fields. It must dynamically return keys like `"page"`, `"last_page"`, `"totalPage"`, and `"total"` matching the frontend's expected format, and correctly calculate total pages based on the `limit`. |

#### Expected Corrected API Response Example (Pagination)

```json
{
  "pagination": {
    "page": 1,
    "last_page": 10,
    "totalPage": 2,
    "total": 20
  }
}
```

---

### POST /admin/add-foodcategory & /admin/update-foodcategory/{id}

#### Description

When creating or updating a food category, the frontend passes a `description` field along with the `name` and `image` in the `multipart/form-data` payload. However, the backend silently ignores the `description` field and fails to save it to the database.

#### Endpoints

```http
POST /admin/add-foodcategory
POST /admin/update-foodcategory/{id}
```

#### Issue Identified

The API successfully processes the request and returns a `200 OK` with a success message, but the `description` field is not processed or persisted.

#### Recommended Action for Backend Dev

1. **Database Update:** Ensure the database table for food categories includes a `description` text column.
2. **Validation Rules:** Update the backend validation rules for both endpoints to accept the `description` field (e.g., `nullable|string`).
3. **Controller Logic:** Update the controller logic for the `add` and `update` functions to extract the `description` field from the incoming request payload and persist it to the model.

#### Request Payload Sent by Frontend

```json
{
  "name": "New food",
  "description": "wvme;lve",
  "image": "(binary file data)"
}
```

---

# 5. Diet Meal Management

### POST /admin/add-dietmeal

#### Description

Adds a new diet meal to a program. The API throws a `500 Internal Server Error` when provided a perfectly valid payload according to the validation schema.

#### Endpoint

```http
POST /admin/add-dietmeal
```

#### Issue Identified

The endpoint previously requested `food` as an integer rather than an array of IDs. After correcting the payload to match the validation schema, the server responds with a `500 Internal Server Error`. This indicates a backend crash or unhandled exception during the insertion process.

#### Request Payload Sent by Frontend

```json
{
    "program_id": "99",
    "week": "1",
    "day": "Sunday",
    "food": 2075,
    "meal": "Lunch"
}
```

#### Field Notes (Troubleshooting)

| Field        | Issue Identified | Resolution |
| ------------ | ---------------- | ---------- |
| `food`       | Must be an integer (e.g. `2075`), not an array. | Frontend updated to pass integer, but now triggering a 500 error on the backend. |
| `program_id` | Passed as string (`"99"`) | The backend may be failing to cast this string to an integer, or it could be a foreign key constraint violation. |
| `week`       | Passed as string (`"1"`) | The backend may be failing to cast this string to an integer. |

---

### GET /admin/get-dietmeal/{id}

#### Description

Retrieves the list of diet meals for a specific program. The frontend is passing `page`, `limit`, and `search` query parameters, but the backend does not seem to process them or return the standard pagination metadata object.

#### Endpoint

```http
GET /admin/get-dietmeal/99?page=1&limit=10&search=vegeta
```

#### Issue Identified

The API receives the query parameters but appears to ignore them. Furthermore, the response is missing the `pagination` object entirely (e.g., `current_page`, `last_page`, `total`, etc.), which breaks the frontend data table pagination logic.

#### Recommended Action for Backend Dev

1. **Query Parameters:** Ensure the controller handles `$request->query('page')`, `$request->query('limit')`, and `$request->query('search')`.
2. **Pagination Response:** Return the results using standard Laravel pagination so that the `pagination` metadata object is included in the JSON response alongside the data array.

---

# 6. Fitzone Management

### GET /admin/view-fitzone

#### Description

Retrieves the list of fitzones. The frontend passes `page`, `limit`, and `search` query parameters. While the API responds successfully, the pagination metadata structure differs from the standard format expected by the frontend.

#### Endpoint

```http
GET /admin/view-fitzone?page=1&limit=10&search=
```

#### Issue Identified

The API response includes the pagination fields (`current_page`, `last_page`, `total`) directly at the root of the JSON response (or mixed with the data), rather than nesting them inside a designated `pagination` object like other endpoints (e.g., `{"pagination": {"current_page": 1, ...}}`). This breaks the frontend's unified parsing logic.

#### Example Response from Backend

```json
{
    "current_page": 1,
    "last_page": 1,
    "total": 2
}
```

#### Recommended Action for Backend Dev

Ensure the pagination metadata is wrapped in a `pagination` object to maintain consistency across all admin endpoints.

```json
{
    "status": "success",
    "fitzones": [...],
    "pagination": {
        "current_page": 1,
        "last_page": 1,
        "total": 2
    }
}
```
| Issue Identified | Resolution / Recommended Action |
| ---------------- | ------------------------------- |
| **Pagination Structure Errors** | The backend returns incorrect pagination keys (e.g., `"current_page"`) and is missing required fields. It must dynamically return keys like `"page"`, `"last_page"`, `"totalPage"`, and `"total"` matching the frontend's expected format, and correctly calculate total pages based on the `limit`. |

#### Expected Corrected API Response Example (Pagination)

```json
{
  "pagination": {
    "page": 1,
    "last_page": 10,
    "totalPage": 2,
    "total": 20
  }
}
```

---

### GET /admin/fitzone-workoutcat/{id}

#### Description

Retrieves the list of workout session categories for a specific fitzone.

#### Endpoint

```http
GET /admin/fitzone-workoutcat/36?page=1&limit=10&search=
```

#### Issue Identified

The backend is not returning a proper `pagination` object in the response. As a result, the frontend data table pagination logic fails.

| Issue Identified | Resolution / Recommended Action |
| ---------------- | ------------------------------- |
| **Pagination Structure Errors** | The backend returns incorrect pagination keys (e.g., `"current_page"`) and is missing required fields. It must dynamically return keys like `"page"`, `"last_page"`, `"totalPage"`, and `"total"` matching the frontend's expected format, and correctly calculate total pages based on the `limit`. |

#### Expected Corrected API Response Example (Pagination)

```json
{
  "pagination": {
    "page": 1,
    "last_page": 10,
    "totalPage": 2,
    "total": 20
  }
}
```

---

### POST /admin/add-workoutcat

#### Description

Creates a new workout session category for a fitzone.

#### Endpoint

```http
POST /admin/add-workoutcat
```

#### Issue Identified

The endpoint is returning a `500 Internal Server Error`.

#### Request Payload Sent by Frontend (Form Data)

- `fitzone_id`: `36`
- `title`: `New session`
- `description`: `20min`
- `html_content`: `test test description test test description test test description test test description`
- `icon`: `(binary file upload)`

#### Recommended Action for Backend Dev

Investigate the server logs for the crash. Possible reasons could be:
- Missing validation rules for `icon` resulting in an uncaught exception during file upload processing.
- Foreign key constraint failure for `fitzone_id`.
- Incorrect or missing field name mapping between `html_content` and the database column.

---

### GET /admin/fitzone-session/{id}

#### Description

Retrieves the list of workout sessions for a specific fitzone. The frontend needs to pass `page`, `limit`, and `search` query parameters, but the backend does not seem to process them or return the standard pagination object.

#### Endpoint

```http
GET /admin/fitzone-session/36?page=1&limit=10&search=
```

#### Issue Identified

1. The API endpoint does not process or define the `page`, `limit`, and `search` query parameters.
2. The response is missing the correct `pagination` metadata structure, breaking the frontend data table pagination logic.

#### Expected Corrected API Response Example (Pagination)

Ensure the pagination metadata is wrapped in a `pagination` object exactly like this:

```json
{
  "pagination": {
    "page": 1,
    "last_page": 10,
    "totalPage": 2,
    "total": 20
  }
}
```

#### Recommended Action for Backend Dev

Ensure the controller correctly parses `$request->query('page')`, `$request->query('limit')`, and `$request->query('search')` to return paginated and filtered results. Construct and return the `pagination` object precisely as formatted above.

---

### POST /admin/add-fitzonesession & POST /admin/update-fitzonesession/{id}

#### Description

Creates or updates a workout session within a fitzone category.

#### Endpoints

```http
POST /admin/add-fitzonesession
POST /admin/update-fitzonesession/42
```

#### Issue Identified

Both endpoints are crashing and returning a `500 Internal Server Error`.

#### Request Payload Sent by Frontend (Form Data)

```json
{
  "fitzone_id": 36,
  "title": "Lumbar Rotation",
  "description": "5 sets",
  "workoutcat_id": 52,
  "duration": 5,
  "step_description": "[\"Lie on your back on a mat with your knees bent, feet flat on the floor, and arms extended out to your sides.\",\"Keeping your upper body grounded, rotate your knees to one side, aiming to bring them close to the floor. Return to the starting position, then repeat the movement on the opposite side to complete the exercise.\",\"Ensure your legs remain together throughout the movement.\"]"
}
```
*(Plus an optional binary `video` file if uploaded)*

#### Recommended Action for Backend Dev

- Investigate the server logs to determine why the 500 error is triggered.
- Ensure the backend properly parses and stores the `step_description` array (which is currently sent as a JSON stringified array).
- Check if foreign key constraints (`fitzone_id`, `workoutcat_id`) are matching the database tables accurately.
- Verify file upload validation and storage logic for the optional binary `video` file attached to the payload.

---

# 7. Blog Management

### POST /admin/update-blogcategory/{id}

#### Description

Updates an existing blog category. The API documentation indicates that the `icon` field is optional during an update, but the API throws a validation error demanding the `icon` field.

#### Endpoint

```http
POST /admin/update-blogcategory/{id}
```

#### Issue Identified

The endpoint is strictly requiring the `icon` field and returning a 422 Unprocessable Entity with a validation error when it is omitted. This breaks standard update flows where a user only wants to update text fields without re-uploading the image.

#### Erroneous API Response Example

```json
{
    "errors": {
        "icon": [
            "The icon field is required."
        ]
    }
}
```

#### Recommended Action for Backend Dev

Update the validation rules for the `update-blogcategory` endpoint to make the `icon` field `nullable` or `sometimes|required|image` instead of strictly `required`.
