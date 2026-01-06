# 🏗️ LifeLoop System Architecture

> Complete technical documentation for understanding the entire system

---

## What is LifeLoop?

**LifeLoop is a waste intelligence platform** that helps users understand how to reuse, recycle, or donate items instead of discarding them. Users upload an item, AI analyzes it and suggests sustainable actions. If donation is chosen, the system handles listing creation, recipient matching, scheduling, route optimization, QR-based verification, and post-exchange reviews.

**Key Innovation:** Most donation platforms assume you want to donate. LifeLoop uses AI to help you make the smartest decision first—whether that's reuse, recycle, upcycle, or donate.

---

## Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [Technology Stack](#technology-stack)
3. [Backend Structure](#backend-structure)
4. [Frontend Structure](#frontend-structure)
5. [Database Schema (ER Diagram)](#database-schema-er-diagram)
6. [API Endpoints Map](#api-endpoints-map)
7. [Data Flow Diagrams](#data-flow-diagrams)
8. [Real-Time Features](#real-time-features)
9. [File-by-File Breakdown](#file-by-file-breakdown)

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              LIFELOOP ARCHITECTURE                               │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────┐
│                                   FRONTEND (React)                                │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │  Pages: Home │ Listings │ Dashboard │ WasteAnalyzer │ Profile │ Chat │ Admin │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │  Components: Sidebar │ Modals │ Cards │ Maps │ Charts │ QR │ AI Analyzer    │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │  Context: AuthContext │ SocketContext │ ThemeContext │ NotificationContext  │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │  Services: api.js (Axios) │ TensorFlow.js (AI) │ Socket.io-client           │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────┬─────────────────────────────────────────────┘
                                     │
                     ┌───────────────┴───────────────┐
                     │    HTTP/REST    │   WebSocket  │
                     │   (Port 5000)   │  (Socket.io) │
                     └───────────────┬───────────────┘
                                     │
┌────────────────────────────────────┴─────────────────────────────────────────────┐
│                              BACKEND (Node.js + Express)                          │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │  server.js → Main entry point, middleware setup, route mounting              │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │  Middleware: auth.js │ errorHandler.js │ upload.js │ rateLimiter.js         │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │  Routes: auth │ listings │ chat │ users │ qr │ schedules │ admin │ impact   │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │  Controllers: Business logic for each route                                  │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │  Socket: socketHandler.js → Real-time events (chat, notifications, tracking)│ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────┬─────────────────────────────────────────────┘
                                     │
        ┌────────────────────────────┼────────────────────────────┐
        │                            │                            │
        ▼                            ▼                            ▼
┌───────────────┐          ┌─────────────────┐          ┌─────────────────┐
│   MongoDB     │          │     Redis       │          │   Cloudinary    │
│   (Database)  │          │    (Cache)      │          │   (Images)      │
│               │          │                 │          │                 │
│ • Users       │          │ • Sessions      │          │ • Listing imgs  │
│ • Listings    │          │ • Rate limits   │          │ • Profile imgs  │
│ • Chats       │          │ • Cache         │          │ • Chat imgs     │
│ • Schedules   │          │                 │          │                 │
│ • Transactions│          │                 │          │                 │
└───────────────┘          └─────────────────┘          └─────────────────┘

                     ┌─────────────────────────────────┐
                     │       EXTERNAL SERVICES         │
                     ├─────────────────────────────────┤
                     │ • Twilio (SMS notifications)    │
                     │ • Nodemailer (Email)            │
                     │ • Google Gemini AI (Upcycling)  │
                     │ • OpenAI (Chatbot)              │
                     │ • Mapbox (Maps & Routes)        │
                     │ • node-geocoder (Geocoding)     │
                     └─────────────────────────────────┘
```

---

## Technology Stack

### Frontend

| Technology            | Purpose                         |
| --------------------- | ------------------------------- |
| **React 19**          | UI framework                    |
| **React Router 7**    | Client-side routing             |
| **Styled Components** | CSS-in-JS styling               |
| **Framer Motion**     | Animations                      |
| **TensorFlow.js**     | Client-side AI (waste analysis) |
| **Socket.io-client**  | Real-time communication         |
| **Axios**             | HTTP requests                   |
| **Recharts**          | Data visualization              |
| **Leaflet/Mapbox**    | Maps                            |
| **React Toastify**    | Notifications                   |

### Backend

| Technology             | Purpose                 |
| ---------------------- | ----------------------- |
| **Node.js**            | Runtime                 |
| **Express.js**         | Web framework           |
| **MongoDB + Mongoose** | Database + ODM          |
| **Socket.io**          | WebSocket server        |
| **JWT**                | Authentication          |
| **bcrypt**             | Password hashing        |
| **Cloudinary**         | Image storage           |
| **Redis**              | Caching & rate limiting |
| **Twilio**             | SMS service             |
| **Nodemailer**         | Email service           |
| **node-cron**          | Scheduled tasks         |

---

## Database Schema (ER Diagram)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           ENTITY RELATIONSHIP DIAGRAM                            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────┐
│         USER           │
├────────────────────────┤
│ _id: ObjectId (PK)     │
│ firstName: String      │
│ lastName: String       │
│ email: String (unique) │
│ password: String       │
│ userType: enum         │
│ phone: String          │
│ address: Object        │
│ location: GeoJSON      │
│ avatar: String         │
│ bio: String            │
│ rating: Object         │◄──────────────────────────────────┐
│ ecoScore: Number       │                                   │
│ trustScore: Number     │                                   │
│ badges: [String]       │                                   │
│ isVerified: Boolean    │                                   │
│ isActive: Boolean      │                                   │
│ isSuspended: Boolean   │                                   │
└────────────┬───────────┘                                   │
             │                                               │
             │ 1:N (creates)                                 │
             ▼                                               │
┌────────────────────────┐         ┌────────────────────────┐│
│       LISTING          │         │        RATING          ││
├────────────────────────┤         ├────────────────────────┤│
│ _id: ObjectId (PK)     │         │ _id: ObjectId (PK)     ││
│ title: String          │         │ rater: ObjectId (FK)───┼┘
│ description: String    │◄────────│ rated: ObjectId (FK)───┼──► User
│ category: enum         │   1:N   │ listing: ObjectId (FK) │
│ quantity: Number       │         │ rating: Number (1-5)   │
│ images: [String]       │         │ comment: String        │
│ donor: ObjectId (FK)───┼──► User │ ratingType: enum       │
│ location: GeoJSON      │         └────────────────────────┘
│ pickupLocation: String │
│ status: enum           │
│ assignedTo: ObjectId───┼──► User
│ interestedUsers: Array │
│ moderationStatus: enum │
│ queuePosition: Number  │
│ qrCode: String         │
└────────────┬───────────┘
             │
             │ 1:1 (generates)
             ▼
┌────────────────────────┐
│     TRANSACTION        │
├────────────────────────┤
│ _id: ObjectId (PK)     │
│ qrCode: String (unique)│
│ qrCodeHash: String     │
│ listing: ObjectId (FK) │──► Listing
│ donor: ObjectId (FK)───┼──► User
│ recipient: ObjectId────┼──► User
│ status: enum           │
│ expiresAt: Date        │
│ completedAt: Date      │
│ impact: Object         │
│   ├─ wastePreventedKg  │
│   ├─ co2SavedKg        │
│   └─ mealsProvided     │
└────────────────────────┘

┌────────────────────────┐         ┌────────────────────────┐
│       SCHEDULE         │         │      NOTIFICATION      │
├────────────────────────┤         ├────────────────────────┤
│ _id: ObjectId (PK)     │         │ _id: ObjectId (PK)     │
│ listing: ObjectId (FK) │──► List │ recipient: ObjectId────┼──► User
│ donor: ObjectId (FK)───┼──► User │ sender: ObjectId (FK)──┼──► User
│ recipient: ObjectId────┼──► User │ type: enum             │
│ proposedDateTime: Date │         │ relatedListing: ObjId  │──► Listing
│ status: enum           │         │ relatedChat: ObjectId  │──► Chat
│ pickupStatus: enum     │         │ title: String          │
│ driverLocation: GeoJSON│         │ message: String        │
│ confirmedAt: Date      │         │ read: Boolean          │
│ completedAt: Date      │         │ priority: enum         │
└────────────────────────┘         └────────────────────────┘

┌────────────────────────┐         ┌────────────────────────┐
│         CHAT           │◄────────│       MESSAGE          │
├────────────────────────┤   N:1   ├────────────────────────┤
│ _id: ObjectId (PK)     │         │ _id: ObjectId (PK)     │
│ participants: [ObjId]──┼──► User │ chat: ObjectId (FK)────┤
│ listing: ObjectId (FK) │──► List │ sender: ObjectId (FK)──┼──► User
│ lastMessage: Object    │         │ content: String        │
│ unreadCount: Map       │         │ timestamp: Date        │
│ isActive: Boolean      │         │ read: Boolean          │
└────────────────────────┘         │ messageType: enum      │
                                   │ imageUrl: String       │
                                   └────────────────────────┘

┌────────────────────────┐         ┌────────────────────────┐
│    WASTE_ANALYSIS      │         │        REPORT          │
├────────────────────────┤         ├────────────────────────┤
│ _id: ObjectId (PK)     │         │ _id: ObjectId (PK)     │
│ user: ObjectId (FK)────┼──► User │ reportType: enum       │
│ imageUrl: String       │         │ listing: ObjectId (FK) │──► Listing
│ tfLabel: String        │         │ user: ObjectId (FK)────┼──► User
│ confidence: Number     │         │ reportedBy: ObjectId───┼──► User
│ material: enum         │         │ reason: enum           │
│ materialComposition: []│         │ message: String        │
│ recyclingComplexity    │         │ status: enum           │
│ environmentalImpact: {}│         │ reviewedBy: ObjectId   │
│ hazards: Object        │         │ resolution: enum       │
│ recyclingRecs: []      │         └────────────────────────┘
│ upcycleIdeas: []       │
│ nearbyCenters: []      │
│ isSaved: Boolean       │
└────────────────────────┘

┌────────────────────────┐         ┌────────────────────────┐
│   DONATION_CENTER      │         │     UPCYCLE_IDEA       │
├────────────────────────┤         ├────────────────────────┤
│ _id: ObjectId (PK)     │         │ _id: ObjectId (PK)     │
│ type: enum             │         │ cacheKey: String       │
│ name: String           │         │ itemLabel: String      │
│ address: String        │         │ condition: String      │
│ location: GeoJSON      │         │ material: String       │
│ phone: String          │         │ ideas: [Object]        │
│ hours: Object          │         │   ├─ title             │
│ acceptedItems: [String]│         │   ├─ description       │
│ verified: Boolean      │         │   ├─ steps: []         │
└────────────────────────┘         │   ├─ materials: []     │
                                   │   └─ difficulty        │
                                   │ userId: ObjectId (FK)  │
                                   └────────────────────────┘
```

### Relationship Summary

| Relationship          | Type | Description                                 |
| --------------------- | ---- | ------------------------------------------- |
| User → Listing        | 1:N  | User creates many listings                  |
| User → Chat           | N:N  | Users participate in multiple chats         |
| User → Message        | 1:N  | User sends many messages                    |
| User → Rating         | 1:N  | User gives/receives ratings                 |
| User → Notification   | 1:N  | User receives notifications                 |
| User → Schedule       | 1:N  | User has schedules (as donor/recipient)     |
| User → WasteAnalysis  | 1:N  | User performs analyses                      |
| User → Report         | 1:N  | User creates reports                        |
| Listing → Transaction | 1:1  | Listing generates one QR transaction        |
| Listing → Schedule    | 1:N  | Listing can have multiple schedule attempts |
| Chat → Message        | 1:N  | Chat contains many messages                 |
| Listing → Chat        | 1:N  | Listing can have multiple chat threads      |

---

## API Endpoints Map

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              API ROUTES STRUCTURE                                │
│                              Base URL: /api                                      │
└─────────────────────────────────────────────────────────────────────────────────┘

📁 /auth
├── POST   /register          → Create new user account
├── POST   /login             → Authenticate & get JWT token
├── GET    /me                → Get current user profile
├── PUT    /profile           → Update user profile
├── POST   /forgot-password   → Request password reset
└── POST   /reset-password    → Reset password with token

📁 /users
├── GET    /:id               → Get user profile by ID
├── PUT    /profile           → Update own profile
├── PUT    /profile-image     → Update profile avatar
├── POST   /:id/rate          → Rate a user
├── GET    /:id/ratings       → Get user's ratings
└── GET    /search            → Search users

📁 /listings
├── POST   /                  → Create new listing
├── GET    /                  → Get all listings (with filters)
├── GET    /user              → Get current user's listings
├── GET    /nearby            → Get listings near location
├── GET    /search            → Search listings
├── GET    /:id               → Get single listing
├── PUT    /:id               → Update listing
├── DELETE /:id               → Delete listing
├── POST   /:id/interest      → Express interest in listing
├── POST   /:id/assign        → Assign listing to user
├── PUT    /:id/complete      → Mark listing complete
├── GET    /:id/match-suggestions → AI match suggestions
├── POST   /:id/assign-top-match  → Auto-assign best match
└── POST   /:id/schedule      → Propose pickup schedule

📁 /chat
├── GET    /                  → Get user's chats
├── POST   /create-or-get     → Create or get existing chat
├── GET    /:chatId           → Get chat details
├── GET    /:chatId/messages  → Get chat messages
└── POST   /:chatId/messages  → Send message

📁 /schedules
├── GET    /                  → Get all schedules
├── GET    /my-schedules      → Get user's schedules
├── GET    /upcoming          → Get upcoming schedules
├── GET    /:id               → Get schedule details
├── PUT    /:id/confirm       → Confirm schedule
├── PUT    /:id/cancel        → Cancel schedule
├── PUT    /:id/complete      → Complete schedule
├── PUT    /:id/start-pickup  → Start pickup tracking
├── PUT    /:id/driver-location → Update driver location
├── GET    /:id/pickup-status → Get live tracking status
├── POST   /recurring         → Create recurring schedule
└── DELETE /recurring/:id     → Cancel recurring schedule

📁 /qr
├── POST   /generate          → Generate QR code for transaction
├── POST   /verify            → Verify QR code
├── GET    /transaction/:id   → Get transaction details
├── GET    /my-transactions   → Get user's transactions
└── GET    /download/:id      → Download QR code image

📁 /notifications
├── GET    /                  → Get user's notifications
├── PUT    /:id/read          → Mark notification as read
├── PUT    /read-all          → Mark all as read
└── DELETE /:id               → Delete notification

📁 /impact
├── GET    /personal          → Get personal impact stats
├── GET    /community         → Get community impact stats
├── GET    /heatmap           → Get impact heatmap data
├── GET    /timeline          → Get impact timeline
├── GET    /share-card        → Generate shareable impact card
└── GET    /digital-twin      → Get digital twin visualization data

📁 /waste-analysis
├── POST   /                  → Save waste analysis
├── GET    /my-history        → Get user's analysis history
├── GET    /:id               → Get single analysis
├── PUT    /:id/save          → Toggle save/bookmark
├── DELETE /:id               → Delete analysis
├── POST   /:id/create-listing→ Create listing from analysis
├── GET    /stats/my-impact   → Get personal eco impact
├── GET    /stats/community   → Get community stats
└── GET    /leaderboard       → Get eco score leaderboard

📁 /ai
└── POST   /upcycle           → Generate AI upcycling ideas

📁 /chatbot
└── POST   /message           → Send message to AI chatbot

📁 /routes
├── POST   /optimize          → Optimize pickup routes
└── GET    /my-assigned-pickups → Get assigned pickups

📁 /ratings
├── POST   /:userId           → Rate a user
├── GET    /:userId           → Get user's reviews
└── POST   /:userId/reviews/:reviewId/report → Report a review

📁 /reports
├── POST   /                  → Create a report
├── GET    /                  → Get reports (admin)
└── PUT    /:id/resolve       → Resolve report (admin)

📁 /admin (🔒 Admin only)
├── GET    /dashboard-stats   → Get admin dashboard stats
├── GET    /users             → Get all users
├── GET    /users/:id         → Get user details
├── PUT    /users/:id/suspend → Suspend user
├── PUT    /users/:id/unsuspend → Unsuspend user
├── PUT    /users/:id/warn    → Warn user
├── PUT    /users/:id/role    → Update user role
├── POST   /users/bulk-action → Bulk user actions
├── GET    /verifications     → Get pending verifications
├── PUT    /verifications/:id/approve → Approve verification
├── PUT    /verifications/:id/reject  → Reject verification
├── GET    /flagged-content   → Get flagged content
├── PUT    /flagged-content/:id/remove  → Remove content
├── PUT    /flagged-content/:id/restore → Restore content
├── GET    /reports           → Get all reports
└── GET    /logs              → Get system logs

📁 /centers
├── GET    /                  → Get donation/recycling centers
└── GET    /nearby            → Get nearby centers

📁 /queue
├── GET    /:listingId        → Get listing queue
├── POST   /:listingId/join   → Join queue
├── DELETE /:listingId/leave  → Leave queue
└── GET    /my-position/:listingId → Get queue position

📁 /sms
└── POST   /send              → Send SMS notification

📁 /health
└── GET    /                  → Health check endpoint
```

---

## Data Flow Diagrams

### 1. User Authentication Flow

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────┐
│  User    │     │   Frontend   │     │   Backend    │     │ MongoDB  │
│ (Browser)│     │   (React)    │     │  (Express)   │     │          │
└────┬─────┘     └──────┬───────┘     └──────┬───────┘     └────┬─────┘
     │                  │                    │                  │
     │ 1. Fill form     │                    │                  │
     │ ─────────────────►                    │                  │
     │                  │                    │                  │
     │                  │ 2. POST /auth/login│                  │
     │                  │ ──────────────────►│                  │
     │                  │                    │                  │
     │                  │                    │ 3. Find user     │
     │                  │                    │ ─────────────────►
     │                  │                    │                  │
     │                  │                    │ 4. User data     │
     │                  │                    │ ◄─────────────────
     │                  │                    │                  │
     │                  │                    │ 5. Verify password
     │                  │                    │    (bcrypt.compare)
     │                  │                    │                  │
     │                  │                    │ 6. Generate JWT  │
     │                  │                    │    (jsonwebtoken)│
     │                  │                    │                  │
     │                  │ 7. { token, user } │                  │
     │                  │ ◄──────────────────│                  │
     │                  │                    │                  │
     │                  │ 8. Store token     │                  │
     │                  │    (localStorage)  │                  │
     │                  │                    │                  │
     │                  │ 9. Set AuthContext │                  │
     │                  │    (user state)    │                  │
     │                  │                    │                  │
     │ 10. Redirect to  │                    │                  │
     │     Dashboard    │                    │                  │
     │ ◄─────────────────                    │                  │
     │                  │                    │                  │
```

### 2. Listing Creation Flow

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────┐     ┌───────────┐
│  Donor   │     │   Frontend   │     │   Backend    │     │ MongoDB  │     │Cloudinary │
│          │     │              │     │              │     │          │     │           │
└────┬─────┘     └──────┬───────┘     └──────┬───────┘     └────┬─────┘     └─────┬─────┘
     │                  │                    │                  │                 │
     │ 1. Fill listing  │                    │                  │                 │
     │    form + images │                    │                  │                 │
     │ ─────────────────►                    │                  │                 │
     │                  │                    │                  │                 │
     │                  │ 2. POST /listings  │                  │                 │
     │                  │    (multipart)     │                  │                 │
     │                  │ ──────────────────►│                  │                 │
     │                  │                    │                  │                 │
     │                  │                    │ 3. Upload images │                 │
     │                  │                    │ ─────────────────────────────────►│
     │                  │                    │                  │                 │
     │                  │                    │ 4. Return URLs   │                 │
     │                  │                    │ ◄─────────────────────────────────│
     │                  │                    │                  │                 │
     │                  │                    │ 5. Content       │                 │
     │                  │                    │    moderation    │                 │
     │                  │                    │    (profanity    │                 │
     │                  │                    │     check)       │                 │
     │                  │                    │                  │                 │
     │                  │                    │ 6. Save listing  │                 │
     │                  │                    │ ─────────────────►                 │
     │                  │                    │                  │                 │
     │                  │                    │ 7. Listing saved │                 │
     │                  │                    │ ◄─────────────────                 │
     │                  │                    │                  │                 │
     │                  │ 8. Return listing  │                  │                 │
     │                  │ ◄──────────────────│                  │                 │
     │                  │                    │                  │                 │
     │ 9. Show success  │                    │                  │                 │
     │ ◄─────────────────                    │                  │                 │
```

### 3. Real-Time Chat Flow

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────┐     ┌───────────┐
│  User A  │     │  Frontend A  │     │   Backend    │     │ MongoDB  │     │ Frontend B│
│          │     │              │     │  Socket.io   │     │          │     │  User B   │
└────┬─────┘     └──────┬───────┘     └──────┬───────┘     └────┬─────┘     └─────┬─────┘
     │                  │                    │                  │                 │
     │ 1. Type message  │                    │                  │                 │
     │ ─────────────────►                    │                  │                 │
     │                  │                    │                  │                 │
     │                  │ 2. emit('sendMessage')               │                 │
     │                  │ ──────────────────►│                  │                 │
     │                  │                    │                  │                 │
     │                  │                    │ 3. Save message  │                 │
     │                  │                    │ ─────────────────►                 │
     │                  │                    │                  │                 │
     │                  │                    │ 4. Message saved │                 │
     │                  │                    │ ◄─────────────────                 │
     │                  │                    │                  │                 │
     │                  │                    │ 5. Update chat   │                 │
     │                  │                    │    lastMessage   │                 │
     │                  │                    │ ─────────────────►                 │
     │                  │                    │                  │                 │
     │                  │ 6. emit('newMessage') to room         │                 │
     │                  │ ◄──────────────────│─────────────────────────────────►│
     │                  │                    │                  │                 │
     │ 7. Update UI     │                    │                  │  8. Update UI  │
     │ ◄─────────────────                    │                  │ ◄───────────────
     │                  │                    │                  │                 │
```

### 4. AI Waste Analysis Flow (Client-Side TensorFlow.js)

```
┌──────────┐     ┌─────────────────────────────────────────────────────┐     ┌──────────┐
│  User    │     │                  FRONTEND                           │     │ Backend  │
│          │     │  ┌───────────┐  ┌─────────────┐  ┌───────────────┐ │     │          │
└────┬─────┘     │  │  Camera/  │  │TensorFlow.js│  │  Material     │ │     └────┬─────┘
     │           │  │  Upload   │  │  Models     │  │  Database     │ │          │
     │           │  └─────┬─────┘  └──────┬──────┘  └───────┬───────┘ │          │
     │           │        │               │                 │         │          │
     │ 1. Upload │        │               │                 │         │          │
     │   image   │        │               │                 │         │          │
     │ ──────────────────►│               │                 │         │          │
     │           │        │               │                 │         │          │
     │           │        │ 2. Load models│                 │         │          │
     │           │        │ ─────────────►│                 │         │          │
     │           │        │               │                 │         │          │
     │           │        │               │ 3. MobileNet    │         │          │
     │           │        │               │    classify     │         │          │
     │           │        │               │                 │         │          │
     │           │        │               │ 4. COCO-SSD     │         │          │
     │           │        │               │    detect       │         │          │
     │           │        │               │                 │         │          │
     │           │        │ 5. Predictions│                 │         │          │
     │           │        │ ◄─────────────│                 │         │          │
     │           │        │               │                 │         │          │
     │           │        │ 6. Look up material composition │         │          │
     │           │        │ ─────────────────────────────────►        │          │
     │           │        │               │                 │         │          │
     │           │        │ 7. Return hazards, recycling    │         │          │
     │           │        │    info, upcycle ideas          │         │          │
     │           │        │ ◄─────────────────────────────────        │          │
     │           │        │               │                 │         │          │
     │ 8. Display│        │               │                 │         │          │
     │   results │        │               │                 │         │          │
     │ ◄──────────────────│               │                 │         │          │
     │           │        │               │                 │         │          │
     │ 9. Save   │        │               │                 │         │          │
     │   analysis│        │               │                 │         │          │
     │ ──────────────────►│ 10. POST /waste-analysis        │         │          │
     │           │        │ ───────────────────────────────────────────────────►│
     │           │        │               │                 │         │          │
```

### 5. QR Code Verification Flow

```
┌───────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────┐
│ Recipient │     │   Frontend   │     │   Backend    │     │ MongoDB  │
│  (Scans)  │     │  QR Scanner  │     │              │     │          │
└─────┬─────┘     └──────┬───────┘     └──────┬───────┘     └────┬─────┘
      │                  │                    │                  │
      │ 1. Scan QR code  │                    │                  │
      │ ─────────────────►                    │                  │
      │                  │                    │                  │
      │                  │ 2. POST /qr/verify │                  │
      │                  │    { qrCode }      │                  │
      │                  │ ──────────────────►│                  │
      │                  │                    │                  │
      │                  │                    │ 3. Find transaction
      │                  │                    │ ─────────────────►
      │                  │                    │                  │
      │                  │                    │ 4. Validate:     │
      │                  │                    │    - Not expired │
      │                  │                    │    - Not used    │
      │                  │                    │    - Correct user│
      │                  │                    │                  │
      │                  │                    │ 5. Update status │
      │                  │                    │    to 'completed'│
      │                  │                    │ ─────────────────►
      │                  │                    │                  │
      │                  │                    │ 6. Update listing│
      │                  │                    │    to 'completed'│
      │                  │                    │ ─────────────────►
      │                  │                    │                  │
      │                  │                    │ 7. Calculate     │
      │                  │                    │    impact metrics│
      │                  │                    │                  │
      │                  │                    │ 8. Update user   │
      │                  │                    │    stats (both)  │
      │                  │                    │ ─────────────────►
      │                  │                    │                  │
      │                  │                    │ 9. Create        │
      │                  │                    │    notifications │
      │                  │                    │ ─────────────────►
      │                  │                    │                  │
      │                  │                    │ 10. Emit socket  │
      │                  │                    │     events       │
      │                  │                    │                  │
      │                  │ 11. Success + impact                  │
      │                  │ ◄──────────────────│                  │
      │                  │                    │                  │
      │ 12. Show success │                    │                  │
      │ ◄─────────────────                    │                  │
```

---

## Real-Time Features (Socket.io)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           SOCKET.IO EVENT SYSTEM                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

Server Events (Backend → Frontend)
──────────────────────────────────
├── 'newMessage'           → New chat message received
├── 'newNotification'      → New notification for user
├── 'onlineUsers'          → List of online users updated
├── 'listingUpdated'       → Listing status changed
├── 'queueUpdated'         → Queue position changed
├── 'scheduleUpdated'      → Schedule status changed
├── 'scheduleReminder'     → Pickup reminder
├── 'driverLocationUpdate' → Real-time driver tracking
├── 'transactionComplete'  → QR verification success
├── 'digitalTwin.update'   → Impact visualization update
└── 'typing'               → User typing indicator

Client Events (Frontend → Backend)
──────────────────────────────────
├── 'authenticate'         → Authenticate socket connection
├── 'joinRoom'             → Join a chat room
├── 'leaveRoom'            → Leave a chat room
├── 'sendMessage'          → Send chat message
├── 'markRead'             → Mark messages as read
├── 'startTyping'          → Typing indicator start
├── 'stopTyping'           → Typing indicator stop
├── 'joinScheduleTracking' → Join schedule tracking room
├── 'updateLocation'       → Update driver location
└── 'disconnect'           → Client disconnected

Socket Rooms
────────────
├── user:{userId}          → Personal notifications
├── chat:{chatId}          → Chat room messages
├── listing:{listingId}    → Listing updates
├── schedule:{scheduleId}  → Schedule tracking
└── admin                  → Admin broadcasts
```

---

## File-by-File Breakdown

### Backend (`/backend`)

#### Entry Point

| File        | Purpose                                                            |
| ----------- | ------------------------------------------------------------------ |
| `server.js` | Main Express app, middleware setup, route mounting, Socket.io init |

#### Config (`/config`)

| File            | Purpose                                  |
| --------------- | ---------------------------------------- |
| `db.js`         | MongoDB connection with Mongoose         |
| `redis.js`      | Redis client for caching & rate limiting |
| `cloudinary.js` | Cloudinary image upload config           |
| `email.js`      | Nodemailer transporter setup             |
| `swagger.js`    | API documentation setup                  |

#### Models (`/models`)

| File                | Purpose             | Key Fields                                  |
| ------------------- | ------------------- | ------------------------------------------- |
| `User.js`           | User accounts       | name, email, password, userType, trustScore |
| `Listing.js`        | Donation listings   | title, category, donor, status, location    |
| `Chat.js`           | Chat conversations  | participants, lastMessage, unreadCount      |
| `Message.js`        | Individual messages | chat, sender, content, timestamp            |
| `Schedule.js`       | Pickup schedules    | listing, donor, recipient, status, location |
| `Transaction.js`    | QR transactions     | qrCode, listing, status, impact             |
| `Notification.js`   | User notifications  | recipient, type, message, read              |
| `Rating.js`         | User ratings        | rater, rated, listing, rating               |
| `Report.js`         | Content reports     | reportType, reason, status                  |
| `WasteAnalysis.js`  | AI analysis results | user, tfLabel, material, recommendations    |
| `DonationCenter.js` | Recycling centers   | name, location, acceptedItems               |
| `UpcycleIdea.js`    | Cached AI ideas     | itemLabel, ideas[]                          |

#### Controllers (`/controllers`)

| File                         | Handles                             |
| ---------------------------- | ----------------------------------- |
| `authController.js`          | Registration, login, password reset |
| `listingController.js`       | CRUD listings, interest, assignment |
| `chatController.js`          | Create chats, send messages         |
| `userController.js`          | Profile management, search          |
| `scheduleController.js`      | Scheduling, pickup tracking         |
| `qrController.js`            | QR generation & verification        |
| `notificationController.js`  | Notification management             |
| `ratingController.js`        | User ratings & reviews              |
| `reportController.js`        | Content reporting                   |
| `impactController.js`        | Impact stats, digital twin          |
| `wasteAnalysisController.js` | Save/retrieve AI analyses           |
| `aiController.js`            | AI upcycling ideas (Gemini)         |
| `chatBotController.js`       | AI chatbot (OpenAI)                 |
| `adminController.js`         | Admin dashboard, moderation         |
| `analyticscontroller.js`     | Platform analytics                  |
| `queueController.js`         | Listing queue management            |
| `smsController.js`           | SMS notifications (Twilio)          |

#### Middleware (`/middleware`)

| File              | Purpose                          |
| ----------------- | -------------------------------- |
| `auth.js`         | JWT verification, role checking  |
| `errorHandler.js` | Centralized error handling       |
| `upload.js`       | Multer + Cloudinary file uploads |

#### Services (`/services`)

| File                          | Purpose                    |
| ----------------------------- | -------------------------- |
| `contentModerationService.js` | Profanity filtering        |
| `emailService.js`             | Send emails via Nodemailer |
| `smsService.js`               | Send SMS via Twilio        |
| `rateLimiter.js`              | API rate limiting          |
| `routeOptimizer.js`           | Route optimization logic   |
| `sessionStore.js`             | Redis session management   |

#### Utils (`/utils`)

| File                    | Purpose                          |
| ----------------------- | -------------------------------- |
| `helpers.js`            | Common utility functions         |
| `impactCalculations.js` | Calculate CO2, waste metrics     |
| `qrGenerator.js`        | Generate QR codes                |
| `notificationHelper.js` | Create notifications             |
| `emailTemplates.js`     | Email HTML templates             |
| `scheduleCron.js`       | Cron jobs for schedule reminders |
| `queueCronJob.js`       | Cron jobs for queue expiration   |
| `aiMatching.js`         | AI matching algorithm            |

#### Socket (`/socket`)

| File               | Purpose                      |
| ------------------ | ---------------------------- |
| `socketHandler.js` | All Socket.io event handlers |

---

### Frontend (`/frontend/src`)

#### Entry Points

| File       | Purpose                        |
| ---------- | ------------------------------ |
| `index.js` | React root, providers setup    |
| `App.js`   | Main routing, layout structure |

#### Context (`/context`)

| File                     | Purpose               | Key State                          |
| ------------------------ | --------------------- | ---------------------------------- |
| `AuthContext.js`         | Authentication state  | user, loading, login(), logout()   |
| `SocketContext.js`       | WebSocket connection  | socket, onlineUsers, notifications |
| `ThemeContext.js`        | Theme switching       | theme, toggleTheme()               |
| `NotificationContext.js` | Notification handling | notifications, addNotification()   |
| `LanguageContext.js`     | i18n (if implemented) | language, setLanguage()            |

#### Services (`/services`)

| File     | Purpose                               |
| -------- | ------------------------------------- |
| `api.js` | Axios instance, all API calls grouped |

#### Pages (`/pages`)

| Page              | Route                    | Purpose                           |
| ----------------- | ------------------------ | --------------------------------- |
| `Home`            | `/`                      | Landing page with stats, features |
| `Login`           | `/login`                 | User login form                   |
| `Register`        | `/register`              | User registration                 |
| `ForgotPassword`  | `/forgot-password`       | Request password reset            |
| `ResetPassword`   | `/reset-password/:token` | Reset password                    |
| `Listings`        | `/listings`              | Browse all listings               |
| `ListingDetails`  | `/listings/:id`          | Single listing view               |
| `CreateListing`   | `/create-listing`        | Create new listing                |
| `Dashboard`       | `/dashboard`             | User dashboard                    |
| `Profile`         | `/profile`               | User profile                      |
| `Notifications`   | `/notifications`         | Notification center               |
| `Schedules`       | `/schedules`             | Manage schedules                  |
| `MyPickups`       | `/my-pickups`            | Assigned pickups                  |
| `WasteAnalyzer`   | `/waste-analyzer`        | AI waste analysis                 |
| `AnalysisHistory` | `/analysis-history`      | Past analyses                     |
| `RouteOptimizer`  | `/route-optimizer`       | Route planning                    |
| `DigitalTwin`     | `/digital-twin`          | Impact visualization              |
| `AdminDashboard`  | `/admin`                 | Admin panel                       |

#### Components (`/components`)

| Folder             | Contains                                        |
| ------------------ | ----------------------------------------------- |
| `AI/`              | `AiWasteAnalyzer.js`, `AiMatchSuggestions.js`   |
| `Chat/`            | Chat UI components                              |
| `Common/`          | Shared: Spinner, Skeleton, Chatbot, ThemeToggle |
| `ImpactDashboard/` | Impact stats, charts, counters                  |
| `Listings/`        | ListingCard, FilterPanel                        |
| `Map/`             | Map components (Leaflet/Mapbox)                 |
| `Modals/`          | Contact, Schedule, Report modals                |
| `QR/`              | QR scanner, generator                           |
| `Schedule/`        | Schedule management UI                          |
| `Sidebar/`         | Navigation sidebar                              |
| `Tracking/`        | Live tracking UI                                |

#### Utils (`/utils`)

| File                             | Purpose                            |
| -------------------------------- | ---------------------------------- |
| `helpers.js`                     | Formatters, validators             |
| `constants.js`                   | App constants                      |
| `wasteClassifier.js`             | TensorFlow.js classification logic |
| `materialCompositionAnalyzer.js` | Material database lookup           |
| `recyclingCenters.js`            | Nearby centers logic               |
| `calendarUtils.js`               | Date formatting                    |
| `exportUtils.js`                 | Export data to CSV/PDF             |
| `motionStyled.js`                | Framer Motion helpers              |

---

## How Everything Connects

```
USER ACTION                    FRONTEND                      BACKEND                    DATABASE
═══════════════════════════════════════════════════════════════════════════════════════════════════

1. User logs in         →    AuthContext.login()      →    POST /api/auth/login   →    Users.findOne()
                              ↓                                   ↓
                         localStorage.setItem(token)         JWT signed & returned
                              ↓
                         Redirect to /dashboard

2. User creates listing →    CreateListing page        →    POST /api/listings     →    Listings.create()
                              ↓                                   ↓
                         Form data + images              Cloudinary upload
                              ↓                                   ↓
                         listingsAPI.create()            Content moderation
                              ↓
                         Success toast

3. User browses listings→    Listings page             →    GET /api/listings      →    Listings.find()
                              ↓
                         listingsAPI.getAll()
                              ↓
                         Map + ListingCards render

4. User expresses       →    ListingDetails page       →    POST /api/listings/:id →    Listing.interestedUsers
   interest                   ↓                             /interest                    .push()
                         listingsAPI.expressInterest()          ↓
                              ↓                            Notification created
                         Toast + UI update                      ↓
                                                          Socket.emit('newNotification')

5. User opens chat      →    Chat component            →    POST /api/chat/        →    Chats.findOrCreate()
                              ↓                             create-or-get
                         chatAPI.createOrGet()
                              ↓
                         socket.emit('joinRoom')

6. User sends message   →    Chat component            →    Socket: 'sendMessage'  →    Messages.create()
                              ↓                                   ↓
                         socket.emit()                   Chat.lastMessage updated
                              ↓                                   ↓
                         Optimistic UI update           Socket.emit('newMessage')
                                                              to room

7. Donor assigns listing→    ListingDetails            →    POST /api/listings/:id →    Listing.assignedTo
                              ↓                             /assign                      = recipientId
                         listingsAPI.assign()                    ↓
                              ↓                            QR code generated
                         Success + QR shown                     ↓
                                                          Transaction created
                                                                ↓
                                                          Notifications sent

8. Recipient scans QR   →    QRScanner component       →    POST /api/qr/verify    →    Transaction.status
                              ↓                                   ↓                       = 'completed'
                         qrAPI.verifyQR()                 Listing.status                  ↓
                              ↓                            = 'completed'            User stats updated
                         Success animation                      ↓
                                                          Impact calculated
                                                                ↓
                                                          Notifications sent

9. User analyzes waste  →    WasteAnalyzer page        →    (Client-side only)
                              ↓
                         TensorFlow.js loads
                              ↓
                         MobileNet + COCO-SSD
                              ↓
                         materialCompositionAnalyzer
                              ↓
                         Display results
                              ↓
                         User clicks "Save"             →    POST /api/waste-analysis→   WasteAnalysis.create()

10. Real-time tracking  →    TrackingModal             →    Socket: join room       →    Schedule doc
                              ↓                             'scheduleTracking'
                         Listen 'driverLocationUpdate'         ↓
                              ↓                            Driver updates location
                         Update map marker                     ↓
                                                          Socket.emit to room
```

---

## Summary

This project is a **comprehensive donation platform** with:

- **11 MongoDB models** handling users, listings, transactions, messaging, scheduling, and analytics
- **21 API route files** covering all CRUD operations and business logic
- **Real-time features** via Socket.io for chat, notifications, and live tracking
- **Client-side AI** using TensorFlow.js for waste analysis (no server round-trip needed)
- **Server-side AI** using Google Gemini for upcycling ideas
- **External integrations**: Cloudinary (images), Twilio (SMS), Nodemailer (email), Mapbox (maps)

The architecture follows **MVC pattern** with clear separation between routes, controllers, and models, making it maintainable and scalable.
