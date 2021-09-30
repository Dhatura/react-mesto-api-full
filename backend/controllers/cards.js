const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError(400)');
const ForbiddenError = require('../errors/ForbiddenError(403)');
const NotFoundError = require('../errors/NotFoundError(404)');
const ServerError = require('../errors/InternalServerError(500)');

const {
  SUCCESS_OK,
} = require('../utils/errorStatus');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(SUCCESS_OK).send(cards))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((newCard) => res.status(SUCCESS_OK).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании карточки');
      }
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new Error('NotFound'))
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .then(() => res.status(SUCCESS_OK).send({ message: 'Карточка удалена' }));
      } else {
        throw new Error('AccessError');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные при удалении карточки');
      }
      if (err.message === 'NotFound') {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      if (err.message === 'AccessError') {
        throw new ForbiddenError('Вы пытаетесь удалить чужую карточку');
      }
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(new Error('NotFound'))
    .then((card) => res.status(SUCCESS_OK).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для постановки лайка');
      }
      if (err.message === 'NotFound') {
        throw new NotFoundError('Карточка с указанным _id не найдена, постановка лайка невозможна');
      }
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(new Error('NotFound'))
    .then((card) => res.status(SUCCESS_OK).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные при снятии лайка');
      }
      if (err.message === 'NotFound') {
        throw new NotFoundError('Карточка с указанным _id не найдена, снятие лайка невозможно');
      }
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};
