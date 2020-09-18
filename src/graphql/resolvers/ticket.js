const mongoose = require("mongoose");

const { errorResponse, response } = require("../../utils/helpers");
const Ticket = require("../../models/Ticket");
const { newTicketValidation, editTicketValidation, newCommentValidation } = require("../../utils/joiValidation");
const Department = require("../../models/Department");
const checkAuth = require("../../utils/checkAuth");
const User = require("../../models/User");
const checkPermission = require("../../utils/permissionManager");

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
    },
    getTicket: async (_, { ticketId }) => {
      if (!ticketId || !(ticketId.length == 24)) return errorResponse(400, "invalid_id");
      const ticket = await Ticket.findById(ticketId).populate("department").populate("user").exec();
      if (!ticket) return errorResponse(404, "ticket_not_found");
      return response(200, { ticket });
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
    },
    editTicket: async (_, { ticketId, ticketInput }, context) => {
      if (!ticketId || !(ticketId.length == 24)) return errorResponse(400, "invalid_id");
      const applicant = await checkAuth(context);
      if (!applicant) return errorResponse(401, "invalid_token");
      const validationErrors = editTicketValidation(ticketInput);
      if (validationErrors) return validationErrors;
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) return errorResponse(404, "ticket_not_found");
      if (!ticket.status === "PENDING") return errorResponse(403, "ticket_forbidden_edit");
      const ticketUser = await User.findById(ticket.user);
      if (applicant.id == ticketUser.id || applicant.role == "ADMIN") {
        await ticket.updateOne(ticketInput);
        return response(200);
      }
      return errorResponse(403, "forbidden");
    },
    deleteTicket: async (_, { ticketId }, context) => {
      if (!ticketId || !(ticketId.length == 24)) return errorResponse(400, "invalid_id");
      const applicant = await checkAuth(context);
      if (!applicant) return errorResponse(401, "invalid_token");
      if (!checkPermission("deleteTicket", applicant.role)) return errorResponse(403, "forbidden");
      const ticket = await Ticket.findByIdAndDelete(ticketId);
      if (!ticket) return errorResponse(404, "ticket_not_found");
      return response(200);
    },
    referTicket: async (_, { ticketId, departmentId }, context) => {
      if (!ticketId || !(ticketId.length == 24)) return errorResponse(400, "invalid_id");
      if (!departmentId || !(departmentId.length == 24)) return errorResponse(400, "invalid_id");
      const applicant = await checkAuth(context);
      if (!applicant) return errorResponse(401, "invalid_token");
      if (!checkPermission("referTicket", applicant.role)) return errorResponse(403, "forbidden");
      const department = await Department.findById(departmentId);
      if (!department) return errorResponse(404, "department_not_found");
      const ticket = await Ticket.findByIdAndUpdate(ticketId, { department }, { new: true })
        .populate("department")
        .exec();
      if (!ticket) return errorResponse(404, "ticket_not_found");
      return response(200, { ticket });
    },
    newComment: async (_, { ticketId, body }, context) => {
      if (!ticketId || !(ticketId.length == 24)) return errorResponse(400, "invalid_id");
      const applicant = await checkAuth(context);
      if (!applicant) return errorResponse(401, "invalid_token");
      const validationErrors = newCommentValidation(body);
      if (validationErrors) return validationErrors;
      const ticket = await Ticket.findById(ticketId)
        .populate({ path: "comments", populate: { path: "user", model: "User" } })
        .exec();
      if (!ticket) return errorResponse(404, "ticket_not_found");
      const id = mongoose.Types.ObjectId();
      const comment = { id, user: applicant, body };
      ticket.comments.push(comment);
      await ticket.save();
      return response(201, { ticket });
    }
  }
};
