# PharmaTrace-ES: Enterprise Pharmaceutical Track-and-Trace Platform

PharmaTrace-ES is an enterprise-grade, event-driven pharmaceutical provenance, serialization, and cold-chain compliance platform. The architecture unites Event Sourcing, CQRS, Distributed Saga Custody Handshakes, and EVM Smart Contracts with GS1 EPCIS 2.0 JSON-LD, W3C Decentralized Identifiers (DID), Verifiable Credentials (VC), Groth16 Zero-Knowledge Proofs, Chainlink Automation, Chainlink CCIP, Redis Caching, PostgreSQL Persistent Ledger, and automated compliance enforcement.

The platform complies with US FDA 21 CFR Part 11, EU GxP Annex 11, US Drug Supply Chain Security Act (DSCTA Title II), and WHO TRS 961 guidelines.

---

## System Architecture

```mermaid
flowchart TD
    subgraph IngressLayer ["Ingress and Reverse Proxy (Port 80 / 3001)"]
        LB["Nginx Reverse Proxy & Port Dispatcher"]
    end

    subgraph ClientLayer ["Client and Enterprise Web3 Portals (Port 3001)"]
        UI_Home["Landing & Public Verification (/verify)"]
        UI_Staking["Carrier Staking & Bond Portal (/staking)"]
        UI_Escrow["Cold-Chain Escrow & Keepers (/escrow)"]
        UI_Gov["Regulatory Timelock Governance (/governance)"]
        UI_Dispense["GS1 DataMatrix & Twin Burn (/dispense)"]
        UI_Provenance["DAG Supply Chain Lineage (/provenance)"]
        UI_Ledger["Audit Ledger SSR (/ledger)"]
        UI_Standards["Regulatory Matrix SSG (/standards)"]
        UI_Dashboard["Modular Operations Console (/dashboard)"]
        UI_Profile["User Profile & Role Security (/profile)"]
    end

    subgraph CachingLayer ["High-Throughput Caching & PubSub (Port 6379)"]
        Redis["Redis 7 (Session Store, Telemetry Ingestion & Refresh Revocation)"]
    end

    subgraph BackendLayer ["NestJS Backend & Domain Engine (Port 3500)"]
        API_Gateway["API Gateway & Tiered Throttler Guard"]
        Swagger_Docs["OpenAPI / Swagger Portal (/api/docs)"]
        Health_Probes["Container Health Probes (/health/live, /health/ready)"]
        Audit_Chain["21 CFR Part 11 Cryptographic Hash-Chain Interceptor"]
        Auth_Service["JWT & Redis Refresh Token Rotation Service"]
        CQRS_Engine["CQRS Command & Event Sourcing Engine"]
        Saga_Custody["Custody Transfer Saga & Rollback Coordinator"]
        Merkle_Engine["Sparse Merkle Tree Batch Rollup Engine"]
        IPFS_Engine["Canonical ePI & CoA IPFS Packaging Service"]
        Sensor_Consensus["Medianized Multi-Sensor Consensus Engine"]
        DID_VC["W3C DID Resolver & StatusList2021 Registry"]
        Ledger_Service["Persistent Cryptographic Off-Chain Ledger Engine"]
    end

    subgraph PersistenceLayer ["Relational and Event Persistence (Port 5432)"]
        Postgres["PostgreSQL 16 (Indexed Entities, Event Stores & Audit Chains)"]
    end

    subgraph BlockchainLayer ["EVM Smart Contract Suite (Port 8545 / L2 Testnets)"]
        C_Attest["PharmaTraceAttestation.sol (Batch Hash & Merkle Anchor)"]
        C_Twin["PharmaDigitalTwin.sol (ERC-721 Burn-on-Dispense)"]
        C_Escrow["PharmaEscrowEngine.sol (Parametric Delivery Escrow)"]
        C_Oracle["ColdChainAutomationOracle.sol (Chainlink Automation Upkeep)"]
        C_Bridge["PharmaCrossChainBridge.sol (CCIP Digital Twin Messenger)"]
        C_Staking["CarrierStakingEscrow.sol (Collateral & Slashing)"]
        C_Gov["PharmaGovernanceTimelock.sol (Multi-Sig Quorum)"]
        C_Paymaster["PharmaPaymaster.sol (Gas Sponsorship)"]
        C_ZK["ZkColdChainVerifier.sol (Groth16 Temperature Proof)"]
    end

    subgraph IoTLayer ["Hardware IoT and Telemetry Nodes"]
        Sensors["Multi-Probe Reefer BLE/NFC Sensors"]
        Hardware_Enclave["ATECC608A / SE050 Cryptographic Element"]
        NTAG["NTAG 424 DNA Dynamic AES-128 CMAC"]
    end

    LB --> ClientLayer
    LB --> BackendLayer
    ClientLayer -->|REST & WebSockets| BackendLayer
    IoTLayer -->|Authenticated Telemetry| BackendLayer
    BackendLayer --> Redis
    BackendLayer --> Postgres
    BackendLayer --> BlockchainLayer
    BlockchainLayer --> C_Oracle
    BlockchainLayer --> C_Bridge
```

