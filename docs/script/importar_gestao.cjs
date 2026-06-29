const dotenv = require('dotenv');
const path = require('path');
const xlsx = require('xlsx');
const { Client } = require('pg');

dotenv.config({ path: path.resolve(process.cwd(), 'conexao.env') });

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

        const workbook = xlsx.readFile(path.resolve(process.cwd(), 'src', 'data', 'Gestao.xlsx'));

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const dados = xlsx.utils.sheet_to_json(worksheet);

        console.log(`Encontrados ${dados.length} registros.`);

        let insertedCount = 0;
        let skippedCount = 0;

        for (const linha of dados) {
            const codigo = linha['RA'];
            const nomeGestor = linha['NOME_PROFESSOR'];
            const cargo = linha['CARGO'];

            if (!codigo || !nomeGestor) {
                console.log('Linha ignorada:', linha);
                continue;
            }

            const codigoStr = String(codigo).trim();
            const nomeGestorStr = String(nomeGestor).trim();
            const cargoStr = cargo ? String(cargo).trim() : null;

            const existsRes = await client.query(
                'SELECT 1 FROM gestores WHERE codigo = $1 LIMIT 1',
                [codigoStr]
            );

            if (existsRes.rowCount > 0) {
                console.log('Registro já existe, ignorando:', codigoStr);
                skippedCount += 1;
                continue;
            }

            console.log('Inserindo:', codigoStr, nomeGestorStr, cargoStr);

            await client.query(
                `
                INSERT INTO gestores (nome_gestor, codigo, cargo)
                VALUES ($1, $2, $3)
                `,
                [nomeGestorStr, codigoStr, cargoStr]
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
