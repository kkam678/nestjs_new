import {EventsHandler, IEventHandler} from "@nestjs/cqrs";
// import {TestEvent} from "./test.event";
import {EmailService} from "../../../email/email.service";
import {UserCreatedEvent} from "../../domain/user-created.event";
import {Inject} from "@nestjs/common";
import {IEmailService} from "../adapter/iemail.service";

@EventsHandler(UserCreatedEvent)
export class UserEventHandler implements IEventHandler<UserCreatedEvent> {
    constructor(
        // private emailService: EmailService,
        @Inject('EmailService') private emailService: IEmailService,
    ) {
    }

    async handle(event: UserCreatedEvent) {
        switch (event.name) {
            case UserCreatedEvent.name : {
                console.log('UserCreatedEvent!');
                // @ts-ignore
                const {email, signupVerifyToken} = event as UserCreatedEvent;
                await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
                break;
            }
            default: {
                break;
            }

        }
    }
}