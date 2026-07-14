const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { createClient } = require('./db-client.cjs');

dotenv.config();

async function runScript(scriptPath) {
    const { spawn } = require('child_process');

    return new Promise((resolve, reject) => {
        const child = spawn('node', [scriptPath], {
            stdio: 'inherit',
            env: process.env,
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

async function setupRender() {
    console.log('=== Configuração do banco no Render ===\n');

    if (!process.env.DATABASE_URL && !process.env.DB_HOST) {
        console.error('Defina DATABASE_URL ou DB_HOST/DB_NAME/DB_USER/DB_PASSWORD no .env');
        process.exit(1);
    }

    const client = createClient();

    try {
        await client.connect();
        console.log('✓ Conectado ao PostgreSQL do Render');
        await client.end();
    } catch (error) {
        console.error('✗ Não foi possível conectar ao banco:', error.message);
        console.error('\nUse a External Database URL do painel do Render no seu .env local.');
        process.exit(1);
    }

    const scripts = [
        ['recreate_tables.cjs', 'Recriando tabelas'],
        ['imports/importar_alunos.cjs', 'Importando alunos'],
        ['imports/importar_gestao.cjs', 'Importando gestores'],
        ['imports/importar_dados.cjs', 'Importando posts e links'],
        ['imports/importar_eventos.cjs', 'Importando eventos'],
        ['update_passwords.cjs', 'Atualizando senhas'],
    ];

    for (const [relativePath, label] of scripts) {
        const scriptPath = path.join(__dirname, relativePath);
        if (!fs.existsSync(scriptPath)) {
            console.log(`⚠ Pulando ${label}: arquivo não encontrado`);
            continue;
        }

        console.log(`\n--- ${label} ---`);
        await runScript(scriptPath);
        console.log(`✓ ${label}`);
    }

    console.log('\n=== Banco do Render pronto! ===');
    console.log('Agora faça o redeploy do serviço web no Render.');
}

setupRender().catch((error) => {
    console.error('\n✗ Erro:', error.message);
    process.exit(1);
});
