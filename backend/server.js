/*require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const AuthRoutes = require('./Routes/AuthRoutes');
const SessionRoutes = require('./Routes/SessionRoutes');


const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

app.use('/api/auth', AuthRoutes);
app.use('/api/sessions', SessionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/", (req, res) => {
    res.send("API running");
});
*/ star

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const AuthRoutes = require('./Routes/AuthRoutes');
const SessionRoutes = require('./Routes/SessionRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors()); // 🔑 THIS LINE IS CRITICAL

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

app.use('/api/auth', AuthRoutes);
app.use('/api/sessions', SessionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));