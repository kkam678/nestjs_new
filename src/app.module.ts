import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UsersModule} from './users/users.module';
import {EmailModule} from './email/email.module';
import {ConfigModule, ConfigService} from "@nestjs/config";
import emailConfig from "./config/email-config";
import {validationSchema} from "./config/validation-schema";
import {TypeOrmModule} from "@nestjs/typeorm";
import {LoggerMiddleware} from "./logger/logger.middelware";
import {Logger2Middleware} from "./logger/logger2.middelware";
import {UsersController} from "./users/interface/users.controller";
import {APP_GUARD} from "@nestjs/core";
import {AuthGuard} from "./guard/auth.guard";
import {AuthModule} from './auth/auth.module';
import authConfig from "./config/auth-config";
import {LoggerModule} from "./logger/logger.module";
import {
    utilities as nestWinstonModuleUtilities,
    WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import {ExceptionModule} from "./exception/exception.module";
import {LoggingModule} from "./logging/logging.module";
import {CreateUserHandler} from "./users/application/command/create-user.handler";
import {InstagramService} from "./instagram/instagram.service";
import {InstagramModule} from "./instagram/instagram.module";

@Module({
    controllers: [AppController],
    providers: [
        AppService,
        ConfigService,
        // {
        //     provide: APP_GUARD,
        //     useClass: AuthGuard,
        // },
    ],
    imports: [
        ConfigModule.forRoot({
            envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
            load: [emailConfig, authConfig],
            isGlobal: true,
            validationSchema,
        }),
        TypeOrmModule.forRoot(),
        UsersModule,
        EmailModule,
        AuthModule,
        LoggerModule,
        WinstonModule.forRoot({
            transports: [
                new winston.transports.Console({
                    level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        nestWinstonModuleUtilities.format.nestLike('MyApp', {prettyPrint: true}),
                    ),
                }),
            ],
        }),
        ExceptionModule,
        LoggingModule,
        InstagramModule,
    ],
})

export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer
            .apply(LoggerMiddleware, Logger2Middleware)
            .forRoutes(UsersController);
        // .exclude({ path: 'users', method: RequestMethod.GET },)
    }
}
