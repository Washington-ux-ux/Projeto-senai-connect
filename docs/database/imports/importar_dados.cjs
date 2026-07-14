const dotenv = require('dotenv');
const path = require('path');
const { createClient } = require('../db-client.cjs');
const fs = require('fs');

dotenv.config();

async function importarDados() {
    const client = createClient();

    try {
        await client.connect();
        console.log('Conectado ao PostgreSQL.');

        console.log('\n--- Importando POSTS ---');
        const postsPath = path.resolve(process.cwd(), 'src', 'data', 'posts.json');
        const postsData = JSON.parse(fs.readFileSync(postsPath, 'utf-8'));

        let postsInserted = 0;
        let postsSkipped = 0;

        for (const post of postsData) {
            const existsRes = await client.query('SELECT 1 FROM posts WHERE id = $1 LIMIT 1', [post.id]);

            if (existsRes.rowCount > 0) {
                postsSkipped += 1;
                continue;
            }

            const authorName = post.author?.name || post.authorName || 'Desconhecido';
            const authorId = post.author?.id || post.authorId || null;
            const visibility = Array.isArray(post.visibility) ? post.visibility : ['ALL'];
            const reactions = post.reactions || { like: 0, claps: 0 };

            await client.query(
                `INSERT INTO posts (id, title, summary, category, visibility, author_name, author_id, reactions, attachmentUrl, imageUrl, eventDate, location, createdat)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
                [
                    post.id,
                    post.title,
                    post.summary || '',
                    post.category || 'ANNOUNCEMENT',
                    visibility,
                    authorName,
                    authorId,
                    JSON.stringify(reactions),
                    post.attachmentUrl || '',
                    post.imageUrl || 'aviso1.png',
                    post.eventDate || new Date().toISOString().split('T')[0],
                    post.location || 'SENAI Areias',
                    post.createdAt || new Date().toISOString()
                ]
            );
            postsInserted += 1;
        }

        console.log(`Posts - Inseridos: ${postsInserted}; Ignorados: ${postsSkipped}`);

        console.log('\n--- Importando LINKS ---');
        const linksPath = path.resolve(process.cwd(), 'src', 'data', 'links.json');
        const linksData = JSON.parse(fs.readFileSync(linksPath, 'utf-8'));

        let linksInserted = 0;
        let linksSkipped = 0;

        for (const link of linksData) {
            const existsRes = await client.query('SELECT 1 FROM links WHERE id = $1 LIMIT 1', [link.id]);

            if (existsRes.rowCount > 0) {
                linksSkipped += 1;
                continue;
            }

            await client.query(
                `INSERT INTO links (id, name, description, url, createdat)
                 VALUES ($1, $2, $3, $4, $5)`,
                [
                    link.id,
                    link.name,
                    link.description || '',
                    link.url,
                    link.createdAt || new Date().toISOString()
                ]
            );
            linksInserted += 1;
        }

        console.log(`Links - Inseridos: ${linksInserted}; Ignorados: ${linksSkipped}`);

        console.log('\n✅ Importação de dados concluída com sucesso!');

    } catch (erro) {
        console.error('❌ Erro durante importação:', erro);
    } finally {
        try { await client.end(); } catch (e) {}
    }
}

importarDados();
