require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jsend = require('jsend');


const db = require('./models');
var indexRouter = require('./routes/index');
// usersRouter
const usersRouter = require('./routes/users');
// authRouter
const authRouter = require('./routes/auth');
// rolesRouter
const rolesRouter = require('./routes/role');
// categoryRouter
const categoryRouter = require('./routes/categoties');
// itemsRouter
const itemsRouter = require('./routes/items');
// cartsRouter
const cartsRouter = require('./routes/carts');
// orderRouter
const orderRouter = require('./routes/order');






const { updateStock, createCategoryIfNotFind, updateItem } = require('./Utility/index');

db.sequelize.sync({ force: false }).then(() => {
  console.log(`
  ------------------------------------------------------------------
  |     ALL DATABASE TABLES HAVE BEEN SUCCESSFULLY SYNCRONISE       |
  ------------------------------------------------------------------
  `)
})

// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// }).then(() => {
//   createCategoryIfNotFind();
//   updateStock()

// })





var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(jsend.middleware);


app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', authRouter);
app.use('/', rolesRouter);
app.use('/', categoryRouter);
app.use('/', itemsRouter);
app.use('/', cartsRouter);
app.use('/', orderRouter);

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
  // res.status(err.status || 500);
  // res.render('error');


  // try get error in jsend
  res.status(err.status || 500).jsend.fail({ 'result': err.message });
});


module.exports = app;

