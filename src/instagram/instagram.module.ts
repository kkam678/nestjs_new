import { Module } from '@nestjs/common';
import {InstagramService} from "./instagram.service";
import {ScheduleModule} from "@nestjs/schedule";
import {InstagramController} from "./instagram.controller";

@Module({
    imports: [
        ScheduleModule.forRoot(),
    ],
    controllers: [InstagramController],
    providers: [InstagramService],
    exports: [InstagramService]
})
export class InstagramModule {}
