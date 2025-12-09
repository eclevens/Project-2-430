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
const { engine } = require('express-handlebars'); // fixed import

const router = require('./router.js');

const PORT = process.env.PORT || 3001; // backend different than front at 3000

// Create Express app immediately
const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// React dev server CORS
app.use(cors({
  origin: 'http://localhost:3000', // react dev server
  credentials: true,
}));

// Sessions with Redis
const redisClient = redis.createClient({ url: process.env.REDISCLOUD_URL });

redisClient.on('error', (err) => console.log('Redis Client Error:', err));

app.use(session({
  key: 'sessionid',
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}));

// Static assets
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted`)));

// Set Handlebars as view engine
app.engine('handlebars', engine()); // <-- use engine() here
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views')); // points to /server/views

// API routes
router(app);

// Handlebars route for /about
app.get('/about', (req, res) => {
  res.render('about', { layout: false });
});

// React production build serving
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  // react fallback
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Start server after connecting to MongoDB and Redis
const startServer = async () => {
  try {
    // MongoDB
    const dbURI = process.env.MONGODB_URI || 'mongodb://localhost/DomoMaker'; // still called domo but does not have domo code, it's just called domo
    await mongoose.connect(dbURI);
    console.log('MongoDB connected');

    // Redis
    await redisClient.connect();
    console.log('Redis connected');

    // Express server
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

startServer();
