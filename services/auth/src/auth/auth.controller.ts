import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { JwtGatewayGuard } from './guards/jwt-gateway.guard';
// import { Response, Request } from 'express';
import type { Request } from 'express';
import type { Response } from 'express';
import { RedisService } from '../shared/redis/redis.service';
// import { REDIS_CLIENT } from './redis.module';



@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly redisService: RedisService
  ) { }

  // @Post()
  // create(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.create(createAuthDto);
  // }

  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }


  @Post('register')
  register(
    @Body()
    registerDto: RegisterDto,
  ) {
    return this.authService.register(
      registerDto,
    );
  }

  @Post('login')
  login(
    @Body()
    loginDto: LoginDto,
  ) {
    return this.authService.login(
      loginDto,
    );
  }


  @Post('refresh')
  refresh(@Body() body: any) {
    return this.authService.refreshToken(
      body.refreshToken,
    );
  }

  @UseGuards(JwtGatewayGuard)
  @Post('logout')
  logout(@Req() req: any) {
    return this.authService.logout(
      req.user.id,
    );
  }


  @UseGuards(JwtGatewayGuard)
  @Get('profile')
  async getProfile(
    @Req() req: any,
  ) {
    try {
      const data = req.user;
      const cacheKey = `book:${data.id}`;
      console.log('data', data);
      // 1. Check Redis Cache
      const cachedBook = await this.redisService.get(cacheKey);
      console.log('cachedBook', cachedBook);
      if (cachedBook) {
        return { data: cachedBook, source: 'Redis Cache' };
      }

      // 2. Cache Miss - Simulate fetching from DB
      const dbBook = data;

      // 3. Save to Redis for 5 minutes (300 seconds)
      await this.redisService.set(cacheKey, dbBook, 300);

      return { data: dbBook, source: 'Database' };

    } catch (error) {
      console.log(error)
      throw error
    }

    // return req.user;
  }

  @UseGuards(JwtGatewayGuard)
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Get('admin')
  adminRoute() {
    return 'admin data';
  }


  @Get('validate-gateway')
  @UseGuards(JwtGatewayGuard)
  async validateGateway(@Req() req: Request, @Res() res: Response) {
    console.log('validadin')
    const user = req.user as any; // Retreived from our Guard above
    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).send();
    }
    // Set the user identity fields into the outgoing response headers
    res.setHeader('X-User-Id', user.sub || '');
    res.setHeader('X-User-Email', user.email || '');
    res.setHeader('X-User-Role', user.role || '');

    // Return a clean 200 OK back to NGINX with an empty body
    return res.status(HttpStatus.OK).send();
  }




}
