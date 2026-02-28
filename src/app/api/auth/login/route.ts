import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { redis } from '@/lib/redis';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.wiki_JWT_SECRET || 'super-secret-fallback-key-for-local-dev';

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Brak nazwy użytkownika lub hasła' },
                { status: 400 }
            );
        }

        // Check if user exists
        const userKey = `user:${username.toLowerCase()}`;
        const user = await redis.hgetall(userKey);

        if (!user || Object.keys(user).length === 0) {
            return NextResponse.json(
                { error: 'Nieprawidłowa nazwa użytkownika lub hasło' },
                { status: 401 }
            );
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Nieprawidłowa nazwa użytkownika lub hasło' },
                { status: 401 }
            );
        }

        // Create a JWT Token
        const token = jwt.sign(
            { username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' } // Session valid for 7 days
        );

        const cookieStore = await cookies();
        cookieStore.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
            path: '/',
        });

        // Create the response and set the HTTP-only cookie
        return NextResponse.json(
            { message: 'Zalogowano pomyślnie' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Błąd serwera podczas logowania' },
            { status: 500 }
        );
    }
}
