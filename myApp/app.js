const path = require('path');
const http = require('http'); // imported for creating a server

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const app = express();
// const expressHbs = require('express-handlebars');
// app.engine('hbs', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layout', extname: 'hbs'}));

app.set('view engine', 'ejs'); // change based on engine: pug, hbs, ejs
app.set('views', 'views'); // default where to find templates

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

let port = process.env.PORT || 3000;

app.listen(port);
