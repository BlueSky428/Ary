import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Demo Authentication API Route
 * Validates access code and sets authentication cookie
 */

// Access code - stored in environment variable for security
// Set DEMO_ACCESS_CODE in your .env.local file
const DEMO_ACCESS_CODE = process.env.DEMO_ACCESS_CODE || 'ary2000';

// Cookie name and settings
const AUTH_COOKIE_NAME = 'demo-access';
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Access code is required.' },
        { status: 400 }
      );
    }

    // Validate access code (case-insensitive, trimmed)
    const normalizedCode = code.trim();
    const normalizedValidCode = DEMO_ACCESS_CODE.trim();

    if (normalizedCode.toLowerCase() !== normalizedValidCode.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: 'That access code is not recognized.' },
        { status: 401 }
      );
    }

    // Set authentication cookie
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Demo auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * Check if user is authenticated
 * Used by demo page to verify access
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(AUTH_COOKIE_NAME);

    if (authCookie && authCookie.value === 'authenticated') {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ authenticated: false });
  } catch (error) {
    console.error('Demo auth check error:', error);
    return NextResponse.json({ authenticated: false });
  }
}
