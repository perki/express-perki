process.env.NODE_ENV = 'test';
const path = require('path');
require('boiler').init({
  appName: `app:${process.pid}`, // This will will be prefixed to any log messages
  baseFilesDir: path.resolve(__dirname, '../../'), // use for file:// relative path if not give cwd() will be used
  baseConfigDir: path.resolve(__dirname, '../../config')
});

const request = require('supertest');
const { getApp } = require('../../src/server');
const assert = require('node:assert/strict');

module.exports = {
  init,
  apiTest
};

let app = null;

/**
 * Initalize the server, to be run once before the tests.
 * @returns {Promise<null>}
 */
async function init () {
  app = await getApp();
}

/**
 * Get a supertest Request boun to the server app
 * @param {AgentOptions|undefined} options to pass to supertest
 * @returns {TestAgent}
 */
function apiTest (options) {
  if (app === null) throw new Error('Call testServer.init() first');
  return request(app, options);
}
