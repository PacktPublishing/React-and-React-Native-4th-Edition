import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ArticlesContext from '../context/ArticlesContext';

const articleStyle = {
  margin: '0 5px',
};

function Home() {
  const { fetchSingleArticle, article } = useContext(ArticlesContext);
  let params = useParams();

  useEffect(() => {
    if (!article.id && params.id) {
      fetchSingleArticle(params.id);
    }
  }, [params.id, article, fetchSingleArticle]);

  return (
    <div style={articleStyle}>
      {!article.id === 0 ? <p>...</p> : null}
      <h2>{article.title}</h2>
      <p>{article.full}</p>
    </div>
  );
}

export default Home;
