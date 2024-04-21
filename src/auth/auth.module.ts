import {
    Module
} from '@nestjs/common';
import {
    AuthService
} from './auth.service';
import {
    AuthController
} from './auth.controller';
import {
    MongooseModule
} from '@nestjs/mongoose';
import {
    User,
    UserSchema
} from '../model/users.schema';
import {
    JwtModule
} from '@nestjs/jwt';
import {
    jwtConstants
} from 'src/strategy/constants';
import {
    UserService
} from '../service/users.service';
import {
    HashService
} from './hash.service';
import { CustomThrottlerGuard } from 'src/utilities/custom-throttler-guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: User.name,
            schema: UserSchema
        }]),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {
                expiresIn: '60d'
            },
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, UserService, HashService],
})
export class AuthModule { }