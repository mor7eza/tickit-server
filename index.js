const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const { PORT, MONGO_URI, MONGO_URI_DEV } = require("./config");

const typeDefs = require("./src/graphql/typeDefs");
const resolvers = require("./src/graphql/resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req })
});

try {
  server.listen({ port: PORT }).then(({ url }) => {
    console.log(`Server is running on ${url}`);
    return mongoose
      .connect(MONGO_URI_DEV, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
      })
      .then(() => {
        console.log(`Database connected successfuly.`);
      });
  });
} catch (error) {
  throw new Error(error);
}
