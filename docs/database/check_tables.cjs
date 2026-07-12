const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config();

async function checkTables() {
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

        const tables = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log('Tabelas no banco:', tables.rows.map(r => r.table_name));

        const postsCount = await client.query('SELECT COUNT(*) FROM posts');
        console.log('Total de posts:', postsCount.rows[0].count);

        const linksCount = await client.query('SELECT COUNT(*) FROM links');
        console.log('Total de links:', linksCount.rows[0].count);

        const eventsCount = await client.query('SELECT COUNT(*) FROM academic_events');
        console.log('Total de academic_events:', eventsCount.rows[0].count);

    } catch (erro) {
        console.error('Erro:', erro);
    } finally {
        try { await client.end(); } catch (e) {}
    }
}

checkTables();
