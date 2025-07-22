-- Add original_price column to products table for discount pricing
-- This migration adds original_price column to support discount display

-- Add original_price column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS original_price DECIMAL(10, 2) DEFAULT NULL;

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_original_price ON products(original_price);

-- Add a check constraint to ensure original_price is greater than or equal to price when not null
-- Note: We'll add this constraint manually if it doesn't exist to avoid errors
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'check_original_price' 
        AND table_name = 'products'
    ) THEN
        ALTER TABLE products 
        ADD CONSTRAINT check_original_price 
        CHECK (original_price IS NULL OR original_price >= price);
    END IF;
END $$; 