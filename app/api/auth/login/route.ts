import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, verifyPassword, generateToken } from '@/lib/auth';

// Mock database - replace with real database in production
const MOCK_USERS = [
  {
    id: 1,
    email: 'investor@example.com',
    password_hash: hashPassword('password123'),
    full_name: 'John Investor',
    role: 'investor',
    is_verified: true,
  },
  {
    id: 2,
    email: 'startup@example.com',
    password_hash: hashPassword('password123'),
    full_name: 'Jane Startup',
    role: 'startup',
    is_verified: true,
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user (replace with database query)
    const user = MOCK_USERS.find((u) => u.email === email);

    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = generateToken(user.id, user.role);

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        is_verified: user.is_verified,
      },
    });
  } catch (error) {
    console.error('[v0] Login API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
