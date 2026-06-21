import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

// GET - fetch all records
export async function GET() {
  const { data, error } = await supabase
    .from('records')
    .select('*')
    .order('createdAt', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST - create new record
export async function POST(request: NextRequest) {
  const body = await request.json()

  const newRecord = {
    id: Date.now().toString(),
    name: body.name,
    category: body.category,
    description: body.description,
    status: body.status,
    role: body.role,
    email: body.email,
    createdAt: new Date().toISOString().split('T')[0]
  }

  const { data, error } = await supabase
    .from('records')
    .insert([newRecord])
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data[0], { status: 201 })
}

// PUT - update existing record
export async function PUT(request: NextRequest) {
  const body = await request.json()

  const { data, error } = await supabase
    .from('records')
    .update({
      name: body.name,
      category: body.category,
      description: body.description,
      status: body.status,
      role: body.role,
      email: body.email
    })
    .eq('id', body.id)
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data[0])
}

// DELETE - remove a record
export async function DELETE(request: NextRequest) {
  const { id } = await request.json()

  const { error } = await supabase
    .from('records')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ message: 'Record deleted' })
}