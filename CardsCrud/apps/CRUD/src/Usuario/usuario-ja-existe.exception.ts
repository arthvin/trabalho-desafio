import { HttpException, HttpStatus } from "@nestjs/common";

export class UserAlreadyExistsException extends HttpException {
    constructor() {
      super('Usuário já existe', HttpStatus.BAD_REQUEST);
    }
  }