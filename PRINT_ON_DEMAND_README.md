# Print-on-Demand Custom T-Shirt Designer

This feature allows customers to create custom t-shirt designs and place orders through a user-friendly interface.

## Features

### 🎨 Custom Design Editor
- **Canvas-based design tool** with drag-and-drop functionality
- **Image upload capability** - Upload your own images (JPG, PNG, GIF, max 5MB)
- **Text customization** with font size, color, and rotation options
- **Real-time preview** on white and black shirt colors
- **Interactive design elements** that can be selected, moved, rotated, and deleted
- **Preview mode toggle** to switch between white and black shirt previews

### 👕 Product Customization
- **Multiple shirt colors** (White, Black, Navy, Gray, Red, Blue, Green)
- **Size selection** (XS, S, M, L, XL, XXL)
- **Quantity selection** with dynamic pricing
- **Base price**: PKR 25 per custom shirt

### 🛒 Order Management
- **Complete checkout process** with customer information collection
- **Order confirmation** with design preview and order details
- **Admin dashboard** for managing custom orders
- **Order status tracking** (Pending, Processing, Shipped, Delivered, Cancelled)

## File Structure

```
src/app/
├── custom-design/
│   ├── page.tsx                    # Main design editor with image upload
│   ├── checkout/
│   │   └── page.tsx               # Checkout page
│   └── order-success/
│       └── [id]/
│           └── page.tsx           # Order confirmation page
├── admin/
│   └── custom-orders/
│       └── page.tsx               # Admin order management
└── api/
    └── custom-orders/
        ├── route.ts               # API for creating/fetching orders
        └── [id]/
            └── route.ts           # API for individual order operations
```

## Database Schema

### custom_orders Table
```sql
CREATE TABLE custom_orders (
    id UUID PRIMARY KEY,
    design_data TEXT NOT NULL,           -- Base64 encoded design image
    shirt_color VARCHAR(7) NOT NULL,     -- Hex color code
    shirt_size VARCHAR(5) NOT NULL,      -- XS, S, M, L, XL, XXL
    quantity INTEGER NOT NULL DEFAULT 1,
    total_price DECIMAL(10,2) NOT NULL,
    
    -- Customer information
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT NOT NULL,
    customer_city VARCHAR(100) NOT NULL,
    customer_postal_code VARCHAR(20) NOT NULL,
    customer_country VARCHAR(100) DEFAULT 'Pakistan',
    
    -- Order metadata
    order_type VARCHAR(50) DEFAULT 'custom_design',
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Endpoints

### POST /api/custom-orders
Creates a new custom order
```json
{
  "designData": "data:image/png;base64,...",
  "shirtColor": "#ffffff",
  "shirtSize": "M",
  "quantity": 1,
  "totalPrice": 25.00,
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+92 123 4567890",
    "address": "123 Main Street",
    "city": "Karachi",
    "postalCode": "75000",
    "country": "Pakistan"
  },
  "orderType": "custom_design",
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### GET /api/custom-orders
Fetches all custom orders (admin only)

### GET /api/custom-orders/[id]
Fetches a specific custom order by ID

### PUT /api/custom-orders/[id]
Updates a custom order (e.g., status changes)

## User Flow

1. **Design Creation**
   - User navigates to `/custom-design`
   - Uploads their own images or adds custom text
   - Uses the canvas editor to position and customize elements
   - Switches between white and black preview modes
   - Selects shirt color, size, and quantity

2. **Checkout Process**
   - User clicks "Add to Cart" to proceed to checkout
   - Fills in customer information
   - Reviews order summary and design preview
   - Places order

3. **Order Confirmation**
   - User receives order confirmation with order ID
   - Design preview and order details are displayed
   - Order is stored in database

4. **Admin Management**
   - Admin can view all custom orders in `/admin/custom-orders`
   - Update order status (Pending → Processing → Shipped → Delivered)
   - View detailed order information and design preview

## Image Upload Features

### Supported Formats
- **JPG/JPEG** - Joint Photographic Experts Group
- **PNG** - Portable Network Graphics (supports transparency)
- **GIF** - Graphics Interchange Format

### File Size Limits
- **Maximum file size**: 5MB
- **Automatic resizing**: Images are automatically scaled to fit within 200px dimensions
- **Quality preservation**: Aspect ratio is maintained during resizing

### Image Processing
- **Automatic scaling**: Large images are automatically resized for optimal display
- **Drag and drop**: Images can be moved around the canvas
- **Rotation**: Images can be rotated in 45-degree increments
- **Selection**: Click to select and modify image properties

## Preview Modes

### White Preview Mode
- Shows design on white shirt background
- Black outline for visibility
- Ideal for dark-colored designs

### Black Preview Mode
- Shows design on black shirt background
- White outline for visibility
- Ideal for light-colored designs

### Real-time Switching
- Toggle between preview modes instantly
- No need to redraw or reload
- Helps users choose the best shirt color

## Setup Instructions

1. **Database Setup**
   ```bash
   # Run the SQL script in your Supabase database
   psql -h your-supabase-host -U your-username -d your-database -f database/custom_orders_table.sql
   ```

2. **Environment Variables**
   Ensure your Supabase environment variables are set:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_KEY=your-supabase-anon-key
   ```

3. **Navigation Update**
   The "Custom Design" link has been added to the main navigation menu.

## Technical Implementation

### Canvas Editor
- Uses HTML5 Canvas API for drawing
- Implements drag-and-drop functionality for design elements
- Real-time rendering of design changes
- Export design as base64 image data
- Image upload and processing with FileReader API

### Image Processing
- File validation (type and size)
- Automatic image scaling
- Base64 encoding for storage
- Canvas drawing with rotation support

### State Management
- React hooks for managing design state
- Local storage for temporary design data
- Form validation for customer information
- Preview mode state management

### Responsive Design
- Mobile-friendly interface
- Responsive canvas sizing
- Touch-friendly controls
- Adaptive image sizing

## Future Enhancements

- [ ] More font options and styles
- [ ] Shape and icon libraries
- [ ] Design templates and presets
- [ ] Bulk ordering capabilities
- [ ] Design sharing and social features
- [ ] Order tracking for customers
- [ ] Email notifications and updates
- [ ] Payment integration (Stripe, PayPal)
- [ ] 3D shirt model preview
- [ ] Advanced image filters and effects
- [ ] Design collaboration features
- [ ] Print quality preview
- [ ] Multiple design areas (front, back, sleeves)

## Troubleshooting

### Common Issues

1. **Canvas not rendering**
   - Check if canvas element is properly referenced
   - Ensure canvas dimensions are set correctly

2. **Image upload not working**
   - Verify file type is supported (JPG, PNG, GIF)
   - Check file size is under 5MB
   - Ensure browser supports FileReader API

3. **Design not saving**
   - Verify localStorage is available
   - Check browser console for errors

4. **API errors**
   - Verify Supabase connection
   - Check database table exists
   - Validate request payload

### Debug Mode
Enable debug logging by setting:
```javascript
localStorage.setItem('debug', 'true')
```

## Support

For technical support or feature requests, please contact the development team. 