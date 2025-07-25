// app/api/checkout/route.ts

import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Calculate total price based on the items in the order
    const totalPrice = body.items.reduce(
      (total: number, item: any) => total + (item.price * item.quantity),
      0
    );

    // Insert the order into the 'orders' table in Supabase
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          items: body.items,              // Array of items in the order (JSON format)
          total_price: totalPrice,        // Calculated total price
          status: 'pending',              // Default status for the new order
        },
      ]);

    // Handle errors if any
    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json({ message: 'Database insert failed', error }, { status: 500 });
    }

    // Respond with a success message if insertion is successful
    return NextResponse.json({ message: 'Order saved successfully', data }, { status: 200 });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ message: 'Error during checkout', error }, { status: 500 });
  }
}
