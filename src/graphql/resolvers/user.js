const bcrypt = require("bcryptjs");

const { genToken } = require("../../utils/helpers");

const User = require("../../models/User");
const { loginValidation } = require("../../utils/joiValidation");
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
  Mutation: {}
};
