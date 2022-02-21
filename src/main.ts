import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import {ValidationPipe} from "@nestjs/common";
import {logger3} from "./logger/logger3.middelware";
import {AuthGuard} from "./guard/AuthGuard";
import {MyLogger} from "./logger/MyLogger";
import {WINSTON_MODULE_PROVIDER} from "nest-winston";
import {utilities as nestWinstonModuleUtilities, WinstonModule} from 'nest-winston';
import * as winston from "winston";
import {LoggingInterceptor} from "./logging/logging.interceptor";
import {TransformInterceptor} from "./interceptor/transform.interceptor";


// dotenv.config({
//   path: path.resolve(
//       (process.env.NODE_ENV === 'production') ? '.production.env'
//           : (process.env.NODE_ENV === 'stage') ? '.stage.env' : '.development.env'
//   )
// });

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: WinstonModule.createLogger({
            transports: [
                new winston.transports.Console({
                    level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        nestWinstonModuleUtilities.format.nestLike('MyApp', {prettyPrint: true}),
                    ),
                }),
            ],
        })
    });
    // app.useGlobalGuards(new AuthGuard());
    // app.useLogger(app.get(MyLogger));
    // app.useLogger(app.get(WINSTON_MODULE_PROVIDER));
    app.useGlobalInterceptors(
        // new LoggingInterceptor(),
        new TransformInterceptor(),
    );
    app.useGlobalPipes(new ValidationPipe({
        transform: true
    }));
    await app.listen(3000);
}

bootstrap();
