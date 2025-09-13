import React, { useState } from "react";
import "./App.css";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";

export const EthWallet = ({ mnemonic }) => {
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
        const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
        const hdNode = HDNodeWallet.fromSeed(seed);
        const child = hdNode.derivePath(derivationPath);
        const wallet = new Wallet(child.privateKey);

        setCurrentIndex(currentIndex + 1);
        setWallets([
            ...wallets,
            {
                address: wallet.address,
                privateKey: wallet.privateKey
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
        <div className="wallet-box" style={{ minWidth: 100, minHeight: 220, position: 'relative' }}>
            <h2>Ethereum Wallet</h2>
            <div style={{ display: 'flex', gap: '1rem', margin: '10px 0 10px 0' }}>
                <button className="mnemonic-btn" onClick={addWallet}>Add ETH wallet</button>
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
                                onClick={() => handleCopy(wallet.address)}
                                title="Copy Address"
                            >
                                {wallet.address}
                            </button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap',marginRight:10 }}>
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
                        <div className="modal-title">Delete All Ethereum Wallets?</div>
                        <div className="modal-message">Are you sure you want to delete all Ethereum wallets? This action cannot be undone.</div>
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
