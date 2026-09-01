import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DrugEvent } from './entities/drug-event.entity';
import { Drug } from '../drugs/entities/drug.entity';

import { DrugEventsController } from './drug-events.controller';
import { DrugEventsService } from './drug-events.service';

import { EventPublisher } from './publishers/event.publisher';
import { AuditObserver } from './observers/audit.observer';

import { ManufacturedStrategy } from './strategies/manufactured.strategy';
import { ShippedStrategy } from './strategies/shipped.strategy';
import { ReceivedStrategy } from './strategies/received.strategy';
import { TemperatureMonitoredStrategy } from './strategies/temperature-monitored.strategy';
import { EventStrategyFactory } from './strategies/event-strategy.factory';

import { CustodyTransferSaga } from './saga/custody-transfer.saga';

import { LedgerModule } from '../ledger/ledger.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            DrugEvent,
            Drug,
        ]),

        LedgerModule,
    ],

    controllers: [
        DrugEventsController,
    ],

    providers: [
        DrugEventsService,

        // Publisher
        EventPublisher,

        // Observer
        AuditObserver,

        // Strategies
        ManufacturedStrategy,
        ShippedStrategy,
        ReceivedStrategy,
        TemperatureMonitoredStrategy,

        // Strategy Factory
        EventStrategyFactory,

        // Saga
        CustodyTransferSaga,
    ],

    exports: [
        DrugEventsService,
    ],
})
export class DrugEventsModule { }