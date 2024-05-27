import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { CourseModule } from 'src/course/course.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_CLUSTER}.rsgq9ij.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.MONGODB_CLUSTER}`),
    UsersModule,
    CourseModule,
  ],
})
export class AppModule {}
