import {
    Module
} from '@nestjs/common';
import {
    UserService
} from '../service/users.service';
import {
    UsersController
} from '../controller/users.controller';
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
    HashService
} from '../auth/hash.service';
import {
    AuthService
} from 'src/auth/auth.service';
import {
    JwtStrategy
} from '../strategy/jwt.strategy';
import { CustomThrottlerGuard } from 'src/utilities/custom-throttler-guard';

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
        }),
    ],
    controllers: [UsersController],
    providers: [UserService, HashService, AuthService, JwtStrategy],
})
export class UserModule { }