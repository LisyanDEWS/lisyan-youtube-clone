# VueTube — Client-Only YouTube Frontend

> A clean Vue.js frontend for browsing YouTube content via the [Invidious API](https://docs.invidious.io/api/).  
> No custom backend, no database, no account required.

## Features

- **Home** — trending videos feed
- **Trending** — top trending videos
- **Search** — search videos by keyword
- **Watch** — watch any video
- **Channel** — browse a channel's uploads

## Setup

### 1. Configure environment

Create a `.env.local` file (or `.env.development.local` / `.env.production.local`):

```
VUE_APP_INVIDIOUS_BASE_URL=https://yewtu.be/api/v1
```

You can replace the URL with any public Invidious instance. A list of instances is available at [https://api.invidious.io/](https://api.invidious.io/).

### 2. Install packages

```
npm install
```

### 3. Compiles and hot-reloads for development

```
npm run serve
```

### 4. Compiles and minifies for production

```
npm run build
```

### 5. Lints and fixes files

```
npm run lint
```

## Deployment (Netlify)

Set the build command to `npm run build` and publish directory to `dist`.  
Add environment variable `VUE_APP_INVIDIOUS_BASE_URL` in Netlify site settings.

> No custom backend or database is required. The app calls the Invidious API directly from the browser.

## Configuration Reference

See [Vue CLI Configuration Reference](https://cli.vuejs.org/config/).

## License

MIT
