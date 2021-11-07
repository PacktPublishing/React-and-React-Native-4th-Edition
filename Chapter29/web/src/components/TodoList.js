import React from 'react';
import { useMutation } from '@apollo/client';

import TodoItem from './TodoItem';
import { MARK_ALL_TODOS, GET_USER } from '../constants';

function TodoList({ user: { todos, totalCount, completedCount } }) {
  const [markAllTodos] = useMutation(MARK_ALL_TODOS, {
    refetchQueries: [{ query: GET_USER, variables: { userId: 'me' } }],
  });

  const handleMarkAllChange = () => {
    if (todos) {
      markAllTodos();
    }
  };

  return (
    <section className='main'>
      <input
        checked={totalCount === completedCount}
        className='toggle-all'
        onChange={handleMarkAllChange}
        type='checkbox'
      />

      <label htmlFor='toggle-all'>Mark all as complete</label>

      <ul className='todo-list'>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  );
}

export default TodoList;
