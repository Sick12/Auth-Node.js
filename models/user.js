let mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
//const bcrypt = require('bcrypt');

let userSchema = mongoose.Schema
({
    username:
     {
         type: String,
         required: true,
         unique:true,
         trim: true
     },
    email:
     {
             type: String,
             required: true,
             unique: true,
             trim: true
     },
    password:
     {
         type: String,
         required: true
     },

     isAdmin:
     {
         type:Boolean,
         default: false
     }

});



let User = module.exports = mongoose.model('User', userSchema);






