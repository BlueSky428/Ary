import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

type Payload = {
  name?: string;
  organization?: string;
  role?: string;
  contact?: string;
  domain?: string;
  context?: string;
};

const ALLOWED_DOMAINS = new Set(['Procurement', 'Legal', 'Compliance', 'Governance']);
const ALLOWED_STATUSES = new Set(['new', 'contacted', 'in_progress', 'completed', 'archived']);

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not configured');
  return neon(url);
}

export async function GET(request: NextRequest) {
  try {
    const sql = getDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const domain = searchParams.get('domain');
    const search = searchParams.get('search');

    let rows;

    if (status && domain && search) {
      rows = await sql`
        SELECT id, name, organization, role, contact, domain, context, status, created_at
        FROM pilot_requests
        WHERE status = ${status} AND domain = ${domain}
          AND (name ILIKE ${'%' + search + '%'} OR organization ILIKE ${'%' + search + '%'})
        ORDER BY created_at DESC
      `;
    } else if (status && domain) {
      rows = await sql`
        SELECT id, name, organization, role, contact, domain, context, status, created_at
        FROM pilot_requests
        WHERE status = ${status} AND domain = ${domain}
        ORDER BY created_at DESC
      `;
    } else if (status && search) {
      rows = await sql`
        SELECT id, name, organization, role, contact, domain, context, status, created_at
        FROM pilot_requests
        WHERE status = ${status}
          AND (name ILIKE ${'%' + search + '%'} OR organization ILIKE ${'%' + search + '%'})
        ORDER BY created_at DESC
      `;
    } else if (domain && search) {
      rows = await sql`
        SELECT id, name, organization, role, contact, domain, context, status, created_at
        FROM pilot_requests
        WHERE domain = ${domain}
          AND (name ILIKE ${'%' + search + '%'} OR organization ILIKE ${'%' + search + '%'})
        ORDER BY created_at DESC
      `;
    } else if (status) {
      rows = await sql`
        SELECT id, name, organization, role, contact, domain, context, status, created_at
        FROM pilot_requests
        WHERE status = ${status}
        ORDER BY created_at DESC
      `;
    } else if (domain) {
      rows = await sql`
        SELECT id, name, organization, role, contact, domain, context, status, created_at
        FROM pilot_requests
        WHERE domain = ${domain}
        ORDER BY created_at DESC
      `;
    } else if (search) {
      rows = await sql`
        SELECT id, name, organization, role, contact, domain, context, status, created_at
        FROM pilot_requests
        WHERE name ILIKE ${'%' + search + '%'} OR organization ILIKE ${'%' + search + '%'}
        ORDER BY created_at DESC
      `;
    } else {
      rows = await sql`
        SELECT id, name, organization, role, contact, domain, context, status, created_at
        FROM pilot_requests
        ORDER BY created_at DESC
      `;
    }

    const counts = await sql`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'new')::int AS new,
        COUNT(*) FILTER (WHERE status = 'contacted')::int AS contacted,
        COUNT(*) FILTER (WHERE status = 'in_progress')::int AS in_progress,
        COUNT(*) FILTER (WHERE status = 'completed')::int AS completed,
        COUNT(*) FILTER (WHERE status = 'archived')::int AS archived
      FROM pilot_requests
    `;

    return NextResponse.json({ requests: rows, counts: counts[0] });
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
      contact: body.contact?.trim() || '',
      domain: body.domain?.trim() || '',
      context: body.context?.trim() || '',
    };

    if (!payload.name || !payload.organization || !payload.role || !payload.contact || !payload.domain) {
      return NextResponse.json(
        { error: 'Name, organization, role, contact info, and domain are required.' },
        { status: 400 },
      );
    }

    if (!ALLOWED_DOMAINS.has(payload.domain)) {
      return NextResponse.json({ error: 'Invalid domain.' }, { status: 400 });
    }

    const sql = getDb();

    const rows = await sql`
      INSERT INTO pilot_requests (name, organization, role, contact, domain, context)
      VALUES (${payload.name}, ${payload.organization}, ${payload.role}, ${payload.contact}, ${payload.domain}, ${payload.context || null})
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

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id;
    const status = body.status?.trim();

    if (!id) {
      return NextResponse.json({ error: 'ID is required.' }, { status: 400 });
    }

    if (!status || !ALLOWED_STATUSES.has(status)) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
    }

    const sql = getDb();

    const rows = await sql`
      UPDATE pilot_requests SET status = ${status}
      WHERE id = ${id}
      RETURNING id, status
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Request not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, id: rows[0].id, status: rows[0].status });
  } catch (error) {
    console.error('Pilot request update failed:', error);
    return NextResponse.json({ error: 'Unable to update request.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required.' }, { status: 400 });
    }

    const sql = getDb();

    const rows = await sql`
      DELETE FROM pilot_requests WHERE id = ${id} RETURNING id
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Request not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, id: rows[0].id });
  } catch (error) {
    console.error('Pilot request deletion failed:', error);
    return NextResponse.json({ error: 'Unable to delete request.' }, { status: 500 });
  }
}
