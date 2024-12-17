require('dotenv').config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath, fileUrlToPath } from 'url';

const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;
const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express();
app.use(express.json());

const corsOptions = {
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

const mainRoute = require('./routes/mainRoute');
app.use('/', mainRoute);
const usersRoute = require('./routes/usersRoute');
app.use('/api/usrs', usersRoute);
const projectRoute = require('./routes/projectRoute');
app.use('/api/prj', projectRoute);

app.use(express.static(path.join(__dirname, '/client/public')));
app.get('*', (req, res) => 
  res.sendFile(__dirname, '/client/public/index.html')
);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

mongoose.connect(DB_URL, {
  dbName: DB_NAME
})
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.error('Error connecting to database:', err.message);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});