const request = require('supertest');


const app = require('../app');

test('Homepage test', async () => {
    const reponse = await request(app).get('/');
    expect(reponse.text).toBe('Homepage!');
});