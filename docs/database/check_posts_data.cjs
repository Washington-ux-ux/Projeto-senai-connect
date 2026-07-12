const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config();

async function checkPostsData() {
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

        const result = await client.query('SELECT * FROM posts ORDER BY "createdat" DESC LIMIT 1');
        console.log('Primeiro post:');
        console.log(JSON.stringify(result.rows[0], null, 2));

    } catch (erro) {
        console.error('Erro:', erro);
    } finally {
        try { await client.end(); } catch (e) {}
    }
}

checkPostsData();
