import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { id } = await params;

    // 1. Fetch the paste from Supabase
    const { data, error } = await supabase
      .from('pastes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Paste not found" }, { status: 404 });
    }

    // 2. Logic for Deterministic Time (Assignment Requirement)
    const testNowHeader = req.headers.get('x-test-now-ms');
    const now = (process.env.TEST_MODE === '1' && testNowHeader) 
      ? new Date(parseInt(testNowHeader)) 
      : new Date();

    // 3. Check if expired
    if (data.expires_at && new Date(data.expires_at) < now) {
      return NextResponse.json({ error: "Paste has expired" }, { status: 410 });
    }

    // 4. Check if View Limit reached
    if (data.max_views !== null && data.view_count >= data.max_views) {
      return NextResponse.json({ error: "View limit reached" }, { status: 410 });
    }

    // 5. Update view count in the database
    await supabase
      .from('pastes')
      .update({ view_count: data.view_count + 1 })
      .eq('id', id);

    return NextResponse.json({ content: data.content }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
