# Bombay Heritage

A single-page restaurant site — menu, chef's specials, story, cart, and a
front-end-only checkout and auth flow.

## Development

```bash
npm install
npm run dev
```

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type check and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the unit tests |

## Stack

Vite, React 19, TypeScript, Tailwind CSS v4, GSAP ScrollTrigger, Iconify.

## Notes

`legacy/index.html` is the original single-file version of this site, kept as
the visual reference for the React port. It is not part of the build.

Cart, login/signup, and checkout are UI only — there is no backend, payment
processing, or order fulfilment. All content is placeholder.
