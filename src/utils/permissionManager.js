const ADMIN = "ADMIN";
const EXPERT = "EXPERT";

const permissions = {
  deleteTicket: [ADMIN],
  referTicket: [ADMIN, EXPERT],
  deleteComment: [ADMIN, EXPERT],
  getDepartments: [ADMIN],
  getDepartment: [ADMIN],
  newDepartment: [ADMIN],
  editDepartment: [ADMIN],
  deleteDepartment: [ADMIN],
  getUsers: [ADMIN],
  getUser: [ADMIN],
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
