# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

HopperStay is a full-stack property rental web application (Airbnb-like) built with Node.js/Express and MongoDB.

## Commands

```bash
# Start development server (port 8080 by default)
npm start

# Seed database with sample data (uses local MongoDB)
node init/index.js
```

## Environment Variables

Required in `.env`:
- `ATLASDB_URL` - MongoDB Atlas connection string
- `SECRET` - Session secret
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - Cloudinary credentials
- `MAP_TOKEN` - Mapbox access token for geocoding

## Architecture

**MVC Pattern with Express Router:**
- `models/` - Mongoose schemas (Listing, Review, User)
- `controllers/` - Business logic for each resource
- `routes/` - Express routers that wire middleware and controllers
- `views/` - EJS templates using ejs-mate layouts

**Key Files:**
- `app.js` - Application entry point, middleware setup, route mounting
- `middleware.js` - Auth guards (`isLoggedIn`, `isOwner`, `isReviewAuthor`) and Joi validation
- `schema.js` - Joi validation schemas for listings and reviews
- `cloudConfig.js` - Cloudinary + Multer storage configuration

**Data Flow:**
1. Routes define endpoints with middleware chain (auth → upload → validation → controller)
2. Controllers handle business logic and interact with models
3. Listing deletion cascades to delete associated reviews (via Mongoose post hook)

**Authentication:**
- Passport.js with local strategy
- `passport-local-mongoose` plugin adds auth methods to User model
- Session-based auth stored in MongoDB via `connect-mongo`

**External Services:**
- Cloudinary: Image uploads stored in `HopperStay_DEV` folder
- Mapbox: Forward geocoding converts location strings to GeoJSON coordinates

## Patterns

- Async route handlers wrapped with `wrapAsync()` for error propagation
- Custom `ExpressError` class for HTTP error responses
- Flash messages for user feedback (`req.flash()`)
- `res.locals` populated via middleware for template access (`currentUser`, `success`, `error`)
