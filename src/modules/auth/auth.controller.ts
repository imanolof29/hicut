import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { CurrentUser } from './decorator/current-user.decorator';
import { RequestUser } from './types/request-user';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post()
  async signIn(
    @Body() dto: SignInDto
  ) {
    return await this.authService.signIn(dto)
  }

  @Post()
  async signUp(
    @Body() dto: SignUpDto
  ) {
    return await this.authService.signUp(dto)
  }

  @Post()
  async signOut(
    @CurrentUser() requestUser: RequestUser
  ) {
    return await this.authService.signOut(requestUser.sessionId)
  }

}
