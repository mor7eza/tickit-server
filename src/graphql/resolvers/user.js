const bcrypt = require("bcryptjs");

const { genToken, response, errorResponse } = require("../../utils/helpers");

const User = require("../../models/User");
const { loginValidation, registerValidation } = require("../../utils/joiValidation");
const tr = require("../../utils/translation.json");
module.exports = {
  Query: {
    login: async (_, { email, password }) => {
      const validationErrors = loginValidation(email, password);
      if (validationErrors) return validationErrors;
      const user = await User.findOne({ email });
      if (!user || !bcrypt.compareSync(password, user.password))
        return errorResponse(400, "bad_credentil", ["email", "password"]);
      const token = genToken(user);
      return token ? response(200, { token }) : errorResponse(500, "server_error");
    }
  },
  Mutation: {
    register: async (_, { userInput }) => {
      const validationErrors = registerValidation(userInput);
      if (validationErrors) return validationErrors;
      const { firstName, lastName, email, password } = userInput;
      const existingUser = await User.findOne({ email });
      if (existingUser) return errorResponse(400, "email_exists", ["email"]);
      const encryptedPassword = bcrypt.hashSync(password);
      const user = new User({
        firstName,
        lastName,
        email,
        password: encryptedPassword
      });
      await user.save();
      const token = genToken(user);
      return token ? response(201, { token }) : errorResponse(500, "server_error");
    }
  }
};
