import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, BeforeInsert } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class EmailToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @ManyToOne(() => User, user => user.emailTokens, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @BeforeInsert()
  addId(): void {
    this.id = uuidv4();
  }
}
