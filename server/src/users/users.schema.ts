import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsersDocument = HydratedDocument<Users>;

@Schema({ timestamps: true })
export class Users {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  family: string;
  @Prop({ required: true, unique: true })
  phone: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true })
  role: string;
  @Prop({ required: true })
  status: boolean;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
