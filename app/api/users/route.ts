import { NextResponse } from 'next/server';

const API_URL = process.env.API_URL;

export async function POST(req: Request) {
  try {
    await req.json();

    const payload = { name: 'test', email: 'test@test.com' };

    try {
      const res = await fetch(`${API_URL}/api/v1/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        return NextResponse.json(
          { ok: false, message: data?.message || 'Failed to create user' },
          { status: res.status },
        );
      } else {
        return NextResponse.json({ ok: true, id: data?.id }, { status: 201 });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err ?? 'Network error');
      console.error('Upstream request error:', err);
      return NextResponse.json({ ok: false, message }, { status: 502 });
    }
  } catch (err) {
    console.error(err);
    return new NextResponse('user creation error', { status: 500 });
  }
}
