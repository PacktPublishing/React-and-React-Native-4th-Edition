import { useContext } from 'react';
import { Link } from 'react-router-dom';
import ArticlesContext from '../context/ArticlesContext';

const categoryListStyle = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
};

const categoryItemStyle = {
  padding: '5px',
  cursor: 'pointer',
};

const categories = ['local', 'global', 'tech', 'sports'];

function Filter() {
  const { filter, filterArticles } = useContext(ArticlesContext);

  return (
    <ul style={categoryListStyle}>
      <li style={categoryItemStyle}>Filter:</li>
      {categories.map((category) => (
        <li
          key={category}
          style={{
            ...categoryItemStyle,
            ...(filter === category && { fontWeight: 'bold' }),
          }}
        >
          <Link to={`/`} onClick={() => filterArticles(category)}>
            {category}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default Filter;
