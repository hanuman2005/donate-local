# Page Review & Feature Analysis

## Home Page

- **Purpose:** Landing page for the platform.
- **Features:**
  - Hero section with stats and call-to-action buttons
  - Recent listings preview
  - Benefits, how it works, testimonials, and social proof sections
  - Footer
- **Test:** Ensure navigation, stats, and listing previews work. Check all sections render.

## Listings Page

- **Purpose:** Browse and filter all available listings.
- **Features:**
  - Listings grid/list view
  - Map integration for location-based browsing
  - Filters panel (category, location, etc.)
  - Pagination
  - Loading and empty states
- **Test:** Filtering, map, pagination, and navigation to details.

## Listing Details Page

- **Purpose:** View details of a specific listing.
- **Features:**
  - Listing info, images, status, and actions (claim, contact, report, etc.)
  - QR code, trust badges, AI match suggestions
  - Schedule/Report modals
- **Test:** All actions, modals, and info display correctly.

## Schedules Page

- **Purpose:** Manage all scheduled pickups.
- **Features:**
  - Grid/list view of schedules
  - Filter by status and role
  - Confirm, complete, cancel, and track pickups
  - Stats and loading/empty states
  - Tracking modal with live map
- **Test:** All actions, filters, and tracking modal.

## My Pickups Page

- **Purpose:** View user's pending pickups.
- **Features:**
  - List of assigned/pending pickups
  - QR code for each pickup
  - Loading and empty states
- **Test:** QR code toggling, navigation, and data loading.

## Notifications Page

- **Purpose:** Show user notifications.
- **Features:**
  - List of notifications (all/unread)
  - Real-time updates via socket
  - Mark as read, mark all as read
  - Loading and empty states
- **Test:** Real-time updates, mark as read, and filter.

## Profile Page

- **Purpose:** User profile management.
- **Features:**
  - View and edit profile info
  - Upload avatar, view badges, ratings, and history
  - Tabs for profile, badges, ratings, and history
  - Receipt modal for history items
- **Test:** Edit profile, upload avatar, view all tabs, and open receipts.

## Dashboard Page

- **Purpose:** User dashboard with stats and quick links.
- **Features:**
  - Stats (items analyzed/shared, CO2 saved, etc.)
  - Recent items
  - Quick links and export to CSV
  - Loading and empty states
- **Test:** Stats calculation, recent items, and export.

---

**Testing Checklist:**

- [ ] Navigation between all pages
- [ ] All actions and buttons work as expected
- [ ] Modals open/close and function correctly
- [ ] Real-time features (notifications, tracking) update as expected
- [ ] Loading and empty states display properly
- [ ] Data is fetched and rendered correctly

Add more pages or features as needed for your review.
