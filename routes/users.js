const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const passport = require('passport');

//Import User Model

let User = require('../models/user');

 // Register Route
 router.get('/register', function(req, res)
 {
     res.render('register', {
         title:'Register'
     });
 });

  //Register Submit POST
  router.post('/register', function(req, res)
  {
     

      const username = req.body.username;
      const email  = req.body.email;
      const password = req.body.password;
      const password2 = req.body.password2;
      
        
        req.checkBody('username', 'Username is required').notEmpty().
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('email', 'Email is invalid').isEmail();
        req.checkBody('password', 'Password is required').notEmpty().isLength({min:6}).withMessage("Minimum 6 characters");
        req.checkBody('password2', 'Passwords don\'t match').equals(password);
        let errors = req.validationErrors(); //getValidationResult() validationErrors()
      
      if(errors) {
          res.render('register',{
                errors:errors
          });
      } else {
        let newUser = new User({
            username: username,
            email: email,
            password: password
            
        });
       bcrypt.genSalt(12, function(err, salt)
       {
            bcrypt.hash(newUser.password, salt, function(err, hash)
            {
                if(err)
                {
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function(err)
                {
                    if(err) 
                    {
                        console.log(err);
                        return;
                    }else
                     {
                        req.flash('success', 'Account created!');
                        res.redirect('/users/login');
                    }
                });
            });
       });
      }
    });
     

   
  


//Login Route

router.get('/login', function (req, res)
 {
    res.render('login');
  });
  
  router.post('/login', function (req, res, next) 
  {
    
    passport.authenticate('local',
     {
        successRedirect:'/users/profile',
        failureRedirect:'/users/login',
        failureFlash: true
        
    })(req, res, next);

        
   
 });


 router.get('/userslist',userAuthentificated, function (req, res)
 {
   User.find({}, function(err, users)
     {
         if(err) 
         {
             console.log(err);

         }else   
          {
             res.render('userslist', {username: 'users', users:users});
         }
         
     });
    
 });


 router.get('/logout', function(req, res)
 {
     req.logout();
     req.flash('success', "Logged out successfully");
     res.redirect('/users/login');
 });


router.get('/profile', userAuthentificated, function(req, res)
{
    res.render('profile');
});


 //Gives Access if logged in
 function userAuthentificated(req, res, next)
 {
     if(req.isAuthenticated())
     {
         return next();
     }else 
     {
         req.flash('danger', 'Login first');
         res.redirect('/users/login');
     }

 }
module.exports = router;