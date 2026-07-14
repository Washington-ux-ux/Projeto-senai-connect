const dotenv = require('dotenv');
const { createClient } = require('./db-client.cjs');

dotenv.config();

async function recreateTables() {
    const client = createClient();

    try {
        await client.connect();
        console.log('Conectado ao PostgreSQL.');

        console.log('Removendo tabelas antigas...');
        await client.query('DROP TABLE IF EXISTS reactions CASCADE');
        await client.query('DROP TABLE IF EXISTS links CASCADE');
        await client.query('DROP TABLE IF EXISTS posts CASCADE');
        await client.query('DROP TABLE IF EXISTS academic_events CASCADE');
        await client.query('DROP TABLE IF EXISTS gestores CASCADE');
        await client.query('DROP TABLE IF EXISTS alunos CASCADE');
        await client.query('DROP TABLE IF EXISTS users CASCADE');

        console.log('Criando tabela alunos...');
        await client.query(`
            CREATE TABLE alunos (
                id INTEGER PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                registration VARCHAR(50) UNIQUE NOT NULL,
                role VARCHAR(20) DEFAULT 'STUDENT',
                password VARCHAR(255) DEFAULT '123321',
                createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Criando tabela gestores...');
        await client.query(`
            CREATE TABLE gestores (
                id INTEGER PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                registration VARCHAR(50) UNIQUE NOT NULL,
                role VARCHAR(20) DEFAULT 'TEACHER',
                cargo VARCHAR(255),
                password VARCHAR(255) DEFAULT '123321',
                createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Criando tabela posts...');
        await client.query(`
            CREATE TABLE posts (
                id VARCHAR(50) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                summary TEXT,
                category VARCHAR(50) NOT NULL,
                visibility TEXT[],
                author_name VARCHAR(255),
                author_id VARCHAR(50),
                reactions JSONB DEFAULT '{"like": 0, "claps": 0}',
                attachmentUrl TEXT,
                imageUrl TEXT DEFAULT 'aviso1.png',
                eventDate DATE,
                location VARCHAR(255) DEFAULT 'SENAI Areias',
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Criando tabela links...');
        await client.query(`
            CREATE TABLE links (
                id VARCHAR(50) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                url TEXT NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Criando tabela reactions...');
        await client.query(`
            CREATE TABLE reactions (
                id SERIAL PRIMARY KEY,
                post_id VARCHAR(50) NOT NULL,
                reactions JSONB DEFAULT '{}',
                user_reactions JSONB DEFAULT '{}',
                UNIQUE(post_id)
            )
        `);

        console.log('Criando tabela academic_events...');
        await client.query(`
            CREATE TABLE academic_events (
                id VARCHAR(50) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                type VARCHAR(50) DEFAULT 'EVENT',
                "startDate" TIMESTAMP NOT NULL,
                "endDate" TIMESTAMP,
                location VARCHAR(255),
                author_id VARCHAR(50),
                author_name VARCHAR(255),
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Criando índices...');
        await client.query('CREATE INDEX idx_posts_category ON posts(category)');
        await client.query('CREATE INDEX idx_posts_author ON posts(author_id)');
        await client.query('CREATE INDEX idx_posts_created ON posts(createdAt)');
        await client.query('CREATE INDEX idx_reactions_post ON reactions(post_id)');
        await client.query('CREATE INDEX idx_alunos_registration ON alunos(registration)');
        await client.query('CREATE INDEX idx_gestores_registration ON gestores(registration)');

        console.log('Verificando tabelas criadas...');
        const tables = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `);
        console.log('Tabelas no banco:', tables.rows.map(r => r.table_name));

        const alunosCols = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'alunos' 
            ORDER BY ordinal_position
        `);
        console.log('Colunas da tabela alunos:', alunosCols.rows.map(r => r.column_name));

        const gestoresCols = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'gestores' 
            ORDER BY ordinal_position
        `);
        console.log('Colunas da tabela gestores:', gestoresCols.rows.map(r => r.column_name));

        console.log('✓ Tabelas criadas com sucesso!');

    } catch (erro) {
        console.error('Erro:', erro);
        process.exit(1);
    } finally {
        try { await client.end(); } catch (e) {}
    }
}

recreateTables();
