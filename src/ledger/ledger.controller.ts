import {
    Controller,
    Get,
    Param,
} from '@nestjs/common';

import { LedgerService } from './ledger.service';

@Controller('ledger')
export class LedgerController {
    constructor(
        private readonly ledgerService: LedgerService,
    ) { }

    // ==========================================
    // GET COMPLETE LEDGER
    // ==========================================

    @Get()
    getLedger() {
        return this.ledgerService.getLedger();
    }

    // ==========================================
    // VERIFY LEDGER
    // ==========================================

    @Get('verify')
    verifyLedger() {
        return {
            valid: this.ledgerService.verifyLedger(),
        };
    }

    // ==========================================
    // TAMPER TEST
    // ==========================================

    @Get('tamper/:index')
    tamperEntry(
        @Param('index') index: string,
    ) {
        const result =
            this.ledgerService.tamperEntry(
                Number(index),
            );

        return {
            tampered: result,
        };
    }
}