import {Inject, Injectable, UnprocessableEntityException} from "@nestjs/common";
import {CommandHandler, EventBus, ICommandHandler} from "@nestjs/cqrs";
import {CreateUserCommand} from "./create-user.command";
import * as uuid from "uuid";
import {UserEntity} from "../../infra/db/entities/user.entity";
import {ulid} from "ulid";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {EmailService} from "../../../email/email.service";
import {UserFactory} from "../../domain/user.factory";
import {IUserRepository} from "../../domain/repository/iuser.repository";
// import {UserCreatedEvent} from "../event/user-created.event";
// import {TestEvent} from "../event/test.event";

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    constructor(
        // @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
        // private emailService: EmailService,
        // private eventBus: EventBus,
        private userFactory: UserFactory,
        @Inject('UserRepository') private userRepository: IUserRepository,
    ) {

    }

    async execute(command: CreateUserCommand) {
        const {name, email, password} = command;
        // const userExist = await this.checkUserExists(email);

        // if (userExist) {
        //     throw new UnprocessableEntityException('해당 이메일로는 가입할 수 없습니다.');
        // }

        const user = await this.userRepository.findByEmail(email);
        if (user !== null) {
            throw new UnprocessableEntityException('해당 이메일로는 가입할 수 없습니다.');
        }
        const id = ulid();
        const signupVerifyToken = uuid.v1();

        await this.userRepository.save(id, name, email, password, signupVerifyToken);
        this.userFactory.create(id, name, email, password, signupVerifyToken);

        // await this.saveUser(name, email, password, signupVerifyToken);
        // this.eventBus.publish(new UserCreatedEvent(email, signupVerifyToken));
        // this.eventBus.publish(new TestEvent());
        // await this.sendMemberJoinEmail(email, signupVerifyToken);

    }


    // private async checkUserExists(email: string) {
    //     const user = await this.usersRepository.findOne({email: email});
    //
    //     return user !== undefined;
    // }

    // private async saveUser(name: string, email: string, password: string, signupVerifyToken: string) {
    //     const user = new UserEntity();
    //     user.id = ulid();
    //     user.name = name;
    //     user.email = email;
    //     user.password = password;
    //     user.signupVerifyToken = signupVerifyToken;
    //     await this.usersRepository.save(user);
    // }
    //
    // private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    //     try {
    //         await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
    //     }catch (e) {
    //         console.log(e);
    //
    //     }
    // }

}