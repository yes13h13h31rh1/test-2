import { useState, useEffect } from 'react';
import { getScripts, deleteScript } from '../api/scripts';
import { getAssets, getAssetDownloadUrl } from '../api/assets';
import { Script, Asset } from '../types';
import CodeEditor from '../components/CodeEditor';
import './Library.css';

type TabType = 'scripts' | 'assets' | 'all';

export default function Library() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [scripts, setScripts] = useState<Script[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [scriptsData, assetsData] = await Promise.all([
        getScripts(100),
        getAssets(100),
      ]);
      setScripts(scriptsData);
      setAssets(assetsData);
    } catch (error) {
      console.error('Failed to load library:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScript = async (id: string) => {
    if (!confirm('Are you sure you want to delete this script?')) return;

    try {
      await deleteScript(id);
      setScripts(scripts.filter((s) => s.id !== id));
      if (selectedScript?.id === id) {
        setSelectedScript(null);
      }
    } catch (error) {
      console.error('Failed to delete script:', error);
    }
  };

  const handleDownloadScript = (script: Script) => {
    const blob = new Blob([script.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.name}.verse`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredScripts = scripts.filter((s) =>
    s.name.toLowerCase().includes(filter.toLowerCase()) ||
    s.description?.toLowerCase().includes(filter.toLowerCase())
  );

  const filteredAssets = assets.filter((a) =>
    a.name.toLowerCase().includes(filter.toLowerCase()) ||
    a.description?.toLowerCase().includes(filter.toLowerCase())
  );

  const displayScripts = activeTab === 'all' || activeTab === 'scripts';
  const displayAssets = activeTab === 'all' || activeTab === 'assets';

  return (
    <div className="library">
      <h1>Asset & Script Library</h1>
      <p className="page-description">
        Browse and manage all your generated scripts and 3D assets
      </p>

      <div className="library-container">
        <div className="library-sidebar">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All ({scripts.length + assets.length})
            </button>
            <button
              className={`tab ${activeTab === 'scripts' ? 'active' : ''}`}
              onClick={() => setActiveTab('scripts')}
            >
              Scripts ({scripts.length})
            </button>
            <button
              className={`tab ${activeTab === 'assets' ? 'active' : ''}`}
              onClick={() => setActiveTab('assets')}
            >
              Assets ({assets.length})
            </button>
          </div>

          <div className="filter-section">
            <input
              type="text"
              placeholder="Filter by name or description..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="items-list">
            {loading ? (
              <div className="loading">Loading...</div>
            ) : (
              <>
                {displayScripts &&
                  filteredScripts.map((script) => (
                    <div
                      key={script.id}
                      className={`item-card ${selectedScript?.id === script.id ? 'selected' : ''}`}
                      onClick={() => setSelectedScript(script)}
                    >
                      <div className="item-header">
                        <span className="item-icon">📝</span>
                        <h3>{script.name}</h3>
                      </div>
                      <p className="item-type">{script.script_type}</p>
                      <p className="item-date">
                        {new Date(script.created_at).toLocaleDateString()}
                      </p>
                      <div className="item-actions">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadScript(script);
                          }}
                          className="action-button"
                        >
                          Download
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteScript(script.id);
                          }}
                          className="action-button delete"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}

                {displayAssets &&
                  filteredAssets.map((asset) => (
                    <div key={asset.id} className="item-card">
                      <div className="item-header">
                        <span className="item-icon">🎨</span>
                        <h3>{asset.name}</h3>
                      </div>
                      <p className="item-type">{asset.asset_type}</p>
                      <p className="item-date">
                        {new Date(asset.created_at).toLocaleDateString()}
                      </p>
                      <div className="item-actions">
                        <a
                          href={getAssetDownloadUrl(asset.id)}
                          download
                          className="action-button"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  ))}

                {filteredScripts.length === 0 &&
                  filteredAssets.length === 0 &&
                  !loading && (
                    <div className="empty-library">
                      <p>No items found</p>
                      {filter && <p className="hint">Try adjusting your filter</p>}
                    </div>
                  )}
              </>
            )}
          </div>
        </div>

        <div className="library-viewer">
          {selectedScript ? (
            <div className="viewer-content">
              <div className="viewer-header">
                <h2>{selectedScript.name}</h2>
                <button
                  className="close-button"
                  onClick={() => setSelectedScript(null)}
                >
                  ×
                </button>
              </div>
              <div className="viewer-meta">
                <span>Type: {selectedScript.script_type}</span>
                <span>
                  Created: {new Date(selectedScript.created_at).toLocaleString()}
                </span>
              </div>
              {selectedScript.description && (
                <p className="viewer-description">{selectedScript.description}</p>
              )}
              <CodeEditor code={selectedScript.code} language="verse" />
            </div>
          ) : (
            <div className="empty-viewer">
              <p>Select an item from the library to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
