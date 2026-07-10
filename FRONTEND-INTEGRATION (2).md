# Airacrest API – Frontend Integration Guide

This document is for the **frontend developer**. It covers authentication, admin catalog management, public storefront APIs, and bulk enquiry submission.

---

## Base URLs

| Environment | Base URL |
|-------------|----------|
| **Production (AWS)** | `https://mgc3mrxrva.execute-api.ap-south-1.amazonaws.com` |
| **Local dev** | `http://localhost:3000` |

**Swagger UI:** `{BASE_URL}/api/docs`

All requests use `Content-Type: application/json`.

---

## Response format

**Success**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error**
```json
{
  "success": false,
  "message": "Error description"
}
```

**HTTP status codes:** `200` OK · `201` Created · `400` Bad request · `401` Unauthorized · `403` Forbidden · `404` Not found · `409` Conflict · `500` Server error

---

## Authentication & Roles

Users are stored in the **`users`** collection. Each user has a single **`role`** string (required).

| Role | Access |
|------|--------|
| `admin` | All `/api/admin/*` endpoints |

> To add new roles later, backend updates `src/constants/roles.js` and route permissions.

Users with the **`admin`** role must **login** before calling `/api/admin/*` endpoints.

### How auth works

1. Register the first user (one-time setup) with `role: "admin"`.
2. Login → receive a **JWT token**.
3. Send token on every protected request:
   ```
   Authorization: Bearer <token>
   ```
4. Token expires in **24 hours**. On `401`, redirect to login. On `403`, user lacks required role.

### Recommended frontend storage

```javascript
// After login, store:
localStorage.setItem('authToken', response.data.token);
localStorage.setItem('authUser', JSON.stringify(response.data.user));

// On every admin API call:
const token = localStorage.getItem('authToken');
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
}

// Check role in frontend (optional UI guard):
const user = JSON.parse(localStorage.getItem('authUser'));
const isAdmin = user?.role === 'admin';
```

---

## Step 1 – Register user (first time only)

**POST** `/api/auth/register`

First user can register when no users exist. After that, `registerKey` is required.

**Request body**
```json
{
  "name": "Admin User",
  "email": "admin@airacrest.com",
  "password": "securepassword123",
  "registerKey": "airacrest-admin-2026",
  "role": "admin"
}
```

| Field | Required | Notes |
|-------|----------|-------|
| name | ✓ | Display name |
| email | ✓ | Unique, used for login |
| password | ✓ | Min 6 characters |
| role | ✓ | e.g. `"admin"` |
| registerKey | After 1st user | Secret key from backend |

**Response `201`**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "Admin User",
      "email": "admin@airacrest.com",
      "role": "admin",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": "24h"
  }
}
```

---

## Step 2 – Login

**POST** `/api/auth/login`

**Request body**
```json
{
  "email": "admin@airacrest.com",
  "password": "securepassword123"
}
```

**Response `200`**
```json
{
  "success": true,
  "data": {
    "user": { "_id": "...", "name": "...", "email": "...", "role": "admin" },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": "24h"
  }
}
```

Save `data.token` and use it for all protected routes.

---

## Step 3 – Get current user profile

**GET** `/api/auth/me`  
**Auth required:** ✓ (any logged-in user)

**Response `200`**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Admin User",
    "email": "admin@airacrest.com",
    "role": "admin",
    "isActive": true
  }
}
```

---

## Admin – User & role management

Requires `admin` role.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/roles` | List all available roles |
| GET | `/api/admin/users` | List all users |
| POST | `/api/admin/users` | Create user with role |
| GET | `/api/admin/users/{id}` | Get user |
| PUT | `/api/admin/users/{id}/role` | Update user role |
| PUT | `/api/admin/users/{id}/status` | Activate/deactivate user |
| DELETE | `/api/admin/users/{id}` | Delete user |

**Create user**
```json
POST /api/admin/users
{
  "name": "Manager User",
  "email": "manager@airacrest.com",
  "password": "securepassword123",
  "role": "admin",
  "isActive": true
}
```

**Update role**
```json
PUT /api/admin/users/{id}/role
{
  "role": "admin"
}
```

**Deactivate user**
```json
PUT /api/admin/users/{id}/status
{
  "isActive": false
}
```

---

## Complete admin workflow

Follow this order when building the admin panel:

```
Register/Login
    ↓
Create Category
    ↓
Create Subcategory (under category)
    ↓
Create Product (category + subcategory required)
    ↓
