require('dotenv/config');
const pg = require('pg');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const ClientError = require('./client-error');
const uploadsMiddleware = require('./uploads-middleware');
const path = require('path');
const argon2 = require('argon2');

const app = express();
app.use(express.json());
app.use(staticMiddleware);

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get('/api/sounds', (req, res, next) => {
  const sql = `
  select "soundName",
  "soundId",
  "fileUrl"
  from "sounds"
  order by "uploadedAt" desc
  `;
  db.query(sql)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(err => next(err));
});

app.get('/api/sounds/:soundId', (req, res, next) => {
  const soundId = Number(req.params.soundId);
  if (!soundId) {
    throw new ClientError(400, 'soundId must be a positive integer');
  }
  const sql = `
  select "soundId",
          "soundName",
          "fileUrl"
  from "sounds"
  where "soundId" = $1
  `;
  const params = [soundId];
  db.query(sql, params)
    .then(result => {
      if (!result.rows[0]) {
        throw new ClientError(404, `cannot find sound with soundId ${soundId}`);
      }
      res.status(200).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.post('/api/sounds', uploadsMiddleware, (req, res, next) => {
  const filename = req.file.filename;
  const name = req.body.soundName;
  if (!filename) {
    throw new ClientError(400, 'does not exist');
  }
  const newUrl = path.join('/sounds', filename);
  const sql = `
  insert into "sounds" ("fileUrl", "soundName" , "userId", "uploadedAt")
  values ($1, $2, 1, now())
  returning "soundId"
  `;
  const params = [newUrl, name];
  return db.query(sql, params)
    .then(result => {
      res.status(201).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.post('api/users', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and passwords are required fields');
  }
  argon2
    .hash(password)
    .then(hashedPassword => {
      const sql = `
    insert into "users" ("username", "hahsedPassword")
    values ($1, $2)
    returning "userId", "username"
    `;
      const params = [username, hashedPassword];
      return db.query(sql, params);
    }).then(result => {
      const [user] = result.rows;
      res.status(201).json(user);
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
