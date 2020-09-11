const userResolvers = require("./user");
const departmentResolvers = require("./department");
const ticketResolvers = require("./ticket");

module.exports = {
  Query: { ...userResolvers.Query, ...departmentResolvers.Query, ...ticketResolvers.Query },
  Mutation: { ...userResolvers.Mutation, ...departmentResolvers.Mutation, ...ticketResolvers.Mutation }
};
