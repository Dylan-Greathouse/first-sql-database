require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('videogame routes', () => {
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
          name: "Demon's Souls",
          system: 'PlayStation 3',
          played: true,
          year_released: 2009,
          image_url: 'https://images.pushsquare.com/7c0bd4ec9821f/demons-souls-ps3-playstation-3.original.jpg',
        },
      
        {
          id: 2,
          name: "Dark Souls",
          system: 'PlayStation 3',
          played: true,
          year_released: 2011,
          image_url: 'https://i.pcmag.com/imagery/lineups/002J1z9vQPxQWnT8X9LziZD-1.1569492958.fit_lim.size_1200x630.jpg',
        },
      
        {
          id: 3,
          name: "Dark Souls II",
          system: 'PlayStation 3',
          played: true,
          year_released: 2014,
          image_url: 'https://cdn.igromania.ru/mnt/articles/0/9/6/d/f/4/26444/html/img/77b44acf46db0c81.jpg',
        },
      
        {
          id: 4,
          name: "Bloodborne",
          system: 'PlayStation 4',
          played: false,
          year_released: 2015,
          image_url: 'https://media.npr.org/assets/img/2020/04/07/bb_tgs_6_wide-018769fbfe88268abddef71c79380be087068c81.jpg',
        },
      
        {
          id: 5,
          name: "Dark Souls III",
          system: 'PlayStation 3',
          played: true,
          year_released: 2016,
          image_url: 'https://media.wired.com/photos/5a3d54832db63c66d811174a/master/pass/ds3.jpg',
        },
      
        {
          id: 6,
          name: "Sekiro",
          system: 'PlayStation 4',
          played: true,
          year_released: 2019,
          image_url: 'https://img.redbull.com/images/c_crop,w_1350,h_900,x_0,y_0,f_auto,q_auto/c_scale,w_1500/redbullcom/2019/04/01/6c7e5632-5ee2-496f-81fd-f526f04ddcf5/sekiro-grappling-hook',
        },
      
        {
          id: 7,
          name: "Elden Ring",
          system: 'PlayStation 5',
          played: false,
          year_released: 2022,
          image_url: 'http://cdn.mos.cms.futurecdn.net/5Uy9G9jBLAYRsfGCheFHHC.jpg',
        }
      ];

      const data = await fakeRequest(app)
        .get('/videogames')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
    test('returns videogames end point 1', async() => {

      const expectation = 
        {
          id: 1,
          name: "Demon's Souls",
          system: 'PlayStation 3',
          played: true,
          year_released: 2009,
          image_url: 'https://images.pushsquare.com/7c0bd4ec9821f/demons-souls-ps3-playstation-3.original.jpg',
        };

      const data = await fakeRequest(app)
        .get('/videogames/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('POST /videogames creates a new videogame in data', async() => {
      const newVideogame = {
        name: "Armored Core",
        system_id: 1,
        played: false,
        year_released: 2013,
        image_url: 'N/A'
      };

      const videogamesData = await fakeRequest(app)
        .post('/videogames')
        .send(newVideogame)
        .expect(200)
        .expect('Content-type', /json/);
      expect(videogamesData.body.name).toEqual(newVideogame.name);
      expect(videogamesData.body.id).toBeGreaterThan(0);
    });

    test('PUT /videogames/:id updates videogames', async ()=>{
      const updatedData = {
        id: 1,
        name: "Demon's Souls",
        system_id: 2,
        played: true,
        year_released: 2018,
        image_url: '../assets/demon-souls-remake.jpg'
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
