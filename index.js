const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const apiKeyMiddleware = require(`${__dirname}/./middleware/apikey`);
const limiter = require(`${__dirname}/./middleware/rateLimiter`);
const removeWhitespace = require(`${__dirname}/./middleware/removeWhitespaces`);
const mongoose = require('mongoose');
const auth = require('./routes/auth');
const UPP = require('./routes/photoUpdate');
const emailVerify = require('./routes/EmailOTPVerify');
const products = require('./routes/Products');
const cart = require('./routes/Cart');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
app.set('trust proxy', 1);

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

const EventEmitter = require('events');
const bus = new EventEmitter();
bus.setMaxListeners(20);

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(apiKeyMiddleware);
// app.use(limiter);
app.use(removeWhitespace);

// Route setup
app.use('/api/auth', auth);
app.use('/api/upload', UPP);
app.use('/api/eVerify', emailVerify);
app.use('/api/product', products);
app.use('/api/cart', cart);

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to my Node.js backend!');
});

// Server setup
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error: ', err));
