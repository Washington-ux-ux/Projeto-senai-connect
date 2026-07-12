const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config();

async function testLogin() {
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

        const aluno = await client.query(
            'SELECT id, name, registration, role, password FROM alunos WHERE registration = $1',
            ['00023973']
        );
        console.log('Aluno encontrado:', aluno.rows[0]);

        const gestor = await client.query(
            'SELECT id, name, registration, role, password FROM gestores WHERE registration = $1',
            ['90000001']
        );
        console.log('Gestor encontrado:', gestor.rows[0]);

        const naoExiste = await client.query(
            'SELECT id, name, registration, role, password FROM alunos WHERE registration = $1',
            ['99999999']
        );
        console.log('Matrícula não encontrada:', naoExiste.rows);

    } catch (erro) {
        console.error('Erro:', erro);
    } finally {
        try { await client.end(); } catch (e) {}
    }
}

testLogin();
