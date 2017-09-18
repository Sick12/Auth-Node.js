const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const ConnectRoles = require('connect-roles');
  

router.get('/project', function(req, res)
{
    res.render('project');
});



module.exports = router;