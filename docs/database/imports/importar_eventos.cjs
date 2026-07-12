const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config();

async function importarEventos() {
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

        // Exemplos de eventos
        const eventos = [
            {
                id: '1',
                title: 'Feriado Nacional',
                description: 'Feriado nacional - dia da Independência',
                type: 'HOLIDAY',
                startDate: '2026-09-07T00:00:00',
                endDate: '2026-09-07T23:59:59',
                location: 'Brasil',
                author_id: null,
                author_name: 'Sistema'
            },
            {
                id: '2',
                title: 'Reunião de Pais',
                description: 'Reunião de pais e responsáveis',
                type: 'MEETING',
                startDate: '2026-08-15T19:00:00',
                endDate: '2026-08-15T21:00:00',
                location: 'Auditório SENAI',
                author_id: '2',
                author_name: 'Mariana Alves Souza'
            },
            {
                id: '3',
                title: 'Prova Final',
                description: 'Prova final do semestre',
                type: 'EXAM',
                startDate: '2026-07-20T08:00:00',
                endDate: '2026-07-20T12:00:00',
                location: 'Sala 101',
                author_id: '2',
                author_name: 'Mariana Alves Souza'
            },
            {
                id: '4',
                title: 'Semana Tecnológica',
                description: 'Semana de tecnologia e inovação',
                type: 'EVENT',
                startDate: '2026-08-01T09:00:00',
                endDate: '2026-08-05T18:00:00',
                location: 'SENAI Areias',
                author_id: '2',
                author_name: 'Mariana Alves Souza'
            },
            {
                id: '5',
                title: 'Dia do Estudante',
                description: 'Comemoração do dia do estudante',
                type: 'HOLIDAY',
                startDate: '2026-08-11T00:00:00',
                endDate: '2026-08-11T23:59:59',
                location: 'SENAI Areias',
                author_id: null,
                author_name: 'Sistema'
            }
        ];

        let inserted = 0;
        let skipped = 0;

        for (const evento of eventos) {
            const existsRes = await client.query('SELECT 1 FROM academic_events WHERE id = $1 LIMIT 1', [evento.id]);

            if (existsRes.rowCount > 0) {
                skipped += 1;
                continue;
            }

            await client.query(
                `INSERT INTO academic_events (id, title, description, type, "startDate", "endDate", location, author_id, author_name, "createdAt")
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                [
                    evento.id,
                    evento.title,
                    evento.description,
                    evento.type,
                    evento.startDate,
                    evento.endDate,
                    evento.location,
                    evento.author_id,
                    evento.author_name,
                    new Date().toISOString()
                ]
            );
            inserted += 1;
        }

        console.log(`Eventos - Inseridos: ${inserted}; Ignorados: ${skipped}`);
        console.log('✅ Importação de eventos concluída com sucesso!');

    } catch (erro) {
        console.error('❌ Erro durante importação:', erro);
    } finally {
        try { await client.end(); } catch (e) {}
    }
}

importarEventos();
