import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const body = await req.json();
    const { content, ttl_seconds, max_views } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    let expires_at = null;
    const testNowHeader = req.headers.get('x-test-now-ms');
    const now = (process.env.TEST_MODE === '1' && testNowHeader) 
      ? new Date(parseInt(testNowHeader)) 
      : new Date();

    if (ttl_seconds && ttl_seconds >= 1) {
      expires_at = new Date(now.getTime() + ttl_seconds * 1000).toISOString();
    }

    const { data, error } = await supabase
      .from('pastes')
      .insert([{ content, expires_at, max_views: max_views || null }])
      .select().single();

    if (error) throw error;

    const host = req.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    
    return NextResponse.json({
      id: data.id,
      url: `${protocol}://${host}/p/${data.id}`
    }, { status: 201 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server Error" }, { status: 500 });
  }
}
