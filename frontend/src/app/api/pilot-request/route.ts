import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

type Payload = {
  name?: string;
  organization?: string;
  role?: string;
  domain?: string;
  context?: string;
};

const ALLOWED_DOMAINS = new Set(['Procurement', 'Legal', 'Compliance', 'Governance']);
const STORAGE_DIR = path.join(process.cwd(), 'data');
const STORAGE_FILE = path.join(STORAGE_DIR, 'pilot-requests.jsonl');

async function persist(payload: Required<Payload>) {
  await fs.mkdir(STORAGE_DIR, { recursive: true });
  const record = { ...payload, createdAt: new Date().toISOString() };
  await fs.appendFile(STORAGE_FILE, `${JSON.stringify(record)}\n`, 'utf8');
}

async function sendEmail(payload: Required<Payload>): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const from = process.env.PILOT_REQUEST_FROM_EMAIL || 'Inlyth Pilot <no-reply@inlyth.com>';
  const to = process.env.PILOT_REQUEST_TO_EMAIL || 'hello@inlyth.com';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Pilot Request — ${payload.organization}`,
      text: [
        `Name: ${payload.name}`,
        `Organization: ${payload.organization}`,
        `Role: ${payload.role}`,
        `Domain: ${payload.domain}`,
        `Brief context: ${payload.context || 'N/A'}`,
      ].join('\n'),
    }),
  });

  return res.ok;
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

    await persist(payload);
    const emailed = await sendEmail(payload);

    return NextResponse.json({ success: true, emailed });
  } catch {
    return NextResponse.json({ error: 'Unable to process request.' }, { status: 500 });
  }
}
