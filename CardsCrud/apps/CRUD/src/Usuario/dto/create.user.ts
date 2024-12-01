import { IsArray, IsEnum, IsString } from 'class-validator';
import { Role } from '../../Auth/enum/role.enum';



export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  roles: Role[];

}