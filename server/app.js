require('dotenv').config();

const path = require('path');
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const redis = require('redis');
const { RedisStore } = require('connect-redis');

const router = require('./router.js');

const PORT = process.env.PORT || 3001; //backend different than front at 3000

//mongodb
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost/DomoMaker';
mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

//redis
const redisClient = redis.createClient({ url: process.env.REDISCLOUD_URL });

redisClient.on('error', (err) => console.log('Redis Client Error:', err));

redisClient.connect()
  .then(() => {
    const app = express();

    app.use(helmet());
    app.use(compression());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // react
    app.use(cors({
      origin: 'http://localhost:3000', // react dev server
      credentials: true,
    }));

    // sessions with Redis
    app.use(session({
      key: 'sessionid',
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SESSION_SECRET || 'supersecret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      },
    }));

    // static assets if needed
    app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted`)));

    // api routes
    router(app);

    // react
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/build')));
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
      });
    }

    //start server
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect Redis:', err);
    process.exit(1);
  });