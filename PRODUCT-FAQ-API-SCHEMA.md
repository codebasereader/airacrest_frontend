# Product FAQs & Slug URLs — Backend Schema

This document defines the API contract for **product FAQs** and **slug-based public product URLs** used by the Aira Crest frontend.

Frontend surfaces:

- Admin product create/edit drawer — FAQ add / edit / delete / reorder
- Product detail page — shows ~30% of FAQs below Specifications, with **View all**
- Full FAQ page — `/products/{slug}/faq`
- Public product URLs — `/products/{slug}` (not Mongo `_id`)

---

## Design decisions

| Decision | Choice |
|----------|--------|
| FAQ ownership | FAQs are **embedded on the Product document** (same pattern as `specifications`) |
| Linking | Each FAQ belongs to exactly one product — no shared FAQ pool |
| No duplication | Within a product, `question` must be unique (case-insensitive, trimmed, collapsed whitespace) |
| Public URLs | Prefer `slug`; keep `GET /products/{id}` for legacy / redirects |
| Ordering | Array order is display order (admin can reorder) |

> **Why embedded?** FAQs are product-specific content, edited with the product, and returned with the product payload. A separate FAQ collection is unnecessary unless FAQs must later be reused across many products.

---

## Product model additions

### Existing fields (unchanged)

| Field | Type | Notes |
|-------|------|--------|
| `_id` | ObjectId | Internal id |
| `name` | string | Required |
| `slug` | string | Unique, URL-safe, auto from `name` (or editable) |
| `description` | string | |
| `images` | string[] / objects | |
| `highlights` | string[] | |
| `note` | string \| null | |
| `specifications` | `{ label, value }[]` | |
| `category` | ObjectId | |
| `subcategory` | ObjectId | |
| `isFeatured` | boolean | |
| `isActive` | boolean | |
| `sortOrder` | number | |

### New field

```ts
faqs: Array<{
  question: string;  // required, trimmed
  answer: string;    // required, trimmed
}>
```

Optional per-item `_id` (Mongo subdocument id) is fine for admin debugging but not required by the frontend.

### Example product document (FAQ portion)

```json
{
  "_id": "6a44fb86db696a48fe241349",
  "name": "Turmeric Powder",
  "slug": "turmeric-powder",
  "faqs": [
    {
      "question": "What curcumin content do you offer?",
      "answer": "We supply turmeric powder with curcumin content tailored to buyer requirements, typically in the 2–5% range, with COA provided per batch."
    },
    {
      "question": "What packaging options are available?",
      "answer": "Standard export packaging includes 25 kg multi-wall paper bags with inner liner. Custom packaging is available on request."
    },
    {
      "question": "Do you provide phytosanitary certificates?",
      "answer": "Yes. Phytosanitary certificates and other export documents can be arranged as required by the destination country."
    }
  ]
}
```

---

## Validation rules (create / update product)

On `POST /api/admin/products` and `PUT /api/admin/products/{id}`:

1. `faqs` is optional; default `[]`.
2. Each FAQ item must have non-empty `question` and `answer` after trim.
3. Drop items missing either field (or reject with `400` — pick one and keep consistent; frontend already strips incomplete rows).
4. **Uniqueness:** no two FAQs on the same product may share the same normalized question:
   - trim
   - lowercase
   - collapse internal whitespace to a single space
5. Max lengths (suggested):
   - `question`: 300 chars
   - `answer`: 4000 chars
6. Max FAQs per product (suggested): 50
7. Preserve array order as submitted (display order).

### Error response (duplicate question)

```json
{
  "success": false,
  "message": "Duplicate FAQ questions are not allowed on the same product.",
  "errors": [
    {
      "field": "faqs",
      "message": "Question \"What packaging options are available?\" is duplicated."
    }
  ]
}
```

HTTP status: `400`

---

## Public endpoints

### Get product by slug (primary storefront URL)

**GET** `/api/products/slug/{slug}`  
**Auth:** None

Already documented in `API.md`. Frontend now uses this for:

- `/products/{slug}` → product detail
- `/products/{slug}/faq` → full FAQ page (same product payload; FAQs rendered client-side)

#### Response (include `faqs`)

```json
{
  "success": true,
  "data": {
    "_id": "6a44fb86db696a48fe241349",
    "name": "Turmeric Powder",
    "slug": "turmeric-powder",
    "description": "...",
    "images": [],
    "highlights": [],
    "note": null,
    "specifications": [],
    "faqs": [
      {
        "question": "What curcumin content do you offer?",
        "answer": "We supply turmeric powder with curcumin content..."
      }
    ],
    "category": { "_id": "...", "name": "Spices" },
    "subcategory": { "_id": "...", "name": "Turmeric" },
    "isFeatured": true,
    "isActive": true,
    "sortOrder": 1
  }
}
```

Only return the product when `isActive === true` (same rule as other public product GETs).

### Get product by id (legacy)

**GET** `/api/products/{id}`  
**Auth:** None

Keep this endpoint. The frontend still supports old `/products/{mongoId}` URLs and **redirects client-side** to `/products/{slug}` when a product is resolved by id.

