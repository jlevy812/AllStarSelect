import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Router instead of BrowserRouter
import PlayerSelectPage from './pages/PlayerSelectPage';
import StartPage from './pages/StartPage';
import FinishPage from './pages/FinishPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/AllStarSelect" element={<StartPage />} /> 
        <Route path="/AllStarSelect/SelectPage" element={<PlayerSelectPage />} />
        <Route path="/AllStarSelect/FinishPage" element={<FinishPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
