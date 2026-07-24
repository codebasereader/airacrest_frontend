# Bulk Enquiry API — Backend Schema

This document defines the API contract for the **Bulk Enquiry** form on the Aira Crest public website. The frontend implementation lives in `src/section/Enquire.jsx` and submits via `POST /api/enquiries`.

---

## Public endpoints used by the form

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `GET` | `/api/products` | None | Populate **Product Interested In** dropdown (active products only) |
| `POST` | `/api/enquiries` | None | Submit enquiry |

### Products list response (dropdown)

```json
{
  "success": true,
  "data": [
    {
      "_id": "6a44f623a8dd1b7cd96d193e",
      "name": "DEHYDRATED WHITE ONION",
      "slug": "dehydrated-white-onion",
      "isActive": true,
      "sortOrder": 1
    }
  ]
}
```

The frontend displays `name` in uppercase and sends `_id` as the selected product reference.

> The enquiry form now supports **multiple product rows**. The frontend may call `GET /api/products` repeatedly using the existing load-more response shape until all active products are loaded.

---

## Submit enquiry

**POST** `/api/enquiries`  
**Content-Type:** `application/json`  
**Auth:** None (public)

### Request body

```json
{
  "name": "John Doe",
  "companyName": "Global Traders Ltd",
  "email": "john@globaltraders.com",
  "phone": "+971 50 123 4567",
  "country": "United Arab Emirates",
  "destinationPort": "Jebel Ali",
  "products": [
    {
      "product": "6a44f623a8dd1b7cd96d193e",
      "estimatedQuantity": "500 kg",
      "packagingPreference": "Bulk Cartons",
      "note": "Need organic certification and COA"
    },
    {
      "product": "6a44f8b3e73256cd4a4e2af8",
      "estimatedQuantity": "2 MT",
      "packagingPreference": null,
      "note": null
    }
  ],
  "message": "Looking for long-term supply partnership."
}
```

### Field mapping (form → API)

| # | Form label | API field | Required | Notes |
|---|------------|-----------|----------|-------|
| 1 | Your Name | `name` | Yes | Trimmed string, 2–120 chars suggested |
| 2 | Company Name | `companyName` | Yes | Trimmed string, 2–200 chars suggested |
| 3 | Email | `email` | Yes | Valid email format; primary reply channel |
| 4 | Phone / WhatsApp | `phone` | Yes | Include country code, e.g. `+971 50 123 4567` |
| 5 | Country | `country` | Yes | Free-text or enum from predefined list |
| 6 | Destination Port | `destinationPort` | No | Optional string |
| 7 | Product Interested In | `products[].product` | Yes | MongoDB ObjectId ref to `Product` |
| 8 | Estimated Quantity | `products[].estimatedQuantity` | Yes | Free text, e.g. `500 kg`, `2 MT`, `1 container` |
| 9 | Packaging Preference | `products[].packagingPreference` | No | One of: `Bulk Cartons`, `Retail Packs`, `Private Label`, `Custom` |
| 10 | Product Note | `products[].note` | No | Optional per-product note, e.g. grade, specs, certification, max 500 chars suggested |
| 11 | Your Message | `message` | No | Optional string, max ~2000 chars suggested |

> **Important:** The form now submits **one or more** product rows in `products[]`. Each row must contain its own `product` and `estimatedQuantity`. `packagingPreference` and `note` are optional per row.

### Packaging preference values (enum)

| Value |
|-------|
| `Bulk Cartons` |
| `Retail Packs` |
| `Private Label` |
| `Custom` |

Omit `packagingPreference` or send `null` when the user leaves it blank.

### Product note

`products[].note` is optional. Omit it or send `null` when the user leaves it blank.

---

## Suggested Mongoose schema