---

## Repository Structure

The monorepo coordinates decoupled submodules for the backend engine and web client:

```text
pharma-trace/
├── pharma-trace-backend/              # NestJS Application, Domain Engine & Smart Contracts
│   ├── contracts/                     # Solidity EVM Smart Contracts (viaIR: true)
│   │   ├── CarrierStakingEscrow.sol   # Logistics Carrier Collateral & Slashing
│   │   ├── ColdChainAutomationOracle.sol # Chainlink Automation Upkeep Oracle
│   │   ├── PharmaCrossChainBridge.sol # CCIP Cross-Chain Token Messenger
│   │   ├── PharmaDigitalTwin.sol      # ERC-721 Digital Twin (Burn-on-Dispense)
│   │   ├── PharmaEscrowEngine.sol     # Delivery-vs-Payment Commercial Escrow
│   │   ├── PharmaGovernanceTimelock.sol # Multi-Sig Regulatory Timelock
│   │   ├── PharmaPaymaster.sol        # EIP-4337 Account Abstraction Paymaster
│   │   ├── PharmaTraceAttestation.sol # On-Chain Attestation & Merkle Root Anchor
│   │   └── ZkColdChainVerifier.sol    # Groth16 Zero-Knowledge Verification
│   ├── scripts/                       # solc Compilation, Seeders & Deployers
│   ├── src/
│   │   ├── auth/                      # JWT, Refresh Token Rotation & Web3 Nonce Auth
│   │   ├── blockchain/                # EVM Facade, Merkle Rollup Engine & IPFS Packaging
│   │   ├── common/                    # Zod Config, E-Signature & Chained Audit Guards
│   │   ├── compliance/                # Regulatory Frameworks & Audit Chain Verification
│   │   ├── drugs/                     # Drug Serialization & High-Performance Entities
│   │   ├── events/                    # Event Sourcing, CQRS & Custody Sagas
│   │   ├── health/                    # Container Liveness & Readiness Health Probes
│   │   ├── iot/                       # Telemetry Streams, Circuit Breakers & Consensus
│   │   ├── ledger/                    # Off-Chain Cryptographic Hash-Chain Ledger
│   │   ├── mail/                      # Transactional SMTP Notification Service
│   │   ├── redis/                     # Distributed Cache & Session Revocation
│   │   ├── data-source.ts             # Standalone TypeORM Production Data Source
│   │   └── main.ts                    # Bootstrap, Security Middleware & Validation
│   ├── Dockerfile                     # Multi-Stage Unprivileged Non-Root Docker Build
│   └── package.json
├── pharma-trace-frontend/             # Next.js 14 App Router Web3 Application
│   ├── app/                           # Modular Application Routes
│   │   ├── catalog/page.tsx           # Dynamic Pharmaceutical Catalog
│   │   ├── dashboard/page.tsx         # Modular Custody Operations Console
│   │   ├── dispense/page.tsx          # Dual-Signature Hospital Dispense
│   │   ├── escrow/page.tsx            # Parametric Cold-Chain Escrow Portal
│   │   ├── governance/page.tsx        # Multi-Sig Regulatory Timelock Portal
│   │   ├── ledger/page.tsx            # Cryptographic Ledger Explorer
│   │   ├── login/page.tsx             # Enterprise JWT & MetaMask Sign-In
│   │   ├── profile/page.tsx           # User Identity & Role Security
│   │   ├── provenance/page.tsx        # Vector Lineage DAG Visualizer
│   │   ├── staking/page.tsx           # Carrier Staking & Slashing Console
│   │   ├── standards/page.tsx         # Regulatory Compliance Frameworks
│   │   └── verify/page.tsx            # Public Authenticity Verifier & QR Scanner
│   ├── components/                    # Reusable React & DaisyUI/Tailwind Components
│   │   ├── dashboard/                 # Smart Contract Telemetry & Feature Tabs
│   │   ├── navigation.tsx             # Responsive Modular Breakpoint Navigation
│   │   └── provenance-dag.tsx         # Interactive Vector Provenance DAG
│   ├── lib/                           # API Client, Web3 Helpers & Compliance Exporters
│   ├── Dockerfile                     # Multi-Stage Non-Root Standalone Docker Build
│   └── package.json
├── .github/workflows/                 # CI/CD Workflows
│   └── blockchain-audit.yml           # Slither Static Analysis & Solhint Security Pipeline
├── docker-compose.yml                 # Multi-Container Orchestration Specification
├── LICENSE                            # MIT License Document
└── README.md                          # Root Monorepo Architecture Specification
```

