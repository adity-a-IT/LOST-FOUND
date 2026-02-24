# Chandigarh University Lost & Found System

A complete web application system for managing lost and found items on campus with role-based access control (Student & Admin).

## ⚡ Quick Start

### Prerequisites
- Node.js installed (https://nodejs.org/)
- Any terminal (PowerShell, CMD, Bash, etc.)

### Setup (3 steps)

**Step 1: Install dependencies**
```
npm install
```

**Step 2: Start backend server (Terminal 1)**
```
npm start
```
✅ Server will start on http://localhost:5000

**Step 3: Start frontend server (Terminal 2)**
```
npx http-server -p 8000
```
✅ Open http://localhost:8000 in your browser

### Login Credentials
- Student: Any email + Any password
- Admin: Any email + Any password

## Features

### 1. **Item Submission Form**
- Separate forms for reporting lost and found items
- Required fields: item name, category, description, location, date, contact info
- Optional image upload with preview functionality
- Real-time form validation with visual feedback
- Clear and Submit buttons

### 2. **Search & Filter Functionality**
- Prominent search bar for keyword searching
- Multi-filter system:
  - **Status Filter**: Lost, Found, or All items
  - **Category Filter**: Electronics, Books, Clothing, Personal, Sports, Other
  - **Location Filter**: Search by location name
  - **Date Range Filter**: Last 7, 30, or 90 days, or any time
- Results displayed as attractive item cards
- Real-time filtering with result count
- Clear filters button

### 3. **Intelligent Matching System**
- Automatically suggests matches when new items are posted
- Matching algorithm considers:
  - Category match (40% weight)
  - Location proximity (35% weight)
  - Keyword matching (25% weight)
- Displays top 3 matches with "Suggested Match" badge
- Helps connect lost and found items quickly

### 4. **Admin Dashboard**
- Dashboard statistics showing:
  - Total items count
  - Lost items count
  - Found items count
  - Resolved items count
- Complete item management table with:
  - Item ID, name, category, status, location, date
  - Edit functionality (modify item details and status)
  - Mark as resolved option
  - Delete duplicate items
- Status toggle: Active, Resolved, Archived
- Download report functionality (JSON format)

### 5. **Responsive Design**
- **Mobile-first CSS approach** using Flexbox and CSS Grid
- **Navigation**:
  - Collapsible hamburger menu for mobile devices
  - Sticky navigation bar
  - Quick navigation links: Home, Report Lost, Report Found, Search Items, Admin Dashboard
  
- **Responsive Breakpoints**:
  - Desktop (1200px+): Full layout
  - Tablet (640px - 768px): Optimized grid and forms
  - Mobile (<640px): Single column, hamburger menu

### 6. **Additional Features**
- **Recently Added Section**: Homepage displays 6 most recent items
- **Status Badges**: 
  - Lost (red) - for lost items
  - Found (green) - for found items
  - Matched (blue) - for suggested matches
  - Resolved (purple) - for completed cases
- **Notification System**: Toast-like notifications for user actions
- **Item Cards**: Display with image placeholder, description, metadata
- **Category Icons**: Visual emoji icons for each category
- **Contact Information**: Direct contact details on each item card

## Project Structure

```
L&F/
├── index.html           # Main HTML file with all components
├── css/
│   └── styles.css       # Responsive styling with mobile-first approach
├── js/
│   └── script.js        # All functionality and logic
├── assets/              # Folder for images and resources
└── README.md           # This file
```

## File Breakdown

### index.html
- Navigation bar with brand and menu
- Notification banner system
- 5 main pages (Home, Report Lost, Report Found, Search, Admin)
- Edit modal for admin functions
- Footer with contact information

### css/styles.css
- CSS variables for theming (colors, spacing, shadows)
- Base responsive styles
- Component-specific styling (navbar, forms, cards, tables)
- Mobile breakpoints at 768px and 640px
- Print-friendly styles
- Animations and transitions

### js/script.js
- Data management and item storage
- Page navigation system
- Form validation and submission
- Image preview handling
- Intelligent matching algorithm
- Search and filtering logic
- Admin dashboard functionality
- Notification system
- Utility functions for sharing and emoji management

## University Branding

The website includes:
- Professional color scheme (university blue as primary)
- Clean, modern interface
- Category icons with emoji
- University-themed messaging
- Contact information placeholder

## Color Scheme

- **Primary**: #1e40af (University Blue)
- **Success**: #10b981 (Green for "Found")
- **Danger**: #ef4444 (Red for "Lost")
- **Secondary**: #64748b (Gray)
- **Background**: #f8fafc (Light)

## Getting Started

1. Open `index.html` in a web browser
2. Use the navigation menu to explore features
3. Submit lost or found items using the forms
4. Search and filter items using the search page
5. Access the admin dashboard for item management

## Sample Data

The application comes pre-loaded with 6 sample items to demonstrate functionality:
- Blue Backpack (Lost)
- Red Wallet (Found)
- Apple MacBook Air (Lost)
- Physics Textbook (Found)
- Black AirPods (Lost)
- Gray Jacket (Found)

## Browser Compatibility

- Chrome/Edge (v90+)
- Firefox (v88+)
- Safari (v14+)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Features to Enhance (Future Improvements)

- Backend integration for persistent data storage
- User accounts and authentication
- Email notifications
- SMS alerts for matches
- Google Maps integration for location
- Advanced image recognition for matching
- Social sharing integration
- QR codes for items
- User reviews and reputation system
- Mobile app version
- Dark mode theme

## Notes

- All data is stored in browser memory (localStorage could be added)
- Image uploads are previewed but not persisted
- Contact information is displayed directly on items
- Admin features are frontend-only (no authentication)
- Matching algorithm uses keyword and location proximity

---

**Created**: February 2026
**University Lost & Found Team**
