import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { EmailTokenService } from 'src/email-token/email-token.service';
import { CreateEmailTokenDto } from 'src/email-token/dto/create-email-token.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly emailTokenService: EmailTokenService
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

}
