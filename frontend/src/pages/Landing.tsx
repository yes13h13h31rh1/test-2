import { Link } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing">
      <div className="hero">
        <h1>🎮 Fortnite UEFN AI Generator</h1>
        <p className="subtitle">
          Generate Verse scripts and 3D assets for your Fortnite UEFN projects with AI
        </p>
      </div>

      <div className="features">
        <Link to="/scripts" className="feature-card">
          <div className="feature-icon">📝</div>
          <h2>Generate UEFN Scripts</h2>
          <p>
            Create valid Verse code for gameplay systems, devices, abilities, 
            game modes, and more. Just describe what you want!
          </p>
          <div className="feature-badge">Get Started →</div>
        </Link>

        <Link to="/assets" className="feature-card">
          <div className="feature-icon">🎨</div>
          <h2>Generate 3D Assets</h2>
          <p>
            AI-powered 3D mesh generation for props, weapons, buildings, 
            and environment pieces. Export as GLTF or FBX.
          </p>
          <div className="feature-badge">Get Started →</div>
        </Link>

        <Link to="/library" className="feature-card">
          <div className="feature-icon">📚</div>
          <h2>Asset & Script Library</h2>
          <p>
            Browse, filter, and manage all your generated content. 
            Download scripts and assets, or regenerate with new parameters.
          </p>
          <div className="feature-badge">View Library →</div>
        </Link>
      </div>

      <div className="info-section">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Describe Your Idea</h3>
            <p>Tell us what script or asset you need</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>AI Generates</h3>
            <p>Our AI creates valid Verse code or 3D meshes</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Use in UEFN</h3>
            <p>Download and integrate into your Fortnite project</p>
          </div>
        </div>
      </div>
    </div>
  );
}
