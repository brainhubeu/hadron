import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class UserStatus {
  @PrimaryGeneratedColumn() public id: number;

  @Column({ type: 'text' })
  public name: string;

  @OneToMany((type) => User, (user) => user.status)
  public users: User[];
}
