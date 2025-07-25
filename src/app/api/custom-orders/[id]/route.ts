import { NextResponse, NextRequest } from 'next/server'
import supabase from '@/lib/supabase'

// GET custom order
export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    const { id } = context.params as { id: string }

    const { data, error } = await supabase
      .from('custom_orders')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching custom order:', error)
      return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT custom order
export async function PUT(
  request: NextRequest,
  context: any
) {
  try {
    const { id } = context.params as { id: string }
    const body = await request.json()

    const { error } = await supabase
      .from('custom_orders')
      .update(body)
      .eq('id', id)

    if (error) {
      console.error('Error updating custom order:', error)
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Order updated successfully' })
  } catch (error) {
    console.error('Error in PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE custom order
export async function DELETE(
  request: NextRequest,
  context: any
) {
  try {
    const { id } = context.params as { id: string }

    const { error } = await supabase
      .from('custom_orders')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting custom order:', error)
      return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Order deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
