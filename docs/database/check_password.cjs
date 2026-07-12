const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config();

async function checkPassword() {
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

        // Verificar senha da matrícula 90001001
        const result = await client.query(`
            SELECT id, name, registration, role, password 
            FROM gestores 
            WHERE registration = '90001001'
        `);
        console.log('Dados da matrícula 90001001:', result.rows);

    } catch (erro) {
        console.error('Erro:', erro);
    } finally {
        try { await client.end(); } catch (e) {}
    }
}

checkPassword();
