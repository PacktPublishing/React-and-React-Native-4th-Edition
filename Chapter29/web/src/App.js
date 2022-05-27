import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Filter from './components/Filter';
import Home from './components/Home';
import Article from './components/Article';
import AppContext from './context/AppContext';

function App() {
  return (
    <BrowserRouter>
      <div>
        <h1>Hipster news app</h1>
        <AppContext>
          <Filter />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route exact path='/articles/:id' element={<Article />} />
          </Routes>
        </AppContext>
      </div>
    </BrowserRouter>
  );
}

export default App;
