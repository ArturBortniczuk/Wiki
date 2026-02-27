import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json(
        { message: 'Wylogowano pomyślnie' },
        { status: 200 }
    );

    // Overwrite the auth_token cookie with an expired one to immediately clear it on the client
    response.cookies.set('auth_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0, // Expire immediately
        path: '/',
    });

    return response;
}
