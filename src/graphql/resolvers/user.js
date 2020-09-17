const bcrypt = require("bcryptjs");

const { genToken, response, errorResponse } = require("../../utils/helpers");
const checkAuth = require("../../utils/checkAuth");
const checkPermission = require("../../utils/permissionManager");
const User = require("../../models/User");
const {
  loginValidation,
  registerValidation,
  newUserValidation,
  editUserValidation
} = require("../../utils/joiValidation");
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
    },
    getUsers: async (_, __, context) => {
      const applicant = await checkAuth(context);
      if (!applicant) return errorResponse(401, "invalid_token");
      if (!checkPermission("getUsers", applicant.role)) return errorResponse(403, "forbidden");
      const users = await User.find();
      return response(200, { users });
    },
    getUser: async (_, { userId }, context) => {
      if (!userId || !(userId.length == 24)) return errorResponse(400, "invalid_id");
      const applicant = await checkAuth(context);
      if (!applicant) return errorResponse(401, "invalid_token");
      if (!checkPermission("getUser", applicant.role)) return errorResponse(403, "forbidden");
      const user = await User.findById(userId);
      return response(200, { user });
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
    },
    newUser: async (_, { userInput }, context) => {
      const applicant = await checkAuth(context);
      if (!applicant) return errorResponse(401, "invalid_token");
      if (!checkPermission("newUser", applicant.role)) return errorResponse(403, "forbidden");
      const validationErrors = newUserValidation(userInput);
      if (validationErrors) return validationErrors;
      const { firstName, lastName, email, password, role } = userInput;
      const existingUser = await User.findOne({ email });
      if (existingUser) return errorResponse(400, "email_exists", ["email"]);
      const encryptedPassword = bcrypt.hashSync(password);
      const user = new User({
        firstName,
        lastName,
        email,
        password: encryptedPassword
      });
      if (role) user.role = role;
      await user.save();
      return response(201, { user });
    },
    editUser: async (_, { userId, userInput }, context) => {
      if (!userId || !(userId.length == 24)) return errorResponse(400, "invalid_id");
      const applicant = await checkAuth(context);
      if (!applicant) return errorResponse(401, "invalid_token");
      if (!checkPermission("newUser", applicant.role)) return errorResponse(403, "forbidden");

      const validationErrors = editUserValidation(userInput);
      if (validationErrors) return validationErrors;
      const user = await User.findById(userId);
      if (user) {
        await user.updateOne(userInput);
        return response(200);
      }
      return errorResponse(404, "user_not_found");
    },
    deleteUser: async (_, { userId }, context) => {
      if (!userId || !(userId.length == 24)) return errorResponse(400, "invalid_id");
      const applicant = await checkAuth(context);
      if (!applicant) return errorResponse(401, "invalid_token");
      if (!checkPermission("getUser", applicant.role)) return errorResponse(403, "forbidden");
      const user = await User.findById(userId);
      if (user) {
        await user.deleteOne();
        return response(200);
      }
      return errorResponse(404, "user_not_found");
    }
  }
};
