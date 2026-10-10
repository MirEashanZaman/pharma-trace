# PharmaTrace-ES: Anti-Counterfeit Pharmaceutical Track-and-Trace on Blockchain

An event-driven microservices architecture for pharmaceutical supply chain traceability combining **Event Sourcing**, **CQRS**, **Saga Custody Validation**, **IoT Cold-Chain Telemetry**, and a **Solidity Smart Contract Attestation Anchor (EVM / Web3)**.

---

## 📁 Repository Structure

```text
pharma-trace/
│
├── pharma-trace-backend/                  # NestJS API, CQRS/Saga & Smart Contracts
│   ├── contracts/                         # Solidity Smart Contract (PharmaTraceAttestation.sol)
│   ├── scripts/                           # Solidity compilation pipeline
│   ├── src/
│   │   ├── blockchain/                    # Web3 & Ethers.js integration
│   │   ├── drugs/                         # Drug Registration Module
│   │   ├── events/                        # Event Sourcing & Custody Saga Engine
│   │   ├── iot/                           # IoT Telemetry Checkpoints
│   │   └── ledger/                        # Hash-Chain Verification Layer
│   ├── iot-simulation/                    # C++ ESP32/Hardware Simulator
│   ├── package.json
│   └── tsconfig.json
│
└── pharma-trace-frontend/                 # Next.js 14 App Router + Tailwind CSS
    ├── app/                               # Hero Landing, Dashboard & Public Verify Pages
    ├── components/                        # Navigation, Modals & Web3 Connect UI
    ├── lib/                               # Axios API Client & Ethers.js Wallet Utilities
    ├── package.json
    └── tailwind.config.ts
```

---

## 🚀 Getting Started

### 1. Backend Setup (`pharma-trace-backend`)
```bash
cd pharma-trace-backend
npm install
npm run build
npm run start:dev
```
*API Server runs on `http://localhost:3000`*

### 2. Frontend Setup (`pharma-trace-frontend`)
```bash
cd pharma-trace-frontend
npm install
npm run dev
```
*Frontend Web App runs on `http://localhost:3001` or `http://localhost:3000`*
