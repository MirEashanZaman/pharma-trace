# PharmaTrace-ES: Enterprise Anti-Counterfeit Pharmaceutical Track-and-Trace on Blockchain

PharmaTrace-ES is an enterprise-grade, event-driven pharmaceutical provenance and cold-chain compliance platform. The architecture unites **Event Sourcing**, **CQRS**, **Distributed Saga Custody Handshakes**, and **EVM Smart Contracts** with **ERC-4337 Account Abstraction**, **Chainlink Automation 2.0 Keepers**, **GS1 EPCIS 2.0 JSON-LD**, **W3C Decentralized Identifiers (DID) / Verifiable Credentials (VC)**, **Groth16 Zero-Knowledge Proofs (ZK-SNARK)**, **Redis 7 Caching**, **PostgreSQL Persistent Off-Chain Ledger**, **Nginx Reverse Proxy Load Balancing**, and **Automated CI/CD Pipelines**.

---

## System Architecture

```mermaid
flowchart TD
    subgraph IngressLayer ["Ingress & Load Balancing (Port 80)"]
        LB["Nginx Reverse Proxy & Load Balancer (/health)"]
    end

    subgraph ClientLayer ["Client & Enterprise Web3 Portals (Port 3001 / Port 3000)"]
        UI_Home["Landing & Public Verification"]
        UI_Staking["Carrier Staking & Bond Portal (/staking)"]
        UI_Escrow["Cold-Chain Escrow & Keeper (/escrow)"]
        UI_Gov["Regulatory Timelock Governance (/governance)"]
        UI_Dispense["NFC DNA & Twin Burn (/dispense)"]
        UI_Provenance["DAG Supply Chain Lineage (/provenance)"]
        UI_Ledger["Audit Ledger SSR (/ledger)"]
        UI_Standards["Regulatory Matrix SSG (/standards)"]
        UI_Dashboard["Real-Time Telemetry Dashboard (/dashboard)"]
    end

    subgraph CachingLayer ["High-Throughput Caching & PubSub (Port 6379)"]
        Redis["Redis 7 Cluster (Sub-Millisecond Serial & Telemetry Cache)"]
    end

    subgraph BackendLayer ["NestJS Backend & Domain Engine (Port 3500)"]
        API_Gateway["API Gateway & CORS Controller"]
        CQRS_Engine["CQRS Command & Event Sourcing Engine"]
        Saga_Custody["Custody Transfer Saga & Rollback Coordinator"]
        Sensor_Consensus["Medianized Multi-Sensor Consensus Engine"]
        DID_VC["W3C DID Resolver & StatusList2021 Registry"]
        KMS_Signer["Hardware Enclave KMS Signer (FIPS 140-2 Level 3)"]
        Bundler_Service["ERC-4337 Bundler & UserOp Mempool"]
        Ledger_Service["Persistent Cryptographic Ledger Engine"]
    end

    subgraph PersistenceLayer ["Relational & Event Persistence (Port 5432)"]
        Postgres["PostgreSQL 15 (Relational Store, Event Sourcing & Ledger Entities)"]
    end

    subgraph BlockchainLayer ["EVM Smart Contract Suite (Port 8545)"]
        C_Attest["PharmaTraceAttestation.sol (Batch Hash Anchor)"]
        C_Twin["PharmaDigitalTwin.sol (ERC-721 Burn-on-Dispense)"]
        C_Escrow["PharmaEscrowEngine.sol (Chainlink Automation 2.0)"]
        C_Staking["CarrierStakingEscrow.sol (Collateral & SLA Slashing)"]
        C_Gov["PharmaGovernanceTimelock.sol (Multi-Sig 2/3 Quorum)"]
        C_Paymaster["PharmaPaymaster.sol (ERC-4337 Gas Sponsorship)"]
        C_ZK["ZkColdChainVerifier.sol (Groth16 Temperature Proof)"]
    end

    subgraph IoTLayer ["Hardware IoT & Telemetry Nodes"]
        Sensors["Multi-Probe Reefer BLE/NFC Sensors"]
        Hardware_Enclave["ATECC608A / SE050 Cryptographic Element"]
        NTAG["NTAG 424 DNA Dynamic AES-128 CMAC"]
    end

    LB -->|Reverse Proxy /| ClientLayer
    LB -->|Reverse Proxy /api/ & /socket.io/| BackendLayer
    ClientLayer -->|REST / WebSockets| LB
    IoTLayer -->|Authenticated Telemetry| BackendLayer
    BackendLayer -->|Cache Read/Write| Redis
    BackendLayer -->|TypeORM Persistence| Postgres
    BackendLayer -->|Ethers.js / JSON-RPC 8545| BlockchainLayer
    BlockchainLayer -->|Automated checkUpkeep / performUpkeep| C_Escrow
```

