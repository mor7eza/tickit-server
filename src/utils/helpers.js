const jwt = require("jsonwebtoken");
const _ = require("lodash");

module.exports.genToken = (user) => {
  const SECRET_KEY = "gMUK3u3Rvi4C0yczHgftqTHMOYdfYWqo8MNC";
  const user = _.pick(user, ["id", "firstName", "lastName"]);
  const token = jwt.sign(user, SECRET_KEY, { expiresIn: "24h" });
  return token;
};
