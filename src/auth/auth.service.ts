import * as jwt from 'jsonwebtoken';
import {Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import authConfig from "../config/auth-config";
import {ConfigType} from "@nestjs/config";
import emailConfig from "../config/email-config";

interface User {
    id: string;
    name: string;
    email: string;
}

@Injectable()
export class AuthService {
    constructor(
        @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>
    ) {
        console.log(config);
    }

    login(user: User) {
        const payload = {...user};
        return jwt.sign(payload, this.config.jwtSecret, {
            expiresIn: '1d',
            audience: 'example.com',
            issuer: 'example.com',
        });
    }

    verify(token: string) {
        try {
            const payload = jwt.verify(token, this.config.jwtSecret) as (jwt.JwtPayload | string) & User;

            const {id, email} = payload;

            return {
                userId: id,
                email,
            }
        } catch (e) {
            throw new UnauthorizedException();
        }
    }
}
