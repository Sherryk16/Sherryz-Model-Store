import { NextRequest, NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const orderData = {
      design_elements: JSON.stringify(body.elements),
      design_color: body.designColor,
      design_notes: body.designNotes || '',
      product_type: body.selectedProduct.type,
      product_name: body.selectedProduct.name,
      base_price: body.selectedProduct.price,
      shirt_size: body.shirtSize,
      quantity: body.quantity,
      print_side: body.printSide,
      total_price: body.totalPrice,
      customer_name: body.customerInfo.name,
      customer_email: body.customerInfo.email,
      customer_phone: body.customerInfo.phone,
      customer_address: body.customerInfo.address,
      customer_city: body.customerInfo.city,
      customer_state: body.customerInfo.state,
      customer_zip_code: body.customerInfo.zipCode,
      status: body.status || 'pending',
      payment_status: 'pending',
      shipping_method: 'standard',
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('custom_orders')
      .insert([orderData])
      .select()
      .single()

    if (error) {
      console.error('Error creating custom order:', error)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      message: 'Order created successfully',
      orderId: data.id,
      orderNumber: data.order_number
    })
  } catch (error) {
    console.error('Error in custom order POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('custom_orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching custom orders:', error)
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in custom order GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 