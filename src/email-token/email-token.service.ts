import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm'; // Importa Repository para manejar entidades en TypeORM
import { EmailToken } from './entities/email-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class EmailTokenService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    @InjectRepository(EmailToken)
    private emailTokenRepository: Repository<EmailToken>,
  ) { }

  async generateAndSaveToken(user: User): Promise<string> {
    const { id } = user

    const payload = { id: id };

    const token = this.jwtService.sign(payload)

    // Guarda el token en la base de datos (si lo requieres)
    const emailToken = new EmailToken();
    emailToken.token = token;
    emailToken.user = user;
    await this.emailTokenRepository.save(emailToken);

    return token
  }

  async sendEmailToken(email: string, token: string): Promise<void> {
    // Construye la URL de confirmación
    const confirmationUrl = `http://localhost:3000/email-token/confirmacion/email/${token}`;

    // Configura y envía el email con el token y la URL de confirmación
    const mailOptions = {
      to: email,
      subject: 'Confirmación de Email',
      text: `¡Gracias por registrarte en nuestro sitio! Haz clic en el siguiente enlace para confirmar tu dirección de correo electrónico:\n\n${confirmationUrl}\n\nSi no solicitaste esto, ignora este mensaje.`,
    };
  
    // Configura y envía el email con el token y la URL de confirmación
    await this.mailerService.sendMail(mailOptions);
  }

  async confirmEmailToken(token: string): Promise<void> {
    try {
      const decodedToken = this.jwtService.verify(token); // Verifica y decodifica el token
      const userId = decodedToken.id;

      // Buscar el emailToken en la base de datos por userId y token
      const emailToken = await this.emailTokenRepository.findOne({
        where: { user: { id: userId }, token },
      });

      if (!emailToken) {
        throw new NotFoundException('Token de email no válido');
      }

      // Ejemplo de cómo podrías usar emailToken (en este caso, no lo estamos usando explícitamente)
      // Aquí podrías realizar cualquier acción adicional necesaria, como activar la cuenta del usuario, etc.
      console.log('Token de email confirmado correctamente');

      // Eliminar el token de la base de datos
      await this.emailTokenRepository.delete({ token: token });

      // Aquí podrías realizar cualquier acción adicional necesaria, como activar la cuenta del usuario, etc.
      console.log('Token de email confirmado y eliminado correctamente')
    } catch (error) {
      throw new BadRequestException('Token de email inválido o expirado');
    }
  }

}
