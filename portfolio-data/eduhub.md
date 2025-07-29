# EduHub Admin - Portfolio Entry Data

## 1. Project Identification
**Project ID:** `eduhub`
**Display Title:** EduHub Admin

## 2. Project Description
**Main Description (appears under video):**
A modern gateway that bridges OAuth2 authentication with legacy Plone CMS, enabling secure, high-performance access to educational content without disrupting existing workflows.

## 3. Media
**Loom Video Embed URL:** 
`https://www.loom.com/embed/d5f7ab35e4554f4f99650c52f84a0a23`

## 4. Buttons & Links

### GitHub Button
**Button Text:** View on GitHub
**URL:** `https://github.com/ryanmosz/eduhub`

### Tech Stack Button
**Button Text:** Tech Stack
**Modal Title:** EduHub Admin - Tech Stack
**Content:**
```
Core Technologies

Backend Framework
• Python 3.13.4 - Latest performance optimizations
• FastAPI 0.115.6 - Modern async web framework with auto-documentation
• ASGI/Uvicorn 0.32.1 - High-performance async server interface
• Pydantic 2.10.3 - Type-safe data validation and serialization

Frontend Stack
• React 19.1.0 with TypeScript 5.8.3 - Modern component-based UI
• Vite 7.0.4 - Lightning-fast build tool and dev server
• Tailwind CSS 4.0.0 - Utility-first styling framework
• React Router 7.7.1 - Client-side routing
• TanStack Query 5.83.0 - Server state management
• Lucide React 0.526.0 - Modern icon library

Authentication & Security
• Auth0 - Enterprise OAuth2/OIDC provider
• JWT with RS256 - Secure token validation with key rotation
• python-jose 3.3.0 - JWT processing and cryptographic operations
• Rate Limiting - Token bucket algorithm for API protection

Infrastructure & Caching
• Docker - Multi-service containerization (Postgres, Redis, Plone, API)
• PostgreSQL 15 - Database service (Docker container, ready for future features)
• Redis 7 - Caching and message broker (actively used)

Legacy Integration
• Plone CMS 6.0 - Existing content management system (running in Docker)
• Plone REST API - Native API for content operations
• Custom PloneClient - Async bridge between modern and legacy systems

Async & Performance
• httpx 0.28.1 - Async HTTP client with connection pooling
• asyncio - Native Python async runtime (used throughout)

Data Processing
• pandas 2.2.3 - CSV schedule import (used in schedule_importer/parser.py)
• bleach 6.1.0 - HTML sanitization for security (used in oembed module)

Real-time Features
• FastAPI WebSockets - Live alert broadcasting (not external websockets library)
• Slack SDK 3.27.0 - Team notification integration
• Redis Pub/Sub - Message distribution for scaling

Monitoring & Testing
• Prometheus Client 0.20.0 - Performance metrics and monitoring
• pytest 8.3.4 - Comprehensive testing framework (48+ test files)
```

### Key Features Button
**Button Text:** Key Features
**Modal Title:** EduHub Admin - Key Features Implemented
**Content:**
```
Performance Gateway
• Load Testing - 50 concurrent users through FastAPI → Plone
• Connection Pooling - Efficient HTTP client management with httpx.AsyncClient
• Async Performance - Comprehensive async/await implementation protecting legacy Plone from traffic spikes

OAuth2 Integration
• Single Sign-On - Auth0 → FastAPI → Plone user mapping
• Automatic User Creation - Seamless onboarding via Plone REST API
• Role Preservation - Existing Plone permissions maintained through intelligent role mapping

CSV Schedule Import
• Bulk Data Processing - Pandas-powered CSV validation and parsing
• Plone Content Creation - Direct Event object creation via REST API
• Transaction Safety - All-or-nothing imports with rollback on failure

Rich Media Embeds
• oEmbed Protocol - YouTube, Vimeo, Twitter integration
• Security - HTML sanitization and XSS prevention with bleach
• Caching - Redis-backed performance optimization with memory fallback

Open Data API
• Public Endpoints - No-auth content access with pagination
• Rate Limiting - 60 requests/minute protection per IP
• Real-time Sync - Direct Plone content queries (no data duplication)

Workflow Templates
• Template Management - Pre-configured approval workflows
• Role-based Assignment - Automatic task routing by user roles
• Integration Ready - Structured for Plone workflow engine integration

Real-time Alerts
• WebSocket Broadcasting - Instant notifications with connection management
• Multi-channel Delivery - Web and Slack integration (email configured for future)
• Production Features - Rate limiting, monitoring, and error handling
```

## 5. Legacy Tech Stack Badge Array (Not Currently Used)
**Tech Stack:** ["Python", "Plone", "React", "PostgreSQL", "Docker"]

---
*Last Updated: [Date]*
*Status: ✅ Complete*