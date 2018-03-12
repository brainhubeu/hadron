import {Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @OneToMany((type) => User, (user) => user.team)
    public users: User[];

    // public asPromise() {
    //     return Promise.resolve(this);
    // }
}
