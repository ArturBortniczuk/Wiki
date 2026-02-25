import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { lobbyId, hostNick, settings } = body;

        if (!lobbyId || !hostNick) {
            return NextResponse.json({ error: 'Missing lobbyId or hostNick' }, { status: 400 });
        }

        // Initial state of the new lobby
        const state = {
            id: lobbyId,
            status: 'waiting', // waiting for p2
            settings: {
                rounds: parseInt(settings.rounds || '3', 10),
                timer: parseInt(settings.timer || '30', 10),
                shop: !!settings.shopEnabled
            },
            host: {
                nick: hostNick,
                ready: false,
                bet: null,
                score: 0
            },
            p2: null,
            fighters: null,
            currentRound: 1,
            roundEndTime: null
        };

        // Save to Redis with an expiration of 2 hours, so inactive lobbies clean themselves up
        await redis.set(`lobby:${lobbyId}`, JSON.stringify(state), 'EX', 60 * 60 * 2);

        return NextResponse.json(state);
    } catch (error) {
        console.error('Failed to create lobby', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