---

## Core Platform Capabilities

### 1. Smart Contract Suite (Solidity / Hardhat / EVM)
* **Cryptographic Attestation Anchor (`PharmaTraceAttestation.sol`)**: Anchors SHA-256 batch hashes, custody transfer proofs, and Merkle root trees directly to the Ethereum Virtual Machine.
* **Anti-Counterfeit Physical-Digital Twin (`PharmaDigitalTwin.sol`)**: ERC-721 token representing physical pharmaceutical batches with anti-counterfeiting burn-on-dispense mechanics that permanently destroy serial balance upon patient dispensing.
* **Autonomous Cold-Chain Escrow (`PharmaEscrowEngine.sol`)**: Delivery-vs-payment commercial escrow automated via Chainlink Automation 2.0 Keepers. Releases funds to sellers upon verified temperature compliance or triggers breach refunds to buyers upon excursion breaches.
* **Carrier Collateral Staking & Slashing (`CarrierStakingEscrow.sol`)**: Requires cold-chain logistics carriers to stake ERC-20 collateral bonds per shipment. Slashing triggers automatically on consensus-verified temperature excursions to indemnify manufacturers directly on-chain.
* **Regulatory Timelock Governance (`PharmaGovernanceTimelock.sol`)**: OpenZeppelin TimelockController enforcing a 2-of-3 multi-signature quorum across regulatory agencies (FDA, EMA, WHO) with safety delays before executing emergency drug recalls.
* **Gasless Account Abstraction (`PharmaPaymaster.sol`)**: ERC-4337 corporate paymaster sponsoring transaction gas fees for authenticated supply chain operators, hospitals, and pharmacies.
* **Zero-Knowledge Privacy Layer (`ZkColdChainVerifier.sol`)**: Groth16 zero-knowledge proof verification confirming temperature readings remained within 2 deg C to 8 deg C boundaries without disclosing formulation data.

### 2. Standards & Interoperability
* **GS1 EPCIS 2.0 JSON-LD CBV**: Standardized supply chain event schemas (ObjectEvent, AggregationEvent, TransactionEvent) canonicalized with deterministic SHA-256 hash anchoring for FDA DSCSA compliance.
* **GS1 Digital Link 1.2**: Web URI resolver linking 2D data matrix barcodes (`/01/{gtin}/21/{serial}`) to RFC 9264 linksets (e-Leaflets, Certificate of Analysis, Digital Twin on-chain authenticity).
* **W3C Decentralized Identifiers (DID) & Verifiable Credentials (VC)**: Resolves `did:ethr` and `did:key` identifiers with W3C StatusList2021 on-chain bitstring revocation registry for Qualified Person (QP) batch release certification.
* **Dynamic NFC Cryptographic Authentication**: Validates NTAG 424 DNA secure unique NFC tokens with dynamic AES-128 CMAC digests and strictly monotonic counter progression.

### 3. Resilience, Fault Tolerance & High Availability
* **Persistent Database Cryptographic Ledger**: Stores off-chain hash-chained entries in PostgreSQL via TypeORM `LedgerEntryEntity` with startup hydration and tamper-detection verification methods compliant with 21 CFR Part 11.
* **Sub-Millisecond Redis 7 Caching**: In-memory caching for drug serialization lookups and telemetry with transparent in-memory fallback during local development and testing.
* **Nginx Reverse Proxy & Load Balancer**: Distributes incoming HTTP and WebSocket traffic with least-connection algorithms, client gzip compression, and live `/health` status monitoring.
* **Automated CI/CD Pipeline**: GitHub Actions workflow verifying backend tests, smart contract compilation, Next.js production builds, and Docker Compose configurations on every pull request and push to `main`.
* **Zero-Downtime Rollback Strategy**: Cross-platform rollback scripts (`rollback.sh` and `rollback.bat`) enabling immediate cluster restoration and automated health-probe verification.
* **Medianized Multi-Sensor Consensus**: Evaluates multi-probe telemetry clusters across reefer transit via statistical median filtering, isolating sensor faults without aborting legitimate commercial delivery escrows.
* **Cloud Hardware Security Module (HSM) KMS Signer**: Enterprise cryptographic key management delegating transaction signing to FIPS 140-2 Level 3 hardware security modules (AWS KMS, Google Cloud KMS, Azure Key Vault, HashiCorp Vault).

---

## Pre-Configured Stakeholder Accounts

