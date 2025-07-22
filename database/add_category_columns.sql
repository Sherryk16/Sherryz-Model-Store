-- Add new category columns to products table
-- This migration adds is_streetwear and is_urdu_calligraphy columns

-- Add is_streetwear column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_streetwear BOOLEAN DEFAULT FALSE;

-- Add is_urdu_calligraphy column  
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_urdu_calligraphy BOOLEAN DEFAULT FALSE;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_is_streetwear ON products(is_streetwear);
CREATE INDEX IF NOT EXISTS idx_products_is_urdu_calligraphy ON products(is_urdu_calligraphy);

-- Optional: Update existing products to have some default categorization
-- You can uncomment and modify these lines if you want to set some existing products as streetwear or urdu calligraphy
-- UPDATE products SET is_streetwear = TRUE WHERE category ILIKE '%street%' OR category ILIKE '%urban%';
-- UPDATE products SET is_urdu_calligraphy = TRUE WHERE category ILIKE '%urdu%' OR category ILIKE '%calligraphy%' OR category ILIKE '%islamic%'; 