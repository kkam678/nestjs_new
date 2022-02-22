import {IUserRepository} from "../../../domain/repository/iuser.repository";
import {Connection, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../entities/user.entity";
import {UserFactory} from "../../../domain/user.factory";
import {User} from "../../../domain/user";

export class UserRepository implements IUserRepository {
    constructor(
        private connection: Connection,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        private userFactory: UserFactory,
    ) {
    }

    async findByEmail(email: string): Promise<User | null> {
        const userEntity = await this.userRepository.findOne({email});
        if (!userEntity) {
            return null;
        }

        const {id, name, signupVerifyToken, password} = userEntity;

        return this.userFactory.reconstitute(id, name, email, signupVerifyToken, password);

    }

    async save(id: string, name: string, email: string, password: string, signupVerifyToken: string): Promise<void> {
        await this.connection.transaction(async manager => {
            const user = new UserEntity();
            user.id = id;
            user.name = name;
            user.email = email;
            user.password = password;
            user.signupVerifyToken = signupVerifyToken;

            await manager.save(user);

        })
    }
}