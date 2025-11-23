import { useState } from 'react';
import { generateAsset } from '../api/assets';
import './AssetGenerator.css';

export default function AssetGenerator() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('low-poly');
  const [assetType, setAssetType] = useState('prop');
  const [polyCount, setPolyCount] = useState(1000);
  const [lodLevel, setLodLevel] = useState(0);
  const [outputFormat, setOutputFormat] = useState('gltf');
  const [name, setName] = useState('');
  const [generatedAsset, setGeneratedAsset] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please provide a prompt');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await generateAsset({
        prompt,
        style,
        assetType,
        polyCount,
        lodLevel,
        outputFormat,
        name: name || undefined,
      });

      setGeneratedAsset(result);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate asset');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedAsset) return;

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    window.open(`${API_URL}/api/assets/${generatedAsset.id}/download`, '_blank');
  };

  return (
    <div className="asset-generator">
      <h1>3D Asset Generator</h1>
      <p className="page-description">
        Generate 3D meshes for props, weapons, buildings, and environment pieces
      </p>

      <div className="generator-container">
        <div className="input-panel">
          <div className="form-group">
            <label htmlFor="prompt">Prompt *</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., low-poly sci-fi crate for UEFN, futuristic weapon prop, medieval building piece..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="assetType">Asset Category</label>
            <select
              id="assetType"
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
            >
              <option value="prop">Prop</option>
              <option value="weapon">Weapon</option>
              <option value="building">Building</option>
              <option value="environment">Environment</option>
              <option value="vfx">VFX Mesh</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="style">Style</label>
            <select
              id="style"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            >
              <option value="low-poly">Low-Poly</option>
              <option value="realistic">Realistic</option>
              <option value="toon">Toon</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="polyCount">Target Poly Count</label>
              <input
                id="polyCount"
                type="number"
                value={polyCount}
                onChange={(e) => setPolyCount(parseInt(e.target.value) || 1000)}
                min={100}
                max={50000}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lodLevel">LOD Level</label>
              <input
                id="lodLevel"
                type="number"
                value={lodLevel}
                onChange={(e) => setLodLevel(parseInt(e.target.value) || 0)}
                min={0}
                max={3}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="outputFormat">Output Format</label>
            <select
              id="outputFormat"
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
            >
              <option value="gltf">GLTF</option>
              <option value="obj">OBJ</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="name">Asset Name (optional)</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Custom Asset"
            />
          </div>

          <button
            className="generate-button"
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
          >
            {loading ? 'Generating...' : 'Generate Asset'}
          </button>

          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="output-panel">
          <div className="output-header">
            <h2>Generated Asset</h2>
            {generatedAsset && (
              <button className="download-button" onClick={handleDownload}>
                Download {generatedAsset.file_format.toUpperCase()}
              </button>
            )}
          </div>

          {generatedAsset ? (
            <div className="asset-preview">
              <div className="preview-placeholder">
                <div className="preview-icon">🎨</div>
                <p>3D Asset Preview</p>
                <p className="preview-hint">Download the asset to view in your 3D software</p>
              </div>

              <div className="asset-metadata">
                <h3>Metadata</h3>
                <div className="metadata-grid">
                  <div className="metadata-item">
                    <span className="metadata-label">Name:</span>
                    <span className="metadata-value">{generatedAsset.name}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Type:</span>
                    <span className="metadata-value">{generatedAsset.asset_type}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Style:</span>
                    <span className="metadata-value">{generatedAsset.style}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Poly Count:</span>
                    <span className="metadata-value">{generatedAsset.poly_count || 'N/A'}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Format:</span>
                    <span className="metadata-value">{generatedAsset.file_format.toUpperCase()}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Material Slots:</span>
                    <span className="metadata-value">{generatedAsset.material_slots || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <p>Your generated 3D asset will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
