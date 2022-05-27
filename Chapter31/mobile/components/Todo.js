import React from 'react';
import { Text, View, Switch } from 'react-native';
import { useMutation } from '@apollo/client';

import styles from '../styles';
import { CHANGE_TODO_STATUS, GET_USER } from '../constants';

const completeStyleMap = new Map([
  [true, { textDecorationLine: 'line-through' }],
  [false, {}],
]);

function Todo({ todo: { id, text, complete } }) {
  const [changeTodoStatus] = useMutation(CHANGE_TODO_STATUS, {
    refetchQueries: [{ query: GET_USER, variables: { userId: 'me' } }],
  });

  return (
    <View style={styles.todoItem}>
      <Switch
        value={complete}
        onValueChange={(value) =>
          changeTodoStatus({ variables: { id, complete: value } })
        }
      />
      <Text style={completeStyleMap.get(complete)}>{text}</Text>
    </View>
  );
}

export default Todo;