Manage Enquiries (view / update status)
```

---

## Image upload (S3 – no external URLs)

Images are **uploaded to S3**, not passed as URLs. External image URLs are rejected.

### Upload flow

1. **Get presigned URL** (admin, with token)
2. **PUT file** directly to S3 using `uploadUrl`
3. **Save `key`** when creating/updating product, category, or subcategory

### Step 1 – Get presigned URL

**POST** `/api/upload/presigned-url`  
**Auth required:** ✓

```json
{
  "folder": "products",
  "fileName": "turmeric.jpg",
  "contentType": "image/jpeg"
}
```

| folder | Use for |
|--------|---------|
| `products` | Product images |
| `categories` | Category image |
| `subcategories` | Subcategory image |

**Response**
```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://airacrest.s3.ap-south-1.amazonaws.com/...",
    "key": "products/1719234567890-a1b2c3d4-turmeric.jpg",
    "publicUrl": "https://airacrest.s3.ap-south-1.amazonaws.com/products/...",
    "expiresIn": 900
  }
}
```

### Step 2 – Upload file to S3

```javascript
await fetch(uploadUrl, {
  method: 'PUT',
  headers: { 'Content-Type': contentType },
  body: file, // File object from input
});
```

### Step 3 – Use `key` in catalog APIs

When creating a product, pass S3 keys (not URLs):

```json
{
  "name": "Turmeric Powder",
  "images": [
    "products/1719234567890-a1b2c3d4-turmeric.jpg"
  ]
}
```

**API responses** return images as objects:
```json
"images": [
  {
    "key": "products/1719234567890-a1b2c3d4-turmeric.jpg",
    "url": "https://airacrest.s3.ap-south-1.amazonaws.com/products/..."
  }
]
```

Use `url` in `<img src="...">` on the frontend.

### Delete image

**POST** `/api/upload/delete`
```json
{ "key": "products/1719234567890-a1b2c3d4-turmeric.jpg" }
```

---

## Admin – Categories

All routes below require `Authorization: Bearer <token>`.

### List all categories
**GET** `/api/admin/categories`

### Create category
**POST** `/api/admin/categories`
```json
{
  "name": "Spices",
  "description": "Premium quality spices",
  "image": "categories/1719234567890-a1b2c3d4-spices.jpg",
  "sortOrder": 1,
  "isActive": true
}
```

### Get / Update / Delete
| Method | Path |
|--------|------|
| GET | `/api/admin/categories/{id}` |
| PUT | `/api/admin/categories/{id}` |
| DELETE | `/api/admin/categories/{id}` |

**Delete blocked if linked items exist** — API returns `409` with a message and mapped items for the UI.

**Subcategory delete blocked example (`409`):**
```json
{
  "success": false,
  "message": "Cannot delete subcategory. 5 products are mapped to this subcategory. Delete or reassign them first.",
  "data": {
    "productCount": 5,
    "products": [
      { "_id": "...", "name": "Turmeric Powder", "slug": "turmeric-powder" }
    ]
  }
}
```

**Category delete blocked example (`409`):**
```json
{
  "success": false,
  "message": "Cannot delete category. 3 subcategories and 12 products linked. Delete or reassign them first.",
  "data": {
    "subcategoryCount": 3,
    "productCount": 12,
    "subcategories": [{ "_id": "...", "name": "Whole Spices", "slug": "whole-spices" }],
    "products": [{ "_id": "...", "name": "Turmeric Powder", "slug": "turmeric-powder" }]
  }
}
```

Delete subcategories and products first, then delete the category.

---

## Admin – Subcategories

### List subcategories
**GET** `/api/admin/subcategories`  
**GET** `/api/admin/subcategories?category={categoryId}`

### Create subcategory
**POST** `/api/admin/subcategories`
```json
{
  "name": "Whole Spices",
  "category": "CATEGORY_ID_HERE",
  "description": "Whole spice varieties",
  "sortOrder": 1,
  "isActive": true
}
```

### Get / Update / Delete
| Method | Path |
|--------|------|
| GET | `/api/admin/subcategories/{id}` |
| PUT | `/api/admin/subcategories/{id}` |
| DELETE | `/api/admin/subcategories/{id}` |

**Delete blocked if products are mapped** — returns `409` with product list (see category section above).

Delete mapped products first, then delete the subcategory.

---

## Admin – Products

### List all products
**GET** `/api/admin/products`  
**GET** `/api/admin/products?category={id}&subcategory={id}`

### Create product
**POST** `/api/admin/products`
```json
{
  "name": "Turmeric Powder",
  "category": "CATEGORY_ID",
  "subcategory": "SUBCATEGORY_ID",
  "description": "High curcumin content turmeric powder, export grade.",
  "images": [
    "products/1719234567890-a1b2c3d4-turmeric.jpg"
  ],
  "highlights": ["Premium quality", "Export grade", "High curcumin"],
  "specifications": [
    { "label": "Curcumin", "value": "3-5%" },
    { "label": "Moisture", "value": "Max 10%" }
  ],
  "isFeatured": true,
  "isActive": true,
  "sortOrder": 1
}
```

| Field | Required | Description |
|-------|----------|-------------|
| name | ✓ | Product name |
| category | ✓ | Category `_id` |
| subcategory | ✓ | Subcategory `_id` (must belong to category) |
| description | | Full product description |
| images | | S3 keys from upload API (not URLs) |
| highlights | | Array of strings **or** comma-separated string |
| specifications | | Array of objects `{ label, value }` |
| isFeatured | | Show on homepage |
| isActive | | Visible on storefront |

### Update / Delete
| Method | Path |
|--------|------|
| PUT | `/api/admin/products/{id}` |
| DELETE | `/api/admin/products/{id}` |

---

## Admin – Enquiries

View and manage bulk enquiry form submissions.

### List enquiries
**GET** `/api/admin/enquiries`  
**GET** `/api/admin/enquiries?status=pending`

Status values: `pending` · `reviewed` · `contacted` · `closed`

### Get single enquiry
**GET** `/api/admin/enquiries/{id}`

### Update status / notes
**PUT** `/api/admin/enquiries/{id}`
```json
{
  "status": "contacted",
  "adminNotes": "Called customer, quote sent."
}
```

### Delete enquiry
**DELETE** `/api/admin/enquiries/{id}`

---

## Public APIs (no auth)

Use these on the **customer-facing website**.

### Categories
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/categories` | Active categories |
| GET | `/api/categories/{categoryId}/subcategories` | Subcategories for category |

