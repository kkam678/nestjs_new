import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ParseIntPipe,
    Headers,
    UseGuards, Inject, LoggerService, InternalServerErrorException, Logger, UseFilters, UseInterceptors
} from '@nestjs/common';
import {UsersService} from '../users.service';
import {CreateUserDto} from './dto/create-user.dto';
// import {UpdateUserDto} from './dto/update-user.dto';
import {VerifyEmailDto} from "./dto/verify-email.dto";
import {UserLoginDto} from "./dto/user-login.dto";
import {ValidationPipe} from "../validation.pipe";
import {AuthService} from "../../auth/auth.service";
import {UserInfo} from "./UserInfo";
import {AuthGuard} from "../../guard/auth.guard";
import {Logger as WinstonLogger} from 'winston';
import {WINSTON_MODULE_PROVIDER} from "nest-winston";
import {HttpExceptionFilter} from "../../exception/http-exception.filter";
import {ErrorsInterceptor} from "../../interceptor/error.interceptor";
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {CreateUserCommand} from "../application/command/create-user.command";
import {VerifyEmailCommand} from "../application/command/verify-email.command";
import {LoginCommand} from "../application/command/login.command";
import {GetUserInfoQuery} from "../application/query/get-user-info.query";

@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {
    constructor(
        //private readonly usersService: UsersService,
        //private readonly authService: AuthService,
        // @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
        //@Inject(Logger) private readonly logger: LoggerService,
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {
    }

    @Post()
     async createUser(@Body() dto: CreateUserDto): Promise<void> {
        const {name, email, password} = dto;
        const command = new CreateUserCommand(name, email, password);
        return this.commandBus.execute(command);
    }

    @Post('/email-verify')
    async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
        const {signupVerifyToken} = dto;
        const command = new VerifyEmailCommand(signupVerifyToken);
        return this.commandBus.execute(command);
    }

    @Post('/login')
    async login(@Body() dto: UserLoginDto): Promise<string> {
        const {email, password} = dto;
        const command = new LoginCommand(email,password);
        return this.commandBus.execute(command);
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
        // throw new InternalServerErrorException();
        const getUserInfoQuery = new GetUserInfoQuery(userId);
        return this.queryBus.execute(getUserInfoQuery);
    }

    // @Post()
    // create(@Body() dto: CreateUserDto) {
    //     this.printLoggerServiceLog(dto);
    //     const {name, email, password} = dto;
    //     return this.usersService.create(name, email, password);
    // }

    // @Post('/email-verify')
    // async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    //     const {signupVerifyToken} = dto;
    //     return this.usersService.verifyEmail(signupVerifyToken);
    // }
    //

    //
    // @UseInterceptors(ErrorsInterceptor)
    // @UseGuards(AuthGuard)
    // @Get(':id')
    // async getUserInfo(@Headers() headers: any, @Param('id') id: string): Promise<UserInfo> {
    //     // throw new InternalServerErrorException();
    //     return this.usersService.getUserInfo(id);
    // }
    //
    // private printLoggerServiceLog(dto) {
    //     try {
    //         throw new InternalServerErrorException('test');
    //     } catch (e) {
    //         this.logger.error('error: ' + JSON.stringify(dto), e.stack);
    //     }
    //     this.logger.warn('warn: ' + JSON.stringify(dto));
    //     this.logger.log('log: ' + JSON.stringify(dto));
    //     this.logger.verbose('verbose: ' + JSON.stringify(dto));
    //     this.logger.debug('debug: ' + JSON.stringify(dto));
    // }

}
