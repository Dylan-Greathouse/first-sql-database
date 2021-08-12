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
          year_released: 2011,
        },
      
        {
          id: 2,
          name: "Demon's-Souls-II",
          system: "PlayStation3",
          played: true,
          year_released: 2014,
        },
      
        {
          id: 3,
          name: "Demon's-Souls-III",
          system: "PlayStation3",
          played: true,
          year_released: 2016,
          
        },
      
        {
          id: 4,
          name: "Bloodborne",
          system: "PlayStation4",
          played: false,
          year_released: 2015,
          
        },
      
        {
          id: 5,
          name: "Sekiro",
          system: "PlayStation 4",
          played: true,
          year_released: 2019,
        },
      
        {
          id: 6,
          name: "Elden-Ring",
          system: "PlayStation5",
          played: false,
          year_released: 2022,
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
          year_released: 2011,
        }
      ];

      const data = await fakeRequest(app)
        .get('/videogames/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('POST /videogames creates a new videogame in data', async() => {
      const newVideogame = {
        name: "Ninja-Blade",
        system: "Xbox360",
        played: false,
        year_released: 2009
      };

      const videogamesData = await fakeRequest(app)
        .post('/videogames')
        .send(newVideogame)
        .expect(200)
        .expect('Content-type', /json/);
      // console.log(videogamesData);
      expect(videogamesData.body.name).toEqual(newVideogame.name);
      expect(videogamesData.body.id).toBeGreaterThan(0);
    });

    test('PUT /videogames/:id updates videogames', async ()=>{
      const updatedData = {
        id: 1,
        name: "Demon's-Souls",
        system: "PlayStation4",
        played: true,
        year_released: 2018
      };
      const videogameData = await fakeRequest(app)
        .put('/videogames/1')
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /json/);
      expect(videogameData.body.system).toEqual(updatedData.system);
      expect(videogameData.body.year_released).toEqual(updatedData.year_released);
    });
  });
});
