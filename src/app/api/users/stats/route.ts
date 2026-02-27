import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { redis } from '@/lib/redis';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.wiki_JWT_SECRET || 'super-secret-fallback-key-for-local-dev';

export async function POST(req: Request) {
    try {
        const cookieHeader = req.headers.get('cookie') || '';
        const cookies = Object.fromEntries(
            cookieHeader.split('; ').map(c => {
                const [key, ...v] = c.split('=');
                return [key, decodeURIComponent(v.join('='))];
            }).filter(c => c[0])
        );

        const token = cookies['auth_token'];

        if (!token) {
            return NextResponse.json({ error: 'Użytkownik niezalogowany' }, { status: 401 });
        }

        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (e) {
            return NextResponse.json({ error: 'Nieprawidłowa sesja' }, { status: 401 });
        }

        const { result } = await req.json(); // result should be 'win' or 'loss'

        if (result !== 'win' && result !== 'loss') {
            return NextResponse.json({ error: 'Nieprawidłowy wynik' }, { status: 400 });
        }

        const userKey = `user:${decoded.username}`;

        // Check if user still exists
        const exists = await redis.exists(userKey);
        if (!exists) {
            return NextResponse.json({ error: 'Konto nie istnieje' }, { status: 404 });
        }

        // Atomically increment the appropriate stats in Redis Hash
        if (result === 'win') {
            await redis.hincrby(userKey, 'wins', 1);
        } else {
            await redis.hincrby(userKey, 'losses', 1);
        }
        await redis.hincrby(userKey, 'total_games', 1);

        return NextResponse.json({ message: 'Statystyki zaktualizowane' }, { status: 200 });
    } catch (error) {
        console.error('Stats update error:', error);
        return NextResponse.json({ error: 'Błąd podczas aktualizacji statystyk' }, { status: 500 });
    }
}
