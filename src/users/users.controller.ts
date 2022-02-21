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
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {VerifyEmailDto} from "./dto/verify-email.dto";
import {UserLoginDto} from "./dto/user-login.dto";
import {ValidationPipe} from "./validation.pipe";
import {AuthService} from "../auth/auth.service";
import {UserInfo} from "./UserInfo";
import {AuthGuard} from "../guard/AuthGuard";
import { Logger as WinstonLogger } from 'winston';
import {WINSTON_MODULE_PROVIDER} from "nest-winston";
import {HttpExceptionFilter} from "../exception/http-exception.filter";
import {ErrorsInterceptor} from "../interceptor/error.interceptor";

@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
        // @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
        @Inject(Logger) private readonly logger: LoggerService,
    ) {
    }

    @Post()
    create(@Body() dto: CreateUserDto) {
        this.printLoggerServiceLog(dto);
        const {name, email, password} = dto;
        return this.usersService.create(name, email, password);
    }

    @Post('/email-verify')
    async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
        const { signupVerifyToken } = dto;
        return this.usersService.verifyEmail(signupVerifyToken);
    }

    @Post('/login')
    async login(@Body() dto: UserLoginDto): Promise<string> {
        const { email, password } = dto;

        return await this.usersService.login(email, password);
    }

    @UseInterceptors(ErrorsInterceptor)
    @UseGuards(AuthGuard)
    @Get(':id')
    async getUserInfo(@Headers() headers: any, @Param('id') id: string): Promise<UserInfo>{
        // throw new InternalServerErrorException();
        return this.usersService.getUserInfo(id);
    }

    private printLoggerServiceLog(dto) {
        try {
            throw new InternalServerErrorException('test');
        } catch (e) {
            this.logger.error('error: ' + JSON.stringify(dto), e.stack);
        }
        this.logger.warn('warn: ' + JSON.stringify(dto));
        this.logger.log('log: ' + JSON.stringify(dto));
        this.logger.verbose('verbose: ' + JSON.stringify(dto));
        this.logger.debug('debug: ' + JSON.stringify(dto));
    }

}
