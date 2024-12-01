import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { User, UserShema } from './usuario.schema';
import { UsersService } from './usuario.service';
import { UsersController } from './usuario.controller';
import { hashPassword } from './usuario.hashpassword';


@Module({
  imports: [MongooseModule.forFeature([{name: User.name, schema: UserShema}])],
  providers: [UsersService],
  exports: [UsersService, MongooseModule],
  controllers: [UsersController],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer){
    consumer.apply(hashPassword)
    .forRoutes({ path: 'user', method: RequestMethod.POST })};
}
