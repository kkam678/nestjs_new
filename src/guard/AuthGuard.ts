import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Observable} from "rxjs";
import {AuthService} from "../auth/auth.service";
import {Request} from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService) {
    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    private validateRequest(request: Request) {

        if(!request.headers.authorization){
            return false;
        }

        if(!request.headers.authorization.includes('Bearer ')){
            return false;
        }

        const token = request.headers.authorization.split('Bearer ')[1];

        this.authService.verify(token);
        return true;
    }
}