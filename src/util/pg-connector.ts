import { Pool } from 'pg';

const db = new Pool({
    database: 'postgres',
    host: process.env.INVENTORY_URL || 'localhost',
    password: process.env.INVENTORY_PASSWORD || 'p4ssw0rd',
    port: 5432,
    user: process.env.INVENTORY_USER || 'inventory_user',
});

export async function closePool() {
    await db.end();
}

export default db;
