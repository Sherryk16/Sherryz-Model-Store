import { NextResponse } from 'next/server';
import  supabase  from '@/lib/supabase';

// Fetch products from Supabase database
export async function GET() {
  try {
    const { data: products, error } = await supabase
      .from('products') // Adjust table name if needed
      .select('*');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return products data as JSON response
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
 