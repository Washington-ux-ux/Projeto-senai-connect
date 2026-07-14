const { Client } = require('pg');

function createClient(database) {
    if (process.env.DATABASE_URL) {
        return new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
        });
    }

    const host = process.env.DB_HOST || '';
    const isRemote = host.includes('render.com');

    return new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
        database: database || process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD) : undefined,
        ...(isRemote ? { ssl: { rejectUnauthorized: false } } : {}),
    });
}

module.exports = { createClient };