PharmaTrace-ES enforces strict Role-Based Access Control (RBAC). For testing and demonstration, 6 pre-seeded stakeholder accounts are available on the Enterprise Sign-In portal (`/login`) with 1-click access:

| Role | Organization / Facility | Email | Password | Assigned Wallet Address |
|---|---|---|---|---|
| **MANUFACTURER** | Novartis Global | `manufacturer@pharma.com` | `123456` | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` |
| **DISTRIBUTOR** | DHL Healthcare Logistics | `distributor@pharma.com` | `123456` | `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` |
| **PHARMACY** | CVS Health Care | `pharmacy@pharma.com` | `123456` | `0x90F79bf6EB2c4f870365E785982E1f101E93b906` |
| **REGULATOR** | Food and Drug Administration | `regulator@pharma.com` | `123456` | `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65` |
| **ADMIN** | PharmaTrace Governance | `admin@pharma.com` | `123456` | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` |
| **CUSTOMER** | Mir Eashan Zaman (Consumer) | `customer@pharma.com` | `123456` | `0xcd3B766CCD5027DE11055150D60447dE35E1008473` |

*Note: Custom enterprise organizations and real Ethereum wallets (MetaMask) can also be registered at any time via the registration portal on `/login`.*

---

## Web3 Portals & Route Matrix

| Route | Rendering Mode | Purpose | Target Stakeholder |
|---|---|---|---|
| `/staking` | Client-Side (CSR) | Carrier collateral deposits, SLA bond locking, and consensus-driven bond slashing with manufacturer indemnity. | Cold-Chain Logistics Carriers & Manufacturers |
| `/escrow` | Client-Side (CSR) | Commercial delivery payment escrow, Chainlink Automation 2.0 relayer control, and ERC-4337 Paymaster simulation. | Financial Auditing & Commercial Buyers |
| `/governance` | Client-Side (CSR) | OpenZeppelin Timelock multi-sig proposal queue, guardian signature quorum, and emergency product recall execution. | Regulatory Agencies (FDA, EMA, WHO) |
| `/dispense` | Client-Side (CSR) | NTAG 424 DNA dynamic NFC validation, GS1 Digital Link resolution, and ERC-721 digital twin burn on patient dispense. | Hospital & Retail Pharmacists |
| `/provenance` | Client-Side (CSR) | Directed Acyclic Graph (DAG) visualizing complete batch lineage, custody handshakes, and checkpoint telemetry. | Supply Chain Directors & Quality Auditors |
| `/ledger` | Server-Side (SSR) | Immutable cryptographic hash-chain inspection with real-time on-chain Merkle root validation. | Compliance Officers & Inspectors |
| `/catalog` | Incremental (ISR) | Pharmaceutical inventory catalog with on-chain attestation status and batch serialization parameters. | Enterprise Distributors & Wholesalers |
| `/standards` | Static (SSG) | Full regulatory framework matrix (FDA 21 CFR Part 11, EU GMP Annex 11, WHO TRS 961, US DSCSA Title II). | Regulatory Affairs & Legal Teams |
| `/dashboard` | Client-Side (CSR) | Real-time sensor telemetry stream, GPS cartography, and temperature threshold circuit breaker. | Warehouse Operators & Fleet Dispatchers |
| `/verify` | Client-Side (CSR) | Consumer-facing instant authenticity verification using serial numbers or 2D data matrix QR codes. | Patients & Healthcare Providers |

---

## Port & Runtime Architecture

| Service | Port | Protocol | Purpose |
|---|---|---|---|
| **Nginx Load Balancer** | `80` | HTTP / Reverse Proxy | Upstream traffic distribution, WebSocket tunneling, and cluster health monitoring. |
| **Hardhat EVM Node** | `8545` | JSON-RPC / HTTP | Local Ethereum execution client hosting smart contracts. |
| **PharmaTrace Backend** | `3500` | REST / WebSockets | NestJS API, CQRS event store, and smart contract relayer. |
| **PharmaTrace Frontend** | `3001` (Dev) / `3000` (Docker) | HTTP / React Next.js 14 | Responsive web interface running the Midnight Navy / Neon Teal design system. |
| **Redis 7 Cache** | `6379` | TCP / RESP | In-memory key-value cache and pub/sub message broker. |
| **PostgreSQL 15** | `5432` | TCP / Relational | Primary persistent store for users, drug entities, events, and audit ledger. |

---

## Repository Structure

