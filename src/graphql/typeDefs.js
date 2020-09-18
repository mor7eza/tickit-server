const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    id: ID
    firstName: String
    lastName: String
    email: String
    password: String
    role: RoleEnum
    departments: [Department]
    createdAt: String
    updatedAt: String
  }

  type Department {
    id: ID
    name: String
    createdAt: String
    updatedAt: String
  }

  type Ticket {
    id: ID
    ticketCode: String
    subject: String
    body: String
    user: User
    department: Department
    status: StatusEnum
    comments: [Comment]
    createdAt: String
    updatedAt: String
  }

  type Comment {
    id: ID
    user: User
    body: String
    createdAt: String
  }

  type fieldError {
    field: String
    error: String
  }

  enum RoleEnum {
    ADMIN
    EXPERT
    USER
  }

  enum StatusEnum {
    PENDING
    INPROGRESS
    REFERRED
    UPDATED
    CLOSED
  }

  input UserInput {
    firstName: String
    lastName: String
    email: String
    password: String
    role: RoleEnum
  }

  input TicketInput {
    subject: String
    body: String
    departmentId: ID
  }

  interface Response {
    code: Int
    success: Boolean
    message: String
    errors: [fieldError]
  }

  type AuthResponse implements Response {
    code: Int
    success: Boolean
    message: String
    errors: [fieldError]
    token: String
  }

  type TicketsResponse implements Response {
    code: Int
    success: Boolean
    message: String
    errors: [fieldError]
    tickets: [Ticket]
  }

  type TicketResponse implements Response {
    code: Int
    success: Boolean
    message: String
    errors: [fieldError]
    ticket: Ticket
  }

  type DepartmentsResponse implements Response {
    code: Int
    success: Boolean
    message: String
    errors: [fieldError]
    departments: [Department]
  }

  type DepartmentResponse implements Response {
    code: Int
    success: Boolean
    message: String
    errors: [fieldError]
    department: Department
  }

  type UsersResponse implements Response {
    code: Int
    success: Boolean
    message: String
    errors: [fieldError]
    users: [User]
  }

  type UserResponse implements Response {
    code: Int
    success: Boolean
    message: String
    errors: [fieldError]
    user: User
  }

  type Query {
    login(email: String, password: String): AuthResponse
    getDepartment(departmentId: ID): DepartmentResponse
    getDepartments: DepartmentsResponse
    getUsers: UsersResponse
    getUser(userId: ID): UserResponse
    getProfile(userId: ID): UserResponse
    getTickets(departmentId: ID, userId: ID): TicketsResponse
    getTicket(ticketId: ID): TicketResponse
  }

  type Mutation {
    register(userInput: UserInput): AuthResponse
    newDepartment(name: String): DepartmentResponse
    deleteDepartment(departmentId: ID): DepartmentResponse
    editDepartment(departmentId: ID, name: String): DepartmentResponse
    newUser(userInput: UserInput): UserResponse
    editUser(userId: ID, userInput: UserInput): UserResponse
    deleteUser(userId: ID): UserResponse
    addDepartmentToUser(userId: ID, departmentId: ID): UserResponse
    newTicket(ticketInput: TicketInput): TicketResponse
    editTicket(ticketId: ID, ticketInput: TicketInput): TicketResponse
    deleteTicket(ticketId: ID): TicketResponse
    referTicket(ticketId: ID, departmentId: ID): TicketResponse
    newComment(ticketId: ID, body: String): TicketResponse
  }
`;

// ---MUTATION--- //
// newComment (ticketId, body) : TicketResponse
