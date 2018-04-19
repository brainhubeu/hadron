import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Team } from './Team';
import { IUser, IRole } from '../../hadron-security/src/hierarchyProvider';
import { Role } from './Role';

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn() public id: number;

  @Column({ type: 'text' })
  public username: string;

  @Column({ type: 'text' })
  public passwordHash: string;

  @ManyToOne((type) => Team, (team) => team.users)
  public team: Team;

  @ManyToMany((type) => Role)
  @JoinTable({ name: 'user_role' })
  public roles: IRole[];
}
