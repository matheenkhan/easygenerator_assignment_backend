import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose'
import { UserModule } from './module/user.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';

// @Module({
//   imports: [UsersModule],
//   controllers: [AppController],
//   providers: [AppService],
// })
//'mongodb+srv://matheenkhan12:<h7kwc5xNTuYVRoR0>@
@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://cluster0.6cbo9qw.mongodb.net', {
      user: 'matheenkhan12',
      pass: 'nnqT0pKe7kGQmU4Y',
      dbName: 'LoginApplicationDB',
      w: 'majority',
      retryWrites: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 10000,
      limit: 10,
    }]),
    UserModule,
    AuthModule,
  ]
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('user');
  }
}
