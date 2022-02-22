import {Injectable, NotFoundException} from "@nestjs/common";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {VerifyEmailCommand} from "./verify-email.command";
import {InjectRepository, TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../../infra/db/entities/user.entity";
import {Repository} from "typeorm";
import {AuthService} from "../../../auth/auth.service";

@Injectable()
@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
    constructor(
        @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
        private authService: AuthService,
    ) {
    }

    async execute(command: VerifyEmailCommand): Promise<any> {
        const {signupVerifyToken} = command;
        const user = await this.usersRepository.findOne({signupVerifyToken});
        if (!user) {
            throw new NotFoundException('유저가 존재하지 않습니다');
        }

        return this.authService.login({
            id: user.id,
            name: user.name,
            email: user.email,
        })

    }

}