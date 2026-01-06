# LifeLoop Project Overview

## Project Purpose

LifeLoop is a **waste intelligence platform** that helps users understand how to reuse, recycle, or donate items instead of discarding them. Users upload an item, AI analyzes it and suggests sustainable actions. If donation is chosen, the system handles listing creation, recipient matching, scheduling, route optimization, QR-based verification, and post-exchange reviews. It's designed as a full end-to-end platform with trust, logistics, and sustainability in mind.

**Key Innovation:** Most donation platforms assume you want to donate. LifeLoop uses AI to help you make the smartest decision first—whether that's reuse, recycle, upcycle, or donate.

## Key Features

- User authentication and role management (admin, donor, recipient)
- Listing and searching for donation items
- Real-time chat and notifications
- AI-powered matching and analytics
- Impact dashboard and waste analysis
- Route optimization for donation pickups
- Content moderation and reporting
- Scheduling and queue management
- Integration with external services (Twilio, Cloudinary, Redis, etc.)

## Technologies Used

- **Backend:** Node.js, Express.js, MongoDB, Redis, Twilio, Cloudinary, csurf, cookie-parser
- **Frontend:** React, Styled Components, Framer Motion, React Router
- **Testing:** Jest
- **DevOps:** Docker, docker-compose

## Unique Aspects

- AI-driven matching and analytics for smarter donation distribution
- Real-time chat and notification system
- Waste analysis and impact tracking
- Route optimization for efficient pickups
- Modular, scalable architecture with clear separation of concerns

---

# File-by-File Explanation

## Root Directory

- **ARCHITECTURE.md**: Explains the overall system architecture, design patterns, and technology choices.
- **CONTIBUTING.md**: Guidelines for contributing to the project.
- **docker-compose.yml**: Orchestrates multi-container Docker applications for backend, frontend, and supporting services.
- **DOCUMENTATION.md**: Centralized documentation for setup, usage, and development.
- **FEATURES.md**: Lists and describes all major features.
- **README.md**: Project introduction, setup instructions, and quick start guide.
- **ROADMAP.md**: Outlines planned features and future improvements.
- **TODO_LifeLoop_Improvements.md**: Ongoing improvements and technical debt tracking.

## backend/

- **Dockerfile**: Containerizes the backend service.
- **jest.config.js**: Jest configuration for backend testing.
- **package.json**: Backend dependencies and scripts.
- **server.js**: Main Express server entry point; sets up middleware, routes, and services.

### backend/**tests**/

- **sample.test.js**: Example Jest test for backend logic.

### backend/config/

- **cloudinary.js**: Configures Cloudinary for image uploads.
- **db.js**: MongoDB connection setup.
- **email.js**: Email service configuration.
- **redis.js**: Redis client setup for caching and sessions.
- **swagger.js**: Swagger API documentation setup.

### backend/controllers/

- **adminController.js**: Admin-specific logic (user management, analytics, etc.).
- **aiController.js**: AI-powered features (matching, recommendations).
- **aiMatchingController.js**: Handles AI-based matching between donors and recipients.
- **analyticscontroller.js**: Collects and serves analytics data.
- **authController.js**: User authentication (login, registration, JWT, etc.).
- **chatBotController.js**: Chatbot logic for automated responses.
- **chatController.js**: Real-time chat between users.
- **impactController.js**: Tracks and reports donation impact.
- **listingController.js**: CRUD operations for donation listings.
- **notificationController.js**: Manages notifications (push, email, etc.).
- **qrController.js**: QR code generation and management.
- **queueController.js**: Handles user and item queues.
- **ratingController.js**: User/item rating logic.
- **reportController.js**: Reporting and moderation tools.
- **scheduleController.js**: Scheduling pickups and drop-offs.
- **smsController.js**: SMS integration via Twilio.
- **userController.js**: User profile and settings management.
- **wasteAnalysisController.js**: Waste analysis and reporting.

### backend/middleware/

- **auth.js**: Authentication and authorization middleware.
- **errorHandler.js**: Centralized error handling.
- **upload.js**: Handles file uploads (e.g., images).

### backend/models/

- **Chat.js**: Mongoose model for chat messages.
- **DonationCenter.js**: Model for donation centers.
- **Listing.js**: Model for donation listings.
- **Message.js**: Model for individual messages.
- **Notification.js**: Model for notifications.
- **Rating.js**: Model for ratings.
- **Report.js**: Model for reports.
- **Schedule.js**: Model for scheduling.
- **Transaction.js**: Model for donation transactions.
- **UpcycleIdea.js**: Model for upcycling ideas.
- **User.js**: Model for user accounts.
- **WasteAnalysis.js**: Model for waste analysis data.

