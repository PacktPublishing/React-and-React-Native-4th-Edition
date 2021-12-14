import * as React from "react";
import ArticleItem from "./ArticleItem";

function ArticleList({ articles, onClickToggle, onClickRemove }) {
  return (
    <ul>
      {articles.map((i) => (
        <ArticleItem
          key={i.id}
          article={i}
          onClickToggle={onClickToggle}
          onClickRemove={onClickRemove}
        />
      ))}
    </ul>
  );
}

export default ArticleList;
