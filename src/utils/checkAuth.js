const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { SECRET_KEY } = require("../../config");

module.exports = async (context) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (token) {
      const { id } = jwt.verify(token, SECRET_KEY);
      if (id) {
        const user = await User.findById(id);
        if (user) return user;
      }
    }
  }
};
