# PharmaTrace: Decentralized Pharmaceutical Track-and-Trace Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-00D6B4.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0-E0234E.svg)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.26-363636.svg)](https://soliditylang.org/)

<!-- TODO: replace with a real CI badge once GitHub Actions runs `npm test` -->

[![Standards](https://img.shields.io/badge/GS1-EPCIS%202.0%20%2F%20DataMatrix-blue.svg)](https://www.gs1.org)

PharmaTrace is a pharmaceutical provenance, serialization, and cold-chain monitoring platform. It combines an event-sourced NestJS backend with EVM smart contracts and a Next.js web app, so every medicine package can be tracked from factory to patient and verified by anyone.

> **Project status:** This is a demo / testnet project built for learning and presentation. It is **not** production-deployed and has **not** been formally validated against any regulation. See [Regulatory Alignment](#regulatory-alignment).

**Quick links:** [Demo Guide](DEMO_GUIDE.md) · [Getting Started](#getting-started) · [Architecture](#architecture) · [Roles](#roles)

---

## Screenshots

<!-- TODO: add 3 screenshots or a short GIF -->

| Dashboard   | Public Verify (`/verify`) | Provenance DAG (`/provenance`) |
| :---------- | :------------------------ | :----------------------------- |
| _add image_ | _add image_               | _add image_                    |

---

## What It Does

- **Serialize** drugs with GS1 DataMatrix identifiers and EPCIS 2.0 events.
- **Track custody** across manufacturer, distributor, and pharmacy with a saga that rolls back failed handovers.
- **Monitor cold chain** (2 °C to 8 °C) using multi-sensor consensus, with automatic carrier slashing on breaches.
- **Prove compliance privately** with Groth16 zero-knowledge temperature proofs.
- **Stop counterfeits** with ERC-721 digital twins that burn when the medicine is dispensed.
- **Audit everything** with a SHA-256 hash-chained audit trail.
- **Let anyone verify** a package through a public scanner page.

---

## Architecture

```mermaid
flowchart TD
    Client["Next.js 14 Web App (:3001)"] -->|REST + WebSockets| API["NestJS API (:3500)"]
    IoT["IoT / Reefer Sensors"] -->|Authenticated telemetry| API
    API --> Redis["Redis 7 (sessions, telemetry, token revocation)"]
    API --> Postgres["PostgreSQL 16 (entities, events, audit chain)"]
    API --> Chain["EVM Smart Contracts (:8545 / L2 testnets)"]
```

**Backend modules:** CQRS and event sourcing, custody saga, Merkle batch rollups, multi-sensor consensus, DID / Verifiable Credentials, IPFS packaging for ePI and CoA documents, and an off-chain cryptographic ledger.

**Smart contracts** (Solidity 0.8.26, `viaIR`):

| Contract                        | Purpose                                  |
| :------------------------------ | :--------------------------------------- |
| `PharmaTraceAttestation.sol`    | Anchors batch hashes and Merkle roots    |
| `PharmaDigitalTwin.sol`         | ERC-721 twin, burned on dispense         |
| `PharmaEscrowEngine.sol`        | Delivery-versus-payment escrow           |
| `CarrierStakingEscrow.sol`      | Carrier collateral and slashing          |
| `ColdChainAutomationOracle.sol` | Chainlink Automation upkeep for breaches |
| `PharmaCrossChainBridge.sol`    | CCIP bridge for digital twins            |
| `PharmaGovernanceTimelock.sol`  | Multi-sig timelock for recalls           |
| `PharmaPaymaster.sol`           | ERC-4337 gas sponsorship                 |
| `ZkColdChainVerifier.sol`       | Groth16 temperature-proof verifier       |

<!-- TODO: confirm contract count. Your old README said 13 in the compile step but listed 9. Add the rest here (interfaces and mocks are fine to leave out). -->

More detail: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) · [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md)

---

## Roles

| Role             | Can do                                                              |
| :--------------- | :------------------------------------------------------------------ |
| **Manufacturer** | Create serialized lots, sign QC release, dispatch, quarantine       |
| **Distributor**  | Manage reefers and manifests, monitor routes, generate e-BoLs       |
| **Pharmacy**     | Verify shipments, dispense against prescriptions, retire twins      |
| **Regulator**    | Issue citations, enforce recalls, track adverse events              |
| **Customer**     | Verify a package publicly at `/verify`                              |
| **Admin**        | Manage users, inspect audit trails, view health and gas sponsorship |

Demo logins for each role are listed in [DEMO_GUIDE.md](DEMO_GUIDE.md).

---

## Getting Started

### Prerequisites

- Node.js 20 or newer
- PostgreSQL 16 and Redis 7 (or just Docker)
- Docker and Docker Compose (optional)

### 1. Clone

```bash
git clone https://github.com/MirEashanZaman/pharma-trace.git
cd pharma-trace
```

### 2. Configure environment

```bash
cp pharma-trace-backend/.env.example pharma-trace-backend/.env
cp pharma-trace-frontend/.env.example pharma-trace-frontend/.env.local
```

<!-- TODO: add the .env.example files to the repo, then fill in the real variable names below -->

| Variable              | Where    | Example                                           |
| :-------------------- | :------- | :------------------------------------------------ |
| `DATABASE_URL`        | backend  | `postgres://user:pass@localhost:5432/pharmatrace` |
| `REDIS_URL`           | backend  | `redis://localhost:6379`                          |
| `JWT_SECRET`          | backend  | a long random string                              |
| `RPC_URL`             | backend  | `http://localhost:8545` or a testnet RPC          |
| `NEXT_PUBLIC_API_URL` | frontend | `http://localhost:3500`                           |

### 3a. Run with Docker (easiest)

```bash
docker compose up --build
```

### 3b. Run manually

**Backend**

```bash
cd pharma-trace-backend
npm install
npm run compile:contract
npm run build
npm run seed
npm run start:dev
```

**Frontend** (new terminal)

```bash
cd pharma-trace-frontend
npm install
npm run dev -- -p 3001
```

### URLs

| What                  | URL                                                 |
| :-------------------- | :-------------------------------------------------- |
| Web app               | http://localhost:3001                               |
| REST API              | http://localhost:3500                               |
| Swagger docs          | http://localhost:3500/api/docs                      |
| Health (live / ready) | http://localhost:3500/health/live · `/health/ready` |

---

## Testing

```bash
# Compile smart contracts
cd pharma-trace-backend
npm run compile:contract

# Backend unit and integration tests
npm run test

# Check the frontend builds
cd ../pharma-trace-frontend
npm run build
```

---

## Regulatory Alignment

PharmaTrace is **designed to align with** the ideas behind the standards below. It implements technical controls inspired by them, but it has not been audited or validated for regulatory use.

| Standard           | Region | Related feature                                                |
| :----------------- | :----- | :------------------------------------------------------------- |
| FDA 21 CFR Part 11 | US     | Hash-chained audit trail, e-signature guard, event sourcing    |
| EU GxP Annex 11    | EU     | Health probes, audit chain verification, Redis caching         |
| DSCSA Title II     | US     | GS1 serialization, EPCIS 2.0 events, Merkle attestations       |
| WHO TRS 961        | Global | Multi-sensor consensus, automated cold-chain oracle, ZK proofs |

---

## Known Limitations

- Demo and testnet only. Not production-hardened.
- The ZK nullifier registry keeps some state in memory, so it resets on restart.
- IoT sensors are simulated in the demo data.

---

## Project Structure

```text
pharma-trace/
├── pharma-trace-backend/    # NestJS API, domain engine, Solidity contracts
│   ├── contracts/
│   ├── scripts/             # seeders, deployers, compile pipeline
│   └── src/                 # auth, blockchain, compliance, drugs, events,
│                            # health, iot, ledger
├── pharma-trace-frontend/   # Next.js 14 app (catalog, dashboard, dispense,
│                            # escrow, governance, ledger, provenance,
│                            # staking, standards, verify)
├── docs/                    # architecture and design-system notes
├── DEMO_GUIDE.md
├── docker-compose.yml
└── LICENSE
```

---

## Author

Built by **Mir Eashan Zaman**.

## License

MIT. See [LICENSE](LICENSE).
