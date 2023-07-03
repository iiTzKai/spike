import bodyParser from 'body-parser';
import 'dotenv/config';
import express, { json } from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import path from 'path';
import socketIO from 'socket.io';
import { googleRoute } from './src/routes/googleRoute';
import { imapRoute } from './src/routes/imapRoute';
import { mongodbRoute } from './src/routes/mongodbRoute';
import { chatRoute } from './src/routes/chatRoute';

// const mongodbUri = `mongodb+srv://admin:${process.env.MONGODB_PASS}@spike.icywfkd.mongodb.net/?retryWrites=true&w=majority`;
const mongodbUri = 'mongodb://localhost:27017/Spike';

async function connectToMongodb() {
  mongoose.Promise = global.Promise;
  await mongoose.connect(mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

connectToMongodb();

const app = express();
const http = require('http').createServer(app);
const io = socketIO(http);
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(json());
app.use(express.static(path.join(__dirname, 'src/client/build')));
app.use(
  session({
    secret: 'super-secret-key-spike', // change this in prod
    resave: false,
    saveUninitialized: false,
  }),
);

googleRoute(app);
mongodbRoute(app);
imapRoute(app);
chatRoute(app);

app.use((req, res) => {
  res.status(404).json({ error: 'not found' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/client/build/index.html'));
});

io.on('connection', (socket) => {
  console.log(`user login in ${socket.id}`);

  socket.on('fetch_history', async (data) => {});

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

http.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
