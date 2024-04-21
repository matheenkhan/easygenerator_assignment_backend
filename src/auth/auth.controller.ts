import {
    AuthService
} from './auth.service';
import {
    Controller,
    Request,
    UseGuards,
    Post
} from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { ResponseInterceptor } from 'src/interceptor/response-interceptor';
import { CustomThrottlerGuard } from 'src/utilities/custom-throttler-guard';

@UseInterceptors(ResponseInterceptor)
@UseGuards(CustomThrottlerGuard)
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post()
    async login(@Request() req) {
        return this.authService.login(req.body);
    }
}