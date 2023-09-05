import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClientProxy } from '@nestjs/microservices';
import Auth from './entity/auth.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { HttpService } from '@nestjs/axios';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly client: ClientProxy,
    private readonly authService: AuthService,
    private httpService: HttpService,
  ) {}

  @Post()
  async register(@Body() data: CreateAuthDto): Promise<Auth> {
    const user = await this.authService.register(data);
    // const x = this.httpService
    //   .post('http://localhost:3003/users', {
    //     authId: user.id,
    //   })
    //   .subscribe();
    // console.log({ data: x });
    this.client.emit('user_register', user);
    return user;
  }
}
