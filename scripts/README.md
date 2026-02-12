Migration & import scripts

Usage:

- Set `MONGODB_URI` (and `JWT_SECRET` if needed) before running scripts.

- Dry-run seed:

```
export MONGODB_URI="your-connection-string"
npm run seed-mongo -- --dry-run
```

- Run seed (transactions by default):

```
npm run seed-mongo
```

- Import localStorage-exported JSON (default filename `local_data.json`):

```
npm run import-localstorage -- path/to/local_data.json
```

- Create recommended DB indexes:

```
npm run create-indexes
```

Notes & Safety:
- Always backup or run on staging first.
- Scripts use upserts and attempt idempotence where possible.