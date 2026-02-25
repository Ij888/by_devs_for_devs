# API Response Contracts (MVP)

## Standard envelope
- Success: `{ "data": ... }`
- Error: `{ "error": "message" }`

## Notes
- Keep shapes stable while moving from mock data to SurrealDB.
- `thingsCount` remains derived on collection responses.
