const { loginValidation } = require("../../utils/joiValidation");

module.exports = {
  Query: {
    login: async (_, { email, password }) => {
      const validationErrors = loginValidation(email, password);
      if (validationErrors) return validationErrors;
    }
  },
  Mutation: {}
};
