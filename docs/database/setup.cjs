const dotenv = require('dotenv');
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

dotenv.config();

async function setup() {
    console.log('=== Configuração completa do banco de dados ===\n');

    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
        database: 'postgres',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD) : undefined,
    });

    try {
        await client.connect();
        console.log('✓ Conectado ao PostgreSQL');

        console.log('\n--- Criando banco de dados ---');
        const dbExists = await client.query(
            "SELECT 1 FROM pg_database WHERE datname = $1",
            [process.env.DB_NAME]
        );

        if (dbExists.rows.length === 0) {
            await client.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
            console.log(`✓ Banco de dados "${process.env.DB_NAME}" criado`);
        } else {
            console.log(`✓ Banco de dados "${process.env.DB_NAME}" já existe`);
        }

        await client.end();

        const projectClient = new Client({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD) : undefined,
        });

        await projectClient.connect();
        console.log('✓ Conectado ao banco de dados do projeto');

        console.log('\n--- Recriando tabelas ---');
        const recreateTablesPath = path.join(__dirname, 'recreate_tables.cjs');
        if (fs.existsSync(recreateTablesPath)) {
            await runScript(recreateTablesPath);
            console.log('✓ Tabelas recriadas');
        } else {
            console.log('✗ Script recreate_tables.cjs não encontrado');
        }

        console.log('\n--- Importando alunos e gestores ---');
        const importarAlunosPath = path.join(__dirname, 'imports', 'importar_alunos.cjs');
        const importarGestaoPath = path.join(__dirname, 'imports', 'importar_gestao.cjs');

        if (fs.existsSync(importarAlunosPath) && fs.existsSync(importarGestaoPath)) {
            await runScript(importarAlunosPath);
            await runScript(importarGestaoPath);
            console.log('✓ Alunos e gestores importados');
        } else {
            console.log('⚠ Scripts de importação não encontrados (pode não ter arquivos Excel)');
        }

        console.log('\n--- Importando posts e links ---');
        const importarDadosPath = path.join(__dirname, 'imports', 'importar_dados.cjs');
        if (fs.existsSync(importarDadosPath)) {
            await runScript(importarDadosPath);
            console.log('✓ Posts e links importados');
        } else {
            console.log('✗ Script importar_dados.cjs não encontrado');
        }

        console.log('\n--- Importando eventos de exemplo ---');
        const importarEventosPath = path.join(__dirname, 'imports', 'importar_eventos.cjs');
        if (fs.existsSync(importarEventosPath)) {
            await runScript(importarEventosPath);
            console.log('✓ Eventos de exemplo importados');
        } else {
            console.log('✗ Script importar_eventos.cjs não encontrado');
        }

        console.log('\n--- Atualizando senhas ---');
        const updatePasswordsPath = path.join(__dirname, 'update_passwords.cjs');
        if (fs.existsSync(updatePasswordsPath)) {
            await runScript(updatePasswordsPath);
            console.log('✓ Senhas atualizadas para texto plano (123321)');
        } else {
            console.log('✗ Script update_passwords.cjs não encontrado');
        }

        await projectClient.end();

        console.log('\n=== Configuração concluída com sucesso! ===');
        console.log('\nVocê pode agora iniciar o servidor com: npm run dev');

    } catch (erro) {
        console.error('\n✗ Erro durante a configuração:', erro.message);
        process.exit(1);
    }
}

async function runScript(scriptPath) {
    return new Promise((resolve, reject) => {
        const { spawn } = require('child_process');
        const child = spawn('node', [scriptPath], {
            stdio: 'inherit',
            env: process.env
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Script exited with code ${code}`));
            }
        });
    });
}

setup();
