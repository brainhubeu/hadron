import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Team } from './Team';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
    public id: number;

  @Column()
    public name: string;

  @ManyToOne((type) => Team, (team) => team.users)
    public team: Team;
}
