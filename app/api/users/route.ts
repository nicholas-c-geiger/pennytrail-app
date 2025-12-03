import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    await req.json();

    // TODO: create a user record in your DB here
    // Example: await db.user.create({ data: { source: body.source } });

    // Return quickly so the OAuth flow can proceed
    return NextResponse.json({ ok: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return new NextResponse('user creation error', { status: 500 });
  }
}