---

## Core Capabilities and Modules

### 1. Smart Contract Suite (Solidity / solc 0.8.26 / viaIR)
- **Chainlink Automation Cold-Chain Oracle (`ColdChainAutomationOracle.sol`)**: Autonomous upkeep contract triggering slashing on `CarrierStakingEscrow.sol` upon verifiable temperature excursions without manual arbitration.
- **Cross-Chain Interoperability Protocol Bridge (`PharmaCrossChainBridge.sol`)**: Token messenger bridging physical-digital twins across Layer-2 rollups (Base, Arbitrum, Polygon) with single-custody anti-duplication protection.
- **Cryptographic Attestation Anchor (`PharmaTraceAttestation.sol`)**: Anchors Keccak-256 batch hashes, custody transfer roots, and Merkle tree attestations directly to the EVM.
- **Anti-Counterfeit Physical-Digital Twin (`PharmaDigitalTwin.sol`)**: ERC-721 token representing individual physical cartons with burn-on-dispense mechanics that extinguish digital balance upon patient administration.
- **Parametric Cold-Chain Escrow (`PharmaEscrowEngine.sol`)**: Delivery-vs-payment commercial settlement automating fund disbursement or buyer breach refunds.
- **Carrier Collateral Staking (`CarrierStakingEscrow.sol`)**: Stakes ERC-20 collateral bonds per consignment with algorithmic forfeiture upon temperature breaches.
- **Regulatory Timelock Governance (`PharmaGovernanceTimelock.sol`)**: OpenZeppelin multi-signature timelock enforcing safety delays and quorum approval across regulatory agencies (FDA, EMA, WHO) for mandatory drug recalls.
- **Zero-Knowledge Privacy Layer (`ZkColdChainVerifier.sol`)**: Groth16 zero-knowledge proof verification proving thermal compliance within 2 deg C to 8 deg C without exposing formulation details.

### 2. Enterprise Backend Services (NestJS / TypeORM / PostgreSQL)
- **Container Health Probes (`/health`)**: Exposes container-native `/health/live` and `/health/ready` verifying database connection pool latency, Redis responsiveness, memory heap consumption, and process uptime.
- **21 CFR Part 11 Hash-Chained Audit Trail**: Implements a continuous SHA-256 hash-chained audit log with cryptographic verification via `GET /compliance/audit/verify-chain`.
- **Zod Environment Validation**: Enforces strict fail-fast validation at boot time across database credentials, port definitions, JWT secrets, and RPC URLs.
- **21 CFR Part 11 Electronic Signature Guard**: Requires operator attribution, signing rationale, and cryptographic proof prior to executing high-consequence compliance mutations.
- **Refresh Token Rotation in Redis**: Short-lived access tokens paired with rotating, one-time refresh tokens stored in Redis with instant revocation capabilities.
- **High-Performance Composite Indexing**: Targeted database indexes for `(status, expiryDate)` (FEFO inventory) and `(drugSerialNumber, createdAt)` (provenance lookups).
- **Standalone TypeORM Migration Pipeline**: Dedicated `src/data-source.ts` with CLI commands (`migration:generate`, `migration:run`, `migration:revert`) for production schema management.

