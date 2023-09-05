import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AbstractDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
