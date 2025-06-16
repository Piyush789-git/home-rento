// Core Module
const path = require('path');

// External Module
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const multer = require('multer');
const DB_PATH="mongodb+srv://pikumarjee:piyush%40123@procoder.ls3uh.mongodb.net/airbnb?retryWrites=true&w=majority&appName=Procoder"

//Local Module
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");
const paymentRoutes = require('./routes/payment');
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");

const { default: mongoose } = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

const store = new MongoDBStore({
  uri: DB_PATH,
  collection: 'sessions'
});
const randomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, randomString(10)+ '-' + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const multerOptions = {
  storage: storage,
  fileFilter: fileFilter,
}

app.use(multer(multerOptions).single('photo'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
app.use("/host/uploads", express.static(path.join(__dirname, 'uploads')));
app.use("/home/uploads", express.static(path.join(__dirname, 'uploads')));
app.use("/host/uploads", express.static(path.join(__dirname, 'uploads')));
app.use("/book/uploads", express.static(path.join(__dirname, 'uploads')));

// session middleware
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
  store: store,
}));

// Set isLoggedIn for all routes
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.user = req.session.user;
  next();
});

// Routes
app.use(authRouter);
app.use(storeRouter);
app.use("/host", hostRouter);
app.use('/payment', paymentRoutes);

// Error handling
app.use(errorsController.get404);

const PORT = 3000;

mongoose.connect(DB_PATH).then(() => {
  console.log("Connected to MongoDB successfully");
  app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  });
}).catch(err => {
  console.log("Error while connecting to MongoDB: ", err);
});