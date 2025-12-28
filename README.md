# LifeLoop

> Give what you don't want and take what you want

A real-time MERN platform connecting local communities to share items — reducing waste and helping those in need through technology.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19+-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v5+-green)](https://www.mongodb.com/)

[Live Demo](#) | [Report Bug](#) | [Request Feature](#)

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Documentation](#-documentation)
- [Screenshots](#-screenshots)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About

ShareTogether is a community-driven platform that enables users to donate items they no longer need and find items they want. Whether it's food, clothing, furniture, electronics, books, toys, or any other items, ShareTogether connects neighbors to reduce waste and build stronger communities.

### The Problem

- 🗑️ Billions of items wasted globally every year
- 😢 Many people in need of basic items
- 🌍 Waste contributes significantly to environmental issues

---

## ✨ Features

### 🎯 Core Functionality

LifeLoop is a community-driven platform that enables users to donate items they no longer need and find items they want. Whether it's food, clothing, furniture, electronics, books, toys, or any other items, LifeLoop connects neighbors to reduce waste and build stronger communities.

- **📝 Universal Item Donations**

  - Create listings for any type of item (food, clothing, furniture, electronics, books, toys, etc.)

- **📍 Location-Aware Discovery**

LifeLoop creates a circular economy that:

- Interactive map view with marker clustering

- Typing indicators and read receipts
- Chat history persistence
- Message notifications

- **🔔 Smart Notifications**

  - Real-time push notifications via WebSocket
  - Interest expressed notifications
  - Listing assignment alerts
  - Completion reminders
  - Toast notifications for instant feedback

- **📱 QR Code Verification**
  - Generate unique QR codes for transactions
  - Secure hash-based verification
  - Camera scanning functionality
  - User statistics dashboard

### 🔐 Security & Authentication

- JWT-based authentication with 30-day expiry
- Bcrypt password hashing (10 rounds)
- Protected routes with middleware
- Role-based access control (Donor, Recipient, Both)
- CORS protection
- Input validation using express-validator

---

## 🛠️ Tech Stack

### Frontend

| Technology            | Purpose                       |
| --------------------- | ----------------------------- |
| **React 19**          | UI framework with hooks       |
| **React Router v7**   | Client-side routing           |
| **Styled Components** | Component styling             |
| **Axios**             | HTTP client with interceptors |
| **Socket.IO Client**  | Real-time communication       |
| **React Toastify**    | Notifications                 |
| **Leaflet**           | Interactive maps              |
| **QRCode.react**      | QR code generation            |
| **ZXing WASM**        | QR code scanning              |

### Backend

| Technology     | Purpose                    |
| -------------- | -------------------------- |
| **Node.js**    | Runtime environment        |
| **Express.js** | Web framework              |
| **MongoDB**    | NoSQL database             |
| **Mongoose**   | ODM with schema validation |
| **Socket.IO**  | WebSocket server           |
| **JWT**        | Authentication tokens      |
| **Bcrypt**     | Password hashing           |
| **Cloudinary** | Image storage & CDN        |
| **Multer**     | File upload handling       |

### DevOps & Tools

| Technology      | Purpose                 |
| --------------- | ----------------------- |
| **Nodemon**     | Auto-restart dev server |
| **Dotenv**      | Environment variables   |
| **Compression** | Response compression    |
| **Helmet**      | Security headers        |
| **Morgan**      | HTTP logging            |

---

## 📁 Project Structure

```
sharetogether/
├── backend/
│   ├── config/              # Database & Cloudinary setup
│   ├── controllers/         # Business logic
│   ├── middleware/          # Auth, upload, error handling
│   ├── models/              # Database schemas
│   ├── routes/               # API routes
│   ├── socket/               # Socket.IO handlers
│   ├── utils/                # Helper functions
│   ├── server.js             # Entry point
│   └── package.json
│
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── context/         # State management
│   │   ├── services/        # API services
│   │   ├── styles/          # Global styles
│   │   ├── utils/            # Utility functions
│   │   ├── App.js            # Root component
│   │   └── index.js          # Entry point
│   └── package.json
│
└── README.md                 # This file
```

---

## 🚀 Getting Started

### Prerequisites

```bash
Node.js >= 18.0.0
npm >= 9.0.0
MongoDB >= 5.0.0
```

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/hanuman2005/donate-local.git
cd donate-local
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

**Backend** (`backend/.env`):

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/sharetogether
# Or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/sharetogether

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000
```

**Frontend** (`frontend/.env`):

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

5. **Start Development Servers**

**Backend** (Terminal 1):

```bash
cd backend
npm run dev
```

**Frontend** (Terminal 2):

```bash
cd frontend
npm start
```

6. **Access the Application**

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- API Health Check: http://localhost:5000

---

## 📚 Documentation

- [Backend Documentation](./backend/BACKEND_README.md) - Complete backend API documentation
- [Frontend Documentation](./frontend/FRONTEND_README.md) - Frontend component and page documentation

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint             | Description       | Auth Required |
| ------ | -------------------- | ----------------- | ------------- |
| POST   | `/api/auth/register` | Register new user | ❌            |
| POST   | `/api/auth/login`    | User login        | ❌            |
| GET    | `/api/auth/me`       | Get current user  | ✅            |
| PUT    | `/api/auth/profile`  | Update profile    | ✅            |

### Listing Endpoints

| Method | Endpoint               | Description         | Auth Required |
| ------ | ---------------------- | ------------------- | ------------- |
| GET    | `/api/listings`        | Get all listings    | ❌            |
| GET    | `/api/listings/nearby` | Get nearby listings | ❌            |
| POST   | `/api/listings`        | Create listing      | ✅            |
| PUT    | `/api/listings/:id`    | Update listing      | ✅            |
| DELETE | `/api/listings/:id`    | Delete listing      | ✅            |

### QR Code Endpoints

| Method | Endpoint                  | Description      | Auth Required |
| ------ | ------------------------- | ---------------- | ------------- |
| POST   | `/api/qr/generate`        | Generate QR code | ✅            |
| POST   | `/api/qr/verify`          | Verify QR code   | ✅            |
| GET    | `/api/qr/my-transactions` | Get transactions | ✅            |

### Impact Endpoints

| Method | Endpoint                | Description     | Auth Required |
| ------ | ----------------------- | --------------- | ------------- |
| GET    | `/api/impact/personal`  | Personal impact | ✅            |
| GET    | `/api/impact/community` | Community stats | ❌            |

For complete API documentation, see [Backend README](./backend/BACKEND_README.md)

---

## 📸 Screenshots

### Dashboard

![Dashboard](./screenshots/dashboard.png)
_User dashboard with statistics, nearby listings map, and personal listings_

### Listings Page

![Listings](./screenshots/listings.png)
_Browse all available donations with filters_

### Chat Interface

![Chat](./screenshots/chat.png)
_Real-time messaging between donors and recipients_

### Mobile Responsive

![Mobile](./screenshots/mobile.png)
_Fully responsive design for mobile devices_

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
- [x] QR code verification
- [x] Impact tracking system
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

Report issues at: [GitHub Issues](https://github.com/hanuman2005/donate-local/issues)

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
- [Leaflet](https://leafletjs.com/)
- All contributors who helped shape this project

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/hanuman2005/donate-local?style=social)
![GitHub forks](https://img.shields.io/github/forks/hanuman2005/donate-local?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/hanuman2005/donate-local?style=social)

---

## 💡 Why ShareTogether Matters

**The Problem:**

- 🗑️ Billions of items wasted globally every year
- 😢 Many people in need of basic items
- 🌍 Waste contributes significantly to environmental issues

**Our Solution:**
ShareTogether connects those with items to donate to those in need, creating a circular economy that:

- ✅ Reduces waste at the source
- ✅ Helps those in need in local communities
- ✅ Decreases environmental impact
- ✅ Builds stronger community bonds

**Impact to Date:**

- 📦 X listings created
- 🤝 Y donations completed
- 🌱 Z items saved from waste

---

<div align="center">

**Made with ❤️ for a waste-free, sustainable world**

[⬆ Back to Top](#sharetogether)

</div>

---

---

## 🧪 END-TO-END TESTING INSTRUCTIONS

To verify the full user flow (from registration/login to item pickup, ratings, analytics, and admin):

1. **Register/Login**: Create a new user or login as donor/recipient/admin.
2. **Analyze Item**: Use the AI Waste Analyzer (frontend) to analyze an item (multi-image supported).
3. **Create Listing**: One-click create a donation listing from analysis results.
4. **Browse Listings**: View and search for listings (advanced search, geospatial, category filters).
5. **Express Interest**: As a recipient, express interest in a listing.
6. **Chat**: Use real-time chat to communicate between donor and recipient.
7. **Assign & Schedule**: Donor assigns recipient, proposes pickup schedule (calendar integration).
8. **Notifications**: Receive real-time notifications for all actions (interest, assignment, schedule, etc.).
9. **Pickup & QR Verification**: Complete pickup using QR code system (scan and verify).
10. **Rate & Review**: After pickup, rate and review the other party.
11. **Impact & Analytics**: View personal and community impact dashboards, export analytics.
12. **Admin Dashboard**: (If admin) Access platform analytics, user management, and export tools.

All features are accessible via the sidebar and dashboard. Protected routes require authentication.

---

**Last Updated**: December 2025  
**Version**: 2.0.0  
**Status**: ✅ PRODUCTION READY
