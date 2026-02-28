const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const { redis } = require('../src/lib/redis');

async function checkCount() {
    try {
        const count = await redis.scard('wiki:fighters');
        console.log(`\n================================`);
        console.log(`W bazie znajduje się obecnie: ${count} artykułów (wojowników).`);
        console.log(`================================\n`);
    } catch (e) {
        console.error("Błąd podczas sprawdzania bazy:", e);
    } finally {
        redis.disconnect();
    }
}

checkCount();
