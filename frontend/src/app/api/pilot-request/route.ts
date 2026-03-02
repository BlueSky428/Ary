import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

type Payload = {
  name?: string;
  organization?: string;
  role?: string;
  domain?: string;
  context?: string;
};

const ALLOWED_DOMAINS = new Set(['Procurement', 'Legal', 'Compliance', 'Governance']);

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not configured');
  return neon(url);
}

export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, name, organization, role, domain, context, status, created_at
      FROM pilot_requests
      ORDER BY created_at DESC
    `;
    return NextResponse.json({ requests: rows });
  } catch (error) {
    console.error('Failed to fetch pilot requests:', error);
    return NextResponse.json(
      { error: 'Unable to load pilot requests.' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Payload;
    const payload = {
      name: body.name?.trim() || '',
      organization: body.organization?.trim() || '',
      role: body.role?.trim() || '',
      domain: body.domain?.trim() || '',
      context: body.context?.trim() || '',
    };

    if (!payload.name || !payload.organization || !payload.role || !payload.domain) {
      return NextResponse.json(
        { error: 'Name, organization, role, and domain are required.' },
        { status: 400 },
      );
    }

    if (!ALLOWED_DOMAINS.has(payload.domain)) {
      return NextResponse.json({ error: 'Invalid domain.' }, { status: 400 });
    }

    const sql = getDb();

    const rows = await sql`
      INSERT INTO pilot_requests (name, organization, role, domain, context)
      VALUES (${payload.name}, ${payload.organization}, ${payload.role}, ${payload.domain}, ${payload.context || null})
      RETURNING id, created_at
    `;

    return NextResponse.json({
      success: true,
      id: rows[0].id,
      createdAt: rows[0].created_at,
    });
  } catch (error) {
    console.error('Pilot request submission failed:', error);
    return NextResponse.json(
      { error: 'Unable to submit right now. Please try again later or contact hello@inlyth.com directly.' },
      { status: 503 },
    );
  }
}
