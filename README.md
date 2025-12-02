# GRND Workout Share

Landing page for sharing workout plans from the GRND fitness app.

## How it works

1. User shares workout from app
2. Generates unique link: `https://yourusername.github.io/grnd-workout-share?id=ABC123`
3. Recipient clicks link
4. Page loads workout preview from backend
5. "Open in App" button tries to deep link into app
6. If app not installed, shows Google Play / App Store buttons

## Setup

This page is hosted on GitHub Pages for free.

## Configuration

Update the following in `index.html`:

- `BACKEND_URL`: Your Render backend URL
- `DEEP_LINK_SCHEME`: Your app's deep link scheme (default: `grnd://workout`)
- Play Store link
- App Store link

## Deployment

Push to GitHub and enable GitHub Pages in repo settings.
