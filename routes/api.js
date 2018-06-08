const express = require('express');
const User = require('../models/user');
const auth = require('basic-auth');

module.exports.auth = (req, res, next) => {
  const { name, pass } = auth(req);
  User.authenticate(name, pass, (err, user) => {
    if(user) req.remoteUser = user;
    next(err);
  });
};

module.exports.user = (req, res, next) => {
  User.get(req.params.id, (err, user) => {
    if(err) return next(err);
    if(!user.id) return res.sendStatus(404);
    res.json(user);
  });
};