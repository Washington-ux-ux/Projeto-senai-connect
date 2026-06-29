const dotenv = require('dotenv');
const path = require('path');
const xlsx = require('xlsx');
const { Client } = require('pg');

dotenv.config({ path: path.resolve(process.cwd(), 'conexao.env') });

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

        const tablesRes = await client.query("SELECT table_schema, table_name FROM information_schema.tables WHERE table_type='BASE TABLE' AND table_schema NOT IN ('pg_catalog','information_schema')");
        console.log('Tables:', tablesRes.rows);

        const colsRes = await client.query("SELECT table_name, column_name FROM information_schema.columns WHERE table_schema='public' ORDER BY table_name, ordinal_position");
        console.log('Some columns in public schema:', colsRes.rows.slice(0,200));
        const tableCols = colsRes.rows.filter(r => r.table_name === 'alunos').map(r => r.column_name.toLowerCase());

        try {
            const sample = await client.query('SELECT * FROM alunos LIMIT 0');
            const fieldNames = sample.fields ? sample.fields.map(f => f.name) : [];
            console.log('Field names from SELECT * LIMIT 0:', fieldNames);
            if (fieldNames.length && tableCols.length === 0) {
                tableCols.push(...fieldNames.map(f => f.toLowerCase()));
            }
        } catch (e) {
            console.log('SELECT * LIMIT 0 failed:', e.message);
        }

        try {
            const sample2 = await client.query('SELECT * FROM public.alunos LIMIT 0');
            console.log('public.alunos fields:', sample2.fields ? sample2.fields.map(f=>f.name) : []);
            const cnt = await client.query('SELECT count(*) FROM public.alunos');
            console.log('public.alunos count:', cnt.rows[0]);
        } catch (e) {
            console.log('public.alunos queries failed:', e.message);
        }
        console.log('Colunas detectadas via information_schema:', tableCols);

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

        const matriculaCandidates = ['matricula','ra','registro'];
        const nomeCandidates = ['nome_aluno','nome','nomealuno','nome_do_aluno'];
        let chosenMatCol = null;
        let chosenNomeCol = null;

        const firstValid = dados.find(l => pick(l, ['MATRICULA','RA','Matricula','REGISTRO','Registro']) && pick(l, ['NOME DO ALUNO','NOME_ALUNO','NOMEALUNO','NOME']));
        if (!firstValid) {
            throw new Error('Nenhuma linha válida encontrada na planilha para testar inserção.');
        }

        const availableColumns = new Set(tableCols.map(col => col.toLowerCase()));
        for (const m of matriculaCandidates) {
            for (const n of nomeCandidates) {
                if (availableColumns.has(m) && availableColumns.has(n)) {
                    chosenMatCol = m;
                    chosenNomeCol = n;
                    break;
                }
            }
            if (chosenMatCol && chosenNomeCol) break;
        }

        if (!chosenMatCol || !chosenNomeCol) {
            throw new Error(`Não foi possível encontrar colunas compatíveis para inserção. Colunas disponíveis: ${Array.from(availableColumns).join(', ')}`);
        }

        console.log('Usando colunas:', chosenMatCol, chosenNomeCol);

        let insertedCount = 0;
        let skippedCount = 0;

        for (const linha of dados) {
            const matricula = pick(linha, ['MATRICULA', 'RA', 'Matricula', 'REGISTRO', 'Registro']);
            const nomeAluno = pick(linha, ['NOME DO ALUNO', 'NOME_ALUNO', 'NOMEALUNO', 'NOME']);

            if (!matricula || !nomeAluno) {
                console.log('Linha ignorada (campos vazios):', linha);
                continue;
            }

            const normalizedMatricula = String(matricula).trim();
            const normalizedNome = String(nomeAluno).trim();
            const existsRes = await client.query(`SELECT 1 FROM alunos WHERE ${chosenMatCol} = $1 OR ${chosenNomeCol} = $2 LIMIT 1`, [normalizedMatricula, normalizedNome]);

            if (existsRes.rowCount > 0) {
                skippedCount += 1;
                continue;
            }

            const insertSql = `INSERT INTO alunos (${chosenMatCol}, ${chosenNomeCol}) VALUES ($1, $2)`;
            await client.query(insertSql, [normalizedMatricula, normalizedNome]);
            insertedCount += 1;
            console.log('Inserido:', normalizedMatricula, '-', normalizedNome);
        }

        console.log(`Importação concluída. Inseridos: ${insertedCount}; ignorados: ${skippedCount}.`);
    } catch (erro) {
        console.error('Erro:', erro);
    } finally {
        try { await client.end(); } catch (e) {}
    }
}

importarPlanilha();
