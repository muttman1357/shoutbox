const User = require('../models/user');

module.exports.form = (req, res) => {
  res.render('register', {title: 'Register'});
};

module.exports.submit = (req, res, next) => {
  let data = {
    name: req.body.name,
    pass: req.body.pass
  };
  User.getByName(data.name, (err, user) => {
    if(err) return next(err);
    if(user.id) {
      res.error('Username already taken!');
      res.redirect('back');
    }
    else {
      user = new User({
        name: data.name,
        pass: data.pass
      });
      user.save((err) => {
        if(err) return next(err);
        req.session.uid = user.name;
        res.redirect('/');
      });
    }
  });
};