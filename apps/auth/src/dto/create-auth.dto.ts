import { IsEmail } from 'class-validator';

export class CreateAuthDto {
  @IsEmail()
  email: string;

  google_id?: string;

  password?: string;
}
