import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
// import SignOut from './pages/SignOut';
import './App.css';

export default function App() {
  // setInterval(() => {
  //   console.log('interval!');
  // }, 2000);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
