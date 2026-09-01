import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

export interface LedgerEntry {
    index: number;
    drugSerialNumber: string;
    eventId: number;
    eventHash: string;
    previousHash: string;
    ledgerHash: string;
    timestamp: Date;
}

@Injectable()
export class LedgerService {
    private readonly ledger: LedgerEntry[] = [];

    // ==========================================
    // ADD EVENT TO LEDGER
    // ==========================================

    addEvent(
        drugSerialNumber: string,
        eventId: number,
        eventHash: string,
    ): LedgerEntry {
        const previousHash =
            this.ledger.length > 0
                ? this.ledger[this.ledger.length - 1].ledgerHash
                : 'GENESIS';

        const index = this.ledger.length;

        const ledgerHash = createHash('sha256')
            .update(
                JSON.stringify({
                    index,
                    drugSerialNumber,
                    eventId,
                    eventHash,
                    previousHash,
                }),
            )
            .digest('hex');

        const entry: LedgerEntry = {
            index,
            drugSerialNumber,
            eventId,
            eventHash,
            previousHash,
            ledgerHash,
            timestamp: new Date(),
        };

        this.ledger.push(entry);

        return entry;
    }

    // ==========================================
    // GET COMPLETE LEDGER
    // ==========================================

    getLedger(): LedgerEntry[] {
        return this.ledger;
    }

    // ==========================================
    // VERIFY LEDGER
    // ==========================================

    verifyLedger(): boolean {
        for (let i = 0; i < this.ledger.length; i++) {
            const entry = this.ledger[i];

            const expectedPreviousHash =
                i === 0
                    ? 'GENESIS'
                    : this.ledger[i - 1].ledgerHash;

            // Check previous hash
            if (
                entry.previousHash !==
                expectedPreviousHash
            ) {
                return false;
            }

            // Recalculate ledger hash
            const expectedHash = createHash('sha256')
                .update(
                    JSON.stringify({
                        index: entry.index,
                        drugSerialNumber:
                            entry.drugSerialNumber,
                        eventId: entry.eventId,
                        eventHash: entry.eventHash,
                        previousHash:
                            entry.previousHash,
                    }),
                )
                .digest('hex');

            // Check current hash
            if (
                entry.ledgerHash !==
                expectedHash
            ) {
                return false;
            }
        }

        return true;
    }

    // ==========================================
    // TAMPER TEST
    // ==========================================

    tamperEntry(index: number): boolean {
        if (!this.ledger[index]) {
            return false;
        }

        // Change event hash intentionally
        this.ledger[index].eventHash = 'TAMPERED';

        return true;
    }
}