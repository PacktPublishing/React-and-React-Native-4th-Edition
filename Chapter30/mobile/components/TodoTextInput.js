import React from 'react';
import { TextInput } from 'react-native';
import { useMutation } from '@apollo/client';

import styles from '../styles';
import { GET_USER, ADD_TODO } from '../constants';

function TodoTextInput() {
  const [addTodo] = useMutation(ADD_TODO, {
    refetchQueries: [{ query: GET_USER, variables: { userId: 'me' } }],
  });

  return (
    <TextInput
      style={styles.textInput}
      placeholder='What needs to be done?'
      onSubmitEditing={({ nativeEvent: { text } }) =>
        addTodo({ variables: { text } })
      }
    />
  );
}

export default TodoTextInput;
