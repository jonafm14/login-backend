import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { EmailTokenService } from './email-token.service';

@Controller('email-token')
export class EmailTokenController {
  constructor(private readonly emailTokenService: EmailTokenService) { }

  @Get('confirmacion/email/:token')
  async generateEmailToken(@Param('token') token: string): Promise<void> {
    if (!token) {
      throw new BadRequestException('Este enlace ya no funciona');
    }

    await this.emailTokenService.confirmEmailToken(token);
  }
}
