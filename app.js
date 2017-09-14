const express = require('express');
const app = express();  //Init app

const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const router = express.Router();

const mongo = require('mongodb');
const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/accounts'); //deprecated
const mongooseC = mongoose.connect('mongodb://localhost:27017/accounts', {
  useMongoClient: true,
  
});
let db = mongoose.connection;
const path = require('path');
const port = 3000;

const passport = require('passport');
const config = require('./config/database');
// mongoose.connect(config.database);









//Check connection

db.once('open', function()
{
    console.log('Connecting to Mongo...');
});
//Check for DB errors

db.on('err', ()=>
{
    console.log(err);
});

//Import mongoose Models
let User = require('./models/user');

//Load View Engine

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Set Public Folder as static

app.use(express.static(path.join(__dirname, 'public')));


// Body parser Middleware 
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json 
app.use(bodyParser.json());
app.use(expressValidator());


//Express Session Middleware

app.use(session(
{
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
    
}));



//Express messages Middleware

app.use(require('connect-flash')());
app.use(function (req, res, next)
 {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware

app.use(expressValidator
    ({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));

  
//Passport Config & Middleware

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next)
{
    res.locals.user = req.user || null;
    res.locals.currentUser = req.user;
    next();
});

//Import Route Files from users

let users = require('./routes/users');
app.use('/users', users);



//Start Server

app.listen(port, ()=>
    {
        console.log('Server is starting on port ' + port + '...');
    });

    //Home Route

app.get('/', function (req, res)
    {
      User.find({}, function(err, users)
        {
            if(err) 
            {
                console.log(err);

            }else 
            {
                res.render('index', {username: 'users', users:users});
            }
            
        });
       
    });
   





   