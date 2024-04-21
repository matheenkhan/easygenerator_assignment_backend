import {
    Injectable,
    BadRequestException
} from '@nestjs/common';
import {
    CreateUserDto
} from '../model/createUser.dto';
import {
    InjectModel
} from '@nestjs/mongoose';
import {
    Model
} from 'mongoose';
import {
    HashService
} from '../auth/hash.service';
import {
    User,
    UserDocument
} from '../model/users.schema';

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private hashService: HashService) { }

    async getUserByEmail(email: string) {
        return this.userModel.findOne({
            email
        }).exec();
    }

    async checkUserExists(email: string) {
        // check if user exists
        const user = await this.getUserByEmail(email);
        if (user) {
            return true
        } else {
            return false;
        }
    }

    async registerUser(createUserDto: CreateUserDto) {
        // validate DTO

        const createUser = new this.userModel(createUserDto);
        // check if user exists
        const user = await this.getUserByEmail(createUser.email);
        if (user) {
            throw new BadRequestException({ objectOrError: 'Something went wrong! Please try again!' });
        }
        if (!createUser.password) {
            throw new BadRequestException({ error: 'Password is missing!' });
        }
        if (!createUser.email) {
            throw new BadRequestException({ error: 'Email is missing!' });
        }
        if (!createUser.name) {
            throw new BadRequestException({ error: 'Full name is missing!' });
        }
        // Hash Password
        createUser.password = await this.hashService.hashPassword(createUser.password);

        const User = await createUser.save();

        return User.name;
    }
}