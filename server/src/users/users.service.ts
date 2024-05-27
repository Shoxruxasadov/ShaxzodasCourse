import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from './users.schema';
import { UsersDto } from './dto/users.dto';
import { Model } from 'mongoose';
import { PaidDto } from './dto/paid.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<UsersDocument>,
  ) {}

  async getAllUsers() {
    return this.usersModel.find({ status: false });
  }

  async getAllBought() {
    return this.usersModel.find({ status: true });
  }

  async getAllAdmins() {
    return this.usersModel.find({ role: 'admin' });
  }

  async auth(login: string) {
    const account = JSON.parse(login);
    const user = await this.usersModel.findOne({
      phone: account.phone,
      password: account.password,
    });

    if (!user) {
      throw new HttpException(
        'Foydalanuvchi mavjud emas',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return user
  }

  async search(search: string) {
    return this.usersModel.find({phone: { $regex: search, $options: 'i' }});
  }

  async create(dto: UsersDto): Promise<Users> {
    const user = await this.usersModel.findOne({ phone: dto.phone });

    if (user) {
      throw new HttpException(
        "Telefon allaqachon roʻyhatdan oʻtgan",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const createdUser = await this.usersModel.create(dto);
    return createdUser.save();
  }

  async update(id: string, dto: UsersDto) {
    await this.usersModel.findByIdAndUpdate(id, dto, { new: true });
    return 'Foydalanuvchi yangilandi';
  }

  async paid(id: string, status: boolean) {
    await this.usersModel.findByIdAndUpdate(
      { _id: id },
      { status: status },
      { upsert: true },
    );
    return "Toʻlov oʻzgartirildi";
  }

  async delete(id: string) {
    await this.usersModel.findByIdAndDelete(id);
    return "Foydalanuvchi oʻchirildi";
  }
}
