const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError(400)');
const UnauthorizedError = require('../errors/UnauthorizedError(401)');
const NotFoundError = require('../errors/NotFoundError(404)');
const ConflictingRequestError = require('../errors/ConflictingRequestError(409)');
const ServerError = require('../errors/InternalServerError(500)');

const { NODE_ENV, JWT_SECRET } = process.env;

const {
  SUCCESS_OK,
} = require('../utils/errorStatus');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(SUCCESS_OK).send(users))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotFound'))
    .then((user) => res.status(SUCCESS_OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      if (err.message === 'NotFound') {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('NotFound'))
    .then((user) => res.status(SUCCESS_OK).send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    return next(new BadRequestError('Неправильные почта или пароль'));
  }
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(SUCCESS_OK).send({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные при создании пользователя');
      }
      if (err.name === 'MongoServerError' && err.code === 11000) {
        throw new ConflictingRequestError('Пользователь с таким Email уже зарегистрирован');
      }
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('NotFound'))
    .then((user) => res.status(SUCCESS_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при обновлении профиля');
      }
      if (err.message === 'NotFound') {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotFound'))
    .then((user) => res.status(SUCCESS_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при обновлении аватара');
      }
      if (err.message === 'NotFound') {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Переданы неверный email или пароль');
      }
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      }).send({ message: 'Авторизация прошла успешнo' });
    })
    .catch(next);
};
