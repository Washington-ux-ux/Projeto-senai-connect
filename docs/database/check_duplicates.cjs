const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config();

async function checkDuplicates() {
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

        const duplicateAlunos = await client.query(`
            SELECT id, COUNT(*) as count 
            FROM alunos 
            GROUP BY id 
            HAVING COUNT(*) > 1
        `);
        console.log('IDs duplicados em alunos:', duplicateAlunos.rows);

        const duplicateGestores = await client.query(`
            SELECT id, COUNT(*) as count 
            FROM gestores 
            GROUP BY id 
            HAVING COUNT(*) > 1
        `);
        console.log('IDs duplicados em gestores:', duplicateGestores.rows);

        // Verificar Mariana Alves Souza
        const mariana = await client.query(`
            SELECT * FROM gestores WHERE registration = '90001001'
        `);
        console.log('Mariana Alves Souza:', mariana.rows);

        // Verificar ABEL GABRYEL DA SILVA
        const abel = await client.query(`
            SELECT * FROM alunos WHERE registration = '00235070'
        `);
        console.log('ABEL GABRYEL DA SILVA:', abel.rows);

    } catch (erro) {
        console.error('Erro:', erro);
    } finally {
        try { await client.end(); } catch (e) {}
    }
}

checkDuplicates();
