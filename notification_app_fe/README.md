# notification_app_fe

Stage 7 frontend for the campus notification platform, built with React, TypeScript, Vite, and Material UI.

## Features

- All Notifications page with pagination and notification type filtering
- Priority Notifications page with top 10 / 20 / 50 controls
- Viewed/unviewed state persisted in localStorage
- Responsive Material UI layout for desktop and mobile
- Loading, error, and empty states

## Installation

```bash
npm install
```

## Run

```bash
npm run dev
```

Open the app at:

```text
http://localhost:3000
```

## Build

```bash
npm run build
```

## Screenshots

Add screenshots of the All Notifications and Priority Notifications pages here after running the app locally.

## Notes

The app fetches notifications directly from:

```text
http://4.224.186.213/evaluation-service/notifications
```
