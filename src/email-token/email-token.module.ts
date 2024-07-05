import { Module } from '@nestjs/common';
import { EmailTokenService } from './email-token.service';
import { EmailTokenController } from './email-token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailToken } from './entities/email-token.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstant } from 'src/auth/jwt.constants';
import { AuthModule } from 'src/auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    AuthModule,
    MailerModule,
    TypeOrmModule.forFeature([EmailToken]),
    JwtModule.register({
      secret: jwtConstant.secret,
      signOptions: { expiresIn: '2h' }
    }),
  ],
  providers: [EmailTokenService],
  controllers: [EmailTokenController],
  exports: [EmailTokenService],
})
export class EmailTokenModule { }
