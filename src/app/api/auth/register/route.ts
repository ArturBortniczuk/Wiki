import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Brak nazwy użytkownika lub hasła' },
                { status: 400 }
            );
        }

        // Check if the username is taken
        const userKey = `user:${username.toLowerCase()}`;
        const exists = await redis.exists(userKey);

        if (exists) {
            return NextResponse.json(
                { error: 'Ta nazwa użytkownika jest już zajęta' },
                { status: 409 }
            );
        }

        // Securely hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save user profile structure to Redis Hash
        await redis.hset(userKey, {
            username: username,
            password: hashedPassword,
            wins: 0,
            losses: 0,
            total_games: 0,
            created_at: new Date().toISOString()
        });

        return NextResponse.json(
            { message: 'Konto zostało pomyślnie utworzone!' },
            { status: 201 }
        );

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Błąd serwera podczas rejestracji' },
            { status: 500 }
        );
    }
}
