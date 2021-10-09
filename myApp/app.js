const path = require('path');
const http = require('http'); // imported for creating a server
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs'); // change based on engine: pug, hbs, ejs
app.set('views', 'views'); // default where to find templates

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop');
const corsOptions = {
  origin: "https://<your_app_name>.herokuapp.com/",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('615f2d447491351e3b129cde')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://user1:fFWr3lKfHj2NXlJF@cluster0.rcm5v.mongodb.net/shop?retryWrites=true&w=majority";
let port = process.env.PORT || 3000;

// app.listen(port);

mongoose
  .connect(MONGODB_URL)
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Garrett',
          email: 'gp@gmail.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    })
    app.listen(port);
  })
  .catch(err => {
    console.log(err);
  });







