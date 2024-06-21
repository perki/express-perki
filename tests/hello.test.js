require('./helpers/testServer');
const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');
const { init: initTestServer, apiTest } = require('./helpers/testServer');

describe('[HELO] HELLO', () => {
  before(async () => {
    await initTestServer();
  });

  it('[HELG] GET /hello', async () => {
    const response = await apiTest().get('/hello');
    assert.equal(response.status, 200);
    assert.equal(response.body.hello, 'Who are you?');
  });

  it('[USEP] POST /hello', async () => {
    const response = await apiTest().post('/hello').send({ from: 'bob' });
    assert.equal(response.status, 200);
    assert.equal(response.body.hello, 'Hello bob!');
  });

  it('[HELG] GET /hello/auth rejected', async () => {
    const response = await apiTest().get('/hello/auth');
    assert.equal(response.status, 401);
    assert.deepEqual(response.body, { error: 'User must be logged in' });
  });
});
