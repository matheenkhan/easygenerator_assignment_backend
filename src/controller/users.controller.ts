import { Controller, Get, Post, Header, Param, UseGuards, Body } from '@nestjs/common';
import { UserService } from 'src/service/users.service';
import {
    AuthGuard
} from '@nestjs/passport';
import { CreateUserDto } from 'src/model/createUser.dto';
import { UseInterceptors } from '@nestjs/common';
import { ResponseInterceptor } from 'src/interceptor/response-interceptor';

@UseInterceptors(ResponseInterceptor)
@Controller('user')
export class UsersController {
    constructor(private readonly userService: UserService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get(':email')
    getUserByEmail(@Param() param) {
        return this.userService.getUserByEmail(param.email);
    }

    @Get('check/:email')
    checkUserExists(@Param() param) {
        return this.userService.checkUserExists(param.email);
    }

    @Post('register')
    registerUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.registerUser(createUserDto);
    }

}