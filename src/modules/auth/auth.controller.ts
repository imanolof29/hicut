import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { CurrentUser } from './decorator/current-user.decorator';
import { RequestUser } from './types/request-user';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RefreshDto } from './dto/refresh.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signIn')
  @ApiResponse({ status: 200, description: 'SignIn successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({
    type: SignInDto,
  })
  async signIn(
    @Body() dto: SignInDto,
    @Req() req
  ) {
    const deviceInfo = req.get('User-Agent');
    const ipAddress = req.ip;
    return await this.authService.signIn(dto, deviceInfo, ipAddress)
  }

  @Post('signUp')
  @ApiResponse({ status: 201, description: 'SignUp successful' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  @ApiBody({
    type: SignUpDto
  })
  async signUp(
    @Body() dto: SignUpDto,
    @Req() req
  ) {
    const deviceInfo = req.get('User-Agent');
    const ipAddress = req.ip;
    return await this.authService.signUp(dto, deviceInfo, ipAddress)
  }

  @Post('signOut')
  @ApiResponse({ status: 200, description: 'SignOut successful' })
  async signOut(
    @CurrentUser() requestUser: RequestUser
  ) {
    return await this.authService.signOut(requestUser.sessionId)
  }

  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refreshTokens(refreshDto.refreshToken);
  }

}
