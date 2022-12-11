require('dotenv/config');
const pg = require('pg');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const ClientError = require('./client-error');
const uploadsMiddleware = require('./uploads-middleware');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const authorizationMiddleware = require('./auth-middleware');

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

app.post('/api/users/sign-up', uploadsMiddleware, (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and passwords are required fields');
  }
  argon2
    .hash(password)
    .then(hashedPassword => {
      const sql = `
    insert into "users" ("username", "hashedPassword")
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

app.post('/api/users/sign-in', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(401, 'invalid login');
  }
  const sql = `
    select "userId",
           "hashedPassword"
      from "users"
     where "username" = $1
  `;
  const params = [username];
  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'invalid login');
      }
      const { userId, hashedPassword } = user;
      if (userId === 1 && hashedPassword === 'demo') {
        const payload = { userId, username };
        const token = jwt.sign(payload, process.env.TOKEN_SECRET);
        res.json({ token, user: payload });
      }
      return argon2
        .verify(hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid login');
          }
          const payload = { userId, username };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.json({ token, user: payload });
        });
    })
    .catch(err => next(err));
});

app.use(authorizationMiddleware);

app.delete('/api/bookmarks/:soundId', (req, res, next) => {
  const userId = req.user.userId;
  const soundId = Number(req.params.soundId);
  if (!req.user.userId) {
    throw new ClientError(401, 'invalid login');
  }
  const sql = `
  delete from "bookmarks"
  where "userId" = $1
  and "soundId" = $2
  `;
  const params = [userId, soundId];
  db.query(sql, params)
    .then(result => {
      res.sendStatus(204);
    })
    .catch(err => next(err));
});

app.get('/api/bookmarks/:soundId', (req, res, next) => {
  const userId = req.user.userId;
  const soundId = Number(req.params.soundId);
  if (!req.user.userId) {
    throw new ClientError(401, 'invalid login');
  }
  const sql = `
  select "userId",
          "soundId"
  from "bookmarks"
  where "userId" = $1
  and "soundId" = $2
  `;
  const params = [userId, soundId];
  db.query(sql, params)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(err => next(err));
});

app.get('/api/bookmarks', (req, res, next) => {
  const userId = req.user.userId;
  const sql = `
  select "b"."soundId",
          "s"."soundName",
          "s"."fileUrl"
  from "bookmarks" as "b"
  join "sounds" as "s" using ("soundId")
  where "b"."userId" = $1
  order by "b"."uploadedAt" desc
  `;
  const params = [userId];
  db.query(sql, params)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(err => next(err));
});

app.post('/api/bookmarks', uploadsMiddleware, (req, res, next) => {
  const userId = req.user.userId;
  const soundId = req.body.soundId;
  if (!req.user.userId) {
    throw new ClientError(401, 'invalid login');
  }
  const sql = `
  insert into "bookmarks" ("userId", "soundId", "uploadedAt")
  values ($1, $2, now())
  `;
  const params = [userId, soundId];
  return db.query(sql, params)
    .then(result => {
      res.status(201).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.post('/api/sounds', uploadsMiddleware, (req, res, next) => {
  const userId = req.user.userId;
  const filename = req.file.location;
  const name = req.body.soundName;
  if (!filename) {
    throw new ClientError(400, 'does not exist');
  }
  const sql = `
  insert into "sounds" ("fileUrl", "soundName" , "userId", "uploadedAt")
  values ($1, $2, $3, now())
  returning "soundId"
  `;
  const params = [filename, name, userId];
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
