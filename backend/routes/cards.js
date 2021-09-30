const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const regExp = require('../utils/regexp');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const validateCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).hex(),
  }),
});

cardsRouter.get('/', getCards);

cardsRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().required().pattern(regExp),
  }),
}), createCard);

cardsRouter.delete('/:cardId', validateCard, deleteCard);
cardsRouter.put('/:cardId/likes', validateCard, likeCard);
cardsRouter.delete('/:cardId/likes', validateCard, dislikeCard);

module.exports = cardsRouter;
