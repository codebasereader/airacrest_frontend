# Blogs API — Backend Schema

This document defines the API contract for the **Blogs** feature on the Aira Crest website. The frontend implementation lives in:

- Public listing: `src/pages/BlogsPage.jsx`
- Public detail: `src/pages/BlogDetailPage.jsx`
- Related posts on product pages: `src/components/blogs/RelatedBlogs.jsx`
- Admin CRUD: `src/admin/pages/AdminBlogsPage.jsx`
- API client: `src/api/blogsApi.js`

Until the backend is live, the public pages fall back to dummy data in `src/data/dummyBlogs.js`. Set `VITE_USE_DUMMY_BLOGS=false` in `.env` to disable the fallback once APIs are ready.

---

## Response envelope

All endpoints follow the existing Aira Crest API convention:

```json
{
  "success": true,
  "message": "Optional human-readable message",
  "data": { }
}
```

Errors return `success: false` with an appropriate HTTP status code (400, 401, 403, 404, 409, 500).

---

## Public endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `GET` | `/api/blogs` | None | List published blogs |
| `GET` | `/api/blogs/:slug` | None | Get a single published blog by slug |
| `GET` | `/api/blogs?product={productId}` | None | List published blogs linked to a product |

### Query parameters — `GET /api/blogs`

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `product` | ObjectId string | No | Filter blogs linked to this product (for related posts) |
| `search` | string | No | Search title, excerpt, tags |
| `limit` | number | No | Max results (default 20; used for related posts with `limit=3`) |

> Public endpoints must only return blogs with `status: "published"`.

### List response example

```json
{
  "success": true,
  "data": [
    {
      "_id": "67a1b2c3d4e5f6789012345",
      "title": "Why Dehydrated Onion Is a Staple for Global Food Manufacturers",
      "slug": "dehydrated-onion-global-food-manufacturers",
      "excerpt": "From ready meals to seasoning blends, dehydrated white onion delivers consistent flavour…",
      "coverImage": {
        "key": "blogs/cover-abc123.webp",
        "url": "https://cdn.example.com/blogs/cover-abc123.webp"
      },
      "product": {
        "_id": "6a44f623a8dd1b7cd96d193e",
        "name": "DEHYDRATED WHITE ONION",
        "slug": "dehydrated-white-onion"
      },
      "author": "Aira Crest Team",
      "tags": ["Dehydrated Vegetables", "Export", "Onion"],
      "status": "published",
      "publishedAt": "2025-11-12T08:00:00.000Z",
      "createdAt": "2025-11-10T10:00:00.000Z",
      "updatedAt": "2025-11-12T08:00:00.000Z"
    }
  ]
}
```

> The list endpoint omits `content` (full HTML body) for performance. The detail endpoint includes it.

### Detail response example — `GET /api/blogs/:slug`

```json
{
  "success": true,
  "data": {
    "_id": "67a1b2c3d4e5f6789012345",
    "title": "Why Dehydrated Onion Is a Staple for Global Food Manufacturers",
    "slug": "dehydrated-onion-global-food-manufacturers",
    "excerpt": "From ready meals to seasoning blends…",
    "content": "<p>Dehydrated onion has become one of the most reliable ingredients…</p><h2>Key advantages</h2><ul><li>Reduced freight weight</li></ul>",
    "coverImage": {
      "key": "blogs/cover-abc123.webp",
      "url": "https://cdn.example.com/blogs/cover-abc123.webp"
    },
    "product": {
      "_id": "6a44f623a8dd1b7cd96d193e",
      "name": "DEHYDRATED WHITE ONION",
      "slug": "dehydrated-white-onion"
    },
    "author": "Aira Crest Team",
    "tags": ["Dehydrated Vegetables", "Export", "Onion"],
    "status": "published",
    "publishedAt": "2025-11-12T08:00:00.000Z",
    "createdAt": "2025-11-10T10:00:00.000Z",
    "updatedAt": "2025-11-12T08:00:00.000Z"
  }
}
```

### Related blogs on product detail

The product detail page calls:

```
GET /api/blogs?product={productId}&limit=3
```

If the array is empty, the **Related Articles** section is hidden entirely.

---

## Admin endpoints

