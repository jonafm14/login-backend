import { Controller, Get, Post, Body, Param, Delete, UseGuards, BadRequestException, Render, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateEmailTokenDto } from 'src/email-token/dto/create-email-token.dto';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService
  ) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.register(createUserDto)
  }

  @Post('generate-email-token')
  async generateEmailToken(@Body() createEmailTokenDto: CreateEmailTokenDto): Promise<void> {
    const { email } = createEmailTokenDto
    if (!email) {
      throw new BadRequestException('El email es obligatorio');
    }

    await this.userService.generateEmailToken(createEmailTokenDto);
  }

  @Post('generate-password-token')
  async generatePasswordToken(@Body() createEmailTokenDto: CreateEmailTokenDto): Promise<void> {
    const { email } = createEmailTokenDto
    if (!email) {
      throw new BadRequestException('El email es obligatorio');
    }

    await this.userService.generatePasswordToken(createEmailTokenDto);
  }

  @Post('confirmacion/email')
  async confirmEmailToken(@Body('token') token: string): Promise<void> {
    if (!token) {
      throw new BadRequestException('Este enlace ya no funciona');
    }

    await this.userService.confirmEmailToken(token);
  }

  @Get('confirmacion/password/:token')
  async confirmPasswordToken(@Param('token') token: string, @Res() res: Response): Promise<void> {
    if (!token) {
      throw new BadRequestException('Este enlace ya no funciona');
    }

    const userId = await this.userService.confirmPasswordToken(token);

    if (!userId) {
      throw new BadRequestException('Token inválido o expirado');
    }

    res.redirect(`/user/change-password/${userId}`);
  }

  @Get('change-password/:userId')
  @Render('change-password')
  getChangePasswordPage(@Param('userId') userId: string) {
    return { userId };
  }

  @Post('change-password/:userId')
  async changePassword(
    @Param('userId') userId: string,
    @Body() body: { password: string; confirmPassword: string }
  ): Promise<any> {
    const { password, confirmPassword } = body;

    if (password !== confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    await this.userService.updatePassword(userId, password);
    return { success: 'Contraseña cambiada exitosamente' };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
