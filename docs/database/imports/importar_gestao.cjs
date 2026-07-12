const dotenv = require('dotenv');
const path = require('path');
const xlsx = require('xlsx');
const { Client } = require('pg');
const bcrypt = require('bcrypt');

dotenv.config();

async function importarGestao() {
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD) : undefined,
    });

    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_PORT:', process.env.DB_PORT);
    console.log('Tipo de DB_PASSWORD:', typeof process.env.DB_PASSWORD);

    try {
        await client.connect();
        console.log('Conectado ao PostgreSQL.');

        const workbook = xlsx.readFile(path.resolve(process.cwd(), 'docs', 'database', 'xlsx', 'Gestao.xlsx'));

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const dados = xlsx.utils.sheet_to_json(worksheet);

        console.log(`Encontrados ${dados.length} registros.`);

        // Hash da senha padrão "123321"
        const defaultPasswordHash = await bcrypt.hash('123321', 10);

        let insertedCount = 0;
        let skippedCount = 0;
        let currentId = 1;

        for (const linha of dados) {
            const codigo = linha['RA'];
            const nomeGestor = linha['NOME_PROFESSOR'];
            const cargo = linha['CARGO'];

            if (!codigo || !nomeGestor) {
                skippedCount += 1;
                continue;
            }

            const codigoStr = String(codigo).trim();
            const nomeGestorStr = String(nomeGestor).trim();
            const cargoStr = cargo ? String(cargo).trim() : null;

            const existsRes = await client.query(
                'SELECT 1 FROM gestores WHERE registration = $1 LIMIT 1',
                [codigoStr]
            );

            if (existsRes.rowCount > 0) {
                skippedCount += 1;
                continue;
            }

            const userId = String(currentId++);
            const role = cargoStr && cargoStr.toLowerCase().includes('coord') ? 'COORDINATOR' : 
                        cargoStr && cargoStr.toLowerCase().includes('admin') ? 'ADMIN' : 'TEACHER';

            await client.query(
                `
                INSERT INTO gestores (id, name, registration, role, cargo, password, createdat)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                `,
                [userId, nomeGestorStr, codigoStr, role, cargoStr, defaultPasswordHash, new Date().toISOString()]
            );
            insertedCount += 1;
        }

        console.log(`Importação concluída. Inseridos: ${insertedCount}; ignorados: ${skippedCount}.`);

    } catch (erro) {
        console.error('Erro:', erro);
    } finally {
        try { await client.end(); } catch (e) {}
    }
}

importarGestao();
