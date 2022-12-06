import './App.css';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Teams from './components/Teams';
import Team from './components/Team';
import logo from './img/logo.png';
import Schedule from './components/Schedule';
import Standings from './components/Standings';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Link to="/">
            <img className="logo" src={logo} alt="nhl logo" />
          </Link>
          <br />
          <div className="flex-link">
            <Link className="root-link" to="/">
              Teams
            </Link>
            <Link className="root-link" to={`/schedule/${new Date().getFullYear()}-${('0' + (new Date().getMonth()+1)).slice(-2)}-${('0' + (new Date().getDate())).slice(-2)}`}>
              Scores
            </Link>
            <Link className="root-link" to="/standings">
              Standings
            </Link>
          </div>
          <br />
        </header>
      </div>
      <div className="App-body">
        <Routes>
          <Route path="/" element={<Teams />} />
          <Route path="/teams/:id" element={<Team />} />
          <Route path="/schedule/:date" element={<Schedule />} />
          <Route path="/standings" element={<Standings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
