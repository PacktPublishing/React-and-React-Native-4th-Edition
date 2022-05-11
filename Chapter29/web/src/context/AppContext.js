import { ArticlesContextProvider } from './ArticlesContext';

const AppContext = ({ children }) => {
  return <ArticlesContextProvider>{children}</ArticlesContextProvider>;
};

export default AppContext;
