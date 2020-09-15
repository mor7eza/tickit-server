const checkAuth = require("../../utils/checkAuth");
const tr = require("../../utils/translation.json");
const Department = require("../../models/Department");
const checkPermission = require("../../utils/permissionManager");
const { errorResponse, response } = require("../../utils/helpers");

module.exports = {
  Query: {
    getDepartments: async (_, __, context) => {
      const applicant = await checkAuth(context);
      if (!applicant) return errorResponse(401, "invalid_token");
      if (!checkPermission("getDepartments", applicant.role)) return errorResponse(403, "forbidden");
      const departments = await Department.find();
      return response(200, { departments });
    }
  },
  Mutation: {}
};
