import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
} from '@nestjs/common';

import { DrugEventsService } from './drug-events.service';

import { CreateDrugEventDto } from './dto/create-drug-event.dto';

@Controller('drug-events')
export class DrugEventsController {
    constructor(
        private readonly drugEventsService: DrugEventsService,
    ) { }

    // COMMAND - Create Event
    @Post()
    create(
        @Body() body: CreateDrugEventDto,
    ) {
        return this.drugEventsService.executeCreateCommand(
            body,
        );
    }

    // QUERY - Get All Events
    @Get()
    findAll() {
        return this.drugEventsService.findAll();
    }

    // QUERY - Get Events by Drug Serial Number
    @Get(':serialNumber')
    findBySerialNumber(
        @Param('serialNumber') serialNumber: string,
    ) {
        return this.drugEventsService.executeGetQuery(
            serialNumber,
        );
    }

    // DELETE - Delete Events by Drug Serial Number
    @Delete(':serialNumber')
    deleteBySerialNumber(
        @Param('serialNumber') serialNumber: string,
    ) {
        return this.drugEventsService.deleteBySerialNumber(
            serialNumber,
        );
    }
}