```javascript
const enquiryProductSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    estimatedQuantity: {
      type: String,
      required: true,
      trim: true,
    },
    packagingPreference: {
      type: String,
      enum: ["Bulk Cartons", "Retail Packs", "Private Label", "Custom", null],
      default: null,
    },
    note: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },
  },
  { _id: false },
);

const enquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    destinationPort: { type: String, trim: true, default: null },
    products: {
      type: [enquiryProductSchema],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "At least one product is required",
      },
    },
    message: { type: String, trim: true, default: null },
    status: {
      type: String,
      enum: ["pending", "reviewed", "contacted", "closed"],
      default: "pending",
    },
    adminNotes: { type: String, trim: true, default: null },
  },
  { timestamps: true },
);
```

---

## Validation rules (server-side)

| Field | Rule |
|-------|------|
| `name` | Required, non-empty after trim |
| `companyName` | Required, non-empty after trim |
| `email` | Required, valid email format |
| `phone` | Required, non-empty; recommend min 8 chars |
| `country` | Required, non-empty after trim |
| `destinationPort` | Optional |
| `products` | Required array with ≥ 1 item |
| `products[].product` | Required; must reference an existing **active** product `_id` |
| `products[].estimatedQuantity` | Required, non-empty after trim |
| `products[].packagingPreference` | Optional; if present, must match enum |
| `products[].note` | Optional; if present, must be ≤ 500 chars |
| `message` | Optional |

### Example validation errors

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "A valid email address is required",
    "products.0.product": "Invalid product ID"
  }
}
```

---

## Success response

```json
{
  "success": true,
  "message": "Enquiry submitted successfully",
  "data": {
    "_id": "674a1b2c3d4e5f6789012345",
    "status": "pending",
    "createdAt": "2026-07-01T12:00:00.000Z"
  }
}
```

---

## Admin endpoints (existing / suggested)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/admin/enquiries` | List all enquiries |
| `GET` | `/api/admin/enquiries?status=pending` | Filter by status |
| `GET` | `/api/admin/enquiries/{id}` | Single enquiry with populated `products.product` |
| `PUT` | `/api/admin/enquiries/{id}` | Update `status`, `adminNotes` |
| `DELETE` | `/api/admin/enquiries/{id}` | Delete enquiry |

### Admin list item (populate product name)

```json
{
  "_id": "674a1b2c3d4e5f6789012345",
  "name": "John Doe",
  "companyName": "Global Traders Ltd",
  "email": "john@globaltraders.com",
  "phone": "+971 50 123 4567",
  "country": "United Arab Emirates",
  "destinationPort": "Jebel Ali",
  "products": [
    {
      "product": {
        "_id": "6a44f623a8dd1b7cd96d193e",
        "name": "DEHYDRATED WHITE ONION"
      },
      "estimatedQuantity": "500 kg",
      "packagingPreference": "Bulk Cartons",
      "note": "Need organic certification and COA"
    }
  ],
  "message": "Looking for long-term supply partnership.",
  "status": "pending",
  "adminNotes": null,
  "createdAt": "2026-07-01T12:00:00.000Z",
  "updatedAt": "2026-07-01T12:00:00.000Z"
}
```

---

## Changes from previous integration doc

The earlier `FRONTEND-INTEGRATION` spec did not include contact fields. **Email** and **phone** are now required on every submission so the sales team can reply to leads.

| Added field | Type | Required |
|-------------|------|----------|
| `email` | `string` | Yes |
| `phone` | `string` | Yes |

---

## Frontend behavior

- The enquiry form supports **repeatable product rows**
- Users can add multiple products before submitting
- Each product row contains:
  - `product` (required)
  - `estimatedQuantity` (required)
  - `packagingPreference` (optional)
  - `note` (optional)
- The backend should preserve the order of `products[]` as submitted

---

## Optional follow-ups (not in current frontend)

- Rate limiting on `POST /api/enquiries` (e.g. per IP)
- Honeypot or CAPTCHA for spam protection
- Email notification to sales on new enquiry
- Webhook / CRM integration
