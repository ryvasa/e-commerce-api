import { MaxLength } from 'class-validator';

export class CreateUserDto {
  @MaxLength(25)
  username: string;

  address?: string;

  photo?: string;

  auth_id?: string;
}
