import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

// GET the current state of a lobby
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const upperId = id.toUpperCase();
        const data = await redis.get(`lobby:${upperId}`);

        if (!data) {
            return NextResponse.json({ error: 'Lobby not found' }, { status: 404 });
        }

        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        console.error('Lobby GET error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH parts of the lobby state (e.g. joining, betting, updating fighters)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const upperId = id.toUpperCase();
        const updates = await req.json();

        const data = await redis.get(`lobby:${upperId}`);
        if (!data) {
            return NextResponse.json({ error: 'Lobby not found' }, { status: 404 });
        }

        const state = JSON.parse(data);

        // Handling Player 2 Joining
        if (updates.action === 'join') {
            if (state.p2) {
                return NextResponse.json({ error: 'Lobby is full' }, { status: 403 });
            }
            state.p2 = {
                nick: updates.player2Nick,
                ready: false,
                bet: null,
                score: 0
            };
            state.status = 'starting'; // Found opponent, waiting for first round fighters
        }

        // E.g. handling bets or ready
        if (updates.action === 'bet') {
            const player = updates.isHost ? state.host : state.p2;
            if (player) {
                player.bet = updates.betIndex; // 0 for left, 1 for right
            }

            // If both players bet, we can move the state to fighting/resolving
            if (state.host.bet !== null && state.p2 && state.p2.bet !== null) {
                state.status = 'round_finished';
            }
        }

        // Host pushes the new generated fighters down to the lobby state so P2 can see them
        if (updates.action === 'set_fighters') {
            state.fighters = updates.fighters;
            state.status = 'round_active';
            state.host.bet = null;
            if (state.p2) state.p2.bet = null;

            if (state.settings.timer > 0) {
                state.roundEndTime = Date.now() + (state.settings.timer * 1000);
            }
        }

        if (updates.action === 'next_round') {
            state.currentRound += 1;
            state.fighters = null;
            state.status = 'starting';
            state.host.bet = null;
            if (state.p2) state.p2.bet = null;
            state.roundEndTime = null;
        }

        if (updates.action === 'update_score') {
            state.host.score = updates.hostScore;
            state.p2.score = updates.p2Score;

            // Check if someone won
            if (state.host.score >= state.settings.rounds || state.p2.score >= state.settings.rounds) {
                state.status = 'finished';
            }
        }

        // Save changes
        await redis.set(`lobby:${upperId}`, JSON.stringify(state), 'EX', 60 * 60 * 2);

        return NextResponse.json(state);
    } catch (error) {
        console.error('Lobby PATCH error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
