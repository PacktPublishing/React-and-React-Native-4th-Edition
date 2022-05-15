import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import TodoApp from './components/TodoApp';

// Replace this value with the network IP address of your machine
const NETWORK_IP = '192.168.178.143';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: `http://${NETWORK_IP}:4000/graphql`,
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <TodoApp />
    </ApolloProvider>
  );
}
