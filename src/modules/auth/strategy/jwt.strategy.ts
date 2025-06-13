import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from "../types/token-payload";
import { RequestUser } from "../types/request-user";
import { UsersService } from "src/modules/users/users.service";
import { SessionsService } from "src/modules/sessions/sessions.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor(
        configService: ConfigService,
        private userService: UsersService,
        private sessionService: SessionsService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate(payload: TokenPayload): Promise<RequestUser> {
        const { sub, sessionId } = payload
        const user = await this.userService.findById(sub)
        if (!user) {
            throw new UnauthorizedException('Token not valid')
        }
        const session = await this.sessionService.findByIdAndUser(user.id, sessionId)

        if (!session) {
            throw new UnauthorizedException("Invalid session")
        }

        return {
            sub: user.id,
            email: user.email,
            role: user.role.description,
            ownedBusinessId: user.ownedBusiness.id,
            workplaceId: user.workplaceId,
            sessionId: session.id
        }

    }

}