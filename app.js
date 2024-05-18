
require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session=require('express-session');
var SQLiteStore=require('connect-sqlite3')(session);

var indexRouter = require('./routes/index');
var animalsRouter = require('./routes/animals');
var speciesRouter = require('./routes/species');
var temperamentRouter = require('./routes/temperament');
//add auth route and signup route is here
var authRouter = require('./routes/auth');

//added logout route 
var logoutRouter = require('./routes/logout');
var db=require("./models");
//force to re-create but false now 
db.sequelize.sync({ force: true }).then(() => {
  console.log('Database and tables created!');
});
//add flash 
const flash=require('connect-flash');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//ad session configuration 
app.use(session({
  secret:'secret',
  resave:false,
  saveUninitialized:false,
  store:new SQLiteStore()
}));

const passport=require('passport');
require('./passport-config')(
  passport, 
  async username => await db.User.findOne({ where: { username: username } }),
  async id => await db.User.findByPk(id)
);

//add passport
app.use(passport.initialize());
app.use(passport.authenticate('session'));




app.use('/', indexRouter);
app.use('/animals', animalsRouter);
app.use('/species', speciesRouter);
app.use('/temperament', temperamentRouter);

//add auth route
app.use('/login',authRouter);



//one solution is to write /logout directly to root level
app.get('/logout',(req,res,next)=> {
  req.logout(function(err) {
      if (err) {return next(err);}
      res.redirect('/');
  });
});


//user auth
app.use(function(req,res,next) {
  res.locals.user=req.user || null;
  next();
})

//use flash not sure if i can use or need but for furter development
app.use(flash());


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;

