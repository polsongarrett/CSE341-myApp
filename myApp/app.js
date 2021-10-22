const path = require('path');
const http = require('http'); // imported for creating a server
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const dotenv = require('dotenv');

dotenv.config();

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = "mongodb+srv://user1:fFWr3lKfHj2NXlJF@cluster0.rcm5v.mongodb.net/shop";

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine', 'ejs'); // change based on engine: pug, hbs, ejs
app.set('views', 'views'); // default where to find templates

// Registered routes
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth')
const corsOptions = {
  origin: "https://<your_app_name>.herokuapp.com/",
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session(
    {
      secret: 'my secret',
      resave: false,
      saveUninitialized: false,
      store: store
    }
  )
);

app.use(csrfProtection); 
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
  .then(user => {
    if (!user) {
      return next();
    }
    req.user = user; // Mongoose model user object
    next();
  })
  .catch(err => {
    throw new Error(err);
  });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);
app.use(errorController.get404);
app.use((error, req, res, next) => {
  res.redirect('/500');
});


const MONGODB_URL = process.env.MONGODB_URL || MONGODB_URI;
let port = process.env.PORT || 3000;

// app.listen(port);

mongoose
  .connect(MONGODB_URL)
  .then(result => {
    app.listen(port);
  })
  .catch(err => {
    console.log(err);
  });