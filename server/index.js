require('dotenv/config');
const pg = require('pg');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const ClientError = require('./client-error');
const uploadsMiddleware = require('./uploads-middleware');

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
  const { fileUrl } = req.body;
  if (!fileUrl) {
    throw new ClientError(400, 'file name must be a string');
  }
  const sql = `
  insert into "sounds" ("fileUrl", "soundName" , "userId", "uploadedAt")
  values ($1, 'hi', 1, now())
  returning "soundId"
  `;
  const params = [fileUrl];
  return db.query(sql, params)
    .then(result => {
      res.status(201).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
