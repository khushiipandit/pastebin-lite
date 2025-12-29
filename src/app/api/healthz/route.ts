import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

 

   // 2. Simple database "ping" to verify persistence layer
    const { error } = await supabase.from('pastes').select('id').limit(1);

    if (error) {
      console.error('Database unreachable:', error.message);
      return NextResponse.json({ ok: false, error: "Persistence error" }, { status: 500 });
    }

    // 3. Success response as required by the assignment
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Server Error" }, { status: 500 });
  }
}
