import { IRole } from '../../hadron-security/src/hierarchyProvider';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Role implements IRole {
  @PrimaryGeneratedColumn() public id: string | number;
  @Column({ type: 'text' })
  public name: string;
}
