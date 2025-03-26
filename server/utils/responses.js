const CustomException = require('../utils/errors');

const formattedResponse = (res, statusCode, data) => {
  return res.status(statusCode).json(data);
};

const formattedException = (res, statusCode, message) => {
  return res.status(statusCode).json(new CustomException(message));
};

module.exports = {
    formattedResponse,
    formattedException
}