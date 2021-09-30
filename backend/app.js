const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/NotFoundError(404)');
const regExp = require('./utils/regexp');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

const validateSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().required().pattern(regExp),
  }),
});

const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

app.use(cookieParser());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', validateSignup, createUser);
app.post('/signin', validateSignin, login);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('/*', () => {
  throw new NotFoundError('Cтраница не найдена');
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {});