```text
pharma-trace/
│
├── .github/
│   └── workflows/
│       └── ci.yml                             # Automated CI/CD Pipeline (Build, Test, Lint, Docker)
│
├── scripts/
│   ├── rollback.sh                            # POSIX Automated Zero-Downtime Rollback Script
│   └── rollback.bat                           # Windows Automated Rollback Batch Script
│
├── docker-compose.yml                         # 5-Service Container Cluster Topology
├── nginx.conf                                 # Nginx Reverse Proxy & Load Balancer Configuration
├── ran.bat                                    # 1-Click Orchestration Launcher for Local Windows Development
├── README.md                                  # Enterprise Platform Specification
│
├── pharma-trace-backend/                      # NestJS API, CQRS/Saga & Smart Contracts Layer
│   ├── contracts/                             # Solidity Smart Contracts Suite
│   │   ├── PharmaTraceAttestation.sol         # Cryptographic batch & custody attestation anchor
│   │   ├── PharmaDigitalTwin.sol              # ERC-721 physical-digital twin with burn-on-dispense
│   │   ├── PharmaEscrowEngine.sol             # Chainlink Automation 2.0 commercial delivery escrow
│   │   ├── CarrierStakingEscrow.sol           # Carrier collateral staking & dynamic SLA bond slashing
│   │   ├── PharmaGovernanceTimelock.sol       # Multi-sig regulatory timelock (2/3 quorum)
│   │   ├── PharmaPaymaster.sol                # ERC-4337 gas sponsorship paymaster
│   │   └── ZkColdChainVerifier.sol            # Groth16 Zero-Knowledge cold-chain proof verifier
│   ├── test/                                  # Hardhat smart contract test suites (86 tests)
│   ├── src/
│   │   ├── blockchain/                        # Web3, Ethers.js, Bundler, KMS, DID, VC, and Escrow modules
│   │   ├── compliance/                        # SOLID Architectural Compliance Engine
│   │   ├── drugs/                             # Serialization and Batch Registration Module
│   │   ├── events/                            # Event Sourcing & Custody Saga Engine
│   │   ├── iot/                               # IoT Telemetry, Circuit Breaker, & Sensor Consensus
│   │   ├── ledger/                            # Persistent PostgreSQL Hash-Chain Verification Layer
│   │   │   ├── entities/                      # LedgerEntryEntity TypeORM schema
│   │   │   ├── ledger.controller.ts
│   │   │   ├── ledger.module.ts
│   │   │   └── ledger.service.ts
│   │   ├── redis/                             # Resilient Redis Caching & PubSub Service
│   │   │   ├── redis.module.ts
│   │   │   └── redis.service.ts
│   │   ├── main.ts                            # NestJS Application Entrypoint (Port 3500)
│   │   └── patterns.spec.ts                   # Enterprise architecture unit test suite (129 tests)
│   ├── hardhat.config.js                      # Hardhat EVM compiler & network configuration
│   └── package.json
│
└── pharma-trace-frontend/                     # Next.js 14 App Router Web3 Interface
    ├── app/
    │   ├── page.tsx                           # Landing page & public verification portal
    │   ├── staking/                           # Carrier Collateral Staking & Bond Portal
    │   ├── escrow/                            # Cold-Chain Escrow & Chainlink Relayer Portal
    │   ├── governance/                        # Multi-Sig Regulatory Timelock Governance Portal
    │   ├── dispense/                          # NFC DNA Authentication & Digital Twin Burn Portal
    │   ├── provenance/                        # Interactive DAG Supply Chain Lineage Graph
    │   ├── ledger/                            # SSR Immutable Cryptographic Ledger
    │   ├── catalog/                           # ISR Dynamic Drug Serialization Catalog
    │   ├── standards/                         # SSG Regulatory Compliance Framework Matrix
    │   ├── dashboard/                         # Real-Time Telemetry & Custody Ingestion Dashboard
    │   └── verify/                            # Consumer & Hospital Authenticity Verification Portal
    ├── components/
    │   ├── navigation.tsx                     # Responsive Header with Stacking Context Isolation
    │   ├── provenance-dag.tsx                 # Interactive SVG Lineage DAG Visualizer
    │   ├── qr-scanner.tsx                     # Optical GS1 QR & DataMatrix Camera Scanner
    │   └── transit-map.tsx                    # Isolated Dark Cartography Leaflet Component
    ├── lib/
    │   ├── api.ts                             # Axios Web3 Client SDK & Ethers.js Integration
    │   └── compliance-report.ts               # GxP Compliance Dossier PDF & CSV Exporter
    ├── tailwind.config.ts                     # Midnight Navy & Neon Teal Design System (#0B1220, #00D6B4)
    └── package.json
```

---

## Quickstart & Launch Guide

### Option A: Complete Docker Compose Cluster (Recommended for Production)

