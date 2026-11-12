# PharmaTrace Platform Demonstration & Defense Guide

## Executive Summary
PharmaTrace is an enterprise decentralized pharmaceutical track-and-trace system built to enforce FDA 21 CFR Part 11, EU GxP Annex 11, and the US Drug Supply Chain Security Act (DSCSA Title II). The platform integrates Distributed Saga custody handshakes, GS1 EPCIS 2.0 serialization, Groth16 Zero-Knowledge cold-chain proofs, ERC-4337 Account Abstraction gas sponsorship, and EVM smart contract Merkle rollups.

---

## 1. Quick-Start Execution Commands

### Prerequisites
- PostgreSQL running on port 5432 (database: `pharma_trace`, user: `postgres`, password: `your_password`)
- Node.js v18+ and npm / pnpm

### Step 1: Start Backend Service
```bash
cd pharma-trace-backend
npm install
npm run seed
npm run start:dev
```
Backend runs on: `http://localhost:3500`
Swagger API Documentation: `http://localhost:3500/api/docs`

### Step 2: Start Frontend Service
```bash
cd pharma-trace-frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:3000` (or `http://localhost:3001` if port 3000 is occupied).

---

## 2. Pre-Configured Demo Personas & Credentials

All personas share the default demo password: `123456`. You can also click any persona card on the `/login` page to auto-fill credentials.

| Role | Stakeholder Persona | Email | Primary Responsibilities |
| :--- | :--- | :--- | :--- |
| **MANUFACTURER** | Novartis Production Lead | `manufacturer@pharma.com` | Batch commissioning, GS1 serialization, laboratory QC sign-off, factory dispatch, quarantine |
| **DISTRIBUTOR** | DHL Cold-Chain Fleet | `distributor@pharma.com` | Inbound container dock inspection, vault storage, fleet assignment, e-BoL generation, POD confirmation |
| **PHARMACY** | CVS Central Pharmacy | `pharmacy@pharma.com` | Inbound manifest verification, dispensary inventory, prescription dispensing, batch decommissioning |
| **REGULATOR** | FDA Inspection Officer | `regulator@pharma.com` | Form 483 facility inspection citations, nationwide Class I/II/III recalls, pharmacovigilance ADEs, ALCOA+ audit |
| **CUSTOMER** | Mir Eashan Zaman | `customer@pharma.com` | Public verification portal, 2D DataMatrix scanning, active recall checking, authenticity validation |
| **ADMIN** | System Administrator | `admin@pharma.com` | Platform governance, stakeholder management, warning flags, audit trail inspection, system telemetry |

---

## 3. Recommended 5-Minute Live Presentation Script

### Act 1: The Producer (Manufacturer Workflow)
1. Navigate to `/login` and select **Novartis Production Lead**.
2. Go to **Drug Batches**:
   - Point out existing active batches and show the **GS1 DataMatrix** 2D barcode generator.
   - Switch to the **QC Release** tab: select batch `DRUG-002`, review purity (99.85%) and pH (7.20), and sign the laboratory release disposition.
   - Switch to **Dispatch Batch**: assign carrier *DHL Healthcare Logistics*, container seal *SEAL-NOV-9942*, and dispatch to distribution.

### Act 2: Cold-Chain Logistics (Distributor Workflow)
1. Click **Sign Out / Switch Stakeholder** and log in as **DHL Cold-Chain Fleet**.
2. Go to **Logistics & Fleet Operations**:
   - In **Inbound Receiving**, verify dock seal and temperature (4.2 C) against pre-dispatch manifest.
   - In **Live Fleet & Route Map**, show real-time GPS telemetry and reefer unit status.
   - In **Cold-Chain Simulation**, show multi-sensor consensus and trigger a simulated excursion to demonstrate automated alerts.
   - In **Outbound Manifest (e-BoL)**, select batch `SN-2026-AMOX500` and generate the manifest for CVS Central Pharmacy.

### Act 3: Clinical Dispensing (Pharmacy Workflow)
1. Click **Sign Out / Switch Stakeholder** and log in as **CVS Central Pharmacy**.
2. Go to **Pharmacy Dispensary & Rx**:
   - In **Inbound Inspection**, verify delivery against distributor manifest `MAN-2026-8841` and receive items into the vaccine refrigerator.
   - In **Patient Dispensing**, select an inbound item, enter prescription number `RX-2026-984421`, Doctor `Dr. Robert Chen, MD`, and dispense.
   - Highlight that dispensing decommissions the digital twin on-chain, preventing double-dispensing counterfeits.

### Act 4: Consumer Trust (Customer Verification)
1. Log in as **Mir Eashan Zaman** or open an incognito window to `/verify`.
2. Enter serial number `SN-2026-AMOX500` or scan its package QR code:
   - Point out the green **AUTHENTIC & VERIFIED** badge.
   - Review complete provenance lineage from Novartis plant to CVS Pharmacy.
   - Test serial `DRUG-001` to demonstrate an instant red **RECALLED / QUARANTINED** warning banner alerting the patient not to consume the medicine.

### Act 5: Regulatory Oversight & Governance (Regulator & Admin)
1. Log in as **FDA Inspection Officer**:
   - Go to **Regulatory & GxP Compliance**.
   - Review the automated **ALCOA+ Data Integrity Analysis** (Attributable, Legible, Contemporaneous, Original, Accurate).
   - Show active recalls and Adverse Drug Event (ADE) pharmacovigilance reports.
2. Switch to **System Administrator**:
   - Open **Admin Governance Console**.
   - Inspect immutable audit trails, stakeholder warning counts, and system health telemetry.

---

## 4. Key Architectural & Technical Defense Points

When defending this architecture in front of professors, evaluators, or senior engineers, highlight these five core innovations:

1. **Distributed Saga Pattern for Custody Handshakes**:
   - Custody transfers between supply chain tiers require cryptographic dual-acknowledgment.
   - If a receiving party rejects a shipment or detects a temperature excursion, the saga triggers a compensating rollback transaction, preventing orphaned inventory.

2. **ZK-SNARK Nullifier Registry (Proof Replay Prevention)**:
   - Uses Groth16 Zero-Knowledge proofs for compliance verification without revealing sensitive trade secrets.
   - Evaluated against a nullifier registry to prevent replay attacks where a single valid proof is submitted multiple times.

3. **ERC-4337 Account Abstraction & Gasless Paymaster**:
   - Supply chain workers in warehouses do not need to hold ETH or manage gas wallets.
   - The enterprise Paymaster contract sponsors legitimate supply chain transactions via bundler UserOperations.

4. **ALCOA+ Automated Data Integrity Engine**:
   - Translates FDA 21 CFR Part 11 and EU Annex 11 principles into algorithmic audit checks.
   - Every event has a SHA-256 hash chain and cryptographic signer signature.

5. **GS1 EPCIS 2.0 & Digital Twin Decommissioning**:
   - Full compatibility with GS1 standards (GTIN, GLN, serial numbers).
   - Digital twins are burned or retired upon prescription dispensing to prevent counterfeiters from recycling packaging.
