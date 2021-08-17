const client = require('../lib/client');
// import our seed data:
const videogamesData = require('./videogames.js');
const systemData = require('./systems.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();
// id: 1,
// name: "Demon's-Souls",
// system: "PlayStation3",
// played: true,
// year_released


async function run() {

  try {
    await client.connect();

    await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    await Promise.all(
      systemData.map(system => {
        return client.query(
          `
          INSERT INTO systems (console)
          VALUES ($1)
          RETURNING *;
          `,
          [system.console]);
      })
    );


    await Promise.all(
      videogamesData.map(videogame => {
        return client.query(`
                    INSERT INTO videogames (
                    name,
                    system_id,
                    played,
                    year_released)
                    VALUES ($1, $2, $3, $4)
                    RETURNING *;
                `,
        [videogame.name,
          videogame.system_id,
          videogame.played,
          videogame.year_released
        ]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
