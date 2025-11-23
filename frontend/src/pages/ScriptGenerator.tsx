import { useState } from 'react';
import { ScriptType } from '../types';
import { generateScript } from '../api/scripts';
import CodeEditor from '../components/CodeEditor';
import './ScriptGenerator.css';

export default function ScriptGenerator() {
  const [description, setDescription] = useState('');
  const [scriptType, setScriptType] = useState<ScriptType>(ScriptType.WAVE_SPAWNER);
  const [name, setName] = useState('');
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [performance, setPerformance] = useState('');
  const [complexity, setComplexity] = useState('');

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError('Please provide a description');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await generateScript({
        description,
        scriptType,
        name: name || undefined,
        constraints: {
          performance: performance || undefined,
          complexity: complexity || undefined,
        },
      });

      setGeneratedScript(result.code);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate script');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedScript) return;

    const blob = new Blob([generatedScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name || 'script'}.verse`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="script-generator">
      <h1>UEFN Script Generator</h1>
      <p className="page-description">
        Generate valid Verse code for your Fortnite UEFN projects
      </p>

      <div className="generator-container">
        <div className="input-panel">
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., wave-based enemy spawner with scaling difficulty that spawns 5 enemies per wave, increasing by 20% each wave..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="scriptType">Script Type *</label>
            <select
              id="scriptType"
              value={scriptType}
              onChange={(e) => setScriptType(e.target.value as ScriptType)}
            >
              <option value={ScriptType.WAVE_SPAWNER}>Wave Spawner</option>
              <option value={ScriptType.ABILITY}>Ability</option>
              <option value={ScriptType.GAME_MODE}>Game Mode</option>
              <option value={ScriptType.TRIGGER_DEVICE}>Trigger Device</option>
              <option value={ScriptType.UI_LOGIC}>UI Logic</option>
              <option value={ScriptType.WEAPON}>Weapon</option>
              <option value={ScriptType.CUSTOM}>Custom</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="name">Script Name (optional)</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Custom Script"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="performance">Performance Constraints (optional)</label>
              <input
                id="performance"
                type="text"
                value={performance}
                onChange={(e) => setPerformance(e.target.value)}
                placeholder="e.g., optimized for 60fps"
              />
            </div>

            <div className="form-group">
              <label htmlFor="complexity">Complexity (optional)</label>
              <input
                id="complexity"
                type="text"
                value={complexity}
                onChange={(e) => setComplexity(e.target.value)}
                placeholder="e.g., beginner-friendly"
              />
            </div>
          </div>

          <button
            className="generate-button"
            onClick={handleGenerate}
            disabled={loading || !description.trim()}
          >
            {loading ? 'Generating...' : 'Generate Script'}
          </button>

          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="output-panel">
          <div className="output-header">
            <h2>Generated Code</h2>
            {generatedScript && (
              <button className="download-button" onClick={handleDownload}>
                Download .verse
              </button>
            )}
          </div>
          {generatedScript ? (
            <CodeEditor code={generatedScript} language="verse" />
          ) : (
            <div className="empty-state">
              <p>Your generated Verse code will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
