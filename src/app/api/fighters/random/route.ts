import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { Fighter } from '@/services/wikipediaService';

export async function GET() {
    try {
        const result = await redis.srandmember('wiki:fighters');

        if (!result) {
            return NextResponse.json(
                { error: 'No fighters available in the database. Please run the seeder script first.' },
                { status: 404 }
            );
        }

        const fighter = JSON.parse(result) as Fighter;
        return NextResponse.json(fighter);
    } catch (error) {
        console.error('Error fetching random fighter:', error);
        return NextResponse.json(
            { error: 'Failed to fetch fighter' },
            { status: 500 }
        );
    }
}
