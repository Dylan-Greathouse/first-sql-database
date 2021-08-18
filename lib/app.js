const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/systems', async(req, res) => {
  try {
    const data = await client.query('SELECT * from systems');
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/videogames', async(req, res) => {
  try {
    const data = await client.query(`SELECT 
      videogames.id,
      videogames.name,
      videogames.played,
      videogames.year_released,
      videogames.image_url,
      systems.console AS system
      FROM videogames INNER JOIN systems
      ON videogames.system_id = systems.id
      ORDER BY videogames.id`);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/videogames/:id', async(req, res) => {
  const id = req.params.id;
  try {
    const data = await client.query(`SELECT 
      videogames.id,
      videogames.name,
      videogames.played,
      videogames.year_released,
      videogames.image_url,
      systems.console AS system
      FROM videogames INNER JOIN systems
      ON videogames.system_id = systems.id
      WHERE videogames.id = $1`, [id]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

// name: "Demon's-Souls",
// system: "PlayStation3",
// played: true,
// year_released: 2011

app.post('/videogames', async(req, res) => {
  const { name, system_id, played, year_released, image_url } = req.body;

  try {
    const videogamesData = await client.query(`
    INSERT INTO videogames(
      name,
      system_id,
      played,
      year_released,
      image_url
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING *`, [
      name,
      system_id,
      played,
      year_released,
      image_url
    ]);
    
    res.json(videogamesData.rows[0]);
  }catch(e){
    res.status(500).json({ error: e.message });
  }
});

app.put('/videogames/:id', async(req, res) =>{
  const { id, name, system_id, played, year_released, image_url } = req.body;
  try{
    const videogamesData = await client.query(`
    UPDATE videogames
    SET
      name=$2,
      system_id=$3,
      played=$4,
      year_released=$5,
      image_url=$6
      WHERE id = $1
      RETURNING *`,
    [
      id,
      name,
      system_id,
      played,
      year_released,
      image_url
    ]);
    res.json(videogamesData.rows[0]);
  }catch(e){
    res.status(500).json({ error: e.message });  
  }
});


app.use(require('./middleware/error'));

module.exports = app;
