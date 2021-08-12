require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
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

    test('returns videogames', async() => {

      const expectation = [
        {
          id: 1,
          name: "Demon's-Souls",
          system: "PlayStation3",
          played: true,
      
        },
      
        {
          id: 2,
          name: "Demon's-Souls-II",
          system: "PlayStation3",
          played: true,
          
        },
      
        {
          id: 3,
          name: "Demon's-Souls-III",
          system: "PlayStation3",
          played: true,
          
        },
      
        {
          id: 4,
          name: "Bloodborne",
          system: "PlayStation4",
          played: false,
          
        },
      
        {
          id: 5,
          name: "Sekiro",
          system: "PlayStation 4",
          played: true,
          
        },
      
        {
          id: 6,
          name: "Elden-Ring",
          system: "PlayStation5",
          played: false,
          
        }
      ];

      const data = await fakeRequest(app)
        .get('/videogames')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
    test('returns videogames end point 1', async() => {

      const expectation = [
        {
          id: 1,
          name: "Demon's-Souls",
          system: "PlayStation3",
          played: true,
      
        }
      ];

      const data = await fakeRequest(app)
        .get('/videogames/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});
