# Pastebin Lite - Secure Text Sharing

I built this application to provide a simple, secure way to share text that "self-destructs" based on specific rules. It uses a modern full-stack architecture to handle data persistence and real-time expiration logic.

## Core Functionality
- **Custom Retention**: Users can define how long a paste stays active (1 min, 1 hr, etc.) before the system marks it as expired.
- **View-Based Deletion**: I implemented a counter that tracks visits; once the user-defined limit is hit, the paste is no longer accessible.
- **Live Health Monitoring**: Includes a dedicated endpoint (`/api/healthz`) to confirm the backend is successfully communicating with the Supabase database.
- **Dynamic Routing**: Uses Next.js dynamic segments to generate unique, shareable URLs for every paste created.

## Technical Overview
- **Framework**: Next.js 15 with TypeScript for type-safe development.
- **Data Layer**: Supabase (PostgreSQL) for storing content and tracking metadata.
- **Hosting**: Deployed on Vercel with integrated environment variable management.

## Project Access
- **Application URL**: [https://pastebin-lite-lime.vercel.app](https://pastebin-lite-lime.vercel.app)
- **Status Page**: [https://pastebin-lite-lime.vercel.app/api/healthz](https://pastebin-lite-lime.vercel.app/api/healthz)
