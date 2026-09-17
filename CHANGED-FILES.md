# Simplification changes

## Removed

- `SiteContext` and every `useSite` dependency
- Activity logs, notification queue, integration-status checks, migration scripts, and their admin screens
- Logo and founder-image database settings
- Local upload fallback and the unused `/uploads` proxy
- Generated navigation arrays and generated settings-form fields

## Simplified

- Public pages now request their own settings or content directly through `src/api/api.js`
- Admin navigation and settings fields are explicit JSX
- Enquiries are saved once, emailed once through Resend, and can be retried manually
- Media uploads go directly from Express to Backblaze B2
- Fixed brand files load directly from `/media`

## Kept

- The existing public design, responsive layout, animations, light/dark themes, pages, copy, and images
- Admin authentication and the useful management pages for products, services, case studies, enquiries, media, and site settings
- MongoDB for editable records, Backblaze for uploaded media, and Resend for enquiry notifications
