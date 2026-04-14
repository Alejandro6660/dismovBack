import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Pantalla } from './entities/pantalla.entity';
import { RolUser } from './entities/rolUser.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([User, Pantalla, RolUser])],
  exports: [UsersService],
})
export class UsersModule {}
