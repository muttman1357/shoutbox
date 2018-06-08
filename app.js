const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const entries = require('./routes/entries');
const validate = require('./middleware/validate');
const register = require('./routes/register');
const session = require('express-session');
const messages = require('./middleware/messages');
const login = require('./routes/login');
const user = require('./middleware/user');
const api = require('./routes/api');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware

app.use(require('res-error'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(messages);
app.use(user);
app.use(bodyParser.urlencoded({ extended: true}));

// Routes

app.get('/', entries.list);
app.get('/users', usersRouter);
app.get('/post', entries.form);

app.post('/post',
  validate.required('title'),
  validate.lengthAbove('title', 4),
  entries.submit
);

app.get('/register', register.form);
app.post('/register', register.submit);
app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);

app.get('/api/user/:id', api.user);

// *************************************

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
