import { AbstractDocument } from '@app/common';
import { Column, Entity } from 'typeorm';

@Entity()
class User extends AbstractDocument {
  @Column()
  username: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  photo?: string;

  @Column({ nullable: true })
  auth_id?: string;
}

export default User;
