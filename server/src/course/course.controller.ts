import { Body, Controller, Delete, Get, Headers, HttpCode, HttpException, HttpStatus, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseDto } from './dto/course.dto';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @HttpCode(200)
  @Get()
  async get(@Headers('secret') secret: string, @Headers('type') type: string) {
    return this.courseService.get(type);
    if (secret == process.env.SECRET) return this.courseService.get(type);
    else throw new HttpException('This is not open source data', HttpStatus.UNPROCESSABLE_ENTITY);
  }

  @HttpCode(200)
  @Get(':id')
  async getById(@Param('id') id: string, @Headers('secret') secret: string) {
    return this.courseService.getById(id);
    if (secret == process.env.SECRET) return this.courseService.get(id);
    else throw new HttpException('This is not open source data', HttpStatus.UNPROCESSABLE_ENTITY);
  }

  @HttpCode(201)
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() dto: CourseDto, @Headers('secret') secret: string) {
    return this.courseService.create(dto);
    if (secret == process.env.SECRET) return this.courseService.create(dto);
    else throw new HttpException('This is not open source data', HttpStatus.UNPROCESSABLE_ENTITY);
  }

  @HttpCode(200)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: CourseDto,
    @Headers('secret') secret: string,
  ) {
    return this.courseService.update(id, dto);
    if (secret == process.env.SECRET) return this.courseService.update(id, dto);
    else throw new HttpException('This is not open source data', HttpStatus.UNPROCESSABLE_ENTITY);
  }

  @HttpCode(200)
  @Delete(':id')
  async delete(@Param('id') id: string, @Headers('secret') secret: string) {
    return this.courseService.delete(id);
    if (secret == process.env.SECRET) return this.courseService.delete(id);
    else throw new HttpException('This is not open source data', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
