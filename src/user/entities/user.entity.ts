import { EmailToken } from 'src/email-token/entities/email-token.entity';
import { Entity, Column, PrimaryColumn, BeforeInsert, OneToMany } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  username: string;
  
  @Column()
  password: string;
  
  @Column()
  email: string;
  
  @Column({ default: false })
  active: boolean;

  @OneToMany(() => EmailToken, emailToken => emailToken.user)
  emailTokens: EmailToken[];

  @BeforeInsert()
  addId(): void {
    this.id = uuidv4();
  }
}
