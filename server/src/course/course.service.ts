import { Injectable } from '@nestjs/common';
import { Course, CourseDocument } from './course.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CourseDto } from './dto/course.dto';
import { Model } from 'mongoose';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  async get(type: string) {
    return this.courseModel.find({ type: type });
  }

  async getById(id: string) {
    const lesson = await this.courseModel.findOne({ _id: id });
    const branch = await this.courseModel.find({ type: lesson.type });
    return { lesson, branch };
  }

  async create(dto: CourseDto) {
    return this.courseModel.create(dto);
  }

  async update(id: string, dto: CourseDto) {
    return this.courseModel.findByIdAndUpdate(id, dto);
  }

  async delete(id: string) {
    return this.courseModel.findByIdAndDelete(id);
  }
}
