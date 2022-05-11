import { useState } from 'react';
import classnames from 'classnames';
import { useMutation } from '@apollo/client';

import TodoTextInput from './TodoTextInput';
import {
  CHANGE_TODO_STATUS,
  RENAME_TODO,
  REMOVE_TODO,
  GET_USER,
} from '../constants';

function TodoItem({ todo }) {
  const [isEditing, setIsEditing] = useState(false);

  const [changeTodoStatus] = useMutation(CHANGE_TODO_STATUS, {
    refetchQueries: [{ query: GET_USER, variables: { userId: 'me' } }],
  });

  const [renameTodo] = useMutation(RENAME_TODO, {
    refetchQueries: [{ query: GET_USER, variables: { userId: 'me' } }],
  });

  const [removeTodo] = useMutation(REMOVE_TODO, {
    refetchQueries: [{ query: GET_USER, variables: { userId: 'me' } }],
  });

  const handleCompleteChange = (e) => {
    const complete = e.currentTarget.checked;

    changeTodoStatus({ variables: { id: todo.id, complete } });
  };

  const handleDestroyClick = () => handleRemoveTodo();
  const handleLabelDoubleClick = () => setIsEditing(true);
  const handleTextInputCancel = () => setIsEditing(false);

  const handleTextInputDelete = () => {
    setIsEditing(false);
    handleRemoveTodo();
  };

  const handleTextInputSave = (text) => {
    setIsEditing(false);

    renameTodo({
      variables: {
        id: todo.id,
        text,
      },
    });
  };

  const handleRemoveTodo = () => {
    removeTodo({ variables: { id: todo.id } });
  };

  return (
    <li
      className={classnames({
        completed: todo.complete,
        editing: isEditing,
      })}
    >
      <div className='view'>
        <input
          checked={todo.complete}
          className='toggle'
          onChange={handleCompleteChange}
          type='checkbox'
        />

        <label onDoubleClick={handleLabelDoubleClick}>{todo.text}</label>
        <button className='destroy' onClick={handleDestroyClick} />
      </div>

      {isEditing && (
        <TodoTextInput
          className='edit'
          commitOnBlur={true}
          initialValue={todo.text}
          onCancel={handleTextInputCancel}
          onDelete={handleTextInputDelete}
          onSave={handleTextInputSave}
        />
      )}
    </li>
  );
};

export default TodoItem;
