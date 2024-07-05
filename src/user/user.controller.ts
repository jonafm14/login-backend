import { Controller, Get, Post, Body, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateEmailTokenDto } from 'src/email-token/dto/create-email-token.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Post('generate-email-token')
  async generateEmailToken(@Body() createEmailTokenDto: CreateEmailTokenDto): Promise<void> {
    const { email } = createEmailTokenDto
    if (!email) {
      throw new BadRequestException('El email es obligatorio');
    }

    await this.userService.generateEmailToken(createEmailTokenDto);
  }

  @Get('confirmacion/email/:token')
  async confirmEmailToken(@Param('token') token: string): Promise<void> {
    if (!token) {
      throw new BadRequestException('Este enlace ya no funciona');
    }

    await this.userService.confirmEmailToken(token);
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
