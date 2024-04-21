import {
    UserService
} from '../service/users.service';
import {
    BadRequestException,
    Injectable
} from '@nestjs/common';
import {
    JwtService
} from '@nestjs/jwt';
import {
    HashService
} from './hash.service';

@Injectable()
export class AuthService {
    constructor(private userService: UserService,
        private hashService: HashService,
        private jwtService: JwtService) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.getUserByEmail(email);
        if (user && (await this.hashService.comparePassword(pass, user.password))) {
            return user;
        }
        return null;
    }

    async login(user: any) {
        const payload = {
            email: user.email,
            sub: user.id
        };
        const User = await this.validateUser(user.email, user.password)

        if (User) {
            return {
                access_token: this.jwtService.sign(payload),
                name: User.name
            }
        } else {
            throw new BadRequestException({ error: 'Email/Password combination is incorrect!' })
        };
    }
}