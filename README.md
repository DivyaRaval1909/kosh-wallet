# KoshWallet

A modern, open-source web wallet for Ethereum and Solana, built with React and Vite.

## Features
- Generate and manage Ethereum & Solana wallets from a single mnemonic
- Copy public/private keys with one click
- Show/hide private keys for security
- Modern, responsive UI with dark/light mode toggle
- Mnemonic displayed as interactive buttons (6x2 layout)
- Clear all wallets with confirmation modal
- Branded, minimal design


## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the app locally:**
   ```bash
   npm run dev
   ```
3. **Open in browser:**
   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal)

## Project Structure
- `src/App.jsx` — Main app container, header, theme, mnemonic, and wallet management
- `src/EthWallet.jsx` — Ethereum wallet logic and UI
- `src/SolanaWallet.jsx` — Solana wallet logic and UI
- `src/App.css` — All custom styles
- `src/assets/` — App assets (logo, etc.)

## Tech Stack
- React
- Vite
- Ethers.js
- @solana/web3.js
- bip39, ed25519-hd-key, tweetnacl

## License
MIT

---
Made with ❤️ by Divya Raval
