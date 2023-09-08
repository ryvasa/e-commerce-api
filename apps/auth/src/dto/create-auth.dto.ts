import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  google_id?: string;

  @ApiProperty()
  password?: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  address?: string;

  @ApiProperty()
  photo?: string;

  @ApiProperty()
  auth_id?: string;
}
