import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../Usuario/usuario.service';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(username: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findUser(username);
    const match = await bcrypt.compare(pass, user.password).then((result) => result);
    if (!match) throw new UnauthorizedException();
    
    const payload = { sub: user._id, username: user.username, roles: user.roles};
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}