const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config();

async function updatePasswords() {
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

        console.log('Atualizando senhas de alunos...');
        await client.query("UPDATE alunos SET password = '123321'");
        const alunosCount = await client.query('SELECT COUNT(*) FROM alunos');
        console.log(`Senhas de ${alunosCount.rows[0].count} alunos atualizadas.`);

        console.log('Atualizando senhas de gestores...');
        await client.query("UPDATE gestores SET password = '123321'");
        const gestoresCount = await client.query('SELECT COUNT(*) FROM gestores');
        console.log(`Senhas de ${gestoresCount.rows[0].count} gestores atualizadas.`);

        console.log('✓ Senhas atualizadas com sucesso!');

    } catch (erro) {
        console.error('Erro:', erro);
    } finally {
        try { await client.end(); } catch (e) {}
    }
}

updatePasswords();
