import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { Profile } from '../profile/models/profile.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async findById(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id, {
      include: [Profile],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({
      where: { username },
      include: [Profile],
    });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return user;
  }

  async getCurrentUserWithProfile(userId: number): Promise<User> {
    return this.findById(userId);
  }
}