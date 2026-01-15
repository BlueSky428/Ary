# Demo Access Code Setup

The demo is protected by an access code gate. To configure the access code:

## Environment Variable

Create a `.env.local` file in the `frontend/` directory (or add to your existing `.env.local`):

```bash
DEMO_ACCESS_CODE=your-access-code-here
```

## Default Code

If `DEMO_ACCESS_CODE` is not set, the default code is `arybyinlyth`.

## How It Works

1. Users click "Enter access code" on the landing page
2. They are taken to `/demo-access` where they enter the code
3. Upon successful validation, a 24-hour authentication cookie is set
4. The user is redirected to `/demo` where they can use the system
5. The demo page checks for authentication and redirects to `/demo-access` if not authenticated

## Changing the Code

Simply update the `DEMO_ACCESS_CODE` environment variable and restart the Next.js server.
