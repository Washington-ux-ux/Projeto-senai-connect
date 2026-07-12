const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config();

async function checkReactions() {
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

        console.log('--- POSTS ---');
        const postsResult = await client.query('SELECT id, title, reactions FROM posts LIMIT 3');
        console.log(`${postsResult.rows.length} posts encontrados:`);
        postsResult.rows.forEach(post => {
            console.log(`  ID: ${post.id}, Reactions: ${JSON.stringify(post.reactions)}`);
        });

        console.log('\n--- TABELA REACTIONS ---');
        const reactionsResult = await client.query('SELECT post_id, reactions, user_reactions FROM reactions');
        console.log(`${reactionsResult.rows.length} reações encontradas:`);
        reactionsResult.rows.forEach(reaction => {
            console.log(`  Post: ${reaction.post_id}`);
            console.log(`    Reactions: ${JSON.stringify(reaction.reactions)}`);
            console.log(`    User Reactions: ${JSON.stringify(reaction.user_reactions)}`);
        });

        if (reactionsResult.rows.length === 0) {
            console.log('  ❌ Nenhuma reação encontrada na tabela!');
        }

    } catch (erro) {
        console.error('❌ Erro:', erro.message);
    } finally {
        try { await client.end(); } catch (e) {}
    }
}

checkReactions();
