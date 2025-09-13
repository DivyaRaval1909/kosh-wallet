
import React, { useState } from 'react';
import './App.css';
import { generateMnemonic } from "bip39";
import { SolanaWallet } from './SolanaWallet';
import { EthWallet } from './EthWallet';

function App() {
  const [mnemonic, setMnemonic] = useState("");
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState('dark');

  // Set default dark mode on mount
  React.useEffect(() => {
    document.body.classList.add('dark-mode');
    return () => document.body.classList.remove('dark-mode');
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(mnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      document.body.classList.add('dark-mode');
    } else {
      setTheme('light');
      document.body.classList.remove('dark-mode');
    }
  };

  return (
    <div className={`app-container ${theme}-mode`}>
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10rem', margin:'10px' }}>
            <h1 className="main-title" style={{ margin: 0 }}>KoshWallet</h1>
            <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle night/day mode">
            {theme === 'dark' ? 'Dark' : 'Light'}
        </button>
        </div>
          
      </header>
      <div className="wallet-box mnemonic-box ">
        <button className="mnemonic-btn" onClick={async () => {
          const mn = await generateMnemonic();
          setMnemonic(mn);
        }}>
          Create Seed Phrase
        </button>
        <div className="mnemonic-row mnemonic-2row">
          {mnemonic ? (
            <>
              <div className="mnemonic-row-group">
                {mnemonic.split(' ').slice(0, 6).map((word, idx) => (
                  <button
                    key={idx}
                    className="mnemonic-word-btn"
                    onClick={() => navigator.clipboard.writeText(word)}
                  >
                    {word}
                  </button>
                ))}
              </div>
              <div className="mnemonic-row-group">
                {mnemonic.split(' ').slice(6, 12).map((word, idx) => (
                  <button
                    key={idx + 6}
                    className="mnemonic-word-btn"
                    onClick={() => navigator.clipboard.writeText(word)}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <span className="mnemonic-placeholder">Your mnemonic will appear here</span>
          )}
        </div>
        {mnemonic && (
          <button className="copy-btn" style={{ marginTop: '1rem' }} onClick={handleCopy}>
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
      {mnemonic && (
        <div className="wallets-container">
          <SolanaWallet mnemonic={mnemonic} />
          <EthWallet mnemonic={mnemonic} />
        </div>
      )}
    </div>
  );
}

export default App;
