import { NextRequest, NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

// Type for the dynamic route parameter
interface RouteParams {
  params: {
    id: string
  }
}

// GET custom order by ID
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params

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

// PUT update custom order by ID
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const body = await req.json()

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

// DELETE custom order by ID
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params

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
