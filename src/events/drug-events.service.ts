import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { createHash } from 'crypto';

import { DrugEvent } from './entities/drug-event.entity';
import { Drug } from '../drugs/entities/drug.entity';

import { CreateDrugEventDto } from './dto/create-drug-event.dto';

import { EventPublisher } from './publishers/event.publisher';

import { CreateDrugEventCommand } from './commands/create-drug-event.command';
import { GetDrugEventsQuery } from './queries/get-drug-events.query';

import { CustodyTransferSaga } from './saga/custody-transfer.saga';

import { LedgerService } from '../ledger/ledger.service';

@Injectable()
export class DrugEventsService {
    constructor(
        @InjectRepository(DrugEvent)
        private readonly drugEventRepository:
            Repository<DrugEvent>,

        @InjectRepository(Drug)
        private readonly drugRepository:
            Repository<Drug>,

        private readonly eventPublisher:
            EventPublisher,

        private readonly custodyTransferSaga:
            CustodyTransferSaga,

        private readonly ledgerService:
            LedgerService,
    ) { }

    // ==========================================
    // CQRS - COMMAND
    // ==========================================

    async executeCreateCommand(
        data: CreateDrugEventDto,
    ) {
        const command =
            new CreateDrugEventCommand(data);

        return this.create(command.data);
    }

    // ==========================================
    // CREATE DRUG EVENT
    // ==========================================

    async create(
        data: CreateDrugEventDto,
    ) {
        // Find drug
        const drug =
            await this.drugRepository.findOne({
                where: {
                    serialNumber:
                        data.drugSerialNumber,
                },
            });

        if (!drug) {
            throw new NotFoundException(
                `Drug with serial number ${data.drugSerialNumber} not found`,
            );
        }

        // ==========================================
        // SAGA - Validate custody transition
        // ==========================================

        const previousEventRecord =
            await this.drugEventRepository.findOne({
                where: {
                    drugSerialNumber:
                        data.drugSerialNumber,
                },

                order: {
                    createdAt: 'DESC',
                },
            });

        const previousEvent =
            previousEventRecord
                ? previousEventRecord.eventType
                : null;

        this.custodyTransferSaga.validateTransition(
            previousEvent,
            data.eventType,
        );

        // ==========================================
        // Create Event
        // ==========================================

        const event =
            this.drugEventRepository.create({
                ...data,
                drug,
            });

        // ==========================================
        // Generate SHA-256 Event Hash
        // ==========================================

        const eventHash =
            createHash('sha256')
                .update(
                    JSON.stringify({
                        drugSerialNumber:
                            data.drugSerialNumber,

                        eventType:
                            data.eventType,

                        eventData:
                            data.eventData,
                    }),
                )
                .digest('hex');

        event.eventHash = eventHash;

        // ==========================================
        // Save Event
        // ==========================================

        const savedEvent =
            await this.drugEventRepository.save(
                event,
            );

        // ==========================================
        // Publish Event
        // ==========================================

        this.eventPublisher.publish(
            savedEvent,
        );

        // ==========================================
        // ADD EVENT TO LEDGER
        // ==========================================

        this.ledgerService.addEvent(
            savedEvent.drugSerialNumber,
            savedEvent.id,
            savedEvent.eventHash,
        );

        return savedEvent;
    }

    // ==========================================
    // CQRS - QUERY
    // ==========================================

    async executeGetQuery(
        serialNumber: string,
    ) {
        const query =
            new GetDrugEventsQuery(
                serialNumber,
            );

        return this.findBySerialNumber(
            query.serialNumber,
        );
    }

    // ==========================================
    // GET ALL EVENTS
    // ==========================================

    findAll() {
        return this.drugEventRepository.find({
            relations: {
                drug: true,
            },

            order: {
                createdAt: 'ASC',
            },
        });
    }

    // ==========================================
    // GET EVENTS BY SERIAL NUMBER
    // ==========================================

    findBySerialNumber(
        serialNumber: string,
    ) {
        return this.drugEventRepository.find({
            where: {
                drugSerialNumber:
                    serialNumber,
            },

            relations: {
                drug: true,
            },

            order: {
                createdAt: 'ASC',
            },
        });
    }

    // ==========================================
    // DELETE EVENTS
    // ==========================================

    deleteBySerialNumber(
        serialNumber: string,
    ) {
        return this.drugEventRepository.delete({
            drugSerialNumber:
                serialNumber,
        });
    }
}