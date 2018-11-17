import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Team } from './Team';
import { UserStatus } from './UserStatus';

@Entity()
export class User {
  @PrimaryGeneratedColumn() public id: number;

  @Column({ type: 'text' })
  public name: string;

  @ManyToOne((type) => Team, (team) => team.users)
  public team: Team;

  @ManyToOne((type) => UserStatus, (userStatus) => userStatus.users)
  public userStatus: UserStatus;
}