### backend/routes/

- **admin.js**: Admin API routes.
- **ai.js**: AI feature routes.
- **aiMatching.js**: AI matching routes.
- **analytics.js**: Analytics API routes.
- **auth.js**: Authentication routes.
- **chat.js**: Chat API routes.
- **chatbot.js**: Chatbot API routes.
- **health.js**: Health check endpoint.
- **impact.js**: Impact dashboard routes.
- **listings.js**: Listing management routes.
- **notifications.js**: Notification routes.
- **qr.js**: QR code routes.
- **queue.js**: Queue management routes.
- **ratings.js**: Ratings routes.
- **reports.js**: Reporting routes.
- **routeOptimization.js**: Route optimization endpoints.
- **schedules.js**: Scheduling routes.
- **sms.js**: SMS routes.
- **users.js**: User management routes.
- **wasteAnalysis.js**: Waste analysis routes.

### backend/scripts/

- **cleanupDuplicateChats.js**: Script to remove duplicate chat records.
- **makeAdmin.js**: Script to promote a user to admin.

### backend/services/

- **contentModerationService.js**: Filters inappropriate content.
- **emailService.js**: Handles email sending.
- **rateLimiter.js**: API rate limiting logic.
- **routeOptimizer.js**: Optimizes pickup/delivery routes.
- **sessionStore.js**: Session management with Redis.
- **smsService.js**: SMS sending logic.

### backend/socket/

- **socketHandler.js**: Real-time WebSocket event handling.

### backend/utils/

- **aiMatching.js**: Utility functions for AI matching.
- **emailTemplates.js**: Email template utilities.
- **helpers.js**: General helper functions.
- **impactCalculations.js**: Calculates donation impact.
- **notificationHelper.js**: Notification utilities.
- **qrGenerator.js**: QR code generation helpers.
- **queueCronJob.js**: Cron jobs for queue management.
- **scheduleCron.js**: Cron jobs for scheduling.

## frontend/

- **Dockerfile**: Containerizes the frontend React app.
- **jest.config.js**: Jest configuration for frontend testing.
- **package.json**: Frontend dependencies and scripts.

### frontend/public/

- **index.html**: Main HTML template.
- **manifest.json**: PWA manifest.
- **robots.txt**: Search engine directives.

### frontend/src/

- **App.js**: Main React app component.
- **App.css, index.css, globalStyles.js**: Styling and global CSS.
- **index.js**: React entry point.

#### frontend/src/**tests**/

- **sample.test.js**: Example Jest test for frontend logic.

#### frontend/src/animations/

- **motionVariants.js**: Animation variants for Framer Motion.

#### frontend/src/components/

- **LiveNotificationBanner.js**: Displays live notifications.
- **ProtectedRoute.js**: Route protection for authenticated users.
- **AI/**: AI-related UI components.
- **Chat/**: Chat UI components.
- **Common/**: Shared UI components (e.g., LoadingSkeleton).
- **ImpactDashboard/**: Impact dashboard components.
- **Listings/**: Listing-related UI components.

#### frontend/src/context/

- Context providers for global state (auth, theme, etc.).

#### frontend/src/i18n/

- Internationalization setup and translations.

#### frontend/src/pages/

- **Login/**: Login page and logic.
- **RouteOptimizer/**: Route optimization UI.
- **WasteAnalyzer/**: Waste analysis UI and logic.
- ... (other pages for main app features)

#### frontend/src/services/

- API service wrappers for backend communication.

#### frontend/src/utils/

- Utility functions for the frontend.

---

# Implementation Notes

- **Backend** uses Express.js with modular controllers, middleware, and models for scalability.
- **Frontend** is a modern React SPA with component-based architecture and state management.
- **Real-time features** are enabled via WebSockets (socket.io).
- **AI and analytics** leverage custom logic and external APIs.
- **Security**: CSRF protection, JWT, rate limiting, and content moderation.
- **DevOps**: Dockerized for easy deployment; uses environment variables for config.

# Summary

DonateLocal/LifeLoop is a robust, feature-rich platform for local donation management, built with modern web technologies and a focus on scalability, security, and user experience. Each file and module is designed for clear separation of concerns, maintainability, and extensibility.
