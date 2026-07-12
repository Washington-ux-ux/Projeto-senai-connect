const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config();

async function fixReactions() {
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD) : undefined,
    });

    try {
        await client.connect();
        console.log('Conectado ao PostgreSQL.');

        const result = await client.query('SELECT id, reactions FROM posts');
        console.log(`\nProcessando ${result.rows.length} posts...`);

        let fixed = 0;

        for (const post of result.rows) {
            let reactions = post.reactions;

            if (typeof reactions === 'object' && reactions !== null) {
                reactions = JSON.stringify(reactions);
                
                await client.query(
                    'UPDATE posts SET reactions = $1 WHERE id = $2',
                    [reactions, post.id]
                );
                fixed++;
            }
        }

        console.log(`✅ Corrigidas ${fixed} reactions`);

    } catch (erro) {
        console.error('❌ Erro:', erro);
    } finally {
        try { await client.end(); } catch (e) {}
    }
}

fixReactions();
