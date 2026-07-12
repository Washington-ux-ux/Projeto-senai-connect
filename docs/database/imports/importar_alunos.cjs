const dotenv = require('dotenv');
const path = require('path');
const xlsx = require('xlsx');
const { Client } = require('pg');
const bcrypt = require('bcrypt');

dotenv.config();

async function importarPlanilha() {
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

        const workbook = xlsx.readFile(path.resolve(process.cwd(), 'docs', 'database', 'xlsx', 'alunos.xlsx'));
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const dados = xlsx.utils.sheet_to_json(worksheet);

        console.log(`Encontrados ${dados.length} registros.`);

        const pick = (obj, keys) => {
            for (const k of keys) {
                if (Object.prototype.hasOwnProperty.call(obj, k) && obj[k] != null) return obj[k];
                const low = Object.keys(obj).find(x => x.replace(/\s|_/g,'').toLowerCase() === k.replace(/\s|_/g,'').toLowerCase());
                if (low) return obj[low];
            }
            return undefined;
        };

        const defaultPasswordHash = await bcrypt.hash('123321', 10);

        let insertedCount = 0;
        let skippedCount = 0;
        let currentId = 1;

        for (const linha of dados) {
            const matricula = pick(linha, ['MATRICULA', 'RA', 'Matricula', 'REGISTRO', 'Registro']);
            const nomeAluno = pick(linha, ['NOME DO ALUNO', 'NOME_ALUNO', 'NOMEALUNO', 'NOME']);

            if (!matricula || !nomeAluno) {
                skippedCount += 1;
                continue;
            }

            const normalizedMatricula = String(matricula).trim();
            const normalizedNome = String(nomeAluno).trim();
            
            const existsRes = await client.query('SELECT 1 FROM alunos WHERE registration = $1 LIMIT 1', [normalizedMatricula]);

            if (existsRes.rowCount > 0) {
                skippedCount += 1;
                continue;
            }

            const userId = String(currentId++);
            const insertSql = `INSERT INTO alunos (id, name, registration, role, password, createdat) VALUES ($1, $2, $3, 'STUDENT', $4, $5)`;
            await client.query(insertSql, [userId, normalizedNome, normalizedMatricula, defaultPasswordHash, new Date().toISOString()]);
            insertedCount += 1;
        }

        console.log(`Importação concluída. Inseridos: ${insertedCount}; ignorados: ${skippedCount}.`);
    } catch (erro) {
        console.error('Erro:', erro);
    } finally {
        try { await client.end(); } catch (e) {}
    }
}

importarPlanilha();
