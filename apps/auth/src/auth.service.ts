import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import Auth from './entity/auth.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private autRepository: Repository<Auth>,
    private readonly jwtService: JwtService,
    private dataSource: DataSource,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.autRepository.findOneBy({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }

  async login(user: any) {
    const payload = { name: user.name, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(data: CreateAuthDto): Promise<Auth> {
    await this.autRepository.create(data);
    const auth = await this.autRepository.save(data);
    // const queryRunner = this.dataSource.createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();
    // let user;
    // try {
    //   await this.autRepository.create(data);
    //   const auth = await this.autRepository.save(data);
    //   user = await this.httpService.post('http://localhost:3003/users', {
    //     authId: auth.id,
    //   });
    //   await queryRunner.commitTransaction();
    // } catch (err) {
    //   // since we have errors lets rollback the changes we made
    //   await queryRunner.rollbackTransaction();
    // } finally {
    //   // you need to release a queryRunner which was manually instantiated
    //   await queryRunner.release();
    // }
    return auth;
  }
}
