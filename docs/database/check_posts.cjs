const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config();

async function checkPosts() {
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

        const columns = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'posts' 
            ORDER BY ordinal_position
        `);
        console.log('Colunas da tabela posts:');
        columns.rows.forEach(col => {
            console.log(`  ${col.column_name}: ${col.data_type}`);
        });

        console.log('\nTestando query SELECT * FROM posts...');
        const result = await client.query('SELECT * FROM posts ORDER BY "createdAt" DESC');
        console.log(`Query retornou ${result.rows.length} linhas`);
        if (result.rows.length > 0) {
            console.log('Primeira linha:', result.rows[0]);
        }

    } catch (erro) {
        console.error('Erro:', erro);
    } finally {
        try { await client.end(); } catch (e) {}
    }
}

checkPosts();
