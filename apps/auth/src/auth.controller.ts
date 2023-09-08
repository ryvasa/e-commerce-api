import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClientProxy } from '@nestjs/microservices';
import Auth from './entity/auth.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly client: ClientProxy,
    private readonly authService: AuthService,
  ) {}

  @ApiCreatedResponse({ type: Auth })
  @ApiBadRequestResponse()
  @Post('register')
  async register(@Body() data: CreateAuthDto): Promise<Auth> {
    const { email, google_id, password, ...others }: CreateAuthDto = data;
    const auth = await this.authService.register(data);
    const user = { ...others, auth_id: auth.id };
    this.client.emit('user_register', user);
    return auth;
  }

  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const auth = await this.authService.login(data);
    response.cookie('access_token', auth.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
    return auth;
  }

  @ApiCreatedResponse({ type: Auth })
  @ApiBadRequestResponse()
  @UseGuards(GoogleAuthGuard)
  @Get('login/google')
  async google(@Req() request): Promise<any> {
    return request.user;
  }

  @Get('google/redirect')
  async coba(@Req() request): Promise<any> {
    console.log(request.user);
    console.log('request');
    return request.user;
  }

  @ApiUnauthorizedResponse()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() request) {
    return this.authService.currentUser(request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('logout')
  async logout(@Res({ passthrough: true }) response: Response): Promise<any> {
    response.clearCookie('access_token');
    return 'User has been logout';
  }
}
