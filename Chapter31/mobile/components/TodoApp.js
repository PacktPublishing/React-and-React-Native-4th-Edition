import React from 'react';
import { Text, View } from 'react-native';
import { useMutation, useQuery } from '@apollo/client';

import TodoList from './TodoList';
import TodoTextInput from './TodoTextInput';
import { GET_USER, ADD_TODO } from '../constants';

import styles from '../styles';

function TodoApp() {
  const { loading, error, data } = useQuery(GET_USER, {
    variables: {
      userId: 'me', // Mock authenticated ID that matches database
    },
  });

  const [addTodo] = useMutation(ADD_TODO, {
    refetchQueries: [
      {
        query: GET_USER,
        variables: {
          userId: 'me',
        },
      },
    ],
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{`Error! ${error.message}`}</Text>;

  return (
    <View style={styles.container}>
      <TodoTextInput />
      <TodoList user={data.user} />
    </View>
  );
}

export default TodoApp;