Run the entire 5-tier microservice cluster with a single command:

```bash
docker compose up -d --build
```

This launches:
1. **Nginx Load Balancer** on `http://localhost:80` (and `http://localhost/health`).
2. **PostgreSQL Database** on `localhost:5432`.
3. **Redis Cache** on `localhost:6379`.
4. **NestJS Backend** on `http://localhost:3500`.
5. **Next.js Frontend** on `http://localhost:3000`.

To view cluster health:
```bash
curl http://localhost/health
```

---

### Option B: 1-Click Local Development (Windows)

Double-click or run `ran.bat` from the repository root:

```cmd
ran.bat
```

This script automatically:
1. Launches the Hardhat EVM Node on `http://127.0.0.1:8545`.
2. Launches the Backend API Server on `http://localhost:3500`.
3. Launches the Frontend Web App on `http://localhost:3001`.
4. Opens `http://localhost:3001` in Google Chrome.

---

### Option C: Manual Development Launch

#### 1. Start Hardhat EVM Blockchain Node
```bash
cd pharma-trace-backend
npx hardhat node
```

#### 2. Start Backend API Server
```bash
cd pharma-trace-backend
npm install
npm run start:dev
```

#### 3. Start Frontend Web Interface
```bash
cd pharma-trace-frontend
npm install
npm run dev -- -p 3001
```

---

## Automated Rollback Procedures

If a deployment encounters issues or health check failures, execute zero-downtime rollback using the included automation:

### Linux / macOS / CI:
```bash
./scripts/rollback.sh HEAD~1
```

### Windows:
```cmd
scripts\rollback.bat HEAD~1
```

The script reverts git references, updates submodules, rebuilds the container cluster, and continuously probes `http://localhost/health` until the deployment is confirmed healthy.

---

## Verification & Test Suites

The platform includes comprehensive test suites across smart contracts and backend application services:

### Smart Contract Test Suite (Hardhat)
```bash
cd pharma-trace-backend
npm run test:contracts
```
*Validates 86 unit and integration tests across all smart contracts (`PharmaTraceAttestation`, `PharmaDigitalTwin`, `PharmaEscrowEngine`, `CarrierStakingEscrow`, `PharmaGovernanceTimelock`, `PharmaPaymaster`, and `ZkColdChainVerifier`).*

### Backend Domain & Architecture Test Suite (Jest)
```bash
cd pharma-trace-backend
npm test
```
*Validates all 129 enterprise pattern unit tests across CQRS, Sagas, IoT consensus, KMS signers, EPCIS 2.0 canonicalization, DID resolution, and ERC-4337 mempool bundler.*

### Frontend Production Compilation (Next.js 14)
```bash
cd pharma-trace-frontend
npm run build
```
*Compiles all 20 static and dynamic routes with zero TypeScript or build errors.*

**Total Passing Test Suite**: **215 Automated Tests Passing**.

---

## Regulatory Compliance Framework

| Standard | Governing Body | Technical Realization in PharmaTrace |
|---|---|---|
| **21 CFR Part 11** | US FDA | Cryptographic EIP-712 non-repudiation signatures, persistent PostgreSQL off-chain hash ledger, and Cloud KMS HSM audit logs. |
| **GMP Annex 11** | European Medicines Agency | Qualified Person (QP) batch release credentials via W3C Verifiable Credentials with on-chain StatusList2021 revocation. |
| **DSCSA Title II** | US FDA | GS1 EPCIS 2.0 JSON-LD event canonicalization, GS1 Digital Link resolver, and parent-child packaging aggregation (Item -> Case -> Pallet). |
| **WHO TRS 961** | World Health Organization | Cold-chain circuit breaker with multi-probe sensor consensus, Redis telemetry caching, and automated commercial escrow breach refunds. |
| **EU Falsified Medicines Directive** | European Commission | Physical-digital twin NFT with burn-on-dispense mechanics preventing decommissioned medicine re-entry into distribution. |

---

## Design System & Palette

The user interface follows the **Midnight Navy / Neon Teal** enterprise palette:

| Color Name | Hex Code | Purpose |
|---|---|---|
| **Midnight Navy** | `#0B1220` | Root background & deep canvas |
| **Card Slate** | `#243247` | Component cards, modal dialogs, and table containers |
| **Deep Accent** | `#172638` | Interactive panels, active route pills, and telemetry badges |
| **Border Navy** | `#304257` | Structural borders, dividers, and card outlines |
| **Neon Teal** | `#00D6B4` | Primary brand accent, active state highlights, and verification checks |

---

## License

Enterprise Proprietary - PharmaTrace Track-and-Trace Consortium.
