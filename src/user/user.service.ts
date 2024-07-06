import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { EmailTokenService } from 'src/email-token/email-token.service';
import { CreateEmailTokenDto } from 'src/email-token/dto/create-email-token.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly emailTokenService: EmailTokenService,
    private authService: AuthService,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async generateEmailToken(createEmailTokenDto: CreateEmailTokenDto): Promise<void> {
    const { email } = createEmailTokenDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`No se encontró un usuario con el email ${email}`);
    }

    // Asignar el ID del usuario al DTO
    createEmailTokenDto.id = user.id;

    // Llamar al servicio para enviar el email con el token
    const token = await this.emailTokenService.generateAndSaveToken(user);

    await this.emailTokenService.sendEmailToken(email, token)
  }

  async generatePasswordToken(createEmailTokenDto: CreateEmailTokenDto): Promise<void> {
    const { email } = createEmailTokenDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`No se encontró un usuario con el email ${email}`);
    }

    // Asignar el ID del usuario al DTO
    createEmailTokenDto.id = user.id;

    // Llamar al servicio para enviar el email con el token
    const token = await this.emailTokenService.generateAndSaveToken(user);

    await this.emailTokenService.sendPasswordToken(email, token)
  }

  async confirmEmailToken(token: string): Promise<void> {
    const userId = await this.emailTokenService.confirmEmailToken(token);

    if (userId) {
      const findUser = await this.userRepository.findOne({ where: { id: userId } });

      if (findUser) {
        await this.userRepository.update({ id: userId }, { active: true });
      } else {
        throw new NotFoundException(404, 'User not found');
      }
    } else {
      throw new BadRequestException(404, 'Invalid token');
    }
  }

  async confirmPasswordToken(token: string): Promise<string | null> {
    const userId = await this.emailTokenService.confirmPasswordToken(token);

    if (userId) {
      const findUser = await this.userRepository.findOne({ where: { id: userId } });
      if (findUser) {
        return userId;
      }
    }
    return null;
  }

  async updatePassword(userId: string, password:string): Promise<string | null> {
    await this.authService.updatePassword(userId, password)
    return null
  }

}
