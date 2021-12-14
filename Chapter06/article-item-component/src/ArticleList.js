import * as React from "react";
import ArticleItem from "./ArticleItem";

class ArticleList extends React.Component {
  render() {
    const { articles, onClickToggle, onClickRemove } = this.props;

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
}

export default ArticleList;
