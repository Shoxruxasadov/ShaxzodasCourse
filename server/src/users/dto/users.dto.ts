import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UsersDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  family: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsNotEmpty()
  role: string;

  @IsNotEmpty()
  status: boolean;
}
