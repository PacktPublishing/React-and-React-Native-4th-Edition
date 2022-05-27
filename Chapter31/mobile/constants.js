import { gql } from '@apollo/client';

export const GET_USER = gql`
  query GetUser($userId: String) {
    user(id: $userId) {
      id
      totalCount
      completedCount
      todos {
        id
        text
        complete
      }
    }
  }
`;

export const ADD_TODO = gql`
  mutation AddTodo($text: String) {
    addTodo(text: $text) {
      id
    }
  }
`;

export const CHANGE_TODO_STATUS = gql`
  mutation ChangeTodoStatus($id: Int!, $complete: Boolean) {
    changeTodoStatus(id: $id, complete: $complete) {
      id
      complete
    }
  }
`;

export const RENAME_TODO = gql`
  mutation RenameTodo($id: Int!, $text: String) {
    renameTodo(id: $id, text: $text) {
      id
      text
    }
  }
`;

export const REMOVE_TODO = gql`
  mutation RemoveTodo($id: Int!) {
    removeTodo(id: $id) {
      id
    }
  }
`;

export const MARK_ALL_TODOS = gql`
  mutation MarkAllTodos {
    markAllTodos {
      id
      complete
    }
  }
`;

export const REMOVE_COMPLETED_TODOS = gql`
  mutation RemoveCompletedTodos {
    removeCompletedTodos {
      id
    }
  }
`;
