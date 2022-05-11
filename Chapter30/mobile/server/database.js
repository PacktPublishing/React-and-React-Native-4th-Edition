class Todo {
  constructor(id, text, complete) {
    this.id = id;
    this.text = text;
    this.complete = complete;
  }
}

class User {
  constructor(id) {
    this.id = id;
  }
}

// Mock authenticated ID
const USER_ID = 'me';

// Mock user database table
const usersById = new Map([[USER_ID, new User(USER_ID)]]);

// Mock todo database table
const todosById = new Map();
const todoIdsByUser = new Map([[USER_ID, []]]);

// Seed initial data
let nextTodoId = 0;
addTodo('Taste JavaScript', true);
addTodo('Buy a unicorn', false);

function getUserByID(id) {
  return usersById.get(id);
}

function getTodoIdsForUser(id) {
  return todoIdsByUser.get(id) || [];
}

function addTodo(text, complete) {
  const todo = new Todo(nextTodoId++, text, complete);
  todosById.set(todo.id, todo);

  const todoIdsForUser = getTodoIdsForUser(USER_ID);
  todoIdsByUser.set(USER_ID, todoIdsForUser.concat(todo.id));

  return todo.id;
}

function getTodo(id) {
  return todosById.get(id);
}

function getTodoOrThrow(id) {
  const todo = getTodo(id);

  if (!todo) {
    throw new Error(`Invariant exception, Todo ${id} not found`);
  }

  return todo;
}

function getTodos(status = 'any') {
  const todoIdsForUser = getTodoIdsForUser(USER_ID);
  const todosForUser = todoIdsForUser.map(getTodoOrThrow);

  if (status === 'any') {
    return todosForUser;
  }

  return todosForUser.filter(
    (todo) => todo.complete === (status === 'completed'),
  );
}

function changeTodoStatus(id, complete) {
  const todo = getTodoOrThrow(id);

  // Replace with the modified complete value
  todosById.set(id, new Todo(id, todo.text, complete));
}

function markAllTodos(complete = true) {
  const todosToChange = getTodos().filter((todo) => todo.complete !== complete);

  todosToChange.forEach((todo) => changeTodoStatus(todo.id, complete));

  return todosToChange.map((todo) => todo.id);
}

function removeTodo(id) {
  const todoIdsForUser = getTodoIdsForUser(USER_ID);

  // Remove from the users list
  todoIdsByUser.set(
    USER_ID,
    todoIdsForUser.filter((todoId) => todoId !== id),
  );

  // And also from the total list of Todos
  todosById.delete(id);
}

function removeCompletedTodos() {
  const todoIdsForUser = getTodoIdsForUser(USER_ID);

  const todoIdsToRemove = getTodos()
    .filter((todo) => todo.complete)
    .map((todo) => todo.id);

  // Remove from the users list
  todoIdsByUser.set(
    USER_ID,
    todoIdsForUser.filter((todoId) => !todoIdsToRemove.includes(todoId)),
  );

  // And also from the total list of Todos
  todoIdsToRemove.forEach((id) => todosById.delete(id));

  return todoIdsToRemove;
}

function renameTodo(id, text) {
  const todo = getTodoOrThrow(id);

  // Replace with the modified text value
  todosById.set(id, new Todo(id, text, todo.complete));
}

module.exports = {
  Todo,
  User,
  USER_ID,
  getUserByID,
  getTodos,
  addTodo,
  changeTodoStatus,
  markAllTodos,
  removeCompletedTodos,
  removeTodo,
  renameTodo,
};