### 3. Web3 Frontend Client (Next.js 14 / Tailwind CSS / DaisyUI)
- **Midnight Navy / Neon Teal Design Tokens**: Exclusively styled with Tailwind CSS and DaisyUI (`#0B1220`, `#00D6B4`, `#243247`, `#172638`).
- **Modular Dashboard Architecture**: Decomposed into domain components including `SmartContractTelemetry` and `OverviewTab`.
- **Public Drug Authenticity Verification**: Scans 2D DataMatrix serials with instant cryptographic verification, audio feedback, and multi-format compliance report downloads (PDF, CSV, JSON).
- **Responsive Navigation**: Adaptive header gracefully condensing across desktop, tablet, and mobile breakpoints without horizontal overflow.

---

## Design System Palette

| Element | Hex Code | Purpose |
|---|---|---|
| Background Base | `#0B1220` | Core application background canvas |
| Surface Primary | `#172638` | Container panels, modals, and dropdown surfaces |
| Surface Subtle | `#243247` | Interactive input fields and active cards |
| Border Default | `#304257` | Structural panel dividers and table boundaries |
| Accent Neon | `#00D6B4` | Primary actions, branding, and verified badges |
| Accent Hover | `#00b89a` | Button hover and active states |
| Text Primary | `#F1F5F9` | High-contrast typography |
| Text Muted | `#94A3B8` | Metadata, timestamps, and secondary labels |

---

## Getting Started

### Prerequisites
- Node.js >= 20.0.0
- Docker and Docker Compose
- PostgreSQL 16 & Redis 7

### 1. Clone the Monorepo

```bash
git clone --recurse-submodules https://github.com/MirEashanZaman/pharma-trace.git
cd pharma-trace
```

### 2. Backend Initialization

```bash
cd pharma-trace-backend
npm install
npm run compile:contract
npm run build
npm run seed
npm run start:dev
```
- REST API: `http://localhost:3500`
- Swagger Documentation: `http://localhost:3500/api/docs`
- Health Liveness Probe: `http://localhost:3500/health/live`
- Health Readiness Probe: `http://localhost:3500/health/ready`

### 3. Frontend Initialization

```bash
cd ../pharma-trace-frontend
npm install
npm run dev -- -p 3001
```
- Web Application: `http://localhost:3001`

---

## Verification & Static Analysis

```bash
# Compile all 13 smart contracts via solc Yul IR pipeline
cd pharma-trace-backend
npm run compile:contract

# Execute backend unit and integration test suite
npm run test

# Verify Next.js production build and static route generation
cd ../pharma-trace-frontend
npm run build
```

---

## Regulatory Compliance Matrix

| Regulation | Scope | Technical Enforcement Mechanism |
|---|---|---|
| US FDA 21 CFR Part 11 | Electronic Records & Signatures | Cryptographic SHA-256 hash-chained audit trails, `ElectronicSignatureGuard`, and immutable event sourcing |
| EU GMP Annex 11 | Computerised Systems | High-availability Redis caching, container health probes, and audit chain verification |
| US DSCSA Title II | Unit-Level Traceability | GS1-128 / DataMatrix serialization, EPCIS 2.0 JSON-LD events, and on-chain Merkle batch attestations |
| WHO TRS 961 | Cold-Chain Good Distribution | Multi-probe medianized consensus, Chainlink automation oracle, and Groth16 zero-knowledge verifier |

---

## License

This software is released under the MIT License. See [LICENSE](LICENSE) for details.
