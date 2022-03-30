import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ArticlesContext from '../context/ArticlesContext';

const listStyle = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
};

const listItemStyle = {
  margin: '0 5px',
};

const titleStyle = {
  background: 'transparent',
  border: 'none',
  font: 'inherit',
  cursor: 'pointer',
  padding: '5px 0',
};

function Home() {
  const { fetchArticles, articles } = useContext(ArticlesContext);

  useEffect(() => {
    if (!articles.length) {
      fetchArticles();
    }
  }, [articles, fetchArticles]);

  return (
    <ul style={listStyle}>
      {articles.length === 0 ? <li style={listItemStyle}>...</li> : null}
      {articles.map(({ id, title, summary }) => (
        <li key={id} style={listItemStyle}>
          <Link to={`articles/${id}`}>
            <button style={titleStyle}>{title}</button>
          </Link>

          <p>
            <small>
              <span>{summary} </span>
              <Link to={`/articles/${id}`}>More...</Link>
            </small>
          </p>
        </li>
      ))}
    </ul>
  );
}

export default Home;
