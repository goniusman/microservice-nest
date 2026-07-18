import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
} from '@nestjs/common';

import { AuthProxy } from '../proxy/auth.proxy';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authProxy: AuthProxy,
  ) { }

  @Post('register')
  register(@Body() body: any) {
    return this.authProxy.register(body);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.authProxy.login(body);
  }

  @Post('refresh')
  refresh(@Body() body: any) {
    return this.authProxy.refresh(body);
  }

  @Get('profile')
  profile(
    @Headers('authorization')
    token: string,
  ) {
    return this.authProxy.profile(token);
  }

  @Get('logout')
  logOut(
    @Headers('authorization')
    token: string,
  ) {
    return this.authProxy.logout(token);
  }

}