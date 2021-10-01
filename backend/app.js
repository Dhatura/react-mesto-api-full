const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const {
  celebrate, Joi, errors, CelebrateError,
} = require('celebrate');
const validator = require('validator');
const cors = require('cors');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/NotFoundError(404)');
// const regExp = require('./utils/regexp');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const requestСors = require('./middlewares/cors');

require('dotenv').config();

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

const validateSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((url) => {
      if (!validator.isURL(url)) {
        throw new CelebrateError('Укажите корректную ссылку');
      }
      return url;
    }),
  }),
});

const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors(requestСors));
app.use(requestLogger);

// не забыть удалить после ревью
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', validateSignup, createUser);
app.post('/signin', validateSignin, login);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('/*', () => {
  throw new NotFoundError('Cтраница не найдена');
});

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {});
