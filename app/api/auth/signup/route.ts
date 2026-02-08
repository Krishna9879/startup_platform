import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, generateToken } from '@/lib/auth';

// Mock database - replace with real database in production
const MOCK_USERS: Array<{
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
  role: string;
  is_verified: boolean;
}> = [];

let nextUserId = 4;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, password, role } = body;

    if (!fullName || !email || !password || !role) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    if (!['investor', 'startup'].includes(role)) {
      return NextResponse.json(
        { message: 'Invalid role' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = MOCK_USERS.find((u) => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = {
      id: nextUserId++,
      email,
      password_hash: hashPassword(password),
      full_name: fullName,
      role,
      is_verified: false,
    };

    MOCK_USERS.push(newUser);

    const token = generateToken(newUser.id, newUser.role);

    return NextResponse.json({
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role,
        is_verified: newUser.is_verified,
      },
    });
  } catch (error) {
    console.error('[v0] Signup API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
