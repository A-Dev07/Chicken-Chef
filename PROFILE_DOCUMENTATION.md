# User Profile Page - Complete Implementation

## Overview
A comprehensive user profile dashboard with multiple tabs for managing user information, orders, addresses, and favorites.

## Features Implemented

### 1. **Profile Dashboard Layout**
- Sidebar with user information (profile picture, name, email, phone)
- Tab-based navigation for different sections
- Clean card-based design
- Responsive layout (desktop and mobile friendly)
- Easy to convert to HTML/CSS/PHP

### 2. **Order History Tab** ✅
- **Display Format**: Card-based list layout
- **Information Shown**:
  - Order ID (e.g., #ORD001)
  - Order items with images (shows up to 3 items + count)
  - Order date and time (formatted for India)
  - Total amount in ₹ (Indian Rupees)
  - Status indicator with color coding and icons:
    - 🟡 Pending (Yellow)
    - 🔵 Confirmed/Preparing (Blue)
    - 🟣 Out for Delivery (Purple)
    - 🟢 Delivered (Green)
    - 🔴 Cancelled (Red)

- **Order Detail Modal**:
  - Click any order to view full details
  - Shows all items with quantities
  - Complete price breakdown (subtotal, delivery, tax, total)
  - Delivery address
  - Status timeline

### 3. **Saved Addresses Tab** ✅
- **Display Format**: Grid layout with cards
- **Features**:
  - Add new address button (prominent)
  - Edit existing addresses
  - Delete addresses (with confirmation)
  - Set default address (marked with ⭐ badge)
  - Default addresses highlighted with purple border

- **Address Information**:
  - Label (Home, Office, Hostel, etc.)
  - Full address
  - City, State, Pincode
  - Phone number

- **Add/Edit Address Modal**:
  - Clean form with validation
  - Fields: Label, Full Address, City, State, Pincode, Phone
  - Checkbox to set as default
  - Cancel and Save buttons

### 4. **Favorites Tab** ✅
- Shows all favorite food items
- Grid layout with food cards
- Click to view recipe and ingredients
- Empty state when no favorites

### 5. **Settings Tab** ✅
- **Personal Information Section**:
  - Edit profile (name, email, phone)
  - View/Edit mode toggle
  - Icon-enhanced input fields

- **Preferences Section**:
  - Email notifications toggle
  - SMS notifications toggle
  - Promotional offers toggle
  - Modern toggle switches

## Technical Implementation

### Context & State Management
```typescript
UserContext.tsx - Manages:
- User profile data
- Addresses (add, update, delete, set default)
- Order history
- Favorites
```

### Components Created

1. **ProfilePage.tsx** - Main profile dashboard with tab navigation
2. **OrderHistoryTab.tsx** - Displays order history list
3. **OrderDetailModal.tsx** - Shows detailed order information
4. **AddressesTab.tsx** - Manages saved addresses
5. **AddressFormModal.tsx** - Form for adding/editing addresses
6. **FavoritesTab.tsx** - Shows favorite food items
7. **SettingsTab.tsx** - User settings and preferences

### Design Patterns Used
- ✅ Card-based layouts for better organization
- ✅ Modal dialogs for detailed views
- ✅ Color-coded status indicators
- ✅ Icon usage for visual clarity
- ✅ Responsive grid layouts
- ✅ Clean forms with validation
- ✅ Toast notifications for actions

### PHP/HTML Conversion Guide
This React implementation is designed to be easily converted:

1. **Components → PHP includes**
   - Each component can become a PHP include file
   - Modal forms can be PHP forms with POST methods

2. **Context State → PHP Session/Database**
   - User data: PHP $_SESSION
   - Orders: MySQL database queries
   - Addresses: Database table with user_id foreign key

3. **React onClick → PHP Forms**
   - Add Address: POST to add_address.php
   - Edit Address: POST to update_address.php
   - Delete Address: POST to delete_address.php
   - Update Profile: POST to update_profile.php

4. **API Structure (Example)**
```php
// profile.php - Main page
// api/get_orders.php - Fetch orders
// api/add_address.php - Add new address
// api/update_address.php - Update address
// api/delete_address.php - Delete address
// api/set_default_address.php - Set default
// api/update_profile.php - Update user info
```

## Database Schema Suggestion

```sql
-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20),
  profile_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Addresses table
CREATE TABLE addresses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  label VARCHAR(50),
  full_address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(10),
  phone VARCHAR(20),
  is_default BOOLEAN DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Orders table
CREATE TABLE orders (
  id VARCHAR(20) PRIMARY KEY,
  user_id INT,
  total DECIMAL(10,2),
  status ENUM('pending','confirmed','preparing','out-for-delivery','delivered','cancelled'),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id VARCHAR(20),
  food_item_id INT,
  name VARCHAR(100),
  quantity INT,
  price DECIMAL(10,2),
  image VARCHAR(255),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Favorites table
CREATE TABLE favorites (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  food_item_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Navigation Access
- From Dashboard: Click "Profile" in sidebar
- From Landing Page: Click user icon in top navigation
- Direct URL: `/profile`

## Sample User Data
```javascript
User: Rahul Sharma
Email: rahul.sharma@example.com
Phone: +91 98765 43210
Addresses: 2 saved (Home, Hostel)
Orders: 2 orders (1 delivered, 1 out-for-delivery)
Favorites: 3 items
```

## Status Updates
The order status automatically updates in the confirmation page to simulate real-time tracking:
- Pending → Confirmed (2 seconds)
- Confirmed → Preparing (5 seconds)
- Preparing → Out for Delivery (8 seconds)

## Responsive Design
- Desktop: Sidebar + main content
- Mobile: Stacked layout with collapsible sections
- Tablet: Optimized grid layouts

---

This implementation is production-ready and follows best practices for student projects. All layouts are simple, clean, and easily convertible to HTML/CSS/JavaScript/PHP as requested.