All admin endpoints require `Authorization: Bearer <token>`.

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/admin/blogs` | List all blogs (draft + published) |
| `GET` | `/api/admin/blogs/:id` | Get blog by ID |
| `POST` | `/api/admin/blogs` | Create blog |
| `PUT` | `/api/admin/blogs/:id` | Update blog |
| `DELETE` | `/api/admin/blogs/:id` | Delete blog |

### Query parameters — `GET /api/admin/blogs`

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | No | Filter by `draft` or `published` |
| `product` | ObjectId string | No | Filter by linked product |

---

## Create blog — `POST /api/admin/blogs`

**Content-Type:** `application/json`

### Request body

```json
{
  "title": "Why Dehydrated Onion Is a Staple for Global Food Manufacturers",
  "slug": "dehydrated-onion-global-food-manufacturers",
  "excerpt": "From ready meals to seasoning blends, dehydrated white onion delivers consistent flavour…",
  "content": "<p>Dehydrated onion has become one of the most reliable ingredients…</p>",
  "coverImage": "blogs/cover-abc123.webp",
  "product": "6a44f623a8dd1b7cd96d193e",
  "author": "Aira Crest Team",
  "tags": ["Dehydrated Vegetables", "Export", "Onion"],
  "status": "published"
}
```

### Field mapping (admin form → API)

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| `title` | Yes | string | 3–200 chars suggested |
| `slug` | No | string | URL-safe, unique. Auto-generated from title if omitted |
| `excerpt` | No | string | Short summary for cards and SEO, max ~300 chars suggested |
| `content` | Yes | string | HTML from rich-text editor. Sanitize server-side (strip scripts, event handlers) |
| `coverImage` | No | string \| null | S3 object key from presigned upload (`folder: "blogs"`). `null` to remove |
| `product` | No | ObjectId \| null | Optional reference to `Product`. `null` = general article |
| `author` | No | string | Defaults to `"Aira Crest Team"` |
| `tags` | No | string[] | Free-text tags, e.g. `["Export", "Spices"]` |
| `status` | Yes | enum | `"draft"` or `"published"` |

### Status behaviour

| Status | Public visibility | `publishedAt` |
|--------|-------------------|---------------|
| `draft` | Hidden from public endpoints | `null` |
| `published` | Visible on public endpoints | Set to current timestamp on first publish; preserve on subsequent edits |

---

## Update blog — `PUT /api/admin/blogs/:id`

Same body shape as create. All fields are optional (partial update supported). When `status` changes from `draft` → `published`, set `publishedAt` if not already set.

---

## Delete blog — `DELETE /api/admin/blogs/:id`

Returns:

```json
{
  "success": true,
  "message": "Blog deleted successfully"
}
```

---

## Image handling

The admin editor uploads images via the existing presigned URL flow:

```
POST /api/admin/upload/presigned-url
{ "folder": "blogs", "fileName": "photo.webp", "contentType": "image/webp" }
```

- **Cover image:** stored as `coverImage` key on the blog document; API resolves to `{ key, url }` in responses.
- **Inline content images:** embedded in `content` HTML as `<img>` tags. The frontend uploads to S3 and inserts images with `data-key` attributes. Backend should either:
  - Resolve `data-key` to CDN URLs on save, or
  - Store HTML as-is and resolve keys to URLs on read.

Recommended: store S3 keys in `content` as `src` URLs at upload time (same pattern as product images).

---

## Suggested Mongoose schema

```javascript
const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    content: {
      type: String,
      required: true,
      default: "",
    },
    coverImage: {
      key: { type: String, default: null },
      url: { type: String, default: null },
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },
    author: {
      type: String,
      trim: true,
      default: "Aira Crest Team",
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

blogSchema.index({ slug: 1 }, { unique: true });
blogSchema.index({ product: 1, status: 1, publishedAt: -1 });
blogSchema.index({ status: 1, publishedAt: -1 });
```

### Pre-save hook (slug + publishedAt)

```javascript
blogSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
  if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  if (this.status === "draft") {
    this.publishedAt = null; // optional: keep publishedAt for re-draft
  }
  next();
});
```

---

## Validation rules

| Rule | Detail |
|------|--------|
| Unique slug | Return `409 Conflict` if slug already exists |
| Product reference | Validate `product` ObjectId exists and is active (optional soft check) |
| Content sanitization | Strip `<script>`, `on*` event attributes, `javascript:` URLs |
| Public list | Only `status === "published"` |
| Public detail | Return `404` for draft or missing slug |
| HTML content | Allow: `p`, `h2`, `h3`, `ul`, `ol`, `li`, `a`, `img`, `strong`, `em`, `u`, `br` |

---

## Frontend integration checklist

- [ ] `GET /api/blogs` — public listing page
- [ ] `GET /api/blogs/:slug` — article detail page
- [ ] `GET /api/blogs?product={id}&limit=3` — related posts on product detail
- [ ] `GET /api/admin/blogs` — admin grid with status filter
- [ ] `POST /api/admin/blogs` — create from Write Blog drawer
- [ ] `PUT /api/admin/blogs/:id` — edit existing blog
- [ ] `DELETE /api/admin/blogs/:id` — delete with confirmation modal
- [ ] Presigned upload with `folder: "blogs"` for cover and inline images
- [ ] Populate `product` with `{ _id, name, slug }` in list/detail responses

---

## Error responses

| Status | When |
|--------|------|
| `400` | Validation failed (missing title, invalid status, etc.) |
| `401` | Missing or invalid auth token (admin routes) |
| `403` | Valid token but insufficient permissions |
| `404` | Blog or slug not found |
| `409` | Duplicate slug |

Example error:

```json
{
  "success": false,
  "message": "A blog with this slug already exists"
}
```
