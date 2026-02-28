import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { redis } from '../src/lib/redis';
import { Trait, traitPool } from '../src/services/wikipediaService';

// How many fighters we want in the database
const TARGET_FIGHTERS = 10000;
// How long to wait between Wikipedia API calls (ms)
const API_DELAY_MS = 150;

// Re-defining fighter interface for the script
export interface Fighter {
    id: string;
    title: string;
    img: string | null;
    hp: number;
    maxHp: number;
    atk: number;
    arm: number;
    spd: number;
    crit: number;
    eva: number;
    traits: Trait[];
    raw: number;
    imgCount: number;
    revCount: number;
    linkCount: number;
    langCount: number;
    isProtected: boolean;
    tooltips: Record<string, string>;
}

// Utility to delay execution
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function fetchFighterData(): Promise<Fighter | null> {
    try {
        const rnd = await fetch('https://pl.wikipedia.org/w/api.php?action=query&list=random&rnlimit=1&rnnamespace=0&format=json&origin=*', {
            headers: {
                'User-Agent': 'WikiWarsBot/1.0 (Contact: WikiWars@local.dev)'
            }
        });
        const rndD = await rnd.json();
        const title = rndD.query.random[0].title;

        const stat = await fetch(`https://pl.wikipedia.org/w/api.php?action=query&prop=info|images|revisions|links|langlinks|extlinks|categories&inprop=protection&pllimit=max&lllimit=max&ellimit=max&cllimit=max&titles=${encodeURIComponent(title)}&format=json&origin=*`, {
            headers: {
                'User-Agent': 'WikiWarsBot/1.0 (Contact: WikiWars@local.dev)'
            }
        });
        const statD = await stat.json();
        const page = Object.values(statD.query.pages)[0] as any;

        if (page.length && page.length > 5000 && page.images && page.images.length > 0) {
            const imgReq = await fetch(`https://pl.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, {
                headers: {
                    'User-Agent': 'WikiWarsBot/1.0 (Contact: WikiWars@local.dev)'
                }
            });
            const imgD = await imgReq.json();

            if (!imgD.thumbnail || !imgD.thumbnail.source) {
                return null;
            }

            const text = (imgD.extract || "").toLowerCase();

            const baseHp = page.length / 5;
            const baseAtk = Math.max(40, (page.images ? page.images.length * 15 : 40));
            const revs = page.revisions ? page.revisions.length : 1;
            const links = page.links ? page.links.length : 0;
            const langs = page.langlinks ? page.langlinks.length : 0;
            const extLinksCount = page.extlinks ? page.extlinks.length : 0;
            const catCount = page.categories ? page.categories.length : 0;
            const isProtected = page.protection && page.protection.length > 0;

            const baseArm = 5 + Math.min(40, (extLinksCount * 0.5));
            const baseSpd = 1.0 + (langs * 0.05);
            const baseCrit = Math.min(60, links * 0.2);
            const baseEva = 50 * Math.pow(0.95, catCount);

            let f: any = {
                id: Math.random().toString(36).substring(7),
                title: title,
                img: imgD.thumbnail ? imgD.thumbnail.source : null,
                hp: baseHp,
                atk: baseAtk,
                arm: baseArm,
                spd: baseSpd,
                crit: baseCrit,
                eva: baseEva,
                traits: [],
                raw: page.length,
                imgCount: page.images ? page.images.length : 0,
                revCount: revs,
                linkCount: links,
                langCount: langs,
                isProtected: isProtected,
                tooltips: {
                    hp: `Długość tekstu (${page.length} znaków) / 5`,
                    atk: `Baza 40 + (Liczba obrazów: ${page.images ? page.images.length : 0} * 15)`,
                    arm: `Baza 5% + 0.5% za każdy link zewnętrzny (${extLinksCount} - Max 40%)`,
                    spd: `Baza 1.0 + 5% za każdy przetłumaczony język obiektu (${langs})`,
                    crit: `0.2% za każdy link wewnętrzny na stronie wpisu (${links} - Max 60%)`,
                    eva: `Zwinność bazowa 50%, każda kategoria zmniejsza obecną wartość o 5% (Kategorii: ${catCount})`
                }
            };

            traitPool.forEach(t => {
                const hasWord = t.words.some(word =>
                    text.includes(word) || title.toLowerCase().includes(word)
                );

                if (hasWord) {
                    f.traits.push(t);
                    if (t.m.hp) f.hp *= t.m.hp;
                    if (t.m.atk) f.atk *= t.m.atk;
                    if (t.m.arm) f.arm *= t.m.arm;
                    if (t.m.spd) f.spd *= t.m.spd;
                    if (t.m.crit) f.crit += t.m.crit;
                    if (t.m.eva) f.eva += t.m.eva;
                }
            });

            f.maxHp = Math.max(1, Math.floor(f.hp));
            f.hp = f.maxHp;
            f.arm = Math.max(0, Math.min(85, Math.floor(f.arm)));
            f.atk = Math.max(1, Math.floor(f.atk));
            f.spd = Math.max(0.1, f.spd);
            f.crit = Math.round(Math.max(0, Math.min(75, f.crit)) * 100) / 100;
            f.eva = Math.max(0, Math.round(Math.min(60, f.eva)));

            return f as Fighter;
        }
    } catch (e: any) {
        console.error("Error fetching article:", e.message);
    }
    return null;
}

async function runSeeder() {
    console.log(`Starting Wikipedia Fighter Seeder. Target: ${TARGET_FIGHTERS} valid articles.`);

    // Use the existing set to append new fighters
    const key = 'wiki:fighters';
    // await redis.del(key);
    console.log(`Appending new fighters to the '${key}' set in Redis.`);

    let successCount = 0;
    let attemptCount = 0;

    while (successCount < TARGET_FIGHTERS) {
        attemptCount++;
        const fighter = await fetchFighterData();

        if (fighter) {
            // Add the fighter as a serialized JSON string to the Redis set
            await redis.sadd(key, JSON.stringify(fighter));
            successCount++;

            // Log progress every 10 successes
            if (successCount % 10 === 0 || successCount === TARGET_FIGHTERS) {
                console.log(`Progress: ${successCount} / ${TARGET_FIGHTERS} valid fighters saved. (Attempts so far: ${attemptCount})`);
            }
        }

        // Wait before the next request to respect rate limits
        await delay(API_DELAY_MS);
    }

    console.log(`\nSeeding Complete! 🎉`);
    console.log(`Successfully stored ${TARGET_FIGHTERS} fighters in Redis.`);
    console.log(`Total Wikipedia articles checked: ${attemptCount}`);

    // Disconnect from redis to allow the script process to exit
    redis.disconnect();
}

runSeeder().catch(console.error);
