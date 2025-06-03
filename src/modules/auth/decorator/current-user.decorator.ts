import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { RequestUser } from "../types/request-user";

export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): RequestUser => {
        const request: { user: RequestUser } = ctx.switchToHttp().getRequest()
        return request.user
    }
)