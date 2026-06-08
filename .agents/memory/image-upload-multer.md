---
name: Image Upload — Multer disk storage
description: How product image upload works — replaced Replit Object Storage with portable multer solution
---

## Rule
Image uploads use multer disk storage, NOT Replit Object Storage (GCS sidecar).

## Route
- `POST /api/uploads` — multipart/form-data, requires admin cookie `sk_admin_session=authenticated`
- `GET /api/uploads/:filename` — serves from disk
- Upload dir: `process.env.UPLOAD_DIR` or `./uploads`

## Frontend
- `ImageUploadButton.tsx` — simple multipart fetch to `/api/uploads`
- `AdminImageUploader.tsx` — drag & drop, multiple files, reorder via framer-motion Reorder, URL input fallback

**Why:** Replit Object Storage requires `http://127.0.0.1:1106` sidecar — only works on Replit. Multer works on any server.
