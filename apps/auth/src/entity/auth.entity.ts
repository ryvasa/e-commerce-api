import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractDocument } from '@app/common';

@Entity()
class Auth extends AbstractDocument {
  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column({ nullable: true })
  google_id: string;

  @ApiProperty()
  @Column('text', { nullable: true })
  password: string;

  @ApiProperty()
  @Column('uuid', { nullable: true })
  user_id: string;
}

export default Auth;