Recommended backend enhancement (optional but SEO-friendly):

```
GET /api/products/{id}
→ 301/302 Location: /api/products/slug/{slug}
```

or return the product with `slug` so the client can redirect (current frontend behaviour).

### List products

**GET** `/api/products`  

Each list item should continue to include `slug` (already used for links). Including `faqs` in list responses is **not required** and should be omitted to keep payloads small. Detail/slug endpoints must include `faqs`.

---

## Admin endpoints

No new routes. FAQs travel with the product:

| Method | Path | FAQ behaviour |
|--------|------|----------------|
| `POST` | `/api/admin/products` | Accept `faqs` array |
| `PUT` | `/api/admin/products/{id}` | Replace `faqs` with submitted array |
| `GET` | `/api/admin/products/{id}` | Return `faqs` |
| `GET` | `/api/admin/products` | Optional: omit `faqs` or include — frontend edit flow loads product detail / list item; prefer including `faqs` on list if the edit drawer uses list data |

### Create / update request body (FAQ portion)

```json
{
  "name": "Turmeric Powder",
  "category": "6a44f623a8dd1b7cd96d193e",
  "subcategory": "6a44f8b3e73256cd4a4e2af8",
  "description": "...",
  "highlights": ["Export grade", "High curcumin"],
  "note": null,
  "specifications": [
    { "label": "Moisture", "value": "Max 10%" }
  ],
  "faqs": [
    {
      "question": "What curcumin content do you offer?",
      "answer": "We supply turmeric powder with curcumin content..."
    },
    {
      "question": "What packaging options are available?",
      "answer": "Standard export packaging includes 25 kg bags..."
    }
  ],
  "isFeatured": true,
  "isActive": true,
  "sortOrder": 1,
  "images": ["products/turmeric/....webp"]
}
```

### Replace semantics

On update, treat `faqs` as a **full replace** of the array (same as `specifications`). Sending `faqs: []` clears all FAQs.

---

## Slug requirements (confirm / enforce)

| Rule | Detail |
|------|--------|
| Unique | Globally unique among products |
| Format | lowercase kebab-case: `^[a-z0-9]+(?:-[a-z0-9]+)*$` |
| Source | Auto-generated from `name` on create; regenerate on name change only if slug was never manually overridden (or always regenerate — match blog behaviour) |
| Collision | Append `-2`, `-3`, … if needed |
| Public URL | Frontend: `https://www.airacrest.com/products/{slug}` |
| FAQ URL | Frontend: `https://www.airacrest.com/products/{slug}/faq` |

Example:

| Name | Slug |
|------|------|
| Turmeric Powder | `turmeric-powder` |
| Dehydrated White Onion | `dehydrated-white-onion` |

---

## Frontend display rules (for backend awareness)

| Surface | Behaviour |
|---------|-----------|
| Product detail | Show `Math.max(1, ceil(totalFaqs * 0.3))` FAQs below Specifications / Note |
| View all | Links to `/products/{slug}/faq` when more FAQs exist than the preview |
| Full FAQ page | Renders entire `faqs` array for that product |
| Empty FAQs | Hide FAQ section; `/faq` route redirects back to product |

No separate FAQ API is required for v1.

---

## Suggested MongoDB schema sketch

```js
faqs: {
  type: [
    {
      question: { type: String, required: true, trim: true, maxlength: 300 },
      answer: { type: String, required: true, trim: true, maxlength: 4000 },
    },
  ],
  default: [],
  validate: [
    {
      validator(faqs) {
        return faqs.length <= 50;
      },
      message: "A product may have at most 50 FAQs.",
    },
    {
      validator(faqs) {
        const keys = faqs.map((f) =>
          f.question.trim().toLowerCase().replace(/\s+/g, " "),
        );
        return new Set(keys).size === keys.length;
      },
      message: "Duplicate FAQ questions are not allowed on the same product.",
    },
  ],
}
```

Ensure existing unique index on `slug` remains:

```js
productSchema.index({ slug: 1 }, { unique: true });
```

---

## Migration notes

1. Add `faqs: []` default for existing products (or rely on schema default).
2. Confirm every active product has a non-empty unique `slug`.
3. Verify `GET /api/products/slug/{slug}` returns full product including `faqs`.
4. No data migration for URLs — frontend redirects Mongo id URLs to slug when possible.

---

## Acceptance checklist for backend

- [ ] Product create/update accepts `faqs: { question, answer }[]`
- [ ] Duplicate questions on the same product are rejected (or stripped consistently)
- [ ] Public product-by-slug response includes `faqs` in display order
- [ ] Public product-by-id still works and returns `slug` + `faqs`
- [ ] List endpoints still return `slug` for linking
- [ ] Inactive products are not returned on public slug/id GETs
- [ ] Empty `faqs` array is valid

---

## Out of scope (v1)

- Shared / global FAQ library reused across products
- FAQ search / tags
- Separate `GET /api/products/{slug}/faqs` endpoint (not needed)
- Multilingual FAQs
