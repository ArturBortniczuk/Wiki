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

        // Handling Player Joining
        if (updates.action === 'join') {
            const exists = state.players.find((p: any) => p.nick === updates.playerNick);
            if (!exists) {
                state.players.push({
                    nick: updates.playerNick,
                    isHost: false,
                    ready: false,
                    bet: null,
                    score: 0,
                    points: 0,
                    streak: 0
                });
            }
        }

        // Host clicks Start
        if (updates.action === 'start_game') {
            state.status = 'starting'; // waiting for fighters to be generated
        }

        // E.g. handling bets or ready
        if (updates.action === 'bet') {
            const player = state.players.find((p: any) => p.nick === updates.playerNick);
            if (player) {
                player.bet = updates.betIndex; // 0 for left, 1 for right
            }

            // If all players bet, we can move the state to fighting/resolving
            const allBet = state.players.every((p: any) => p.bet !== null);
            if (allBet && state.players.length > 0) {
                state.status = 'round_finished';
            }
        }

        // Host pushes the new generated fighters down to the lobby state so everyone can see them
        if (updates.action === 'set_fighters') {
            state.fighters = updates.fighters;
            state.status = 'round_active';
            state.players.forEach((p: any) => p.bet = null);

            if (state.settings.timer > 0) {
                state.roundEndTime = Date.now() + (state.settings.timer * 1000);
            }
        }

        if (updates.action === 'next_round') {
            state.currentRound += 1;
            state.fighters = null;
            state.status = 'starting';
            state.players.forEach((p: any) => p.bet = null);
            state.roundEndTime = null;
        }

        if (updates.action === 'spend_points') {
            const player = state.players.find((p: any) => p.nick === updates.playerNick);
            if (player && player.points >= updates.cost) {
                player.points -= updates.cost;
            }
        }

        if (updates.action === 'update_scores') {
            state.players.forEach((p: any) => {
                if (updates.scores && updates.scores[p.nick] !== undefined) {
                    p.score = updates.scores[p.nick];
                }
                if (updates.points && updates.points[p.nick] !== undefined) {
                    p.points = updates.points[p.nick];
                }
                if (updates.streaks && updates.streaks[p.nick] !== undefined) {
                    p.streak = updates.streaks[p.nick];
                }
            });

            // Check if someone won
            const winner = state.players.find((p: any) => p.score >= state.settings.rounds);
            if (winner) {
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
