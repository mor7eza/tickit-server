const ADMIN = "ADMIN";
const EXPERT = "EXPERT";
const USER = "USER";

const permissions = {
  getDepartments: [ADMIN],
  getDepartment: [ADMIN],
  getUsers: [ADMIN],
  getUser: [ADMIN],
  deleteTicket: [ADMIN],
  referTicket: [ADMIN, EXPERT],
  deleteComment: [ADMIN, EXPERT],
  newDepartment: [ADMIN],
  editDepartment: [ADMIN],
  deleteDepartment: [ADMIN],
  newUser: [ADMIN],
  deleteUser: [ADMIN],
  addDepartmentToUser: [ADMIN]
};

const checkPermission = (operation, role) => {
  if (permissions.hasOwnProperty(operation) && permissions[operation].includes(role)) {
    return true;
  } else {
    return false;
  }
};

module.exports = checkPermission;
