import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Landing from './pages/Landing';
import ScriptGenerator from './pages/ScriptGenerator';
import AssetGenerator from './pages/AssetGenerator';
import Library from './pages/Library';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              🎮 UEFN AI Generator
            </Link>
            <div className="nav-links">
              <Link to="/scripts">Script Generator</Link>
              <Link to="/assets">3D Asset Generator</Link>
              <Link to="/library">Library</Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/scripts" element={<ScriptGenerator />} />
            <Route path="/assets" element={<AssetGenerator />} />
            <Route path="/library" element={<Library />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
