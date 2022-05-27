import React from 'react';
import { View } from 'react-native';

import Todo from './Todo';

function TodoList({ user }) {
  return (
    <View>
      {user.todos.map((todo) => (
        <Todo key={todo.id} todo={todo} />
      ))}
    </View>
  );
}

export default TodoList;
