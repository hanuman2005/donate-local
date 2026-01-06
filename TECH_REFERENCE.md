# 🛠️ LifeLoop Technical Reference

> Complete file-by-file breakdown of tools, algorithms, and how each component works

---

## Table of Contents

1. [Backend Files](#backend-files)
2. [Frontend Files](#frontend-files)
3. [Algorithms Used](#algorithms-used)
4. [External APIs & Services](#external-apis--services)
5. [Security Mechanisms](#security-mechanisms)

---

## Backend Files

### 📁 server.js

**Purpose:** Main entry point - boots the entire backend

| Tool/Library  | Usage                                   |
| ------------- | --------------------------------------- |
| `express`     | Web framework for REST API              |
| `mongoose`    | MongoDB ODM for database operations     |
| `socket.io`   | WebSocket server for real-time features |
| `cors`        | Cross-origin resource sharing           |
| `helmet`      | Security headers                        |
| `compression` | Gzip response compression               |
| `morgan`      | HTTP request logging                    |

**How it works:**

1. Loads environment variables from `.env`
2. Creates Express app with middleware stack
3. Mounts all route handlers (`/api/auth`, `/api/listings`, etc.)
4. Connects to MongoDB Atlas
5. Starts HTTP server with Socket.IO attached

---

### 📁 config/db.js

**Purpose:** MongoDB connection with retry logic

| Tool       | Usage           |
| ---------- | --------------- |
| `mongoose` | ODM for MongoDB |

**How it works:**

```
1. Read MONGO_URI from environment
2. Attempt connection with 5s timeout
3. If failed, retry up to 5 times with exponential backoff
4. Log connection success/failure
```

---

### 📁 config/cloudinary.js

**Purpose:** Cloud image storage configuration

| Tool         | Usage                 |
| ------------ | --------------------- |
| `cloudinary` | CDN for image uploads |

**How it works:**

- Configures Cloudinary SDK with API credentials
- Used by `multer-storage-cloudinary` for automatic uploads
- Images auto-optimized and served via CDN

---

### 📁 middleware/auth.js

**Purpose:** JWT authentication middleware

| Tool           | Usage                  |
| -------------- | ---------------------- |
| `jsonwebtoken` | JWT token verification |

**Algorithm:**

```
1. Extract token from Authorization header (Bearer <token>)
2. Verify token signature using JWT_SECRET
3. Decode payload to get userId
4. Fetch user from database
5. Attach user object to req.user
6. Call next() or return 401 Unauthorized
```

---

### 📁 middleware/upload.js

**Purpose:** File upload handling

| Tool                        | Usage                       |
| --------------------------- | --------------------------- |
| `multer`                    | Multipart form data parsing |
| `multer-storage-cloudinary` | Direct upload to Cloudinary |

**How it works:**

1. Multer intercepts multipart requests
2. Files uploaded directly to Cloudinary (no local storage)
3. Returns Cloudinary URL in `req.file.path`

---

### 📁 middleware/errorHandler.js

**Purpose:** Centralized error handling

**How it works:**

```javascript
// Catches all errors thrown in route handlers
// Returns consistent error response format:
{
  success: false,
  message: "Error description",
  stack: "..." // Only in development
}
```

---

### 📁 controllers/authController.js

**Purpose:** User registration, login, password reset

| Tool           | Usage                             |
| -------------- | --------------------------------- |
| `bcrypt`       | Password hashing (10 salt rounds) |
| `jsonwebtoken` | Token generation                  |
| `crypto`       | Random token for password reset   |

**Algorithms:**

**Password Hashing (bcrypt):**

```
1. Generate random salt (10 rounds)
2. Hash: password + salt → hash
3. Store hash in database
4. Login: bcrypt.compare(input, storedHash)
```

**JWT Generation:**

```javascript
jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
```

---

### 📁 controllers/listingController.js

**Purpose:** CRUD operations for item listings

| Tool               | Usage             |
| ------------------ | ----------------- |
| `mongoose`         | Database queries  |
| MongoDB `$geoNear` | Geospatial search |

**Key Algorithm - Geospatial Search:**

```javascript
// Find listings near user location
Listing.aggregate([
  {
    $geoNear: {
      near: { type: "Point", coordinates: [lng, lat] },
      distanceField: "distance",
      maxDistance: radius * 1000, // meters
      spherical: true,
      query: { status: "available" },
    },
  },
  { $sort: { distance: 1 } },
]);
```

**Queue Management Algorithm:**

```
1. User expresses interest → Added to queue with timestamp
2. Queue position = array index + 1
3. When donor accepts → assignedTo = first in queue
4. If no response in 24h → Auto-reassign to next
5. Atomic operations prevent race conditions
```

---

### 📁 controllers/chatController.js

**Purpose:** Chat room and message management

| Tool        | Usage              |
| ----------- | ------------------ |
| `mongoose`  | Message storage    |
| `socket.io` | Real-time delivery |

**How it works:**

1. Create chat between donor & recipient for a listing
2. Messages saved to MongoDB with timestamps
3. Socket.IO emits `newMessage` to room participants
4. Unread count tracked per participant

---

### 📁 controllers/qrController.js

**Purpose:** QR code generation and verification

| Tool     | Usage                         |
| -------- | ----------------------------- |
| `qrcode` | Generate QR code images       |
| `crypto` | SHA-256 hash for verification |

**Algorithm - QR Verification:**

```
1. Generate:
   - Create unique transaction ID
   - Hash = SHA256(transactionId + secret + timestamp)
   - QR contains: { transactionId, hash, expiresAt }

2. Verify:
   - Scan QR → Extract data
   - Recompute hash with same inputs
   - If hash matches AND not expired → Valid
   - Update transaction status to 'completed'
```

---

### 📁 controllers/scheduleController.js

**Purpose:** Pickup scheduling system

| Tool        | Usage            |
| ----------- | ---------------- |
| `mongoose`  | Schedule storage |
| `node-cron` | Reminder jobs    |

**How it works:**

1. Donor proposes time slots
2. Recipient selects preferred slot
3. Both parties confirm
4. System sends reminders at: 24h, 2h, 30min before
5. Auto-cancel if no confirmation

---

### 📁 controllers/impactController.js

**Purpose:** Environmental impact calculations

**Algorithms:**

**CO₂ Savings Formula:**

```javascript
// Based on item category and weight
const CO2_FACTORS = {
  food: 2.5, // kg CO₂ per kg food
  clothing: 20, // kg CO₂ per kg textile
  electronics: 50, // kg CO₂ per kg e-waste
  furniture: 5, // kg CO₂ per kg wood/metal
};

co2Saved = weight * CO2_FACTORS[category];
```

**Eco Score Calculation:**

```javascript
ecoScore =
  donationCount * 10 + co2Saved * 0.5 + rating * 5 + badges.length * 20;
```

---

### 📁 controllers/aiController.js

**Purpose:** AI-powered upcycling suggestions

| Tool                    | Usage             |
| ----------------------- | ----------------- |
| `@google/generative-ai` | Google Gemini API |

**How it works:**

```
1. Receive item details (type, condition, materials)
2. Build prompt with context
3. Call Gemini API for creative ideas
4. Parse response into structured format
5. Cache results to reduce API calls
```

---

### 📁 controllers/wasteAnalysisController.js

**Purpose:** Store waste analysis results

| Tool       | Usage                  |
| ---------- | ---------------------- |
| `mongoose` | Store analysis history |

**Note:** AI analysis happens client-side (TensorFlow.js). This controller only stores results.

---

### 📁 services/routeOptimizer.js

**Purpose:** Optimize pickup routes for recipients

**Algorithms Used:**

**1. K-Means++ Clustering:**

```
Purpose: Group nearby pickups into clusters
Algorithm:
1. Select first centroid randomly
2. For each remaining point:
   - Calculate distance to nearest centroid
   - Probability of selection = distance²
   - Select next centroid weighted by probability
3. Assign points to nearest centroid
4. Recalculate centroids as cluster means
5. Repeat until convergence
```

**2. TSP with 2-Opt (Traveling Salesman):**

```
Purpose: Find shortest route visiting all points in cluster
Algorithm:
1. Build initial route using Nearest Neighbor
2. For each pair of edges (i,j):
   - Try reversing segment between them
   - If shorter, keep the change
3. Repeat until no improvement

Improvement: 2-opt swap
Before: A-B-C-D-E-F
After:  A-B-E-D-C-F (reversed C-D-E)
```

**3. Haversine Distance:**

```javascript
// Calculate distance between two lat/lng points
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a = Math.sin(dLat/2)² +
            Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLng/2)²;

  const c = 2 * Math.atan2(√a, √(1-a));
  return R * c; // Distance in km
}
```

---

### 📁 services/rateLimiter.js

**Purpose:** Prevent API abuse

| Tool                 | Usage              |
| -------------------- | ------------------ |
| `express-rate-limit` | Request throttling |

**Configuration:**

```javascript
{
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true
}
```

---

### 📁 socket/socketHandler.js

**Purpose:** Real-time event handling

| Tool        | Usage            |
| ----------- | ---------------- |
| `socket.io` | WebSocket server |

**Events Handled:**
| Event | Purpose |
|-------|---------|
| `join_room` | Join chat room |
| `send_message` | Send chat message |
| `typing` | Show typing indicator |
| `notification` | Push notification |
| `location_update` | Driver tracking |

**Room Pattern:**

```javascript
// Each chat has unique room
socket.join(`chat_${chatId}`);

// Broadcast to room only
io.to(`chat_${chatId}`).emit("newMessage", data);
```

---

### 📁 utils/scheduleCron.js

**Purpose:** Scheduled background tasks

| Tool        | Usage               |
| ----------- | ------------------- |
| `node-cron` | Cron job scheduling |

**Jobs:**
| Schedule | Task |
|----------|------|
| `*/5 * * * *` | Check expired queue assignments |
| `0 8 * * *` | Send daily pickup reminders |
| `0 0 * * *` | Calculate daily impact stats |

---

### 📁 utils/impactCalculations.js

**Purpose:** Environmental impact formulas

**Formulas:**

```javascript
// Water saved (liters)
waterSaved = weight * WATER_FACTORS[category];

// Trees equivalent
treesEquivalent = co2Saved / 21; // 1 tree = 21kg CO₂/year

// Landfill diverted (kg)
landfillDiverted = weight;

// Community impact multiplier
communityMultiplier = 1 + (localDonations / 100) * 0.5;
```

---

## Frontend Files

### 📁 src/App.js

**Purpose:** Root component with routing

| Tool               | Usage               |
| ------------------ | ------------------- |
| `react-router-dom` | Client-side routing |
| `framer-motion`    | Page transitions    |

---

### 📁 src/context/AuthContext.js

**Purpose:** Global authentication state

| Pattern                 | Usage                     |
| ----------------------- | ------------------------- |
| React Context           | Share auth state globally |
| Custom Hook (`useAuth`) | Access auth anywhere      |

**How it works:**

```
1. On app load, check localStorage for token
2. If token exists, verify with /api/auth/me
3. Store user object in context
4. Provide login, logout, register functions
5. All components access via useAuth() hook
```

---

### 📁 src/context/SocketContext.js

**Purpose:** WebSocket connection management

| Tool               | Usage            |
| ------------------ | ---------------- |
| `socket.io-client` | WebSocket client |

**How it works:**

```
1. Connect when user logs in
2. Pass JWT token for authentication
3. Auto-reconnect on disconnect
4. Expose socket instance via useSocket()
5. Disconnect on logout
```

---

### 📁 src/components/AI/WasteAnalyzer/index.js

**Purpose:** AI-powered waste classification

| Tool                           | Usage                |
| ------------------------------ | -------------------- |
| `@tensorflow/tfjs`             | ML runtime           |
| `@tensorflow-models/mobilenet` | Image classification |
| `@tensorflow-models/coco-ssd`  | Object detection     |

**Algorithm - Multi-Image Analysis:**

```
1. Load pre-trained MobileNet model (once)
2. For each uploaded image:
   a. Resize to 224x224
   b. Normalize pixel values
   c. Run inference → Get predictions
3. Aggregate predictions across all images
4. Weight by confidence score
5. Match to material database
6. Return: category, recyclable, disposal method
```

**Confidence Aggregation:**

```javascript
// Average confidence across multiple images
predictions.forEach((pred) => {
  aggregated[className].sum += probability;
  aggregated[className].count += 1;
});

finalConfidence = sum / count;
```

---

### 📁 src/components/AI/WasteAnalyzer/wasteClassifier.js

**Purpose:** Material classification logic

**Algorithm:**

```
1. Get TensorFlow prediction (e.g., "plastic bottle")
2. Look up in MATERIAL_DATABASE:
   {
     "plastic bottle": {
       material: "PET Plastic",
       recyclable: true,
       disposalMethod: "Rinse and recycle",
       co2Impact: 1.5
     }
   }
3. If no exact match, use fuzzy matching
4. Return disposal recommendations
```

---

### 📁 src/services/api.js

**Purpose:** Centralized HTTP client

| Tool    | Usage         |
| ------- | ------------- |
| `axios` | HTTP requests |

**Features:**

- Base URL configuration
- JWT token injection via interceptor
- Response error handling
- Request/response logging (dev mode)

```javascript
// Interceptor adds auth header
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

### 📁 src/pages/RouteOptimizer/index.js

**Purpose:** Visual route optimization interface

| Tool            | Usage            |
| --------------- | ---------------- |
| `leaflet`       | Interactive maps |
| `react-leaflet` | React wrapper    |

**How it works:**

1. Fetch user's assigned pickups
2. Display on map with markers
3. Call `/api/routes/optimize` endpoint
4. Draw optimized route polyline
5. Show distance saved, CO₂ reduced

---

### 📁 src/pages/Chat/index.js

**Purpose:** Real-time messaging interface

| Tool               | Usage              |
| ------------------ | ------------------ |
| `socket.io-client` | Real-time updates  |
| `framer-motion`    | Message animations |

**Real-time Flow:**

```
1. Join room: socket.emit('join_room', chatId)
2. Listen: socket.on('newMessage', handler)
3. Send: socket.emit('send_message', { chatId, text })
4. Server broadcasts to room
5. All participants receive instantly
```

---

### 📁 src/theme/theme.js

**Purpose:** Centralized design tokens

**Contains:**

- Color palette (light/dark)
- Typography scale
- Spacing system
- Border radius values
- Shadow definitions
- Transition timings

---

### 📁 src/globalStyles.js

**Purpose:** CSS custom properties

**Defines:**

```css
:root {
  --primary: #234c6a;
  --bg-primary: #ffffff;
  --spacing-md: 12px;
  /* 50+ design tokens */
}

[data-theme="dark"] {
  --bg-primary: #0f172a;
  /* Dark mode overrides */
}
```

---

### 📁 src/animations/motionVariants.js

**Purpose:** Reusable animation presets

| Tool            | Usage             |
| --------------- | ----------------- |
| `framer-motion` | Animation library |

**Animation Types:**

- `fadeIn` - Opacity 0 → 1
- `slideUp` - Y offset with fade
- `staggerChildren` - Sequential child animations
- `spring` - Physics-based motion
- `pageTransition` - Route change animations

---

## Algorithms Used

### 1. **Haversine Formula** (Distance Calculation)

```
Used in: Route optimization, nearby listings
Purpose: Calculate distance between two GPS coordinates
Accuracy: ~0.5% error (accounts for Earth's curvature)
```

### 2. **K-Means++ Clustering**

```
Used in: Route optimizer
Purpose: Group nearby pickups for efficient routing
Complexity: O(n * k * iterations)
```

### 3. **TSP with 2-Opt**

```
Used in: Route optimizer
Purpose: Find shortest route through points
Improvement: 20-40% over random routes
```

### 4. **Bcrypt Hashing**

```
Used in: Password storage
Rounds: 10 (2^10 iterations)
Purpose: One-way password hashing
```

### 5. **SHA-256 Hashing**

```
Used in: QR verification
Purpose: Tamper-proof verification codes
```

### 6. **JWT Token Signing**

```
Used in: Authentication
Algorithm: HS256 (HMAC-SHA256)
Expiry: 7 days
```

### 7. **MobileNet CNN**

```
Used in: Waste classification
Architecture: Depthwise separable convolutions
Parameters: 4.2M
Input: 224×224×3 images
Output: 1000 ImageNet classes
```

### 8. **Weighted Average Aggregation**

```
Used in: Multi-image analysis
Purpose: Combine predictions from multiple images
Method: confidence-weighted average
```

### 9. **MongoDB 2dsphere Index**

```
Used in: Geospatial queries
Type: Spherical geometry
Supports: $geoNear, $geoWithin, $near
```

---

## External APIs & Services

| Service           | Purpose               | Endpoint/SDK            |
| ----------------- | --------------------- | ----------------------- |
| **MongoDB Atlas** | Cloud database        | `mongoose.connect()`    |
| **Cloudinary**    | Image CDN             | `cloudinary` npm        |
| **Google Gemini** | AI upcycling ideas    | `@google/generative-ai` |
| **OpenAI**        | Chatbot responses     | `openai` npm            |
| **Twilio**        | SMS notifications     | `twilio` npm            |
| **Nodemailer**    | Email service         | SMTP via Gmail          |
| **Mapbox**        | Map tiles & geocoding | REST API                |

---

## Security Mechanisms

| Mechanism            | Tool                 | Purpose                     |
| -------------------- | -------------------- | --------------------------- |
| Password Hashing     | `bcrypt`             | Never store plain passwords |
| JWT Authentication   | `jsonwebtoken`       | Stateless auth tokens       |
| HTTPS                | SSL/TLS              | Encrypt data in transit     |
| Helmet               | `helmet`             | Security headers            |
| Rate Limiting        | `express-rate-limit` | Prevent brute force         |
| Input Validation     | `express-validator`  | Prevent injection           |
| CORS                 | `cors`               | Control cross-origin access |
| QR Hash Verification | `crypto`             | Tamper-proof transactions   |

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│                    LIFELOOP TECH STACK                       │
├─────────────────────────────────────────────────────────────┤
│ FRONTEND          │ BACKEND           │ DATABASE            │
│ • React 19        │ • Node.js 18+     │ • MongoDB Atlas     │
│ • TensorFlow.js   │ • Express.js      │ • 2dsphere indexes  │
│ • Socket.IO       │ • Socket.IO       │ • Mongoose ODM      │
│ • Styled Comp.    │ • JWT + bcrypt    │                     │
│ • Framer Motion   │ • Cloudinary      │                     │
│ • Leaflet Maps    │ • Google Gemini   │                     │
├─────────────────────────────────────────────────────────────┤
│ KEY ALGORITHMS                                               │
│ • K-Means++ (clustering)    • TSP 2-Opt (routing)          │
│ • Haversine (distance)      • MobileNet (classification)   │
│ • bcrypt (hashing)          • SHA-256 (verification)       │
└─────────────────────────────────────────────────────────────┘
```

---

_Last updated: January 2026_
