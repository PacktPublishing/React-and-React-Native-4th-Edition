import { useMutation, useQuery } from '@apollo/client';

import TodoList from './components/TodoList';
import TodoListFooter from './components/TodoListFooter';
import TodoTextInput from './components/TodoTextInput';
import { GET_USER, ADD_TODO } from './constants';

function App() {
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

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const hasTodos = data.user.totalCount > 0;

  return (
    <div>
      <section className='todoapp'>
        <header className='header'>
          <h1>todos</h1>

          <TodoTextInput
            className='new-todo'
            onSave={(text) => addTodo({ variables: { text } })}
            placeholder='What needs to be done?'
          />
        </header>

        <TodoList user={data.user} />
        {hasTodos && <TodoListFooter user={data.user} />}
      </section>
    </div>
  );
}

export default App;
