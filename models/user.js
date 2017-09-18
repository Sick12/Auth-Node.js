let mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


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

    //  isAdmin:
    //  {
    //      type:Boolean,
    //      default: false
    //  },

     role: 
     {
         type: 
         [{
            type: String,
            enum: ['user','moderator', 'admin']
         }],
         default:['admin']
     }

    //  userProperty:
    //  {
    //      type: String,
    //      default:['admin']
    //  }

});



let User = module.exports = mongoose.model('User', userSchema);






