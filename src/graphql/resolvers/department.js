const checkAuth = require("../../utils/checkAuth");
const tr = require("../../utils/translation.json");
const Department = require("../../models/Department");
const checkPermission = require("../../utils/permissionManager");
const { errorResponse, response } = require("../../utils/helpers");
const { newDepartmentValidation } = require("../../utils/joiValidation");

module.exports = {
  Query: {
    getDepartments: async (_, __, context) => {
      const applicant = await checkAuth(context);
      if (!applicant) return errorResponse(401, "invalid_token");
      if (!checkPermission("getDepartments", applicant.role)) return errorResponse(403, "forbidden");
      const departments = await Department.find();
      return response(200, { departments });
    },
    getDepartment: async (_, { departmentId }, context) => {
      if (!departmentId || !(departmentId.length == 24)) return errorResponse(400, "invalid_id");
      const applicant = await checkAuth(context);
      if (!applicant) return errorResponse(401, "invalid_token");
      if (!checkPermission("getDepartment", applicant.role)) return errorResponse(403, "forbidden");
      const department = await Department.findById(departmentId);
      return response(200, { department });
    }
  },
  Mutation: {
    newDepartment: async (_, { name }, context) => {
      const applicant = await checkAuth(context);
      if (!applicant) return errorResponse(401, "invalid_token");
      if (!checkPermission("newDepartment", applicant.role)) return errorResponse(403, "forbidden");
      const validationErrors = newDepartmentValidation(name);
      if (validationErrors) return validationErrors;
      const department = new Department({ name });
      await department.save();
      return response(201, { department });
    },
    deleteDepartment: async (_, { departmentId }, context) => {
      if (!departmentId || !(departmentId.length == 24)) return errorResponse(400, "invalid_id");
      const applicant = await checkAuth(context);
      if (!applicant) return errorResponse(401, "invalid_token");
      if (!checkPermission("deleteDepartment", applicant.role)) return errorResponse(403, "forbidden");
      const department = await Department.findById(departmentId);
      if (!department) return errorResponse(404, "department_not_found");
      await department.deleteOne();
      return response(200);
    },
    editDepartment: async (_, { departmentId, name }, context) => {
      if (!departmentId || !(departmentId.length == 24)) return errorResponse(400, "invalid_id");
      const applicant = await checkAuth(context);
      if (!applicant) return errorResponse(401, "invalid_token");
      if (!checkPermission("deleteDepartment", applicant.role)) return errorResponse(403, "forbidden");
      const validationErrors = newDepartmentValidation(name);
      if (validationErrors) return validationErrors;
      let department = await Department.findById(departmentId);
      if (!department) return errorResponse(404, "department_not_found");
      department.name = name;
      await department.save();
      return response(200);
    }
  }
};
