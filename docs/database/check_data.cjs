const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config();

async function checkData() {
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

        // Verificar quantidade de alunos
        const alunosCount = await client.query('SELECT COUNT(*) FROM alunos');
        console.log('Total de alunos:', alunosCount.rows[0].count);

        // Verificar quantidade de gestores
        const gestoresCount = await client.query('SELECT COUNT(*) FROM gestores');
        console.log('Total de gestores:', gestoresCount.rows[0].count);

        const alunosSample = await client.query('SELECT id, name, registration, role, password FROM alunos LIMIT 5');
        console.log('Amostra de alunos:', alunosSample.rows);

        const gestoresSample = await client.query('SELECT id, name, registration, role, password FROM gestores LIMIT 5');
        console.log('Amostra de gestores:', gestoresSample.rows);

    } catch (erro) {
        console.error('Erro:', erro);
    } finally {
        try { await client.end(); } catch (e) {}
    }
}

checkData();
