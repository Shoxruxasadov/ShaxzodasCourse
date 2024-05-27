import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  type: string;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  video: string;
  @Prop({ required: true })
  videoName: string;
  @Prop({ required: true })
  photo: string;
  @Prop({ required: true })
  photoName: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
