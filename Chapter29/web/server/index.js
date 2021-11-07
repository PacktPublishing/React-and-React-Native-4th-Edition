const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');

const {
  getUserByID,
  getTodos,
  addTodo,
  changeTodoStatus,
  markAllTodos,
  removeCompletedTodos,
  removeTodo,
  renameTodo,
} = require('./database');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
type Todo {
  id: Int!
  text: String!
  complete: Boolean
}
type User {
  id: ID!
  totalCount: Int!
  completedCount: Int!
  todos: [Todo]!
}
type Query {
  user(id: String): User
}
type Mutation {
  addTodo(text: String): [Todo]
  changeTodoStatus(id: Int!, complete: Boolean): [Todo]
  markAllTodos: [Todo]
  removeCompletedTodos: [Todo]
  removeTodo(id: Int!): [Todo]
  renameTodo(id: Int!, text: String): [Todo]
}
`);

// The root provides a resolver function for each API endpoint
const root = {
  user: (_, context, { variableValues: { userId } }) => {
    const user = getUserByID(userId);
    const todos = getTodos();

    return {
      ...user,
      totalCount: todos.length,
      completedCount: todos.filter(({ complete }) => complete === true).length, // Calculate completed Todos
      todos,
    };
  },
  addTodo: (_, context, { variableValues: { text } }) => {
    addTodo(text, false);

    return getTodos();
  },
  changeTodoStatus: (_, context, { variableValues: { id, complete } }) => {
    changeTodoStatus(id, complete);

    return getTodos();
  },
  markAllTodos: () => {
    markAllTodos();

    return getTodos();
  },
  removeCompletedTodos: () => {
    removeCompletedTodos();

    return getTodos();
  },
  removeTodo: (_, context, { variableValues: { id, status } }) => {
    removeTodo(id, status);

    return getTodos();
  },
  renameTodo: (_, contxt, { variableValues: { id, text } }) => {
    renameTodo(id, text);

    return getTodos();
  },
};

const app = express();

app.use(cors());
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  }),
);
app.listen(4000);

console.log('Running a GraphQL API server at http://localhost:4000/graphql');
