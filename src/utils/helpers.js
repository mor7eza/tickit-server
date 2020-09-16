const { object } = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { SECRET_KEY } = require("../../config");
const tr = require("./translation.json");

module.exports.genToken = (userData) => {
  const user = _.pick(userData, ["id", "firstName", "lastName"]);
  const token = jwt.sign(user, SECRET_KEY, { expiresIn: "24h" });
  return token;
};

module.exports.errorResponse = (code, errKey, errFields) => {
  const res = {
    code,
    success: false,
    message: tr.errors[errKey]
  };
  if (errFields) {
    let errors = [];
    errFields.forEach((err) => {
      const obj = { field: err };
      errors.push(obj);
    });
    return {
      ...res,
      errors
    };
  }
  return res;
};

module.exports.response = (code, data) => {
  return {
    code,
    success: true,
    ...data
  };
};
