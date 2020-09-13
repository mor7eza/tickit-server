const bcrypt = require("bcryptjs");

const { genToken } = require("../../utils/helpers");
const { SECRET_KEY } = require("../../../config");

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
        return {
          code: 400,
          success: false,
          message: tr.errors.bad_credential,
          errors: [{ field: "email" }, { field: "password" }]
        };
      const token = genToken(user);
      return {
        code: 200,
        success: true,
        token
      };
    }
  },
  Mutation: {
    register: async (_, { userInput }) => {
      const validationErrors = registerValidation(userInput);
      if (validationErrors) return validationErrors;
      const { firstName, lastName, email, password } = userInput;
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return {
          code: 400,
          success: false,
          message: tr.errors.email_exists,
          errors: [{ field: "email" }]
        };
      const encryptedPassword = bcrypt.hashSync(password);
      const user = new User({
        firstName,
        lastName,
        email,
        password: encryptedPassword
      });
      await user.save();
      const token = genToken(user);
      return {
        code: 200,
        success: true,
        token
      };
    }
  }
};
