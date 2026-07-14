const dotenv = require('dotenv');
const { createClient } = require('./db-client.cjs');

dotenv.config();

async function updatePasswords() {
    const client = createClient();

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
