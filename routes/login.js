const User = require('../models/user');

module.exports.form = (req, res) => {
  res.render('login', {title: 'Login'});
};

module.exports.submit = (req, res, next) => {
  const data = req.body;
  User.authenticate(data.name, data.pass, (err, user) => {
    if(err) return next(err);
    if(user) {
      req.session.uid = user.id;
      res.redirect('/');
    }
    else {
      res.error('Sorry! Invalid credentials.');
      res.redirect('back');
    }
  });
};

module.exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if(err) throw err;
    res.redirect('/login');
  })
};