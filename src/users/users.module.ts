import {Logger, Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {UsersController} from './interface/users.controller';
import {EmailModule} from "../email/email.module";
import {UserEntity} from "./infra/db/entities/user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../auth/auth.module";
import {CqrsModule} from "@nestjs/cqrs";
import {CreateUserHandler} from "./application/command/create-user.handler";
import {VerifyEmailHandler} from "./application/command/verify-email.handler";
import {LoginHandler} from "./application/command/login.handler";
import {UserEventHandler} from "./application/event/user-event.handler";
import {GetUserInfoQueryHandler} from "./application/query/get-user-info-query.handler";
import {UserRepository} from "./infra/db/repository/user.repository";
import {EmailService} from "./infra/adapter/email.service";
import {UserFactory} from "./domain/user.factory";

@Module({
    imports: [
        EmailModule,
        TypeOrmModule.forFeature([UserEntity]),
        AuthModule,
        CqrsModule,
    ],
    controllers: [UsersController],
    providers: [UsersService, Logger, CreateUserHandler, VerifyEmailHandler, LoginHandler, UserEventHandler, GetUserInfoQueryHandler,
        {provide: 'UserRepository', useClass: UserRepository},
        {provide: 'EmailService', useClass: EmailService},
        UserFactory,
    ]
})
export class UsersModule {
}
