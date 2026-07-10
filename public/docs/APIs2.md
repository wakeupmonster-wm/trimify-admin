# Trimify Admin — API Documentation (Part 2)

> **Version:** 1.0.0 &nbsp;|&nbsp; **Last Updated:** 2026-07-09 &nbsp;|&nbsp; **Source:** `data2.json`

> This document is a continuation of `APIs.md`. It covers extended and supplementary API groups including Blog, Program, Food, Diet Plan, Fitzone, Dashboard, and Diet Meal Management.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Common Error Responses](#common-error-responses)
3. [HTTP Status Codes Reference](#http-status-codes-reference)
4. [API Groups](#api-groups)
   - [Blog Management (Additional)](#1-blog-management-additional)
   - [Program Management (Additional)](#2-program-management-additional)
   - [Program Introduction](#3-program-introduction)
   - [Food & Categories Management](#4-food--categories-management)
   - [Diet Plan Management](#5-diet-plan-management)
   - [Fitzone Management (Additional)](#6-fitzone-management-additional)
   - [Fitzone Workouts & Sessions](#7-fitzone-workouts--sessions)
   - [Dashboard (Additional)](#8-dashboard-additional)
   - [Diet Meal Management](#9-diet-meal-management)
5. [API Best Practices](#api-best-practices)

---

## Introduction

This document describes the **supplementary Trimify Admin REST API** endpoints — extending the core documentation in `APIs.md` with additional features for blog management, program workflows, food & diet management, fitzone sessions, and dashboard statistics.

**Audience:**

- Frontend developers building admin panel features
- Backend developers maintaining and extending the API
- QA engineers creating test coverage for extended features
- Technical leads and maintainers

### Base URL

```
https://apibackend.trimify.com.au/api
```

> All endpoints are prefixed with `/admin`. Full URL: `BASE_URL + /admin + endpoint`

### Request Format

- JSON payloads: `Content-Type: application/json`
- File uploads: `Content-Type: multipart/form-data`

### Response Format

```json
{
  "status": "success",
  "message": "Operation completed."
}
```

### Pagination

Paginated list responses include:

```json
{
  "pagination": {
    "current_page": 1,
    "last_page": 5,
    "total": 250
  }
}
```

---

## Common Error Responses

### Validation Error (422)

```json
{
  "status": "error",
  "message": "The given data was invalid.",
  "errors": {
    "field": ["Validation message."]
  }
}
```

### Not Found (404)

```json
{
  "status": "error",
  "message": "Resource not found."
}
```

### Unauthorized (401)

```json
{
  "status": "error",
  "message": "Unauthenticated."
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

| Code  | Status                | Meaning                   |
| ----- | --------------------- | ------------------------- |
| `200` | OK                    | Request succeeded         |
| `400` | Bad Request           | Invalid request data      |
| `401` | Unauthorized          | Missing or invalid token  |
| `404` | Not Found             | Resource does not exist   |
| `422` | Unprocessable Entity  | Validation failed         |
| `500` | Internal Server Error | Unexpected server failure |

---

## API Groups

---

# 1. Blog Management (Additional)

Supplementary blog management endpoints covering dropdowns, category editing, and blog/visibility status toggling.

---

### GET /admin/get-blogcategoriesdrop

#### Description

Returns a lightweight list of all blog categories for use in dropdown menus and select inputs in the admin UI. Unlike the paginated category list, this endpoint returns all categories without pagination.

#### Endpoint

```http
GET /admin/get-blogcategoriesdrop
```

#### Authentication

Required — Bearer Token

#### Request Body

No request body required.

#### Success Response

```json
{
  "status": "success",
  "categories": [
    {
      "id": 1,
      "title": "Health Tips"
    }
  ]
}
```

#### Response Fields

| Field                | Type    | Description              |
| -------------------- | ------- | ------------------------ |
| `status`             | string  | `"success"`              |
| `categories`         | array   | List of category objects |
| `categories[].id`    | integer | Category ID              |
| `categories[].title` | string  | Category title           |

#### HTTP Status Codes

| Code  | Meaning             |
| ----- | ------------------- |
| `200` | Categories returned |

#### Edge Cases

- Used for dropdowns. Returns all active categories without pagination.

---

### GET /admin/edit-blog-category/{id}

#### Description

Fetches the full details of a single blog category by its ID. Intended for pre-populating edit forms in the admin panel.

#### Endpoint

```http
GET /admin/edit-blog-category/{id}
```

#### URL Parameters

| Parameter | Type    | Description      |
| --------- | ------- | ---------------- |
| `id`      | integer | Blog category ID |

#### Authentication

Required — Bearer Token

#### Request Body

No request body required.

#### Success Response

```json
{
  "status": "success",
  "category": {
    "id": 1,
    "title": "Health Tips",
    "description": "...",
    "icon": "..."
  }
}
```

#### Response Fields

| Field                  | Type    | Description                      |
| ---------------------- | ------- | -------------------------------- |
| `status`               | string  | `"success"`                      |
| `category.id`          | integer | Category ID                      |
| `category.title`       | string  | Category title                   |
| `category.description` | string  | Category description             |
| `category.icon`        | string  | Path or URL to the category icon |

#### HTTP Status Codes

| Code  | Meaning                |
| ----- | ---------------------- |
| `200` | Category data returned |
| `404` | Category not found     |

#### Edge Cases

- Returns `404` if no category exists with the given `id`.

---

### PATCH /admin/toggle-status-blog/{id}

#### Description

Toggles the active or inactive status of a specific blog post. Use this to publish or unpublish blog entries without permanently deleting them.

#### Endpoint

```http
PATCH /admin/toggle-status-blog/{id}
```

#### URL Parameters

| Parameter | Type    | Description  |
| --------- | ------- | ------------ |
| `id`      | integer | Blog post ID |

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
  "message": "Status Updated!",
  "updated_status": "Active"
}
```

#### Response Fields

| Field            | Type   | Description          |
| ---------------- | ------ | -------------------- |
| `status`         | string | `"success"`          |
| `message`        | string | Confirmation message |
| `updated_status` | string | The new status value |

#### HTTP Status Codes

| Code  | Meaning             |
| ----- | ------------------- |
| `200` | Status toggled      |
| `404` | Blog post not found |

#### Edge Cases

- Toggles blog active/inactive.
- Returns `404` if the blog ID does not exist.

---

### PATCH /admin/toggle-publish-private/{id}

#### Description

Toggles the visibility of a blog post between `"Public"` and `"Private"`. Public posts are visible to app users; private posts are hidden.

#### Endpoint

```http
PATCH /admin/toggle-publish-private/{id}
```

#### URL Parameters

| Parameter | Type    | Description  |
| --------- | ------- | ------------ |
| `id`      | integer | Blog post ID |

#### Authentication

Required — Bearer Token

#### Request Body

| Field               | Type   | Required | Validation                | Description              |
| ------------------- | ------ | -------- | ------------------------- | ------------------------ |
| `visibility_status` | string | Yes      | `"Public"` or `"Private"` | The new visibility value |

#### Example Request

```json
{
  "visibility_status": "Private"
}
```

#### Success Response

```json
{
  "status": "success",
  "message": "Visibility Updated!"
}
```

#### HTTP Status Codes

| Code  | Meaning             |
| ----- | ------------------- |
| `200` | Visibility updated  |
| `404` | Blog post not found |

#### Edge Cases

- Toggles between `"Public"` and `"Private"` visibility states.

---

# 2. Program Management (Additional)

Supplementary program management endpoints for fetching a single program for editing, viewing assigned users, and reading food visibility state.

---

### GET /admin/edit-program/{id}

#### Description

Retrieves the full details of a specific health program by its ID. Intended for pre-populating edit forms in the admin panel.

#### Endpoint

```http
GET /admin/edit-program/{id}
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
  "program": {
    "id": 1,
    "title": "Weight Loss",
    "duration": "30 days"
  }
}
```

#### Response Fields

| Field              | Type    | Description      |
| ------------------ | ------- | ---------------- |
| `status`           | string  | `"success"`      |
| `program.id`       | integer | Program ID       |
| `program.title`    | string  | Program title    |
| `program.duration` | string  | Program duration |

#### HTTP Status Codes

| Code  | Meaning               |
| ----- | --------------------- |
| `200` | Program data returned |
| `404` | Program not found     |

#### Edge Cases

- Fetches a specific program for editing.
- Returns `404` if the program ID does not exist.

---

### GET /admin/view-programassigneduser/{id}

#### Description

Returns a list of all users who have been assigned to a specific health program, identified by the program's ID.

#### Endpoint

```http
GET /admin/view-programassigneduser/{id}
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
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}
```

#### Response Fields

| Field           | Type    | Description                   |
| --------------- | ------- | ----------------------------- |
| `status`        | string  | `"success"`                   |
| `users`         | array   | List of assigned user objects |
| `users[].id`    | integer | User ID                       |
| `users[].name`  | string  | User's full name              |
| `users[].email` | string  | User's email address          |

#### HTTP Status Codes

| Code  | Meaning                 |
| ----- | ----------------------- |
| `200` | Assigned users returned |

#### Edge Cases

- Returns users assigned to a specific program.
- Returns an empty `users` array if no users are assigned.

---

### GET /admin/program-food-visibility/{id}

#### Description

Retrieves the current food visibility state (`is_approve_nonapproved_foods_show`) for a specific program. Indicates whether unapproved foods are currently visible to users of this program.

#### Endpoint

```http
GET /admin/program-food-visibility/{id}
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
  "is_visible": 1
}
```

#### Response Fields

| Field        | Type    | Description                                  |
| ------------ | ------- | -------------------------------------------- |
| `status`     | string  | `"success"`                                  |
| `is_visible` | integer | `1` = unapproved foods visible, `0` = hidden |

#### HTTP Status Codes

| Code  | Meaning                   |
| ----- | ------------------------- |
| `200` | Visibility state returned |
| `404` | Program not found         |

#### Edge Cases

- Gets the current food visibility state of the program.
- Returns `404` if no program matches the given `id`.

---

# 3. Program Introduction

Manages introductory content for health programs — each program can have an associated intro block with a title and description.

---

### GET /admin/program-intro/{id}

#### Description

Fetches the intro content associated with a specific program, identified by the program's ID.

#### Endpoint

```http
GET /admin/program-intro/{id}
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
  "intro": {
    "id": 1,
    "program_id": 1,
    "title": "Intro",
    "description": "..."
  }
}
```

#### Response Fields

| Field               | Type    | Description               |
| ------------------- | ------- | ------------------------- |
| `status`            | string  | `"success"`               |
| `intro.id`          | integer | Intro record ID           |
| `intro.program_id`  | integer | Associated program ID     |
| `intro.title`       | string  | Intro title               |
| `intro.description` | string  | Intro description content |

#### HTTP Status Codes

| Code  | Meaning                    |
| ----- | -------------------------- |
| `200` | Intro returned             |
| `404` | Program or intro not found |

---

### POST /admin/program-intro

#### Description

Creates a new intro block and associates it with an existing program.

#### Endpoint

```http
POST /admin/program-intro
```

#### Authentication

Required — Bearer Token

#### Request Body

| Field         | Type    | Required | Validation       | Description                  |
| ------------- | ------- | -------- | ---------------- | ---------------------------- |
| `program_id`  | integer | Yes      | Required integer | ID of the associated program |
| `title`       | string  | Yes      | Required string  | Intro title                  |
| `description` | string  | Yes      | Required string  | Intro description            |

#### Example Request

```json
{
  "program_id": 1,
  "title": "Welcome to the Weight Loss Program",
  "description": "This program is designed to help you lose weight effectively over 30 days."
}
```

#### Success Response

```json
{
  "status": "success",
  "message": "Intro added!"
}
```

#### HTTP Status Codes

| Code  | Meaning          |
| ----- | ---------------- |
| `200` | Intro created    |
| `422` | Validation error |

#### Edge Cases

- All three fields are required — missing any returns `422`.

---

### POST /admin/program-intro/update/{id}

#### Description

Updates the title and description of an existing program intro record.

#### Endpoint

```http
POST /admin/program-intro/update/{id}
```

#### URL Parameters

| Parameter | Type    | Description     |
| --------- | ------- | --------------- |
| `id`      | integer | Intro record ID |

#### Authentication

Required — Bearer Token

#### Request Body

| Field         | Type   | Required | Validation      | Description               |
| ------------- | ------ | -------- | --------------- | ------------------------- |
| `title`       | string | Yes      | Required string | Updated intro title       |
| `description` | string | Yes      | Required string | Updated intro description |

#### Example Request

```json
{
  "title": "Updated Program Introduction",
  "description": "Updated content for the program intro."
}
```

#### Success Response

```json
{
  "status": "success",
  "message": "Intro updated!"
}
```

#### HTTP Status Codes

| Code  | Meaning          |
| ----- | ---------------- |
| `200` | Intro updated    |
| `404` | Intro not found  |
| `422` | Validation error |

#### Edge Cases

- Returns `404` if the intro record does not exist.

---

# 4. Food & Categories Management

Complete CRUD operations for food categories and food items within programs, including approval status toggling.

---

### GET /admin/get-foodcategories

#### Description

Returns a paginated list of all food categories available in the system.

#### Endpoint

```http
GET /admin/get-foodcategories
```

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "categories": [
    {
      "id": 1,
      "title": "Fruits"
    }
  ],
  "pagination": {}
}
```

#### Response Fields

| Field                | Type    | Description                   |
| -------------------- | ------- | ----------------------------- |
| `status`             | string  | `"success"`                   |
| `categories`         | array   | List of food category objects |
| `categories[].id`    | integer | Category ID                   |
| `categories[].title` | string  | Category name                 |
| `pagination`         | object  | Pagination metadata           |

#### HTTP Status Codes

| Code  | Meaning                       |
| ----- | ----------------------------- |
| `200` | Paginated categories returned |

#### Edge Cases

- Returns paginated food categories.

---

### GET /admin/get-foodcategoriesdrop

#### Description

Returns an unpaginated list of all food categories for use in dropdown selectors.

#### Endpoint

```http
GET /admin/get-foodcategoriesdrop
```

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "categories": [
    {
      "id": 1,
      "title": "Fruits"
    }
  ]
}
```

#### HTTP Status Codes

| Code  | Meaning                         |
| ----- | ------------------------------- |
| `200` | Category dropdown list returned |

#### Edge Cases

- Returns a full flat list without pagination. Use for dropdown inputs.

---

### POST /admin/add-foodcategory

#### Description

Creates a new food category.

#### Endpoint

```http
POST /admin/add-foodcategory
```

#### Authentication

Required — Bearer Token

#### Request Body

| Field   | Type   | Required | Validation      | Description        |
| ------- | ------ | -------- | --------------- | ------------------ |
| `title` | string | Yes      | Required string | Food category name |

#### Example Request

```json
{
  "title": "Vegetables"
}
```

#### Success Response

```json
{
  "status": "success",
  "message": "Added!"
}
```

#### HTTP Status Codes

| Code  | Meaning          |
| ----- | ---------------- |
| `200` | Category created |
| `422` | Validation error |

---

### POST /admin/update-foodcategory/{editId}

#### Description

Updates the title of an existing food category.

#### Endpoint

```http
POST /admin/update-foodcategory/{editId}
```

#### URL Parameters

| Parameter | Type    | Description      |
| --------- | ------- | ---------------- |
| `editId`  | integer | Food category ID |

#### Authentication

Required — Bearer Token

#### Request Body

| Field   | Type   | Required | Validation      | Description           |
| ------- | ------ | -------- | --------------- | --------------------- |
| `title` | string | Yes      | Required string | Updated category name |

#### Example Request

```json
{
  "title": "Green Vegetables"
}
```

#### Success Response

```json
{
  "status": "success",
  "message": "Updated!"
}
```

#### HTTP Status Codes

| Code  | Meaning          |
| ----- | ---------------- |
| `200` | Category updated |
| `422` | Validation error |

---

### DELETE /admin/delete-foodcategory/{id}

#### Description

Permanently deletes a food category by its ID.

#### Endpoint

```http
DELETE /admin/delete-foodcategory/{id}
```

#### URL Parameters

| Parameter | Type    | Description      |
| --------- | ------- | ---------------- |
| `id`      | integer | Food category ID |

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "message": "Deleted!"
}
```

#### HTTP Status Codes

| Code  | Meaning            |
| ----- | ------------------ |
| `200` | Category deleted   |
| `404` | Category not found |

---

### POST /admin/add-food

#### Description

Adds a new food item to a specific program and food category, with an approval type designation.

#### Endpoint

```http
POST /admin/add-food
```

#### Authentication

Required — Bearer Token

#### Request Body

| Field         | Type           | Required | Validation                     | Description                 |
| ------------- | -------------- | -------- | ------------------------------ | --------------------------- |
| `program_id`  | string/integer | Yes      | Required                       | Associated program ID       |
| `category_id` | string/integer | Yes      | Required                       | Associated food category ID |
| `title`       | string         | Yes      | Required string                | Name of the food item       |
| `type`        | string         | Yes      | `"Approved"` or `"Unapproved"` | Approval status of the food |

#### Example Request

```json
{
  "program_id": 1,
  "category_id": 1,
  "title": "Apple",
  "type": "Approved"
}
```

#### Success Response

```json
{
  "status": "success",
  "message": "Food Added"
}
```

#### HTTP Status Codes

| Code  | Meaning          |
| ----- | ---------------- |
| `200` | Food item added  |
| `422` | Validation error |

#### Edge Cases

- The `type` field must be either `"Approved"` or `"Unapproved"`.

---

### POST /admin/update-food/{id}

#### Description

Updates the title and type of an existing food item.

#### Endpoint

```http
POST /admin/update-food/{id}
```

#### URL Parameters

| Parameter | Type    | Description  |
| --------- | ------- | ------------ |
| `id`      | integer | Food item ID |

#### Authentication

Required — Bearer Token

#### Request Body

| Field   | Type   | Required | Validation      | Description            |
| ------- | ------ | -------- | --------------- | ---------------------- |
| `title` | string | Yes      | Required string | Updated food item name |
| `type`  | string | Yes      | Required        | Updated approval type  |

#### Example Request

```json
{
  "title": "Green Apple",
  "type": "Approved"
}
```

#### Success Response

```json
{
  "status": "success",
  "message": "Food Updated"
}
```

#### HTTP Status Codes

| Code  | Meaning          |
| ----- | ---------------- |
| `200` | Food updated     |
| `422` | Validation error |

---

### GET /admin/get-food/{program_id}/{foodCategoryId}

#### Description

Retrieves all food items belonging to a specific program and food category combination.

#### Endpoint

```http
GET /admin/get-food/{program_id}/{foodCategoryId}
```

#### URL Parameters

| Parameter        | Type    | Description      |
| ---------------- | ------- | ---------------- |
| `program_id`     | integer | Program ID       |
| `foodCategoryId` | integer | Food category ID |

#### Authentication

Required — Bearer Token

#### Request Body

No request body required.

#### Success Response

```json
{
  "status": "success",
  "foods": [
    {
      "id": 1,
      "title": "Apple",
      "type": "Approved"
    }
  ]
}
```

#### Response Fields

| Field           | Type    | Description                    |
| --------------- | ------- | ------------------------------ |
| `status`        | string  | `"success"`                    |
| `foods`         | array   | List of food item objects      |
| `foods[].id`    | integer | Food item ID                   |
| `foods[].title` | string  | Food item name                 |
| `foods[].type`  | string  | `"Approved"` or `"Unapproved"` |

#### HTTP Status Codes

| Code  | Meaning            |
| ----- | ------------------ |
| `200` | Food list returned |

#### Edge Cases

- Returns foods filtered by both `program_id` and `foodCategoryId`.

---

### PATCH /admin/toggle-status-approveunapprove/{id}

#### Description

Toggles the approval status of a food item between `"Approved"` and `"Unapproved"`.

#### Endpoint

```http
PATCH /admin/toggle-status-approveunapprove/{id}
```

#### URL Parameters

| Parameter | Type    | Description  |
| --------- | ------- | ------------ |
| `id`      | integer | Food item ID |

#### Authentication

Required — Bearer Token

#### Request Body

| Field    | Type   | Required | Validation | Description               |
| -------- | ------ | -------- | ---------- | ------------------------- |
| `status` | string | Yes      | Required   | New approval status value |

#### Example Request

```json
{
  "status": "Approved"
}
```

#### Success Response

```json
{
  "status": "success",
  "message": "Status updated"
}
```

#### HTTP Status Codes

| Code  | Meaning        |
| ----- | -------------- |
| `200` | Status toggled |

---

### DELETE /admin/delete-food/{id}

#### Description

Permanently deletes a food item by its ID.

#### Endpoint

```http
DELETE /admin/delete-food/{id}
```

#### URL Parameters

| Parameter | Type    | Description  |
| --------- | ------- | ------------ |
| `id`      | integer | Food item ID |

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "message": "Deleted"
}
```

#### HTTP Status Codes

| Code  | Meaning           |
| ----- | ----------------- |
| `200` | Food item deleted |

---

# 5. Diet Plan Management

Manages the day-by-day meal assignment for health programs, including diet meal CRUD, duration lookup, and food search.

---

### GET /admin/get-dietmeal/{id}

#### Description

Retrieves all diet meal entries associated with a specific program, identified by the program's ID.

#### Endpoint

```http
GET /admin/get-dietmeal/{id}
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
  "diet_meals": [
    {
      "id": 1,
      "day": 1,
      "meal_id": 1
    }
  ]
}
```

#### Response Fields

| Field                  | Type    | Description                    |
| ---------------------- | ------- | ------------------------------ |
| `status`               | string  | `"success"`                    |
| `diet_meals`           | array   | List of diet meal records      |
| `diet_meals[].id`      | integer | Diet meal record ID            |
| `diet_meals[].day`     | integer | Program day number             |
| `diet_meals[].meal_id` | integer | Associated meal (nutrition) ID |

#### HTTP Status Codes

| Code  | Meaning                    |
| ----- | -------------------------- |
| `200` | Diet meal records returned |

#### Edge Cases

- Gets diet meals for a specific program ID.

---

### POST /admin/add-dietmeal

#### Description

Assigns multiple meals to a specific day within a program's diet plan.

#### Endpoint

```http
POST /admin/add-dietmeal
```

#### Authentication

Required — Bearer Token

#### Request Body

| Field        | Type           | Required | Validation | Description                             |
| ------------ | -------------- | -------- | ---------- | --------------------------------------- |
| `program_id` | string/integer | Yes      | Required   | Program ID                              |
| `day`        | string/integer | Yes      | Required   | Program day number                      |
| `meal_ids`   | array          | Yes      | Array      | Array of meal (nutrition) IDs to assign |

#### Example Request

```json
{
  "program_id": 1,
  "day": 1,
  "meal_ids": [1, 2, 3]
}
```

#### Success Response

```json
{
  "status": "success",
  "message": "Added"
}
```

#### HTTP Status Codes

| Code  | Meaning             |
| ----- | ------------------- |
| `200` | Diet meals assigned |
| `422` | Validation error    |

#### Edge Cases

- Adds multiple meals to a single day in a program's diet plan.

---

### POST /admin/update-dietmeal/{id}

#### Description

Updates the day assignment and meal IDs for an existing diet meal record.

#### Endpoint

```http
POST /admin/update-dietmeal/{id}
```

#### URL Parameters

| Parameter | Type    | Description         |
| --------- | ------- | ------------------- |
| `id`      | integer | Diet meal record ID |

#### Authentication

Required — Bearer Token

#### Request Body

| Field      | Type           | Required | Validation | Description               |
| ---------- | -------------- | -------- | ---------- | ------------------------- |
| `day`      | string/integer | Yes      | Required   | Updated day number        |
| `meal_ids` | array          | Yes      | Array      | Updated array of meal IDs |

#### Example Request

```json
{
  "day": 2,
  "meal_ids": [4, 5]
}
```

#### Success Response

```json
{
  "status": "success",
  "message": "Updated"
}
```

#### HTTP Status Codes

| Code  | Meaning           |
| ----- | ----------------- |
| `200` | Diet meal updated |
| `422` | Validation error  |

---

### DELETE /admin/delete-dietmeal/{id}

#### Description

Permanently deletes a diet meal record by its ID.

#### Endpoint

```http
DELETE /admin/delete-dietmeal/{id}
```

#### URL Parameters

| Parameter | Type    | Description         |
| --------- | ------- | ------------------- |
| `id`      | integer | Diet meal record ID |

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "message": "Deleted"
}
```

#### HTTP Status Codes

| Code  | Meaning |
| ----- | ------- |
| `200` | Deleted |

---

### GET /admin/getprogramduration/{id}

#### Description

Returns the total duration (in days) of a specific health program. Used to determine the valid range of days when building diet plans.

#### Endpoint

```http
GET /admin/getprogramduration/{id}
```

#### URL Parameters

| Parameter | Type    | Description |
| --------- | ------- | ----------- |
| `id`      | integer | Program ID  |

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "duration": 30
}
```

#### Response Fields

| Field      | Type    | Description              |
| ---------- | ------- | ------------------------ |
| `status`   | string  | `"success"`              |
| `duration` | integer | Program duration in days |

#### HTTP Status Codes

| Code  | Meaning           |
| ----- | ----------------- |
| `200` | Duration returned |

---

### GET /admin/getsearchfood

#### Description

Searches the food/nutrition database based on a query. Returns matching food records for use in meal assignment workflows.

#### Endpoint

```http
GET /admin/getsearchfood
```

#### Authentication

Required — Bearer Token

#### Request Body

No request body required.

#### Success Response

```json
{
  "status": "success",
  "foods": []
}
```

#### Response Fields

| Field    | Type   | Description                     |
| -------- | ------ | ------------------------------- |
| `status` | string | `"success"`                     |
| `foods`  | array  | Matching food/nutrition records |

#### HTTP Status Codes

| Code  | Meaning                 |
| ----- | ----------------------- |
| `200` | Search results returned |

#### Notes

- Query parameters for filtering are Not specified in the current data source. Consult backend implementation for supported query params.

---

### PATCH /admin/toggle-status-diet-meal/{id}

#### Description

Toggles the active/inactive status of a specific diet meal record.

#### Endpoint

```http
PATCH /admin/toggle-status-diet-meal/{id}
```

#### URL Parameters

| Parameter | Type    | Description         |
| --------- | ------- | ------------------- |
| `id`      | integer | Diet meal record ID |

#### Authentication

Required — Bearer Token

#### Request Body

| Field    | Type   | Required | Validation | Description      |
| -------- | ------ | -------- | ---------- | ---------------- |
| `status` | string | Yes      | Required   | New status value |

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
  "message": "Status toggled"
}
```

#### HTTP Status Codes

| Code  | Meaning        |
| ----- | -------------- |
| `200` | Status toggled |

#### Edge Cases

- Toggles between active and inactive states.

---

# 6. Fitzone Management (Additional)

Supplementary Fitzone endpoints covering title lookup, status toggle, and deletion.

---

### GET /admin/getworkouttitle/{id}

#### Description

Returns the title of a specific Fitzone entry, identified by its ID.

#### Endpoint

```http
GET /admin/getworkouttitle/{id}
```

#### URL Parameters

| Parameter | Type    | Description |
| --------- | ------- | ----------- |
| `id`      | integer | Fitzone ID  |

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "title": "Yoga Basics"
}
```

#### Response Fields

| Field    | Type   | Description              |
| -------- | ------ | ------------------------ |
| `status` | string | `"success"`              |
| `title`  | string | The title of the Fitzone |

#### HTTP Status Codes

| Code  | Meaning        |
| ----- | -------------- |
| `200` | Title returned |

---

### PATCH /admin/toggle-status-fitzone/{id}

#### Description

Toggles the active/inactive status of a Fitzone entry.

#### Endpoint

```http
PATCH /admin/toggle-status-fitzone/{id}
```

#### URL Parameters

| Parameter | Type    | Description |
| --------- | ------- | ----------- |
| `id`      | integer | Fitzone ID  |

#### Authentication

Required — Bearer Token

#### Request Body

| Field    | Type   | Required | Validation | Description      |
| -------- | ------ | -------- | ---------- | ---------------- |
| `status` | string | Yes      | Required   | New status value |

#### Success Response

```json
{
  "status": "success",
  "message": "Toggled"
}
```

#### HTTP Status Codes

| Code  | Meaning        |
| ----- | -------------- |
| `200` | Status toggled |

---

### DELETE /admin/delete-fitzone/{id}

#### Description

Permanently deletes a Fitzone entry by its ID.

#### Endpoint

```http
DELETE /admin/delete-fitzone/{id}
```

#### URL Parameters

| Parameter | Type    | Description |
| --------- | ------- | ----------- |
| `id`      | integer | Fitzone ID  |

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "message": "Deleted"
}
```

#### HTTP Status Codes

| Code  | Meaning         |
| ----- | --------------- |
| `200` | Fitzone deleted |

---

# 7. Fitzone Workouts & Sessions

Full management of Fitzone intro content, workout categories, individual workouts, and session assignments.

---

### GET /admin/fitzone-intro/{id}

#### Description

Retrieves the intro block associated with a specific Fitzone.

#### Endpoint

```http
GET /admin/fitzone-intro/{id}
```

#### URL Parameters

| Parameter | Type    | Description |
| --------- | ------- | ----------- |
| `id`      | integer | Fitzone ID  |

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "intro": {
    "id": 1,
    "fitzone_id": 1,
    "title": "Intro"
  }
}
```

#### Response Fields

| Field              | Type    | Description           |
| ------------------ | ------- | --------------------- |
| `status`           | string  | `"success"`           |
| `intro.id`         | integer | Intro record ID       |
| `intro.fitzone_id` | integer | Associated Fitzone ID |
| `intro.title`      | string  | Intro title           |

#### HTTP Status Codes

| Code  | Meaning        |
| ----- | -------------- |
| `200` | Intro returned |

---

### POST /admin/fitzone-intro

#### Description

Creates an intro block for a specific Fitzone.

#### Endpoint

```http
POST /admin/fitzone-intro
```

#### Authentication

Required — Bearer Token

#### Request Body

| Field         | Type           | Required | Validation | Description           |
| ------------- | -------------- | -------- | ---------- | --------------------- |
| `fitzone_id`  | string/integer | Yes      | Required   | Associated Fitzone ID |
| `title`       | string         | Yes      | Required   | Intro title           |
| `description` | string         | Yes      | Required   | Intro description     |

#### Example Request

```json
{
  "fitzone_id": 1,
  "title": "Welcome to Yoga Basics",
  "description": "A beginner-friendly yoga program."
}
```

#### Success Response

```json
{
  "status": "success",
  "message": "Added"
}
```

#### HTTP Status Codes

| Code  | Meaning          |
| ----- | ---------------- |
| `200` | Intro created    |
| `422` | Validation error |

---

### POST /admin/fitzone-intro/update/{id}

#### Description

Updates the title and description of an existing Fitzone intro.

#### Endpoint

```http
POST /admin/fitzone-intro/update/{id}
```

#### URL Parameters

| Parameter | Type    | Description     |
| --------- | ------- | --------------- |
| `id`      | integer | Intro record ID |

#### Authentication

Required — Bearer Token

#### Request Body

| Field         | Type   | Required | Validation | Description         |
| ------------- | ------ | -------- | ---------- | ------------------- |
| `title`       | string | Yes      | Required   | Updated title       |
| `description` | string | Yes      | Required   | Updated description |

#### Success Response

```json
{
  "status": "success",
  "message": "Updated"
}
```

#### HTTP Status Codes

| Code  | Meaning          |
| ----- | ---------------- |
| `200` | Intro updated    |
| `422` | Validation error |

---

### GET /admin/fitzone-workoutcat/{id}

#### Description

Returns all workout categories belonging to a specific Fitzone.

#### Endpoint

```http
GET /admin/fitzone-workoutcat/{id}
```

#### URL Parameters

| Parameter | Type    | Description |
| --------- | ------- | ----------- |
| `id`      | integer | Fitzone ID  |

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "categories": [
    {
      "id": 1,
      "title": "Warmup"
    }
  ]
}
```

#### Response Fields

| Field                | Type    | Description                      |
| -------------------- | ------- | -------------------------------- |
| `status`             | string  | `"success"`                      |
| `categories`         | array   | List of workout category objects |
| `categories[].id`    | integer | Category ID                      |
| `categories[].title` | string  | Category name                    |

#### HTTP Status Codes

| Code  | Meaning                     |
| ----- | --------------------------- |
| `200` | Workout categories returned |

---

### POST /admin/add-workoutcat

#### Description

Creates a new workout category under a specific Fitzone.

#### Endpoint

```http
POST /admin/add-workoutcat
```

#### Authentication

Required — Bearer Token

#### Request Body

| Field        | Type           | Required | Validation | Description           |
| ------------ | -------------- | -------- | ---------- | --------------------- |
| `fitzone_id` | string/integer | Yes      | Required   | Associated Fitzone ID |
| `title`      | string         | Yes      | Required   | Workout category name |

#### Example Request

```json
{
  "fitzone_id": 1,
  "title": "Cool Down"
}
```

#### Success Response

```json
{
  "status": "success",
  "message": "Added"
}
```

#### HTTP Status Codes

| Code  | Meaning          |
| ----- | ---------------- |
| `200` | Category created |
| `422` | Validation error |

---

### POST /admin/update-workoutcat/{id}

#### Description

Updates the title of an existing workout category.

#### Endpoint

```http
POST /admin/update-workoutcat/{id}
```

#### URL Parameters

| Parameter | Type    | Description         |
| --------- | ------- | ------------------- |
| `id`      | integer | Workout category ID |

#### Authentication

Required — Bearer Token

#### Request Body

| Field   | Type   | Required | Validation | Description           |
| ------- | ------ | -------- | ---------- | --------------------- |
| `title` | string | Yes      | Required   | Updated category name |

#### Success Response

```json
{
  "status": "success",
  "message": "Updated"
}
```

#### HTTP Status Codes

| Code  | Meaning          |
| ----- | ---------------- |
| `200` | Category updated |
| `422` | Validation error |

---

### PATCH /admin/toggle-status-worksession/{id}

#### Description

Toggles the active/inactive status of a work session record.

#### Endpoint

```http
PATCH /admin/toggle-status-worksession/{id}
```

#### URL Parameters

| Parameter | Type    | Description     |
| --------- | ------- | --------------- |
| `id`      | integer | Work session ID |

#### Authentication

Required — Bearer Token

#### Request Body

| Field    | Type   | Required | Validation | Description      |
| -------- | ------ | -------- | ---------- | ---------------- |
| `status` | string | Yes      | Required   | New status value |

#### Success Response

```json
{
  "status": "success"
}
```

#### HTTP Status Codes

| Code  | Meaning        |
| ----- | -------------- |
| `200` | Status toggled |

---

### DELETE /admin/delete-worksession/{id}

#### Description

Permanently deletes a work session record.

#### Endpoint

```http
DELETE /admin/delete-worksession/{id}
```

#### URL Parameters

| Parameter | Type    | Description     |
| --------- | ------- | --------------- |
| `id`      | integer | Work session ID |

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success"
}
```

#### HTTP Status Codes

| Code  | Meaning |
| ----- | ------- |
| `200` | Deleted |

---

### GET /admin/workout/{id}

#### Description

Returns all workout exercises within a specific workout category.

#### Endpoint

```http
GET /admin/workout/{id}
```

#### URL Parameters

| Parameter | Type    | Description         |
| --------- | ------- | ------------------- |
| `id`      | integer | Workout category ID |

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "workouts": [
    {
      "id": 1,
      "title": "Pushups",
      "reps": 10
    }
  ]
}
```

#### Response Fields

| Field              | Type    | Description                      |
| ------------------ | ------- | -------------------------------- |
| `status`           | string  | `"success"`                      |
| `workouts`         | array   | List of workout exercise objects |
| `workouts[].id`    | integer | Workout ID                       |
| `workouts[].title` | string  | Workout name                     |
| `workouts[].reps`  | integer | Number of repetitions            |

#### HTTP Status Codes

| Code  | Meaning           |
| ----- | ----------------- |
| `200` | Workouts returned |

---

### POST /admin/workout

#### Description

Adds a new workout exercise to a workout category, with an optional video URL.

#### Endpoint

```http
POST /admin/workout
```

#### Authentication

Required — Bearer Token

#### Request Body

| Field         | Type           | Required | Validation | Description                 |
| ------------- | -------------- | -------- | ---------- | --------------------------- |
| `category_id` | string/integer | Yes      | Required   | Workout category ID         |
| `title`       | string         | Yes      | Required   | Exercise name               |
| `video_url`   | string         | No       | Valid URL  | Link to demonstration video |

#### Example Request

```json
{
  "category_id": 1,
  "title": "Burpees",
  "video_url": "https://example.com/burpees.mp4"
}
```

#### Success Response

```json
{
  "status": "success",
  "message": "Added"
}
```

#### HTTP Status Codes

| Code  | Meaning          |
| ----- | ---------------- |
| `200` | Workout added    |
| `422` | Validation error |

---

### PUT /admin/workout-update/{id}

#### Description

Updates an existing workout exercise record.

#### Endpoint

```http
PUT /admin/workout-update/{id}
```

#### URL Parameters

| Parameter | Type    | Description         |
| --------- | ------- | ------------------- |
| `id`      | integer | Workout exercise ID |

#### Authentication

Required — Bearer Token

#### Request Body

| Field   | Type   | Required | Validation | Description           |
| ------- | ------ | -------- | ---------- | --------------------- |
| `title` | string | Yes      | Required   | Updated exercise name |

#### Example Request

```json
{
  "title": "Wide Pushups"
}
```

#### Success Response

```json
{
  "status": "success",
  "message": "Updated"
}
```

#### HTTP Status Codes

| Code  | Meaning          |
| ----- | ---------------- |
| `200` | Workout updated  |
| `422` | Validation error |

---

### GET /admin/fitzone-session/{id}

#### Description

Returns all sessions belonging to a specific Fitzone.

#### Endpoint

```http
GET /admin/fitzone-session/{id}
```

#### URL Parameters

| Parameter | Type    | Description |
| --------- | ------- | ----------- |
| `id`      | integer | Fitzone ID  |

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "sessions": [
    {
      "id": 1,
      "title": "Day 1"
    }
  ]
}
```

#### Response Fields

| Field              | Type    | Description             |
| ------------------ | ------- | ----------------------- |
| `status`           | string  | `"success"`             |
| `sessions`         | array   | List of session objects |
| `sessions[].id`    | integer | Session ID              |
| `sessions[].title` | string  | Session title           |

#### HTTP Status Codes

| Code  | Meaning           |
| ----- | ----------------- |
| `200` | Sessions returned |

---

### POST /admin/add-fitzonesession

#### Description

Creates a new session for a Fitzone.

#### Endpoint

```http
POST /admin/add-fitzonesession
```

#### Authentication

Required — Bearer Token

#### Request Body

| Field        | Type           | Required | Validation | Description   |
| ------------ | -------------- | -------- | ---------- | ------------- |
| `fitzone_id` | string/integer | Yes      | Required   | Fitzone ID    |
| `title`      | string         | Yes      | Required   | Session title |

#### Example Request

```json
{
  "fitzone_id": 1,
  "title": "Day 1 - Foundation"
}
```

#### Success Response

```json
{
  "status": "success"
}
```

#### HTTP Status Codes

| Code  | Meaning          |
| ----- | ---------------- |
| `200` | Session created  |
| `422` | Validation error |

---

### POST /admin/update-fitzonesession/{id}

#### Description

Updates the title of an existing Fitzone session.

#### Endpoint

```http
POST /admin/update-fitzonesession/{id}
```

#### URL Parameters

| Parameter | Type    | Description |
| --------- | ------- | ----------- |
| `id`      | integer | Session ID  |

#### Authentication

Required — Bearer Token

#### Request Body

| Field   | Type   | Required | Validation | Description           |
| ------- | ------ | -------- | ---------- | --------------------- |
| `title` | string | Yes      | Required   | Updated session title |

#### Success Response

```json
{
  "status": "success"
}
```

#### HTTP Status Codes

| Code  | Meaning          |
| ----- | ---------------- |
| `200` | Session updated  |
| `422` | Validation error |

---

### PATCH /admin/toggle-status-fitzonesession/{id}

#### Description

Toggles the active/inactive status of a Fitzone session.

#### Endpoint

```http
PATCH /admin/toggle-status-fitzonesession/{id}
```

#### URL Parameters

| Parameter | Type    | Description |
| --------- | ------- | ----------- |
| `id`      | integer | Session ID  |

#### Authentication

Required — Bearer Token

#### Request Body

| Field    | Type   | Required | Validation | Description      |
| -------- | ------ | -------- | ---------- | ---------------- |
| `status` | string | Yes      | Required   | New status value |

#### Success Response

```json
{
  "status": "success"
}
```

#### HTTP Status Codes

| Code  | Meaning        |
| ----- | -------------- |
| `200` | Status toggled |

---

### GET /admin/fitzone-workoutsession/{id}

#### Description

Returns the workout-to-session relation records for a specific session, showing which workouts are assigned to it.

#### Endpoint

```http
GET /admin/fitzone-workoutsession/{id}
```

#### URL Parameters

| Parameter | Type    | Description |
| --------- | ------- | ----------- |
| `id`      | integer | Session ID  |

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "workout_session": [
    {
      "id": 1
    }
  ]
}
```

#### Response Fields

| Field                  | Type    | Description                              |
| ---------------------- | ------- | ---------------------------------------- |
| `status`               | string  | `"success"`                              |
| `workout_session`      | array   | List of workout-session relation objects |
| `workout_session[].id` | integer | Relation record ID                       |

#### HTTP Status Codes

| Code  | Meaning            |
| ----- | ------------------ |
| `200` | Relations returned |

#### Edge Cases

- Returns the workout-session mapping records.

---

### DELETE /admin/delete-fitzonesession/{id}

#### Description

Permanently deletes a Fitzone session and its associated workout assignments.

#### Endpoint

```http
DELETE /admin/delete-fitzonesession/{id}
```

#### URL Parameters

| Parameter | Type    | Description |
| --------- | ------- | ----------- |
| `id`      | integer | Session ID  |

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success"
}
```

#### HTTP Status Codes

| Code  | Meaning         |
| ----- | --------------- |
| `200` | Session deleted |

---

# 8. Dashboard (Additional)

Supplementary dashboard stat endpoints returning counts for blogs, programs, and Fitzone sessions.

---

### GET /admin/blog

#### Description

Returns the total count of blog posts for display on the admin dashboard.

#### Endpoint

```http
GET /admin/blog
```

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "count": 10
}
```

#### Response Fields

| Field    | Type    | Description                |
| -------- | ------- | -------------------------- |
| `status` | string  | `"success"`                |
| `count`  | integer | Total number of blog posts |

#### HTTP Status Codes

| Code  | Meaning        |
| ----- | -------------- |
| `200` | Count returned |

---

### GET /admin/manageprogram

#### Description

Returns the total count of health programs for display on the admin dashboard.

#### Endpoint

```http
GET /admin/manageprogram
```

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "count": 5
}
```

#### Response Fields

| Field    | Type    | Description              |
| -------- | ------- | ------------------------ |
| `status` | string  | `"success"`              |
| `count`  | integer | Total number of programs |

#### HTTP Status Codes

| Code  | Meaning        |
| ----- | -------------- |
| `200` | Count returned |

---

### GET /admin/fitzonesession

#### Description

Returns the total count of Fitzone sessions for display on the admin dashboard.

#### Endpoint

```http
GET /admin/fitzonesession
```

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "count": 20
}
```

#### Response Fields

| Field    | Type    | Description                      |
| -------- | ------- | -------------------------------- |
| `status` | string  | `"success"`                      |
| `count`  | integer | Total number of Fitzone sessions |

#### HTTP Status Codes

| Code  | Meaning        |
| ----- | -------------- |
| `200` | Count returned |

---

# 9. Diet Meal Management

Manages the diet meal data records (the nutrition database entries used in diet plans), including bulk operations.

---

### GET /admin/diet_meal_data

#### Description

Returns a paginated list of all diet meal data records from the nutrition database.

#### Endpoint

```http
GET /admin/diet_meal_data
```

#### Authentication

Required — Bearer Token

#### Success Response

```json
{
  "status": "success",
  "meals": [
    {
      "id": 1,
      "Meal_title": "Oats"
    }
  ]
}
```

#### Response Fields

| Field                | Type    | Description               |
| -------------------- | ------- | ------------------------- |
| `status`             | string  | `"success"`               |
| `meals`              | array   | List of diet meal records |
| `meals[].id`         | integer | Meal record ID            |
| `meals[].Meal_title` | string  | Name of the meal          |

#### HTTP Status Codes

| Code  | Meaning                      |
| ----- | ---------------------------- |
| `200` | Paginated meal data returned |

#### Edge Cases

- Returns paginated diet meal records.

---

### PATCH /admin/toggle-status-Diet-Meal/{id}

#### Description

Toggles the active/inactive status of a specific diet meal data record.

#### Endpoint

```http
PATCH /admin/toggle-status-Diet-Meal/{id}
```

#### URL Parameters

| Parameter | Type    | Description         |
| --------- | ------- | ------------------- |
| `id`      | integer | Diet meal record ID |

#### Authentication

Required — Bearer Token

#### Request Body

| Field    | Type   | Required | Validation | Description      |
| -------- | ------ | -------- | ---------- | ---------------- |
| `status` | string | Yes      | Required   | New status value |

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
  "message": "Updated"
}
```

#### HTTP Status Codes

| Code  | Meaning        |
| ----- | -------------- |
| `200` | Status updated |

---

### POST /admin/upload-diet-meal

#### Description

Bulk imports diet meal data from an uploaded file. The file is parsed server-side and each record is inserted into the database.

#### Endpoint

```http
POST /admin/upload-diet-meal
```

#### Authentication

Required — Bearer Token

#### Request Body

> Use `Content-Type: multipart/form-data` for file upload.

| Field  | Type | Required | Validation    | Description                                                      |
| ------ | ---- | -------- | ------------- | ---------------------------------------------------------------- |
| `file` | file | Yes      | Required file | The data file to upload (format Not specified — consult backend) |

#### Success Response

```json
{
  "status": "success",
  "message": "Uploaded"
}
```

#### HTTP Status Codes

| Code  | Meaning                         |
| ----- | ------------------------------- |
| `200` | File uploaded and processed     |
| `422` | Validation error (invalid file) |

#### Edge Cases

- Bulk upload from file. File format details are not specified in the current data source — consult backend implementation.

---

### POST /admin/add-dietmealbulkupload

#### Description

Bulk inserts multiple diet meal records from a JSON array payload. Each item in the `data` array represents a meal record to be inserted.

#### Endpoint

```http
POST /admin/add-dietmealbulkupload
```

#### Authentication

Required — Bearer Token

#### Request Body

| Field  | Type  | Required | Validation     | Description                     |
| ------ | ----- | -------- | -------------- | ------------------------------- |
| `data` | array | Yes      | Required array | Array of meal objects to insert |

#### Example Request

```json
{
  "data": [
    {
      "Meal_title": "Brown Rice",
      "Meal_Protien_In_gm": 5,
      "Meal_Carbs_In_gm": 45,
      "Meal_Calories_In_gm": 215,
      "Meal_Fats_In_gm": 2
    }
  ]
}
```

#### Success Response

```json
{
  "status": "success",
  "message": "Added in bulk"
}
```

#### HTTP Status Codes

| Code  | Meaning                  |
| ----- | ------------------------ |
| `200` | Bulk insertion completed |
| `422` | Validation error         |

#### Edge Cases

- Adds multiple meals in a single request.
- Individual item validation details are Not specified — consult backend implementation.

---

# API Best Practices

## Authentication

- Always use HTTPS in production environments.
- Store Bearer tokens securely — prefer `httpOnly` cookies over `localStorage`.
- Clear tokens immediately after calling the logout endpoint.

## Error Handling

- Check the HTTP status code before parsing the response body.
- Handle `401` globally — redirect to the login page when authentication expires.
- Show user-friendly messages for `422` validation errors by iterating the `errors` object.
- Log `500` errors server-side; surface a generic message to end users.

## Validation

- Validate inputs client-side before sending requests to reduce unnecessary round-trips.
- For file uploads, validate file type and size before submitting.
- Follow documented validation rules precisely to avoid `422` responses.

## Pagination

- Check `pagination.last_page` before requesting the next page.
- Use `pagination.total` and `pagination.current_page` to build UI pagination controls.

## File Uploads

- Use `Content-Type: multipart/form-data` for all file upload endpoints.
- Respect documented file type (`mimes`) and size (`max`) constraints.

## Security Recommendations

- Never log Bearer tokens or sensitive fields from request/response bodies.
- Use environment variables for base URLs and secrets — never hardcode them.
- Re-authenticate after token expiry rather than storing long-lived tokens insecurely.

## Request Conventions

- Set `Content-Type: application/json` for all JSON body requests.
- Set `Accept: application/json` to ensure JSON-formatted error responses.
- Include `Authorization: Bearer <token>` on every protected endpoint.
- For PATCH requests, include only the fields intended to be updated.

---

_Documentation generated from `data2.json` — Trimify Admin API v1.0.0 (Part 2)_
