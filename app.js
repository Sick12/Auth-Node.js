const express = require('express');
const app = express();  //Init app
const ConnectRoles = require('connect-roles');
const roles = new ConnectRoles();

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
    //res.locals.currentUser = req.user;
    next();
});


  
  
 

//Import Route Files from users

let users = require('./routes/users');
app.use('/users', users);

let projects = require('./routes/projects');
app.use('/projects', projects);

//Start Server

app.listen(port, ()=>
    {
        console.log('Server is starting on port ' + port);
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
   


let user = new ConnectRoles({
    failureHandler: function (req, res, action) {
      // optional function to customise code that runs when 
      // user fails authorisation 
      let accept = req.headers.accept || '';
      res.status(403);
      if (~accept.indexOf('html')) {
        res.render('access-denied', {action: action});
      } else {
        res.send('Access Denied - You don\'t have permission to: ' + action);
      }
    }
  });
   
 //Middleware Connect-roles 
  app.use(user.middleware());
   
  //anonymous users can only access the home page 
  //returning false stops any more rules from being 
  //considered 
  user.use(function (req, action) {
    if (!req.isAuthenticated()) return action === 'access home page';
    console.log(user);
  });
   
  //moderator users can access private page, but 
  //they might not be the only ones so we don't return 
  //false if the user isn't a moderator 
  user.use('access private page', function (req) {
    if (req.user.role === 'moderator') {
        console.log(user);
      return true;
    }
  });
   
  //admin users can access all pages 
  user.use(function (req) {
    if (req.user.role === 'admin') {
        console.log(user);
      return true;
    }
  });
   
   

  app.get('/private', user.can('access private page'), function (req, res) {
    res.render('private');
  });
  app.get('/admin', user.can('access admin page'), function (req, res) {
    res.render('admin');
  });

  app.get('/test', user.can('access private page'), function (req, res) {
    res.render('test');
  });