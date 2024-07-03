import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(12)
  password: string;

  @IsEmail()
  email: string;
}
