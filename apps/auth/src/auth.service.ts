import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import Auth from './entity/auth.entity';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private autRepository: Repository<Auth>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email, password?, google_id?) {
    const user = await this.autRepository.findOne({
      where: [{ email }, { google_id }],
    });
    if (user.email) {
      const passwordIsValid = await bcrypt.compare(password, user.password);
      if (!passwordIsValid) {
        throw new UnauthorizedException('Credentials are not valid.');
      }
    }
    return user;
  }

  async register(data: CreateAuthDto): Promise<Auth> {
    await this.existAuth(data);
    data.password = await bcrypt.hash(data.password, 10);
    await this.autRepository.create(data);
    const auth = await this.autRepository.save(data);
    return auth;
  }

  async login(data): Promise<any> {
    const auth = await this.autRepository.findOne({
      where: [{ email: data.email }, { google_id: data.google_id }],
    });
    return { access_token: this.jwtService.sign({ id: auth.id }) };
  }

  async currentUser(id: string): Promise<Auth> {
    const auth = await this.autRepository.findOneBy({ id });
    return auth;
  }

  async existAuth(data): Promise<any> {
    const auth = await this.autRepository.findOne({
      where: [{ email: data.email }, { google_id: data.google_id }],
    });
    if (auth) {
      throw new BadRequestException('Email already in use');
    }
  }
}
