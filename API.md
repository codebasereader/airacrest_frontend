# Airacrest API Documentation

B2B e-commerce backend for **Airacrest** — product catalog with categories, subcategories, and bulk enquiry submissions mapped to products.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | AWS Lambda (Node.js 20.x) |
| Framework | Serverless Framework v3 |
| Database | MongoDB (Mongoose) |
| API | HTTP API (API Gateway) |
| Docs | OpenAPI 3.0 + Swagger UI |

## Quick Start

```bash
# Install dependencies
npm install

# Set MongoDB URI and other vars in .env, then run locally
npm run dev

# Open Swagger UI
open http://localhost:3000/api/docs
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/airacrest_db` |
| `JWT_SECRET` | JWT secret (for future auth) | — |
| `S3_BUCKET` | S3 bucket for images | `airacrest` |
| `SMTP_*` | Email config (future notifications) | — |

---

## Data Model

```
Category (1) ──► (N) Subcategory (1) ──► (N) Product
                                              ▲
                                              │
Enquiry ── products[] ──────────────────────────┘
```

### Category

| Field | Type | Description |
|-------|------|-------------|
| name | string | Category name |
| slug | string | URL-friendly identifier |
| description | string | Category description |
| image | string | Image URL |
| sortOrder | number | Display order |
| isActive | boolean | Visible on storefront |

### Subcategory

| Field | Type | Description |
|-------|------|-------------|
| name | string | Subcategory name |
| slug | string | Unique within category |
| category | ObjectId | Parent category |
| description | string | Subcategory description |
| image | string | Image URL |
| sortOrder | number | Display order |
| isActive | boolean | Visible on storefront |

### Product

| Field | Type | Description |
|-------|------|-------------|
| name | string | Product name |
| slug | string | URL-friendly identifier (auto-generated from name) |
| description | string | Full product description |
| images | string[] | Product image URLs |
| highlights | string[] | Product highlights (comma-separated on input, stored as array) |
| specifications | `{label, value}[]` | Product specifications |
| category | ObjectId | Parent category |
| subcategory | ObjectId | Parent subcategory |
| isFeatured | boolean | Show on homepage |
| isActive | boolean | Visible on storefront |
| sortOrder | number | Display order |

### Enquiry (Bulk Enquiry Form)

Maps to the website bulk enquiry form:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | ✓ | Contact person name |
| companyName | string | ✓ | Company name |
| country | string | ✓ | Country |
| destinationPort | string | ✓ | Destination port |
| products | array | ✓ | One or more product line items |
| products[].product | ObjectId | ✓ | Product ID from catalog |
| products[].estimatedQuantity | string | ✓ | e.g. "500 MT" |
| products[].packagingPreference | string | ✓ | e.g. "25kg bags" |
| message | string | | Additional message |
| status | string | | `pending` / `reviewed` / `contacted` / `closed` |
| adminNotes | string | | Internal admin notes |

---

## API Endpoints

### Health

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |

### Public – Catalog

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/categories` | List active categories |
| GET | `/api/categories/{categoryId}/subcategories` | List subcategories for category |
| GET | `/api/products` | List products (`?category=`, `?subcategory=`, `?featured=true`, `?search=`) |
| GET | `/api/products/{id}` | Get product by ID |
| GET | `/api/products/slug/{slug}` | Get product by slug |

### Public – Enquiry

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/enquiries` | Submit bulk enquiry |

### Admin – Categories

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/categories` | List all categories |
| POST | `/api/admin/categories` | Create category |
| GET | `/api/admin/categories/{id}` | Get category |
| PUT | `/api/admin/categories/{id}` | Update category |
| DELETE | `/api/admin/categories/{id}` | Delete category |

### Admin – Subcategories

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/subcategories` | List subcategories (`?category=`) |
| POST | `/api/admin/subcategories` | Create subcategory |
| GET | `/api/admin/subcategories/{id}` | Get subcategory |
| PUT | `/api/admin/subcategories/{id}` | Update subcategory |
| DELETE | `/api/admin/subcategories/{id}` | Delete subcategory |

### Admin – Products

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/products` | List all products |
| POST | `/api/admin/products` | Create product |
| PUT | `/api/admin/products/{id}` | Update product |
| DELETE | `/api/admin/products/{id}` | Delete product |

### Admin – Enquiries

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/enquiries` | List enquiries (`?status=pending`) |
| GET | `/api/admin/enquiries/{id}` | Get enquiry |
| PUT | `/api/admin/enquiries/{id}` | Update status / admin notes |
| DELETE | `/api/admin/enquiries/{id}` | Delete enquiry |

### Documentation

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/docs` | Swagger UI |
| GET | `/api/docs/swagger.yaml` | OpenAPI spec |

---

## Example Requests

### Create Category

```bash
curl -X POST http://localhost:3000/api/admin/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Spices",
    "description": "Premium quality spices from India"
  }'
```

### Create Subcategory

```bash
curl -X POST http://localhost:3000/api/admin/subcategories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Whole Spices",
    "category": "CATEGORY_ID_HERE",
    "description": "Whole spice varieties"
  }'
```

### Create Product

```bash
curl -X POST http://localhost:3000/api/admin/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Turmeric Powder",
    "category": "CATEGORY_ID",
    "subcategory": "SUBCATEGORY_ID",
    "description": "High curcumin content turmeric powder, export grade.",
    "images": ["https://example.com/turmeric.jpg"],
    "highlights": "Premium quality, Export grade, High curcumin",
    "specifications": [
      { "label": "Curcumin", "value": "3-5%" },
      { "label": "Moisture", "value": "Max 10%" }
    ],
    "isFeatured": true
  }'
```

### Submit Bulk Enquiry

```bash
curl -X POST http://localhost:3000/api/enquiries \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

---

## Response Format

All responses follow this structure:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Project Structure

```
airacrest/
├── API.md                    # This file
├── swagger.yaml              # OpenAPI 3.0 spec
├── swagger.html              # Swagger UI page
├── serverless.yml            # AWS Lambda config
├── package.json
└── src/
    ├── handlers/
    │   ├── testApi.js        # Health check
    │   ├── catalogApi.js     # Categories, subcategories, products
    │   ├── enquiriesApi.js   # Bulk enquiry form
    │   └── swaggerApi.js     # API docs
    ├── models/
    │   ├── Category.js
    │   ├── Subcategory.js
    │   ├── Product.js
    │   └── Enquiry.js
    └── utils/
        ├── db.js
        ├── response.js
        ├── router.js
        └── helpers.js
```

---

## Deploy

```bash
npm run deploy        # deploy to dev stage
npm run deploy:prod   # deploy to prod stage
```

After deploy, API Gateway URL will be printed in the terminal. Update `servers` in `swagger.yaml` with your API URL.
