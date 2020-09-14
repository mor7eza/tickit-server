const { object } = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { SECRET_KEY } = require("../../config");

module.exports.genToken = (userData) => {
  const user = _.pick(userData, ["id", "firstName", "lastName"]);
  const token = jwt.sign(user, SECRET_KEY, { expiresIn: "24h" });
  return token;
};