### Products
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/products` | All active products |
| GET | `/api/products?category={id}` | Filter by category |
| GET | `/api/products?subcategory={id}` | Filter by subcategory |
| GET | `/api/products?featured=true` | Featured only |
| GET | `/api/products?search=turmeric` | Search by name |
| GET | `/api/products/{id}` | Product by ID |
| GET | `/api/products/slug/{slug}` | Product by URL slug |

### Submit bulk enquiry (public form)
**POST** `/api/enquiries`

Maps to the website **Bulk Enquiry** form. Products must use valid product `_id` values from the catalog.

```json
{
  "name": "John Doe",
  "companyName": "Global Traders Ltd",
  "country": "United Arab Emirates",
  "destinationPort": "Jebel Ali",
  "products": [
    {
      "product": "PRODUCT_ID_HERE",
      "estimatedQuantity": "500 MT",
      "packagingPreference": "25kg bags"
    }
  ],
  "message": "Looking for long-term supply partnership."
}
```

| Form field | API field |
|------------|-----------|
| Your Name | `name` |
| Company Name | `companyName` |
| Country | `country` |
| Destination Port | `destinationPort` |
| Product Interested In | `products[].product` |
| Estimated Quantity | `products[].estimatedQuantity` |
| Packaging Preference | `products[].packagingPreference` |
| Your Message | `message` |

Multiple products can be sent in one enquiry via the `products` array.

---

## Frontend fetch examples

### Login
```javascript
const res = await fetch(`${BASE_URL}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
const json = await res.json();
if (json.success) {
  localStorage.setItem('authToken', json.data.token);
}
```

### Admin – create category
```javascript
const token = localStorage.getItem('authToken');
const res = await fetch(`${BASE_URL}/api/admin/categories`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({ name: 'Spices', description: 'Premium spices' }),
});
```

### Public – list products for enquiry dropdown
```javascript
const res = await fetch(`${BASE_URL}/api/products`);
const { data: products } = await res.json();
// Use products.map(p => ({ value: p._id, label: p.name }))
```

### Public – submit enquiry
```javascript
await fetch(`${BASE_URL}/api/enquiries`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(enquiryFormData),
});
```

---

## Admin panel pages (suggested)

| Page | APIs used |
|------|-----------|
| Login | `POST /api/auth/login` |
| Dashboard | `GET /api/admin/enquiries?status=pending` |
| Categories | CRUD `/api/admin/categories` |
| Subcategories | CRUD `/api/admin/subcategories` |
| Products | CRUD `/api/admin/products` |
| Enquiries | `GET /api/admin/enquiries`, `PUT .../status` |

## Storefront pages (suggested)

| Page | APIs used |
|------|-----------|
| Home | `GET /api/products?featured=true`, `GET /api/categories` |
| Category page | `GET /api/categories/{id}/subcategories`, `GET /api/products?category={id}` |
| Product detail | `GET /api/products/slug/{slug}` |
| Bulk enquiry | `GET /api/products`, `POST /api/enquiries` |

---

## CORS

CORS is enabled for all origins. No extra setup needed for browser requests.

---

## Health check

**GET** `/api/health` — use to verify API is up.

---

## Questions?

- **Swagger UI:** `{BASE_URL}/api/docs`
- **Backend reference:** `API.md` in the repo