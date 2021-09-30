const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const regExp = require('../utils/regexp');

const {
  getUsers,
  getUser,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

const validateUser = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex(),
  }),
});

usersRouter.get('/', getUsers);
usersRouter.get('/me', getCurrentUser);

usersRouter.get('/:userId', validateUser, getUser);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regExp),
  }),
}), updateAvatar);

module.exports = usersRouter;
