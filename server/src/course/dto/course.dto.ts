import { IsNotEmpty } from 'class-validator';

export class CourseDto {
  @IsNotEmpty()
  type: string;
  
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  video: string;

  @IsNotEmpty()
  videoName: string;

  @IsNotEmpty()
  photo: string;

  @IsNotEmpty()
  photoName: string;
}
