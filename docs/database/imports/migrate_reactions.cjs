const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config();

async function migrateReactions() {
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD) : undefined,
    });

    try {
        await client.connect();
        console.log('✅ Conectado ao PostgreSQL.\n');

        const postsResult = await client.query('SELECT id, reactions FROM posts WHERE reactions IS NOT NULL');
        console.log(`Encontrados ${postsResult.rows.length} posts com reactions`);

        let migrated = 0;

        for (const post of postsResult.rows) {
            const existsRes = await client.query('SELECT 1 FROM reactions WHERE post_id = $1', [post.id]);
            
            if (existsRes.rows.length === 0) {
                await client.query(
                    `INSERT INTO reactions (post_id, reactions, user_reactions)
                     VALUES ($1, $2, $3)`,
                    [
                        post.id,
                        JSON.stringify(post.reactions || {}),
                        JSON.stringify({})
                    ]
                );
                migrated++;
            }
        }

        console.log(`✅ Migradas ${migrated} reactions para tabela reactions`);

        const resultRes = await client.query('SELECT COUNT(*) FROM reactions');
        console.log(`Total de reações na tabela reactions: ${resultRes.rows[0].count}`);

    } catch (erro) {
        console.error('❌ Erro:', erro.message);
    } finally {
        try { await client.end(); } catch (e) {}
    }
}

migrateReactions();
