# SSI Blockchain Layer (Hardhat)

Minimal Hardhat project for deploying and testing the `DIDRegistry` smart contract.

## 1) Prerequisites

Install these first:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (LTS recommended, v18+)
- `npm` (comes with Node.js)

> You do **not** need to install Hardhat globally. It is already included in this project dependencies.

## 2) Clone and install

```bash
git clone https://github.com/surue-s/ssi-blockchain-layer.git
cd ssi-blockchain-layer
npm install
```

## 3) Basic project commands

Compile contracts:

```bash
npx hardhat compile
```

Run tests:

```bash
npx hardhat test
```

## 4) Run locally (optional)

Start a local Hardhat node:

```bash
npx hardhat node
```

In another terminal, deploy to local node:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

## 5) Deploy to Polygon Amoy (optional)

Create a `.env` file in the project root:

```env
PRIVATE_KEY=your_wallet_private_key
REPORT_GAS=false
```

Then deploy:

```bash
npx hardhat run scripts/deploy.js --network polygonAmoy
```

## Notes

- Deployment output is saved to `deployment.json`.
- Current `package.json` does not define useful npm scripts yet (use `npx hardhat ...` directly).
- `scripts/test-interactins.js` appears out of sync with the current contract API and may fail until updated.
