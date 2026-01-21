import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth-server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.user) {
    return NextResponse.json({ error: auth.error }, { status: auth.status || 401 })
  }

  try {
    const body = await request.json();
    const { customer_email, note, is_important = false } = body;
    
    if (!customer_email || !note) {
      return NextResponse.json(
        { error: 'Email e nota são obrigatórios' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabaseAdmin
      .from('customer_notes')
      .insert({
        customer_email,
        note,
        created_by_email: auth.user.email || 'admin@system',
        is_important,
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error saving note:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, note: data });
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
