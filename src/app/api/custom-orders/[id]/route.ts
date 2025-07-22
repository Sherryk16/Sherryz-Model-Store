import { NextRequest, NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id

    const { data, error } = await supabase
      .from('custom_orders')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching custom order:', error)
      return NextResponse.json(
        { error: 'Failed to fetch order' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
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

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id
    const body = await request.json()

    const { error } = await supabase
      .from('custom_orders')
      .update(body)
      .eq('id', id)

    if (error) {
      console.error('Error updating custom order:', error)
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Order updated successfully' })
  } catch (error) {
    console.error('Error in custom order PUT:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id

    const { error } = await supabase
      .from('custom_orders')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting custom order:', error)
      return NextResponse.json(
        { error: 'Failed to delete order' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Order deleted successfully' })
  } catch (error) {
    console.error('Error in custom order DELETE:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 