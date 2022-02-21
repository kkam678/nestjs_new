import {Logger, Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {EmailModule} from "../email/email.module";
import {UserEntity} from "./entities/user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [
        EmailModule,
        TypeOrmModule.forFeature([UserEntity]),
        AuthModule,
    ],
    controllers: [UsersController],
    providers: [UsersService, Logger]
})
export class UsersModule {
}
