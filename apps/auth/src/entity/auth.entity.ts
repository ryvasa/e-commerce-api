import { Column, Entity } from 'typeorm';
import { AbstractDocument } from '@app/common';

@Entity()
class Auth extends AbstractDocument {
  @Column()
  email: string;

  @Column({ nullable: true })
  google_id: string;

  @Column('text', { nullable: true })
  password: string;

  @Column('uuid', { nullable: true })
  user_id: string;
}

export default Auth;
