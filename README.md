# Synapse — Decentralized Chat dApp

Synapse is a fully decentralized chat application built on Web3. Your identity,
friends, and messages live on a blockchain smart contract instead of a central
server — secured by your crypto wallet and owned by you.

Built with **Next.js**, **ethers.js**, **Web3Modal**, **Solidity**, and
**Hardhat**, running on the **Polygon Amoy** testnet.

---

## Prerequisites

- **Node.js** v16+ and **npm**
- **MetaMask** browser extension ([metamask.io](https://metamask.io))
- A little **test MATIC** on Polygon Amoy for gas
  (free from the [Polygon faucet](https://faucet.polygon.technology/) —
  select the **Amoy** network)

---

## Quick start (run the frontend)

The app is already wired to a smart contract deployed on Polygon Amoy, so you
**don't need to deploy anything** to try it.

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd DTALK

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open **http://localhost:3000** in a browser that has MetaMask installed.

In the app:

1. Click **Connect Wallet** — MetaMask will prompt you to switch to the
   **Polygon Amoy** network (the app adds it automatically).
2. Create an account by choosing a **username**.
3. Add friends from the **Discover** page (or **Add Friend**), then start
   chatting. Each message is an on-chain transaction, so MetaMask will ask you
   to confirm and it costs a tiny amount of test MATIC.

> No wallet? You can still browse the UI, but any on-chain action (create
> account, add friend, send message) will ask you to connect first.

### Production build

```bash
npm run build   # compile an optimized build
npm start       # serve it (defaults to port 3000)
```

---

## Available scripts

| Command         | What it does                                  |
| --------------- | --------------------------------------------- |
| `npm run dev`   | Start the Next.js dev server (hot reload)     |
| `npm run build` | Create a production build                     |
| `npm start`     | Serve the production build                    |
| `npm run lint`  | Run Next.js / ESLint checks                   |

---

## (Optional) Deploy your own smart contract

Only needed if you want to run against your **own** contract instead of the
bundled one. The Solidity source is in [`contracts/ChatApp.sol`](contracts/ChatApp.sol).

1. Put your deployer wallet's **private key** into
   [`hardhat.config.js`](hardhat.config.js) (replace `YOUR_PRIVATE_KEY`).
   > ⚠️ Never commit a real private key. Prefer an env var / `.env.local`.

2. Make sure that wallet has test MATIC on Amoy, then deploy:

   ```bash
   npx hardhat run scripts/deploy.js --network polygon_amoy
   ```

3. Copy the printed **Contract Address** into
   [`Context/constants.js`](Context/constants.js) → `ChatAppAddress`.

4. Restart `npm run dev`.

### Local blockchain (alternative)

To test entirely offline against a local Hardhat node:

```bash
npx hardhat node                                   # terminal 1
npx hardhat run scripts/deploy.js --network localhost  # terminal 2
```

Then set `ChatAppAddress` to the locally deployed address and point MetaMask at
`http://127.0.0.1:8545` (chain id 31337).

---

## Project structure

```
Components/   UI components (NavBar, Chat, Friend, Model, Notification, …)
Context/      React Context state + contract address & network config
Utils/        Wallet / contract helpers (ethers + Web3Modal)
pages/        Next.js routes: / (chat), /alluser (discover), /about
contracts/    ChatApp.sol smart contract
scripts/      deploy.js deployment script
styles/       global + per-page CSS modules
```

---

## Troubleshooting

- **"Wrong network" toast** — switch MetaMask to Polygon Amoy (the app tries to
  add it for you on connect).
- **Transactions failing / "insufficient funds"** — get test MATIC from the
  Amoy faucet.
- **Nothing loads after connecting** — make sure you're on Amoy and the
  `ChatAppAddress` in `Context/constants.js` matches a deployed contract.
