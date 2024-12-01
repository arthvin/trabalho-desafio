import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
import { UsersService } from "./usuario.service";
import { UpdateUserDto } from "./dto/update.user";
import { CreateUserDto } from "./dto/create.user";
import { UserAlreadyExistsException } from "./usuario-ja-existe.exception";

@Controller('user')
export class UsersController {
    constructor(private readonly userService: UsersService){}

    @Post()
    async create(@Body() createUserDto: CreateUserDto){
        try{
            if (await this.userService.create(createUserDto)){
                return `Usuário criado com sucesso`
            }else{
                throw new UserAlreadyExistsException();
            }             
        }catch(e){
            if (e instanceof UserAlreadyExistsException) throw new UserAlreadyExistsException();
            throw new HttpException({}, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Post(':username')
    @HttpCode(200)
    async update(@Param('username') username: string, @Body() updateUserDto: UpdateUserDto){
        try{
            const id = await this.userService.findUser(username).then((user) => user._id);
            if (await this.userService.update(id.toString(), updateUserDto)) return `Usuário atualizado com sucesso`
        }catch(e){
            throw new HttpException({}, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Delete(':username')
    @HttpCode(204)
    delete(@Param('username') username: string){
        try{
            const id = this.userService.findUser(username).then((user) => user._id);
            return this.userService.delete(id.toString());
        }catch(e){
            throw new HttpException({}, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get()
    async findAll(){
        try {
            const users = await this.userService.findAll()
            return users
        } catch (error) {
            throw new HttpException({}, HttpStatus.INTERNAL_SERVER_ERROR)        
        }   
    }


}
