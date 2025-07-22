# Custom T-Shirt Design Feature

## Overview
The custom t-shirt design feature allows customers to create personalized t-shirts with their own text and images. The feature includes a canvas-based design editor, order management, and a complete checkout flow.

## Features

### Design Editor
- **Canvas-based editor** with realistic t-shirt shape
- **Text addition** with customizable font size, color, and rotation
- **Image upload** with validation and automatic resizing
- **Drag and drop** functionality for positioning elements
- **Resize handles** for adjusting element dimensions
- **Rotation controls** for text and image elements
- **Front/Back print side** selection with different shirt views
- **Black and white shirt** color options

### Design Tools
- **Save Design**: Save designs to localStorage for later use
- **Download Image**: Download high-quality PNG images of the design
- **Real-time Preview**: See changes immediately on the canvas
- **Element Selection**: Click to select and edit individual elements
- **Delete Elements**: Remove unwanted design elements

### Order Management
- **Custom Checkout**: Dedicated checkout flow for custom orders
- **Order Tracking**: Complete order status tracking
- **Admin Panel**: Manage custom orders in the admin dashboard
- **Order History**: View and manage all custom orders

## Technical Implementation

### Frontend Components

#### Custom Design Page (`/custom-design`)
- **Canvas Editor**: HTML5 Canvas for design creation
- **Tool Panel**: Text, image, and editing tools
- **Preview Panel**: Real-time design preview
- **Order Summary**: Price calculation and order details

#### Checkout Page (`/custom-design/checkout`)
- **Order Review**: Design preview and order details
- **Customer Information**: Shipping and contact details
- **Payment Integration**: Demo payment form (ready for real integration)
- **Order Confirmation**: Complete order submission

#### Order Success Page (`/custom-design/order-success`)
- **Order Confirmation**: Success message and order details
- **Next Steps**: Information about order processing
- **Contact Information**: Support details

### Backend API

#### Custom Orders API (`/api/custom-orders`)
- **POST**: Create new custom orders
- **GET**: Retrieve all custom orders (admin)
- **PUT**: Update order status
- **DELETE**: Remove orders

#### Individual Order API (`/api/custom-orders/[id]`)
- **GET**: Fetch specific order details
- **PUT**: Update order information
- **DELETE**: Remove specific order

### Database Schema

#### Custom Orders Table
```sql
CREATE TABLE custom_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  design_data TEXT NOT NULL,
  shirt_color VARCHAR(7) NOT NULL,
  shirt_size VARCHAR(3) NOT NULL,
  quantity INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  print_side VARCHAR(5) NOT NULL DEFAULT 'front',
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_address TEXT NOT NULL,
  customer_city VARCHAR(100) NOT NULL,
  customer_state VARCHAR(100) NOT NULL,
  customer_zip_code VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## User Flow

### 1. Design Creation
1. User navigates to `/custom-design`
2. Selects shirt color (black or white)
3. Chooses print side (front or back)
4. Adds text with custom styling
5. Uploads and positions images
6. Adjusts element positions and sizes
7. Saves design or downloads preview

### 2. Order Placement
1. User clicks "Proceed to Checkout"
2. Reviews design and order details
3. Enters shipping information
4. Completes payment (demo)
5. Receives order confirmation

### 3. Order Processing
1. Order is stored in database
2. Admin receives notification
3. Order status is tracked
4. Customer receives updates via email

## File Structure

```
src/
├── app/
│   ├── custom-design/
│   │   ├── page.tsx                    # Main design editor
│   │   ├── checkout/
│   │   │   └── page.tsx               # Checkout page
│   │   └── order-success/
│   │       └── page.tsx               # Success page
│   └── api/
│       └── custom-orders/
│           ├── route.ts               # Main API
│           └── [id]/
│               └── route.ts           # Individual order API
├── components/
│   ├── Navbar.tsx                     # Navigation (updated)
│   └── Hero.tsx                       # Hero section (updated)
└── admin/
    └── custom-orders/
        └── page.tsx                   # Admin panel
```

## Key Features

### Design Quality
- **High-resolution canvas** for crisp designs
- **Image validation** and automatic resizing
- **Anti-aliasing** for smooth text rendering
- **Download quality** optimized for printing

### User Experience
- **Intuitive interface** with clear tool labels
- **Real-time preview** of all changes
- **Responsive design** for mobile and desktop
- **Error handling** with helpful messages

### Order Management
- **Complete order tracking** from creation to delivery
- **Admin dashboard** for order management
- **Email notifications** (ready for integration)
- **Order history** for customers

## Integration Points

### Payment Processing
- **Demo payment form** included
- **Ready for Stripe/PayPal** integration
- **Order validation** before payment

### Email Notifications
- **Order confirmation** emails
- **Status updates** for customers
- **Admin notifications** for new orders

### Inventory Management
- **Quantity tracking** for custom orders
- **Material requirements** planning
- **Production scheduling** integration

## Future Enhancements

### Design Features
- **More font options** and text effects
- **Shape tools** (circles, rectangles, etc.)
- **Layer management** for complex designs
- **Design templates** for quick start

### Order Features
- **Bulk ordering** for multiple designs
- **Order modifications** before production
- **Rush order** options
- **International shipping** support

### Admin Features
- **Production scheduling** dashboard
- **Material inventory** tracking
- **Customer communication** tools
- **Analytics** and reporting

## Setup Instructions

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Database Setup
1. Run the SQL script in `database/custom_orders_table.sql`
2. Ensure Supabase is properly configured
3. Test API endpoints

### Development
1. Install dependencies: `npm install`
2. Set up environment variables
3. Run development server: `npm run dev`
4. Test custom design flow

## Testing

### Design Editor
- Test text addition and editing
- Test image upload and positioning
- Test drag and drop functionality
- Test save and download features

### Order Flow
- Test checkout process
- Test order creation
- Test admin panel access
- Test order status updates

### API Endpoints
- Test POST /api/custom-orders
- Test GET /api/custom-orders
- Test GET /api/custom-orders/[id]
- Test PUT /api/custom-orders/[id]

## Support

For technical support or feature requests, contact the development team or refer to the project documentation. 