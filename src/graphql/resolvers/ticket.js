const { errorResponse, response } = require("../../utils/helpers");
const Ticket = require("../../models/Ticket");
const { newTicketValidation } = require("../../utils/joiValidation");
const Department = require("../../models/Department");
const checkAuth = require("../../utils/checkAuth");
const User = require("../../models/User");

module.exports = {
  Query: {
    getTickets: async (_, { departmentId, userId }) => {
      if (departmentId && !(departmentId.length == 24)) return errorResponse(400, "invalid_id");
      if (userId && !(userId.length == 24)) return errorResponse(400, "invalid_id");
      let filter = {};
      if (departmentId) {
        const department = await Department.findById(departmentId);
        if (!department) return errorResponse(404, "department_not_found");
        filter = { department };
      }
      if (userId) {
        const user = await User.findById(userId);
        if (!user) return errorResponse(404, "user");
        filter = { ...filter, user };
      }
      const tickets = await Ticket.find(filter).populate("department").populate("user").exec();
      return response(200, { tickets });
    }
  },
  Mutation: {
    newTicket: async (_, { ticketInput }, context) => {
      const applicant = await checkAuth(context);
      if (!applicant) return errorResponse(401, "invalid_token");
      const validationErrors = newTicketValidation(ticketInput);
      if (validationErrors) return validationErrors;
      const { subject, body, departmentId } = ticketInput;
      const department = await Department.findById(departmentId);
      if (!department) return errorResponse(404, "department_not_found", ["department"]);
      const ticket = new Ticket({ subject, body, department, user: applicant });
      await ticket.save();
      return response(201, { ticket });
    }
  }
};
