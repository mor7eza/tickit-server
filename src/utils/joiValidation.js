const joi = require("@hapi/joi");

const tr = require("../utils/translation.json");

const errorFormatter = ({ error }) => {
  if (!error) return false;
  let errors = [];
  error.details.forEach((detail) => {
    const errObj = { field: detail.path[0], error: detail.message };
    errors.push(errObj);
  });
  return (errorsResponse = {
    code: 400,
    success: false,
    message: tr.errors.bad_input,
    errors
  });
};

module.exports.loginValidation = (email, password) => {
  const schema = joi
    .object({
      email: joi.string().email().required(),
      password: joi.string().min(6).required()
    })
    .options({ abortEarly: false });

  const response = errorFormatter(schema.validate({ email, password }));
  if (response) return response;
};

module.exports.registerValidation = (userInput) => {
  const schema = joi
    .object({
      firstName: joi.string().required(),
      lastName: joi.string().required(),
      email: joi.string().email().required(),
      password: joi.string().min(6).required()
    })
    .options({ abortEarly: false });
  const response = errorFormatter(schema.validate(userInput));
  if (response) return response;
};

module.exports.newDepartmentValidation = (name) => {
  const schema = joi.object({
    name: joi.string().required()
  });
  const response = errorFormatter(schema.validate({ name }));
  if (response) return response;
};
