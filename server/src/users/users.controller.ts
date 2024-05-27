import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDto } from './dto/users.dto';
import { PaidDto } from './dto/paid.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(200)
  @Get()
  async getAllUser(
    @Headers('secret') secret: string,
    @Headers('request') request: string,
    @Headers('login') login: string,
    @Headers('search') search: string,
  ) {
    if (secret == process.env.SECRET) {
      if (request == 'user') return this.usersService.getAllUsers();
      if (request == 'bought') return this.usersService.getAllBought();
      if (request == 'admin') return this.usersService.getAllAdmins();
      if (request == 'auth') return this.usersService.auth(login);
      if (request == 'search') return this.usersService.search(search);
      else throw new HttpException('You did not submit a valid request', HttpStatus.UNPROCESSABLE_ENTITY);
    } else {
      throw new HttpException('This is not open source data', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  @HttpCode(201)
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() dto: UsersDto, @Headers('secret') secret: string) {
    if (secret == process.env.SECRET) return this.usersService.create(dto);
    else throw new HttpException('This is not open source data', HttpStatus.UNPROCESSABLE_ENTITY);
  }

  @HttpCode(200)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UsersDto,
    @Headers('secret') secret: string,
  ) {
    if (secret == process.env.SECRET) return this.usersService.update(id, dto);
    else throw new HttpException('This is not open source data', HttpStatus.UNPROCESSABLE_ENTITY);
  }

  @HttpCode(200)
  @Patch(':id')
  async paid(
    @Param('id') id: string, 
    @Body() dto: PaidDto,
    @Headers('secret') secret: string
  ) {
    if (secret == process.env.SECRET) return this.usersService.paid(id, dto.status);
    else throw new HttpException('This is not open source data', HttpStatus.UNPROCESSABLE_ENTITY);
  }

  @HttpCode(200)
  @Delete(':id')
  async delete(@Param('id') id: string, @Headers('secret') secret: string) {
    if (secret == process.env.SECRET) return this.usersService.delete(id);
    else throw new HttpException('This is not open source data', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
