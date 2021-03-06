# **TickiT Prototype**

> ## MongoDB Models

### `User :`

|    Field    |     Type     | Default |    Ref     |
| :---------: | :----------: | :-----: | :--------: |
|  firstName  |    String    |
|  lastName   |    String    |
|    email    |    String    |
|  password   |    String    |
|    role     |    String    |  USER   |
| departments | \[ObjectId\] |         | Department |

`{ timestamps : true }`

<p>&nbsp;</p>

### `Department :`

| Field |  Type  |
| :---: | :----: |
| name  | String |

`{ timestamps : true }`

<p>&nbsp;</p>

### `Ticket :`

|   Field    |   Type   | Default |    Ref     |
| :--------: | :------: | :-----: | :--------: |
| ticketCode |  String  |
|  subject   |  String  |
|    body    |  String  |
|    user    | ObjectId |         |    User    |
| department | ObjectId |         | Department |
|   status   |  String  | PENDING |
|  comments  |

```
comments: [
      {
        id: ObjectId,
        user: { type: ObjectId, ref: "User" },
        body: String,
        createdAt: String,
        updatedAt: String
      }
    ]
```

`{ timestamps : true }`

---

> ## Graphql

### `Types :`

```
type User {
    id : ID
    firstName : String
    lastName : String
    email : String
    password : String
    role : RoleEnum
    departments : [Department]
    createdAt : String
    updatedAt : String
}
```

```
type Department {
    id : ID
    name : String
    createdAt : String
    updatedAt : String
}
```

```
type Ticket {
    id : ID
    ticketCode : String
    subject : String
    body : String
    user : User
    department : Department
    status : StatusEnum
    comments : [Comment]
    createdAt : String
    updatedAt : String
}
```

```
type Comment {
    id : ID
    user : User
    body : String
    createdAt : String
    updatedAt : String
}
```

```
enum RoleEnum {
    ADMIN
    EXPERT
    USER
}
```

```
enum StatusEnum {
    PENDING -> after sendind
    INPROGRESS -> after openning
    REFERRED -> after referred to another department
    UPDATED -> after commenting
    CLOSED -> after answering and solving the problem
}
```

```
input UserInput {
    firstName : String
    lastName : String
    email : String
    password : String
    role : RoleEnum
}
```

```
input TicketInput {
    subject : String
    body : String
    departmentId : ID
}
```

```
type fieldError {
    field : String
    error : String
}
```

```
interface Response {
    code : Int
    success : Boolean
    message : String
    errors : [fieldError]
}
```

```
type AuthResponse implements Response {
    code : Int
    success : Boolean
    message : String
    errors : [fieldError]
    token : String
}
```

```
type TicketsResponse implements Response {
    code : Int
    success : Boolean
    message : String
    errors : [fieldError]
    tickets : [Ticket]
}
```

```
type TicketResponse implements Response {
    code : Int
    success : Boolean
    message : String
    errors : [fieldError]
    ticket : Ticket
}
```

```
type DepartmentsResponse implements Response {
    code : Int
    success : Boolean
    message : String
    errors : [fieldError]
    departments : [Department]
}
```

```
type DepartmentResponse implements Response {
    code : Int
    success : Boolean
    message : String
    errors : [fieldError]
    department : Department
}
```

```
type UsersResponse implements Response {
    code : Int
    success : Boolean
    message : String
    errors : [fieldError]
    users : [User]
}
```

```
type UserResponse implements Response {
    code : Int
    success : Boolean
    message : String
    errors : [fieldError]
    user : User
}
```

### `Resolvers :`

**Queries**

```
login (email, password) : AuthResponse
permission -> All

getTickets (departmentId, userId) : TicketsResponse
permission -> ALL

getTicket (ticketId) : TicketResponse
permission -> ALL

getDepartments : DepartmentsResponse
permission -> ADMIN

getDepartment (departmentId) : DepartmentResponse
permission -> ADMIN

getUsers : UsersResponse
permission -> ADMIN

getUser (userId) : UserResponse
permission -> ADMIN
```

**Mutations**

```
register (UserInput) : AuthResponse
permission -> ALL

newTicket (TicketInput) : TicketResponse
permission -> ALL

editTicket (ticketId, TicketInput) : TicketResponse
permission -> ALL

deleteTicket : TicketResponse
permission -> ADMIN

referTicket (ticketId, departmentId) : TicketResponse
permission -> ADMIN, EXPERT

newComment (ticketId, body) : TicketResponse
permission -> ALL

newDepartment (name) : DepartmentResponse
permission -> ADMIN

editDepartment (departmentId, name) : DepartmentResponse
permission -> ADMIN

deleteDepartment (departmentId) : DepartmentResponse
permission -> ADMIN

newUser (UserInput) : UserResponse
permission -> ADMIN

editUser (userId, UserInput) : UserResponse
permission -> ADMIN

deleteUser (userId) : UserResponse
permission -> ADMIN

addDepartmentToUser (userId, departmentId) : UserResponse
permission -> ADMIN

getProfile (userId) : UserResponse
permission -> ALL
```

---

> ## Pages

### `Login :`

Send {email, password} and get token.  
`Query -> login`

### `Register :`

Send {firstName, lastName, email, password} and get token.  
`Mutation -> register`

### `Tickets :`

Get tickets and show in table.  
`Query -> getTickets`

### `Ticket :`

Send id and get single ticket.  
`Query -> getTicket`

### `New Ticket :`

Send {subject, body, departmentId} and get ticket.  
`Mutation -> newTicket`

### `Edit Ticket :`

If ticket is in PENDING state send optional {subject, body, departmentId} and get ticket.  
`Mutation -> editTicket`

### `Delete Ticket :`

If ticket is in PENDING state delete ticket.  
`Mutation -> deleteTicket`

### `Refer Ticket :`

Send {ticketCode, newDepartmentId} and change state to REFERRED and get ticket.  
`Mutation -> referTicket`

### `New Comment :`

Send {ticketId, CommentInput} and get ticket.  
`Mutation -> newComment`

### `Edit Comment :`

Send {ticketId, CommentInput} and get ticket.  
`Mutation -> editComment`

### `Delete Comment :`

Send {ticketId, commentId} and delete comment.  
`Mutation -> deleteComment`

### `Departments :`

Get Departments.  
`Query -> getDepartments`

### `Department :`

Send {departmentId} and get department.  
`Query -> getDepartment`

### `New Department :`

Send {name} and get department.  
`Mutation -> newDepartment`

### `Edit Department :`

Send {departmentId, name} and get department.  
`Mutation -> editDepartment`

### `Delete Department :`

Send {departmentId} and delete department.  
`Mutation -> deleteDepartment`

### `Users :`

Get users.  
`Query -> getUsers`

### `User :`

Send {userId} and get user.  
`Query -> getUser`

### `New User :`

Send {InputUser} and get user.  
`Mutation -> newUser`

### `Edit User :`

Send optional {userId, InputUser} and get user.  
`Mutation -> editUser`

### `Delete User :`

Send {userId} and delete user.  
`Mutation -> deleteUser`

### `AddDepartmentToUser :`

If user is expert send {userId, departmentId} and add department to user.
`Mutation -> addDepartmentToUser`

### `Profile :`

Send {userId} and get user profile data.  
`Query -> getProfile`
