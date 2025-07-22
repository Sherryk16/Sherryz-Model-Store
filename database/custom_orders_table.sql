-- Create custom_orders table for storing custom apparel orders
CREATE TABLE custom_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    design_elements TEXT NOT NULL,
    design_color VARCHAR(50),
    design_notes TEXT,
    product_type VARCHAR(100) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    shirt_size VARCHAR(10) NOT NULL,
    quantity INTEGER NOT NULL,
    print_side VARCHAR(20) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    
    -- Customer Information
    customer_name VARCHAR(200) NOT NULL,
    customer_email VARCHAR(200) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT NOT NULL,
    customer_city VARCHAR(100) NOT NULL,
    customer_state VARCHAR(50) NOT NULL,
    customer_zip_code VARCHAR(20) NOT NULL,
    
    -- Order Status
    status VARCHAR(20) DEFAULT 'pending' NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending' NOT NULL,
    shipping_method VARCHAR(50) DEFAULT 'standard' NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Constraints
    CONSTRAINT status_check CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    CONSTRAINT payment_status_check CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
    CONSTRAINT shipping_method_check CHECK (shipping_method IN ('standard', 'express', 'overnight')),
    CONSTRAINT print_side_check CHECK (print_side IN ('front', 'back', 'both')),
    CONSTRAINT positive_quantity CHECK (quantity > 0),
    CONSTRAINT positive_price CHECK (total_price >= 0 AND base_price >= 0)
);

-- Create an index on frequently queried columns
CREATE INDEX idx_custom_orders_status ON custom_orders(status);
CREATE INDEX idx_custom_orders_created_at ON custom_orders(created_at);
CREATE INDEX idx_custom_orders_customer_email ON custom_orders(customer_email);

-- Create a function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_custom_orders_updated_at
    BEFORE UPDATE ON custom_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments to the table and columns
COMMENT ON TABLE custom_orders IS 'Stores custom t-shirt design orders from customers';
COMMENT ON COLUMN custom_orders.design_elements IS 'JSON string containing the design elements (text, images, positions, etc.)';
COMMENT ON COLUMN custom_orders.design_color IS 'Color code for the design';
COMMENT ON COLUMN custom_orders.design_notes IS 'Additional notes about the design from the customer';
COMMENT ON COLUMN custom_orders.product_type IS 'Type of product (e.g., t-shirt, hoodie)';
COMMENT ON COLUMN custom_orders.product_name IS 'Specific name/model of the product';
COMMENT ON COLUMN custom_orders.base_price IS 'Base price of the product before customization';
COMMENT ON COLUMN custom_orders.total_price IS 'Final price including customization and quantity';
COMMENT ON COLUMN custom_orders.status IS 'Current status of the order (pending, processing, shipped, delivered, cancelled)';
COMMENT ON COLUMN custom_orders.payment_status IS 'Status of payment for the order';
COMMENT ON COLUMN custom_orders.shipping_method IS 'Selected shipping method for the order';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_custom_orders_status ON custom_orders(status);
CREATE INDEX IF NOT EXISTS idx_custom_orders_created_at ON custom_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_custom_orders_customer_email ON custom_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_custom_orders_product_type ON custom_orders(product_type);

-- Create function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number = 'CUST-' || EXTRACT(YEAR FROM NOW()) || '-' || 
                      LPAD(EXTRACT(DOY FROM NOW())::TEXT, 3, '0') || '-' ||
                      LPAD((SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM '[0-9]+$') AS INTEGER)), 0) + 1 
                           FROM custom_orders 
                           WHERE order_number LIKE 'CUST-' || EXTRACT(YEAR FROM NOW()) || '-' || 
                                 LPAD(EXTRACT(DOY FROM NOW())::TEXT, 3, '0') || '-%')::TEXT, 4, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_custom_order_number
    BEFORE INSERT ON custom_orders
    FOR EACH ROW
    WHEN (NEW.order_number IS NULL)
    EXECUTE FUNCTION generate_order_number();

-- Insert sample data for testing (optional)
INSERT INTO custom_orders (
    design_elements,
    design_color,
    product_type,
    product_name,
    base_price,
    shirt_size,
    quantity,
    print_side,
    total_price,
    customer_name,
    customer_email,
    customer_phone,
    customer_address,
    customer_city,
    customer_state,
    customer_zip_code,
    status,
    design_notes
) VALUES (
    '{"text": "Custom Design", "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="}',
    '#ffffff',
    'tshirt',
    'Classic T-Shirt',
    25.00,
    'M',
    1,
    'front',
    25.00,
    'John Doe',
    'john@example.com',
    '+1234567890',
    '123 Main Street',
    'New York',
    'NY',
    '10001',
    'pending',
    'Sample custom order for testing'
) ON CONFLICT DO NOTHING;

-- Add updated_at column if it doesn't exist
ALTER TABLE custom_orders 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_custom_orders_updated_at
    BEFORE UPDATE ON custom_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 