const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();
require('dotenv').config({ path: '.env.local' });  // This ensures .env.local is loaded


const app = express();
app.use(cors());
app.use(express.json());

// Set up Supabase connection
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, // Get this from your Supabase dashboard
  process.env.NEXT_PUBLIC_SUPABASE_KEY  // Get this from your Supabase dashboard
);

// Home Route
app.get('/', (req, res) => {
  res.send('Welcome to Shirt Store API');
});

// Route to get all products
app.get('/products', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Route to create an order
app.post('/orders', async (req, res) => {
  const { customerName, customerAddress, totalPrice, items } = req.body;

  const { data: order, error } = await supabase
    .from('orders')
    .insert([
      {
        customer_name: customerName,
        customer_address: customerAddress,
        total_price: totalPrice,
      },
    ])
    .single();

  if (error) return res.status(500).json({ error: error.message });

  for (let item of items) {
    await supabase
      .from('order_items')
      .insert([
        {
          order_id: order.id,
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price,
        },
      ]);
  }

  res.json({ orderId: order.id });
});

// Server listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
