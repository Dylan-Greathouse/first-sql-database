require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');
const systemData = require('../data/systems.js');

describe('system routes', () => {
   
  beforeAll(async () => {
    execSync('npm run setup-db');
  
    await client.connect();
    const signInData = await fakeRequest(app)
      .post('/auth/signup')
      .send({
        email: 'jon@user.com',
        password: '1234'
      });
      
      token = signInData.body.token; // eslint-disable-line
  }, 20000);
  
  afterAll(done => {
    return client.end(done);
  });

  test('return list of systems', async() => {

    const expectation = systemData.map(system => system.console);

    const data = await fakeRequest(app)
      .get('/systems')
      .expect('Content-Type', /json/)
      .expect(200);
    const systemNames = data.body.map(system => system.console);
    expect(systemNames).toEqual(expectation);
    expect(systemNames.length).toBe(systemNames.length);
    expect(data.body[0].id).toBeGreaterThan(0);
  });
});
