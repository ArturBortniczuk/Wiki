import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.wiki_JWT_SECRET || 'super-secret-fallback-key-for-local-dev';

export async function GET(req: Request) {
    try {
        // Note: in Next.js App Router we have to manually parse cookies from the request headers
        // unless we use `next/headers` cookies(). For Edge compatibility we'll parse the raw string here
        const cookieHeader = req.headers.get('cookie') || '';
        const cookies = Object.fromEntries(
            cookieHeader.split('; ').map(c => {
                const [key, ...v] = c.split('=');
                return [key, decodeURIComponent(v.join('='))];
            }).filter(c => c[0])
        );

        const token = cookies['auth_token'];

        if (!token) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { username: string };

            const userKey = `user:${decoded.username}`;
            const user = await redis.hgetall(userKey);

            if (!user || Object.keys(user).length === 0) {
                return NextResponse.json({ authenticated: false }, { status: 401 });
            }

            // Return public stats profile excluding the hashed password
            return NextResponse.json({
                authenticated: true,
                user: {
                    username: user.username,
                    wins: parseInt(user.wins || '0', 10),
                    losses: parseInt(user.losses || '0', 10),
                    total_games: parseInt(user.total_games || '0', 10),
                    created_at: user.created_at
                }
            }, { status: 200 });

        } catch (e) {
            // JWT failed verification (expired, invalid signature, etc)
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

    } catch (error) {
        console.error('Session check error:', error);
        return NextResponse.json(
            { error: 'Błąd podczas weryfikacji sesji' },
            { status: 500 }
        );
    }
}
