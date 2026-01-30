# GiftForge Deployment Notes

## Database Setup

The GiftForge MVP requires two new tables: `gift_templates` and `gifts`.

### Migration

Run the migration after deploying:
```bash
cd backend
alembic upgrade head
```

### Seed Templates

After migration, seed the 5 gift templates:
```bash
python scripts/seed_gift_templates.py
```

Or the templates will be automatically created on first API call to `/api/gifts/templates` if the table is empty.

## Environment Variables

No additional environment variables required beyond the existing `DATABASE_URL` and `AUTH_SECRET_KEY`.

## API Endpoints

New endpoints added:
- `GET /api/gifts/templates` - List templates (public)
- `POST /api/gifts/questionnaire` - Create gift (public)
- `POST /api/gifts/generate` - Generate content (public)
- `GET /api/gifts/view/{code}` - View gift (public)
- `POST /api/gifts/payment` - Process payment stub (public)

## Frontend Routes

New routes:
- `/giftforge` - Main gift creation flow
- `/giftforge/{code}` - View a gift by code

## Testing

Visit `/giftforge` to test the complete flow:
1. Welcome screen
2. Template selection (5 templates)
3. Questionnaire
4. Preview
5. Generation
6. Payment
7. Shareable link

## Notes

- All GiftForge routes are public (no authentication required)
- Payment is stubbed ($4.99 fixed price)
- Content generation is stubbed (template-based with safety filter)
- Safety filter checks for basic inappropriate keywords
