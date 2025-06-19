const pool = require('../config/db');

describe('Database Connection', () => {
    test('create a pool instance', () => {
        expect(pool).toBeDefined();
        expect(typeof pool.query).toBe('function');
    });

    test('DB connection testing', async () => {
        const client = await pool.connect();
        expect(client).toBeDefined();
        client.release();
    });
})