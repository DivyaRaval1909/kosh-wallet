import React, { useState } from "react";
import "./App.css";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";

export function SolanaWallet({ mnemonic }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [wallets, setWallets] = useState([]);
    const [showPrivates, setShowPrivates] = useState({});

    const [showConfirm, setShowConfirm] = useState(false);
    const handleClear = () => {
        if (wallets.length === 0) return;
        setShowConfirm(true);
    };
    const confirmClear = () => {
        setWallets([]);
        setCurrentIndex(0);
        setShowPrivates({});
        setShowConfirm(false);
    };
    const cancelClear = () => {
        setShowConfirm(false);
    };

    const addWallet = async () => {
        const seed = await mnemonicToSeed(mnemonic);
        const path = `m/44'/501'/${currentIndex}'/0'`;
        const derivedSeed = derivePath(path, seed.toString("hex")).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const keypair = Keypair.fromSecretKey(secret);

        setCurrentIndex(currentIndex + 1);
        // Convert Uint8Array to hex string
        const toHex = (arr) => Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
        setWallets([
            ...wallets,
            {
                publicKey: keypair.publicKey.toBase58(),
                privateKey: toHex(keypair.secretKey)
            }
        ]);
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
    };

    const toggleShowPrivate = (idx) => {
        setShowPrivates(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    return (
        <div className="wallet-box" style={{ minWidth: 400, minHeight: 220, position: 'relative' }}>
            <h2>Solana Wallet</h2>
            <div style={{ display: 'flex', gap: '1rem', margin: '10px 0 10px 0' }}>
                <button className="mnemonic-btn" onClick={addWallet}>Add wallet</button>
                {wallets.length > 0 && (
                    <button className="clear-btn-red" onClick={handleClear}>Clear Wallets</button>
                )}
            </div>
            <div style={{ width: '100%' }}>
                {wallets.map((wallet, idx) => (
                    <div key={idx} className="mnemonic-box" style={{ margin: '10px 0px', padding: '18px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minHeight: 90 }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
                            <strong>Public Key:</strong>
                            <button
                                className="mnemonic-word-btn"
                                style={{ marginLeft: 10, fontSize: '0.95rem', padding: '0.4rem 0.7rem', wordBreak: 'break-all' }}
                                onClick={() => handleCopy(wallet.publicKey)}
                                title="Copy Public Key"
                            >
                                {wallet.publicKey}
                            </button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            <strong>Private Key:</strong>
                            {showPrivates[idx] ? (
                                <>
                                    <button
                                        className="mnemonic-word-btn"
                                        style={{ marginLeft: 10, fontSize: '0.95rem', padding: '0.4rem 0.7rem', wordBreak: 'break-all' }}
                                        onClick={() => handleCopy(wallet.privateKey)}
                                        title="Copy Private Key"
                                    >
                                        {wallet.privateKey}
                                    </button>
                                    <button
                                        className="copy-btn"
                                        style={{ marginLeft: 10, padding: '0.4rem 0.7rem', fontSize: '0.95rem' }}
                                        onClick={() => toggleShowPrivate(idx)}
                                    >
                                        Hide
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="copy-btn"
                                    style={{ marginLeft: 10, padding: '0.4rem 0.7rem', fontSize: '0.95rem' }}
                                    onClick={() => toggleShowPrivate(idx)}
                                >
                                    Show Private Key
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {showConfirm && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div className="modal-title">Delete All Solana Wallets?</div>
                        <div className="modal-message">Are you sure you want to delete all Solana wallets? This action cannot be undone.</div>
                        <div className="modal-actions">
                            <button className="clear-btn-red" onClick={cancelClear}>Cancel</button>
                            <button className="mnemonic-btn" onClick={confirmClear}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
