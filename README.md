# 🍎 FoodShare - Community Food Donation Platform

> A real-time MERN platform connecting food donors with recipients in local communities — reducing food waste and fighting hunger through technology.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18+-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v5+-green)](https://www.mongodb.com/)

[Live Demo](#) | [Report Bug](#) | [Request Feature](#)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Roadmap](#️-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎯 Core Functionality

- **📝 Smart Listing Management**
  - Create listings with title, description, category, quantity, and expiry date
  - Upload multiple images (up to 5) via Cloudinary integration
  - Real-time status updates (Available → Pending → Completed)
  - Auto-categorization with 10+ food categories

- **📍 Location-Aware Discovery**
  - Geospatial search using MongoDB 2dsphere indexes
  - Interactive map view with marker clustering
  - "Near me" filtering with adjustable radius (1-100 km)
  - Distance calculation for each listing

- **💬 Real-Time Chat System**
  - Socket.IO powered instant messaging
  - Typing indicators and read receipts
  - Chat history persistence
  - Message notifications

- **🔔 Smart Notifications**
  - Real-time push notifications via WebSocket
  - Interest expressed notifications
  - Listing assignment alerts
  - Completion reminders
  - Toast notifications for instant feedback

- **👤 User Profiles**
  - Complete profile management (first name, last name, bio, avatar)
  - Rating system with 5-star reviews
  - Activity tracking (listings created, donations made)
  - User statistics dashboard

- **🤖 AI Chatbot Assistant**
  - 24/7 support for common questions
  - Quick reply suggestions
  - Platform navigation help
  - Floating UI for easy access

### 🔐 Security & Authentication

- JWT-based authentication with 30-day expiry
- Bcrypt password hashing (10 rounds)
- Protected routes with middleware
- Role-based access control (Donor, Recipient, Both)
- CORS protection
- Input validation using express-validator

### 📊 Analytics & Insights

- User dashboard with personal statistics
- Platform-wide analytics (admin only)
- Activity tracking and engagement metrics
- Listings by category breakdown
- Growth trends visualization

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework with hooks |
| **React Router v6** | Client-side routing |
| **Styled Components** | Component styling |
| **Axios** | HTTP client with interceptors |
| **Socket.IO Client** | Real-time communication |
| **React Toastify** | Notifications |
| **Leaflet** | Interactive maps |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | ODM with schema validation |
| **Socket.IO** | WebSocket server |
| **JWT** | Authentication tokens |
| **Bcrypt** | Password hashing |
| **Cloudinary** | Image storage & CDN |
| **Multer** | File upload handling |

### DevOps & Tools
| Technology | Purpose |
|------------|---------|
| **Nodemon** | Auto-restart dev server |
| **Dotenv** | Environment variables |
| **Compression** | Response compression |
| **Helmet** | Security headers |
| **Morgan** | HTTP logging |

---

## 🚀 Getting Started

### Prerequisites

```bash
node >= 16.0.0
npm >= 8.0.0
mongodb >= 5.0.0
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/hanuman2005/foodshare-platform.git
cd foodshare-platform
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Environment Variables**

Create `backend/.env`:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/foodshare
# Or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/foodshare

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000
```

Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

5. **Start Development Servers**

Backend:
```bash
cd backend
npm run dev
```

Frontend (new terminal):
```bash
cd frontend
npm start
```

6. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- API Documentation: http://localhost:5000/api-docs (if configured)

---

## 📂 Project Structure

```
foodshare-platform/
├── backend/
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   └── cloudinary.js            # Cloudinary setup
│   ├── controllers/
│   │   ├── authController.js        # Auth logic
│   │   ├── listingController.js     # Listing CRUD
│   │   ├── chatController.js        # Chat operations
│   │   ├── userController.js        # User management
│   │   ├── notificationController.js # Notifications
│   │   └── analyticsController.js   # Analytics data
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification
│   │   ├── upload.js                # Multer config
│   │   └── errorHandler.js          # Global error handling
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   ├── Listing.js               # Listing schema
│   │   ├── Chat.js                  # Chat schema
│   │   ├── Message.js               # Message schema
│   │   └── Notification.js          # Notification schema
│   ├── routes/
│   │   ├── auth.js                  # Auth routes
│   │   ├── listings.js              # Listing routes
│   │   ├── chat.js                  # Chat routes
│   │   ├── users.js                 # User routes
│   │   ├── notifications.js         # Notification routes
│   │   └── analytics.js             # Analytics routes
│   ├── socket/
│   │   └── socketHandler.js         # Socket.IO events
│   ├── utils/
│   │   └── notificationHelper.js    # Notification triggers
│   ├── .env                         # Environment variables
│   ├── server.js                    # Entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header/              # Navigation header
│   │   │   ├── ListingCard/         # Listing display card
│   │   │   ├── Chat/                # Chat interface
│   │   │   ├── Map/                 # Interactive map
│   │   │   ├── FloatingChatbot/     # AI assistant
│   │   │   ├── ProtectedRoute/      # Route guard
│   │   │   └── Common/              # Shared components
│   │   ├── context/
│   │   │   ├── AuthContext.js       # Auth state management
│   │   │   ├── SocketContext.js     # Socket.IO connection
│   │   │   └── LanguageContext.js   # i18n support
│   │   ├── pages/
│   │   │   ├── Home/                # Landing page
│   │   │   ├── Login/               # Login form
│   │   │   ├── Register/            # Registration
│   │   │   ├── Dashboard/           # User dashboard
│   │   │   ├── Listings/            # Browse listings
│   │   │   ├── ListingDetails/      # Single listing view
│   │   │   ├── CreateListing/       # Create form
│   │   │   ├── Profile/             # User profile
│   │   │   ├── Notifications/       # Notification center
│   │   │   ├── Chat/                # Chat page
│   │   │   ├── About/               # About page
│   │   │   └── Contact/             # Contact form
│   │   ├── services/
│   │   │   └── api.js               # Axios instance & API calls
│   │   ├── styles/
│   │   │   └── globalStyles.js      # Global CSS
│   │   ├── utils/
│   │   │   └── helpers.js           # Utility functions
│   │   ├── App.js                   # Root component
│   │   └── index.js                 # Entry point
│   ├── .env                         # Environment variables
│   └── package.json
│
└── README.md
```

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | User login | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| PUT | `/api/auth/profile` | Update profile | ✅ |

### Listing Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/listings` | Get all listings | ❌ |
| GET | `/api/listings/search` | Search listings | ❌ |
| GET | `/api/listings/nearby` | Get nearby listings | ❌ |
| GET | `/api/listings/user` | Get user's listings | ✅ |
| GET | `/api/listings/:id` | Get single listing | ❌ |
| POST | `/api/listings` | Create listing | ✅ |
| PUT | `/api/listings/:id` | Update listing | ✅ |
| DELETE | `/api/listings/:id` | Delete listing | ✅ |
| POST | `/api/listings/:id/interest` | Express interest | ✅ |
| POST | `/api/listings/:id/assign` | Assign listing | ✅ |
| PUT | `/api/listings/:id/complete` | Mark as completed | ✅ |

### Chat Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/chat` | Create/get chat | ✅ |
| GET | `/api/chat` | Get user chats | ✅ |
| GET | `/api/chat/:chatId` | Get messages | ✅ |
| POST | `/api/chat/:chatId/messages` | Send message | ✅ |
| PUT | `/api/chat/:chatId/read` | Mark as read | ✅ |

### Notification Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/notifications` | Get notifications | ✅ |
| PUT | `/api/notifications/:id/read` | Mark as read | ✅ |
| PUT | `/api/notifications/read-all` | Mark all as read | ✅ |
| DELETE | `/api/notifications/:id` | Delete notification | ✅ |

### Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `connection` | Server → Client | User connected |
| `disconnect` | Server → Client | User disconnected |
| `userOnline` | Server → Client | User came online |
| `userOffline` | Server → Client | User went offline |
| `joinChat` | Client → Server | Join chat room |
| `leaveChat` | Client → Server | Leave chat room |
| `sendMessage` | Client → Server | Send chat message |
| `newMessage` | Server → Client | Receive new message |
| `receiveMessage` | Server → Client | Message received |
| `typing` | Client → Server | User typing |
| `userTyping` | Server → Client | Show typing indicator |
| `markAsRead` | Client → Server | Mark messages as read |
| `messagesRead` | Server → Client | Messages marked as read |
| `newNotification` | Server → Client | New notification received |

---

## 🔄 How It Works - Complete Flow

### Visual Flow Diagram

```
┌─────────────────┐          ┌─────────────────┐          ┌─────────────────┐
│  DONOR (User A) │          │     SYSTEM      │          │ RECIPIENT (B)   │
└────────┬────────┘          └────────┬────────┘          └────────┬────────┘
         │                            │                            │
         │ 1. Create Listing          │                            │
         │──────────────────────────→ │                            │
         │                            │ • Save to MongoDB          │
         │                            │ • Status: "available"      │
         │                            │ • Generate coordinates     │
         │                            │                            │
         │                            │ ←────── 2. Browse Listings │
         │                            │                            │
         │                            │ • Query available listings │
         │                            │ • Filter by location       │
         │                            │ • Sort by distance         │
         │                            │                            │
         │                            │ ──────────────────────────→│
         │                            │   Show listings with map   │
         │                            │                            │
         │                            │ ←─── 3. Express Interest ──│
         │                            │   { userId, message }      │
         │                            │                            │
         │ ←────── 4. 🔔 Notification │                            │
         │    "User B is interested"  │                            │
         │    (Real-time via Socket)  │                            │
         │                            │                            │
         │                            │ ←──── 5. Contact (Chat) ───│
         │                            │   Create/Get chat room     │
         │                            │                            │
         │ ←──── 6. 💬 Chat Message ──┼─────────────────────────── │
         │    "Is this available?"    │   (Socket.IO real-time)    │
         │                            │                            │
         │ ─────── 💬 Reply ─────────→│ ───────────────────────→   │
         │    "Yes! Pickup at 5pm"    │                            │
         │                            │                            │
         │ 7. Assign Listing          │                            │
         │──────────────────────────→ │                            │
         │    { recipientId }         │                            │
         │                            │ • Update status: "pending" │
         │                            │ • Set assignedTo: User B   │
         │                            │                            │
         │                            │ ──────→ 8. 🔔 Notification │
         │                            │    "Assigned to you!"      │
         │                            │    (Real-time via Socket)  │
         │                            │                            │
         ├──────────────────────────────────────────────────────────┤
         │                  << PICKUP HAPPENS >>                     │
         │              (Users coordinate via chat)                  │
         ├──────────────────────────────────────────────────────────┤
         │                            │                            │
         │ 9. Mark Complete           │                            │
         │──────────────────────────→ │                            │
         │                            │ • Status: "completed"      │
         │                            │ • completedAt: timestamp   │
         │                            │                            │
         │                            │ ─────→ 10. 🔔 Notification │
         │                            │    "Please rate donor!"    │
         │                            │                            │
         │                            │ ←────── 11. Rate Donor ────│
         │                            │    { rating: 5, review }   │
         │                            │                            │
         │                            │ • Save rating              │
         │                            │ • Update avg rating        │
         │                            │                            │
         │ ←───── 12. 🔔 Notification │                            │
         │    "You got 5 stars! ⭐"   │                            │
         │                            │                            │
         ▼                            ▼                            ▼
```

### Key Components in Action

| Step | Technology | Description |
|------|------------|-------------|
| **1-2** | REST API | Listing creation & retrieval |
| **3** | MongoDB | Store interest in `interestedUsers` array |
| **4, 8, 10, 12** | Socket.IO | Real-time notifications |
| **5-6** | Socket.IO + MongoDB | Real-time chat with message persistence |
| **7** | REST API | Update listing status & assignment |
| **9** | REST API | Mark as completed, trigger rating flow |
| **11** | REST API | Store rating, update user profile |

### Notification Flow Detail

```
┌──────────────────────────────────────────────────────────────┐
│                    Notification System                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Event Triggered (Interest/Assignment/Completion)        │
│                          ↓                                   │
│  2. notificationHelper.onXXX(listing, user, io)            │
│                          ↓                                   │
│  3. Save to MongoDB (Notification Model)                    │
│                          ↓                                   │
│  4. Socket.IO: io.to(userId).emit('newNotification')       │
│                          ↓                                   │
│  5. Frontend: SocketContext receives event                  │
│                          ↓                                   │
│  6. Update notification badge + Show toast                  │
│                          ↓                                   │
│  7. Store in state for Notification Center                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 📸 Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)
*User dashboard with statistics, nearby listings map, and personal listings*

### Listings Page
![Listings](./screenshots/listings.png)
*Browse all available food donations with filters*

### Chat Interface
![Chat](./screenshots/chat.png)
*Real-time messaging between donors and recipients*

### Mobile Responsive
![Mobile](./screenshots/mobile.png)
*Fully responsive design for mobile devices*

---

## 🗺️ Roadmap

### ✅ Completed (v1.0)
- [x] User authentication & authorization
- [x] Listing CRUD operations
- [x] Real-time chat system
- [x] Notification system
- [x] Interactive map with geospatial search
- [x] Image upload & management
- [x] User profiles & ratings
- [x] AI chatbot assistant
- [x] Responsive design

### 🚧 In Progress (v1.1)
- [ ] Email notifications via SendGrid
- [ ] SMS notifications via Twilio
- [ ] Pickup scheduling with calendar integration
- [ ] Advanced search filters
- [ ] Listing expiry automation

### 🔮 Planned (v2.0)
- [ ] Mobile app (React Native)
- [ ] Push notifications (PWA)
- [ ] Multi-language support (i18n)
- [ ] Payment integration for donations
- [ ] Admin dashboard enhancements
- [ ] Impact analytics & reports
- [ ] Social media sharing
- [ ] QR code generation for listings
- [ ] Blockchain-based donation tracking
- [ ] AI-powered matching algorithm

---

## 🤝 Contributing

Contributions make the open-source community amazing! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features
- Test thoroughly before submitting PR

---

## 🐛 Known Issues

- [ ] Map markers cluster at coordinates [0,0] if geocoding fails
- [ ] Socket reconnection sometimes requires page refresh
- [ ] Image upload limited to 5MB per file
- [ ] Search radius limited to 100km

Report issues at: [GitHub Issues](https://github.com/hanuman2005/foodshare-platform/issues)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Hanumantha Madineni

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👨‍💻 Author

**Hanumantha Madineni**

- GitHub: [@hanuman2005](https://github.com/hanuman2005)
- Email: madenenihanumanturao@gmail.com
- LinkedIn: [Your LinkedIn](#)

---

## 🙏 Acknowledgments

- [React Documentation](https://reactjs.org/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [Cloudinary](https://cloudinary.com/)
- [Unsplash](https://unsplash.com/) for placeholder images
- All contributors who helped shape this project

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/hanuman2005/foodshare-platform?style=social)
![GitHub forks](https://img.shields.io/github/forks/hanuman2005/foodshare-platform?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/hanuman2005/foodshare-platform?style=social)

---

## 💡 Why FoodShare Matters

**The Problem:**
- 🗑️ 1.3 billion tons of food wasted globally every year
- 😢 820 million people go hungry daily
- 🌍 Food waste contributes 8% of global greenhouse gas emissions

**Our Solution:**
FoodShare connects those with surplus food to those in need, creating a circular economy that:
- ✅ Reduces food waste at the source
- ✅ Fights hunger in local communities
- ✅ Decreases environmental impact
- ✅ Builds stronger community bonds

**Impact to Date:**
- 📦 X listings created
- 🤝 Y donations completed
- 🌱 Z kg of food saved from waste

---

<div align="center">

**Made with ❤️ for a hunger-free, waste-free world**

[⬆ Back to Top](#-foodshare---community-food-donation-platform)

</div>