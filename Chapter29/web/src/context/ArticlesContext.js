import { createContext, useCallback, useMemo, useReducer } from 'react';

export const ArticlesContext = createContext();

const initialState = {
  article: {},
  articles: [],
  filter: '',
  loading: true,
  error: '',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'GET_ARTICLES_SUCCESS':
      return {
        ...state,
        articles: action.payload,
        loading: false,
      };
    case 'GET_ARTICLES_ERROR':
      return {
        ...state,
        articles: [],
        loading: false,
        error: action.payload,
      };
    case 'GET_SINGLE_ARTICLE_SUCCESS':
      return {
        ...state,
        article: action.payload,
        loading: false,
      };
    case 'GET_SINGLE_ARTICLES_ERROR':
      return {
        ...state,
        article: {},
        loading: false,
        error: action.payload,
      };
    case 'SET_ARTICLES_FILTER': {
      return {
        ...state,
        filter: action.payload,
      };
    }
    default:
      return state;
  }
};

export const ArticlesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  async function fetchArticles(filter = '') {
    try {
      const data = await fetch(
        `http://localhost:3001/articles${filter ? `?category=${filter}` : ''}`,
      );
      const result = await data.json();

      if (result) {
        dispatch({ type: 'GET_ARTICLES_SUCCESS', payload: result });
      }
    } catch (e) {
      dispatch({ type: 'GET_ARTICLES_ERROR', payload: e.message });
    }
  }

  async function fetchSingleArticle(id) {
    try {
      const data = await fetch(`http://localhost:3001/articles/${id}`);
      const result = await data.json();

      if (result) {
        dispatch({ type: 'GET_SINGLE_ARTICLE_SUCCESS', payload: result });
      }
    } catch (e) {
      dispatch({ type: 'GET_SINGLE_ARTICLE_ERROR', payload: e.message });
    }
  }

  const filterArticles = useCallback(async (filter) => {
    dispatch({ type: 'SET_ARTICLES_FILTER', payload: filter });

    fetchArticles(filter);
  }, []);

  const value = useMemo(
    () => ({ ...state, fetchArticles, fetchSingleArticle, filterArticles }),
    [filterArticles, state],
  );

  return (
    <ArticlesContext.Provider value={value}>
      {children}
    </ArticlesContext.Provider>
  );
};

export default ArticlesContext;
