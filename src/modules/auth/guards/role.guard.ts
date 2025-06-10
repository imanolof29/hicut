import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "../decorator/role.decorator";

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const validRoles: string[] = this.reflector.get(ROLES_KEY, context.getHandler())
        if (!validRoles) return true
        if (validRoles.length === 0) return true

        const req = context.switchToHttp().getRequest()
        const user = req.user

        if (!user) {
            throw new ForbiddenException('User not found')
        }

        if (!validRoles.includes(user.role)) {
            throw new ForbiddenException(`Role ${user.role} is forbidden`)
        }
        return true
    }

}