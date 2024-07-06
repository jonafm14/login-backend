import { HttpException, Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtAuthService: JwtService
  ) {}

   async register(userObject: RegisterAuthDto): Promise<User> {
    const { password } = userObject;
    const saltOrRounds = 10; // Número de rondas para generar el salt

    const hashedPassword = await bcrypt.hash(password, saltOrRounds); // Hashing usando bcrypt

    const newUser = this.userRepository.create({ ...userObject, password: hashedPassword });
    return this.userRepository.save(newUser);
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      const saltOrRounds = 10; // Número de rondas para generar el salt
      const hashedPassword = await bcrypt.hash(newPassword, saltOrRounds); // Hasheando usando bcrypt
      user.password = hashedPassword;
      await this.userRepository.save(user);
    }
    const userTwo = await this.userRepository.findOne({ where: { id: userId } });
  }

  async login(userObjectLogin: LoginAuthDto) {
    const { email, password } = userObjectLogin
    const findUser = await this.userRepository.findOne({ where: { email } });
    if(!findUser) throw new HttpException('USER_NOT_FOUND', 401)
    
    const checkPasword = await bcrypt.compare(password, findUser.password)

    if(!checkPasword) throw new HttpException('PASSWORD_INCORRECT', 403)
      
    const payload = { id: findUser.id, username: findUser.username}
    const token = this.jwtAuthService.sign(payload)
      
    const data = {
      user: findUser,
      token
    }

    return data
  }
}
